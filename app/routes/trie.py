from fastapi import APIRouter, Depends, status, HTTPException
from schemas.base import Session, MessageResponse
from schemas.tree import NestedStructure
from schemas.trie import TrieValue, AllWordsResponse
from services.trie import Trie
from utils import get_sessions

router = APIRouter(prefix="/trie", tags=["Trie"])


@router.post("/create", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def create(user: Session, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    trie = Trie()
    sessions[user.session_id]["trie"] = trie
    return {"message": "Trie created successfully"}

@router.post("/insert", response_model=NestedStructure, status_code=status.HTTP_200_OK)
async def insert(user: TrieValue, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    trie = sessions[user.session_id]["trie"]
    response = trie.insert(user.word)
    return {"message": response, "elements": trie.trie_to_dict(trie.root)}

@router.post("/delete", response_model=NestedStructure, status_code=status.HTTP_200_OK)
async def delete(user: TrieValue, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    trie = sessions[user.session_id]["trie"]
    response = trie.delete(user.word)
    if response == f"{user.word} not in trie":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=response) 
    return {"message": response, "elements": trie.trie_to_dict(trie.root)}

@router.post("/search", response_model=MessageResponse, status_code=status.HTTP_200_OK)
async def search(user: TrieValue, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    trie = sessions[user.session_id]["trie"]
    response = trie.search(user.word)
    return {"message": response}

@router.post("/has-prefix", response_model=MessageResponse, status_code=status.HTTP_200_OK)
async def has_prefix(user: TrieValue, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    trie = sessions[user.session_id]["trie"]
    response = trie.has_prefix(user.word)
    return {"message": response}

@router.post("/starts-with", response_model=AllWordsResponse, status_code=status.HTTP_200_OK)
async def starts_with(user: TrieValue, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    trie = sessions[user.session_id]["trie"]
    response = trie.starts_with(user.word)
    return {"words": response}
 
@router.post("/list-words", response_model=AllWordsResponse, status_code=status.HTTP_200_OK)
async def list_words(user: Session, sessions = Depends(get_sessions)):
    if user.session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    trie = sessions[user.session_id]["trie"]
    response = trie.list_words()
    return {"words": response}