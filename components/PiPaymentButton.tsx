import React, { useState } from 'react';
import LoadingSpinner from './ui/LoadingSpinner.tsx';
import { createPiPayment, isPiBrowser } from '../services/piNetworkService.ts';

interface PiPaymentButtonProps {
    /** Whether the user has already unlocked AI features for this session */
    isUnlocked: boolean;
    /** Callback invoked after a successful Pi payment */
    onPaymentSuccess: () => void;
    /** Whether a Pi user is authenticated */
    isAuthenticated: boolean;
}

const AI_TIP_AMOUNT = 0.01; // Pi
const AI_TIP_MEMO = 'B4DM4N Cipher Workbench – AI Analysis Tip';

const PiPaymentButton: React.FC<PiPaymentButtonProps> = ({
    isUnlocked,
    onPaymentSuccess,
    isAuthenticated,
}) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePayment = async () => {
        setIsProcessing(true);
        setError(null);
        try {
            await createPiPayment(AI_TIP_AMOUNT, AI_TIP_MEMO, {
                feature: 'ai_analysis',
            });
            onPaymentSuccess();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Payment failed.';
            setError(message);
        } finally {
            setIsProcessing(false);
        }
    };

    if (isUnlocked) {
        return (
            <span className="inline-flex items-center gap-1 text-xs text-green-400">
                ✓ AI features unlocked via Pi tip
            </span>
        );
    }

    if (!isPiBrowser() || !isAuthenticated) {
        return null; // Don't show payment button outside Pi Browser or when not logged in
    }

    return (
        <div className="inline-flex flex-col items-center gap-1">
            <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg px-3 py-1.5 transition-colors duration-200 text-sm"
            >
                {isProcessing ? <LoadingSpinner /> : null}
                {isProcessing ? 'Processing…' : `π Tip ${AI_TIP_AMOUNT} Pi for AI`}
            </button>
            {error && <span className="text-xs text-red-400">{error}</span>}
        </div>
    );
};

export default PiPaymentButton;
