import random
from fastapi import APIRouter, status, HTTPException
from app.schemas.guess_the_number import Input, Range, StatusResponse, MessageResponse, GuessResponse, Number, AIResponse

router = APIRouter(prefix="/guess-the-number", tags=["guess-the-number"])

number_to_guess = None
attempts = 0
game_started = False
new_start = 0
new_end = 0

@router.get("/status", response_model=StatusResponse, status_code=status.HTTP_200_OK)
async def game_status():
    if game_started:
        return {"status": True}
    return {"status": False}

@router.post("/start", response_model=MessageResponse, status_code=status.HTTP_200_OK)
async def start_game(settings: Range):
    global number_to_guess, game_started, attempts
    if settings.start >= settings.end:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Start range must be less than end range")
    number_to_guess = random.randint(settings.start, settings.end)
    game_started = True
    return {"message": "Game started!"}

@router.post("/guess", response_model=GuessResponse, status_code=status.HTTP_200_OK)
async def guess_the_number(input: Input):
    global number_to_guess, attempts, game_started
    if input.guess < number_to_guess:
        message = "Too low!"
    elif input.guess > number_to_guess:
        message = "Too high!"
    else:
        message = "Congratulations! You've guessed the number!"
        game_started = False
    attempts += 1
    return {"message": message, "attempts": attempts, "game_over": message[0] == "C"}

@router.post("/number", response_model=MessageResponse, status_code=status.HTTP_200_OK)
async def choose_number(input: Number):
    global number_to_guess, game_started, attempts, new_start, new_end
    if 1 <= input.number <= 100000000000:
        number_to_guess = input.number
        game_started = True
        return {"message": "Number chosen successfully!"}
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Number must be between 1 and 100000000000")

@router.post("/ai-guess", response_model=AIResponse, status_code=status.HTTP_200_OK)
async def ai_guess(guess: Range):
    global attempts, game_started, new_start, new_end
    mid = (guess.start + guess.end) // 2
    if mid == number_to_guess:
        message = "AI guessed the number!"
        game_started = False
    elif mid < number_to_guess:
        message = "AI guessed too low!"
        new_start = mid + 1
        new_end = guess.end
    else:
        message = "AI guessed too high!"
        new_start = guess.start
        new_end = mid - 1
    attempts += 1
    return {"message": message, "attempts": attempts, "game_over": message == "AI guessed the number!", "mid":mid, "start":guess.start, "end":guess.end, "new_start": new_start, "new_end": new_end}
    
@router.post("/reset", response_model=MessageResponse, status_code=status.HTTP_200_OK)
async def reset_game():
    global number_to_guess, attempts, game_started, new_start, new_end
    number_to_guess = None
    attempts = 0
    game_started = False
    new_start = 0
    new_end = 0
    return {"message": "Game reset successfully!"}
