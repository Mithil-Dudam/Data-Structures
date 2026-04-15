import time
from fastapi import Request, Depends

def get_sessions(request: Request):
    return request.app.state.sessions

def get_lock(request: Request):
    return request.app.state.lock

def cleanup_sessions(sessions = Depends(get_sessions), lock = Depends(get_lock)):
    while True:
        with lock:
            for session_id in list(sessions.keys()):
                session_start = sessions[session_id].get("session_start")
                if session_start and (time.time() - session_start) > 3600:
                    del sessions[session_id]
        time.sleep(1200)