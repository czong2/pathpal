from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any

from .chunker import split_text
from .embeddings import cosine_similarity, embed_text
from .pdf_reader import extract_pdf_pages


AGENT_ROOT = Path(__file__).resolve().parents[1]
INDEX_DIR = Path(os.getenv("PATHPAL_AGENT_INDEX_DIR", str(AGENT_ROOT / "data" / "indexes")))


class JsonVectorStore:
    def load_or_build(self, project_id: int, files: list[dict[str, Any]]) -> list[dict[str, Any]]:
        INDEX_DIR.mkdir(parents=True, exist_ok=True)
        index_path = INDEX_DIR / f"{project_id}.json"
        signature = file_signature(files)

        if index_path.exists():
            with index_path.open("r", encoding="utf-8") as handle:
                payload = json.load(handle)
            if payload.get("signature") == signature:
                return payload.get("chunks", [])

        chunks = build_chunks(files)
        for chunk in chunks:
            chunk["embedding"] = embed_text(chunk["text"])

        with index_path.open("w", encoding="utf-8") as handle:
            json.dump({"signature": signature, "chunks": chunks}, handle, ensure_ascii=False)

        return chunks

    def search(self, chunks: list[dict[str, Any]], query_embedding: list[float], limit: int) -> list[dict[str, Any]]:
        return sorted(
            chunks,
            key=lambda chunk: cosine_similarity(query_embedding, chunk["embedding"]),
            reverse=True,
        )[:limit]


def build_chunks(files: list[dict[str, Any]]) -> list[dict[str, Any]]:
    chunks: list[dict[str, Any]] = []
    for file in files:
        pages = extract_pdf_pages(Path(file["path"]))
        for page in pages:
            for index, text in enumerate(split_text(page["text"])):
                chunks.append(
                    {
                        "fileId": file["fileId"],
                        "fileName": file["name"],
                        "page": page["page"],
                        "chunkIndex": index,
                        "text": text,
                    }
                )
    return chunks


def file_signature(files: list[dict[str, Any]]) -> list[dict[str, Any]]:
    signature = []
    for file in files:
        path = Path(file["path"])
        stat = path.stat()
        signature.append(
            {
                "fileId": file["fileId"],
                "path": str(path),
                "size": stat.st_size,
                "modified": stat.st_mtime,
            }
        )
    return signature
