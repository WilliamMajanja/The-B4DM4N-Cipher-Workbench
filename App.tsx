import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ciphers, customCipherTemplate } from './data/ciphers.ts';
import { analyzeTextWithGemini, suggestKeywordWithGemini } from './services/geminiService.ts';
import { vigenereDecrypt, caesarDecrypt, atbashDecrypt, calculateFrequencies, calculateIoC } from './utils/crypto.ts';
import { Cipher, AnalysisTab, SolverType, KeywordSuggestion } from './types.ts';

// Layout and UI Components
import Header from './components/layout/Header.tsx';
import CipherSelector from './components/CipherSelector.tsx';
import CipherDetails from './components/CipherDetails.tsx';
import SolverControls from './components/SolverControls.tsx';
import AnalysisDashboard from './components/AnalysisDashboard.tsx';
import KeyLengthAnalysis from './components/KeyLengthAnalysis.tsx';


const ApiKeyWarningBanner: React.FC = () => {
    const bannerRoot = document.getElementById('api-warning-banner');
    if (!bannerRoot) return null;

    return createPortal(
        <div className="bg-red-800 text-white text-center p-2 font-semibold text-sm">
            Warning: VITE_API_KEY is not configured in your .env file. AI features will be disabled.
        </div>,
        bannerRoot
    );
};


const App: React.FC = () => {
    const [selectedCipherId, setSelectedCipherId] = useState<string>('k4');
    
    const selectedCipher = useMemo<Cipher>(() => {
        return ciphers.find(c => c.id === selectedCipherId) || 
               (selectedCipherId === 'custom' ? customCipherTemplate : ciphers[0]);
    }, [selectedCipherId]);

    const [activeCiphertext, setActiveCiphertext] = useState<string>(selectedCipher.ciphertext);
    const [keyword, setKeyword] = useState<string>(selectedCipher.suggestedKeyword || '');
    const [caesarShift, setCaesarShift] = useState<number>(3);
    const [customSolver, setCustomSolver] = useState<SolverType>('VIGENERE');
    
    const [geminiAnalysis, setGeminiAnalysis] = useState<string>('');
    const [isLoadingGemini, setIsLoadingGemini] = useState<boolean>(false);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState<boolean>(false);
    const [keywordSuggestions, setKeywordSuggestions] = useState<KeywordSuggestion[]>([]);
    
    const [activeTab, setActiveTab] = useState<AnalysisTab>('frequency');
    const [isApiKeyMissing] = useState(!process.env.API_KEY);

    const activeSolverType = selectedCipherId === 'custom' ? customSolver : selectedCipher.type as SolverType;

    // Effect to reset working state when the cipher selection changes
    useEffect(() => {
        const newCipher = ciphers.find(c => c.id === selectedCipherId) || 
                          (selectedCipherId === 'custom' ? customCipherTemplate : ciphers[0]);
        
        setKeyword(newCipher.suggestedKeyword || '');
        setCaesarShift(3);
        setActiveCiphertext(newCipher.ciphertext);
        setGeminiAnalysis('');
        setKeywordSuggestions([]);

        if (['VIGENERE', 'CAESAR', 'ATBASH'].includes(newCipher.type)) {
            setActiveTab('frequency');
        } else {
            setActiveTab('textual');
        }
    }, [selectedCipherId]);

    // Derived state for decrypted text
    const decryptedText = useMemo(() => {
        switch (activeSolverType) {
            case 'VIGENERE':
                return vigenereDecrypt(activeCiphertext, keyword);
            case 'CAESAR':
                return caesarDecrypt(activeCiphertext, caesarShift);
            case 'ATBASH':
                return atbashDecrypt(activeCiphertext);
            default:
                return '';
        }
    }, [activeCiphertext, keyword, caesarShift, activeSolverType]);

    const ciphertextFrequencies = useMemo(() => calculateFrequencies(activeCiphertext), [activeCiphertext]);
    const decryptedTextFrequencies = useMemo(() => calculateFrequencies(decryptedText), [decryptedText]);
    const ciphertextIoC = useMemo(() => calculateIoC(activeCiphertext), [activeCiphertext]);
    const decryptedTextIoC = useMemo(() => calculateIoC(decryptedText), [decryptedText]);

    const handleMainAnalysisClick = async () => {
        setIsLoadingGemini(true);
        setGeminiAnalysis('');

        const cipherForAnalysis: Cipher = {
            ...selectedCipher,
            ciphertext: activeCiphertext,
        };

        const analysis = await analyzeTextWithGemini(decryptedText, keyword, cipherForAnalysis);
    
        setGeminiAnalysis(analysis);
        setIsLoadingGemini(false);
        setActiveTab('ai');
    };
    
    const handleSuggestKeywords = async () => {
        setIsLoadingSuggestions(true);
        setKeywordSuggestions([]);
        try {
            // Use key length from current keyword, or a common default
            const keyLength = keyword.length > 0 ? keyword.length : (activeCiphertext.length > 50 ? 8 : 5);
            const result = await suggestKeywordWithGemini(activeCiphertext, keyLength);
            setKeywordSuggestions(result.suggestions);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingSuggestions(false);
        }
    };
    
    const handleKeywordSelectAndAnalyze = (selectedKeyword: string) => {
        setKeyword(selectedKeyword);
        setIsLoadingGemini(true);
        setGeminiAnalysis('');
    
        const specificDecryptedText = vigenereDecrypt(activeCiphertext, selectedKeyword);
        const cipherForAnalysis: Cipher = {
            ...selectedCipher,
            ciphertext: activeCiphertext,
        };
    
        analyzeTextWithGemini(specificDecryptedText, selectedKeyword, cipherForAnalysis)
            .then(analysis => {
                setGeminiAnalysis(analysis);
                setIsLoadingGemini(false);
                setActiveTab('ai');
            })
            .catch(error => {
                console.error("Analysis failed:", error);
                setIsLoadingGemini(false);
            });
    };

    const isEditable = ['ESOTERIC', 'PUZZLE'].includes(selectedCipher.type) || selectedCipherId === 'custom';
    const showSolverControls = ['VIGENERE', 'CAESAR', 'ATBASH'].includes(activeSolverType);
    const showKeyLengthAnalysis = activeSolverType === 'VIGENERE';

    return (
        <div className="bg-gray-900 text-gray-200 min-h-screen font-sans p-4 sm:p-6 md:p-8">
            {isApiKeyMissing && <ApiKeyWarningBanner />}
            <div className="max-w-7xl mx-auto">
                <Header />

                <main>
                    <CipherSelector
                        selectedCipherId={selectedCipherId}
                        setSelectedCipherId={setSelectedCipherId}
                    />

                    <CipherDetails
                        selectedCipher={selectedCipher}
                        activeCiphertext={activeCiphertext}
                        setActiveCiphertext={setActiveCiphertext}
                        isEditable={isEditable}
                        handleMainAnalysisClick={handleMainAnalysisClick}
                        isLoadingGemini={isLoadingGemini}
                    />
                    
                    {showSolverControls && (
                        <SolverControls
                            selectedCipherId={selectedCipherId}
                            activeSolverType={activeSolverType}
                            customSolver={customSolver}
                            setCustomSolver={setCustomSolver}
                            keyword={keyword}
                            setKeyword={setKeyword}
                            caesarShift={caesarShift}
                            setCaesarShift={setCaesarShift}
                            handleSuggestKeywords={handleSuggestKeywords}
                            isLoadingSuggestions={isLoadingSuggestions}
                            keywordSuggestions={keywordSuggestions}
                            handleKeywordSelectAndAnalyze={handleKeywordSelectAndAnalyze}
                            decryptedText={decryptedText}
                        />
                    )}
                    
                    {showKeyLengthAnalysis && (
                        <KeyLengthAnalysis ciphertext={activeCiphertext} />
                    )}
                    
                    <AnalysisDashboard
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        showSolverControls={showSolverControls}
                        ciphertextIoC={ciphertextIoC}
                        decryptedTextIoC={decryptedTextIoC}
                        ciphertextFrequencies={ciphertextFrequencies}
                        decryptedTextFrequencies={decryptedTextFrequencies}
                        activeCiphertext={activeCiphertext}
                        decryptedText={decryptedText}
                        selectedCipherId={selectedCipherId}
                        isLoadingGemini={isLoadingGemini}
                        geminiAnalysis={geminiAnalysis}
                    />
                </main>
            </div>
        </div>
    );
};

export default App;
