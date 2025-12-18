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
        <div className="bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 overflow-hidden group">
            {/* Icon & Header */}
            <div className="p-4 border-b border-slate-100">
                <div className="flex items-start gap-3">
                    <div className="p-3 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                        {getFileIcon(resource.fileType)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {resource.title}
                        </h3>
                        {resource.description && (
                            <p className="text-sm text-slate-600 line-clamp-1 mt-1">
                                {resource.description}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Metadata */}
            <div className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                    <span className="font-semibold">{resource.subjectCode}</span>
                    {resource.documentType && (
                        <>
                            <span>•</span>
                            <span>{resource.documentType}</span>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
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
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-md">
                        {resource.regulation}
                    </span>
                    <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-md">
                        Year {resource.year} Sem {resource.semester}
                    </span>
                    <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-md">
                        Unit {resource.unit}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                <Link
                    href={`/viewer/${resource.id}`}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                >
                    <Eye className="h-4 w-4" />
                    View
                </Link>
                <a
                    href={resource.fileUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-lg border border-slate-200 transition-colors flex items-center gap-2 text-sm"
                >
                    <Download className="h-4 w-4" />
                    Download
                </a>
            </div>
        </div>
    );
}
