from fastapi import APIRouter
from schemas.request import RequestData, SearchWordRequest
from services.youtube_service import fetch_comments
from services.analysis_service import analyze_comments
from db.crud import save_comments_to_db, search_comments_db
from utils.youtube import extract_video_id

router = APIRouter()

@router.post("/comments")
def get_comments(data: RequestData):
    video_id = extract_video_id(str(data.url))

    if not video_id:
        return {"error": "videoIdを取得できません"}

    comments = fetch_comments(video_id)
    docs, ranking = analyze_comments(comments)

    save_comments_to_db(video_id, comments)

    return {
        "docs": docs,
        "ranking": ranking,
        "video_id": video_id,
    }


@router.post("/comments/search")
def search_comments(data: SearchWordRequest):
    return search_comments_db(data.video_id, data.word)