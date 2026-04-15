from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from routes.singly_linked_list import router as sll_router
from routes.doubly_linked_list import router as dll_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Creating sessions dictionary")
    app.state.sessions = dict()
    yield
    del app.state.sessions
    print("Sessions dictionary deleted")

app = FastAPI(lifespan=lifespan)
app.add_middleware( 
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sll_router)
app.include_router(dll_router)