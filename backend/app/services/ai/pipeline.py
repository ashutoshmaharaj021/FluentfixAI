from app.services.ai.spell import correct_spelling
from app.services.ai.grammar import correct_grammar
from app.services.ai.fluency import improve_fluency


async def process_text(text: str) -> dict:

    original_text = text

    spelling = await correct_spelling(original_text)
    grammar = await correct_grammar(spelling)
    fluency = await improve_fluency(grammar)
    

    return {
        "original": original_text,
        "spelling": spelling,
        "grammar": grammar,
        "fluency": fluency,
        "corrected": fluency,
        "confidence": 0.98,
    }