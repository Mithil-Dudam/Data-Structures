from typing import Optional, Any, List
from pydantic import BaseModel 

class Session(BaseModel):
    session_id: str

class MessageResponse(BaseModel):
    message: str

class Insert(Session):
    value: Any
    index: Optional[int] = None

class CreateResponse(MessageResponse):
    session_id: str

class ActionResponse(MessageResponse):
    elements: List[Any]

class Value(Session):
    value: Any

class Index(Session):
    index: int