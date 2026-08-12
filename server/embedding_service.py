import logging
from sentence_transformers import SentenceTransformer

# Hardware check
try:
    import torch

    if torch.cuda.is_available():
        device_target = "cuda"
        logging.info(f"💫 CUDA Cores detected! GPU Acceleration Active: {torch.cuda.get_device_name(0)}")
    else:
        device_target = "cpu"
        logging.info("💻 No CUDA Cores found. Falling back to local CPU execution mode.")

except ImportError:

    device_target = "cpu"
    logging.info("⚠️ PyTorch/Torch library not found. Defaulting strictly to CPU processing.")


model = SentenceTransformer('all-MiniLM-L6-v2', device=device_target)

def get_text_embedding(text: str) -> list:
    if not text:
        return []
    
    embedding = model.encode(text, convert_to_numpy=True, show_progress_bar=False)
    return embedding.tolist()

def extract_tiptap_text(node) -> str:
    """Recursively extracts plain text from TipTap JSON structures."""
    if not node or not isinstance(node, dict):
        return ""
    
    text_pieces = []
    if node.get("type") == "text" and "text" in node:
        text_pieces.append(node["text"])
        
    if "content" in node and isinstance(node["content"], list):
        for child in node["content"]:
            text_pieces.append(extract_tiptap_text(child))
            
    return " ".join([p for p in text_pieces if p.strip()])
