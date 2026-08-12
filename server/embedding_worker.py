import time
import heapq
import threading
import logging
from google.cloud import exceptions as google_exceptions
from google.cloud.firestore_v1.vector import Vector

from firebase_config import db
from embedding_service import get_text_embedding, extract_tiptap_text

# Configures systematic logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] (%(threadName)s) %(message)s",
    handlers=[logging.StreamHandler()]
)

class EmbeddingJob:
    def __init__(self, note_id: str, owner_id: str, ready_at: float, retries: int = 0):
        self.note_id = note_id
        self.owner_id = owner_id
        self.ready_at = ready_at
        self.retries = retries
        self.cancelled = False 

    def __lt__(self, other):
        return self.ready_at < other.ready_at

# Thread synchronization structures
condition = threading.Condition()
heap = []
active_jobs = {}   # Tracks in-flight note_id -> EmbeddingJob states for debouncing

# System constants
COOLDOWN_SECONDS = 3.0
MAX_RETRIES = 3
INITIAL_BACKOFF_SECONDS = 2.0

# Tracks the last text update timestamp for notes
processed_text_timestamps = {}

def start_firestore_listener():
    """Listens to Firestore and schedules updates, gating via textLastUpdated."""
    notes_ref = db.collection("notes")
    
    def on_snapshot(col_snapshot, changes, read_time):
        try:
            for change in changes:
                if change.type.name in ["ADDED", "MODIFIED"]:
                    note_id = change.document.id
                    doc_data = change.document.to_dict()
                    
                    if not doc_data:
                        continue
                    
                    text_updated_at = doc_data.get("textLastUpdated", 0)
                    
                    # GATEKEEPER: Skip if the text hasn't been touched since our last run
                    if processed_text_timestamps.get(note_id) == text_updated_at:
                        logging.info(f"⏭️ Skipping Note {note_id}. Text is unchanged (Metadata update).")
                        continue
                        
                    owner_id = doc_data.get("ownerId")
                    new_ready_at = time.time() + COOLDOWN_SECONDS
                    
                    with condition:
                        if note_id in active_jobs:
                            active_jobs[note_id].cancelled = True 
                        
                        new_job = EmbeddingJob(note_id, owner_id, new_ready_at)
                        active_jobs[note_id] = new_job
                        
                        heapq.heappush(heap, new_job)
                        condition.notify_all()
        except Exception as e:
            logging.critical(f"Listener error: {e}", exc_info=True)
                    
    notes_ref.on_snapshot(on_snapshot)


def embedding_worker_thread():
    """Background worker loops processing ready tasks sequentially."""
    while True:
        with condition:
            # Block thread natively when there are no jobs in the heap
            while not heap:
                condition.wait()
            
            job = heap[0]
            # Discard stale jobs caused by subsequent keystrokes
            if job.cancelled:
                heapq.heappop(heap)
                continue

            # Sleep thread until job is ready
            wait_time = job.ready_at - time.time()
            if wait_time > 0:
                condition.wait(timeout=wait_time)
                continue
                
            heapq.heappop(heap)
            if active_jobs.get(job.note_id) == job:
                del active_jobs[job.note_id]
                
        # Detached from the heap condition lock
        try:
            process_note_embedding(job)
        except (google_exceptions.ServiceUnavailable, google_exceptions.DeadlineExceeded) as network_err:
            logging.warning(f"Transient cloud network error processing note {job.note_id}: {network_err}")
            handle_retry(job)
        except Exception as e:
            logging.error(f"Unrecoverable or structured logic exception processing note {job.note_id}: {e}", exc_info=True)
            handle_retry(job)

def handle_retry(job: EmbeddingJob):
    """Exponential backoff retry scheduling for transient failures."""
    if job.cancelled:
        return
        
    if job.retries >= MAX_RETRIES:
        logging.critical(f"❌ DEAD LETTER: Note {job.note_id} failed after {MAX_RETRIES} retries. Dropping job.")
        return
        
    job.retries += 1
    # Exponential delay: 2s -> 4s -> 8s
    backoff_delay = INITIAL_BACKOFF_SECONDS * (2 ** (job.retries - 1))
    job.ready_at = time.time() + backoff_delay
    
    logging.info(f"🔄 Rescheduling note {job.note_id} for retry #{job.retries} in {backoff_delay}s")
    
    with condition:

        if job.note_id not in active_jobs:
            heapq.heappush(heap, job)
            condition.notify_all()
            logging.info(f"🔄 Rescheduling note {job.note_id} for retry #{job.retries}")
        else:
            logging.info(f"⏭️ Skipping retry for note {job.note_id}. Superseded by a newer keystroke.")


def process_note_embedding(job: EmbeddingJob):
    """Executes atomic operations, handling content validation and schema synchronization."""
    note_ref = db.collection("notes").document(job.note_id)
    
    try:
        note_doc = note_ref.get()
    except Exception as e:
        logging.warning(f"Note {job.note_id} vanished or failed to fetch: {e}")
        return

    if not note_doc.exists:
        return
    
    note_data = note_doc.to_dict()
    if not note_data:
        return
    
    # Extract plain text content and combine with the title
    tiptap_content = note_data.get("content", {})
    plain_text = extract_tiptap_text(tiptap_content)
    combined_text = f"{note_data.get('title', '')} {plain_text}".strip()
    
    if not combined_text:
        logging.info(f"Bypassing embedding generation for empty Note: {job.note_id}")
        return
        
    # 384 dim embedding from combined_text
    vector_array = get_text_embedding(combined_text)
    
    embedding_ref = db.collection("noteEmbeddings").document(job.note_id)
    embedding_ref.set({
        "ownerId": job.owner_id,
        "noteId": job.note_id,
        "category": note_data.get("category", "personal"),
        "embedding": Vector(vector_array),
        "textLastUpdated": note_data.get("textLastUpdated", 0),
        "archived": note_data.get("archived", False),
        "deleted": note_data.get("deleted", False)
    }, merge=True)

    # Caching to avoid re run of model for non (title & content) updates
    processed_text_timestamps[job.note_id] = note_data.get("textLastUpdated", 0)

    logging.info(f"✅ Successfully computed and synchronized embedding for Note: {job.note_id}")

def initialize_background_workers():
    listener_thread = threading.Thread(target=start_firestore_listener, name="FirestoreListener", daemon=True)
    listener_thread.start()
    
    for i in range(2):
        worker = threading.Thread(target=embedding_worker_thread, name=f"VectorWorker-{i}", daemon=True)
        worker.start()
    logging.info("Background processing pipeline successfully initialized with 2 active worker instances.")
