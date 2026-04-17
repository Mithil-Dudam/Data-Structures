from pydantic import BaseModel 

class Session(BaseModel):
    session_id: str

class MessageResponse(BaseModel):
    message: str