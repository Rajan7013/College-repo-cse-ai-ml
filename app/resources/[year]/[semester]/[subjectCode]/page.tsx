import Link from 'next/link';
import { ArrowLeft, BookOpen, FileText, Search } from 'lucide-react';
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

    const subject = await getSubjectByCode(subjectCode, regulation as string);


    if (!subject) {
        return (
            <div className="min-h-screen py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="glass-card p-16 text-center">
                        <BookOpen className="h-16 w-16 text-blue-400 mx-auto mb-4 opacity-50" />
                        <h2 className="text-2xl font-bold text-white mb-2">Subject Not Found</h2>
                        <p className="text-blue-200 mb-6">The requested subject could not be found.</p>
                        <Link href="/resources" className="btn-gradient px-6 py-3 rounded-xl font-bold inline-block">
                            Back to Resources
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const units = Object.entries(subject.units || {});

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumbs */}
                <Link href={`/resources/${year}/${semester}?regulation=${regulation}`} className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8 hover:bg-white/10 transition-all">
                    <ArrowLeft className="h-4 w-4 text-cyan-400" />
                    <span className="font-semibold text-blue-200">Back to Subjects</span>
                </Link>

                {/* Header */}
                <div className="glass-card p-8 mb-8">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center">
                                <BookOpen className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-white mb-2">{subject.name}</h1>
                                <p className="text-blue-200">Select a unit to view study materials</p>
                            </div>
                        </div>
                        <span className="px-4 py-2 bg-amber-500/20 border border-amber-400/30 text-amber-300 font-black rounded-xl">
                            {subject.code}
                        </span>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <Link href={`/resources/${year}/${semester}/${subjectCode}/syllabus?regulation=${regulation}`} className="glass-card p-6 hover:bg-white/10 hover:scale-105 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                                <FileText className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">View Syllabus</h3>
                                <p className="text-sm text-blue-200">Complete course outline</p>
                            </div>
                        </div>
                    </Link>
                    <Link href="/search" className="glass-card p-6 hover:bg-white/10 hover:scale-105 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                <Search className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Search Resources</h3>
                                <p className="text-sm text-blue-200">Find specific materials</p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Units Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {units.map(([unitNumber, unitData]) => (
                        <Link
                            key={unitNumber}
                            href={`/resources/${year}/${semester}/${subjectCode}/${unitNumber}?regulation=${regulation}`}
                            className="group glass-card p-8 hover:bg-white/10 hover:scale-105 transition-all"
                        >
                            <div className="text-6xl font-black text-cyan-400 mb-4 opacity-50 group-hover:opacity-100 transition-opacity">
                                {unitNumber}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{unitData.title}</h3>
                            <p className="text-sm text-blue-200 mb-4">{unitData.topics?.slice(0, 2).join(', ') || 'View materials'}</p>
                            <div className="text-cyan-300 font-semibold">View Resources →</div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
