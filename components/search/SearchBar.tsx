'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { getSearchSuggestions } from '@/lib/actions/search';
import { useDebouncedCallback } from 'use-debounce';
import { logActivity } from '@/lib/actions/analytics';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    onSearch: () => void;
    placeholder?: string;
}

export default function SearchBar({ value, onChange, onSearch, placeholder = 'Search documents, subjects...' }: SearchBarProps) {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);

    // Debounced suggestion fetch
    const fetchSuggestions = useDebouncedCallback(async (query: string) => {
        if (query.length < 2) {
            setSuggestions([]);
            return;
        }

        setLoading(true);
        try {
            const results = await getSearchSuggestions(query);
            setSuggestions(results);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        } finally {
            setLoading(false);
        }
    }, 300);

    useEffect(() => {
        fetchSuggestions(value);
    }, [value, fetchSuggestions]);

    const handleInputChange = (newValue: string) => {
        onChange(newValue);
        setShowSuggestions(true);
    };

    const handleSuggestionClick = (suggestion: string) => {
        onChange(suggestion);
        setShowSuggestions(false);
        onSearch();

        // Log query
        logActivity({
            action: 'search_query',
            details: suggestion
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            setShowSuggestions(false);
            onSearch();

            // Log query if not empty
            if (value.trim()) {
                logActivity({
                    action: 'search_query',
                    details: value
                });
            }
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    const handleClear = () => {
        onChange('');
        setSuggestions([]);
        setShowSuggestions(false);
    };

    return (
        <div className="relative w-full">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                </div>

                <input
                    type="text"
                    value={value}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => value.length >= 2 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder={placeholder}
                    className="w-full pl-12 pr-12 py-4 text-base border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />

                {value && (
                    <button
                        onClick={handleClear}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
                    {suggestions.map((suggestion, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-slate-100 last:border-b-0"
                        >
                            <div className="flex items-center gap-2">
                                <Search className="h-4 w-4 text-slate-400" />
                                <span className="text-slate-700">{suggestion}</span>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Loading indicator */}
            {loading && (
                <div className="absolute right-14 top-1/2 -translate-y-1/2">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                </div>
            )}
        </div>
    );
}
