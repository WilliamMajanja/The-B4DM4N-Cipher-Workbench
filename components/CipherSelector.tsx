import React, { useMemo } from 'react';
import { ciphers } from '../data/ciphers.ts';
import { Cipher } from '../types.ts';

interface CipherSelectorProps {
    selectedCipherId: string;
    setSelectedCipherId: (id: string) => void;
}

const CipherSelector: React.FC<CipherSelectorProps> = ({ selectedCipherId, setSelectedCipherId }) => {
    const cipherGroups = useMemo(() => {
        const groups: { [key: string]: Cipher[] } = {
            "Famous Unsolved Ciphers": [],
            "Classical Ciphers": [],
            "Esoteric & Philosophical Texts": [],
            "Puzzles & Challenges": [],
        };

        ciphers.forEach(c => {
            if (c.id === 'k4') groups["Famous Unsolved Ciphers"].push(c);
            else if (['k1', 'k2', 'vicksburg', 'bible_jeremiah'].includes(c.id)) groups["Classical Ciphers"].push(c);
            else if (c.type === 'ESOTERIC') groups["Esoteric & Philosophical Texts"].push(c);
            else if (c.type === 'PUZZLE' || c.type === 'TRANSPOSITION') groups["Puzzles & Challenges"].push(c);
        });
        return groups;
    }, []);

    return (
        <div className="bg-gray-800 shadow-xl rounded-lg p-6 mb-8 ring-1 ring-white/10">
            <label htmlFor="cipher-select" className="block text-xl font-semibold text-green-300 mb-3 font-mono">
                1. Select Text / Cipher
            </label>
            <select 
                id="cipher-select"
                value={selectedCipherId}
                onChange={(e) => setSelectedCipherId(e.target.value)}
                aria-label="Select a cipher to analyze"
                className="w-full bg-gray-900 border border-gray-600 text-green-300 text-lg font-mono rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
            >
                {Object.entries(cipherGroups).map(([groupName, groupCiphers]) => (
                    <optgroup key={groupName} label={groupName} className="font-sans text-gray-400">
                        {groupCiphers.map(cipher => (
                            <option key={cipher.id} value={cipher.id} className="font-mono text-green-300">
                                {cipher.name}
                            </option>
                        ))}
                    </optgroup>
                ))}
                <optgroup label="Custom" className="font-sans text-gray-400">
                    <option value="custom" className="font-mono text-green-300">Custom Cipher...</option>
                </optgroup>
            </select>
        </div>
    );
};

export default CipherSelector;
