# Data Structures Visualizer

A full-stack web application for visualizing and interacting with fundamental data structures, built with FastAPI (Python) for the backend and Next.js (React/TypeScript) for the frontend.

---

## Features

- **Data Structures Implemented (Backend):**
  - Singly Linked List
  - Doubly Linked List
  - Stack
  - Queue
  - Binary Search Tree
  - Heap (Max Heap and Min Heap)
  - Trie
  - Graph (Undirected, adjacency list)

- **API Endpoints:**
  - Create, add, remove, and query nodes/edges for all structures
  - Traversal operations (BFS, DFS for Graph, in-order/pre/post-order for BST, etc.)
  - Session-based state management

- **Frontend (Next.js):**
  - Interactive UI for each data structure
  - Visualizations for structures (SVG-based for Graphs, Trees, etc.)
  - Controls for adding/removing/searching elements
  - Real-time updates and error handling

---

## Project Structure

```
ds-app/
├── app/                # FastAPI backend
│   ├── main.py         # FastAPI app entrypoint
│   ├── utils.py        # Session and utility functions
│   ├── routes/         # API route definitions for each structure
│   ├── schemas/        # Pydantic models for request/response
│   └── services/       # Core data structure logic
├── app_ui/             # Next.js frontend
│   ├── app/            # Next.js app directory (pages, components)
│   ├── public/         # Static assets
│   ├── package.json    # Frontend dependencies
│   └── ...             # Config, styles, etc.
├── pyproject.toml      # Python dependencies
└── README.md           # Project documentation
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone git@github.com:Mithil-Dudam/Data-Structures.git
cd Data-Structures
```

### 2. Running with Docker

1. **Build and start all services:**
   ```bash
   docker compose up --build
   ```

2. **Access the app:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8000](http://localhost:8000)
   - API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

3. **Stop the services:**
   ```bash
   docker compose down
   ```

---

## Usage

- Select a data structure from the UI.
- Use the provided controls to add, remove, or search for elements.
- Visual feedback and SVG diagrams update in real time.
- Graph operations include adding/removing nodes/edges, BFS/DFS traversal, and neighbor queries.

---

## Backend API Overview

- **Session Management:**  
  Each user interaction is tied to a session (UUID). Sessions are auto-cleaned after inactivity.

- **Endpoints:**  
  - `/graph/add/node`, `/graph/remove/node`, `/graph/add/edge`, `/graph/remove/edge`, `/graph/neighbours`, `/graph/bfs`, `/graph/dfs`, etc.
  - Similar endpoints for other structures.

- **Models:**  
  - All requests and responses use Pydantic models for validation.

---

## Frontend Overview

- **Pages:**  
  - Each data structure has its own route and interactive playground.
  - Example: `/graph/play` for graph operations and visualization.

- **Visualization:**  
  - Graphs: Nodes arranged in a circle, edges as SVG lines.
  - Trees: Hierarchical SVG layouts.
  - Lists/Stacks/Queues: Linear visualizations.

---

## Development

- **Backend:** Python 3.12+, FastAPI, Uvicorn
- **Frontend:** Next.js 16+, React 19+, TypeScript, TailwindCSS
