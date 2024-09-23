import json
import uuid

try:
    from replit import db
    USE_REPLIT_DB = True
except ImportError:
    USE_REPLIT_DB = False
    print("Replit DB not available. Using in-memory storage.")

class ReplitDB:
    def __init__(self):
        if not USE_REPLIT_DB:
            self.memory_db = {}

    def save_session(self, session_data):
        session_id = str(uuid.uuid4())
        if USE_REPLIT_DB:
            db[session_id] = json.dumps(session_data)
        else:
            self.memory_db[session_id] = json.dumps(session_data)
        return session_id

    def load_session(self, session_id):
        if USE_REPLIT_DB:
            if session_id in db:
                return json.loads(db[session_id])
        else:
            if session_id in self.memory_db:
                return json.loads(self.memory_db[session_id])
        return None
