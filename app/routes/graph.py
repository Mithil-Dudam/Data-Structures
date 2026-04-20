from fastapi import APIRouter, Depends, status, HTTPException
from schemas.base import Session, MessageResponse
from schemas.tree import NestedStructure
from schemas.graph import Node, Edge, NodesResponse, EdgesResponse
from services.graph import Graph
from utils import get_sessions

router = APIRouter(prefix="/graph", tags=["Graph"])


@router.post("/create", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def create(user: Session, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    graph = Graph()
    sessions[user.session_id]["graph"] = graph
    return {"message": "Graph created successfully"}

@router.post("/add/node", response_model=NestedStructure, status_code=status.HTTP_200_OK)
async def add_node(user: Node, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    graph = sessions[user.session_id]["graph"]
    response = graph.add_node(user.node.strip())
    if response == f"{user.node} is already in the graph":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=response)
    return {"message": response, "elements": graph.graph_to_dict()}

@router.post("/remove/node", response_model=NestedStructure, status_code=status.HTTP_200_OK)
async def remove_node(user: Node, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    graph = sessions[user.session_id]["graph"]
    response = graph.remove_node(user.node.strip())
    if response == f"{user.node} not found in graph":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=response)
    return {"message": response, "elements": graph.graph_to_dict()}

@router.post("/add/edge", response_model=NestedStructure, status_code=status.HTTP_200_OK)
async def add_edge(user: Edge, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    graph = sessions[user.session_id]["graph"]
    response = graph.add_edge(user.node1.strip(), user.node2.strip())
    if response in [f"{user.node1} not found in graph", f"{user.node2} not found in graph", "Edge already present"]:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=response)
    return {"message": response, "elements": graph.graph_to_dict()}

@router.post("/remove/edge", response_model=NestedStructure, status_code=status.HTTP_200_OK)
async def remove_edge(user: Edge, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    graph = sessions[user.session_id]["graph"]
    response = graph.remove_edge(user.node1.strip(), user.node2.strip())
    if response in [f"{user.node1} not found in graph", f"{user.node2} not found in graph", "No edge exists"]:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=response)
    return {"message": response, "elements": graph.graph_to_dict()}

@router.post("/neighbours", response_model=NodesResponse, status_code=status.HTTP_200_OK)
async def get_neighbours(user: Node, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    graph = sessions[user.session_id]["graph"]
    response = graph.get_neighbours(user.node.strip())
    if response == f"{user.node} not found in graph":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=response)
    return {"nodes": response}

@router.post("/has/node", response_model=MessageResponse, status_code=status.HTTP_200_OK)
async def has_node(user: Node, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    graph = sessions[user.session_id]["graph"]
    response = graph.has_node(user.node.strip())
    if not response:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"{user.node} is not present in the graph")
    return {"message": f"{user.node} is present in the graph"}

@router.post("/has/edge", response_model=MessageResponse, status_code=status.HTTP_200_OK)
async def has_edge(user: Edge, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    graph = sessions[user.session_id]["graph"]
    response = graph.has_edge(user.node1.strip(), user.node2.strip())
    if not response:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Edge from {user.node1} to {user.node2} is not present in the graph")
    return {"message": f"Edge from {user.node1} to {user.node2} is present in the graph"}

@router.post("/nodes", response_model=NodesResponse, status_code=status.HTTP_200_OK)
async def get_nodes(user: Session, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    graph = sessions[user.session_id]["graph"]
    response = graph.get_nodes()
    return {"nodes": response}

@router.post("/edges", response_model=EdgesResponse, status_code=status.HTTP_200_OK)
async def get_edges(user: Session, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    graph = sessions[user.session_id]["graph"]
    response = graph.get_edges()
    return {"edges": response}

@router.post("/bfs", response_model=NodesResponse, status_code=status.HTTP_200_OK)
async def bfs(user: Node, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    graph = sessions[user.session_id]["graph"]
    response = graph.bfs(user.node.strip())
    if response == f"{user.node} not found in graph":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=response)
    return {"nodes": response}

@router.post("/dfs", response_model=NodesResponse, status_code=status.HTTP_200_OK)
async def dfs(user: Node, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    graph = sessions[user.session_id]["graph"]
    response = graph.dfs(user.node.strip())
    if response == f"{user.node} not found in graph":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=response)
    return {"nodes": response}