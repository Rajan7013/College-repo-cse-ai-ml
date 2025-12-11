'use client';

import { type Resource } from '@/lib/actions/resources';
import PDFViewer from './PDFViewer';
import ImageViewer from './ImageViewer';
import OfficeViewer from './OfficeViewer';

interface DocumentViewerProps {
    resource: Resource;
}

export default function DocumentViewer({ resource }: DocumentViewerProps) {
    // Route to appropriate viewer based on file type
    switch (resource.fileType) {
        case 'PDF':
            return <PDFViewer url={resource.fileUrl} filename={resource.filename} />;

        case 'Image':
            return <ImageViewer url={resource.fileUrl} filename={resource.filename} />;

        case 'PPT':
        case 'Word':
            return (
                <OfficeViewer
                    url={resource.fileUrl}
                    filename={resource.filename}
                    type={resource.fileType}
                />
            );

        default:
            return (
                <div className="flex items-center justify-center h-screen bg-gray-100">
                    <div className="text-center">
                        <p className="text-xl font-semibold text-gray-700 mb-4">
                            Unable to preview this file type
                        </p>
                        <a
                            href={resource.fileUrl}
                            download={resource.filename}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                        >
                            Download File
                        </a>
                    </div>
                </div>
            );
    }
}
