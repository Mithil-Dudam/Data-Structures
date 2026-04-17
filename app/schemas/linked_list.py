from typing import Optional, Any, List
from schemas.base import Session, MessageResponse
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