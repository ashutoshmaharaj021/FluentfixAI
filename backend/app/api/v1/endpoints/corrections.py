from fastapi import APIRouter

from app.schemas.correction import (
    CorrectionRequest,
    CorrectionResponse,
)
from app.services.ai.pipeline import process_text


router = APIRouter(
    prefix="/corrections",
    tags=["Corrections"],
)


@router.post(
    "/",
    response_model=CorrectionResponse,
)
async def correct_text(
    request: CorrectionRequest,
):
    print("MODE RECEIVED:", request.mode)
    print("TEXT RECEIVED:", request.text)

    result = await process_text(
        request.text,
        request.mode,
    )

    print("=" * 50)
    print(result)
    print(type(result))
    print("=" * 50)

    return result