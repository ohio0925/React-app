from urllib.parse import urlparse, parse_qs

def extract_video_id(url: str):
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
