# PathPal

PathPal is a document question-answering app for uploaded PDFs. It has a React frontend, a Spring Boot backend, and a local FastAPI agent that reads PDFs, retrieves relevant chunks, and asks an Ollama model for grounded answers.

## What It Does

- Sign in with GitHub.
- Pass a Cloudflare Turnstile check.
- Create projects with a title, icon, color, optional deadline, optional notes, and PDF uploads.
- Chat with a project-specific PDF assistant.
- Store chat history and citations.
- Keep the sidebar sorted by most recent chat.

## Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, lucide-react
- Backend: Spring Boot, Spring Data JPA, PostgreSQL
- Agent: FastAPI, pypdf, Ollama
- Auth: GitHub OAuth
- Human check: Cloudflare Turnstile

## Project Layout

```text
frontend/   React app
backend/    Spring Boot API, auth, persistence, file storage
agent/      FastAPI PDF/RAG service
docs/       Project notes and screenshots
```

## Requirements

- Node.js and npm
- Java 17+
- Python 3.11+
- PostgreSQL
- Ollama
- A GitHub OAuth app
- A Cloudflare Turnstile site key and secret

The default local URLs are:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`
- Agent: `http://localhost:8001`
- Ollama: `http://localhost:11434`

## Environment

Backend environment variables:

```text
DB_URL=jdbc:postgresql://localhost:5432/pathpal
DB_USERNAME=postgres
DB_PASSWORD=
FRONTEND_URL=http://localhost:5173
AGENT_BASE_URL=http://localhost:8001
PATHPAL_STORAGE_DIR=./data
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
GITHUB_REDIRECT_URI=http://localhost:8080/api/auth/github/callback
TURNSTILE_SECRET_KEY=...
```

Frontend environment variable:

```text
VITE_TURNSTILE_SITE_KEY=...
```

Agent environment variables:

```text
OLLAMA_BASE_URL=http://localhost:11434
PATHPAL_CHAT_MODEL=qwen2.5:7b
PATHPAL_EMBED_MODEL=nomic-embed-text
PATHPAL_TOP_K=6
PATHPAL_AGENT_INDEX_DIR=./agent/data/indexes
```

Pull the default Ollama models:

```powershell
ollama pull qwen2.5:7b
ollama pull nomic-embed-text
```

## Run Locally

Start PostgreSQL and create a `pathpal` database.

Start the agent:

```powershell
cd agent
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

Start the backend:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Start the frontend:

```powershell
cd frontend
npm install
npm.cmd run dev
```

Open `http://localhost:5173`.

## Build And Check

Frontend:

```powershell
cd frontend
npm.cmd run build
```

Backend compile:

```powershell
cd backend
.\mvnw.cmd -DskipTests compile
```

Backend tests require a configured test database. If no test database is configured, use the compile command above for a quick backend check.

## Notes

- Uploaded PDFs are stored under `PATHPAL_STORAGE_DIR`.
- Agent vector indexes are stored under `PATHPAL_AGENT_INDEX_DIR`.
