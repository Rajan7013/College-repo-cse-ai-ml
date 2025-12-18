import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import { getSubjectByCode } from '@/lib/actions/curriculum';

export default async function SyllabusPage({
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
        return <div className="min-h-screen py-8 px-4"><div className="glass-card p-8 text-center text-white">Subject not found</div></div>;
    }

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-5xl mx-auto">
                <Link href={`/resources/${year}/${semester}/${subjectCode}?regulation=${regulation}`} className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8 hover:bg-white/10 transition-all">
                    <ArrowLeft className="h-4 w-4 text-cyan-400" />
                    <span className="font-semibold text-blue-200">Back to Units</span>
                </Link>

                <div className="glass-card p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center">
                            <FileText className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white">{subject.name}</h1>
                            <p className="text-cyan-300 font-bold">{subject.code} - Syllabus</p>
                        </div>
                    </div>

                    <div className="space-y-6 text-blue-100">
                        {Object.entries(subject.units || {}).map(([unitNum, unitData]) => (
                            <div key={unitNum} className="bg-white/5 rounded-xl p-6 border border-blue-400/20 hover:border-blue-400/40 transition-all">
                                <h3 className="text-2xl font-bold text-white mb-3">Unit {unitNum}: {unitData.title}</h3>
                                {unitData.topics && unitData.topics.length > 0 && (
                                    <ul className="space-y-2">
                                        {unitData.topics.map((topic, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <span className="text-cyan-400 mt-1">•</span>
                                                <span>{topic}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
