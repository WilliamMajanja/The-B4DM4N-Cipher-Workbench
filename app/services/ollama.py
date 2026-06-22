import json
import httpx
from app.config import settings


class OllamaError(Exception):
    pass


def _vigenere_prompt(decrypted_text: str, keyword: str, cipher: dict) -> str:
    return f"""
You are a world-class cryptanalyst. Your goal is to help a user who is trying to solve a Vigenère cipher.

Cipher Details:
- Name: "{cipher['name']}"
- Description: "{cipher['description']}"

Decryption Attempt:
- Keyword Used: "{keyword or '(None)'}"
- Resulting Plaintext: "{decrypted_text}"

Your Task:
Provide a multi-faceted analysis of the decryption attempt.

1.  **Linguistic Coherence:** Assess the decrypted text for recognizable English words, phrases, or grammatical structures. Comment on letter frequencies and common n-grams.
2.  **Cryptanalytic Assessment:** Based on coherence, is the keyword "{keyword}" likely correct, partially correct, or incorrect? Provide a confidence score from 1 (unlikely) to 10 (certain).
3.  **Actionable Next Steps:** If incorrect, suggest 3 concrete next steps. Examples: re-evaluating the key length, trying keyword variations, or considering cipher variants. If promising, suggest how to verify the full plaintext.

Keep your analysis concise, clear, and encouraging.
"""


def _esoteric_prompt(cipher: dict) -> str:
    text_snippet = cipher.get("ciphertext", "")[:500]
    return f"""
You are an expert in esoteric symbolism and textual analysis, in the tradition of scholars like Manly P. Hall. Your task is to guide a user's analysis of a historical text.

Text Details:
- Name: "{cipher['name']}"
- Description: "{cipher['description']}"
- Text Snippet: "{text_snippet}..."

Your Task:
Provide a brief, insightful guide for someone analyzing this text. Do NOT attempt to "solve" it. Instead, provide context and methods.

1.  **Historical & Thematic Context:** Briefly explain the significance of this text. What major themes or symbols are famously associated with it?
2.  **Analytical Methodologies:** Suggest two distinct methods for analysis, inspired by esoteric traditions:
    - **Symbolic/Allegorical:** How might one interpret the words and stories beyond their literal meaning? Mention key symbols to watch for.
    - **Numerological (Gematria):** Explain how Gematria could be applied to this text to find hidden meanings in names, phrases, or totals. Advise the user to use the Gematria Calculator tool on significant words.
3.  **Guiding Question:** Pose one open-ended question to encourage the user's exploration, such as "What patterns emerge when comparing the Gematria values of key character names?"

Your tone should be that of a knowledgeable guide, not a solution-giver.
"""


def _puzzle_prompt(cipher: dict) -> str:
    return f"""
You are a master puzzle-solver, in the spirit of communities like Nox Populi and ARGs like Cicada 3301. You are advising a user on a complex, multi-layered puzzle.

Puzzle Details:
- Name: "{cipher['name']}"
- Description: "{cipher['description']}"
- Puzzle Text: "{cipher.get('ciphertext', '')}"

Your Task:
Analyze this puzzle and provide a set of actionable strategies. Do not give the direct solution. Your goal is to teach the user *how* to approach such a puzzle.

1.  **Initial Assessment:** What are the most striking features of this text? (e.g., unusual characters, formatting, number sequences, specific vocabulary). What might these features hint at?
2.  **Hypothesize Layers:** Puzzles like this are rarely straightforward. Suggest two potential layers of encoding or hidden information.
    - **Example 1: Ciphers:** "The text may contain a classical cipher (e.g., Caesar, Vigenère). The user should perform frequency analysis."
    - **Example 2: Steganography/Metadata:** "The message's origin could be a clue. Is there hidden information (steganography) where it was found? Or is it a reference to an external work (a book, a map)?"
3.  **Three Concrete Next Steps:** Provide a list of three distinct, concrete actions the user should take right now.
    - "1. Run the text through the Gematria calculator to check for significant numbers (e.g., primes)."
    - "2. Research key phrases or names from the text online, looking for connections to cryptography, literature, or philosophy."
    - "3. Use the N-gram analysis to spot any non-obvious repeating patterns."
"""


async def ollama_chat(prompt: str, format_json: bool = False) -> str:
    body = {
        "model": settings.ollama_model,
        "messages": [{"role": "user", "content": prompt}],
        "stream": False,
        "options": {"temperature": 0.4},
    }
    if format_json:
        body["format"] = "json"

    try:
        async with httpx.AsyncClient(timeout=settings.ollama_timeout) as client:
            response = await client.post(
                f"{settings.ollama_base_url}/api/chat",
                json=body,
                headers={"Content-Type": "application/json"},
            )
            response.raise_for_status()
            data = response.json()
            return data["message"]["content"]
    except (httpx.HTTPError, httpx.TimeoutException, KeyError, json.JSONDecodeError) as e:
        raise OllamaError(f"Ollama API error: {e}") from e


async def analyze_text_with_ai(decrypted_text: str, keyword: str, cipher: dict) -> str:
    if cipher.get("type") in ("VIGENERE", "CAESAR", "ATBASH") and not decrypted_text.strip():
        return "Decrypted text is empty. Cannot analyze."

    cipher_type = cipher.get("type", "")
    if cipher_type in ("VIGENERE", "CAESAR", "ATBASH"):
        prompt = _vigenere_prompt(decrypted_text, keyword, cipher)
    elif cipher_type == "ESOTERIC":
        prompt = _esoteric_prompt(cipher)
    elif cipher_type == "PUZZLE":
        prompt = _puzzle_prompt(cipher)
    else:
        prompt = f"Analyze the following text: {cipher.get('ciphertext', '')}"

    try:
        return await ollama_chat(prompt)
    except OllamaError:
        return "An error occurred while communicating with the Ollama API. Is ollama running? (http://localhost:11434)"


async def suggest_keyword_with_ai(ciphertext: str, key_length: int) -> dict:
    prompt = f"""
        You are a cryptanalysis expert specializing in Vigenère ciphers.
        A user has given you a ciphertext and a probable key length.
        Your task is to analyze the ciphertext and suggest three potential keywords.
        
        Ciphertext: "{ciphertext}"
        Key Length: {key_length}

        Perform a frequency analysis on the columns of text corresponding to the key length. For each position in the key, find the letter that results in the most English-like frequency distribution for that column.
        
        Return your answer ONLY as a valid JSON object with the following structure:
        {{
          "suggestions": [
            {{ "keyword": "SUGGESTION1", "reason": "Your reasoning based on frequency analysis." }},
            {{ "keyword": "SUGGESTION2", "reason": "Your reasoning." }},
            {{ "keyword": "SUGGESTION3", "reason": "Your reasoning." }}
          ]
        }}
    """

    try:
        text = await ollama_chat(prompt, format_json=True)
        return json.loads(text)
    except (OllamaError, json.JSONDecodeError) as e:
        raise OllamaError("Failed to get keyword suggestions from Ollama.") from e
