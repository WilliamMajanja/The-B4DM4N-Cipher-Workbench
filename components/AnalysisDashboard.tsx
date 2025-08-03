import React from 'react';
import TabButton from './ui/TabButton.tsx';
import LoadingSpinner from './ui/LoadingSpinner.tsx';
import FrequencyChart from './FrequencyChart.tsx';
import NgramAnalysis from './NgramAnalysis.tsx';
import TextualAnalysis from './TextualAnalysis.tsx';
import Workspace from './Workspace.tsx';
import { AnalysisTab, FrequencyData } from '../types.ts';

interface AnalysisDashboardProps {
    activeTab: AnalysisTab;
    setActiveTab: (tab: AnalysisTab) => void;
    showSolverControls: boolean;
    ciphertextIoC: number;
    decryptedTextIoC: number;
    ciphertextFrequencies: FrequencyData[];
    decryptedTextFrequencies: FrequencyData[];
    activeCiphertext: string;
    decryptedText: string;
    selectedCipherId: string;
    isLoadingGemini: boolean;
    geminiAnalysis: string;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({
    activeTab,
    setActiveTab,
    showSolverControls,
    ciphertextIoC,
    decryptedTextIoC,
    ciphertextFrequencies,
    decryptedTextFrequencies,
    activeCiphertext,
    decryptedText,
    selectedCipherId,
    isLoadingGemini,
    geminiAnalysis
}) => {
    return (
        <div className="bg-gray-800 shadow-xl rounded-lg p-6 my-8 ring-1 ring-white/10">
            <h2 className="text-xl font-semibold text-green-300 mb-4 font-mono">Analysis Dashboard</h2>
            
            <div className="flex border-b border-gray-700 mb-4 overflow-x-auto" role="tablist" aria-label="Cryptanalysis Tools">
                <TabButton title="Frequency" tabName="frequency" activeTab={activeTab} setActiveTab={setActiveTab} disabled={!showSolverControls}/>
                <TabButton title="N-grams" tabName="ngram" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton title="Textual" tabName="textual" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton title="Workspace" tabName="workspace" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton title="AI Analysis" tabName="ai" activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            <div className="p-1 min-h-[24rem]">
               {activeTab === 'frequency' && showSolverControls && (
                   <div role="tabpanel" id="frequency-panel" aria-labelledby="frequency-tab">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            <div className="bg-gray-800/50 p-4 rounded-lg shadow-inner ring-1 ring-white/10">
                                <h3 className="text-lg font-semibold text-green-300 mb-3 text-center">Index of Coincidence (IoC)</h3>
                                <div className="flex justify-around text-center">
                                    <div><p className="text-gray-400 text-sm">Ciphertext</p><p className="text-2xl font-mono text-amber-400">{ciphertextIoC.toFixed(4)}</p></div>
                                    <div><p className="text-gray-400 text-sm">Decrypted</p><p className="text-2xl font-mono text-cyan-400">{decryptedTextIoC.toFixed(4)}</p></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-3 text-center">(Random text ≈ 0.038, English text ≈ 0.067)</p>
                            </div>
                            <div className="bg-gray-800/50 p-4 rounded-lg shadow-inner ring-1 ring-white/10 flex items-center justify-center text-sm text-gray-400 text-center">
                                Frequency analysis helps verify decryptions. A decrypted English text should have letter frequencies (high E, T, A) and an IoC near 0.067.
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96">
                            <FrequencyChart data={ciphertextFrequencies} title="Ciphertext Frequencies" />
                            <FrequencyChart data={decryptedTextFrequencies} title="Decrypted Text Frequencies" />
                        </div>
                   </div>
               )}
               {activeTab === 'ngram' && (
                   <div role="tabpanel" id="ngram-panel" aria-labelledby="ngram-tab">
                       <h3 className="text-lg font-semibold text-green-300 mb-3">Ciphertext N-grams</h3>
                       <NgramAnalysis text={activeCiphertext} />
                       {showSolverControls && (
                        <>
                           <h3 className="text-lg font-semibold text-green-300 mt-6 mb-3">Decrypted Text N-grams</h3>
                           <NgramAnalysis text={decryptedText} />
                        </>
                       )}
                   </div>
               )}
               {activeTab === 'textual' && (
                   <div role="tabpanel" id="textual-panel" aria-labelledby="textual-tab">
                       <TextualAnalysis ciphertext={activeCiphertext} />
                   </div>
               )}
               {activeTab === 'workspace' && (
                   <div role="tabpanel" id="workspace-panel" aria-labelledby="workspace-tab">
                       <Workspace cipherId={selectedCipherId} />
                   </div>
               )}
               {activeTab === 'ai' && (
                   <div role="tabpanel" id="ai-panel" aria-labelledby="ai-tab">
                        <div className="bg-gray-900/50 p-4 rounded-lg shadow-inner flex flex-col justify-between ring-1 ring-white/10 min-h-[24rem]">
                            <div className="flex-grow overflow-auto mb-3 h-80">
                                {isLoadingGemini && <div className="flex justify-center items-center h-full"><LoadingSpinner /> <span className="ml-2">Contacting Gemini AI...</span></div>}
                                {geminiAnalysis && <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">{geminiAnalysis}</pre>}
                                {!isLoadingGemini && !geminiAnalysis && <p className="text-gray-500 text-sm text-center pt-4">Click the "Analyze with Gemini" button to get an AI-powered analysis.</p>}
                            </div>
                        </div>
                   </div>
               )}
            </div>
        </div>
    );
};

export default AnalysisDashboard;
