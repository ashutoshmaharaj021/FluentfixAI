from pydantic import BaseModel


class CorrectionRequest(BaseModel):
    text: str


class CorrectionResponse(BaseModel):
    original: str
    spelling: str
    grammar: str
    fluency: str
    corrected: str
    confidence: float