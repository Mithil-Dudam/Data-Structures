from pydantic import BaseModel
from typing import List
from schemas.linked_list import Session

class TrieValue(Session):
    word: str

class AllWordsResponse(BaseModel):
    words: List[str]