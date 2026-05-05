from pydantic import BaseModel, HttpUrl

class RequestData(BaseModel):
    url: HttpUrl
    
class SearchWordRequest(BaseModel):
    word: str
    video_id: str

class SummaryRequest(BaseModel):
    video_id: str
    
class LoginRequest(BaseModel):
    user_id: str
    password: str