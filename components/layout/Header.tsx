import React from 'react';

const Header: React.FC = () => (
    <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-green-400 font-mono tracking-wider">
            The B4DM4N Cipher Workbench
        </h1>
        <p className="text-gray-400 mt-2">
            A workbench for serious cryptanalysis and textual interpretation.
        </p>
    </header>
);

export default Header;
