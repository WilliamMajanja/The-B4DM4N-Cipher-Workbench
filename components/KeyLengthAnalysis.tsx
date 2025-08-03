

import React, { useMemo } from 'react';
import { findRepeatedSequences, analyzeDistances, calculateIoCForColumns, SequenceInfo } from '../utils/crypto.ts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label } from 'recharts';

interface KeyLengthAnalysisProps {
    ciphertext: string;
}

const KeyLengthAnalysis: React.FC<KeyLengthAnalysisProps> = ({ ciphertext }) => {
    const kasiskiResults = useMemo(() => {
        if (ciphertext.length < 20) return { sortedFactors: [], sequenceDetails: [] };
        const sequences = findRepeatedSequences(ciphertext);
        const { factors, sequenceDetails } = analyzeDistances(sequences);
        const sortedFactors = Array.from(factors.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
        
        const filteredSequenceDetails = sequenceDetails
            .filter(s => s.distances.length > 0)
            .sort((a, b) => b.sequence.length - a.sequence.length || b.distances.length - a.distances.length)
            .slice(0, 20);

        return { sortedFactors, sequenceDetails: filteredSequenceDetails };
    }, [ciphertext]);

    const iocResults = useMemo(() => {
        const results = [];
        const maxKeyLength = Math.min(20, Math.floor(ciphertext.length / 2));
        if (maxKeyLength < 2) return [];
        for (let len = 2; len <= maxKeyLength; len++) {
            results.push({
                keyLength: len,
                ioc: calculateIoCForColumns(ciphertext, len),
            });
        }
        return results;
    }, [ciphertext]);

    return (
        <div className="bg-gray-800 shadow-xl rounded-lg p-6 mb-8 ring-1 ring-white/10">
            <h2 className="text-xl font-semibold text-green-300 mb-4 font-mono">4. Key Length Analysis</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Kasiski Examination */}
                <div className="bg-gray-800/50 p-4 rounded-lg shadow-inner ring-1 ring-white/10 space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold text-green-300 mb-3 text-center">Kasiski Examination</h3>
                        <p className="text-xs text-gray-400 mb-4 text-center">Finds repeated text sequences to guess the key length. The most common factors of the distances between repeats are likely candidates.</p>
                        <h4 className="font-semibold text-gray-300 mb-2">Most Probable Key Lengths:</h4>
                        <div className="overflow-auto max-h-40 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 rounded-md">
                            <table className="w-full text-sm text-left text-gray-400">
                               <thead className="text-xs text-gray-300 uppercase bg-gray-700/50 sticky top-0">
                                    <tr><th className="px-4 py-2">Key Length</th><th className="px-4 py-2">Factor Count</th></tr>
                               </thead>
                               <tbody>
                                {kasiskiResults.sortedFactors.length > 0 ? kasiskiResults.sortedFactors.map(([factor, count]) => (
                                    <tr key={factor} className="bg-gray-800/50 border-b border-gray-700/50"><td className="px-4 py-1">{factor}</td><td className="px-4 py-1">{count}</td></tr>
                                )) : (
                                    <tr><td colSpan={2} className="text-center italic text-gray-500 py-4">Not enough data for Kasiski test.</td></tr>
                                )}
                               </tbody>
                            </table>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-300 mb-2">Sequence Details Report:</h4>
                         <div className="overflow-auto max-h-48 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 rounded-md">
                            <table className="w-full text-sm text-left text-gray-400">
                               <thead className="text-xs text-gray-300 uppercase bg-gray-700/50 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-2">Sequence</th>
                                        <th className="px-4 py-2">Positions</th>
                                        <th className="px-4 py-2">Distances</th>
                                    </tr>
                               </thead>
                               <tbody>
                                {kasiskiResults.sequenceDetails.length > 0 ? kasiskiResults.sequenceDetails.map(({ sequence, positions, distances }) => (
                                    <tr key={sequence} className="bg-gray-800/50 border-b border-gray-700/50">
                                        <td className="px-4 py-1 font-mono text-amber-300">{sequence}</td>
                                        <td className="px-4 py-1 font-mono">{positions.join(', ')}</td>
                                        <td className="px-4 py-1 font-mono">{distances.join(', ')}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={3} className="text-center italic text-gray-500 py-4">No repeated sequences found.</td></tr>
                                )}
                               </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Index of Coincidence */}
                <div className="bg-gray-800/50 p-4 rounded-lg shadow-inner ring-1 ring-white/10 h-[34rem] flex flex-col">
                     <h3 className="text-lg font-semibold text-green-300 mb-3 text-center">IoC by Key Length</h3>
                     <p className="text-xs text-gray-400 mb-4 text-center">High IoC (like English ≈ 0.067) suggests a correct key length.</p>
                     <div className="flex-grow">
                        {iocResults.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={iocResults} margin={{ top: 5, right: 20, left: -5, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                                <XAxis dataKey="keyLength" stroke="#A0AEC0" tick={{fontSize: 12}}>
                                    <Label value="Key Length" position="insideBottom" offset={-15} fill="#A0AEC0" fontSize={12} />
                                 </XAxis>
                                <YAxis stroke="#A0AEC0" domain={[0, 0.09]} tick={{fontSize: 10}} tickFormatter={(val) => val.toFixed(3)}/>
                                <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: 'none', borderRadius: '0.5rem' }} cursor={{ fill: 'rgba(102, 252, 241, 0.1)' }} formatter={(value:number) => [value.toFixed(4), 'IoC']} />
                                <ReferenceLine y={0.067} stroke="#68D391" strokeDasharray="3 3">
                                    <Label value="English" position="insideTopLeft" fill="#68D391" fontSize={10} dy={-4} />
                                </ReferenceLine>
                                <ReferenceLine y={0.038} stroke="#F6AD55" strokeDasharray="3 3">
                                     <Label value="Random" position="insideTopLeft" fill="#F6AD55" fontSize={10} dy={12} />
                                </ReferenceLine>
                                <Bar dataKey="ioc" fill="#81E6D9" />
                            </BarChart>
                        </ResponsiveContainer>
                        ) : (
                             <div className="flex items-center justify-center h-full text-center italic text-gray-500">Not enough data for IoC analysis.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KeyLengthAnalysis;