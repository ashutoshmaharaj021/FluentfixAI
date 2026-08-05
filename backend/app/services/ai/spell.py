from symspellpy import SymSpell
from wordfreq import top_n_list, zipf_frequency

sym_spell = SymSpell(max_dictionary_edit_distance=2)

for word in top_n_list("en", 500000):
    frequency = int(10 ** zipf_frequency(word, "en"))
    if frequency > 0:
        sym_spell.create_dictionary_entry(word, frequency)


async def correct_spelling(text: str) -> str:
    corrected_words = []

    for word in text.split():

        clean_word = word.strip(".,!?;:\"'()[]{}")

        # If it's already a valid/common English word,
        # don't touch it.
        if zipf_frequency(clean_word.lower(), "en") > 2.5:
            corrected_words.append(word)
            continue

        suggestions = sym_spell.lookup(
            clean_word,
            verbosity=0,
            max_edit_distance=2,
        )

        if suggestions:
            corrected_words.append(suggestions[0].term)
        else:
            corrected_words.append(word)

    return " ".join(corrected_words)