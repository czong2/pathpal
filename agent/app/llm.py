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
    deadline = project.get("deadline") or "No deadline"
    description = project.get("description") or "No extra project notes"
    prompt = dedent(
        f"""
        You are PathPal, a practical learning-planning agent.
        Use the provided PDF context to answer the user. If the context is not enough, say what is missing.
        Prefer concrete plans, milestones, and next actions. Cite PDF pages inline when useful.

        Project:
        Title: {project["title"]}
        Deadline: {deadline}
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
                    "content": "You turn uploaded study/work PDFs into grounded, concise plans.",
                },
                {"role": "user", "content": prompt},
            ],
        },
        timeout=180,
    )
    response.raise_for_status()
    return response.json()["message"]["content"].strip()
