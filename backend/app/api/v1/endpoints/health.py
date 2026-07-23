from fastapi import APIRouter

router = APIRouter()


@router.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "FluentFix AI Backend",
        "version": "0.1.0"
    }