import React, { useState } from 'react';
import LoadingSpinner from './ui/LoadingSpinner.tsx';
import { sendMinima, isMinimaNode } from '../services/minimaService.ts';

interface MinimaPaymentButtonProps {
    /** Whether the user has already unlocked AI features for this session */
    isUnlocked: boolean;
    /** Callback invoked after a successful Minima payment */
    onPaymentSuccess: () => void;
    /** Whether the Minima node is connected */
    isConnected: boolean;
    /** The destination address for the tip */
    tipAddress: string;
}

const AI_UNLOCK_TIP_AMOUNT = 0.01; // Minima
const AI_UNLOCK_TIP_MEMO = 'B4DM4N Cipher Workbench – AI Analysis Tip';

const MinimaPaymentButton: React.FC<MinimaPaymentButtonProps> = ({
    isUnlocked,
    onPaymentSuccess,
    isConnected,
    tipAddress,
}) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePayment = async () => {
        setIsProcessing(true);
        setError(null);
        try {
            await sendMinima(AI_UNLOCK_TIP_AMOUNT, tipAddress);
            window.MDS?.notify(AI_UNLOCK_TIP_MEMO);
            onPaymentSuccess();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Transaction failed.';
            setError(message);
        } finally {
            setIsProcessing(false);
        }
    };

    if (isUnlocked) {
        return (
            <span className="inline-flex items-center gap-1 text-xs text-green-400">
                ✓ AI features unlocked via Minima tip
            </span>
        );
    }

    if (!isMinimaNode() || !isConnected) {
        return null; // Don't show payment button outside Minima node or when not connected
    }

    return (
        <div className="inline-flex flex-col items-center gap-1">
            <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg px-3 py-1.5 transition-colors duration-200 text-sm"
            >
                {isProcessing ? <LoadingSpinner /> : null}
                {isProcessing ? 'Processing…' : `⬡ Tip ${AI_UNLOCK_TIP_AMOUNT} Minima for AI`}
            </button>
            {error && <span className="text-xs text-red-400">{error}</span>}
        </div>
    );
};

export default MinimaPaymentButton;
