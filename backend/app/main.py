import logging

from app.config.logging import setup_logging
from fastapi import FastAPI

from app.api.v1.router import api_router
from app.config.settings import settings

setup_logging()

logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.APP_NAME,
    description="AI-powered text correction backend.",
    version=settings.APP_VERSION,
)

logger.info("FluentFix AI Backend started successfully.")

app.include_router(api_router)


@app.get("/", tags=["Root"])
def root():
    return {
        "message": f"Welcome to {settings.APP_NAME} 🚀",
        "debug": settings.DEBUG,
    }