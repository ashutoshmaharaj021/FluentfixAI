from fastapi import FastAPI

from app.api.v1.router import api_router

app = FastAPI(
    title="FluentFix AI API",
    description="AI-powered text correction backend.",
    version="0.1.0",
)

app.include_router(api_router)


@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to FluentFix AI 🚀"
    }