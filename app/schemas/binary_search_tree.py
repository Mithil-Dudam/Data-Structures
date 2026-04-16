from typing import Optional
from schemas.linked_list import Session, MessageResponse

class IntValue(Session):
    value: int

class NestedStructure(MessageResponse):
    elements: Optional[dict]