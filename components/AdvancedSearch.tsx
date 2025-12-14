'use client';

import { Search, Filter, X, History, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AdvancedSearchProps {
    onSearch: (filters: SearchFilters) => void;
}

export interface SearchFilters {
    searchTerm: string;
    subjectName: string; // New
    subjectCode: string; // New
    branch: string;
    regulation: string;
    year: string;
    semester: string;
    documentType: string;
    unit: string;
    fileType: string;
    sortBy: string;
}

import {
    BRANCH_OPTIONS,
    REGULATIONS,
    DOCUMENT_TYPES,
    UNITS as UNIT_OPTIONS,
    FILE_TYPES as FILE_TYPE_OPTIONS,
    SORT_OPTIONS,
    YEARS,
    SEMESTERS
} from '@/lib/constants';

const BRANCHES = [
    { value: '', label: 'All Branches' },
    ...BRANCH_OPTIONS
];

const EXTENDED_REGULATIONS = ['', ...REGULATIONS];

const EXTENDED_DOCUMENT_TYPES = ['', ...DOCUMENT_TYPES];

const UNITS = [
    { value: '', label: 'All Units' },
    ...UNIT_OPTIONS
];

const FILE_TYPES = [
    { value: '', label: 'All File Types' },
    ...FILE_TYPE_OPTIONS
];

export default function AdvancedSearch({ onSearch }: AdvancedSearchProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);

    const [filters, setFilters] = useState<SearchFilters>({
        searchTerm: '',
        subjectName: '', // New
        subjectCode: '', // New
        branch: '',
        regulation: '',
        year: '',
        semester: '',
        documentType: '',
        unit: '',
        fileType: '',
        sortBy: 'date-desc',
    });

    // Load search history from localStorage
    useEffect(() => {
        const history = localStorage.getItem('searchHistory');
        if (history) {
            setSearchHistory(JSON.parse(history));
        }
    }, []);

    const handleFilterChange = (key: keyof SearchFilters, value: string) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onSearch(newFilters);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Save to search history
        if (filters.searchTerm && !searchHistory.includes(filters.searchTerm)) {
            const newHistory = [filters.searchTerm, ...searchHistory].slice(0, 5);
            setSearchHistory(newHistory);
            localStorage.setItem('searchHistory', JSON.stringify(newHistory));
        }

        onSearch(filters);
        setShowHistory(false);
    };

    const clearAllFilters = () => {
        const clearedFilters: SearchFilters = {
            searchTerm: '',
            subjectName: '',
            subjectCode: '',
            branch: '',
            regulation: '',
            year: '',
            semester: '',
            documentType: '',
            unit: '',
            fileType: '',
            sortBy: 'date-desc',
        };
        setFilters(clearedFilters);
        onSearch(clearedFilters);
    };

    const hasActiveFilters = () => {
        return filters.searchTerm || filters.subjectName || filters.subjectCode ||
            filters.branch || filters.regulation ||
            filters.year || filters.semester || filters.documentType ||
            filters.unit || filters.fileType || filters.sortBy !== 'date-desc';
    };

    const useHistoryItem = (term: string) => {
        const newFilters = { ...filters, searchTerm: term };
        setFilters(newFilters);
        onSearch(newFilters);
        setShowHistory(false);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <Filter className="h-5 w-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Advanced Search & Filters</h2>
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                    {isExpanded ? 'Hide Filters' : 'Show All Filters'}
                </button>
            </div>

            <form onSubmit={handleSearchSubmit}>
                {/* Search Bar */}
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by subject, code, tags, description..."
                        value={filters.searchTerm}
                        onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                        onFocus={() => setShowHistory(true)}
                        className="w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-lg"
                    />
                    {filters.searchTerm && (
                        <button
                            type="button"
                            onClick={() => handleFilterChange('searchTerm', '')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}

                    {/* Search History Dropdown */}
                    {showHistory && searchHistory.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <div className="p-2">
                                <div className="flex items-center space-x-2 px-3 py-2 text-xs text-gray-500">
                                    <History className="h-4 w-4" />
                                    <span>Recent Searches</span>
                                </div>
                                {searchHistory.map((term, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => useHistoryItem(term)}
                                        className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-gray-700 text-sm"
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Filters Row (Always Visible) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {/* Regulation */}
                    <select
                        value={filters.regulation}
                        onChange={(e) => handleFilterChange('regulation', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                    >
                        <option value="">All Regulations</option>
                        {EXTENDED_REGULATIONS.slice(1).map(reg => (
                            <option key={reg} value={reg}>{reg}</option>
                        ))}
                    </select>

                    {/* Year */}
                    <select
                        value={filters.year}
                        onChange={(e) => handleFilterChange('year', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                    >
                        <option value="">All Years</option>
                        {YEARS.map(year => (
                            <option key={year} value={year}>
                                {year}{year === '1' ? 'st' : year === '2' ? 'nd' : year === '3' ? 'rd' : 'th'} Year
                            </option>
                        ))}
                    </select>

                    {/* Semester */}
                    <select
                        value={filters.semester}
                        onChange={(e) => handleFilterChange('semester', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                    >
                        <option value="">All Semesters</option>
                        {SEMESTERS.map(sem => (
                            <option key={sem} value={sem}>Semester {sem}</option>
                        ))}
                    </select>

                    {/* Sort By */}
                    <select
                        value={filters.sortBy}
                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                    >
                        {SORT_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Expanded Filters (Toggle) */}
                {isExpanded && (
                    <div className="border-t pt-4 space-y-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Additional Filters</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Subject Name */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Subject Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Data Structures"
                                    value={filters.subjectName}
                                    onChange={(e) => handleFilterChange('subjectName', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                                />
                            </div>

                            {/* Subject Code */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Subject Code</label>
                                <input
                                    type="text"
                                    placeholder="e.g. CS201"
                                    value={filters.subjectCode}
                                    onChange={(e) => handleFilterChange('subjectCode', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                                />
                            </div>

                            {/* Branch */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Branch</label>
                                <select
                                    value={filters.branch}
                                    onChange={(e) => handleFilterChange('branch', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                                >
                                    {BRANCHES.map(branch => (
                                        <option key={branch.value} value={branch.value}>
                                            {branch.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Document Type */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Document Type</label>
                                <select
                                    value={filters.documentType}
                                    onChange={(e) => handleFilterChange('documentType', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                                >
                                    <option value="">All Types</option>
                                    {EXTENDED_DOCUMENT_TYPES.slice(1).map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Unit */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Unit</label>
                                <select
                                    value={filters.unit}
                                    onChange={(e) => handleFilterChange('unit', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                                >
                                    {UNITS.map(unit => (
                                        <option key={unit.value} value={unit.value}>
                                            {unit.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* File Type */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">File Type</label>
                                <select
                                    value={filters.fileType}
                                    onChange={(e) => handleFilterChange('fileType', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                                >
                                    {FILE_TYPES.map(type => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Active Filters Summary & Clear */}
                {hasActiveFilters() && (
                    <div className="mt-4 flex items-center justify-between bg-blue-50 px-4 py-2 rounded-lg">
                        <span className="text-sm text-blue-700 font-medium">
                            Filters active
                        </span>
                        <button
                            type="button"
                            onClick={clearAllFilters}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1"
                        >
                            <X className="h-4 w-4" />
                            <span>Clear All</span>
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}
