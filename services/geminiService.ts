import { GoogleGenAI, Type } from "@google/genai";
import { Cipher } from "../types.ts";

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable is not set. Gemini features will be disabled.");
}

const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

const getVigenerePrompt = (decryptedText: string, keyword: string, cipher: Cipher): string => `
You are a world-class cryptanalyst. Your goal is to help a user who is trying to solve a Vigenère cipher.

Cipher Details:
- Name: "${cipher.name}"
- Description: "${cipher.description}"

Decryption Attempt:
- Keyword Used: "${keyword || '(None)'}"
- Resulting Plaintext: "${decryptedText}"

Your Task:
Provide a multi-faceted analysis of the decryption attempt.

1.  **Linguistic Coherence:** Assess the decrypted text for recognizable English words, phrases, or grammatical structures. Comment on letter frequencies and common n-grams.
2.  **Cryptanalytic Assessment:** Based on coherence, is the keyword "${keyword}" likely correct, partially correct, or incorrect? Provide a confidence score from 1 (unlikely) to 10 (certain).
3.  **Actionable Next Steps:** If incorrect, suggest 3 concrete next steps. Examples: re-evaluating the key length, trying keyword variations, or considering cipher variants. If promising, suggest how to verify the full plaintext.

Keep your analysis concise, clear, and encouraging.
`;

const getEsotericPrompt = (cipher: Cipher): string => `
You are an expert in esoteric symbolism and textual analysis, in the tradition of scholars like Manly P. Hall. Your task is to guide a user's analysis of a historical text.

Text Details:
- Name: "${cipher.name}"
- Description: "${cipher.description}"
- Text Snippet: "${cipher.ciphertext.substring(0, 500)}..."

Your Task:
Provide a brief, insightful guide for someone analyzing this text. Do NOT attempt to "solve" it. Instead, provide context and methods.

1.  **Historical & Thematic Context:** Briefly explain the significance of this text. What major themes or symbols are famously associated with it?
2.  **Analytical Methodologies:** Suggest two distinct methods for analysis, inspired by esoteric traditions:
    - **Symbolic/Allegorical:** How might one interpret the words and stories beyond their literal meaning? Mention key symbols to watch for.
    - **Numerological (Gematria):** Explain how Gematria could be applied to this text to find hidden meanings in names, phrases, or totals. Advise the user to use the Gematria Calculator tool on significant words.
3.  **Guiding Question:** Pose one open-ended question to encourage the user's exploration, such as "What patterns emerge when comparing the Gematria values of key character names?"

Your tone should be that of a knowledgeable guide, not a solution-giver.
`;

const getPuzzlePrompt = (cipher: Cipher): string => `
You are a master puzzle-solver, in the spirit of communities like Nox Populi and ARGs like Cicada 3301. You are advising a user on a complex, multi-layered puzzle.

Puzzle Details:
- Name: "${cipher.name}"
- Description: "${cipher.description}"
- Puzzle Text: "${cipher.ciphertext}"

Your Task:
Analyze this puzzle and provide a set of actionable strategies. Do not give the direct solution. Your goal is to teach the user *how* to approach such a puzzle.

1.  **Initial Assessment:** What are the most striking features of this text? (e.g., unusual characters, formatting, number sequences, specific vocabulary). What might these features hint at?
2.  **Hypothesize Layers:** Puzzles like this are rarely straightforward. Suggest two potential layers of encoding or hidden information.
    - **Example 1: Ciphers:** "The text may contain a classical cipher (e.g., Caesar, Vigenère). The user should perform frequency analysis."
    - **Example 2: Steganography/Metadata:** "The message's origin could be a clue. Is there hidden information (steganography) where it was found? Or is it a reference to an external work (a book, a map)?"
3.  **Three Concrete Next Steps:** Provide a list of three distinct, concrete actions the user should take right now.
    - "1. Run the text through the Gematria calculator to check for significant numbers (e.g., primes)."
    - "2. Research key phrases or names from the text online, looking for connections to cryptography, literature, or philosophy."
    - "3. Use the N-gram analysis to spot any non-obvious repeating patterns."
`;


export const analyzeTextWithGemini = async (decryptedText: string, keyword: string, cipher: Cipher): Promise<string> => {
    if (!ai) {
        return "Gemini API client is not initialized. Please configure your API_KEY.";
    }

    if (cipher.type === 'VIGENERE' && !decryptedText.trim() && !keyword) {
        // If no keyword, it's just a general query about the cipher
         const analysis = await analyzeTextWithGemini('', '', cipher);
         return analysis;
    }
    
    if (['VIGENERE', 'CAESAR', 'ATBASH'].includes(cipher.type) && !decryptedText.trim()) {
        return "Decrypted text is empty. Cannot analyze.";
    }

    let prompt: string;
    switch (cipher.type) {
        case 'VIGENERE':
        case 'CAESAR':
        case 'ATBASH':
            prompt = getVigenerePrompt(decryptedText, keyword, cipher);
            break;
        case 'ESOTERIC':
            prompt = getEsotericPrompt(cipher);
            break;
        case 'PUZZLE':
            prompt = getPuzzlePrompt(cipher);
            break;
        default:
            prompt = `Analyze the following text: ${cipher.ciphertext}`;
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.4,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error analyzing text with Gemini:", error);
        return "An error occurred while communicating with the Gemini API. Please check the console for details.";
    }
};

export const suggestKeywordWithGemini = async (ciphertext: string, keyLength: number): Promise<any> => {
    if (!ai) {
        throw new Error("Gemini API client is not initialized.");
    }

    const prompt = `
        You are a cryptanalysis expert specializing in Vigenère ciphers.
        A user has given you a ciphertext and a probable key length.
        Your task is to analyze the ciphertext and suggest three potential keywords.
        
        Ciphertext: "${ciphertext}"
        Key Length: ${keyLength}

        Perform a frequency analysis on the columns of text corresponding to the key length. For each position in the key, find the letter that results in the most English-like frequency distribution for that column.
        
        Return your answer ONLY as a valid JSON object with the following structure:
        {
          "suggestions": [
            { "keyword": "SUGGESTION1", "reason": "Your reasoning based on frequency analysis." },
            { "keyword": "SUGGESTION2", "reason": "Your reasoning." },
            { "keyword": "SUGGESTION3", "reason": "Your reasoning." }
          ]
        }
    `;

    try {
         const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    keyword: { type: Type.STRING },
                                    reason: { type: Type.STRING }
                                }
                            }
                        }
                    }
                }
            }
        });

        // The response text should be a JSON string, so parse it.
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error suggesting keywords with Gemini:", error);
        throw new Error("Failed to get keyword suggestions from Gemini API.");
    }
};