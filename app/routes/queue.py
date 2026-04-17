from fastapi import APIRouter, Depends, status, HTTPException
from schemas.base import Session, MessageResponse
from schemas.linked_list import Value, ActionResponse
from services.queue import Queue
from utils import get_sessions

router = APIRouter(prefix="/queue", tags=["Queue"])


@router.post("/create", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def create(user: Session, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    queue = Queue()
    sessions[user.session_id]["queue"] = queue 
    return {"message": "Queue created successfully"}

@router.post("/enqueue", response_model=ActionResponse, status_code=status.HTTP_200_OK)
async def push(user: Value, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    queue = sessions[user.session_id]["queue"]
    response = queue.enqueue(user.value)
    return {"message": response, "elements": queue.traverse()}

@router.post("/dequeue", response_model=ActionResponse, status_code=status.HTTP_200_OK)
async def pop(user: Session, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    queue = sessions[user.session_id]["queue"]
    response = queue.dequeue()
    if response == "Queue underflow":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=response)
    return {"message": response, "elements": queue.traverse()}

@router.post("/peek", response_model=MessageResponse, status_code=status.HTTP_200_OK)
async def peek(user: Session, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    queue = sessions[user.session_id]["queue"]
    response = queue.peek()
    if response == "Queue is empty":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=response)
    return {"message": response}

@router.post("/is-empty", response_model=MessageResponse, status_code=status.HTTP_200_OK)
async def is_empty(user: Session, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    queue = sessions[user.session_id]["queue"]
    response = queue.is_empty()
    return {"message": f"Queue is {'empty' if response else 'not empty'}"}

@router.post("/length", response_model=MessageResponse, status_code=status.HTTP_200_OK)
async def length(user: Session, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    queue = sessions[user.session_id]["queue"]
    return {"message": f"Length of queue is {queue.length()}"}

@router.post("/traverse", response_model=ActionResponse, status_code=status.HTTP_200_OK)
async def traverse(user: Session, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    queue = sessions[user.session_id]["queue"]
    return {"message": "Elements in the queue", "elements": queue.traverse()}