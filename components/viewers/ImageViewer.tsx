'use client';

import { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Minimize2, Download, RotateCw, Loader2 } from 'lucide-react';

interface ImageViewerProps {
    fileUrl: string;
    filename?: string;
}

export default function ImageViewer({ fileUrl, filename }: ImageViewerProps) {
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

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

    const handleMouseDown = (e: React.MouseEvent) => {
        if (scale > 1) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const resetView = () => {
        setScale(1);
        setRotation(0);
        setPosition({ x: 0, y: 0 });
    };

    return (
        <div ref={containerRef} className="flex flex-col h-full bg-slate-900">
            {/* Control Bar */}
            <div className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
                {/* Zoom Controls */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setScale(s => Math.max(0.25, s - 0.25))}
                        className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                        title="Zoom Out"
                    >
                        <ZoomOut className="h-5 w-5" />
                    </button>
                    <span className="text-white text-sm min-w-[60px] text-center">
                        {Math.round(scale * 100)}%
                    </span>
                    <button
                        onClick={() => setScale(s => Math.min(5, s + 0.25))}
                        className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                        title="Zoom In"
                    >
                        <ZoomIn className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => setRotation(r => (r + 90) % 360)}
                        className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                        title="Rotate"
                    >
                        <RotateCw className="h-5 w-5" />
                    </button>
                    <button
                        onClick={resetView}
                        className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors"
                        title="Reset View"
                    >
                        Reset
                    </button>
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

            {/* Image Display */}
            <div
                className="flex-1 overflow-hidden bg-slate-900 flex items-center justify-center relative"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
            >
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
                    </div>
                )}
                <img
                    ref={imageRef}
                    src={fileUrl}
                    alt={filename}
                    onLoad={() => setLoading(false)}
                    className="max-w-full max-h-full object-contain transition-transform"
                    style={{
                        transform: `scale(${scale}) rotate(${rotation}deg) translate(${position.x / scale}px, ${position.y / scale}px)`,
                        transformOrigin: 'center',
                    }}
                    draggable={false}
                />
            </div>

            {/* Hints */}
            <div className="bg-slate-800 border-t border-slate-700 px-4 py-2 text-xs text-slate-400 text-center">
                {scale > 1 ? 'Drag to pan' : 'Zoom in to enable panning'}
            </div>
        </div>
    );
}
