from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
import pyotp
import qrcode
from io import BytesIO
import base64
from config import get_settings
from modules.auth import get_db, User, create_user, authenticate_user, create_access_token
from modules.threat_generator import generate_threat

app = FastAPI()
settings = get_settings()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.cors_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
    return user

@app.post("/register")
async def register(username: str, password: str, db: Session = Depends(get_db)):
    user = create_user(db, username, password)
    if not user:
        raise HTTPException(status_code=400, detail="Username already registered")
    secret = pyotp.random_base32()
    user.totp_secret = secret
    db.commit()
    totp = pyotp.TOTP(secret)
    qr = qrcode.QRCode()
    qr.add_data(totp.provisioning_uri(username, issuer_name="CyberThreatSim"))
    f = BytesIO()
    qr.make_image().save(f)
    qr_code = base64.b64encode(f.getvalue()).decode()
    return {"qr_code": f"data:image/png;base64,{qr_code}"}

@app.post("/verify-2fa")
async def verify_2fa(username: str, code: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user or not user.totp_secret:
        raise HTTPException(status_code=400, detail="User not found or 2FA not set")
    totp = pyotp.TOTP(user.totp_secret)
    if not totp.verify(code):
        raise HTTPException(status_code=400, detail="Invalid 2FA code")
    user.is_2fa_verified = True
    db.commit()
    return {"message": "2FA verified"}

@app.post("/token")
async def login(username: str, password: str, code: str, db: Session = Depends(get_db)):
    user = authenticate_user(db, username, password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    if not user.totp_secret or not user.is_2fa_verified:
        raise HTTPException(status_code=400, detail="2FA not set or verified")
    totp = pyotp.TOTP(user.totp_secret)
    if not totp.verify(code):
        raise HTTPException(status_code=400, detail="Invalid 2FA code")
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/simulate")
async def simulate_threat(threat_type: str, current_user: User = Depends(get_current_user)):
    result = generate_threat(threat_type)
    return result

@app.get("/dashboard")
async def get_dashboard(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == current_user.username).first()
    return {
        "total_simulations": user.total_simulations,
        "successful_simulations": user.successful_simulations,
        "failed_simulations": user.failed_simulations,
        "logs": user.logs
    }

@app.get("/report")
async def get_report(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == current_user.username).first()
    html_content = f"""
    <html>
    <body>
        <h1>CyberThreatSim Report</h1>
        <p>User: {user.username}</p>
        <p>Total Simulations: {user.total_simulations}</p>
        <p>Successful: {user.successful_simulations}</p>
        <p>Failed: {user.failed_simulations}</p>
        <h2>Logs</h2>
        <ul>{''.join(f'<li>{log}</li>' for log in user.logs)}</ul>
    </body>
    </html>
    """
    return {"html_content": html_content}