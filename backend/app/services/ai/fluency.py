from language_tool_python import LanguageTool

tool = LanguageTool("en-US")


async def improve_fluency(text: str) -> str:
    matches = tool.check(text)
    corrected = tool.correct(text)
    return corrected