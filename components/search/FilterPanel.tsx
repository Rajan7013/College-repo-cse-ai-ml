'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, X, Filter } from 'lucide-react';
import { REGULATIONS, DOCUMENT_TYPES, FILE_TYPES, UNITS, BRANCH_OPTIONS } from '@/lib/constants';
import { SearchFilters } from '@/lib/actions/search';
import { getFilterOptions } from '@/lib/actions/search';

interface FilterPanelProps {
    filters: SearchFilters;
    onChange: (filters: SearchFilters) => void;
    onApply: () => void;
}

export default function FilterPanel({ filters, onChange, onApply }: FilterPanelProps) {
    const [expanded, setExpanded] = useState(false); // Collapsed by default on mobile
    const [subjects, setSubjects] = useState<Array<{ code: string; name: string }>>([]);
    const [loadingSubjects, setLoadingSubjects] = useState(false);

    // Handle responsive state
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setExpanded(true);
            } else {
                setExpanded(false);
            }
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Fetch subjects based on current filters (or all if no filters)
    useEffect(() => {
        const fetchSubjects = async () => {
            setLoadingSubjects(true);
            try {
                // Fetch subjects filtered by regulation/year/sem if selected, otherwise fetch all
                // Note: The backend action now supports partial matching or all if empty
                const options = await getFilterOptions({
                    regulation: filters.regulation,
                    year: filters.year,
                    semester: filters.semester
                });
                setSubjects(options.subjects);
            } catch (error) {
                console.error('Error fetching subjects:', error);
            } finally {
                setLoadingSubjects(false);
            }
        };

        fetchSubjects();
    }, [filters.regulation, filters.year, filters.semester]);

    const handleFilterChange = (key: keyof SearchFilters, value: any) => {
        onChange({ ...filters, [key]: value });
    };

    const handleReset = () => {
        onChange({});
    };

    const activeFilterCount = Object.values(filters).filter(v => v !== undefined && v !== '').length;

    return (
        <div className="glass-card">
            {/* Header */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors rounded-t-xl"
            >
                <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-blue-400" />
                    <span className="font-bold text-white text-sm">Filters</span>
                    {activeFilterCount > 0 && (
                        <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full">
                            {activeFilterCount}
                        </span>
                    )}
                </div>
                {expanded ? <ChevronUp className="h-5 w-5 text-blue-400" /> : <ChevronDown className="h-5 w-5 text-blue-400" />}
            </button>

            {/* Filters */}
            {expanded && (
                <div className="px-4 py-3 space-y-3 border-t border-white/10 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* Regulation */}
                    <div>
                        <label className="block text-xs font-semibold text-blue-200 mb-1">Regulation</label>
                        <select
                            value={filters.regulation || ''}
                            onChange={(e) => handleFilterChange('regulation', e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-[#0f172a]/60 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-blue-100"
                        >
                            <option value="" className="bg-[#0f172a]">All</option>
                            {REGULATIONS.map(reg => (
                                <option key={reg} value={reg} className="bg-[#0f172a]">{reg}</option>
                            ))}
                        </select>
                    </div>

                    {/* Year */}
                    <div>
                        <label className="block text-xs font-semibold text-blue-200 mb-1">Year</label>
                        <select
                            value={filters.year || ''}
                            onChange={(e) => handleFilterChange('year', e.target.value ? parseInt(e.target.value) : undefined)}
                            className="w-full px-3 py-2 text-sm bg-[#0f172a]/60 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-blue-100"
                        >
                            <option value="" className="bg-[#0f172a]">All Years</option>
                            <option value="1" className="bg-[#0f172a]">1st Year</option>
                            <option value="2" className="bg-[#0f172a]">2nd Year</option>
                            <option value="3" className="bg-[#0f172a]">3rd Year</option>
                            <option value="4" className="bg-[#0f172a]">4th Year</option>
                        </select>
                    </div>

                    {/* Semester */}
                    <div>
                        <label className="block text-xs font-semibold text-blue-200 mb-1">Semester</label>
                        <select
                            value={filters.semester || ''}
                            onChange={(e) => handleFilterChange('semester', e.target.value ? parseInt(e.target.value) : undefined)}
                            className="w-full px-3 py-2 text-sm bg-[#0f172a]/60 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-blue-100"
                        >
                            <option value="" className="bg-[#0f172a]">All</option>
                            <option value="1" className="bg-[#0f172a]">Semester 1</option>
                            <option value="2" className="bg-[#0f172a]">Semester 2</option>
                        </select>
                    </div>

                    {/* Branch */}
                    <div>
                        <label className="block text-xs font-semibold text-blue-200 mb-1">Branch</label>
                        <select
                            value={filters.branch || ''}
                            onChange={(e) => handleFilterChange('branch', e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-[#0f172a]/60 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-blue-100"
                        >
                            <option value="" className="bg-[#0f172a]">All Branches</option>
                            {BRANCH_OPTIONS.map(branch => (
                                <option key={branch.value} value={branch.value} className="bg-[#0f172a]">{branch.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="block text-xs font-semibold text-blue-200 mb-1">Subject Code</label>
                        <select
                            value={filters.subject || ''}
                            onChange={(e) => handleFilterChange('subject', e.target.value)}
                            disabled={loadingSubjects || subjects.length === 0}
                            className="w-full px-3 py-2 text-sm bg-[#0f172a]/60 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <option value="" className="bg-[#0f172a]">All Subjects</option>
                            {subjects.map(sub => (
                                <option key={sub.code} value={sub.code} className="bg-[#0f172a]">
                                    {sub.code} - {sub.name}
                                </option>
                            ))}
                        </select>
                        {loadingSubjects && <p className="text-xs text-blue-300 mt-1">Loading...</p>}
                    </div>

                    {/* Document Type */}
                    <div>
                        <label className="block text-xs font-semibold text-blue-200 mb-1">Document Type</label>
                        <select
                            value={filters.documentType || ''}
                            onChange={(e) => handleFilterChange('documentType', e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-[#0f172a]/60 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-blue-100"
                        >
                            <option value="" className="bg-[#0f172a]">All Types</option>
                            {DOCUMENT_TYPES.map(type => (
                                <option key={type} value={type} className="bg-[#0f172a]">{type}</option>
                            ))}
                        </select>
                    </div>

                    {/* Unit */}
                    <div>
                        <label className="block text-xs font-semibold text-blue-200 mb-1">Unit</label>
                        <select
                            value={filters.unit || ''}
                            onChange={(e) => handleFilterChange('unit', e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-[#0f172a]/60 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-blue-100"
                        >
                            <option value="" className="bg-[#0f172a]">All Units</option>
                            {UNITS.map(unit => (
                                <option key={unit.value} value={unit.value} className="bg-[#0f172a]">{unit.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* File Type */}
                    <div>
                        <label className="block text-xs font-semibold text-blue-200 mb-1">File Type</label>
                        <select
                            value={filters.fileType || ''}
                            onChange={(e) => handleFilterChange('fileType', e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-[#0f172a]/60 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-blue-100"
                        >
                            <option value="" className="bg-[#0f172a]">All Files</option>
                            {FILE_TYPES.map(type => (
                                <option key={type.value} value={type.value} className="bg-[#0f172a]">{type.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-3 border-t border-white/10">
                        <button
                            onClick={onApply}
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors text-sm shadow-lg shadow-blue-500/20"
                        >
                            Apply
                        </button>
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-blue-200 font-semibold rounded-lg transition-colors flex items-center gap-1 text-sm border border-white/10"
                        >
                            <X className="h-4 w-4" />
                            Reset
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
