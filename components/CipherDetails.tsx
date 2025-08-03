import React from 'react';
import LoadingSpinner from './ui/LoadingSpinner.tsx';
import { Cipher } from '../types.ts';

interface CipherDetailsProps {
    selectedCipher: Cipher;
    activeCiphertext: string;
    setActiveCiphertext: (text: string) => void;
    isEditable: boolean;
    handleMainAnalysisClick: () => void;
    isLoadingGemini: boolean;
}

const CipherDetails: React.FC<CipherDetailsProps> = ({
    selectedCipher,
    activeCiphertext,
    setActiveCiphertext,
    isEditable,
    handleMainAnalysisClick,
    isLoadingGemini,
}) => {
    return (
        <div className="bg-gray-800 shadow-xl rounded-lg p-6 mb-8 ring-1 ring-white/10">
            <h2 className="text-xl font-semibold text-green-300 mb-2 font-mono">2. Analysis Subject</h2>
            <p className="text-sm text-gray-400 mb-4">{selectedCipher.description}</p>
            {selectedCipher.notes && <p className="text-xs text-amber-400 mb-4 p-2 bg-amber-900/20 rounded-md">Note: {selectedCipher.notes}</p>}
            
            <h3 className="text-lg text-gray-400 font-mono mb-2">Source Text:</h3>
             <textarea
                value={activeCiphertext}
                onChange={(e) => setActiveCiphertext(e.target.value)}
                readOnly={!isEditable}
                placeholder="Paste your ciphertext here"
                aria-label="Ciphertext input"
                className={`w-full h-40 bg-gray-900/50 border border-gray-600 text-gray-300 font-mono text-base tracking-wider rounded-md p-3 focus:ring-2 focus:ring-green-500 outline-none transition ${!isEditable ? 'select-all' : ''}`}
            />

            {selectedCipher.plaintext && (
                <div className="mt-4">
                    <h3 className="text-lg text-cyan-400 font-mono mb-2">Solved Plaintext:</h3>
                    <p className="text-cyan-200 font-mono text-base tracking-wider break-all bg-cyan-900/20 p-3 rounded-md">
                        {selectedCipher.plaintext}
                    </p>
                </div>
            )}
            
            <div className="mt-6 text-center">
                <button 
                    onClick={handleMainAnalysisClick}
                    disabled={isLoadingGemini || !process.env.API_KEY}
                    className="w-full md:w-1/2 flex items-center justify-center bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 text-lg">
                    {isLoadingGemini ? <LoadingSpinner /> : null}
                    {isLoadingGemini ? `Analyzing ${selectedCipher.name}...` : `Analyze with Gemini AI`}
                </button>
            </div>
        </div>
    );
};

export default CipherDetails;
