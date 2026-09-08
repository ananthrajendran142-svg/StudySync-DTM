import math
import re
from typing import List, Dict, Any
import io

try:
    import pypdf
except ImportError:
    pypdf = None


class RAGEngine:
    """
    RAG (Retrieval-Augmented Generation) Engine.
    Handles document ingestion, text extraction, semantic chunking, 
    and vector similarity search over study materials.
    """
    def __init__(self):
        self.documents: List[Dict[str, Any]] = []  # List of uploaded doc info
        self.chunks: List[Dict[str, Any]] = []     # List of indexed chunks
        self.vocab: Dict[str, int] = {}            # Term frequency vocabulary

    def extract_text_from_pdf(self, file_bytes: bytes) -> str:
        """Extract text content from PDF bytes using pypdf."""
        if not pypdf:
            return ""
        try:
            reader = pypdf.PdfReader(io.BytesIO(file_bytes))
            text_pages = []
            for i, page in enumerate(reader.pages):
                page_text = page.extract_text() or ""
                if page_text.strip():
                    text_pages.append(f"[Page {i+1}]\n{page_text}")
            return "\n\n".join(text_pages)
        except Exception as e:
            print(f"Error reading PDF: {e}")
            return ""

    def tokenize(self, text: str) -> List[str]:
        """Normalize text into lowercase alphanumeric tokens."""
        return re.findall(r'\b[a-zA-Z0-9]{2,}\b', text.lower())

    def chunk_text(self, text: str, chunk_size: int = 250, overlap: int = 40) -> List[str]:
        """Split text into overlapping word chunks."""
        words = text.split()
        if not words:
            return []
        chunks = []
        i = 0
        while i < len(words):
            chunk = " ".join(words[i:i + chunk_size])
            chunks.append(chunk)
            i += (chunk_size - overlap)
        return chunks

    def add_document(self, filename: str, content_type: str, file_bytes: bytes) -> Dict[str, Any]:
        """Process and index a new document into the vector store."""
        if content_type == "application/pdf" or filename.endswith(".pdf"):
            raw_text = self.extract_text_from_pdf(file_bytes)
        else:
            try:
                raw_text = file_bytes.decode("utf-8", errors="ignore")
            except Exception:
                raw_text = ""

        if not raw_text.strip():
            raw_text = f"Document {filename} uploaded successfully."

        # Create chunks
        raw_chunks = self.chunk_text(raw_text)
        doc_id = len(self.documents) + 1
        
        indexed_chunks_count = 0
        for idx, chunk in enumerate(raw_chunks):
            tokens = self.tokenize(chunk)
            if not tokens:
                continue
            
            # Compute term frequency vector for chunk
            tf = {}
            for token in tokens:
                tf[token] = tf.get(token, 0) + 1
                if token not in self.vocab:
                    self.vocab[token] = len(self.vocab)

            chunk_obj = {
                "doc_id": doc_id,
                "filename": filename,
                "chunk_id": idx + 1,
                "text": chunk,
                "tokens": tokens,
                "tf": tf,
                "word_count": len(chunk.split())
            }
            self.chunks.append(chunk_obj)
            indexed_chunks_count += 1

        doc_info = {
            "id": doc_id,
            "filename": filename,
            "chunk_count": indexed_chunks_count,
            "char_count": len(raw_text),
            "preview": raw_text[:200] + ("..." if len(raw_text) > 200 else "")
        }
        self.documents.append(doc_info)
        return doc_info

    def _cosine_similarity(self, query_tf: Dict[str, int], chunk_tf: Dict[str, int]) -> float:
        """Compute cosine similarity between query TF and chunk TF vectors."""
        dot_product = 0.0
        query_mag = 0.0
        chunk_mag = 0.0

        for term, freq in query_tf.items():
            query_mag += freq * freq
            if term in chunk_tf:
                dot_product += freq * chunk_tf[term]

        for freq in chunk_tf.values():
            chunk_mag += freq * freq

        if query_mag == 0 or chunk_mag == 0:
            return 0.0

        return dot_product / (math.sqrt(query_mag) * math.sqrt(chunk_mag))

    def search(self, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        """Perform vector similarity search for relevant document chunks."""
        query_tokens = self.tokenize(query)
        if not query_tokens or not self.chunks:
            return []

        query_tf = {}
        for token in query_tokens:
            query_tf[token] = query_tf.get(token, 0) + 1

        results = []
        for chunk in self.chunks:
            score = self._cosine_similarity(query_tf, chunk["tf"])
            if score > 0.01:
                results.append({
                    "score": round(score, 4),
                    "filename": chunk["filename"],
                    "chunk_id": chunk["chunk_id"],
                    "text": chunk["text"]
                })

        # Sort by similarity score descending
        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:top_k]

    def get_stats(self) -> Dict[str, Any]:
        """Get summary metrics of indexed documents."""
        return {
            "total_documents": len(self.documents),
            "total_chunks": len(self.chunks),
            "vocabulary_size": len(self.vocab)
        }
