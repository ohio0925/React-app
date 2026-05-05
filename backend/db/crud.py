import json
from database import Comment, SessionLocal
from mecab_utils import mecab_sep

def save_comments_to_db(video_id: str, comments_list: list):
    db = SessionLocal()
    try:
        # 同じ video_id の古いレコードを削除
        db.query(Comment).filter(Comment.video_id == video_id).delete()
        
        # 新しいコメントを挿入
        processed = []
        for c in comments_list:
            words = mecab_sep(c["text"])
            processed.append({
                "text": c["text"],
                "words": json.dumps(words, ensure_ascii=False),
                "like_cnt": c["like_cnt"]
            })

        db.bulk_save_objects([
            Comment(
                video_id=video_id,
                comment_text=p["text"],
                words=p["words"],
                like_cnt=p["like_cnt"]
            )
            for p in processed
        ])
        db.commit()
        
    except Exception as e:
        db.rollback()
        print(f"DB保存エラー: {e}")
        
    finally:
        db.close()


def search_comments_db(video_id: str, word: str):
    db = SessionLocal()
    try:
        results = db.query(Comment).filter(
            Comment.video_id == video_id,
            Comment.words.contains(word)
        ).all()

        return [
            {
                "id": r.id,
                "comment_text": r.comment_text,
                "like_cnt": r.like_cnt,
                "created_at": r.created_at.isoformat(),
            }
            for r in results
        ]
    finally:
        db.close()

def get_comments_by_video_id(video_id: str):
    db = SessionLocal()
    try:
        results = db.query(Comment).filter(
            Comment.video_id == video_id).order_by(Comment.like_cnt.desc()).all()

        return [
            {
                "comment_text": r.comment_text,
            }
            for r in results
        ]
    finally:
        db.close()