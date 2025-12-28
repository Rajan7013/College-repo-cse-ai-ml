'use client';

import { type Resource } from '@/lib/actions/resources';
import { useEffect, useRef } from 'react';
import { logActivity } from '@/lib/actions/analytics';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Dynamically import viewers to avoid SSR issues
const PDFViewer = dynamic(() => import('./viewers/PDFViewer'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-full bg-slate-900">
            <div className="text-center">
                <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
                <p className="text-white font-medium">Loading PDF viewer...</p>
            </div>
        </div>
    ),
});

const PPTViewer = dynamic(() => import('./viewers/PPTViewer'), { ssr: false });
const WordViewer = dynamic(() => import('./viewers/WordViewer'), { ssr: false });
const ImageViewer = dynamic(() => import('./viewers/ImageViewer'), { ssr: false });

interface DocumentViewerProps {
    resource: Resource;
}

export default function DocumentViewer({ resource }: DocumentViewerProps) {
    const startTimeRef = useRef<number>(Date.now());

    useEffect(() => {
        // Log view on mount
        const startTime = Date.now();
        startTimeRef.current = startTime;

        logActivity({
            action: 'view_document',
            resourceId: resource.id,
            resourceTitle: resource.title,
            details: `Opened ${resource.filename}`
        });

        // Log duration on unmount
        return () => {
            const duration = (Date.now() - startTime) / 1000;
            if (duration > 5) {
                logActivity({
                    action: 'view_document',
                    resourceId: resource.id,
                    resourceTitle: resource.title,
                    details: `Closed after viewing`,
                    durationSeconds: Math.round(duration)
                });
            }
        };
    }, [resource]);

    const fileType = resource.fileType?.toUpperCase();
    const fileUrl = resource.fileUrl;
    const filename = resource.filename;

    // Route to appropriate custom viewer
    switch (fileType) {
        case 'PDF':
            return <PDFViewer fileUrl={fileUrl} filename={filename} />;

        case 'PPT':
            return <PPTViewer fileUrl={fileUrl} filename={filename} />;

        case 'WORD':
            return <WordViewer fileUrl={fileUrl} filename={filename} />;

        case 'IMAGE':
            return <ImageViewer fileUrl={fileUrl} filename={filename} />;

        default:
            return (
                <div className="flex items-center justify-center h-full bg-slate-50 p-8">
                    <div className="text-center max-w-md">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                            Preview Not Available
                        </h3>
                        <p className="text-slate-600 mb-4">
                            This file type cannot be previewed. Download to view on your device.
                        </p>
                        <a
                            href={fileUrl}
                            download={filename}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                        >
                            Download {filename}
                        </a>
                    </div>
                </div>
            );
    }
}
