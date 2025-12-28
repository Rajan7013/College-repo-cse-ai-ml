'use client';

import { notFound, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getResourceById } from '@/lib/actions/resources';
import DocumentViewer from '@/components/DocumentViewer';
import Link from 'next/link';
import { ArrowLeft, Download, Maximize2 } from 'lucide-react';

interface ViewerPageProps {
    params: Promise<{ id: string }>;
}

export default function ViewerPage({ params }: ViewerPageProps) {
    const [resource, setResource] = useState<any>(null);
    const [id, setId] = useState<string>('');
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get('returnUrl') || '/resources';

    useEffect(() => {
        params.then(p => {
            setId(p.id);
            getResourceById(p.id).then(res => {
                if (!res) {
                    notFound();
                }
                setResource(res);
            });
        });
    }, [params]);

    if (!resource) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#0A1628]">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    const handleFullscreen = () => {
        const viewer = document.querySelector('.flex-1.overflow-hidden');
        if (viewer) {
            if (!document.fullscreenElement) {
                viewer.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        }
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            {/* Ultra-Minimal Header */}
            <div className="glass-card rounded-none border-x-0 border-t-0 border-b border-blue-400/30 px-2 py-1 flex items-center justify-between z-50 bg-[#0A1628]/90 backdrop-blur-md">
                <div className="flex items-center space-x-1.5 flex-1 min-w-0">
                    <Link
                        href={returnUrl}
                        className="p-0.5 hover:bg-white/10 rounded transition-colors flex-shrink-0 group"
                        title="Back"
                    >
                        <ArrowLeft className="h-3.5 w-3.5 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
                    </Link>

                    <div className="min-w-0 flex-1">
                        <h1 className="text-[11px] md:text-xs font-bold text-white truncate flex items-center gap-1">
                            {resource.title}
                            <span className={`text-[8px] uppercase font-black px-1 py-0.5 rounded-full border border-blue-400/30 bg-blue-500/20 text-cyan-300`}>
                                {resource.fileType}
                            </span>
                        </h1>
                        <div className="hidden md:flex items-center space-x-1 text-[9px] text-blue-200 font-medium">
                            <span>{resource.subjectCode}</span>
                            <span className="text-blue-500">•</span>
                            <span>{resource.documentType}</span>
                            <span className="text-blue-500">•</span>
                            <span>{resource.regulation}</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-0.5">
                    <button
                        onClick={handleFullscreen}
                        className="p-0.5 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
                        title="Fullscreen"
                    >
                        <Maximize2 className="h-3 w-3" />
                    </button>
                    <a
                        href={resource.fileUrl}
                        download={resource.filename}
                        className="btn-gradient px-1.5 py-0.5 rounded flex items-center gap-0.5 text-[11px] font-bold shadow-lg"
                        title="Download"
                    >
                        <Download className="h-3 w-3" />
                        <span className="hidden sm:inline">Download</span>
                    </a>
                </div>
            </div>

            {/* Full-Screen Document Viewer */}
            <div className="flex-1 overflow-hidden bg-[#0A1628]/50">
                <DocumentViewer resource={resource} />
            </div>
        </div>
    );
}
