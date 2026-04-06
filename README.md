
# Guess The Number - Fullstack App

>A modern, multi-user "Guess The Number" game with a FastAPI backend and Next.js frontend. Fully dockerized for easy local development and deployment.

---

## Project Structure

```
├── app/           # FastAPI backend
│   ├── main.py
│   ├── routes/
│   ├── schemas/
│   ├── Dockerfile
│   └── .dockerignore
├── app_ui/        # Next.js frontend
│   ├── app/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── .gitignore
├── docker-compose.yaml
├── README.md
└── .gitignore
```

---

## Features

- Multi-user support (session-based)
- FastAPI backend (Python 3.12)
- Next.js 14 frontend (Node 20)
- Docker & Docker Compose for orchestration
- Clean .gitignore/.dockerignore for both backend and frontend
- Production-ready, easy local development

---

## Quick Start (Docker Compose)

1. **Clone the repo:**
	```bash
	git clone https://github.com/Mithil-Dudam/Number-Guessing-Game.git
	cd Number-Guessing-Game
	```
2. **Build and run containers:**
	```bash
	docker compose up --build
	```
3. **Access the app:**
	- Frontend: http://localhost:3000
	- Backend API: http://localhost:8000/docs

---

## License

MIT
