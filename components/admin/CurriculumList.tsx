'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Subject, deleteSubject, bulkDeleteSubjects } from '@/lib/actions/curriculum';
import {
    BookOpen, Layers, Plus, Pencil, Trash2, Search, Filter,
    ArrowUpDown, MoreHorizontal, AlertCircle, CheckSquare, X
} from 'lucide-react';

interface CurriculumListProps {
    initialSubjects: Subject[];
}

export default function CurriculumList({ initialSubjects }: CurriculumListProps) {
    const router = useRouter();
    const [subjects, setSubjects] = useState(initialSubjects);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState<'all' | 'name' | 'code'>('all');

    // filters
    const [filterReg, setFilterReg] = useState('All');
    const [filterYear, setFilterYear] = useState('All');
    const [filterSem, setFilterSem] = useState('All');

    // sort
    const [sortBy, setSortBy] = useState<'code' | 'name' | 'date'>('code');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    // selection
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Derived Data
    const filteredSubjects = useMemo(() => {
        return subjects.filter(sub => {
            // Search
            const term = searchTerm.toLowerCase();
            const matchesSearch =
                searchField === 'all' ? (sub.name.toLowerCase().includes(term) || sub.code.toLowerCase().includes(term)) :
                    searchField === 'name' ? sub.name.toLowerCase().includes(term) :
                        sub.code.toLowerCase().includes(term);

            // Filters
            const matchesReg = filterReg === 'All' || sub.regulation === filterReg;
            const matchesYear = filterYear === 'All' || sub.year.toString() === filterYear;
            const matchesSem = filterSem === 'All' || sub.semester.toString() === filterSem;

            return matchesSearch && matchesReg && matchesYear && matchesSem;
        }).sort((a, b) => {
            let valA: any = a[sortBy === 'date' ? 'updatedAt' : sortBy];
            let valB: any = b[sortBy === 'date' ? 'updatedAt' : sortBy];

            // Handle undefined dates
            if (sortBy === 'date') {
                valA = valA ? new Date(valA).getTime() : 0;
                valB = valB ? new Date(valB).getTime() : 0;
            } else {
                valA = valA.toString().toLowerCase();
                valB = valB.toString().toLowerCase();
            }

            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    }, [subjects, searchTerm, searchField, filterReg, filterYear, filterSem, sortBy, sortOrder]);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;

        const res = await deleteSubject(id);
        if (res.success) {
            setSubjects(prev => prev.filter(s => s.id !== id));
            setSelectedIds(prev => prev.filter(selId => selId !== id)); // Remove from selection if deleted
            router.refresh();
        } else {
            alert('Failed to delete subject: ' + res.error);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (!confirm(`Are you sure you want to PERMANENTLY DELETE ${selectedIds.length} subjects? This cannot be undone.`)) return;

        const res = await bulkDeleteSubjects(selectedIds);
        if (res.success) {
            setSubjects(prev => prev.filter(s => !selectedIds.includes(s.id)));
            setSelectedIds([]);
            router.refresh();
        } else {
            alert('Failed to delete subjects: ' + res.error);
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredSubjects.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredSubjects.map(s => s.id));
        }
    };

    const toggleSelect = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(prev => prev.filter(sid => sid !== id));
        } else {
            setSelectedIds(prev => [...prev, id]);
        }
    };

    // Extract Unique Options for Filters
    const regulations = ['All', ...Array.from(new Set(initialSubjects.map(s => s.regulation)))];

    return (
        <div className="space-y-6">
            {/* Search & Filter Bar */}
            <div className="glass-card p-4 rounded-2xl md:rounded-full flex flex-col md:flex-row items-center gap-3 shadow-lg shadow-black/20">
                {/* Search */}
                <div className="relative flex-1 w-full md:w-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300" />
                    <input
                        type="text"
                        placeholder="Search subjects..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm md:rounded-full text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    {/* Regulation Filter */}
                    <div className="relative min-w-[140px]">
                        <select
                            value={filterReg} onChange={e => setFilterReg(e.target.value)}
                            className="w-full pl-4 pr-8 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm md:rounded-full text-blue-100 font-medium outline-none focus:bg-white/10 appearance-none cursor-pointer hover:bg-white/10 transition-colors"
                        >
                            {regulations.map(r => <option key={r} value={r} className="bg-[#0f172a]">{r === 'All' ? 'All Regulations' : r}</option>)}
                        </select>
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-blue-300/50 pointer-events-none" />
                    </div>

                    {/* Year Filter */}
                    <div className="relative min-w-[120px]">
                        <select
                            value={filterYear} onChange={e => setFilterYear(e.target.value)}
                            className="w-full pl-4 pr-8 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm md:rounded-full text-blue-100 font-medium outline-none focus:bg-white/10 appearance-none cursor-pointer hover:bg-white/10 transition-colors"
                        >
                            <option value="All" className="bg-[#0f172a]">All Years</option>
                            {[1, 2, 3, 4].map(y => <option key={y} value={y.toString()} className="bg-[#0f172a]">{y}st Year</option>)}
                        </select>
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-blue-300/50 pointer-events-none" />
                    </div>

                    {/* Sem Filter */}
                    <div className="relative min-w-[120px]">
                        <select
                            value={filterSem} onChange={e => setFilterSem(e.target.value)}
                            className="w-full pl-4 pr-8 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm md:rounded-full text-blue-100 font-medium outline-none focus:bg-white/10 appearance-none cursor-pointer hover:bg-white/10 transition-colors"
                        >
                            <option value="All" className="bg-[#0f172a]">All Sems</option>
                            <option value="1" className="bg-[#0f172a]">Sem 1</option>
                            <option value="2" className="bg-[#0f172a]">Sem 2</option>
                        </select>
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-blue-300/50 pointer-events-none" />
                    </div>

                    {/* Sort Toggle */}
                    <button
                        onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                        className="p-2.5 hover:bg-white/10 rounded-full text-blue-300 border border-white/10 transition-colors"
                        title="Toggle Sort Order"
                    >
                        <ArrowUpDown className="h-4 w-4" />
                    </button>

                    {/* Clear Filters (Only if active) */}
                    {(searchTerm || filterReg !== 'All' || filterYear !== 'All' || filterSem !== 'All') && (
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setFilterReg('All');
                                setFilterYear('All');
                                setFilterSem('All');
                            }}
                            className="p-2.5 hover:bg-red-500/20 rounded-full text-red-300 border border-red-500/20 transition-colors"
                            title="Clear Filters"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Bulk Actions Bar */}
            {selectedIds.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between animate-in fade-in slide-in-from-top-2 shadow-lg shadow-red-500/10">
                    <span className="text-sm font-bold text-red-200 px-2 flex items-center gap-2">
                        <CheckSquare className="h-4 w-4" />
                        {selectedIds.length} subjects selected
                    </span>
                    <button
                        onClick={handleBulkDelete}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-red-500/20 transition-all hover:scale-105 active:scale-95"
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete Selected
                    </button>
                </div>
            )}

            {/* List */}
            <div className="glass-card rounded-3xl overflow-hidden border border-white/10 shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white/5 border-b border-white/10 text-blue-200 font-bold uppercase tracking-wider text-xs">
                            <tr>
                                <th className="px-6 py-5 w-16 text-center">
                                    <input
                                        type="checkbox"
                                        className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                                        checked={filteredSubjects.length > 0 && selectedIds.length === filteredSubjects.length}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th className="px-6 py-5 cursor-pointer hover:text-white transition-colors group" onClick={() => setSortBy('code')}>
                                    <div className="flex items-center gap-1">
                                        Code
                                        {sortBy === 'code' && <span className="text-blue-400">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                                    </div>
                                </th>
                                <th className="px-6 py-5 cursor-pointer hover:text-white transition-colors" onClick={() => setSortBy('name')}>
                                    <div className="flex items-center gap-1">
                                        Subject Name
                                        {sortBy === 'name' && <span className="text-blue-400">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                                    </div>
                                </th>
                                <th className="px-6 py-5">Context</th>
                                <th className="px-6 py-5 text-center">Units</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredSubjects.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center text-blue-200/50">
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                                                <Search className="h-8 w-8 opacity-50" />
                                            </div>
                                            <p className="text-lg font-medium">No subjects found matching your filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredSubjects.map((sub) => (
                                    <tr
                                        key={sub.id}
                                        className={`group hover:bg-white/[0.02] transition-colors ${selectedIds.includes(sub.id) ? 'bg-blue-500/10 hover:bg-blue-500/20' : ''}`}
                                    >
                                        <td className="px-6 py-5 text-center">
                                            <input
                                                type="checkbox"
                                                className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                                                checked={selectedIds.includes(sub.id)}
                                                onChange={() => toggleSelect(sub.id)}
                                            />
                                        </td>
                                        <td className="px-6 py-5 font-mono font-bold text-white/90 group-hover:text-blue-300 transition-colors">{sub.code}</td>
                                        <td className="px-6 py-5 font-bold text-white text-base">{sub.name}</td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1.5">
                                                <span className="inline-flex w-fit items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-blue-500/20 text-blue-200 border border-blue-500/20 uppercase tracking-wide">
                                                    {sub.regulation}
                                                </span>
                                                <span className="text-xs text-blue-200/60 font-medium">
                                                    Year {sub.year} • Sem {sub.semester}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 text-blue-200 rounded-full text-xs font-bold">
                                                <Layers className="h-3 w-3" />
                                                {Object.keys(sub.units || {}).length}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/curriculum/edit/${sub.id}`}>
                                                    <button className="p-2.5 text-blue-300 hover:text-white hover:bg-white/10 rounded-xl transition-all" title="Edit">
                                                        <Pencil className="h-4 w-4" />
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(sub.id, sub.name)}
                                                    className="p-2.5 text-red-400 hover:text-red-200 hover:bg-red-500/20 rounded-xl transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t border-white/10 bg-white/[0.02] flex justify-between items-center text-xs font-medium text-blue-200/50 uppercase tracking-wider">
                    <span>Showing {filteredSubjects.length} of {subjects.length} subjects</span>
                </div>
            </div>
        </div>
    );
}
