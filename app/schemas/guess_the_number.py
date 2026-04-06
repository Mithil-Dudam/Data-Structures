from pydantic import BaseModel

class Range(BaseModel):
    start: int 
    end: int
    session_id: str = None

class Input(BaseModel):
    guess: int 
    session_id: str

class StatusResponse(BaseModel):
    status: bool

class MessageResponse(BaseModel):
    message: str 
    session_id: str = None

class Session(BaseModel):
    session_id: str

class GuessResponse(BaseModel):
    message: str
    attempts: int
    game_over: bool

class Number(BaseModel):
    number: int

class AIResponse(BaseModel):
    message: str
    attempts: int
    game_over: bool
    mid: int
    start: int
    end: int
    new_start: int
    new_end: int
