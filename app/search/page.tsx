'use client';

import { useState } from 'react';
import { Search, Filter, BookOpen, FileText, Video, Link as LinkIcon } from 'lucide-react';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState<'all' | 'notes' | 'videos' | 'links'>('all');

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="glass-card p-8 mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                            <Search className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-5xl font-black text-white">Search Resources</h1>
                            <p className="text-blue-200">Find study materials across all subjects and years</p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative mt-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-300" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by topic, subject, or keyword..."
                            className="glass-input w-full pl-12 pr-4 py-4 text-lg"
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-8">
                    {[
                        { value: 'all', label: 'All Resources', icon: Filter },
                        { value: 'notes', label: 'Notes & PDFs', icon: FileText },
                        { value: 'videos', label: 'Videos', icon: Video },
                        { value: 'links', label: 'Links', icon: LinkIcon }
                    ].map((f) => {
                        const Icon = f.icon;
                        return (
                            <button
                                key={f.value}
                                onClick={() => setFilter(f.value as any)}
                                className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${filter === f.value
                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                        : 'glass-card text-blue-200 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                <Icon className="h-5 w-5" />
                                {f.label}
                            </button>
                        );
                    })}
                </div>

                {/* Results Placeholder */}
                <div className="glass-card p-16 text-center">
                    <BookOpen className="h-20 w-20 text-blue-400 mx-auto mb-4 opacity-50" />
                    <h3 className="text-2xl font-bold text-white mb-2">Start Searching</h3>
                    <p className="text-blue-200">
                        Enter keywords to find notes, videos, and resources across all subjects
                    </p>
                </div>
            </div>
        </div>
    );
}
