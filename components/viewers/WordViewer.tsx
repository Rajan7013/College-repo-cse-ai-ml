'use client';

import { useState, useEffect, useRef } from 'react';
import mammoth from 'mammoth';
import { Maximize2, Minimize2, Download, Loader2, FileText } from 'lucide-react';

interface WordViewerProps {
    fileUrl: string;
    filename?: string;
}

export default function WordViewer({ fileUrl, filename }: WordViewerProps) {
    const [htmlContent, setHtmlContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadWord = async () => {
            try {
                setLoading(true);

                // Fetch the file
                const response = await fetch(fileUrl);
                const arrayBuffer = await response.arrayBuffer();

                // Convert to HTML using mammoth
                const result = await mammoth.convertToHtml({ arrayBuffer });
                setHtmlContent(result.value);

                if (result.messages.length > 0) {
                    console.warn('Conversion warnings:', result.messages);
                }

                setLoading(false);
            } catch (err) {
                console.error('Error loading Word document:', err);
                setError('Failed to load document');
                setLoading(false);
            }
        };

        loadWord();
    }, [fileUrl]);

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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full bg-white">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-slate-700 font-medium">Loading Word document...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full bg-white">
                <div className="text-center max-w-md">
                    <FileText className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Error Loading Document</h3>
                    <p className="text-slate-600 mb-4">{error}</p>
                    <a
                        href={fileUrl}
                        download={filename}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                    >
                        <Download className="h-5 w-5" />
                        Download Document
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="flex flex-col h-full bg-white">
            {/* Control Bar */}
            <div className="bg-slate-100 border-b border-slate-300 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span className="text-slate-700 font-medium text-sm">{filename || 'Document'}</span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleFullscreen}
                        className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
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

            {/* Document Content */}
            <div className="flex-1 overflow-auto bg-white">
                <div className="max-w-4xl mx-auto p-8">
                    <div
                        className="prose prose-slate max-w-none"
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                        style={{
                            fontFamily: 'Georgia, serif',
                            fontSize: '16px',
                            lineHeight: '1.6',
                            color: '#1e293b',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
