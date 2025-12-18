'use client';

import { useState, useRef, useEffect } from 'react';
import { uploadResource } from '@/lib/actions/upload';
import { getSubjects, Subject } from '@/lib/actions/curriculum';
import { Upload, FileText, CheckCircle, XCircle, Loader2, File, ImageIcon, Presentation, CloudUpload, Sparkles, BookOpen, Layers } from 'lucide-react';
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
    // ... (Keep existing state and logic)
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    // Dynamic Data
    const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
    const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [selectedReg, setSelectedReg] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedSem, setSelectedSem] = useState('');

    useEffect(() => {
        getSubjects().then(setAllSubjects);
    }, []);

    // Filter Logic
    useEffect(() => {
        if (!selectedReg || !selectedYear || !selectedSem) {
            setFilteredSubjects([]);
            return;
        }
        const filtered = allSubjects.filter(sub =>
            sub.regulation === selectedReg &&
            sub.year === parseInt(selectedYear) &&
            sub.semester === parseInt(selectedSem)
        );
        setFilteredSubjects(filtered);
    }, [selectedReg, selectedYear, selectedSem, allSubjects]);


    const getFileIcon = (file: File) => {
        if (file.type.includes('pdf')) return <FileText className="h-12 w-12 text-red-400 mb-2" />;
        if (file.type.includes('image')) return <ImageIcon className="h-12 w-12 text-blue-400 mb-2" />;
        if (file.type.includes('presentation') || file.type.includes('powerpoint'))
            return <Presentation className="h-12 w-12 text-orange-400 mb-2" />;
        if (file.type.includes('word') || file.type.includes('document'))
            return <File className="h-12 w-12 text-blue-400 mb-2" />;
        return <File className="h-12 w-12 text-gray-400 mb-2" />;
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
        <div className="min-h-screen bg-[var(--bg-navy)] relative overflow-hidden font-sans text-white">
            {/* Aurora Background */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-500/10 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto py-12 px-4">
                {/* Header */}
                <div className="text-center mb-10 space-y-2">
                    <h1 className="text-4xl font-black text-white tracking-tight flex items-center justify-center gap-3">
                        <CloudUpload className="h-10 w-10 text-blue-400" />
                        Upload Resource
                    </h1>
                    <p className="text-blue-200 text-lg">
                        Share <span className="text-white font-bold">knowledge</span> with the community
                    </p>
                </div>

                {/* Success Animation */}
                {success && (
                    <div className="mb-8 glass-card border-green-500/30 bg-green-500/10 p-4 rounded-2xl flex items-center justify-center">
                        <SuccessAnimation />
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-8 bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center gap-3 animate-in slide-in-from-top-2">
                        <XCircle className="h-6 w-6 text-red-400 flex-shrink-0" />
                        <p className="text-red-200 font-medium">{error}</p>
                    </div>
                )}

                {/* Upload Progress */}
                {uploading && progress > 0 && (
                    <div className="mb-8">
                        <UploadProgress progress={progress} fileName={selectedFile?.name || ''} />
                    </div>
                )}

                {/* Upload Form */}
                <div className="glass-card rounded-3xl p-8 relative overflow-hidden border border-white/10 shadow-2xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-2xl rounded-full -mr-16 -mt-16" />

                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-8 relative z-10">
                        {/* File Upload Area */}
                        <div>
                            <label className="block text-sm font-bold text-blue-200 mb-3 ml-1 flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                File Attachment *
                            </label>
                            <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 group cursor-pointer relative overflow-hidden ${selectedFile ? 'border-blue-500 bg-blue-500/5' : 'border-white/20 hover:border-blue-400 hover:bg-white/5'}`}>
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
                                    className="cursor-pointer flex flex-col items-center w-full h-full"
                                >
                                    {selectedFile ? (
                                        <div className="animate-in zoom-in-50 duration-300">
                                            {getFileIcon(selectedFile)}
                                            <p className="text-lg font-bold text-white mt-2">
                                                {selectedFile.name}
                                            </p>
                                            <p className="text-sm text-blue-300 mt-1 font-mono">
                                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                            <div className="mt-4 px-4 py-1.5 bg-blue-500/20 rounded-full text-blue-300 text-xs font-bold uppercase tracking-wider">
                                                Click to change
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="group-hover:scale-105 transition-transform duration-300">
                                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
                                                <Upload className="h-8 w-8 text-white" />
                                            </div>
                                            <p className="text-lg font-bold text-white">
                                                Click to upload or drag & drop
                                            </p>
                                            <p className="text-sm text-blue-300/60 mt-2">
                                                PDF, Images, PowerPoint, Word (Max 10MB)
                                            </p>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Academic Context */}
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-violet-400" />
                                Academic Context
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {[
                                    { label: 'Regulation', value: selectedReg, setValue: setSelectedReg, options: REGULATIONS },
                                    { label: 'Year', value: selectedYear, setValue: setSelectedYear, options: YEARS.map(y => y.value.toString()) },
                                    { label: 'Semester', value: selectedSem, setValue: setSelectedSem, options: SEMESTERS.map(s => s.toString()) },
                                    { label: 'Branch', value: undefined, setValue: undefined, options: BRANCH_OPTIONS.map(b => b.value), isBranch: true }
                                ].map((field, idx) => (
                                    <div key={idx}>
                                        <label className="block text-xs font-bold text-blue-300 mb-2 uppercase tracking-wide">
                                            {field.label}
                                        </label>
                                        <div className="relative">
                                            <select
                                                name={field.label.toLowerCase()}
                                                value={field.value}
                                                onChange={field.setValue ? (e) => field.setValue!(e.target.value) : undefined}
                                                className="w-full px-4 py-3 bg-[#0f172a]/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer transition-all hover:bg-[#0f172a]/70"
                                                required
                                                disabled={uploading}
                                            >
                                                <option value="" className="bg-slate-900 text-slate-400">Select {field.label}</option>
                                                {field.isBranch ? (
                                                    BRANCH_OPTIONS.map(branch => (
                                                        <option key={branch.value} value={branch.value} className="bg-slate-900">{branch.label}</option>
                                                    ))
                                                ) : (
                                                    field.options.map(opt => (
                                                        <option key={opt} value={opt} className="bg-slate-900">
                                                            {field.label === 'Year' && opt !== 'All' ? `${opt}st Year` : (field.label === 'Semester' && opt !== 'All' ? `Sem ${opt}` : opt)}
                                                        </option>
                                                    ))
                                                )}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <Layers className="h-4 w-4 text-blue-400/50" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Subject Selection */}
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-amber-400" />
                                Subject Details
                            </h3>

                            {filteredSubjects.length > 0 ? (
                                <div>
                                    <label className="block text-xs font-bold text-blue-300 mb-2 uppercase tracking-wide">
                                        Select Subject *
                                    </label>
                                    <select
                                        value={selectedSubjectId}
                                        onChange={(e) => setSelectedSubjectId(e.target.value)}
                                        className="w-full px-4 py-3 bg-[#0f172a]/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                                        required
                                        disabled={uploading}
                                    >
                                        <option value="" className="bg-slate-900">-- Choose Subject --</option>
                                        {filteredSubjects.map(sub => (
                                            <option key={sub.id} value={sub.id} className="bg-slate-900">
                                                {sub.code} - {sub.name}
                                            </option>
                                        ))}
                                    </select>
                                    <input type="hidden" name="title" value={filteredSubjects.find(s => s.id === selectedSubjectId)?.name || ''} />
                                    <input type="hidden" name="subjectCode" value={filteredSubjects.find(s => s.id === selectedSubjectId)?.code || ''} />
                                </div>
                            ) : (
                                <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl text-orange-200 text-sm flex items-center gap-3">
                                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                    {!selectedReg || !selectedYear || !selectedSem
                                        ? "Please select Regulation, Year, and Semester above first."
                                        : "No subjects found for this selection."
                                    }
                                </div>
                            )}
                        </div>

                        {/* Document Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-bold text-blue-300 mb-2 uppercase tracking-wide">Document Type</label>
                                <select
                                    name="documentType"
                                    className="w-full px-4 py-3 bg-[#0f172a]/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                                    required
                                    disabled={uploading}
                                >
                                    <option value="" className="bg-slate-900">Select Type</option>
                                    {DOCUMENT_TYPES.map(type => (
                                        <option key={type} value={type} className="bg-slate-900">{type}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-blue-300 mb-2 uppercase tracking-wide">Unit</label>
                                <select
                                    name="unit"
                                    className="w-full px-4 py-3 bg-[#0f172a]/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                                    required
                                    disabled={uploading}
                                >
                                    <option value="" className="bg-slate-900">Select Unit</option>
                                    {/* Dynamic Units Logic */}
                                    {(() => {
                                        const currentSubject = allSubjects.find(s => s.id === selectedSubjectId);
                                        if (currentSubject && currentSubject.units && Object.keys(currentSubject.units).length > 0) {
                                            const unitKeys = Object.keys(currentSubject.units).sort((a, b) => parseInt(a) - parseInt(b));
                                            return (
                                                <>
                                                    {unitKeys.map(key => (
                                                        <option key={key} value={key} className="bg-slate-900">
                                                            Unit {key}: {currentSubject.units[key].title || `Unit ${key}`}
                                                        </option>
                                                    ))}
                                                    <option value="all" className="bg-slate-900">All Units (Combined)</option>
                                                </>
                                            );
                                        }
                                        return UNITS.map(unit => (
                                            <option key={unit.value} value={unit.value} className="bg-slate-900">
                                                {unit.label}
                                            </option>
                                        ));
                                    })()}
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-bold text-blue-300 mb-2 uppercase tracking-wide">Description (Optional)</label>
                            <textarea
                                name="description"
                                rows={3}
                                placeholder="Brief description..."
                                className="w-full px-4 py-3 bg-[#0f172a]/50 border border-white/10 rounded-xl text-white placeholder-blue-300/30 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                disabled={uploading}
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={uploading || !selectedFile}
                                className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>Uploading Resource...</span>
                                    </>
                                ) : (
                                    <>
                                        <CloudUpload className="h-5 w-5" />
                                        <span>Upload Resource</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

function AlertCircle(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
        </svg>
    )
}
