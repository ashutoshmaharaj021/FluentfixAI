from app.services.ai.spell import correct_spelling
from app.services.ai.grammar import correct_grammar
from app.services.ai.fluency import improve_fluency


async def process_text(text: str, mode: str = "all") -> dict:

    original_text = text

    # ---------- SPELLING ONLY ----------
    if mode == "spelling":
        spelling = await correct_spelling(original_text)

        return {
            "original": original_text,
            "spelling": spelling,
            "grammar": original_text,
            "fluency": original_text,
            "corrected": spelling,
            "confidence": 0.98,
        }
    if mode == "spelling":
        print("SPELLING MODE")
        spelling = await correct_spelling(original_text)
        print("INPUT:", original_text)
        print("OUTPUT:", spelling)

    # ---------- GRAMMAR ONLY ----------
    if mode == "grammar":
        grammar = await correct_grammar(original_text)

        return {
            "original": original_text,
            "spelling": original_text,
            "grammar": grammar,
            "fluency": original_text,
            "corrected": grammar,
            "confidence": 0.98,
        }

    if mode == "fluency":
        print("FLUENCY MODE")
        fluency = await improve_fluency(original_text)
        print("INPUT:", original_text)
        print("OUTPUT:", fluency)

    # ---------- FLUENCY ONLY ----------
    if mode == "fluency":
        fluency = await improve_fluency(original_text)

        return {
            "original": original_text,
            "spelling": original_text,
            "grammar": original_text,
            "fluency": fluency,
            "corrected": fluency,
            "confidence": 0.98,
        }

    # ---------- ALL CORRECTIONS ----------
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