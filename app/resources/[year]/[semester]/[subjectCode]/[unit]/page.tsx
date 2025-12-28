'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, FileText, Image as ImageIcon, File, Presentation, Eye, Download, Search, Sparkles } from 'lucide-react';
import { getResources, type Resource } from '@/lib/actions/resources';
import { DOCUMENT_TYPES, STATIC_SUBJECTS } from '@/lib/constants';
import { DETAILED_SYLLABUS } from '@/lib/syllabus-data';

import { Suspense } from 'react';

function DocumentListContent({ year, semester, subjectCode, unit }: { year: string; semester: string; subjectCode: string; unit: string }) {
    const searchParams = useSearchParams();
    const regulation = searchParams.get('regulation') || 'R23';
    const decodedSubjectCode = decodeURIComponent(subjectCode);

    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');

    useEffect(() => {
        async function fetchResources() {
            setLoading(true);
            const allResources = await getResources({
                regulation,
                year: parseInt(year),
                semester: parseInt(semester)
            });

            // Filter for Subject and Unit
            const filtered = allResources.filter(r => {
                const matchSubject = r.subjectCode === decodedSubjectCode;
                const matchUnit = unit === 'all' || r.unit === parseInt(unit) || r.unit === 'all' || (unit === 'syllabus' && r.documentType === 'Syllabus');
                return matchSubject && matchUnit;
            });

            setResources(filtered);
            setLoading(false);
        }
        fetchResources();
    }, [year, semester, subjectCode, unit, regulation, decodedSubjectCode]);

    // Group documents by type for tabs/filtering
    const availableTypes = ['All', ...Array.from(new Set(resources.map(r => r.documentType)))];

    const displayedResources = activeTab === 'All'
        ? resources
        : resources.filter(r => r.documentType === activeTab);

    // Helper functions (reused from original dashboard)
    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            'Notes': 'bg-blue-500/20 text-blue-300 border-blue-400/30',
            'MID-1 Question Paper': 'bg-orange-500/20 text-orange-300 border-orange-400/30',
            'MID-2 Question Paper': 'bg-orange-500/20 text-orange-300 border-orange-400/30',
            'Lab Manual': 'bg-purple-500/20 text-purple-300 border-purple-400/30',
            'Syllabus': 'bg-teal-500/20 text-teal-300 border-teal-400/30',
            'Assignment': 'bg-green-500/20 text-green-300 border-green-400/30',
        };
        return colors[category] || 'bg-gray-500/20 text-gray-300 border-gray-400/30';
    };

    const getFileIcon = (fileType?: string) => {
        switch (fileType) {
            case 'PDF': return <FileText className="h-6 w-6 text-red-400" />;
            case 'Image': return <ImageIcon className="h-6 w-6 text-blue-400" />;
            case 'PPT': return <Presentation className="h-6 w-6 text-orange-400" />;
            case 'Word': return <File className="h-6 w-6 text-blue-300" />;
            default: return <FileText className="h-6 w-6 text-slate-400" />;
        }
    };

    const getViewUrl = (resource: Resource) => {
        if (resource.fileType === 'PPT' || resource.fileType === 'Word') {
            return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(resource.fileUrl)}`;
        }
        return resource.fileUrl;
    };

    // Get specific unit syllabus if available
    const unitNumber = parseInt(unit);
    const unitSyllabus = (unit !== 'all' && unit !== 'syllabus' && !isNaN(unitNumber) && DETAILED_SYLLABUS[decodedSubjectCode]?.units[unitNumber])
        ? DETAILED_SYLLABUS[decodedSubjectCode].units[unitNumber]
        : null;

    // Find Subject Name
    let subjectName = decodedSubjectCode;
    Object.values(STATIC_SUBJECTS).forEach(list => {
        const found = list.find(s => s.code === decodedSubjectCode);
        if (found) subjectName = found.name;
    });

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumbs */}
                <div className="mb-8 flex flex-wrap items-center gap-3">
                    <Link href={`/resources/${year}/${semester}/${subjectCode}?regulation=${regulation}`} className="glass-card px-4 py-2 hover:bg-white/10 transition-all flex items-center gap-2 text-sm text-blue-200">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Units
                    </Link>
                    <span className="text-blue-500">/</span>
                    <span className="glass-card px-4 py-2 text-white font-bold text-sm bg-blue-500/10 border-blue-400/30">
                        {unit === 'syllabus' ? 'Syllabus' : unit === 'all' ? 'All Units' : `Unit ${unit}`}
                    </span>
                </div>

                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col gap-6">
                        <div className="glass-card p-8">
                            <div className="flex items-center space-x-2 text-sm font-bold text-cyan-400 mb-2 uppercase tracking-wide">
                                <span>B.Tech {regulation}</span>
                                <span className="text-blue-500">•</span>
                                <span>{year} Year</span>
                                <span className="text-blue-500">•</span>
                                <span>{semester} Semester</span>
                            </div>
                            <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
                                {unit === 'syllabus' ? `${subjectName} Syllabus` : `Unit ${unit} Resources`}
                                <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
                            </h1>
                            <p className="text-blue-200 font-medium text-lg">
                                {subjectName} <span className="text-blue-400">({decodedSubjectCode})</span>
                            </p>
                        </div>

                        {/* Unit Syllabus Card */}
                        {unitSyllabus && (
                            <div className="glass-card p-6 border-l-4 border-l-blue-500 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5">
                                    <FileText className="h-32 w-32 text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3 relative z-10">
                                    <div className="p-2 bg-blue-500/20 rounded-lg">
                                        <FileText className="h-5 w-5 text-cyan-300" />
                                    </div>
                                    <span>{unitSyllabus.title}</span>
                                </h2>
                                <div className="space-y-3 pl-1 relative z-10">
                                    {unitSyllabus.topics.map((topic, i) => (
                                        <div key={i} className="flex items-start text-blue-100 text-sm md:text-base leading-relaxed">
                                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 mr-3 flex-shrink-0 shadow-[0_0_10px_rgba(34,211,238,0.5)]"></span>
                                            <span>{topic}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                {resources.length > 0 && unit !== 'syllabus' && (
                    <div className="flex overflow-x-auto space-x-2 mb-8 pb-2 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-transparent">
                        {availableTypes.map(type => (
                            <button
                                key={type}
                                onClick={() => setActiveTab(type)}
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${activeTab === type
                                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-transparent shadow-lg shadow-blue-500/25 scale-105'
                                    : 'glass-card text-blue-200 hover:text-white hover:bg-white/10 border-blue-500/10'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                )}

                {/* Grid */}
                {loading ? (
                    <div className="glass-card p-20 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                        <p className="text-blue-200">Loading resources...</p>
                    </div>
                ) : displayedResources.length === 0 ? (
                    <div className="glass-card p-16 text-center border-dashed border-blue-400/30">
                        <FileText className="h-16 w-16 text-blue-400/50 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No Documents Found</h3>
                        <p className="text-blue-200">Nothing has been uploaded for this category yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedResources.map((resource) => (
                            <div key={resource.id} className="group glass-card p-6 hover:bg-white/10 hover:scale-[1.02] transition-all duration-300">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getCategoryColor(resource.documentType)}`}>
                                        {resource.documentType}
                                    </span>
                                    <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                                        {getFileIcon(resource.fileType)}
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-300 transition-colors" title={resource.title}>
                                    {resource.title}
                                </h3>

                                <div className="text-sm text-blue-300 mb-6 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-blue-400"></div>
                                        Uploaded: {new Date(resource.uploadedAt).toISOString().split('T')[0]}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-blue-400"></div>
                                        Size: {(resource.fileSize ? resource.fileSize / 1024 / 1024 : 0).toFixed(2)} MB
                                    </div>
                                </div>

                                <Link
                                    href={`/viewer/${resource.id}?returnUrl=${encodeURIComponent(`/resources/${year}/${semester}/${subjectCode}/${unit}?regulation=${regulation}`)}`}
                                    className="block w-full"
                                >
                                    <button className="btn-gradient w-full py-2.5 px-4 rounded-xl font-bold shadow-lg flex items-center justify-center space-x-2 group/btn">
                                        <Eye className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                                        <span>View Document</span>
                                    </button>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function DocumentListPage({ params }: { params: Promise<{ year: string; semester: string; subjectCode: string; unit: string }> }) {
    const { year, semester, subjectCode, unit } = use(params);
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading Documents...</div>}>
            <DocumentListContent year={year} semester={semester} subjectCode={subjectCode} unit={unit} />
        </Suspense>
    );
}
