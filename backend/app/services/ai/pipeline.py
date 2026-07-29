from app.services.ai.spell import correct_spelling
from app.services.ai.grammar import correct_grammar
from app.services.ai.fluency import improve_fluency


async def process_text(text: str) -> dict:
    """
    Run the complete AI correction pipeline.
    """

    original_text = text

    text = await correct_spelling(text)
    text = await correct_grammar(text)
    text = await improve_fluency(text)

    return {
        "original": original_text,
        "corrected": text,
    }