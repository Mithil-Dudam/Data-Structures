from fastapi import APIRouter, Depends, status, HTTPException
from schemas.linked_list import Session, MessageResponse
from schemas.tree import IntValue, HeapInsertResponse, HeapExtractResponse, Heapify
from services.heap import Heap
from utils import get_sessions

router = APIRouter(prefix="/heap", tags=["Heap"])


@router.post("/create", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def create(user: Session, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    heap = Heap()
    sessions[user.session_id]["heap"] = heap
    return {"message": "Heap created successfully"}

@router.post("/insert", response_model=HeapInsertResponse, status_code=status.HTTP_200_OK)
async def insert(user: IntValue, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    heap = sessions[user.session_id]["heap"]
    response = heap.insert(user.value)
    return {"message": response, "max_heap": heap.max_heap, "min_heap": heap.min_heap}

@router.post("/extract", response_model=HeapExtractResponse, status_code=status.HTTP_200_OK)
async def extract(user: Session, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    heap = sessions[user.session_id]["heap"]
    response = heap.extract()
    if response == "Heap is empty":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=response)
    return {"max_element": response[0], "min_element": response[1], "max_heap": heap.max_heap, "min_heap": heap.min_heap}

@router.post("/heapify", response_model=HeapInsertResponse, status_code=status.HTTP_200_OK)
async def heapify(user: Heapify, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    heap = sessions[user.session_id]["heap"]
    response = heap.heapify(user.elements)
    return {"max_heap": response[0], "min_heap": response[1]}

@router.post("/peek", response_model=HeapExtractResponse, status_code=status.HTTP_200_OK)
async def peek(user: Session, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    heap = sessions[user.session_id]["heap"]
    response = heap.peek()
    return {"max_element": response[0], "min_element": response[1]}
