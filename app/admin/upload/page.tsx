'use client';

import { useState, useRef } from 'react';
import { uploadResource } from '@/lib/actions/upload';
import { Upload, FileText, CheckCircle, XCircle, Loader2, File, ImageIcon, Presentation } from 'lucide-react';
import UploadProgress from '@/components/UploadProgress';
import SuccessAnimation from '@/components/SuccessAnimation';

import {
    BRANCH_OPTIONS,
    REGULATIONS,
    DOCUMENT_TYPES,
    UNITS,
    YEARS,
    SEMESTERS
} from '@/lib/constants';

export default function AdminUploadPage() {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const getFileIcon = (file: File) => {
        if (file.type.includes('pdf')) return <FileText className="h-12 w-12 text-red-500 mb-2" />;
        if (file.type.includes('image')) return <ImageIcon className="h-12 w-12 text-blue-500 mb-2" />;
        if (file.type.includes('presentation') || file.type.includes('powerpoint'))
            return <Presentation className="h-12 w-12 text-orange-500 mb-2" />;
        if (file.type.includes('word') || file.type.includes('document'))
            return <File className="h-12 w-12 text-blue-700 mb-2" />;
        return <File className="h-12 w-12 text-gray-500 mb-2" />;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const allowedTypes = [
                'application/pdf',
                'image/jpeg', 'image/png',
                'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ];
            if (!allowedTypes.includes(file.type)) {
                setError('Supported: PDF, Images (JPG/PNG), PowerPoint (PPT/PPTX), Word (DOC/DOCX)');
                setSelectedFile(null);
                return;
            }
            setSelectedFile(file);
            setError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedFile) {
            setError('Please select a file');
            return;
        }

        setUploading(true);
        setError(null);
        setSuccess(false);
        setProgress(0);

        // Simulate progress
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + 10;
            });
        }, 200);

        const formData = new FormData(e.currentTarget);

        try {
            const result = await uploadResource(formData);

            setProgress(100);
            clearInterval(progressInterval);

            if (result.success) {
                setSuccess(true);
                setSelectedFile(null);
                formRef.current?.reset();

                // Auto-hide success after 5 seconds
                setTimeout(() => {
                    setSuccess(false);
                    setProgress(0);
                }, 5000);
            } else {
                setError(result.message);
                setProgress(0);
            }
        } catch (err) {
            clearInterval(progressInterval);
            setError(err instanceof Error ? err.message : 'Upload failed');
            setProgress(0);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-blue-900 mb-2">
                        Upload Academic Resource
                    </h1>
                    <p className="text-gray-600">
                        Upload notes, papers, and study materials for students
                    </p>
                </div>

                {/* Success Animation */}
                {success && (
                    <div className="mb-6">
                        <SuccessAnimation />
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
                        <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {/* Upload Progress */}
                {uploading && progress > 0 && (
                    <div className="mb-6">
                        <UploadProgress progress={progress} fileName={selectedFile?.name || ''} />
                    </div>
                )}

                {/* Upload Form */}
                <div className="bg-white rounded-xl shadow-xl p-8">
                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                        {/* File Upload */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                File (PDF, Image, PPT, Word) *
                            </label>
                            <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                                <input
                                    type="file"
                                    name="file"
                                    accept=".pdf,.jpg,.jpeg,.png,.ppt,.pptx,.doc,.docx"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="file-upload"
                                    required
                                    disabled={uploading}
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="cursor-pointer flex flex-col items-center"
                                >
                                    {selectedFile ? (
                                        <>
                                            {getFileIcon(selectedFile)}
                                            <p className="text-sm font-medium text-gray-900">
                                                {selectedFile.name}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-12 w-12 text-blue-500 mb-2" />
                                            <p className="text-sm font-medium text-gray-700">
                                                Click to select file
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                PDF, Images, PowerPoint, Word
                                            </p>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Subject Details Section */}
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Subject Title *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        placeholder="e.g., Data Structures and Algorithms"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                        required
                                        disabled={uploading}
                                    />
                                </div>

                                {/* Subject Code */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Subject Code *
                                    </label>
                                    <input
                                        type="text"
                                        name="subjectCode"
                                        placeholder="e.g., CS201"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                        required
                                        disabled={uploading}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Academic Information Section */}
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Branch */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Branch *
                                    </label>
                                    <select
                                        name="branch"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                        required
                                        disabled={uploading}
                                    >
                                        <option value="">Select Branch</option>
                                        {BRANCH_OPTIONS.map(branch => (
                                            <option key={branch.value} value={branch.value}>
                                                {branch.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Regulation */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Regulation *
                                    </label>
                                    <select
                                        name="regulation"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                        required
                                        disabled={uploading}
                                    >
                                        <option value="">Select Regulation</option>
                                        {REGULATIONS.map(reg => (
                                            <option key={reg} value={reg}>{reg}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Year */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Year *
                                    </label>
                                    <select
                                        name="year"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                        required
                                        disabled={uploading}
                                    >
                                        <option value="">Select Year</option>
                                        {YEARS.map(year => (
                                            <option key={year} value={year}>
                                                {year}{year === '1' ? 'st' : year === '2' ? 'nd' : year === '3' ? 'rd' : 'th'} Year
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Semester */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Semester *
                                    </label>
                                    <select
                                        name="semester"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                        required
                                        disabled={uploading}
                                    >
                                        <option value="">Select Semester</option>
                                        {SEMESTERS.map(sem => (
                                            <option key={sem} value={sem}>Semester {sem}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Document Classification Section */}
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Classification</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Document Type */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Document Type *
                                    </label>
                                    <select
                                        name="documentType"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                        required
                                        disabled={uploading}
                                    >
                                        <option value="">Select Document Type</option>
                                        {DOCUMENT_TYPES.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Unit */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Unit *
                                    </label>
                                    <select
                                        name="unit"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                        required
                                        disabled={uploading}
                                    >
                                        <option value="">Select Unit</option>
                                        {UNITS.map(unit => (
                                            <option key={unit.value} value={unit.value}>
                                                {unit.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Additional Details Section */}
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Details (Optional)</h3>

                            {/* Tags */}
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Tags (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    name="tags"
                                    placeholder="e.g., algorithms, sorting, data structures"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                    disabled={uploading}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Add keywords to help students search better
                                </p>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    rows={3}
                                    placeholder="Brief description of the resource..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                    disabled={uploading}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="border-t pt-6">
                            <button
                                type="submit"
                                disabled={uploading || !selectedFile}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>Uploading...</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="h-5 w-5" />
                                        <span>Upload Resource</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Info */}
                <div className="mt-6 text-center text-sm text-gray-600">
                    <p>All fields marked with * are required</p>
                </div>
            </div>
        </div>
    );
}
