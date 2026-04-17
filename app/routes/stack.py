from fastapi import APIRouter, Depends, status, HTTPException
from schemas.base import Session, MessageResponse
from schemas.linked_list import Value, ActionResponse
from services.stack import Stack
from utils import get_sessions

router = APIRouter(prefix="/stack", tags=["Stack"])


@router.post("/create", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def create(user: Session, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    stack = Stack()
    sessions[user.session_id]["stack"] = stack 
    return {"message": "Stack created successfully"}

@router.post("/push", response_model=ActionResponse, status_code=status.HTTP_200_OK)
async def push(user: Value, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    stack = sessions[user.session_id]["stack"]
    response = stack.push(user.value)
    return {"message": response, "elements": stack.traverse()}

@router.post("/pop", response_model=ActionResponse, status_code=status.HTTP_200_OK)
async def pop(user: Session, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    stack = sessions[user.session_id]["stack"]
    response = stack.pop()
    if response == "Stack underflow":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=response)
    return {"message": response, "elements": stack.traverse()}

@router.post("/peek", response_model=MessageResponse, status_code=status.HTTP_200_OK)
async def peek(user: Session, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    stack = sessions[user.session_id]["stack"]
    response = stack.peek()
    if response == "Stack is empty":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=response)
    return {"message": response}

@router.post("/is-empty", response_model=MessageResponse, status_code=status.HTTP_200_OK)
async def is_empty(user: Session, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    stack = sessions[user.session_id]["stack"]
    response = stack.is_empty()
    return {"message": f"Stack is {'empty' if response else 'not empty'}"}

@router.post("/length", response_model=MessageResponse, status_code=status.HTTP_200_OK)
async def length(user: Session, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    stack = sessions[user.session_id]["stack"]
    return {"message": f"Length of stack is {stack.length()}"}

@router.post("/traverse", response_model=ActionResponse, status_code=status.HTTP_200_OK)
async def traverse(user: Session, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    stack = sessions[user.session_id]["stack"]
    return {"message": "Elements in the stack", "elements": stack.traverse()}