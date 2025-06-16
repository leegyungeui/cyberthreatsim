from random import randint
from datetime import datetime
from sqlalchemy.orm import Session
from modules.auth import User
import json

def generate_threat(threat_type: str):
    threats = {
        "ddos": {"success_rate": 60, "score_range": (50, 100)},
        "phishing": {"success_rate": 70, "score_range": (40, 90)},
        "sql_injection": {"success_rate": 50, "score_range": (60, 100)}
    }
    if threat_type.lower() not in threats:
        return {"error": "Invalid threat type"}
    success_rate = threats[threat_type.lower()]["success_rate"]
    score_min, score_max = threats[threat_type.lower()]["score_range"]
    is_success = randint(0, 100) <= success_rate
    score = randint(score_min, score_max) if is_success else randint(10, score_min)
    log = f"{threat_type} simulation {'succeeded' if is_success else 'failed'} at {datetime.utcnow()}"
    return {
        "threat_type": threat_type,
        "success": is_success,
        "score": score,
        "log": log
    }

def update_user_stats(db: Session, user: User, result: dict):
    user.total_simulations += 1
    if result["success"]:
        user.successful_simulations += 1
    else:
        user.failed_simulations += 1
    logs = json.loads(user.logs)
    logs.append(result["log"])
    user.logs = json.dumps(logs)
    db.commit()