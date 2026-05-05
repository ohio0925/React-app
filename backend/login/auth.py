from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
import hashlib
import os

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    digest = hashlib.sha256(password.encode()).hexdigest()
    return pwd_context.hash(digest)

def verify_password(plain, hashed):
    digest = hashlib.sha256(plain.encode()).hexdigest()
    return pwd_context.verify(digest, hashed)

def create_token(user_id: str):
    payload = {
        "sub": user_id,
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)