'use client';

import { useState, useEffect } from 'react';
import { getResources, type Resource } from '@/lib/actions/resources';
import { FileText, Download, Loader2, Image as ImageIcon, File, Presentation, Eye } from 'lucide-react';
import AdvancedSearch, { type SearchFilters } from '@/components/AdvancedSearch';

export default function DashboardPage() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch resources on mount
    useEffect(() => {
        async function fetchResources() {
            setLoading(true);
            const data = await getResources();
            setResources(data);
            setFilteredResources(data);
            setLoading(false);
        }
        fetchResources();
    }, []);

    // Handle advanced search
    const handleSearch = (filters: SearchFilters) => {
        let filtered = [...resources];

        // Search term - search across multiple fields
        if (filters.searchTerm) {
            const term = filters.searchTerm.toLowerCase();
            filtered = filtered.filter(r =>
                r.title.toLowerCase().includes(term) ||
                r.subjectCode.toLowerCase().includes(term) ||
                r.description.toLowerCase().includes(term) ||
                r.tags.some(tag => tag.toLowerCase().includes(term))
            );
        }

        // Branch filter
        if (filters.branch) {
            filtered = filtered.filter(r => r.branch === filters.branch);
        }

        // Regulation filter
        if (filters.regulation) {
            filtered = filtered.filter(r => r.regulation === filters.regulation);
        }

        // Year filter
        if (filters.year) {
            filtered = filtered.filter(r => r.year === parseInt(filters.year));
        }

        // Semester filter
        if (filters.semester) {
            filtered = filtered.filter(r => r.semester === parseInt(filters.semester));
        }

        // Document type filter
        if (filters.documentType) {
            filtered = filtered.filter(r => r.documentType === filters.documentType);
        }

        // Unit filter
        if (filters.unit) {
            filtered = filtered.filter(r => {
                if (filters.unit === 'all') return r.unit === 'all';
                return r.unit === parseInt(filters.unit) || r.unit === 'all';
            });
        }

        // File type filter
        if (filters.fileType) {
            filtered = filtered.filter(r => r.fileType === filters.fileType);
        }

        // Sorting
        switch (filters.sortBy) {
            case 'date-desc':
                filtered.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
                break;
            case 'date-asc':
                filtered.sort((a, b) => a.uploadedAt.getTime() - b.uploadedAt.getTime());
                break;
            case 'title-asc':
                filtered.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'title-desc':
                filtered.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'size-desc':
                filtered.sort((a, b) => (b.fileSize || 0) - (a.fileSize || 0));
                break;
            case 'size-asc':
                filtered.sort((a, b) => (a.fileSize || 0) - (b.fileSize || 0));
                break;
        }

        setFilteredResources(filtered);
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            'Notes': 'bg-blue-100 text-blue-800',
            'MID-1 Question Paper': 'bg-orange-100 text-orange-800',
            'MID-2 Question Paper': 'bg-orange-100 text-orange-800',
            'Lab Manual': 'bg-purple-100 text-purple-800',
            'Lab Exam Question Paper': 'bg-red-100 text-red-800',
            'Internal Lab Exam': 'bg-red-100 text-red-800',
            'External Lab Exam': 'bg-red-100 text-red-800',
            'Final Semester Exam': 'bg-red-100 text-red-800',
            'Assignment': 'bg-green-100 text-green-800',
            'Project': 'bg-indigo-100 text-indigo-800',
            'Study Material': 'bg-teal-100 text-teal-800',
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };

    const getFileIcon = (fileType?: string) => {
        switch (fileType) {
            case 'PDF':
                return <FileText className="h-6 w-6 text-red-500" />;
            case 'Image':
                return <ImageIcon className="h-6 w-6 text-blue-500" />;
            case 'PPT':
                return <Presentation className="h-6 w-6 text-orange-500" />;
            case 'Word':
                return <File className="h-6 w-6 text-blue-700" />;
            default:
                return <FileText className="h-6 w-6 text-gray-500" />;
        }
    };

    const getDownloadButtonText = (fileType?: string) => {
        switch (fileType) {
            case 'Image':
                return 'View Image';
            case 'PDF':
                return 'View PDF';
            case 'PPT':
                return 'View PPT';
            case 'Word':
                return 'View Word';
            default:
                return 'View File';
        }
    };

    const getViewUrl = (resource: Resource) => {
        // For PPT and Word, use Microsoft Office Online Viewer
        if (resource.fileType === 'PPT' || resource.fileType === 'Word') {
            return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(resource.fileUrl)}`;
        }

        // For PDF and Images, use direct URL (browser handles it)
        return resource.fileUrl;
    };

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-blue-900 mb-2">
                        Academic Resources
                    </h1>
                    <p className="text-gray-600">
                        Search and download study materials, papers, and notes
                    </p>
                </div>

                {/* Advanced Search */}
                <AdvancedSearch onSearch={handleSearch} />

                {/* Results Count */}
                <div className="mb-4 text-sm text-gray-600">
                    Showing <span className="font-semibold text-gray-900">{filteredResources.length}</span> of{' '}
                    <span className="font-semibold text-gray-900">{resources.length}</span> resources
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                    </div>
                )}

                {/* Resources Grid */}
                {!loading && filteredResources.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredResources.map((resource) => (
                            <div
                                key={resource.id}
                                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6"
                            >
                                {/* Document Type Badge */}
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(resource.documentType)}`}>
                                        {resource.documentType}
                                    </span>
                                    {getFileIcon(resource.fileType)}
                                </div>

                                {/* Title */}
                                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                                    {resource.title}
                                </h3>

                                {/* Details */}
                                <div className="space-y-1 mb-4 text-sm text-gray-600">
                                    <p>
                                        <span className="font-semibold">Code:</span> {resource.subjectCode}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Regulation:</span> {resource.regulation} •
                                        Year {resource.year} • Sem {resource.semester}
                                    </p>
                                    {resource.unit && resource.unit !== 'all' && (
                                        <p>
                                            <span className="font-semibold">Unit:</span> {resource.unit}
                                        </p>
                                    )}
                                    {resource.tags && resource.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {resource.tags.slice(0, 3).map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* View Button */}
                                <a
                                    href={getViewUrl(resource)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full"
                                >
                                    <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center space-x-2">
                                        <Eye className="h-4 w-4" />
                                        <span>{getDownloadButtonText(resource.fileType)}</span>
                                    </button>
                                </a>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredResources.length === 0 && (
                    <div className="text-center py-20">
                        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            No Resources Found
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {resources.length === 0
                                ? 'No resources have been uploaded yet.'
                                : 'Try adjusting your search or filters to see more results.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
