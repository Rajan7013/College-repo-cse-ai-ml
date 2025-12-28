'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

interface PDFViewerProps {
    fileUrl: string;
    filename?: string;
}

export default function PDFViewer({ fileUrl, filename }: PDFViewerProps) {
    const [loading, setLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    // Add zoom parameter for mobile - fit to width
    const pdfUrl = `${fileUrl}#view=FitH&zoom=page-width`;

    return (
        <div ref={containerRef} className="h-full bg-slate-900">
            {/* PDF Iframe - Browser's Native Viewer */}
            <div className="h-full relative bg-slate-900">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-10">
                        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                    </div>
                )}
                <iframe
                    src={pdfUrl}
                    className="w-full h-full border-0"
                    title={filename}
                    onLoad={() => setLoading(false)}
                    style={{
                        backgroundColor: '#525659',
                    }}
                />
            </div>
        </div>
    );
}
