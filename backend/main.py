from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import json
from mecab_utils import mecab_sep
from collections import Counter
from pydantic import BaseModel
from urllib.parse import urlparse, parse_qs

app = FastAPI()

class RequestData(BaseModel):
    url: str
    
# CORS設定（フロントから叩けるようにする）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 本番では制限した方がいい
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_video_id(url: str) -> str | None:
    parsed = urlparse(url)

    # 通常URL: https://www.youtube.com/watch?v=xxxx
    if parsed.hostname in ["www.youtube.com", "youtube.com"]:
        query = parse_qs(parsed.query)
        if "v" in query:
            return query["v"][0]

        # shorts対応
        if parsed.path.startswith("/shorts/"):
            return parsed.path.split("/")[2]

    # 短縮URL: https://youtu.be/xxxx
    if parsed.hostname == "youtu.be":
        return parsed.path.lstrip("/")

    return None

@app.post("/comments")
def get_comments(data: RequestData):
  URL = 'https://www.googleapis.com/youtube/v3/'
  # ここにAPI KEYを入力
  API_KEY = 'AIzaSyAfMrA-sVhY_ntbqiRsPfnIo6ZoWan8S_k'
  # ここにVideo IDを入力
  VIDEO_ID = extract_video_id(data.url)
  
  if not VIDEO_ID:
    return {"error": "videoIdを取得できません"}

  # コメントを格納するリスト
  comments_list = []

  # コメントを取得する関数
  def get_video_comment(no, video_id, next_page_token):
    # APIリクエストのパラメータ設定
    params = {
      'key': API_KEY,
      'part': 'snippet',
      'videoId': video_id,#対象動画の動画ID
      'order': 'relevance',#人気順でソート
      'textFormat': 'plaintext',
      'maxResults': 100,#最大100件取得
    }
    
    # 次のページがある場合は続きも取得
    if next_page_token is not None:
      params['pageToken'] = next_page_token
    
    # API結果をJSONで取得
    response = requests.get(URL + 'commentThreads', params=params)
    resource = response.json()
    
    #  APIエラーが合った場合にエラーメッセージを表示して終了
    if 'error' in resource:
      print("APIエラー:", resource['error']['message'])
      return
    
    # 各コメント情報を取得
    items = resource.get('items', [])
    for comment_info in items:
      # コメント
      text = comment_info['snippet']['topLevelComment']['snippet']['textDisplay']
      # 返信数
      reply_cnt = comment_info['snippet']['totalReplyCount']
      # Id 
      parentId = comment_info['snippet']['topLevelComment']['id']
      # コメントリストにコメントを格納
      comments_list.append(text)
      # コメントに対する返信を取得
      if reply_cnt > 0:
        cno = 1
        get_video_reply(no, cno, video_id, None, parentId)
      no = no + 1

    if 'nextPageToken' in resource:
      get_video_comment(no, video_id, resource["nextPageToken"])

  # コメントに対する返信を取得する関数
  def get_video_reply(no, cno, video_id, next_page_token, id):
    params = {
      'key': API_KEY,
      'part': 'snippet',
      'videoId': video_id,
      'textFormat': 'plaintext',
      'maxResults': 50,
      'parentId': id,
    }

    if next_page_token is not None:
      params['pageToken'] = next_page_token
    response = requests.get(URL + 'comments', params=params)
    resource = response.json()

    if 'error' in resource:
      print("APIエラー:", resource['error']['message'])
      return

    items = resource.get('items', [])
    for comment_info in items:
      # コメント
      text = comment_info['snippet']['textDisplay']
      # グッド数
      like_cnt = comment_info['snippet']['likeCount']
      # ユーザー名
      user_name = comment_info['snippet']['authorDisplayName']

      # コメントリストにコメントを格納
      comments_list.append(text)
      cno = cno + 1

    if 'nextPageToken' in resource:
      get_video_reply(no, cno, video_id, resource["nextPageToken"], id)

  # コメントを全取得する
  video_id = VIDEO_ID
  no = 1
  get_video_comment(no, video_id, None)

  # 取得したコメントを形態素解析して格納する単語リストを作成
  docs = []

  for text in comments_list:
      words = mecab_sep(text)
      docs.append(words)    
  
  # docs作成後に追加
  all_words = []

  for words in docs:
      all_words.extend(words)

  # 出現回数カウント
  counter = Counter(all_words)

  # 上位20件
  ranking = counter.most_common(20)

  return {
      "docs": docs,
      "ranking": ranking
}