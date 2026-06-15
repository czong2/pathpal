from __future__ import annotations

from pathlib import Path
from typing import Any

from pypdf import PdfReader


class PdfReadError(Exception):
    pass


def extract_pdf_pages(file_path: Path) -> list[dict[str, Any]]:
    if not file_path.exists():
        raise FileNotFoundError(f"PDF not found: {file_path}")

    try:
        reader = PdfReader(str(file_path))
    except Exception as exception:
        raise PdfReadError(f"Could not open PDF: {file_path}") from exception

    pages: list[dict[str, Any]] = []
    for index, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""
        cleaned = clean_text(text)
        if cleaned:
            pages.append({"page": index, "text": cleaned})

    return pages


def clean_text(text: str) -> str:
    lines = [line.strip() for line in text.replace("\x00", " ").splitlines()]
    compact_lines = [line for line in lines if line]
    return "\n".join(compact_lines)
