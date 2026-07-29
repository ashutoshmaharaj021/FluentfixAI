from pydantic import BaseModel


class CorrectionRequest(BaseModel):
    text: str


class CorrectionResponse(BaseModel):
    original: str
    corrected: str