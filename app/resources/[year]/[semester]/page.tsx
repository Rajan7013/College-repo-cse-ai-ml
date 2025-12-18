import Link from 'next/link';
import { Book, ChevronRight, ArrowLeft } from 'lucide-react';
import { getSubjects } from '@/lib/actions/curriculum';

export default async function SubjectPage({
    params,
    searchParams
}: {
    params: Promise<{ year: string; semester: string }>,
    searchParams: Promise<{ regulation?: string }>
}) {
    const { year, semester } = await params;
    const { regulation = 'R23' } = await searchParams;

    const subjects = await getSubjects({
        year: parseInt(year),
        semester: parseInt(semester),
        regulation: regulation as string
    });

    const yearSuffix = year === '1' ? 'st' : year === '2' ? 'nd' : year === '3' ? 'rd' : 'th';

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumbs */}
                <div className="flex flex-wrap gap-3 mb-8">
                    <Link href="/resources" className="glass-card px-4 py-2 hover:bg-white/10 transition-all text-blue-200 hover:text-white text-sm font-semibold">
                        Years
                    </Link>
                    <span className="text-blue-400">/</span>
                    <Link href={`/resources/${year}?regulation=${regulation}`} className="glass-card px-4 py-2 hover:bg-white/10 transition-all text-blue-200 hover:text-white text-sm font-semibold">
                        {year}{yearSuffix} Year
                    </Link>
                    <span className="text-blue-400">/</span>
                    <span className="glass-card px-4 py-2 text-white text-sm font-bold border-2 border-cyan-400/30">
                        Semester {semester}
                    </span>
                </div>

                {/* Header */}
                <div className="glass-card p-8 mb-12">
                    <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 px-4 py-2 rounded-full text-sm font-bold mb-4">
                        <span className="text-indigo-300">{regulation} Regulation</span>
                    </div>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
                            <Book className="h-7 w-7 text-white" />
                        </div>
                        <h1 className="text-5xl font-black text-white">
                            Subjects
                        </h1>
                    </div>
                    <p className="text-xl text-blue-200 ml-18">
                        Select a subject to view units and study materials
                    </p>
                </div>

                {/* Subjects Grid */}
                <div className="max-w-6xl mx-auto">
                    {subjects.length === 0 ? (
                        <div className="glass-card p-16 text-center">
                            <Book className="h-16 w-16 text-blue-400 mx-auto mb-4 opacity-50" />
                            <h3 className="text-2xl font-bold text-white mb-2">No Subjects Found</h3>
                            <p className="text-blue-200 max-w-md mx-auto">
                                No subjects found for this semester.
                                <span className="text-sm text-blue-300 mt-2 block">
                                    (Admin: Ensure database is seeded via Admin Panel)
                                </span>
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {subjects.map((sub) => (
                                <Link
                                    key={sub.code}
                                    href={`/resources/${year}/${semester}/${sub.code}?regulation=${regulation}`}
                                    className="group"
                                >
                                    <div className="glass-card p-8 hover:bg-white/10 hover:scale-105 transition-all duration-300 h-full flex flex-col">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                                <Book className="h-7 w-7 text-white" />
                                            </div>
                                            <span className="px-3 py-1 bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-black rounded-lg uppercase tracking-wider group-hover:bg-amber-500/30 transition-colors">
                                                {sub.code}
                                            </span>
                                        </div>

                                        <h3 className="text-2xl font-black text-white mb-3 leading-tight group-hover:text-cyan-300 transition-colors">
                                            {sub.name}
                                        </h3>

                                        <div className="mt-auto pt-6 border-t border-blue-400/20 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                                                <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">
                                                    {Object.keys(sub.units || {}).length} Units
                                                </span>
                                            </div>
                                            <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-blue-300 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                                                <ChevronRight className="h-5 w-5" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
