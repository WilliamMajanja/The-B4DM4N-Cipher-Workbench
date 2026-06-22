import math
import unicodedata
import re
from app.services.constants import (
    ALPHABET, HEBREW_ALPHABET, GEMATRIA_VALUES, HIEROGLYPH_UNILITERALS,
)


def vigenere_decrypt(ciphertext: str, key: str) -> str:
    if not key:
        return ciphertext
    sanitized_key = re.sub(r'[^A-Z]', '', key.upper())
    if not sanitized_key:
        return ciphertext

    decrypted: list[str] = []
    key_index = 0
    upper_ciphertext = ciphertext.upper()
    key_len = len(sanitized_key)

    for char in upper_ciphertext:
        if char in ALPHABET:
            shift = ALPHABET.index(sanitized_key[key_index % key_len])
            decrypted_index = (ALPHABET.index(char) - shift) % 26
            decrypted.append(ALPHABET[decrypted_index])
            key_index += 1
        else:
            decrypted.append(char)

    return ''.join(decrypted)


def caesar_decrypt(ciphertext: str, shift: int) -> str:
    shift = shift % 26
    decrypted: list[str] = []
    for char in ciphertext.upper():
        if char in ALPHABET:
            decrypted_index = (ALPHABET.index(char) - shift) % 26
            decrypted.append(ALPHABET[decrypted_index])
        else:
            decrypted.append(char)
    return ''.join(decrypted)


def atbash_decrypt(ciphertext: str) -> str:
    reversed_alphabet = ALPHABET[::-1]
    reversed_hebrew = HEBREW_ALPHABET[::-1]
    decrypted: list[str] = []
    for char in ciphertext:
        idx = ALPHABET.find(char.upper())
        if idx != -1:
            decrypted.append(reversed_alphabet[idx])
            continue
        idx = HEBREW_ALPHABET.find(char)
        if idx != -1:
            decrypted.append(reversed_hebrew[idx])
            continue
        decrypted.append(char)
    return ''.join(decrypted)


def calculate_frequencies(text: str) -> list[dict]:
    counts: dict[str, int] = {}
    upper_text = re.sub(r'[^A-Z]', '', text.upper())
    text_length = len(upper_text)

    if text_length == 0:
        return [{'letter': letter, 'frequency': 0.0} for letter in ALPHABET]

    for letter in ALPHABET:
        counts[letter] = 0

    for char in upper_text:
        counts[char] = counts.get(char, 0) + 1

    return [
        {'letter': letter, 'frequency': counts[letter] / text_length}
        for letter in ALPHABET
    ]


def calculate_ioc(text: str) -> float:
    upper_text = re.sub(r'[^A-Z]', '', text.upper())
    N = len(upper_text)
    if N < 2:
        return 0.0

    counts: dict[str, int] = {}
    for char in upper_text:
        counts[char] = counts.get(char, 0) + 1

    total = sum(ni * (ni - 1) for ni in counts.values())
    return total / (N * (N - 1))


def calculate_ngrams(text: str, n: int) -> dict[str, int]:
    ngrams: dict[str, int] = {}
    cleaned = re.sub(r'[\s.,?\u201c\u201d।]', '', text)
    if len(cleaned) < n:
        return ngrams

    for i in range(len(cleaned) - n + 1):
        ngram = cleaned[i:i + n]
        ngrams[ngram] = ngrams.get(ngram, 0) + 1

    return ngrams


def _get_factors(num: int) -> list[int]:
    if num <= 0:
        return []
    factors: set[int] = set()
    for i in range(1, int(math.isqrt(num)) + 1):
        if num % i == 0:
            factors.add(i)
            factors.add(num // i)
    return sorted(factors)


def find_repeated_sequences(
    text: str, min_length: int = 3, max_length: int = 6
) -> dict[str, list[int]]:
    sequences: dict[str, list[int]] = {}
    upper_text = re.sub(r'[^A-Z]', '', text.upper())
    text_len = len(upper_text)

    for l in range(max_length, min_length - 1, -1):
        for i in range(text_len - l + 1):
            seq = upper_text[i:i + l]
            if seq not in sequences:
                sequences[seq] = [i]
            else:
                sequences[seq].append(i)

    return {
        seq: positions
        for seq, positions in sequences.items()
        if len(positions) > 1
    }


def analyze_distances(
    sequences: dict[str, list[int]]
) -> tuple[dict[int, int], list[dict]]:
    factor_counts: dict[int, int] = {}
    sequence_details: list[dict] = []

    for sequence, positions in sequences.items():
        distances: list[int] = []
        for i in range(1, len(positions)):
            distance = positions[i] - positions[0]
            distances.append(distance)
            for factor in _get_factors(distance):
                if 1 < factor <= 20:
                    factor_counts[factor] = factor_counts.get(factor, 0) + 1
        sequence_details.append({
            'sequence': sequence,
            'positions': positions,
            'distances': distances,
        })

    return factor_counts, sequence_details


def calculate_ioc_for_columns(text: str, key_length: int) -> float:
    if key_length <= 0:
        return 0.0
    upper_text = re.sub(r'[^A-Z]', '', text.upper())
    if len(upper_text) < key_length:
        return 0.0

    columns: list[str] = [''] * key_length
    for i, char in enumerate(upper_text):
        columns[i % key_length] += char

    ioc_sum = sum(calculate_ioc(col) for col in columns)
    return ioc_sum / key_length


def get_unique_chars(text: str) -> list[str]:
    return sorted(set(text))


def calculate_gematria(text: str, schema: str) -> int:
    values = GEMATRIA_VALUES[schema]
    total = 0

    if schema == 'sanskrit_katapayadi':
        normalized = unicodedata.normalize('NFD', text)
        cleaned = re.sub(r'[\u093e-\u094c\u094d\u0902\u0903]', '', normalized)
        for char in cleaned:
            total += values.get(char, 0)
        return total

    if schema in ('pythagorean', 'chaldean', 'latin_roman'):
        text = text.upper()

    for char in text:
        total += values.get(char, 0)

    return total


def transliterate_to_hieroglyphs(text: str) -> str:
    if not text:
        return ''
    upper_text = text.upper()
    result: list[str] = []
    i = 0
    while i < len(upper_text):
        if i + 1 < len(upper_text):
            two_char = upper_text[i:i + 2]
            if two_char in HIEROGLYPH_UNILITERALS:
                result.append(HIEROGLYPH_UNILITERALS[two_char]['glyph'])
                i += 2
                continue
        one_char = upper_text[i]
        if one_char in HIEROGLYPH_UNILITERALS:
            result.append(HIEROGLYPH_UNILITERALS[one_char]['glyph'])
        i += 1
    return ''.join(result)
