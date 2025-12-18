'use client';

import { Resource } from '@/lib/actions/resources';
import DocumentCard from './DocumentCard';
import { Grid3x3, List, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface SearchResultsProps {
    resources: Resource[];
    total: number;
    loading?: boolean;
    onLoadMore?: () => void;
    hasMore?: boolean;
}

export default function SearchResults({ resources, total, loading, onLoadMore, hasMore }: SearchResultsProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    if (loading && resources.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
                <p className="text-blue-200">Searching...</p>
            </div>
        );
    }

    if (resources.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="p-6 bg-white/5 rounded-full mb-4 border border-white/10">
                    <Grid3x3 className="h-12 w-12 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Results Found</h3>
                <p className="text-blue-200/70 text-center max-w-md">
                    Try adjusting your filters or search query to find what you're looking for.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Search Results</h2>
                    <p className="text-blue-200/70 mt-1">
                        Found <span className="font-semibold text-blue-400">{total}</span> documents
                    </p>
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-2 bg-[#0f172a]/60 border border-white/10 rounded-lg p-1">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded transition-colors ${viewMode === 'grid'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                            : 'text-blue-300 hover:bg-white/5'
                            }`}
                    >
                        <Grid3x3 className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded transition-colors ${viewMode === 'list'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                            : 'text-blue-300 hover:bg-white/5'
                            }`}
                    >
                        <List className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Results Grid/List */}
            <div
                className={`grid gap-6 ${viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-1'
                    }`}
            >
                {resources.map(resource => (
                    <DocumentCard key={resource.id} resource={resource} />
                ))}
            </div>

            {/* Load More */}
            {hasMore && (
                <div className="flex justify-center pt-6">
                    <button
                        onClick={onLoadMore}
                        disabled={loading}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900/50 disabled:text-blue-400 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            'Load More'
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
