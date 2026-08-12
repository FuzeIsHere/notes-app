import os
import queue
import threading
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware 
from pydantic import BaseModel
from google.cloud.firestore_v1.vector import Vector
from google.cloud.firestore_v1.base_query import FieldFilter
from google.cloud.firestore_v1.base_vector_query import DistanceMeasure


from firebase_config import db
from embedding_service import get_text_embedding
from embedding_worker import initialize_background_workers
from auth_middleware import get_current_user

import traceback

@asynccontextmanager
async def lifespan(app: FastAPI):
    initialize_background_workers()
    yield

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # Allows requests from React app
    allow_credentials=True,           # Allows cookies or authorization headers
    allow_methods=["*"],              # Allows all HTTP methods (POST, GET, OPTIONS, etc.)
    allow_headers=["*"],              # Allows all custom headers (like Authorization Bearer token)
)

# FIFO queue for queuing multiple search requests
search_queue = queue.Queue()

# Request validation schema
class SearchRequest(BaseModel):
    query: str
    category: str  # "all", "personal", "work", "ideas"
    scope: str     # "active", "trash"

def process_search_from_queue(query_text: str, user_id: str, target_category: str, scope: str, result_container: list, exception_container: list, event: threading.Event):
    """Executes single-threaded vector inference calculations safely."""
    try:
        query_vector = get_text_embedding(query_text)
        embeddings_ref = db.collection("noteEmbeddings")
        
        # User isolation
        query = embeddings_ref.where(filter=FieldFilter("ownerId", "==", user_id))

        # 1. SCOPE GATEKEEPER
        if scope == "trash":
            query = query.where(filter=FieldFilter("deleted", "==", True))
        elif scope == "archive":
            query = query.where(filter=FieldFilter("archived", "==", True)).where(filter=FieldFilter("deleted", "==", False))
        else:
            query = query.where(filter=FieldFilter("deleted", "==", False)).where(filter=FieldFilter("archived", "==", False))

        # 2. CATEGORY GATEKEEPER
        if target_category.strip().lower() != "all":
            query = query.where(filter=FieldFilter("category", "==", target_category))


        # 3. VECTOR EXTREMA SEARCH
        query = query.find_nearest(
            vector_field="embedding",
            query_vector=Vector(query_vector),
            limit=10,
            distance_measure=DistanceMeasure.COSINE 
        )
        
        docs = query.stream()
        note_ids = [doc.to_dict().get("noteId") for doc in docs if doc.to_dict().get("noteId")]
        result_container.extend(note_ids)
    except Exception as e:
        exception_container.append(e)
    finally:
        event.set()

def search_queue_handler():
    """Worker handles execution payloads through the FIFO pipeline stream sequentially."""
    while True:
        # Blocks thread until an item enters the pipeline queue
        query_text, user_id, target_category, scope, result_container, exception_container, event = search_queue.get()
        process_search_from_queue(query_text, user_id, target_category, scope, result_container, exception_container, event)
        search_queue.task_done()

threading.Thread(target=search_queue_handler, name="SearchQueueEngine", daemon=True).start()


@app.post("/api/search")
async def semantic_search(request: SearchRequest, verified_uid: str = Depends(get_current_user)):
    if not request.query or not request.category or not request.scope:
        raise HTTPException(status_code=400, detail="Missing configuration arguments.")
        
    event = threading.Event()
    note_ids_output = []
    exception_container = []
    
    # Enqueue extraction parameters into task processing queue
    search_queue.put((
        request.query, 
        verified_uid, 
        request.category, 
        request.scope, 
        note_ids_output, 
        exception_container, 
        event
    ))
    
    event.wait()
    
    if exception_container:
        # Prints the exact traceback stack straight into terminal log
        print("\n❌ --- DETAILED SEARCH BACKGROUND CRASH LOG --- ❌")
        traceback.print_exception(type(exception_container[0]), exception_container[0], exception_container[0].__traceback__)
        print("" + "="*50 + "\n")
        
        raise HTTPException(status_code=500, detail="Internal index computation error.")
        
    return {"success": True, "noteIds": note_ids_output}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=5000, reload=False)  # Set reload to false for singular clear load logs