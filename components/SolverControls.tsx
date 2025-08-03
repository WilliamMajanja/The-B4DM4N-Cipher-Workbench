import React from 'react';
import LoadingSpinner from './ui/LoadingSpinner.tsx';
import { SolverType, KeywordSuggestion } from '../types.ts';

interface SolverControlsProps {
    selectedCipherId: string;
    activeSolverType: SolverType;
    customSolver: SolverType;
    setCustomSolver: (solver: SolverType) => void;
    keyword: string;
    setKeyword: (key: string) => void;
    caesarShift: number;
    setCaesarShift: (shift: number) => void;
    handleSuggestKeywords: () => void;
    isLoadingSuggestions: boolean;
    keywordSuggestions: KeywordSuggestion[];
    handleKeywordSelectAndAnalyze: (keyword: string) => void;
    decryptedText: string;
}

const SolverControls: React.FC<SolverControlsProps> = ({
    selectedCipherId,
    activeSolverType,
    customSolver,
    setCustomSolver,
    keyword,
    setKeyword,
    caesarShift,
    setCaesarShift,
    handleSuggestKeywords,
    isLoadingSuggestions,
    keywordSuggestions,
    handleKeywordSelectAndAnalyze,
    decryptedText,
}) => {
    return (
        <div className="bg-gray-800 shadow-xl rounded-lg p-6 mb-8 ring-1 ring-white/10">
            <h2 className="text-xl font-semibold text-green-300 mb-4 font-mono">3. Solver Controls</h2>
            {selectedCipherId === 'custom' && (
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Solver Type</label>
                    <select value={customSolver} onChange={(e) => setCustomSolver(e.target.value as SolverType)} className="w-full md:w-1/3 bg-gray-900 border border-gray-600 text-green-300 font-mono rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none transition">
                        <option value="VIGENERE">Vigenère</option>
                        <option value="CAESAR">Caesar</option>
                        <option value="ATBASH">Atbash</option>
                    </select>
                </div>
            )}

            {activeSolverType === 'VIGENERE' && (
                <div className="space-y-4">
                    <div>
                        <label htmlFor="keyword" className="block text-sm font-medium text-gray-400 mb-2">Enter Keyword</label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input type="text" id="keyword" value={keyword} onChange={(e) => setKeyword(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))} placeholder="e.g., KRYPTOS" className="flex-grow bg-gray-900 border border-gray-600 text-green-300 text-xl font-mono tracking-widest rounded-md p-3 focus:ring-2 focus:ring-green-500 outline-none transition" />
                            <button onClick={handleSuggestKeywords} disabled={isLoadingSuggestions || !process.env.API_KEY} className="flex items-center justify-center bg-sky-600 hover:bg-sky-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200">
                                {isLoadingSuggestions ? <LoadingSpinner size="h-4 w-4" /> : null} Suggest Keywords
                            </button>
                        </div>
                    </div>
                    {keywordSuggestions.length > 0 && (
                        <div className="p-4 bg-gray-900/50 rounded-lg">
                            <h4 className="text-gray-300 font-semibold mb-2">AI Keyword Suggestions (click to analyze):</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                {keywordSuggestions.map(s => (
                                    <button 
                                      key={s.keyword} 
                                      onClick={() => handleKeywordSelectAndAnalyze(s.keyword)} 
                                      title={s.reason} 
                                      className={`p-2 hover:bg-sky-700 rounded-md font-mono text-center truncate transition-colors ${
                                        s.keyword === keyword ? 'bg-sky-600 text-white ring-2 ring-sky-400' : 'bg-sky-800 text-sky-200'
                                      }`}>
                                        {s.keyword}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeSolverType === 'CAESAR' && (
                <div>
                    <label htmlFor="caesar-shift" className="block text-sm font-medium text-gray-400 mb-2">Shift Amount: <span className="font-mono text-lg text-green-300">{caesarShift}</span></label>
                    <input type="range" id="caesar-shift" min="1" max="25" value={caesarShift} onChange={(e) => setCaesarShift(parseInt(e.target.value, 10))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500" />
                </div>
            )}

             {activeSolverType === 'ATBASH' && (
                <p className="text-gray-400">The Atbash cipher is a simple substitution cipher where the first letter of the alphabet is replaced by the last, the second by the second to last, and so on. No key is required.</p>
            )}

            <div className="mt-6">
                <h3 className="block text-sm font-medium text-gray-400 mb-2">Decrypted Plaintext</h3>
                <div className="w-full min-h-[5.5rem] bg-gray-900 border border-gray-700 rounded-md p-3 font-mono text-gray-300 tracking-wider overflow-y-auto text-sm">
                    {decryptedText}
                </div>
            </div>
        </div>
    );
};

export default SolverControls;
