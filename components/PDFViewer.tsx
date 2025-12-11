'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Download, Printer, Loader2 } from 'lucide-react';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
    url: string;
    filename: string;
}

export default function PDFViewer({ url, filename }: PDFViewerProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scale, setScale] = useState<number>(1.2);
    const [loading, setLoading] = useState<boolean>(true);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setLoading(false);
    };

    const goToPrevPage = () => setPageNumber(Math.max(1, pageNumber - 1));
    const goToNextPage = () => setPageNumber(Math.min(numPages, pageNumber + 1));
    const zoomIn = () => setScale(Math.min(3, scale + 0.2));
    const zoomOut = () => setScale(Math.max(0.5, scale - 0.2));

    const handlePrint = () => {
        window.print();
    };

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <div className="h-full flex flex-col bg-gray-100">
            {/* Toolbar */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-wrap gap-4">
                {/* Page Navigation */}
                <div className="flex items-center space-x-2">
                    <button
                        onClick={goToPrevPage}
                        disabled={pageNumber <= 1}
                        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Previous Page"
                    >
                        <ChevronLeft className="h-5 w-5 text-gray-700" />
                    </button>

                    <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-lg">
                        <input
                            type="number"
                            min={1}
                            max={numPages}
                            value={pageNumber}
                            onChange={(e) => {
                                const page = parseInt(e.target.value);
                                if (page >= 1 && page <= numPages) {
                                    setPageNumber(page);
                                }
                            }}
                            className="w-12 text-center bg-transparent text-gray-900 font-medium focus:outline-none"
                        />
                        <span className="text-gray-600">/ {numPages}</span>
                    </div>

                    <button
                        onClick={goToNextPage}
                        disabled={pageNumber >= numPages}
                        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Next Page"
                    >
                        <ChevronRight className="h-5 w-5 text-gray-700" />
                    </button>
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center space-x-2">
                    <button
                        onClick={zoomOut}
                        className="p-2 rounded-lg hover:bg-gray-100"
                        title="Zoom Out"
                    >
                        <ZoomOut className="h-5 w-5 text-gray-700" />
                    </button>

                    <span className="px-3 py-1 bg-gray-100 rounded-lg text-gray-900 font-medium min-w-[60px] text-center">
                        {Math.round(scale * 100)}%
                    </span>

                    <button
                        onClick={zoomIn}
                        className="p-2 rounded-lg hover:bg-gray-100"
                        title="Zoom In"
                    >
                        <ZoomIn className="h-5 w-5 text-gray-700" />
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                    <button
                        onClick={handlePrint}
                        className="p-2 rounded-lg hover:bg-gray-100"
                        title="Print"
                    >
                        <Printer className="h-5 w-5 text-gray-700" />
                    </button>

                    <a
                        href={url}
                        download={filename}
                        className="p-2 rounded-lg hover:bg-gray-100"
                        title="Download"
                    >
                        <Download className="h-5 w-5 text-gray-700" />
                    </a>

                    <button
                        onClick={toggleFullScreen}
                        className="p-2 rounded-lg hover:bg-gray-100"
                        title="Full Screen"
                    >
                        <Maximize2 className="h-5 w-5 text-gray-700" />
                    </button>
                </div>
            </div>

            {/* PDF Content */}
            <div className="flex-1 overflow-auto flex justify-center py-6">
                {loading && (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                    </div>
                )}

                <Document
                    file={url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                        </div>
                    }
                    error={
                        <div className="flex flex-col items-center justify-center h-full text-red-600">
                            <p className="text-lg font-semibold mb-2">Failed to load PDF</p>
                            <p className="text-sm">Please try downloading the file instead.</p>
                        </div>
                    }
                >
                    <Page
                        pageNumber={pageNumber}
                        scale={scale}
                        className="shadow-2xl"
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                    />
                </Document>
            </div>
        </div>
    );
}
