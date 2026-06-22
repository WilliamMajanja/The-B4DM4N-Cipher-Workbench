from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.services.crypto import (
    vigenere_decrypt, caesar_decrypt, atbash_decrypt,
    calculate_frequencies, calculate_ioc, calculate_ngrams,
    find_repeated_sequences, analyze_distances, calculate_ioc_for_columns,
    get_unique_chars, calculate_gematria, transliterate_to_hieroglyphs,
)
from app.services.ollama import analyze_text_with_ai, suggest_keyword_with_ai, OllamaError
from app.data.ciphers import ciphers
from app.config import settings


class DecryptRequest(BaseModel):
    ciphertext: str
    key: str = ""
    shift: int = 3


class DecryptResponse(BaseModel):
    plaintext: str


class AnalyzeRequest(BaseModel):
    ciphertext: str
    decrypted_text: str = ""
    keyword: str = ""
    cipher: dict


class FrequencyResponse(BaseModel):
    frequencies: list[dict]
    ioc: float


class NgramRequest(BaseModel):
    text: str
    n: int = 2


class NgramResponse(BaseModel):
    ngrams: dict[str, int]


class KasiskiResponse(BaseModel):
    factor_counts: dict[str, int]
    sequence_details: list[dict]


class GematriaRequest(BaseModel):
    text: str
    schema_: str = Field(default="pythagorean", alias="schema")


class GematriaResponse(BaseModel):
    value: int


class HieroglyphRequest(BaseModel):
    text: str


class HieroglyphResponse(BaseModel):
    glyphs: str


class UniqueCharsResponse(BaseModel):
    characters: list[str]


class KeywordSuggestRequest(BaseModel):
    ciphertext: str
    key_length: int = 8


class IoCColumnsRequest(BaseModel):
    ciphertext: str
    key_length: int


router = APIRouter(prefix="/api")


def _validate_ciphertext(ciphertext: str):
    if len(ciphertext) > settings.max_ciphertext_length:
        raise HTTPException(
            status_code=400,
            detail=f"Ciphertext exceeds maximum length of {settings.max_ciphertext_length}",
        )


def _validate_key(key: str):
    if len(key) > settings.max_keyword_length:
        raise HTTPException(
            status_code=400,
            detail=f"Key exceeds maximum length of {settings.max_keyword_length}",
        )


@router.post("/decrypt/vigenere", response_model=DecryptResponse)
def decrypt_vigenere(req: DecryptRequest):
    _validate_ciphertext(req.ciphertext)
    _validate_key(req.key)
    plaintext = vigenere_decrypt(req.ciphertext, req.key)
    return DecryptResponse(plaintext=plaintext)


@router.post("/decrypt/caesar", response_model=DecryptResponse)
def decrypt_caesar(req: DecryptRequest):
    _validate_ciphertext(req.ciphertext)
    plaintext = caesar_decrypt(req.ciphertext, req.shift)
    return DecryptResponse(plaintext=plaintext)


@router.post("/decrypt/atbash", response_model=DecryptResponse)
def decrypt_atbash(req: DecryptRequest):
    _validate_ciphertext(req.ciphertext)
    plaintext = atbash_decrypt(req.ciphertext)
    return DecryptResponse(plaintext=plaintext)


@router.post("/analyze/frequencies", response_model=FrequencyResponse)
def analyze_frequencies(req: AnalyzeRequest):
    _validate_ciphertext(req.ciphertext)
    text = req.decrypted_text or req.ciphertext
    frequencies = calculate_frequencies(text)
    ioc = calculate_ioc(text)
    return FrequencyResponse(frequencies=frequencies, ioc=ioc)


@router.post("/analyze/ngrams", response_model=NgramResponse)
def analyze_ngrams(req: NgramRequest):
    _validate_ciphertext(req.text)
    if req.n < 1:
        raise HTTPException(status_code=400, detail="n must be at least 1")
    ngrams = calculate_ngrams(req.text, req.n)
    return NgramResponse(ngrams=ngrams)


@router.post("/analyze/kasiski", response_model=KasiskiResponse)
def analyze_kasiski(req: AnalyzeRequest):
    _validate_ciphertext(req.ciphertext)
    text = req.decrypted_text or req.ciphertext
    sequences = find_repeated_sequences(text)
    factor_counts, sequence_details = analyze_distances(sequences)
    str_factor_counts = {str(k): v for k, v in factor_counts.items()}
    return KasiskiResponse(
        factor_counts=str_factor_counts,
        sequence_details=sequence_details,
    )


@router.post("/analyze/ioc-columns")
def analyze_ioc_columns(req: IoCColumnsRequest):
    _validate_ciphertext(req.ciphertext)
    if req.key_length < 1:
        raise HTTPException(status_code=400, detail="key_length must be at least 1")
    ioc = calculate_ioc_for_columns(req.ciphertext, req.key_length)
    return {"ioc": ioc}


@router.post("/analyze/unique-chars", response_model=UniqueCharsResponse)
def analyze_unique_chars(req: AnalyzeRequest):
    _validate_ciphertext(req.ciphertext)
    chars = get_unique_chars(req.ciphertext)
    return UniqueCharsResponse(characters=chars)


@router.post("/gematria", response_model=GematriaResponse)
def gematria(req: GematriaRequest):
    _validate_ciphertext(req.text)
    value = calculate_gematria(req.text, req.schema_)
    return GematriaResponse(value=value)


@router.post("/hieroglyphs", response_model=HieroglyphResponse)
def hieroglyphs(req: HieroglyphRequest):
    _validate_ciphertext(req.text)
    glyphs = transliterate_to_hieroglyphs(req.text)
    return HieroglyphResponse(glyphs=glyphs)


@router.post("/ai/analyze")
async def ai_analyze(req: AnalyzeRequest):
    _validate_ciphertext(req.ciphertext)
    if req.keyword:
        _validate_key(req.keyword)
    try:
        analysis = await analyze_text_with_ai(
            decrypted_text=req.decrypted_text,
            keyword=req.keyword,
            cipher=req.cipher,
        )
    except OllamaError as e:
        raise HTTPException(status_code=503, detail=str(e))
    return {"analysis": analysis}


@router.post("/ai/suggest-keywords")
async def ai_suggest_keywords(req: KeywordSuggestRequest):
    _validate_ciphertext(req.ciphertext)
    if req.key_length < 1:
        raise HTTPException(status_code=400, detail="key_length must be at least 1")
    try:
        result = await suggest_keyword_with_ai(
            ciphertext=req.ciphertext,
            key_length=req.key_length,
        )
    except OllamaError as e:
        raise HTTPException(status_code=503, detail=str(e))
    return result


@router.get("/ciphers")
def get_ciphers():
    return ciphers


@router.get("/ciphers/{cipher_id}")
def get_cipher(cipher_id: str):
    for cipher in ciphers:
        if cipher["id"] == cipher_id:
            return cipher
    raise HTTPException(status_code=404, detail=f"Cipher with id '{cipher_id}' not found")
