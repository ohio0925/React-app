from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import comments
from routers import ai_summary
from routers import loginApi as auth_router

app = FastAPI()

origins = [
    "http://localhost:3000",
    "https://react-app-alpha-henna.vercel.app",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(comments.router)
app.include_router(ai_summary.router)
app.include_router(auth_router.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)