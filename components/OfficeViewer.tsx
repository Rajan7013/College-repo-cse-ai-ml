'use client';

import { Download, ExternalLink } from 'lucide-react';

interface OfficeViewerProps {
    url: string;
    filename: string;
    type: string;
}

export default function OfficeViewer({ url, filename, type }: OfficeViewerProps) {
    // Google Docs Viewer URL
    const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Toolbar */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                    Viewing via Google Docs Viewer
                </div>

                <div className="flex items-center space-x-2">
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                    >
                        <ExternalLink className="h-4 w-4" />
                        <span>Open Original</span>
                    </a>

                    <a
                        href={url}
                        download={filename}
                        className="flex items-center space-x-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium"
                    >
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                    </a>
                </div>
            </div>

            {/* Google Docs Viewer */}
            <div className="flex-1">
                <iframe
                    src={viewerUrl}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    title={`${type} Viewer - ${filename}`}
                    className="w-full h-full"
                />
            </div>
        </div>
    );
}
