from pathlib import Path

from symspellpy import SymSpell, Verbosity

sym_spell = SymSpell(max_dictionary_edit_distance=2)

dictionary_path = (
    Path(__file__)
    .resolve()
    .parents[3]
    / "resources"
    / "dictionaries"
    / "frequency_dictionary_en_82_765.txt"
)

if not sym_spell.load_dictionary(
    str(dictionary_path),
    term_index=0,
    count_index=1,
):
    raise FileNotFoundError(
        f"Dictionary not found: {dictionary_path}"
    )


async def correct_spelling(text: str) -> str:
    corrected_words = []

    for word in text.split():
        suggestions = sym_spell.lookup(
            word,
            Verbosity.CLOSEST,
            max_edit_distance=2,
        )

        if suggestions:
            corrected_words.append(suggestions[0].term)
        else:
            corrected_words.append(word)

    return " ".join(corrected_words)