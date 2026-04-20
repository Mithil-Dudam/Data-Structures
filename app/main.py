import time
import uuid
import threading
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from routes.singly_linked_list import router as sll_router
from routes.doubly_linked_list import router as dll_router
from routes.stack import router as stack_router
from routes.queue import router as queue_router
from routes.binary_search_tree import router as bst_router
from routes.heap import router as heap_router
from routes.trie import router as trie_router
from routes.graph import router as graph_router
from utils import cleanup_sessions

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Creating sessions dictionary")
    app.state.sessions = dict()
    app.state.lock = threading.RLock()
    thread = threading.Thread(target=cleanup_sessions, args=(app.state.sessions, app.state.lock), daemon=True)
    thread.start()
    yield
    del app.state.sessions
    print("Sessions dictionary deleted")

app = FastAPI(lifespan=lifespan)

app.add_middleware( 
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sll_router)
app.include_router(dll_router)
app.include_router(stack_router)
app.include_router(queue_router)
app.include_router(bst_router)
app.include_router(heap_router)
app.include_router(trie_router)
app.include_router(graph_router)

@app.get("/create-session", status_code=status.HTTP_201_CREATED)
async def create_session():
    session_id = str(uuid.uuid4())
    app.state.sessions[session_id] = dict()
    with app.state.lock:
        app.state.sessions[session_id]["session_start"] = time.time()
    return {"session_id": session_id}