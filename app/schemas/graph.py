from pydantic import BaseModel
from typing import List
from schemas.base import Session

class Node(Session):
    node: str

class Edge(Session):
    node1: str
    node2: str

class NodesResponse(BaseModel):
    nodes: List[str]

class EdgesResponse(BaseModel):
    edges: List[tuple[str, str]]