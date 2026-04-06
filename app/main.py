from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import guess_the_number
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Server is starting up!")
    app.state.sessions = dict()
    yield
    print("Server is shutting down!")
    del app.state.sessions

app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(guess_the_number.router)