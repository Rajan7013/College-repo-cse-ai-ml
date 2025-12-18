'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Calendar, ChevronRight, ArrowLeft } from 'lucide-react';
import { SEMESTERS } from '@/lib/constants';

export default function SemesterPage({ params }: { params: Promise<{ year: string }> }) {
    const { year } = use(params);
    const searchParams = useSearchParams();

    // Get regulation from URL or default
    const [regulation, setRegulation] = useState(searchParams.get('regulation') || 'R23');

    useEffect(() => {
        const reg = searchParams.get('regulation');
        if (reg) setRegulation(reg);
    }, [searchParams]);

    const yearSuffix = year === '1' ? 'st' : year === '2' ? 'nd' : year === '3' ? 'rd' : 'th';

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumbs / Back */}
                <Link href="/resources" className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8 hover:bg-white/10 transition-all">
                    <ArrowLeft className="h-4 w-4 text-cyan-400" />
                    <span className="font-semibold text-blue-200">Back to Years</span>
                </Link>

                {/* Header */}
                <div className="glass-card p-8 mb-12">
                    <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 px-4 py-2 rounded-full text-sm font-bold mb-4">
                        <span className="text-cyan-300">{regulation} Regulation</span>
                    </div>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                            <Calendar className="h-7 w-7 text-white" />
                        </div>
                        <h1 className="text-5xl font-black text-white">
                            Select Semester
                        </h1>
                    </div>
                    <p className="text-xl text-blue-200 ml-18">
                        {year}{yearSuffix} Year - Choose your semester
                    </p>
                </div>

                {/* Semester Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {SEMESTERS.map((sem) => (
                        <Link
                            key={sem}
                            href={`/resources/${year}/${sem}?regulation=${regulation}`}
                            className="group"
                        >
                            <div className="glass-card p-10 hover:bg-white/10 hover:scale-105 transition-all duration-300 relative overflow-hidden">
                                {/* Decorative gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="relative z-10 text-center">
                                    <div className="mb-6 inline-block">
                                        <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Calendar className="h-12 w-12 text-white" />
                                        </div>
                                    </div>

                                    <h2 className="text-4xl font-black text-white mb-3">
                                        Semester {sem}
                                    </h2>
                                    <p className="text-blue-200 mb-6">
                                        View Subjects & Labs
                                    </p>

                                    <div className="inline-flex items-center text-cyan-300 font-bold group-hover:gap-2 transition-all">
                                        <span>View Subjects</span>
                                        <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
