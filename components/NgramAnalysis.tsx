import React, { useMemo } from 'react';
import { calculateNgrams } from '../utils/crypto.ts';

interface NgramAnalysisProps {
    text: string;
}

const NgramTable: React.FC<{ data: [string, number][], title: string }> = ({ data, title }) => (
    <div>
        <h4 className="text-md font-semibold text-green-300 mb-2 text-center">{title}</h4>
        <div className="overflow-auto max-h-64 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 rounded-md ring-1 ring-white/5">
            <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs text-gray-300 uppercase bg-gray-700/50 sticky top-0">
                    <tr>
                        <th scope="col" className="px-4 py-2">N-gram</th>
                        <th scope="col" className="px-4 py-2">Count</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? data.map(([ngram, count]) => (
                        <tr key={ngram} className="bg-gray-800/50 border-b border-gray-700/50">
                            <td className="px-4 py-1 font-mono">{ngram}</td>
                            <td className="px-4 py-1">{count}</td>
                        </tr>
                    )) : (
                         <tr><td colSpan={2} className="text-center px-4 py-4 italic text-gray-500">Not enough text to generate n-grams.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

const NgramAnalysis: React.FC<NgramAnalysisProps> = ({ text }) => {
    const topDigrams = useMemo<[string, number][]>(() => {
        if (!text || text.length < 2) return [];
        const digrams = calculateNgrams(text, 2);
        return Array.from(digrams.entries()).sort((a, b) => b[1] - a[1]).slice(0, 15);
    }, [text]);

    const topTrigrams = useMemo<[string, number][]>(() => {
        if (!text || text.length < 3) return [];
        const trigrams = calculateNgrams(text, 3);
        return Array.from(trigrams.entries()).sort((a, b) => b[1] - a[1]).slice(0, 15);
    }, [text]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NgramTable data={topDigrams} title="Top 15 Digrams" />
            <NgramTable data={topTrigrams} title="Top 15 Trigrams" />
        </div>
    );
};

export default NgramAnalysis;