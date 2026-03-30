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

// --- Pi Network DApp Types ---

export interface PiUser {
    uid: string;
    username: string;
}

export interface PiAuthResult {
    accessToken: string;
    user: PiUser;
}

export interface PiPaymentDTO {
    identifier: string;
    user_uid: string;
    amount: number;
    memo: string;
    metadata: Record<string, unknown>;
    from_address: string;
    to_address: string;
    direction: 'user_to_app' | 'app_to_user';
    status: {
        developer_approved: boolean;
        transaction_verified: boolean;
        developer_completed: boolean;
        cancelled: boolean;
        user_cancelled: boolean;
    };
    transaction: {
        txid: string;
        verified: boolean;
        _link: string;
    } | null;
    created_at: string;
    network: 'Pi Network';
}

export type PiPaymentCallbacks = {
    onReadyForServerApproval: (paymentId: string) => void;
    onReadyForServerCompletion: (paymentId: string, txid: string) => void;
    onCancel: (paymentId: string) => void;
    onError: (error: Error, payment?: PiPaymentDTO) => void;
};