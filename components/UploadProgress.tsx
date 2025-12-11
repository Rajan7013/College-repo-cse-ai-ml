'use client';

import { CheckCircle, Loader2 } from 'lucide-react';

interface UploadProgressProps {
    progress: number;  // 0-100
    fileName: string;
}

export default function UploadProgress({ progress, fileName }: UploadProgressProps) {
    const isComplete = progress === 100;

    return (
        <div className="w-full bg-white rounded-lg p-6 shadow-lg border-2 border-blue-200">
            {/* File name */}
            <div className="flex items-center space-x-3 mb-4">
                {isComplete ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                    <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                )}
                <span className="text-sm font-medium text-gray-900">{fileName}</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
                <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Progress text */}
            <div className="flex justify-between text-sm text-gray-600">
                <span className="font-medium">{isComplete ? 'Upload Complete!' : 'Uploading...'}</span>
                <span className="font-semibold text-blue-600">{progress}%</span>
            </div>
        </div>
    );
}
