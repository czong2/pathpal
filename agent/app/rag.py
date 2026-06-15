import os
from typing import Any

from .embeddings import embed_text
from .llm import generate_answer
from .vector_store import JsonVectorStore

TOP_K = int(os.getenv("PATHPAL_TOP_K", "6"))


class RagService:
    def __init__(self) -> None:
        self.vector_store = JsonVectorStore()

    def chat(self, request: dict[str, Any]) -> dict[str, Any]:
        project = request["project"]
        files = request.get("files", [])
        message = request["message"].strip()

        chunks = self.vector_store.load_or_build(project["id"], files)
        if not chunks:
            return {
                "answer": "I could not extract readable text from the uploaded PDFs yet.",
                "citations": [],
            }

        question_embedding = embed_text(message)
        ranked_chunks = self.vector_store.search(chunks, question_embedding, TOP_K)
        answer = generate_answer(project, message, ranked_chunks)

        return {
            "answer": answer,
            "citations": [
                {
                    "fileId": chunk["fileId"],
                    "fileName": chunk["fileName"],
                    "page": chunk["page"],
                    "text": chunk["text"][:320],
                }
                for chunk in ranked_chunks
            ],
        }
