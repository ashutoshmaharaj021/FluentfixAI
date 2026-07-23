from fastapi import FastAPI

from app.api.v1.router import api_router
from app.config.settings import settings

app = FastAPI(
    title=settings.APP_NAME,
    description="AI-powered text correction backend.",
    version=settings.APP_VERSION,
)

app.include_router(api_router)


@app.get("/", tags=["Root"])
def root():
    return {
        "message": f"Welcome to {settings.APP_NAME} 🚀",
        "debug": settings.DEBUG,
    }