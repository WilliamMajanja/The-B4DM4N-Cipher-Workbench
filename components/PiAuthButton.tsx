import React from 'react';
import LoadingSpinner from './ui/LoadingSpinner.tsx';
import { PiUser } from '../types.ts';

interface PiAuthButtonProps {
    piUser: PiUser | null;
    isAuthenticating: boolean;
    isPiAvailable: boolean;
    onLogin: () => void;
}

const PiAuthButton: React.FC<PiAuthButtonProps> = ({
    piUser,
    isAuthenticating,
    isPiAvailable,
    onLogin,
}) => {
    if (piUser) {
        return (
            <div className="flex items-center gap-2 bg-purple-900/40 border border-purple-500/30 rounded-full px-4 py-1.5">
                <span className="text-purple-300 text-sm font-mono" title={`UID: ${piUser.uid}`}>
                    π {piUser.username}
                </span>
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" title="Connected" />
            </div>
        );
    }

    if (!isPiAvailable) {
        return (
            <div className="flex items-center gap-2 bg-gray-700/40 border border-gray-600/30 rounded-full px-4 py-1.5" title="Open this app inside the Pi Browser to connect your Pi wallet.">
                <span className="text-gray-500 text-sm">π Not in Pi Browser</span>
            </div>
        );
    }

    return (
        <button
            onClick={onLogin}
            disabled={isAuthenticating}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-full px-4 py-1.5 transition-colors duration-200 text-sm"
        >
            {isAuthenticating ? <LoadingSpinner /> : null}
            {isAuthenticating ? 'Connecting…' : 'π Connect Pi Wallet'}
        </button>
    );
};

export default PiAuthButton;
