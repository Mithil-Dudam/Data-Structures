from pydantic import BaseModel

class Range(BaseModel):
    start: int 
    end: int

class Input(BaseModel):
    guess: int

class StatusResponse(BaseModel):
    status: bool

class MessageResponse(BaseModel):
    message: str 

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
