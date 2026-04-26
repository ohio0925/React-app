from database import SessionLocal, Comment

db = SessionLocal()
comments = db.query(Comment).all()

print(f"保存されたコメント数: {len(comments)}")
for comment in comments:  # すべてのコメントを表示
    if comment.video_id == "Ig0jnRO_FxA":  # 特定の動画IDのコメントを表示
        print(f"動画ID: {comment.video_id}")
        print(f"いいね数: {comment.like_cnt}")
        print(f"コメント: {comment.comment_text}")
        print(f"作成日時: {comment.created_at}")
        print(f"単語: {comment.words}")
        print("---")

db.close()