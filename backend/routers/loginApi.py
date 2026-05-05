from fastapi import APIRouter, Depends, HTTPException
from schemas.request import LoginRequest
from sqlalchemy.orm import Session
from database import get_db, User
from login.auth import verify_password, create_token, hash_password

router = APIRouter()

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == data.user_id).first()

    if not user:
        raise HTTPException(status_code=401, detail="ユーザーが存在しません")

    if not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=402, detail="パスワードが違います")

    token = create_token(user.user_id)

    return {"access_token": token}

@router.post("/register")
def register(data: LoginRequest, db: Session = Depends(get_db)):
    user = User(
        user_id=data.user_id,
        password=data.password,
        hashed_password=hash_password(data.password)
    )

    db.add(user)
    db.commit()

    return {"message": "user created"}