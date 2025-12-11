import { notFound } from 'next/navigation';
import { getResourceById } from '@/lib/actions/resources';
import DocumentViewer from '@/components/DocumentViewer';
import Link from 'next/link';
import { ArrowLeft, X } from 'lucide-react';

interface ViewerPageProps {
    params: Promise<{ id: string }>;
}

export default async function ViewerPage({ params }: ViewerPageProps) {
    const { id } = await params;
    const resource = await getResourceById(id);

    if (!resource) {
        notFound();
    }

    return (
        <div className="h-screen flex flex-col bg-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 flex items-center justify-between shadow-lg">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <Link
                        href="/dashboard"
                        className="p-2 hover:bg-blue-500 rounded-lg transition-colors flex-shrink-0"
                        title="Back to Dashboard"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>

                    <div className="min-w-0 flex-1">
                        <h1 className="text-lg font-semibold truncate">
                            {resource.title}
                        </h1>
                        <div className="flex items-center space-x-3 text-sm text-blue-100 mt-0.5">
                            <span>{resource.subjectCode}</span>
                            <span>•</span>
                            <span>{resource.documentType}</span>
                            <span>•</span>
                            <span>{resource.regulation}</span>
                        </div>
                    </div>
                </div>

                <Link
                    href="/dashboard"
                    className="p-2 hover:bg-blue-500 rounded-lg transition-colors flex-shrink-0"
                    title="Close"
                >
                    <X className="h-5 w-5" />
                </Link>
            </div>

            {/* Document Viewer */}
            <div className="flex-1 overflow-hidden">
                <DocumentViewer resource={resource} />
            </div>
        </div>
    );
}
