export type CipherType = 'VIGENERE' | 'TRANSPOSITION' | 'ESOTERIC' | 'PUZZLE' | 'ATBASH' | 'CAESAR' | 'CUSTOM';

export interface Cipher {
    id: string;
    name: string;
    type: CipherType;
    description: string;
    ciphertext: string;
    plaintext?: string;
    suggestedKeyword?: string;
    notes?: string;
}

export type AnalysisTab = 'frequency' | 'ngram' | 'textual' | 'workspace' | 'ai';

export type SolverType = 'VIGENERE' | 'CAESAR' | 'ATBASH';

export interface KeywordSuggestion {
    keyword: string;
    reason: string;
}

export interface FrequencyData {
    letter: string;
    frequency: number;
}

export type GematriaSchema = 'pythagorean' | 'chaldean' | 'hebrew' | 'latin_roman' | 'greek' | 'sanskrit_katapayadi';