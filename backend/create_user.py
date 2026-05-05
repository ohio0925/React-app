from database import SessionLocal, Base, engine
from database import User
from login.auth import hash_password

Base.metadata.create_all(bind=engine)

db = SessionLocal()

user = User(
    user_id="test",
    password="qwer",
    hashed_password=hash_password("qwer")
)

db.add(user)
db.commit()
db.close()

print("ユーザー作成完了")