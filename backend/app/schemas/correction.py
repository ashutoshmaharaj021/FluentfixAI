from pydantic import BaseModel


class CorrectionRequest(BaseModel):
    text: str
    mode: str = "all"   # default mode


class CorrectionResponse(BaseModel):
    original: str
    spelling: str
    grammar: str
    fluency: str
    corrected: str
    confidence: float