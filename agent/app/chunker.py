from __future__ import annotations

import os


CHUNK_SIZE = int(os.getenv("PATHPAL_CHUNK_SIZE", "1800"))
CHUNK_OVERLAP = int(os.getenv("PATHPAL_CHUNK_OVERLAP", "250"))


def split_text(text: str) -> list[str]:
    if len(text) <= CHUNK_SIZE:
        return [text]

    chunks: list[str] = []
    start = 0
    while start < len(text):
        end = min(len(text), start + CHUNK_SIZE)
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        if end == len(text):
            break
        start = max(0, end - CHUNK_OVERLAP)
    return chunks
