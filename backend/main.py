import requests
import json

URL = 'https://www.googleapis.com/youtube/v3/'
# ここにAPI KEYを入力
API_KEY = 'AIzaSyAfMrA-sVhY_ntbqiRsPfnIo6ZoWan8S_k'
# ここにVideo IDを入力
VIDEO_ID = 'myjTC87kw8Y'

# コメントを取得する関数
def print_video_comment(no, video_id, next_page_token):
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
    # グッド数
    like_cnt = comment_info['snippet']['topLevelComment']['snippet']['likeCount']
    # 返信数
    reply_cnt = comment_info['snippet']['totalReplyCount']
    # ユーザー名
    user_name = comment_info['snippet']['topLevelComment']['snippet']['authorDisplayName']
    # Id
    parentId = comment_info['snippet']['topLevelComment']['id']
    print('{:0=4}\t{}\t{}\t{}\t{}'.format(no, text.replace('\r', '\n').replace('\n', ' '), like_cnt, user_name, reply_cnt))
    
    # コメントに対する返信を取得
    if reply_cnt > 0:
      cno = 1
      print_video_reply(no, cno, video_id, None, parentId)
    no = no + 1

  if 'nextPageToken' in resource:
    print_video_comment(no, video_id, resource["nextPageToken"])

# コメントに対する返信を取得する関数
def print_video_reply(no, cno, video_id, next_page_token, id):
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

    print('{:0=4}-{:0=3}\t{}\t{}\t{}'.format(no, cno, text.replace('\r', '\n').replace('\n', ' '), like_cnt, user_name))
    cno = cno + 1

  if 'nextPageToken' in resource:
    print_video_reply(no, cno, video_id, resource["nextPageToken"], id)

# コメントを全取得する
video_id = VIDEO_ID
no = 1
print_video_comment(no, video_id, None)