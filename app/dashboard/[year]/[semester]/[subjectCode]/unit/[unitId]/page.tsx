import Link from 'next/link';
import { Book, ChevronRight, FileText, Download, PlayCircle, File } from 'lucide-react';
import { getSubjectByCode } from '@/lib/actions/curriculum';
import { getResources } from '@/lib/actions/resources';

export default async function UnitDetailPage({
    params,
    searchParams
}: {
    params: Promise<{ year: string; semester: string; subjectCode: string; unitId: string }>,
    searchParams: Promise<{ regulation?: string }>
}) {
    const { year, semester, subjectCode, unitId } = await params;
    const { regulation = 'R23' } = await searchParams;

    const unitNumber = parseInt(unitId);

    // Fetch Subject & Resources in parallel
    const [subject, resources] = await Promise.all([
        getSubjectByCode(subjectCode, regulation),
        getResources({
            regulation,
            subjectCode,
            unit: unitNumber // Convert string to number if needed, resources action handles it
        })
    ]);

    if (!subject) {
        return <div>Subject not found</div>;
    }

    const unitKey = `unit${unitId}`;
    const unitData = subject.units?.[unitKey];

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumbs */}
                <div className="flex flex-wrap gap-3 mb-8">
                    <Link href={`/dashboard/${year}/${semester}/${subjectCode}?regulation=${regulation}`} className="glass-card px-4 py-2 hover:bg-white/10 transition-all text-blue-200 hover:text-white text-sm font-semibold flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 rotate-180" />
                        Back to Subject
                    </Link>
                    <span className="text-blue-400">/</span>
                    <span className="glass-card px-4 py-2 text-white text-sm font-bold border-2 border-cyan-400/30">
                        Unit {unitId}
                    </span>
                </div>

                {/* Unit Header */}
                <div className="glass-card p-8 mb-8 border-l-4 border-cyan-500">
                    <h2 className="text-blue-300 font-bold uppercase tracking-wider text-sm mb-2">Unit {unitId}</h2>
                    <h1 className="text-3xl md:text-4xl font-black text-white">
                        {unitData ? unitData.title : `Unit ${unitId} Syllabus`}
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN: SYLLABUS */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="glass-card p-6 border border-white/10">
                            <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                                <Book className="h-6 w-6 text-emerald-400" />
                                <h3 className="text-xl font-bold text-white">Unit Syllabus</h3>
                            </div>

                            {unitData ? (
                                <ul className="space-y-4">
                                    {unitData.topics.map((topic: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3 text-blue-100/80 leading-relaxed">
                                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2.5 shrink-0"></span>
                                            <span>{topic}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-blue-200/50 italic">Syllabus content not available for this unit.</p>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: RESOURCES */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="glass-card p-8 min-h-[500px]">
                            <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-6 w-6 text-blue-400" />
                                    <h3 className="text-2xl font-bold text-white">Study Materials</h3>
                                </div>
                                <span className="bg-blue-600 px-3 py-1 rounded-full text-xs font-bold text-white">
                                    {resources.length} Files
                                </span>
                            </div>

                            {resources.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <File className="h-10 w-10 text-blue-400/30" />
                                    </div>
                                    <h4 className="text-white font-bold text-lg mb-2">No Resources Yet</h4>
                                    <p className="text-blue-200/60 max-w-sm mx-auto">
                                        Admin has not uploaded any documents for this unit yet. Check back later!
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {resources.map((res) => (
                                        <div key={res.id} className="group glass-card p-4 hover:bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all flex items-center gap-6">
                                            {/* Icon based on type */}
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/20 to-cyan-600/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                                <FileText className="h-6 w-6 text-blue-400" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300">
                                                        {res.documentType}
                                                    </span>
                                                    <span className="text-xs text-blue-400/50">•</span>
                                                    <span className="text-xs text-blue-400/50">
                                                        {new Date(res.uploadedAt).toISOString().split('T')[0]}
                                                    </span>
                                                </div>
                                                <h4 className="text-white font-bold truncate group-hover:text-cyan-300 transition-colors">
                                                    {res.title}
                                                </h4>
                                                <p className="text-sm text-blue-200/60 truncate">
                                                    {res.description || res.filename}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <a
                                                    href={res.fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-emerald-500 hover:text-white flex items-center justify-center text-emerald-400 transition-all"
                                                    title="View / Download"
                                                >
                                                    <Download className="h-5 w-5" />
                                                </a>
                                                <a
                                                    href={`/viewer?url=${encodeURIComponent(res.fileUrl)}`}
                                                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-blue-500 hover:text-white flex items-center justify-center text-blue-400 transition-all"
                                                    title="Open in Viewer"
                                                >
                                                    <Book className="h-5 w-5" />
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
