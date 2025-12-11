'use client';

import { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Maximize2, Download, RefreshCw } from 'lucide-react';

interface ImageViewerProps {
    url: string;
    filename: string;
}

export default function ImageViewer({ url, filename }: ImageViewerProps) {
    const [scale, setScale] = useState<number>(1.0);
    const [rotation, setRotation] = useState<number>(0);

    const zoomIn = () => setScale(Math.min(3, scale + 0.2));
    const zoomOut = () => setScale(Math.max(0.5, scale - 0.2));
    const rotate = () => setRotation((rotation + 90) % 360);
    const reset = () => {
        setScale(1.0);
        setRotation(0);
    };

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <div className="h-full flex flex-col bg-gray-900">
            {/* Toolbar */}
            <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between flex-wrap gap-4">
                {/* Zoom Controls */}
                <div className="flex items-center space-x-2">
                    <button
                        onClick={zoomOut}
                        className="p-2 rounded-lg hover:bg-gray-700 text-white"
                        title="Zoom Out"
                    >
                        <ZoomOut className="h-5 w-5" />
                    </button>

                    <span className="px-3 py-1 bg-gray-700 rounded-lg text-white font-medium min-w-[60px] text-center">
                        {Math.round(scale * 100)}%
                    </span>

                    <button
                        onClick={zoomIn}
                        className="p-2 rounded-lg hover:bg-gray-700 text-white"
                        title="Zoom In"
                    >
                        <ZoomIn className="h-5 w-5" />
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                    <button
                        onClick={rotate}
                        className="p-2 rounded-lg hover:bg-gray-700 text-white"
                        title="Rotate 90°"
                    >
                        <RotateCw className="h-5 w-5" />
                    </button>

                    <button
                        onClick={reset}
                        className="p-2 rounded-lg hover:bg-gray-700 text-white"
                        title="Reset View"
                    >
                        <RefreshCw className="h-5 w-5" />
                    </button>

                    <a
                        href={url}
                        download={filename}
                        className="p-2 rounded-lg hover:bg-gray-700 text-white"
                        title="Download"
                    >
                        <Download className="h-5 w-5" />
                    </a>

                    <button
                        onClick={toggleFullScreen}
                        className="p-2 rounded-lg hover:bg-gray-700 text-white"
                        title="Full Screen"
                    >
                        <Maximize2 className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Image Content */}
            <div className="flex-1 overflow-auto flex items-center justify-center p-4">
                <img
                    src={url}
                    alt={filename}
                    className="max-w-full max-h-full object-contain transition-transform duration-300 ease-in-out"
                    style={{
                        transform: `scale(${scale}) rotate(${rotation}deg)`,
                    }}
                />
            </div>

            {/* Info Bar */}
            <div className="bg-gray-800 border-t border-gray-700 px-4 py-2 text-center text-sm text-gray-400">
                {filename}
            </div>
        </div>
    );
}
