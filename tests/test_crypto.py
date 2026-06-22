import sys
import pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent.parent))

import pytest
from app.services.crypto import (
    vigenere_decrypt, caesar_decrypt, atbash_decrypt,
    calculate_frequencies, calculate_ioc, calculate_ngrams,
    find_repeated_sequences, get_unique_chars,
    calculate_gematria, transliterate_to_hieroglyphs,
)


VIG_CIPHERTEXT = 'RIJVSUYVJN'
VIG_KEY = 'KEY'
VIG_PLAINTEXT = 'HELLOWORLD'


class TestVigenereDecrypt:
    def test_decrypts_known_pair(self):
        result = vigenere_decrypt(VIG_CIPHERTEXT, VIG_KEY)
        assert result == VIG_PLAINTEXT

    def test_empty_key_returns_ciphertext(self):
        ciphertext = 'HELLO'
        assert vigenere_decrypt(ciphertext, '') == ciphertext

    def test_key_with_non_alpha_chars(self):
        result = vigenere_decrypt(VIG_CIPHERTEXT, 'KEY!')
        assert result == VIG_PLAINTEXT


class TestCaesarDecrypt:
    def test_shift_3(self):
        assert caesar_decrypt('KHOOR', 3) == 'HELLO'

    def test_shift_0(self):
        assert caesar_decrypt('HELLO', 0) == 'HELLO'

    def test_shift_26(self):
        assert caesar_decrypt('HELLO', 26) == 'HELLO'

    def test_shift_negative(self):
        assert caesar_decrypt('EBIIL', -3) == 'HELLO'

    def test_shift_wrap_around(self):
        assert caesar_decrypt('A', 1) == 'Z'

    def test_preserves_non_alpha(self):
        assert caesar_decrypt('KHOOR ZRUOG!', 3) == 'HELLO WORLD!'


class TestAtbashDecrypt:
    def test_simple_known_case(self):
        assert atbash_decrypt('ABC') == 'ZYX'

    def test_reversible(self):
        assert atbash_decrypt(atbash_decrypt('HELLO')) == 'HELLO'

    def test_hebrew_characters(self):
        result = atbash_decrypt('אבג')
        assert isinstance(result, str) and len(result) == 3

    def test_preserves_non_alpha(self):
        assert atbash_decrypt('A B C') == 'Z Y X'


class TestCalculateFrequencies:
    def test_returns_26_entries(self):
        result = calculate_frequencies('HELLO WORLD')
        assert len(result) == 26

    def test_frequencies_sum_to_one(self):
        result = calculate_frequencies('THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG')
        total = sum(r['frequency'] for r in result)
        assert abs(total - 1.0) < 1e-10

    def test_empty_text_returns_zero_frequencies(self):
        result = calculate_frequencies('')
        assert all(r['frequency'] == 0.0 for r in result)
        assert len(result) == 26


class TestCalculateIoc:
    def test_zero_for_n_less_than_2(self):
        assert calculate_ioc('') == 0.0
        assert calculate_ioc('A') == 0.0

    def test_returns_float(self):
        result = calculate_ioc('HELLO WORLD')
        assert isinstance(result, float)
        assert 0.0 <= result <= 1.0


class TestCalculateNgrams:
    def test_returns_correct_counts(self):
        result = calculate_ngrams('ABCABC', 3)
        assert result['ABC'] == 2
        assert len(result) == 3

    def test_returns_empty_for_short_text(self):
        assert calculate_ngrams('AB', 3) == {}


class TestFindRepeatedSequences:
    def test_finds_known_repeat(self):
        text = 'ABCXYZABC'
        result = find_repeated_sequences(text)
        assert 'ABC' in result
        assert result['ABC'] == [0, 6]

    def test_returns_empty_dict_for_no_repeats(self):
        result = find_repeated_sequences('ABCDEF')
        assert result == {}


class TestGetUniqueChars:
    def test_sorts_correctly(self):
        result = get_unique_chars('CBA')
        assert result == ['A', 'B', 'C']

    def test_removes_duplicates(self):
        result = get_unique_chars('AABBCC')
        assert result == ['A', 'B', 'C']


class TestCalculateGematria:
    def test_pythagorean_abc(self):
        assert calculate_gematria('ABC', 'pythagorean') == 6

    def test_chaldean_abc(self):
        assert calculate_gematria('ABC', 'chaldean') == 6

    def test_pythagorean_hello(self):
        assert calculate_gematria('HELLO', 'pythagorean') == 8 + 5 + 3 + 3 + 6

    def test_unknown_schema_raises_key_error(self):
        with pytest.raises(KeyError):
            calculate_gematria('ABC', 'nonexistent')


class TestTransliterateToHieroglyphs:
    def test_returns_glyphs_for_ptolomy(self):
        result = transliterate_to_hieroglyphs('PTOLOMY')
        assert len(result) == 7
        assert isinstance(result, str)

    def test_empty_string(self):
        assert transliterate_to_hieroglyphs('') == ''

    def test_preserves_unknown_chars(self):
        result = transliterate_to_hieroglyphs('PT1')
        assert isinstance(result, str)
