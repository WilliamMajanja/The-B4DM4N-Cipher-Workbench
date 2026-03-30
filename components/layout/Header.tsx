import React from 'react';
import PiAuthButton from '../PiAuthButton.tsx';
import { PiUser } from '../../types.ts';

interface HeaderProps {
    piUser: PiUser | null;
    isAuthenticating: boolean;
    isPiAvailable: boolean;
    onPiLogin: () => void;
}

const Header: React.FC<HeaderProps> = ({ piUser, isAuthenticating, isPiAvailable, onPiLogin }) => (
    <header className="text-center mb-8">
        <div className="flex justify-end mb-2">
            <PiAuthButton
                piUser={piUser}
                isAuthenticating={isAuthenticating}
                isPiAvailable={isPiAvailable}
                onLogin={onPiLogin}
            />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-green-400 font-mono tracking-wider">
            The B4DM4N Cipher Workbench
        </h1>
        <p className="text-gray-400 mt-2">
            A decentralized workbench for serious cryptanalysis and textual interpretation — powered by Pi Network.
        </p>
    </header>
);

export default Header;
