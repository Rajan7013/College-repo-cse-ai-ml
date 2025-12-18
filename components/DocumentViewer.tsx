'use client';

import { type Resource } from '@/lib/actions/resources';
import { useState, useEffect, useRef } from 'react';
import { Download, Maximize2, Minimize2, Loader2 } from 'lucide-react';
import { logActivity } from '@/lib/actions/analytics';

interface DocumentViewerProps {
    resource: Resource;
}

export default function DocumentViewer({ resource }: DocumentViewerProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [loading, setLoading] = useState(true);
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
            if (duration > 5) { // Only log if viewed for more than 5 seconds
                logActivity({
                    action: 'view_document', // Re-logging as 'view' with duration, or could be a custom action
                    resourceId: resource.id,
                    resourceTitle: resource.title,
                    details: `Closed after viewing`,
                    durationSeconds: Math.round(duration)
                });
            }
        };
    }, [resource]);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const renderViewer = () => {
        const fileType = resource.fileType?.toUpperCase();
        const fileUrl = resource.fileUrl;

        switch (fileType) {
            case 'PDF':
                return (
                    <iframe
                        src={`${fileUrl}#view=FitH&toolbar=1&navpanes=0`}
                        className="w-full h-full border-0"
                        title={resource.filename}
                        onLoad={() => setLoading(false)}
                    />
                );

            case 'IMAGE':
                return (
                    <div className="w-full h-full flex items-center justify-center bg-black">
                        <img
                            src={fileUrl}
                            alt={resource.filename}
                            className="max-w-full max-h-full object-contain"
                            onLoad={() => setLoading(false)}
                        />
                    </div>
                );

            case 'PPT':
            case 'WORD':
                // Use Google Docs Viewer for Office files (lightweight and fast)
                return (
                    <iframe
                        src={`https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`}
                        className="w-full h-full border-0"
                        title={resource.filename}
                        onLoad={() => setLoading(false)}
                    />
                );

            default:
                // For other file types, provide download option
                setLoading(false);
                return (
                    <div className="flex flex-col items-center justify-center h-full bg-slate-50 p-8">
                        <div className="text-center max-w-md">
                            <div className="mb-6">
                                <Download className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-slate-900 mb-2">
                                    Preview Not Available
                                </h3>
                                <p className="text-slate-600">
                                    This file type cannot be previewed in the browser.
                                    Download to view on your device.
                                </p>
                            </div>
                            <a
                                href={fileUrl}
                                download={resource.filename}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                            >
                                <Download className="h-5 w-5" />
                                Download {resource.filename}
                            </a>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="relative w-full h-full bg-slate-100">
            {/* Loading Indicator */}
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white z-50">
                    <div className="text-center">
                        <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
                        <p className="text-slate-600 font-medium">Loading document...</p>
                        <p className="text-sm text-slate-500 mt-2">Optimized for slow networks</p>
                    </div>
                </div>
            )}

            {/* Fullscreen Toggle Button */}
            <button
                onClick={toggleFullscreen}
                className="absolute top-4 right-4 z-40 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg transition-all"
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
                {isFullscreen ? (
                    <Minimize2 className="h-5 w-5" />
                ) : (
                    <Maximize2 className="h-5 w-5" />
                )}
            </button>

            {/* Viewer Content */}
            <div className="w-full h-full">
                {renderViewer()}
            </div>
        </div>
    );
}
