import React from 'react';
import LoadingSpinner from './ui/LoadingSpinner.tsx';
import { MinimaUser } from '../types.ts';

interface MinimaStatusButtonProps {
    minimaUser: MinimaUser | null;
    isConnecting: boolean;
    isMinimaAvailable: boolean;
    onConnect: () => void;
}

const MinimaStatusButton: React.FC<MinimaStatusButtonProps> = ({
    minimaUser,
    isConnecting,
    isMinimaAvailable,
    onConnect,
}) => {
    if (minimaUser) {
        const shortKey = minimaUser.publicKey.length > 12
            ? `${minimaUser.publicKey.slice(0, 6)}…${minimaUser.publicKey.slice(-4)}`
            : minimaUser.publicKey;

        return (
            <div className="flex items-center gap-2 bg-teal-900/40 border border-teal-500/30 rounded-full px-4 py-1.5">
                <span className="text-teal-300 text-sm font-mono" title={`Public key: ${minimaUser.publicKey}`}>
                    ⬡ {shortKey}
                </span>
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" title="Connected to Minima node" />
            </div>
        );
    }

    if (!isMinimaAvailable) {
        return (
            <div
                className="flex items-center gap-2 bg-gray-700/40 border border-gray-600/30 rounded-full px-4 py-1.5"
                title="Run this MiniDApp inside a Minima node to connect."
            >
                <span className="text-gray-500 text-sm">⬡ Not in Minima node</span>
            </div>
        );
    }

    return (
        <button
            onClick={onConnect}
            disabled={isConnecting}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-full px-4 py-1.5 transition-colors duration-200 text-sm"
        >
            {isConnecting ? <LoadingSpinner /> : null}
            {isConnecting ? 'Connecting…' : '⬡ Connect Minima'}
        </button>
    );
};

export default MinimaStatusButton;
