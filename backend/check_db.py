from database import SessionLocal, Comment

db = SessionLocal()
comments = db.query(Comment).all()

print(f"保存されたコメント数: {len(comments)}")
for comment in comments[:5]:  # 最初の5件表示
    print(f"動画ID: {comment.video_id}")
    print(f"コメント: {comment.comment_text}")
    print(f"作成日時: {comment.created_at}")
    print("---")

db.close()