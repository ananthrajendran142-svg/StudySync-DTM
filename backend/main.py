import os
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from rag_engine import RAGEngine
from nlm_service import NLMService

app = FastAPI(
    title="Self-Proctored Learning Excellence Backend",
    description="Python FastAPI backend powering RAG document retrieval, NLM study coaching, and REST APIs.",
    version="1.0.0"
)

# Enable CORS for React frontend (Vite default port 5173 / 3000 / localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global instances
rag_engine = RAGEngine()
nlm_service = NLMService()

# Automatically index the workspace PDF if available
def auto_index_workspace_pdf():
    pdf_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "Self-Proctored Learning Excellence Overview (3) (1).pdf"))
    if os.path.exists(pdf_path):
        try:
            with open(pdf_path, "rb") as f:
                pdf_bytes = f.read()
            rag_engine.add_document(
                filename="Self-Proctored Learning Excellence Overview (3) (1).pdf",
                content_type="application/pdf",
                file_bytes=pdf_bytes
            )
            print(f"Auto-indexed workspace PDF: {os.path.basename(pdf_path)}")
        except Exception as e:
            print(f"Auto indexing PDF failed: {e}")

auto_index_workspace_pdf()

# Request Models
class RAGQueryRequest(BaseModel):
    query: str
    top_k: Optional[int] = 3
    api_key: Optional[str] = None

class ProctorCoachingRequest(BaseModel):
    distraction_count: int
    focus_minutes: int
    streak: int

class QuizRequest(BaseModel):
    topic: str

@app.get("/api/health")
def health_check():
    """Service health check endpoint."""
    stats = rag_engine.get_stats()
    return {
        "status": "online",
        "service": "Self-Proctored Learning API",
        "rag_stats": stats
    }

@app.post("/api/upload-document")
async def upload_document(file: UploadFile = File(...)):
    """Upload PDF or text study materials for RAG vector indexation."""
    try:
        file_bytes = await file.read()
        doc_info = rag_engine.add_document(
            filename=file.filename,
            content_type=file.content_type or "text/plain",
            file_bytes=file_bytes
        )
        return {
            "success": True,
            "message": f"Successfully indexed {file.filename} into RAG Knowledge Base.",
            "document": doc_info,
            "rag_stats": rag_engine.get_stats()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")

@app.get("/api/documents")
def get_documents():
    """Retrieve list of all indexed documents in the RAG store."""
    return {
        "documents": rag_engine.documents,
        "stats": rag_engine.get_stats()
    }

@app.post("/api/rag-chat")
def rag_chat(request: RAGQueryRequest):
    """Retrieve relevant study chunks and generate NLM response."""
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query string cannot be empty.")

    user_docs = [d for d in rag_engine.documents if d["filename"] != "Self-Proctored Learning Excellence Overview (3) (1).pdf"]
    if user_docs:
        latest_user_doc_id = user_docs[-1]["id"]
        relevant_chunks = [c for c in rag_engine.chunks if c["doc_id"] == latest_user_doc_id][:3]
    else:
        relevant_chunks = rag_engine.search(request.query, top_k=request.top_k)

    nlm_response = nlm_service.generate_rag_answer(
        query=request.query,
        context_chunks=relevant_chunks,
        custom_api_key=request.api_key
    )

    return {
        "query": request.query,
        "answer": nlm_response["answer"],
        "provider": nlm_response["provider"],
        "retrieved_chunks": relevant_chunks,
        "rag_stats": rag_engine.get_stats()
    }

@app.post("/api/proctor-coaching")
def get_proctor_coaching(request: ProctorCoachingRequest):
    """Generate personalized NLM coaching based on proctoring & distraction metrics."""
    coaching = nlm_service.generate_proctor_coaching(
        distraction_count=request.distraction_count,
        focus_minutes=request.focus_minutes,
        streak=request.streak
    )
    return coaching

@app.post("/api/generate-quiz")
def generate_quiz(request: QuizRequest):
    """Generate an interactive quiz dynamically extracted from user-uploaded PDF study materials."""
    relevant_chunks = []
    
    # PRIORITIZE ANY USER-UPLOADED PDF FILE OVER DEFAULT OVERVIEW SLIDES
    user_docs = [d for d in rag_engine.documents if d["filename"] != "Self-Proctored Learning Excellence Overview (3) (1).pdf"]
    
    if user_docs:
        # Get chunks from the latest user-uploaded PDF file (e.g., Navigating Linux (1).pdf)
        latest_user_doc_id = user_docs[-1]["id"]
        relevant_chunks = [c for c in rag_engine.chunks if c["doc_id"] == latest_user_doc_id][:5]

    if not relevant_chunks:
        relevant_chunks = rag_engine.search(request.topic, top_k=3)
        if not relevant_chunks and rag_engine.chunks:
            latest_doc_id = rag_engine.documents[-1]["id"] if rag_engine.documents else None
            relevant_chunks = [c for c in rag_engine.chunks if c["doc_id"] == latest_doc_id][:3] if latest_doc_id else rag_engine.chunks[:3]

    quiz_data = nlm_service.generate_quiz(topic=request.topic, context_chunks=relevant_chunks)
    return {
        "topic": request.topic,
        "quiz": quiz_data
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
