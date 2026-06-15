from __future__ import annotations

import os
from textwrap import dedent
from typing import Any

import requests


OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
CHAT_MODEL = os.getenv("PATHPAL_CHAT_MODEL", "qwen2.5:7b")


def generate_answer(project: dict[str, Any], message: str, chunks: list[dict[str, Any]]) -> str:
    context = "\n\n".join(
        f"[{index}. {chunk['fileName']} page {chunk['page']}]\n{chunk['text']}"
        for index, chunk in enumerate(chunks, start=1)
    )
    description = project.get("description") or "No project notes"
    prompt = dedent(
        f"""
        You are PathPal, a PDF question-answering assistant.
        Answer the user's question using only the provided PDF context.
        If the answer is not present in the context, say you could not find it in the uploaded PDFs.
        Do not invent chapters, page ranges, deadlines, reading plans, or action steps.
        Keep the answer concise and cite PDF pages inline when useful.

        Project:
        Title: {project["title"]}
        Notes: {description}

        PDF context:
        {context}

        User message:
        {message}
        """
    ).strip()

    response = requests.post(
        f"{OLLAMA_BASE_URL}/api/chat",
        json={
            "model": CHAT_MODEL,
            "stream": False,
            "messages": [
                {
                    "role": "system",
                    "content": "You answer questions about uploaded PDFs using only retrieved context.",
                },
                {"role": "user", "content": prompt},
            ],
        },
        timeout=180,
    )
    response.raise_for_status()
    return response.json()["message"]["content"].strip()
