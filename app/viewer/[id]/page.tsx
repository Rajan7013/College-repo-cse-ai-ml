import { notFound } from 'next/navigation';
import { getResourceById } from '@/lib/actions/resources';
import DocumentViewer from '@/components/DocumentViewer';
import Link from 'next/link';
import { ArrowLeft, Download } from 'lucide-react';

interface ViewerPageProps {
    params: Promise<{ id: string }>;
}

export default async function ViewerPage({ params }: ViewerPageProps) {
    const { id } = await params;
    const resource = await getResourceById(id);

    if (!resource) {
        notFound();
    }

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            {/* Compact Header */}
            <div className="glass-card rounded-none border-x-0 border-t-0 border-b border-blue-400/30 px-4 py-3 flex items-center justify-between z-50 bg-[#0A1628]/90 backdrop-blur-md">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <Link
                        href="/resources"
                        className="p-2 hover:bg-white/10 rounded-xl transition-colors flex-shrink-0 group"
                        title="Back to Resources"
                    >
                        <ArrowLeft className="h-5 w-5 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
                    </Link>

                    <div className="min-w-0 flex-1">
                        <h1 className="text-base md:text-lg font-bold text-white truncate flex items-center gap-2">
                            {resource.title}
                            <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full border border-blue-400/30 bg-blue-500/20 text-cyan-300`}>
                                {resource.fileType}
                            </span>
                        </h1>
                        <div className="hidden md:flex items-center space-x-2 text-xs text-blue-200 mt-0.5 font-medium">
                            <span>{resource.subjectCode}</span>
                            <span className="text-blue-500">•</span>
                            <span>{resource.documentType}</span>
                            <span className="text-blue-500">•</span>
                            <span>{resource.regulation}</span>
                        </div>
                    </div>
                </div>

                {/* Download Button */}
                <a
                    href={resource.fileUrl}
                    download={resource.filename}
                    className="btn-gradient px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold shadow-lg"
                    title="Download"
                >
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Download</span>
                </a>
            </div>

            {/* Full-Screen Document Viewer */}
            <div className="flex-1 overflow-hidden bg-[#0A1628]/50">
                <DocumentViewer resource={resource} />
            </div>
        </div>
    );
}
