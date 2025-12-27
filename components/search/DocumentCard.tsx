'use client';

import { Resource } from '@/lib/actions/resources';
import { FileText, Download, Eye, Calendar, HardDrive } from 'lucide-react';
import { formatBytes, formatDate } from '@/lib/utils';
import Link from 'next/link';

interface DocumentCardProps {
    resource: Resource;
}

export default function DocumentCard({ resource }: DocumentCardProps) {
    const getFileIcon = (fileType?: string) => {
        if (!fileType) return <FileText className="h-8 w-8 text-slate-500" />;

        switch (fileType.toLowerCase()) {
            case 'pdf':
                return <FileText className="h-8 w-8 text-red-500" />;
            case 'image':
                return <FileText className="h-8 w-8 text-green-500" />;
            case 'ppt':
                return <FileText className="h-8 w-8 text-orange-500" />;
            case 'word':
                return <FileText className="h-8 w-8 text-blue-500" />;
            default:
                return <FileText className="h-8 w-8 text-slate-500" />;
        }
    };

    return (
        <div className="glass-card overflow-hidden group hover:border-blue-400/50 hover:shadow-glow transition-all duration-300">
            {/* Icon & Header */}
            <div className="p-4 border-b border-white/10">
                <div className="flex items-start gap-3">
                    <div className="p-3 bg-white/5 rounded-lg group-hover:bg-blue-500/20 transition-colors border border-white/5">
                        {getFileIcon(resource.fileType)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-white line-clamp-2 group-hover:text-blue-400 transition-colors">
                            {resource.title}
                        </h3>
                        {resource.description && (
                            <p className="text-sm text-blue-200/70 line-clamp-1 mt-1">
                                {resource.description}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Metadata */}
            <div className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-blue-200/80">
                    <span className="font-semibold text-blue-100">{resource.subjectCode}</span>
                    {resource.documentType && (
                        <>
                            <span>•</span>
                            <span>{resource.documentType}</span>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-4 text-xs text-blue-300/60">
                    <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(resource.uploadedAt)}
                    </span>
                    {resource.fileSize && (
                        <span className="flex items-center gap-1">
                            <HardDrive className="h-3 w-3" />
                            {formatBytes(resource.fileSize)}
                        </span>
                    )}
                </div>
                <div className="flex gap-2 flex-wrap">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-200 text-xs font-semibold rounded-md border border-blue-500/20">
                        {resource.regulation}
                    </span>
                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded-md border border-emerald-500/20">
                        Year {resource.year} Sem {resource.semester}
                    </span>
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs font-semibold rounded-md border border-purple-500/20">
                        Unit {resource.unit}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="p-4 bg-white/5 border-t border-white/10 flex gap-2">
                <Link
                    href={`/viewer/${resource.id}?returnUrl=/search`}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                >
                    <Eye className="h-4 w-4" />
                    View
                </Link>
                <a
                    href={resource.fileUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-blue-100 font-semibold rounded-lg border border-white/10 transition-colors flex items-center gap-2 text-sm"
                >
                    <Download className="h-4 w-4" />
                    Download
                </a>
            </div>
        </div>
    );
}
