import uuid
from fastapi import APIRouter, HTTPException, status, Depends, Request
from schemas.linked_list import CreateResponse, ActionResponse, Insert, Value, Index, MessageResponse, Session
from services.singly_linked_list import SinglyLinkedList

router = APIRouter(prefix="/sll", tags=["Singly Linked List"])

def get_sessions(request: Request):
    return request.app.state.sessions

def validate_session():
    pass
 
@router.post("/create", response_model=CreateResponse, status_code=status.HTTP_201_CREATED)
async def create(sessions=Depends(get_sessions)):
    session_id = str(uuid.uuid4())
    sll = SinglyLinkedList()
    sessions[session_id] = dict()
    sessions[session_id]["sll"] = sll
    return {"message": "Singly Linked List created successfully", "session_id": session_id}

@router.post("/insert", response_model=ActionResponse, status_code=status.HTTP_200_OK)
async def insert(user: Insert, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    sll = sessions[user.session_id]["sll"]
    if user.index is not None:
        response = sll.insert(user.value, user.index)
    else:
        response = sll.insert(user.value)
    if response == "Index out of bounds":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=response)
    return {"message": response, "elements": sll.traverse()}

@router.post("/delete", response_model=ActionResponse, status_code=status.HTTP_200_OK)
async def delete(user: Value, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    sll = sessions[user.session_id]["sll"]
    response = sll.delete(user.value)
    if response in ["List is empty", f"{user.value} not in list"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=response)
    return {"message": response, "elements": sll.traverse()}

@router.post("/delete-index", response_model=ActionResponse, status_code=status.HTTP_200_OK)
async def delete_index(user: Index, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    sll = sessions[user.session_id]["sll"]
    response = sll.delete_index(user.index)
    if response in ["List is empty", "Index out of bounds"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=response)
    return {"message": response, "elements": sll.traverse()}

@router.post("/search", response_model=MessageResponse, status_code=status.HTTP_200_OK)
async def search(user: Value, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    sll = sessions[user.session_id]["sll"]
    response = sll.search(user.value)
    if response == "List is empty":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=response)
    return {"message": response}

@router.post("/length", response_model=MessageResponse, status_code=status.HTTP_200_OK)
async def length(user: Session, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    sll = sessions[user.session_id]["sll"]
    return {"message": f"Length of list is {sll.length()}"}