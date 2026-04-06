import uuid
import random
from fastapi import APIRouter, status, HTTPException, Depends, Request
from schemas.guess_the_number import Input, Range, StatusResponse, MessageResponse, GuessResponse, Number, AIResponse, Session

router = APIRouter(prefix="/guess-the-number", tags=["guess-the-number"])

def get_sessions(request: Request):
    return request.app.state.sessions

@router.post("/status", response_model=StatusResponse, status_code=status.HTTP_200_OK)
async def game_status(session: Session, sessions=Depends(get_sessions)):
    if not sessions.get(session.session_id, {}):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid session ID")
    if sessions.get(session.session_id, {}).get("game_started"):
        return {"status": True}
    return {"status": False} 

@router.post("/start", response_model=MessageResponse, status_code=status.HTTP_200_OK)
async def start_game(settings: Range, sessions=Depends(get_sessions)):
    if settings.start >= settings.end:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Start range must be less than end range")
    session_id = str(uuid.uuid4())
    sessions[session_id] = {"number_to_guess": None, "attempts": 0, "game_started": False, "new_start": 0, "new_end": 0}
    sessions[session_id]["number_to_guess"] = random.randint(settings.start, settings.end)
    sessions[session_id]["game_started"] = True
    return {"message": "Game started!", "session_id": session_id}

@router.post("/guess", response_model=GuessResponse, status_code=status.HTTP_200_OK)
async def guess_the_number(input: Input, sessions=Depends(get_sessions)):
    if not sessions.get(input.session_id, {}):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid session ID")
    number_to_guess = sessions[input.session_id]["number_to_guess"]
    if input.guess < number_to_guess:
        message = "Too low!"
    elif input.guess > number_to_guess:
        message = "Too high!"
    else:
        message = "Congratulations! You've guessed the number!"
        sessions[input.session_id]["game_started"] = False
    sessions[input.session_id]["attempts"] += 1
    return {"message": message, "attempts": sessions[input.session_id]["attempts"], "game_over": message[0] == "C"}

@router.post("/number", response_model=MessageResponse, status_code=status.HTTP_200_OK)
async def choose_number(input: Number, sessions=Depends(get_sessions)):
    if 1 <= input.number <= 100000000000:
        session_id = str(uuid.uuid4())
        sessions[session_id] = {"number_to_guess": None, "attempts": 0, "game_started": False, "new_start": 0, "new_end": 0}
        sessions[session_id]["number_to_guess"] = input.number
        sessions[session_id]["game_started"] = True
        return {"message": "Number chosen successfully!", "session_id": session_id}
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Number must be between 1 and 100000000000")

@router.post("/ai-guess", response_model=AIResponse, status_code=status.HTTP_200_OK)
async def ai_guess(guess: Range, sessions=Depends(get_sessions)):
    if not sessions.get(guess.session_id, {}):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid session ID")
    number_to_guess = sessions[guess.session_id]["number_to_guess"]
    sessions[guess.session_id]["mid"] = (guess.start + guess.end) // 2
    if sessions[guess.session_id]["mid"] == number_to_guess:
        message = "AI guessed the number!"
        sessions[guess.session_id]["game_started"] = False
    elif sessions[guess.session_id]["mid"] < number_to_guess:
        message = "AI guessed too low!"
        sessions[guess.session_id]["new_start"] = sessions[guess.session_id]["mid"] + 1
        sessions[guess.session_id]["new_end"] = guess.end
    else:
        message = "AI guessed too high!"
        sessions[guess.session_id]["new_start"] = guess.start
        sessions[guess.session_id]["new_end"] = sessions[guess.session_id]["mid"] - 1
    sessions[guess.session_id]["attempts"] += 1
    return {"message": message, "attempts": sessions[guess.session_id]["attempts"], "game_over": message == "AI guessed the number!", "mid": sessions[guess.session_id]["mid"], "start":guess.start, "end":guess.end, "new_start": sessions[guess.session_id]["new_start"], "new_end": sessions[guess.session_id]["new_end"]}

@router.post("/reset", response_model=MessageResponse, status_code=status.HTTP_200_OK)
async def reset_game(session: Session, sessions=Depends(get_sessions)):
    if not sessions.get(session.session_id, {}):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid session ID")
    del sessions[session.session_id]    
    return {"message": f"Deleted session {session.session_id} successfully!"}
