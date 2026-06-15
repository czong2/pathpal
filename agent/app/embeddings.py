from __future__ import annotations

import math
import os

import requests


OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
EMBED_MODEL = os.getenv("PATHPAL_EMBED_MODEL", "nomic-embed-text")


def embed_text(text: str) -> list[float]:
    response = requests.post(
        f"{OLLAMA_BASE_URL}/api/embed",
        json={"model": EMBED_MODEL, "input": text},
        timeout=120,
    )
    response.raise_for_status()
    embeddings = response.json().get("embeddings", [])
    if not embeddings:
        raise RuntimeError("Ollama returned no embeddings")
    return embeddings[0]


def cosine_similarity(left: list[float], right: list[float]) -> float:
    dot = sum(a * b for a, b in zip(left, right))
    left_norm = math.sqrt(sum(a * a for a in left))
    right_norm = math.sqrt(sum(b * b for b in right))
    if left_norm == 0 or right_norm == 0:
        return 0
    return dot / (left_norm * right_norm)
