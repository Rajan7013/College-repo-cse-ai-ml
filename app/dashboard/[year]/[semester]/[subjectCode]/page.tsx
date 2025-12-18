import Link from 'next/link';
import { Book, ChevronRight, ArrowLeft, FileText, Layers } from 'lucide-react';
import { getSubjectByCode } from '@/lib/actions/curriculum';

export default async function SubjectDetailPage({
    params,
    searchParams
}: {
    params: Promise<{ year: string; semester: string; subjectCode: string }>,
    searchParams: Promise<{ regulation?: string }>
}) {
    const { year, semester, subjectCode } = await params;
    const { regulation = 'R23' } = await searchParams;

    const subject = await getSubjectByCode(subjectCode, regulation);

    if (!subject) {
        return (
            <div className="min-h-screen py-12 px-4 flex items-center justify-center">
                <div className="glass-card p-16 text-center">
                    <Book className="h-16 w-16 text-blue-400 mx-auto mb-4 opacity-50" />
                    <h3 className="text-2xl font-bold text-white mb-2">Subject Not Found</h3>
                    <p className="text-blue-200">
                        Could not find subject with code {subjectCode}
                    </p>
                    <Link href={`/dashboard/${year}/${semester}?regulation=${regulation}`} className="mt-6 inline-block text-cyan-400 hover:text-white font-bold">
                        ← Back to Semester
                    </Link>
                </div>
            </div>
        );
    }

    const units = [1, 2, 3, 4, 5];

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumbs */}
                <div className="flex flex-wrap gap-3 mb-8">
                    <Link href={`/dashboard/${year}?regulation=${regulation}`} className="glass-card px-4 py-2 hover:bg-white/10 transition-all text-blue-200 hover:text-white text-sm font-semibold">
                        {year} Year
                    </Link>
                    <span className="text-blue-400">/</span>
                    <Link href={`/dashboard/${year}/${semester}?regulation=${regulation}`} className="glass-card px-4 py-2 hover:bg-white/10 transition-all text-blue-200 hover:text-white text-sm font-semibold">
                        Sem {semester}
                    </Link>
                    <span className="text-blue-400">/</span>
                    <span className="glass-card px-4 py-2 text-white text-sm font-bold border-2 border-cyan-400/30">
                        {subject.code}
                    </span>
                </div>

                {/* Subject Header */}
                <div className="glass-card p-8 mb-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 px-4 py-2 rounded-full text-sm font-bold mb-4">
                            <span className="text-blue-300">{subject.regulation} Regulation</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                            {subject.name}
                        </h1>
                        <div className="flex flex-wrap gap-6 text-blue-200">
                            <div className="flex items-center gap-2">
                                <span className="bg-white/10 px-3 py-1 rounded-lg text-sm font-mono font-bold text-cyan-300">{subject.code}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="bg-white/10 px-3 py-1 rounded-lg text-sm font-bold text-emerald-300">{subject.branch}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Syllabus / Overview Column */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="glass-card p-8">
                            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                                <FileText className="h-6 w-6 text-cyan-400" />
                                <h2 className="text-2xl font-bold text-white">Full Syllabus Overview</h2>
                            </div>

                            {/* Units Accordion / List */}
                            <div className="space-y-6">
                                {Object.entries(subject.units || {}).sort().map(([unitKey, data]: [string, any]) => (
                                    <div key={unitKey} className="group">
                                        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                            <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-300 text-sm">
                                                {unitKey.replace('unit', '')}
                                            </span>
                                            {data.title}
                                        </h3>
                                        <div className="pl-10 text-blue-200/70 text-sm leading-relaxed">
                                            <ul className="list-disc leading-loose">
                                                {data.topics?.slice(0, 3).map((t: string, i: number) => (
                                                    <li key={i}>{t}</li>
                                                ))}
                                                {data.topics?.length > 3 && (
                                                    <li className="list-none text-cyan-400/80 italic text-xs mt-1">
                                                        + {data.topics.length - 3} more topics...
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                                {Object.keys(subject.units || {}).length === 0 && (
                                    <p className="text-blue-200/50 italic">No syllabus details added yet.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Units Navigation Column */}
                    <div className="space-y-6">
                        <div className="glass-card p-6 border-2 border-blue-400/20">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Layers className="h-5 w-5 text-emerald-400" />
                                Study Units
                            </h3>
                            <p className="text-blue-200/70 text-sm mb-6">
                                Select a unit to view its detailed syllabus and access study materials.
                            </p>

                            <div className="grid grid-cols-1 gap-3">
                                {units.map((unit) => (
                                    <Link
                                        key={unit}
                                        href={`/dashboard/${year}/${semester}/${subjectCode}/unit/${unit}?regulation=${regulation}`}
                                        className="group"
                                    >
                                        <div className="p-4 rounded-xl bg-white/5 hover:bg-blue-600/20 border border-white/5 hover:border-blue-400/30 transition-all flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                                    {unit}
                                                </div>
                                                <span className="font-bold text-white group-hover:text-cyan-300 transition-colors">Unit {unit}</span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
