import google.generativeai as genai
from db.crud import get_comments_by_video_id
from fastapi import APIRouter
from schemas.request import SummaryRequest

router = APIRouter()

genai.configure(api_key="AIzaSyC7iz8I2se_bBKeBbU8E6tVPda9ZzE5qO4")

@router.post("/summary")
def summarize(data: SummaryRequest):
    # ① DBからコメント取得（仮）
    comments_data = get_comments_by_video_id(data.video_id)
    comments = comments_data[:100]  # 上位100件を使用
    
    # ② まとめてテキスト化
    text = "\n".join([c["comment_text"] for c in comments])

    # ③ プロンプト作成
    prompt = f"""
    以下はYouTubeのコメントです。
    以下コメントから動画に対して、どのような意見が多いか要約してください。
    要約結果は箇条書きで簡潔にまとめてください。
    また、ポジティブ・ネガティブの傾向も教えてください。

    {text}
    """

    # ④ Gemini呼び出し
    model = genai.GenerativeModel("models/gemini-2.5-flash")
    response = model.generate_content(prompt)

    # ⑤ 結果返す
    return {
        "text": response.text
    }
