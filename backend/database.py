from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text
from sqlalchemy.orm import sessionmaker, declarative_base
from datetime import datetime

# SQLiteファイルを作成（ローカルDB）
DATABASE_URL = "sqlite:///./comments.db"

# DBエンジン作成
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}  # SQLite用設定
)

# セッション（DB操作用オブジェクト）作成
SessionLocal = sessionmaker(bind=engine)

# モデルのベースクラス
Base = declarative_base()

# ========== モデル定義 ==========
class Comment(Base):
    __tablename__ = "comments"
    
    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(String, nullable=False, index=True)
    comment_text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

# テーブル作成
Base.metadata.create_all(bind=engine)