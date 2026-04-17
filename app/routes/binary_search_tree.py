from fastapi import APIRouter, Depends, status, HTTPException
from schemas.base import Session, MessageResponse
from schemas.linked_list import ActionResponse
from schemas.tree import IntValue, NestedStructure
from services.binary_search_tree import BinarySearchTree
from utils import get_sessions

router = APIRouter(prefix="/bst", tags=["Binary Search Tree"])


@router.post("/create", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def create(user: Session, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    bst = BinarySearchTree()
    sessions[user.session_id]["bst"] = bst
    return {"message": "Binary Search Tree created successfully"}

@router.post("/insert", response_model=NestedStructure, status_code=status.HTTP_200_OK)
async def insert(user: IntValue, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    bst = sessions[user.session_id]["bst"]
    response = bst.insert(user.value)
    return {"message": response, "elements": bst.bst_to_dict(bst.root)}

@router.post("/delete", response_model=NestedStructure, status_code=status.HTTP_200_OK)
async def delete(user: IntValue, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    bst = sessions[user.session_id]["bst"]
    response = bst.delete(user.value)
    if response in ["Tree is empty", f"{user.value} not in tree"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=response)
    return {"message": response, "elements": bst.bst_to_dict(bst.root)}

@router.post("/search", response_model=MessageResponse, status_code=status.HTTP_200_OK)
async def search(user: IntValue, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    bst = sessions[user.session_id]["bst"]
    response = bst.search(user.value)
    if response in ["Tree is empty", "False"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=response)
    return {"message": response}

@router.post("/pre-order", response_model=ActionResponse, status_code=status.HTTP_200_OK)
async def pre_order(user: Session, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    bst = sessions[user.session_id]["bst"]
    response = bst.pre_order_traversal()
    return {"message": "Pre-order traversal", "elements": response}

@router.post("/in-order", response_model=ActionResponse, status_code=status.HTTP_200_OK)
async def in_order(user: Session, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    bst = sessions[user.session_id]["bst"]
    response = bst.in_order_traversal()
    return {"message": "In-order traversal", "elements": response}

@router.post("/post-order", response_model=ActionResponse, status_code=status.HTTP_200_OK)
async def post_order(user: Session, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    bst = sessions[user.session_id]["bst"]
    response = bst.post_order_traversal()
    return {"message": "Post-order traversal", "elements": response}

@router.post("/bst-to-dict", response_model=NestedStructure, status_code=status.HTTP_200_OK)
async def bst_to_dict(user: Session, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    bst = sessions[user.session_id]["bst"]
    response = bst.bst_to_dict(bst.root)
    return {"message": "BST converted to dictionary", "elements": response}