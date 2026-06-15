from __future__ import annotations

import requests
from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from .pdf_reader import PdfReadError
from .rag import RagService


class AgentFile(BaseModel):
    fileId: int
    name: str
    path: str


class AgentProject(BaseModel):
    id: int
    title: str
    description: str | None = None


class ChatRequest(BaseModel):
    project: AgentProject
    files: list[AgentFile] = Field(default_factory=list)
    message: str


class Citation(BaseModel):
    fileId: int
    fileName: str
    page: int
    text: str


class ChatResponse(BaseModel):
    answer: str
    citations: list[Citation]


app = FastAPI(title="PathPal Agent", version="0.1.0")
rag = RagService()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exception: RequestValidationError) -> JSONResponse:
    body = await request.body()
    print(
        "Request validation failed: "
        f"{exception.errors()} "
        f"headers={dict(request.headers)} "
        f"bodyLength={len(body)} "
        f"body={body.decode('utf-8', errors='replace')}"
    )
    return JSONResponse(status_code=422, content={"detail": exception.errors()})


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message is required.")

    try:
        result = rag.chat(request.model_dump())
    except FileNotFoundError as exception:
        raise HTTPException(status_code=400, detail=str(exception)) from exception
    except PdfReadError as exception:
        raise HTTPException(status_code=400, detail=str(exception)) from exception
    except requests.RequestException as exception:
        raise HTTPException(status_code=502, detail=f"Ollama request failed: {exception}") from exception

    return ChatResponse(**result)
