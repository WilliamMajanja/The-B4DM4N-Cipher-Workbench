import { ALPHABET, HEBREW_ALPHABET, GEMATRIA_VALUES, HIEROGLYPH_UNILITERALS } from '../constants.ts';
import { GematriaSchema } from '../types.ts';

// --- Core Decryption Logic ---

export const vigenereDecrypt = (ciphertext: string, key: string): string => {
    if (!key) return ciphertext;
    const sanitizedKey = key.toUpperCase().replace(/[^A-Z]/g, '');
    if (!sanitizedKey) return ciphertext;
    
    let decrypted = '';
    let keyIndex = 0;
    const upperCiphertext = ciphertext.toUpperCase();

    for (let i = 0; i < upperCiphertext.length; i++) {
        const char = upperCiphertext[i];
        if (ALPHABET.includes(char)) {
            const keyChar = sanitizedKey[keyIndex % sanitizedKey.length];
            const shift = ALPHABET.indexOf(keyChar);
            const decryptedCharIndex = (ALPHABET.indexOf(char) - shift + 26) % 26;
            decrypted += ALPHABET[decryptedCharIndex];
            keyIndex++;
        } else {
            // Keep non-alphabetic characters as they are, but don't advance key
            decrypted += char;
        }
    }
    return decrypted;
};

export const caesarDecrypt = (ciphertext: string, shift: number): string => {
    const upperCiphertext = ciphertext.toUpperCase();
    let decrypted = '';
    for (let i = 0; i < upperCiphertext.length; i++) {
        const char = upperCiphertext[i];
        if (ALPHABET.includes(char)) {
            const decryptedCharIndex = (ALPHABET.indexOf(char) - shift + 26) % 26;
            decrypted += ALPHABET[decryptedCharIndex];
        } else {
            decrypted += char;
        }
    }
    return decrypted;
};

export const atbashDecrypt = (ciphertext: string): string => {
    const reversedAlphabet = ALPHABET.split('').reverse().join('');
    const reversedHebrew = HEBREW_ALPHABET.split('').reverse().join('');
    
    let decrypted = '';
    for (const char of ciphertext) {
        let index = ALPHABET.indexOf(char.toUpperCase());
        if (index !== -1) {
            decrypted += reversedAlphabet[index];
            continue;
        }
        index = HEBREW_ALPHABET.indexOf(char);
        if (index !== -1) {
            decrypted += reversedHebrew[index];
            continue;
        }
        decrypted += char;
    }
    return decrypted;
};


// --- Statistical Analysis ---

export const calculateFrequencies = (text: string): { letter: string; frequency: number }[] => {
    const counts: { [key: string]: number } = {};
    const upperText = text.toUpperCase().replace(/[^A-Z]/g, '');
    const textLength = upperText.length;

    if (textLength === 0) {
        return ALPHABET.split('').map(letter => ({ letter, frequency: 0 }));
    }

    for (const letter of ALPHABET) {
        counts[letter] = 0;
    }

    for (const char of upperText) {
        if (counts[char] !== undefined) {
            counts[char]++;
        }
    }
    
    return ALPHABET.split('').map(letter => ({
        letter,
        frequency: (counts[letter] || 0) / textLength,
    }));
};

export const calculateIoC = (text: string): number => {
    const counts: { [key: string]: number } = {};
    const upperText = text.toUpperCase().replace(/[^A-Z]/g, '');
    const N = upperText.length;

    if (N < 2) return 0;

    for (const char of upperText) {
        counts[char] = (counts[char] || 0) + 1;
    }

    let sum = 0;
    for (const letter of ALPHABET) {
        const ni = counts[letter] || 0;
        sum += ni * (ni - 1);
    }

    return sum / (N * (N - 1));
};

export const calculateNgrams = (text: string, n: number): Map<string, number> => {
    const ngrams = new Map<string, number>();
    // Do not convert to upper for esoteric texts
    const cleanedText = text.replace(/[\s.,?।“”]/g, '');
    if (cleanedText.length < n) {
        return ngrams;
    }

    for (let i = 0; i <= cleanedText.length - n; i++) {
        const ngram = cleanedText.substring(i, i + n);
        ngrams.set(ngram, (ngrams.get(ngram) || 0) + 1);
    }
    return ngrams;
};

// --- Kasiski Examination ---

const getFactors = (num: number): number[] => {
    const factors = new Set<number>();
    for (let i = 1; i <= Math.sqrt(num); i++) {
        if (num % i === 0) {
            factors.add(i);
            factors.add(num / i);
        }
    }
    return Array.from(factors).sort((a, b) => a - b);
};

export interface SequenceInfo {
    sequence: string;
    positions: number[];
    distances: number[];
}

export const findRepeatedSequences = (text: string, minLength = 3, maxLength = 6): Map<string, number[]> => {
    const sequences = new Map<string, number[]>();
    const upperText = text.toUpperCase().replace(/[^A-Z]/g, '');
    const len = upperText.length;

    for (let l = maxLength; l >= minLength; l--) {
        for (let i = 0; i <= len - l; i++) {
            const seq = upperText.substring(i, i + l);
            if (!sequences.has(seq)) {
                sequences.set(seq, [i]);
            } else {
                sequences.get(seq)!.push(i);
            }
        }
    }

    const repeatedSequences = new Map<string, number[]>();
    for (const [seq, positions] of sequences.entries()) {
        if (positions.length > 1) {
            repeatedSequences.set(seq, positions);
        }
    }
    return repeatedSequences;
};

export const analyzeDistances = (sequences: Map<string, number[]>): { factors: Map<number, number>; sequenceDetails: SequenceInfo[] } => {
    const factorCounts = new Map<number, number>();
    const sequenceDetails: SequenceInfo[] = [];

    for (const [sequence, positions] of sequences.entries()) {
        const distances: number[] = [];
        for (let i = 1; i < positions.length; i++) {
            const distance = positions[i] - positions[0];
            distances.push(distance);
            const factors = getFactors(distance);
            for (const factor of factors) {
                if(factor > 1 && factor <= 20) { 
                    factorCounts.set(factor, (factorCounts.get(factor) || 0) + 1);
                }
            }
        }
        sequenceDetails.push({ sequence, positions, distances });
    }

    return { factors: factorCounts, sequenceDetails };
};

export const calculateIoCForColumns = (text: string, keyLength: number): number => {
    if (keyLength <= 0) return 0;
    const upperText = text.toUpperCase().replace(/[^A-Z]/g, '');
    if (upperText.length < keyLength) return 0;
    
    const columns: string[] = Array(keyLength).fill('');

    for (let i = 0; i < upperText.length; i++) {
        columns[i % keyLength] += upperText[i];
    }
    
    const iocSum = columns.reduce((sum, col) => sum + calculateIoC(col), 0);
    return iocSum / keyLength;
};

// --- Textual & Esoteric Analysis ---

export const getUniqueChars = (text: string): string[] => {
    return Array.from(new Set(text.split(''))).sort();
};


export const calculateGematria = (text: string, schema: GematriaSchema): number => {
    const values = GEMATRIA_VALUES[schema];
    let sum = 0;
    
    if (schema === 'sanskrit_katapayadi') {
        // Normalize to separate base characters from combining marks (vowel signs), then remove the marks.
        const normalizedText = text.normalize('NFD').replace(/[\u093e-\u094c\u094d\u0902\u0903]/g, '');
        for (const char of normalizedText) {
            if (values[char] !== undefined) {
                sum += values[char];
            }
        }
        return sum;
    }
    
    const textToProcess = (schema === 'pythagorean' || schema === 'chaldean' || schema === 'latin_roman') ? text.toUpperCase() : text;
    for (const char of textToProcess) {
        if (values[char] !== undefined) {
            sum += values[char];
        }
    }
    return sum;
};

export const transliterateToHieroglyphs = (text: string): string => {
    if (!text) return '';
    const upperText = text.toUpperCase();
    let result = '';
    let i = 0;
    while (i < upperText.length) {
        // Check for two-character glyphs first (e.g., 'SH', 'TH')
        if (i + 1 < upperText.length) {
            const twoChar = upperText.substring(i, i + 2);
            if (HIEROGLYPH_UNILITERALS[twoChar]) {
                result += HIEROGLYPH_UNILITERALS[twoChar].glyph;
                i += 2;
                continue;
            }
        }
        // Check for one-character glyphs
        const oneChar = upperText[i];
        if (HIEROGLYPH_UNILITERALS[oneChar]) {
            result += HIEROGLYPH_UNILITERALS[oneChar].glyph;
        }
        i++;
    }
    return result;
};