from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch

MODEL_NAME = "vennify/t5-base-grammar-correction"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)


async def correct_grammar(text: str) -> str:
    """
    Correct grammar using a T5 Transformer.
    """

    input_text = f"grammar: {text}"

    inputs = tokenizer(
        input_text,
        return_tensors="pt",
        truncation=True,
        max_length=512,
    )

    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_length=512,
            num_beams=4,
            early_stopping=True,
        )

    corrected = tokenizer.decode(
        outputs[0],
        skip_special_tokens=True,
    )

    return corrected