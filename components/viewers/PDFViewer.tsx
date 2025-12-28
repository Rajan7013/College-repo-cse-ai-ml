'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { getSecureDownloadUrl } from '@/lib/actions/secure-download';

interface PDFViewerProps {
    fileUrl?: string;      // Legacy: public URL (deprecated)
    fileKey?: string;      // New: file key for signed URLs
    filename?: string;
}

export default function PDFViewer({ fileUrl, fileKey, filename }: PDFViewerProps) {
    const [secureUrl, setSecureUrl] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function loadSecureUrl() {
            try {
                setLoading(true);
                setError('');

                // If fileKey is provided, generate signed URL
                if (fileKey) {
                    const url = await getSecureDownloadUrl(fileKey);
                    setSecureUrl(url);
                }
                // Fallback to public URL for backward compatibility
                else if (fileUrl) {
                    setSecureUrl(fileUrl);
                }
                else {
                    throw new Error('No file URL or key provided');
                }
            } catch (err: any) {
                console.error('Failed to load PDF:', err);
                setError(err.message || 'Failed to load PDF. Please try again.');
            } finally {
                setLoading(false);
            }
        }

        loadSecureUrl();
    }, [fileKey, fileUrl]);

    // Add zoom parameter for mobile - fit to width
    const pdfUrl = secureUrl ? `${secureUrl}#view=FitH&zoom=page-width` : '';

    return (
        <div ref={containerRef} className="h-full bg-slate-900">
            {/* PDF Iframe - Browser's Native Viewer */}
            <div className="h-full relative bg-slate-900">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-10">
                        <div className="text-center">
                            <Loader2 className="h-8 w-8 text-blue-500 animate-spin mx-auto mb-2" />
                            <p className="text-sm text-blue-300">Loading secure PDF...</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-10">
                        <div className="text-center max-w-md px-4">
                            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                            <p className="text-white font-semibold mb-2">Failed to Load PDF</p>
                            <p className="text-sm text-gray-400">{error}</p>
                        </div>
                    </div>
                )}

                {!loading && !error && pdfUrl && (
                    <iframe
                        src={pdfUrl}
                        className="w-full h-full border-0"
                        title={filename}
                        style={{
                            backgroundColor: '#525659',
                        }}
                    />
                )}
            </div>
        </div>
    );
}
