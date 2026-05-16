import requests
from dotenv import load_dotenv
import os

load_dotenv()

API_KEY = os.getenv("YOUTUBE_API_KEY")
BASE_URL = "https://www.googleapis.com/youtube/v3/"

def fetch_comments(video_id: str):
    comments_list = []
    
    # コメントを取得する関数
    def get_video_comment(no, video_id, next_page_token):
        
        # APIリクエストのパラメータ設定
        params = {
            "key": API_KEY,
            "part": "snippet",
            "videoId": video_id,
            "order": "time",
            "textFormat": "plaintext",
            "maxResults": 100,
        }

        if next_page_token:
            params["pageToken"] = next_page_token

        res = requests.get(BASE_URL + "commentThreads", params=params)
        data = res.json()
        
        #  APIエラーが合った場合にエラーメッセージを表示して終了
        if 'error' in data:
            print("APIエラー:", data['error']['message'])
            return

        for item in data.get("items", []):
            # コメント
            text = item['snippet']['topLevelComment']['snippet']['textDisplay']
            # 返信数
            reply_cnt = item['snippet']['totalReplyCount']
            # グッド数
            like_cnt = item['snippet']['topLevelComment']['snippet']['likeCount']
            # 投稿日時
            published_at = item['snippet']['topLevelComment']['snippet']['publishedAt']
            # Id 
            parentId = item['snippet']['topLevelComment']['id']
            # コメントリストにコメントとlike_cntを格納（辞書形式）
            comments_list.append({"text": text, "like_cnt": like_cnt})
            # コメントに対する返信を取得
            if reply_cnt > 0:
                cno = 1
                get_video_reply(no, cno, video_id, None, parentId)
            no = no + 1

        if "nextPageToken" in data:
            get_video_comment(no,video_id,data["nextPageToken"])
    
    # コメントに対する返信を取得する関数        
    def get_video_reply(no, cno, video_id, next_page_token, id):
        
        # APIリクエストのパラメータ設定
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
        response = requests.get(BASE_URL + 'comments', params=params)
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
            # 投稿日時
            published_at = comment_info['snippet']['publishedAt']

            # コメントリストにコメントとlike_cntを格納
            comments_list.append({"text": text, "like_cnt": like_cnt})
            cno = cno + 1

        if 'nextPageToken' in resource:
            get_video_reply(no, cno, video_id, resource["nextPageToken"], id)
    
    # コメントを全取得するための初期呼び出し
    no = 1
    get_video_comment(no, video_id, None)
    return comments_list
