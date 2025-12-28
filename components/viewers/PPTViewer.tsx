'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Download, Loader2, Presentation } from 'lucide-react';

interface PPTViewerProps {
    fileUrl: string;
    filename?: string;
}

export default function PPTViewer({ fileUrl, filename }: PPTViewerProps) {
    const [currentSlide, setCurrentSlide] = useState(1);
    const [slideInput, setSlideInput] = useState('');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [loading, setLoading] = useState(true);

    const containerRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // For now, we'll use Microsoft Office Online viewer
    // In future, we can implement server-side PPTX to images conversion
    const viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;

    const handleSlideJump = (e: FormEvent) => {
        e.preventDefault();
        // Note: Office Online viewer doesn't support programmatic slide navigation
        // This is a placeholder for future custom implementation
        setSlideInput('');
    };

    const toggleFullscreen = () => {
        if (!containerRef.current) return;

        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    return (
        <div ref={containerRef} className="flex flex-col h-full bg-slate-900">
            {/* Control Bar */}
            <div className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
                {/* Navigation - Placeholder for future implementation */}
                <div className="flex items-center gap-2">
                    <Presentation className="h-5 w-5 text-orange-400" />
                    <span className="text-white text-sm font-medium">{filename || 'Presentation'}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleFullscreen}
                        className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                        title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                    >
                        {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                    </button>
                    <a
                        href={fileUrl}
                        download={filename}
                        className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                        title="Download"
                    >
                        <Download className="h-5 w-5" />
                    </a>
                </div>
            </div>

            {/* PowerPoint Viewer */}
            <div className="flex-1 relative bg-slate-900">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-10">
                        <div className="text-center">
                            <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
                            <p className="text-white font-medium">Loading presentation...</p>
                        </div>
                    </div>
                )}
                <iframe
                    ref={iframeRef}
                    src={viewerUrl}
                    className="w-full h-full border-0"
                    title={filename}
                    onLoad={() => setLoading(false)}
                    allow="fullscreen"
                />
            </div>

            {/* Info */}
            <div className="bg-slate-800 border-t border-slate-700 px-4 py-2 text-xs text-slate-400 text-center">
                Use the controls in the viewer to navigate slides
            </div>
        </div>
    );
}
