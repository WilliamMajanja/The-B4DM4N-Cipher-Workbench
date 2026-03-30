import React from 'react';
import MinimaStatusButton from '../MinimaStatusButton.tsx';
import { MinimaUser } from '../../types.ts';

interface HeaderProps {
    minimaUser: MinimaUser | null;
    isConnecting: boolean;
    isMinimaAvailable: boolean;
    onMinimaConnect: () => void;
}

const Header: React.FC<HeaderProps> = ({ minimaUser, isConnecting, isMinimaAvailable, onMinimaConnect }) => (
    <header className="text-center mb-8">
        <div className="flex justify-end mb-2">
            <MinimaStatusButton
                minimaUser={minimaUser}
                isConnecting={isConnecting}
                isMinimaAvailable={isMinimaAvailable}
                onConnect={onMinimaConnect}
            />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-green-400 font-mono tracking-wider">
            The B4DM4N Cipher Workbench
        </h1>
        <p className="text-gray-400 mt-2">
            A decentralized workbench for serious cryptanalysis and textual interpretation — powered by Minima.
        </p>
    </header>
);

export default Header;
