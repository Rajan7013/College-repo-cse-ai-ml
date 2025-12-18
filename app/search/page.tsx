'use client';

import { useState, useEffect, useCallback } from 'react';
import SearchBar from '@/components/search/SearchBar';
import FilterPanel from '@/components/search/FilterPanel';
import SearchResults from '@/components/search/SearchResults';
import { SearchFilters, searchResources } from '@/lib/actions/search';
import { Resource } from '@/lib/actions/resources';
import { Loader2, AlertCircle } from 'lucide-react';

import { useSearchParams, useRouter } from 'next/navigation';

import { Suspense } from 'react';

function SearchPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Initialize filters from URL params
    const [filters, setFilters] = useState<SearchFilters>(() => ({
        query: searchParams.get('query') || undefined,
        regulation: searchParams.get('regulation') || undefined,
        year: searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined,
        semester: searchParams.get('semester') ? parseInt(searchParams.get('semester')!) : undefined,
        branch: searchParams.get('branch') || undefined,
        subject: searchParams.get('subject') || undefined,
        unit: searchParams.get('unit') || undefined,
        documentType: searchParams.get('documentType') || undefined,
        fileType: searchParams.get('fileType') || undefined,
    }));

    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [initialLoad, setInitialLoad] = useState(true);

    const performSearch = useCallback(async (currentFilters: SearchFilters, currentPage: number = 1, append: boolean = false) => {
        setLoading(true);
        setError(null);
        try {
            const result = await searchResources(currentFilters, { field: 'uploadedAt', direction: 'desc' }, currentPage);

            if (append) {
                setResources(prev => [...prev, ...result.resources]);
            } else {
                setResources(result.resources);
            }

            setTotal(result.total);
            setHasMore(result.hasMore);
        } catch (err) {
            console.error('Search failed:', err);
            setError('Failed to load resources. Please try again.');
        } finally {
            setLoading(false);
            setInitialLoad(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        performSearch(filters);
    }, []); // Only run once on mount

    const handleSearch = () => {
        setPage(1);
        performSearch(filters, 1, false);
    };

    const handleFilterChange = (newFilters: SearchFilters) => {
        setFilters(newFilters);
    };

    const handleApplyFilters = () => {
        setPage(1);
        performSearch(filters, 1, false);
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        performSearch(filters, nextPage, true);
    };

    const handleQueryChange = (query: string) => {
        setFilters(prev => ({ ...prev, query }));
    };

    return (
        <div className="min-h-screen bg-[#020617] py-8 px-4 md:px-6 lg:px-8 overflow-x-hidden selection:bg-blue-500/30">
            {/* Background Ambience */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-20%] w-[80%] md:w-[40%] h-[80%] md:h-[40%] bg-blue-600/20 rounded-full blur-[80px] md:blur-[128px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-20%] w-[80%] md:w-[40%] h-[80%] md:h-[40%] bg-violet-600/10 rounded-full blur-[80px] md:blur-[128px] animate-pulse delay-1000"></div>
            </div>

            <div className="max-w-7xl mx-auto space-y-8 relative z-10">
                {/* Header Section */}
                <div className="text-center space-y-4 mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                        Resource <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Center</span>
                    </h1>
                    <p className="text-lg text-blue-200/80 max-w-2xl mx-auto">
                        Find and access study materials, notes, videos, and more.
                    </p>
                </div>

                {/* Search & Filter Section */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Filters Sidebar - Mobile Collapsible */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <FilterPanel
                                filters={filters}
                                onChange={handleFilterChange}
                                onApply={handleApplyFilters}
                            />
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Search Bar */}
                        <div className="glass-card p-4 rounded-2xl shadow-sm border border-white/10">
                            <SearchBar
                                value={filters.query || ''}
                                onChange={handleQueryChange}
                                onSearch={handleSearch}
                            />
                        </div>

                        {/* Error State */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-200">
                                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        {/* Results */}
                        <SearchResults
                            resources={resources}
                            total={total}
                            loading={loading}
                            onLoadMore={handleLoadMore}
                            hasMore={hasMore}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
        }>
            <SearchPageContent />
        </Suspense>
    );
}
