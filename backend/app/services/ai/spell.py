from symspellpy import SymSpell
from wordfreq import top_n_list, zipf_frequency


# Create SymSpell instance
sym_spell = SymSpell(
    max_dictionary_edit_distance=2,
    prefix_length=7,
)


# Build a cleaner English dictionary.
# We only include reasonably common English words.
for word in top_n_list("en", 100000):

    frequency = zipf_frequency(word, "en")

    # Ignore very uncommon words.
    if frequency < 3.5:
        continue

    # Ignore words containing spaces or unusual characters.
    if not word.isalpha():
        continue

    count = int(10 ** frequency)

    sym_spell.create_dictionary_entry(
        word.lower(),
        count,
    )


async def correct_spelling(text: str) -> str:
    corrected_words = []

    for word in text.split():

        # Preserve punctuation.
        prefix = ""
        suffix = ""

        clean_word = word

        while clean_word and not clean_word[0].isalnum():
            prefix += clean_word[0]
            clean_word = clean_word[1:]

        while clean_word and not clean_word[-1].isalnum():
            suffix = clean_word[-1] + suffix
            clean_word = clean_word[:-1]

        # Nothing to correct.
        if not clean_word:
            corrected_words.append(word)
            continue

        # Keep normal/common words unchanged.
        word_frequency = zipf_frequency(
            clean_word.lower(),
            "en",
        )

        if word_frequency >= 3.5:
            corrected_words.append(word)
            continue

        # Ask SymSpell for a correction.
        suggestions = sym_spell.lookup(
            clean_word.lower(),
            verbosity=0,
            max_edit_distance=2,
        )

        if suggestions:
            corrected = suggestions[0].term

            # Preserve capitalization.
            if clean_word[0].isupper():
                corrected = corrected.capitalize()

            corrected_words.append(
                prefix + corrected + suffix
            )

        else:
            corrected_words.append(word)

    return " ".join(corrected_words)