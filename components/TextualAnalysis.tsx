import React, { useState, useMemo, useEffect } from 'react';
import { getUniqueChars, calculateGematria, transliterateToHieroglyphs } from '../utils/crypto.ts';
import { GREEK_ALPHABET_LOWER, GREEK_ALPHABET_UPPER, HEBREW_ALPHABET, DEVANAGARI_REGEX_CHAR_CHECK, HIEROGLYPH_UNILITERALS } from '../constants.ts';
import { GematriaSchema } from '../types.ts';

interface TextualAnalysisProps {
    ciphertext: string;
}

const CartoucheGenerator: React.FC = () => {
    const [name, setName] = useState('Ptolemy');
    const transliterated = useMemo(() => transliterateToHieroglyphs(name), [name]);

    return (
        <div className="bg-gray-900/50 p-4 rounded-lg">
             <h4 className="font-semibold text-green-300 mb-2">Cartouche Generator</h4>
             <p className="text-xs text-gray-400 mb-3">Enter a name to see its phonetic transliteration in a royal cartouche.</p>
             <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z]/g, ''))}
                placeholder="Enter a name..."
                className="w-full bg-gray-700 border border-gray-600 text-green-300 text-md font-mono rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none transition mb-3"
             />
             <div className="bg-yellow-100 border-2 border-black rounded-full p-2 h-16 flex items-center justify-center overflow-hidden">
                <span className="text-4xl text-black select-all" style={{fontFamily: "'Segoe UI Historic', 'Noto Sans Egyptian Hieroglyphs'"}}>
                    {transliterated}
                </span>
             </div>
        </div>
    )
}

// Define the type for a glyph entry to help TypeScript inference.
type GlyphEntry = [string, { glyph: string; desc: string; sound: string }];

const GlyphReference: React.FC = () => (
    <div className="bg-gray-900/50 p-4 rounded-lg">
        <h4 className="font-semibold text-green-300 mb-2">Uniliteral Glyph Reference</h4>
        <p className="text-xs text-gray-400 mb-3">Common single-sound glyphs used for transliteration.</p>
        <div className="overflow-auto max-h-48 rounded-md">
            <table className="w-full text-sm text-left text-gray-400">
                <tbody>
                    {(Object.entries(HIEROGLYPH_UNILITERALS) as GlyphEntry[])
                     // Filter out duplicates (like 'I' and 'Y')
                     .filter(([key, val], index, self) => self.findIndex(t => t[1].glyph === val.glyph) === index)
                     .map(([key, { glyph, sound, desc }]) => (
                        <tr key={glyph} className="border-b border-gray-700/50">
                            <td className="px-2 py-1 text-2xl" style={{fontFamily: "'Segoe UI Historic', 'Noto Sans Egyptian Hieroglyphs'"}}>{glyph}</td>
                            <td className="px-2 py-1 font-mono">{sound}</td>
                            <td className="px-2 py-1 text-xs">{desc}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);


const TextualAnalysis: React.FC<TextualAnalysisProps> = ({ ciphertext }) => {
    const [gematriaInput, setGematriaInput] = useState<string>('');
    const [gematriaSchema, setGematriaSchema] = useState<GematriaSchema>('pythagorean');

    const hasHieroglyphs = useMemo(() => /[\uD80C[\uDC00-\uDFFF]]/.test(ciphertext) || ciphertext.includes('p t w l m y s'), [ciphertext]);


    useEffect(() => {
        // Auto-detect schema based on content
        const hebrewChars = new RegExp(`[${HEBREW_ALPHABET}]`);
        const greekChars = new RegExp(`[${GREEK_ALPHABET_LOWER}${GREEK_ALPHABET_UPPER}]`);

        if (DEVANAGARI_REGEX_CHAR_CHECK.test(ciphertext)) {
            setGematriaSchema('sanskrit_katapayadi');
        } else if (hebrewChars.test(ciphertext)) {
            setGematriaSchema('hebrew');
        } else if (greekChars.test(ciphertext)) {
            setGematriaSchema('greek');
        } else {
            setGematriaSchema('pythagorean');
        }
        // Reset input when ciphertext changes
        setGematriaInput('');
    }, [ciphertext]);
    
    const uniqueChars = useMemo(() => getUniqueChars(ciphertext), [ciphertext]);
    const gematriaValue = useMemo(() => calculateGematria(gematriaInput, gematriaSchema), [gematriaInput, gematriaSchema]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Character Set */}
                <div className="bg-gray-800/50 p-4 rounded-lg shadow-inner ring-1 ring-white/10">
                    <h3 className="text-lg font-semibold text-green-300 mb-3 text-center">Character Set</h3>
                    <p className="text-xs text-gray-400 mb-4 text-center">All unique characters present in the source text.</p>
                    <div className="bg-gray-900/50 p-3 rounded-md text-center break-all max-h-48 overflow-y-auto">
                        {uniqueChars.map(char => (
                            <span key={char} className="font-mono text-lg text-amber-300 p-1">{char === ' ' ? '␣' : char}</span>
                        ))}
                    </div>
                </div>

                {/* Gematria Calculator */}
                <div className="bg-gray-800/50 p-4 rounded-lg shadow-inner ring-1 ring-white/10">
                    <h3 className="text-lg font-semibold text-green-300 mb-3 text-center">Gematria Calculator</h3>
                    <p className="text-xs text-gray-400 mb-4 text-center">Calculate the numerological value of a word or phrase.</p>
                    
                    <div className="mb-3">
                        <label htmlFor="gematria-schema" className="block text-sm font-medium text-gray-400 mb-1">Schema</label>
                        <select
                            id="gematria-schema"
                            value={gematriaSchema}
                            onChange={(e) => setGematriaSchema(e.target.value as GematriaSchema)}
                            className="w-full bg-gray-900 border border-gray-600 text-green-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none transition text-sm"
                        >
                            <option value="pythagorean">Pythagorean (English)</option>
                            <option value="chaldean">Chaldean</option>
                            <option value="latin_roman">Latin (Roman Numerals)</option>
                            <option value="hebrew">Hebrew</option>
                            <option value="greek">Greek (Isopsephy)</option>
                            <option value="sanskrit_katapayadi">Sanskrit (Katapayadi)</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="gematria-input" className="block text-sm font-medium text-gray-400 mb-1">Text to Analyze</label>
                        <input
                            id="gematria-input"
                            type="text"
                            value={gematriaInput}
                            onChange={(e) => setGematriaInput(e.target.value)}
                            placeholder="Enter word or phrase..."
                            className="w-full bg-gray-900 border border-gray-600 text-green-300 text-md font-mono rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none transition"
                        />
                    </div>

                    <div className="text-center bg-gray-900/70 p-3 rounded-md">
                        <p className="text-gray-400 text-sm">Gematria Value</p>
                        <p className="text-4xl font-mono text-cyan-400 select-all">{gematriaValue}</p>
                    </div>
                </div>
            </div>

            {hasHieroglyphs && (
                 <div className="bg-gray-800/50 p-4 rounded-lg shadow-inner ring-1 ring-white/10">
                    <h3 className="text-lg font-semibold text-green-300 mb-3 text-center">Hieroglyphics Lab</h3>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <CartoucheGenerator />
                        <GlyphReference />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TextualAnalysis;