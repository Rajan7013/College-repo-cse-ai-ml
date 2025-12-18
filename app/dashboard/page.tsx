'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { BookOpen, GraduationCap, ChevronRight, Settings, Sparkles } from 'lucide-react';
import { REGULATIONS, YEARS } from '@/lib/constants';

import { Suspense } from 'react';

function DashboardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Default to R23 or get from URL
    const [selectedRegulation, setSelectedRegulation] = useState('R23');

    useEffect(() => {
        const reg = searchParams.get('regulation');
        if (reg && REGULATIONS.includes(reg)) {
            setSelectedRegulation(reg);
        }
    }, [searchParams]);

    const handleRegulationChange = (reg: string) => {
        setSelectedRegulation(reg);
    };

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header with Regulation Selector */}
                <div className="glass-card p-8 mb-12">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-center md:text-left mb-6 md:mb-0">
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                    <BookOpen className="h-6 w-6 text-white" />
                                </div>
                                <h1 className="text-5xl font-black text-white">
                                    Academic Dashboard
                                </h1>
                            </div>
                            <p className="text-blue-200 text-lg">
                                Select your academic year to access resources
                            </p>
                        </div>

                        <div className="glass-card px-6 py-4 border-2 border-blue-400/30">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-cyan-300">
                                    <Settings className="h-5 w-5" />
                                    <span className="font-bold text-sm uppercase tracking-wide">Regulation:</span>
                                </div>
                                <select
                                    value={selectedRegulation}
                                    onChange={(e) => handleRegulationChange(e.target.value)}
                                    className="glass-input px-4 py-2 font-bold text-white cursor-pointer"
                                >
                                    {REGULATIONS.map((reg) => (
                                        <option key={reg} value={reg} className="bg-slate-800">
                                            {reg}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Year Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {YEARS.map((year) => (
                        <div key={year.value}>
                            <Link
                                href={`/dashboard/${year.value}?regulation=${selectedRegulation}`}
                                className="group block"
                            >
                                <div className="glass-card p-8 hover:bg-white/10 hover:scale-105 transition-all duration-300 text-center">
                                    <div className="mb-6 flex justify-center">
                                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <GraduationCap className="h-10 w-10 text-white" />
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-black text-white mb-2">
                                        {year.label}
                                    </h2>
                                    <p className="text-sm text-blue-200 mb-4">
                                        {year.courses}
                                    </p>
                                    <div className="flex items-center justify-center text-cyan-300 font-bold group-hover:gap-2 transition-all">
                                        <span>View Semesters</span>
                                        <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Advanced Search CTA */}
                <div className="glass-card p-8 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-2 border-blue-400/30">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                                <BookOpen className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white mb-1 flex items-center gap-2">
                                    Need Advanced Search?
                                    <Sparkles className="h-5 w-5 text-yellow-400" />
                                </h3>
                                <p className="text-blue-100">
                                    Find specific documents across all years and semesters
                                </p>
                            </div>
                        </div>
                        <Link href="/search">
                            <button className="btn-gradient px-8 py-4 rounded-xl font-bold whitespace-nowrap">
                                Go to Search →
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading Dashboard...</div>}>
            <DashboardContent />
        </Suspense>
    );
}
