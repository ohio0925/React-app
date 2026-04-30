import json
from database import Comment, SessionLocal
from mecab_utils import mecab_sep

def save_comments_to_db(video_id: str, comments_list: list):
    db = SessionLocal()
    try:
        # 同じ video_id の古いレコードを削除
        db.query(Comment).filter(Comment.video_id == video_id).delete()
        
        # 新しいコメントを挿入
        for c in comments_list:
            comment_text = c["text"]
            like_cnt = c["like_cnt"]
            words = mecab_sep(comment_text)
            words_json = json.dumps(words, ensure_ascii=False)
            
            db.add(Comment(
                video_id=video_id,
                comment_text=comment_text,
                words=words_json,
                like_cnt=like_cnt
            ))

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
