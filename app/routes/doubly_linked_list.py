from fastapi import APIRouter, HTTPException, status, Depends
from schemas.base import Session, MessageResponse
from schemas.linked_list import ActionResponse, Insert, Value, Index
from services.doubly_linked_list import DoublyLinkedList
from utils import get_sessions

router = APIRouter(prefix="/dll", tags=["Doubly Linked List"])
 
@router.post("/create", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def create(user:Session, sessions=Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    dll = DoublyLinkedList()
    sessions[user.session_id]["dll"] = dll
    return {"message": "Doubly Linked List created successfully"}

@router.post("/insert", response_model=ActionResponse, status_code=status.HTTP_200_OK)
async def insert(user: Insert, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    dll = sessions[user.session_id]["dll"]
    if user.index is not None:
        response = dll.insert(user.value, user.index)
    else:
        response = dll.insert(user.value)
    if response == "Index out of bounds":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=response)
    return {"message": response, "elements": dll.traverse()}

@router.post("/delete", response_model=ActionResponse, status_code=status.HTTP_200_OK)
async def delete(user: Value, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    dll = sessions[user.session_id]["dll"]
    response = dll.delete(user.value)
    if response in ["List is empty", f"{user.value} not in list"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=response)
    return {"message": response, "elements": dll.traverse()}

@router.post("/delete-index", response_model=ActionResponse, status_code=status.HTTP_200_OK)
async def delete_index(user: Index, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    dll = sessions[user.session_id]["dll"]
    response = dll.delete_index(user.index)
    if response in ["List is empty", "Index out of bounds"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=response)
    return {"message": response, "elements": dll.traverse()}

@router.post("/search", response_model=MessageResponse, status_code=status.HTTP_200_OK)
async def search(user: Value, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    dll = sessions[user.session_id]["dll"]
    response = dll.search(user.value)
    if response == "List is empty":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=response)
    return {"message": response}

@router.post("/length", response_model=MessageResponse, status_code=status.HTTP_200_OK)
async def length(user: Session, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    dll = sessions[user.session_id]["dll"]
    return {"message": f"Length of list is {dll.length()}"}

@router.post("/traverse", response_model=ActionResponse, status_code=status.HTTP_200_OK)
async def traverse(user: Session, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    dll = sessions[user.session_id]["dll"]
    return {"message": "List of elements", "elements": dll.traverse()}