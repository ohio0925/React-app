from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

#CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 開発中はこれでOK
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Hello from Python"}