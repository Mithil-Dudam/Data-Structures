from typing import Optional, List
from pydantic import BaseModel
from schemas.linked_list import Session, MessageResponse

class IntValue(Session):
    value: int

class NestedStructure(MessageResponse):
    elements: Optional[dict]

class HeapInsertResponse(BaseModel):
    message: Optional[str] = None
    max_heap: Optional[list] = None
    min_heap: Optional[list] = None

class HeapExtractResponse(BaseModel):
    max_element: int
    min_element: int
    max_heap: Optional[list] = None
    min_heap: Optional[list] = None

class Heapify(Session):
    elements: List[int]
