'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createSubject, updateSubject, Subject } from '@/lib/actions/curriculum';
import { Plus, Trash2, Save, Loader2, BookOpen, Layers, AlertCircle, Sparkles, X, Image as ImageIcon, Upload, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

interface UnitInput {
    id: number;
    title: string;
    topics: string; // new line separated
}

interface SubjectFormProps {
    initialData?: Subject;
}

export default function SubjectForm({ initialData }: SubjectFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isEditMode = !!initialData;

    // Basics
    const [regulation, setRegulation] = useState(initialData?.regulation || 'R23');
    const [year, setYear] = useState(initialData?.year?.toString() || '1');
    const [semester, setSemester] = useState(initialData?.semester?.toString() || '1');
    const [code, setCode] = useState(initialData?.code || '');
    const [name, setName] = useState(initialData?.name || '');
    const [branch, setBranch] = useState(initialData?.branch || 'Connect');
    const [subjectType, setSubjectType] = useState<'theory' | 'lab'>(initialData?.type || 'theory');

    // Units
    const [units, setUnits] = useState<UnitInput[]>([]);

    // Syllabus Details
    const [textbooks, setTextbooks] = useState<string>('');
    const [references, setReferences] = useState<string>('');

    // AI State
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [aiInput, setAiInput] = useState('');
    const [aiImages, setAiImages] = useState<string[]>([]);
    const [aiLoading, setAiLoading] = useState(false);

    // Initialize complex state
    useEffect(() => {
        if (initialData) {
            // Units
            if (initialData.units) {
                const loadedUnits = Object.entries(initialData.units).map(([key, val]) => ({
                    id: parseInt(key),
                    title: val.title,
                    topics: val.topics.join('\n')
                })).sort((a, b) => a.id - b.id);

                if (loadedUnits.length > 0) {
                    setUnits(loadedUnits);
                } else {
                    setUnits([{ id: 1, title: '', topics: '' }]);
                }
            } else {
                setUnits([{ id: 1, title: '', topics: '' }]);
            }

            // Books
            setTextbooks(initialData.textbooks?.join('\n') || '');
            setReferences(initialData.references?.join('\n') || '');
        } else {
            if (units.length === 0) {
                setUnits([{ id: 1, title: '', topics: '' }]);
            }
        }
    }, [initialData]);

    // Handlers
    const handleAddUnit = () => {
        setUnits([...units, { id: units.length + 1, title: '', topics: '' }]);
    };

    const handleRemoveUnit = (index: number) => {
        const newUnits = [...units];
        newUnits.splice(index, 1);
        setUnits(newUnits.map((u, i) => ({ ...u, id: i + 1 })));
    };

    const handleUnitChange = (index: number, field: 'title' | 'topics', value: string) => {
        const newUnits = [...units];
        newUnits[index] = { ...newUnits[index], [field]: value };
        setUnits(newUnits);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        if (files.length + aiImages.length > 2) {
            alert('You can upload a maximum of 2 images.');
            return;
        }

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    setAiImages(prev => [...prev, reader.result as string]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const removeAiImage = (index: number) => {
        setAiImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleAiGenerate = async () => {
        if (!aiInput.trim() && aiImages.length === 0) return;
        setAiLoading(true);

        try {
            const { generateSyllabus } = await import('@/lib/actions/ai-syllabus');
            // Sending both text and images
            const res = await generateSyllabus({ text: aiInput, images: aiImages });

            if (res.success && res.data) {
                const data = res.data;
                console.log("AI Extracted Data:", data);

                // Normalize to UPPERCASE for code, name, and regulation
                if (data.code) data.code = data.code.toUpperCase();
                if (data.name) data.name = data.name.toUpperCase();
                if (data.regulation) data.regulation = data.regulation.toUpperCase();

                // Update Fields
                if (!isEditMode) {
                    if (data.code) setCode(data.code);
                    if (data.name) setName(data.name);
                    if (data.regulation) setRegulation(data.regulation);
                    if (data.year) setYear(data.year.toString());
                    if (data.semester) setSemester(data.semester.toString());
                } else {
                    if (data.name) setName(data.name);
                }

                if (data.units) {
                    const newUnits = Object.entries(data.units).map(([key, val]) => ({
                        id: parseInt(key) || 1,
                        title: val.title,
                        topics: Array.isArray(val.topics) ? val.topics.join('\n') : val.topics
                    })).sort((a, b) => a.id - b.id);
                    if (newUnits.length > 0) setUnits(newUnits);
                }

                if (data.textbooks) setTextbooks(data.textbooks.join('\n'));
                if (data.references) setReferences(data.references.join('\n'));

                // Show success message
                setIsAiModalOpen(false);
                setAiInput('');
                setAiImages([]);

                // You might want to use a toast here instead of alert in the future, 
                // but for now, we'll keep the logic simple or just remove the alert 
                // as the form update is visual enough.

            } else {
                alert('AI Parse Failed: ' + (res.error || 'Unknown error'));
            }
        } catch (err) {
            console.error(err);
            alert('Error connecting to AI service');
        } finally {
            setAiLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const unitsMap: Record<string, any> = {};
            units.forEach(u => {
                unitsMap[u.id.toString()] = {
                    title: u.title,
                    topics: u.topics.split('\n').filter(t => t.trim().length > 0)
                };
            });

            const texts = textbooks.split('\n').filter(t => t.trim().length > 0);
            const refs = references.split('\n').filter(t => t.trim().length > 0);

            const payload = {
                code: code.trim(),
                name: name.trim(),
                regulation,
                year: parseInt(year),
                semester: parseInt(semester),
                branch,
                type: subjectType,
                units: unitsMap,
                textbooks: texts,
                references: refs,
                webResources: [],
                isActive: true
            };

            let result;
            if (isEditMode && initialData?.id) {
                result = await updateSubject(initialData.id, payload);
            } else {
                result = await createSubject(payload);
            }

            if (result.success) {
                router.push('/admin/curriculum');
                router.refresh();
            } else {
                setError(result.error || 'Operation failed');
            }
        } catch (err: any) {
            setError(err.message || 'Error occurred');
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "w-full px-4 py-3 bg-[#0f172a]/50 border border-white/10 rounded-xl text-white placeholder-blue-200/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed";
    const labelClasses = "block text-sm font-semibold text-blue-200 mb-2";

    return (
        <div className="relative">
            <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="glass-card p-8 rounded-3xl border border-white/10 shadow-xl relative overflow-hidden group">
                    {/* Glow effect */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -z-10 group-hover:bg-blue-500/20 transition-all duration-700" />

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <h2 className="text-2xl font-black text-white flex items-center gap-3">
                            <div className="p-2.5 bg-blue-500/20 rounded-xl border border-blue-500/30 text-blue-300">
                                <BookOpen className="h-6 w-6" />
                            </div>
                            {isEditMode ? 'Edit Subject Details' : 'Subject Details'}
                        </h2>
                        <div className="flex items-center gap-3">
                            {!isEditMode && (
                                <button
                                    type="button"
                                    onClick={() => setIsAiModalOpen(true)}
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all hover:scale-105 active:scale-95 border border-white/10"
                                >
                                    <Sparkles className="h-4 w-4" />
                                    Import with AI
                                </button>
                            )}
                            {isEditMode && (
                                <div className="bg-amber-500/10 text-amber-200 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 border border-amber-500/20">
                                    <AlertCircle className="h-4 w-4" />
                                    Core ID fields locked
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label htmlFor="regulation" className={labelClasses}>Regulation</label>
                            <input
                                id="regulation"
                                name="regulation"
                                type="text"
                                value={regulation} onChange={e => setRegulation(e.target.value)}
                                className={inputClasses}
                                placeholder="e.g. R23" required
                                disabled={isEditMode}
                            />
                        </div>
                        <div>
                            <label htmlFor="year" className={labelClasses}>Year</label>
                            <div className="relative">
                                <select
                                    id="year"
                                    name="year"
                                    value={year} onChange={e => setYear(e.target.value)}
                                    className={`${inputClasses} appearance-none cursor-pointer`}
                                    disabled={isEditMode}
                                >
                                    <option value="1" className="bg-[#0f172a]">1st Year</option>
                                    <option value="2" className="bg-[#0f172a]">2nd Year</option>
                                    <option value="3" className="bg-[#0f172a]">3rd Year</option>
                                    <option value="4" className="bg-[#0f172a]">4th Year</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="semester" className={labelClasses}>Semester</label>
                            <div className="relative">
                                <select
                                    id="semester"
                                    name="semester"
                                    value={semester} onChange={e => setSemester(e.target.value)}
                                    className={`${inputClasses} appearance-none cursor-pointer`}
                                    disabled={isEditMode}
                                >
                                    <option value="1" className="bg-[#0f172a]">Semester 1</option>
                                    <option value="2" className="bg-[#0f172a]">Semester 2</option>
                                </select>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="subjectName" className={labelClasses}>Subject Name</label>
                            <input
                                id="subjectName"
                                name="subjectName"
                                type="text"
                                value={name} onChange={e => setName(e.target.value)}
                                className={inputClasses}
                                placeholder="e.g. Data Structures" required
                            />
                        </div>
                        <div>
                            <label htmlFor="subjectCode" className={labelClasses}>Subject Code</label>
                            <input
                                id="subjectCode"
                                name="subjectCode"
                                type="text"
                                value={code} onChange={e => setCode(e.target.value)}
                                className={inputClasses}
                                placeholder="e.g. 23ACS01" required
                                disabled={isEditMode}
                            />
                        </div>
                    </div>

                    {/* Subject Type Selector */}
                    <div className="mt-6 pt-6 border-t border-white/10">
                        <label htmlFor="subjectType" className={labelClasses}>Subject Type</label>
                        <div className="relative">
                            <select
                                id="subjectType"
                                name="subjectType"
                                value={subjectType}
                                onChange={e => setSubjectType(e.target.value as 'theory' | 'lab')}
                                className={`${inputClasses} appearance-none cursor-pointer`}
                            >
                                <option value="theory" className="bg-[#0f172a]">Theory Subject (Units)</option>
                                <option value="lab" className="bg-[#0f172a]">Lab Subject (Weeks)</option>
                            </select>
                        </div>
                        <p className="text-xs text-blue-300/60 mt-2">
                            {subjectType === 'lab' ? '📅 Lab subjects use "Week 1, Week 2..." instead of units' : '📚 Theory subjects use "Unit 1, Unit 2..."'}
                        </p>
                    </div>
                </div>

                {/* Units */}
                <div className="glass-card p-8 rounded-3xl border border-white/10 shadow-xl relative overflow-hidden">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-black text-white flex items-center gap-3">
                            <div className="p-2.5 bg-teal-500/20 rounded-xl border border-teal-500/30 text-teal-300">
                                <Layers className="h-6 w-6" />
                            </div>
                            Units & Syllabus
                        </h2>
                        <button
                            type="button" onClick={handleAddUnit}
                            className="text-sm font-bold text-teal-200 bg-teal-500/10 border border-teal-500/20 px-5 py-2.5 rounded-xl hover:bg-teal-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                        >
                            <Plus className="h-4 w-4" /> Add Unit
                        </button>
                    </div>

                    <div className="space-y-6">
                        {units.map((unit, idx) => (
                            <div key={idx} className="bg-white/5 p-6 rounded-2xl border border-white/10 relative hover:border-white/20 transition-colors group">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-blue-500/20 text-blue-200 border border-blue-500/20 uppercase tracking-wide">
                                        Unit {unit.id}
                                    </span>
                                    {units.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveUnit(idx)}
                                            className="p-2 text-red-400 hover:text-red-200 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                            title="Remove Unit"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                                <div className="grid gap-4">
                                    <div>
                                        <input
                                            id={`unit-${idx}-title`}
                                            name={`unit-${idx}-title`}
                                            type="text"
                                            value={unit.title} onChange={e => handleUnitChange(idx, 'title', e.target.value)}
                                            className={inputClasses}
                                            placeholder="Unit Title (e.g. Linear Algebra)" required
                                            aria-label={`Unit ${unit.id} Title`}
                                        />
                                    </div>
                                    <div>
                                        <textarea
                                            id={`unit-${idx}-topics`}
                                            name={`unit-${idx}-topics`}
                                            value={unit.topics} onChange={e => handleUnitChange(idx, 'topics', e.target.value)}
                                            className={`${inputClasses} min-h-[120px]`}
                                            placeholder="Enter topics, one per line..."
                                            rows={4}
                                            aria-label={`Unit ${unit.id} Topics`}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Resources */}
                <div className="glass-card p-8 rounded-3xl border border-white/10 shadow-xl">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                        Resources & References
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="textbooks" className={labelClasses}>Textbooks (One per line)</label>
                            <textarea
                                id="textbooks"
                                name="textbooks"
                                value={textbooks} onChange={e => setTextbooks(e.target.value)}
                                className={`${inputClasses} min-h-[150px]`}
                                rows={5}
                                placeholder="Author, Title, Publisher..."
                            />
                        </div>
                        <div>
                            <label htmlFor="references" className={labelClasses}>Reference Books (One per line)</label>
                            <textarea
                                id="references"
                                name="references"
                                value={references} onChange={e => setReferences(e.target.value)}
                                className={`${inputClasses} min-h-[150px]`}
                                rows={5}
                                placeholder="Author, Title, Publisher..."
                            />
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl flex items-center gap-3 backdrop-blur-md">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white px-8 py-4 rounded-xl font-bold text-lg disabled:opacity-50 flex items-center gap-3 shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="h-6 w-6" />}
                        {isEditMode ? 'Update Subject' : 'Save Subject'}
                    </button>
                </div>
            </form>

            {/* AI Modal - Dark Theme */}
            {isAiModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-[#0f172a] border border-white/10 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] ring-1 ring-white/10 relative">

                        {/* Aurora effect inside modal */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[60px] pointer-events-none" />

                        <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                            <h3 className="text-xl font-black text-white flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-purple-400" />
                                Import with AI (Gemini Flash)
                            </h3>
                            <button onClick={() => setIsAiModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                            <p className="text-blue-200">
                                Paste syllabus text OR upload images (max 2). The AI will extract details like Regulation, Code, and Units automatically.
                            </p>

                            {/* Text Input */}
                            <label htmlFor="aiSyllabusInput" className="sr-only">Syllabus Text</label>
                            <textarea
                                id="aiSyllabusInput"
                                name="aiSyllabusInput"
                                value={aiInput}
                                onChange={e => setAiInput(e.target.value)}
                                className="w-full h-48 p-4 bg-[#020617] border border-white/10 rounded-2xl text-sm font-mono text-blue-100 placeholder-blue-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none custom-scrollbar"
                                placeholder={`Paste syllabus text here...
Example:
Unit 1: Introduction to Algorithms
Analyze the asymptotic performance of algorithms...`}
                            />

                            {/* Image Input Area */}
                            <div>
                                <label className="block text-xs font-bold text-blue-300 uppercase tracking-wider mb-3">
                                    Attach Images (Optional)
                                </label>
                                <div className="flex gap-4 items-start">
                                    <label className="cursor-pointer border-2 border-dashed border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10 rounded-2xl p-4 flex flex-col items-center justify-center w-32 h-32 transition-all group">
                                        <Upload className="h-6 w-6 text-slate-400 group-hover:text-purple-300 transition-colors" />
                                        <span className="text-xs text-slate-500 group-hover:text-purple-200 mt-2 font-medium transition-colors">Upload</span>
                                        <input
                                            id="aiImageUpload"
                                            name="aiImageUpload"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageUpload}
                                        />
                                    </label>

                                    {/* Previews */}
                                    {aiImages.map((img, idx) => (
                                        <div key={idx} className="relative w-32 h-32 border border-white/10 rounded-2xl overflow-hidden group shadow-lg">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={img} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => removeAiImage(idx)}
                                                className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-slate-500 mt-3">
                                    Max 2 images. Formats: JPG, PNG.
                                </p>
                            </div>
                        </div>

                        <div className="p-6 border-t border-white/10 bg-white/[0.02] flex justify-end gap-3">
                            <button
                                onClick={() => setIsAiModalOpen(false)}
                                className="px-5 py-2.5 text-slate-400 hover:text-white font-bold text-sm hover:bg-white/5 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAiGenerate}
                                disabled={aiLoading || (!aiInput.trim() && aiImages.length === 0)}
                                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                            >
                                {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                                Generate Structure
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
