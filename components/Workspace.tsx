import React, { useState, useEffect, useCallback } from 'react';

interface WorkspaceProps {
    cipherId: string;
}

const Workspace: React.FC<WorkspaceProps> = ({ cipherId }) => {
    const getStorageKey = (id: string) => `b4dm4n-workspace-${id}`;
    
    const [notes, setNotes] = useState<string>(() => {
        try {
            const savedNotes = localStorage.getItem(getStorageKey(cipherId));
            return savedNotes || '';
        } catch (error) {
            console.error("Could not read from localStorage", error);
            return '';
        }
    });

    // Effect to load notes when the cipherId changes
    useEffect(() => {
        try {
            const savedNotes = localStorage.getItem(getStorageKey(cipherId));
            setNotes(savedNotes || '');
        } catch (error) {
            console.error("Could not read from localStorage", error);
            setNotes('');
        }
    }, [cipherId]);

    // Debounced save effect
    useEffect(() => {
        const handler = setTimeout(() => {
            try {
                 localStorage.setItem(getStorageKey(cipherId), notes);
            } catch (error) {
                console.error("Could not save to localStorage", error);
            }
        }, 500); // Save 500ms after the user stops typing

        return () => {
            clearTimeout(handler);
        };
    }, [notes, cipherId]);

    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNotes(e.target.value);
    };

    return (
        <div className="bg-gray-800/50 p-4 rounded-lg shadow-inner ring-1 ring-white/10 h-[30rem] flex flex-col">
            <h3 className="text-lg font-semibold text-green-300 mb-3">Analyst's Workspace</h3>
            <p className="text-sm text-gray-400 mb-4">Your notes are automatically saved to your browser's local storage for each cipher.</p>
            <textarea
                value={notes}
                onChange={handleNotesChange}
                placeholder="Start typing your notes, theories, and potential keys here..."
                aria-label="Workspace notes area"
                className="w-full flex-grow bg-gray-900/70 border border-gray-600 text-gray-300 font-mono text-base rounded-md p-3 focus:ring-2 focus:ring-green-500 outline-none transition scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
            />
        </div>
    );
};

export default Workspace;
