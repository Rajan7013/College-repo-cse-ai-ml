'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Save,
    X,
    Plus,
    Trash2,
    Calendar,
    Users,
    Code,
    Award,
    FileText,
    AlertCircle,
    CheckCircle,
    Link as LinkIcon,
    Sparkles,
    Wand2,
    Globe,
    Lightbulb
} from 'lucide-react';
import { Project } from '@/lib/types/projects';
import { createProject, updateProject } from '@/lib/actions/projects';
import { generateProjectContent } from '@/lib/actions/ai';

interface ProjectFormProps {
    project?: Project;
}

export default function ProjectForm({ project }: ProjectFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [activeSection, setActiveSection] = useState(0);

    // AI State
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [aiMode, setAiMode] = useState<'url' | 'idea'>('url');
    const [aiInput, setAiInput] = useState('');
    const [aiLoading, setAiLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title: project?.title || '',
        problemStatement: project?.problemStatement || '',
        proposedSolution: project?.proposedSolution || '',
        description: project?.description || '',
        features: project?.features || [''],
        advantages: project?.advantages || [''],
        technologies: project?.technologies || [''],
        tools: project?.tools || [''],
        teamSize: {
            min: project?.teamSize?.min || 1,
            max: project?.teamSize?.max || 4,
            boysCount: project?.teamSize?.boysCount || undefined,
            girlsCount: project?.teamSize?.girlsCount || undefined,
        },
        registrationStartDate: project?.registrationStartDate
            ? new Date(project.registrationStartDate).toISOString().split('T')[0]
            : '',
        registrationEndDate: project?.registrationEndDate
            ? new Date(project.registrationEndDate).toISOString().split('T')[0]
            : '',
        submissionDate: project?.submissionDate
            ? new Date(project.submissionDate).toISOString().split('T')[0]
            : '',
        certificates: project?.certificates || '',
        awards: project?.awards || '',
        rulesAndRegulations: project?.rulesAndRegulations || '',
        eligibility: project?.eligibility || [''],
        status: project?.status || 'draft' as 'draft' | 'published',
        registrationLink: project?.registrationLink || '',
        maxRegistrations: project?.maxRegistrations || undefined,
        coverImage: project?.coverImage || '',
    });

    const sections = [
        { id: 0, title: 'Basic Info', icon: FileText, color: 'blue' },
        { id: 1, title: 'Details', icon: AlertCircle, color: 'indigo' },
        { id: 2, title: 'Technical', icon: Code, color: 'purple' },
        { id: 3, title: 'Team & Dates', icon: Users, color: 'green' },
        { id: 4, title: 'Rewards & Rules', icon: Award, color: 'amber' },
    ];

    const addArrayItem = (field: 'features' | 'advantages' | 'technologies' | 'tools' | 'eligibility') => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], '']
        }));
    };

    const removeArrayItem = (field: 'features' | 'advantages' | 'technologies' | 'tools' | 'eligibility', index: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const updateArrayItem = (
        field: 'features' | 'advantages' | 'technologies' | 'tools' | 'eligibility',
        index: number,
        value: string
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? value : item)
        }));
    };

    const handleAiGenerate = async () => {
        if (!aiInput.trim()) return;
        setAiLoading(true);

        try {
            const result = await generateProjectContent(aiInput, aiMode);

            if (result.success && result.data) {
                const aiData = result.data;
                setFormData(prev => ({
                    ...prev,
                    title: aiData.title || prev.title,
                    problemStatement: aiData.problemStatement || prev.problemStatement,
                    proposedSolution: aiData.proposedSolution || prev.proposedSolution,
                    description: aiData.description || prev.description,
                    features: aiData.features?.length ? aiData.features : prev.features,
                    advantages: aiData.advantages?.length ? aiData.advantages : prev.advantages,
                    technologies: aiData.technologies?.length ? aiData.technologies : prev.technologies,
                    tools: aiData.tools?.length ? aiData.tools : prev.tools,
                    eligibility: aiData.eligibility?.length ? aiData.eligibility : prev.eligibility,
                    rulesAndRegulations: aiData.rulesAndRegulations || prev.rulesAndRegulations,
                    certificates: aiData.certificates || prev.certificates,
                    awards: aiData.awards || prev.awards,
                    teamSize: {
                        ...prev.teamSize,
                        min: aiData.teamSize?.min || prev.teamSize.min,
                        max: aiData.teamSize?.max || prev.teamSize.max,
                        boysCount: aiData.teamSize?.boysCount ?? prev.teamSize.boysCount,
                        girlsCount: aiData.teamSize?.girlsCount ?? prev.teamSize.girlsCount,
                    },
                    registrationStartDate: aiData.registrationStartDate || prev.registrationStartDate,
                    registrationEndDate: aiData.registrationEndDate || prev.registrationEndDate,
                    submissionDate: aiData.submissionDate || prev.submissionDate,
                }));
                setIsAiModalOpen(false);
                setAiInput('');
            } else {
                alert(result.error || 'Failed to generate content');
            }
        } catch (error) {
            console.error(error);
            alert('An unexpected error occurred');
        } finally {
            setAiLoading(false);
        }
    };

    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent, publishNow: boolean = false) => {
        e.preventDefault();
        setLoading(true);

        // Immediate feedback UI
        const loadingToast = document.createElement('div');
        loadingToast.className = 'fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3 animate-in fade-in slide-in-from-top-5 duration-300';
        loadingToast.innerHTML = `<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span class="font-semibold">Saving project...</span>`;
        document.body.appendChild(loadingToast);

        try {
            // Clean arrays (remove empty strings)
            const cleanData = {
                ...formData,
                features: formData.features.filter(f => f.trim() !== ''),
                advantages: formData.advantages.filter(a => a.trim() !== ''),
                technologies: formData.technologies.filter(t => t.trim() !== ''),
                tools: formData.tools.filter(t => t.trim() !== ''),
                eligibility: formData.eligibility.filter(e => e.trim() !== ''),
                status: publishNow ? 'published' : formData.status,
                registrationStartDate: new Date(formData.registrationStartDate),
                registrationEndDate: new Date(formData.registrationEndDate),
                submissionDate: new Date(formData.submissionDate),
            };

            let result;
            if (project) {
                result = await updateProject(project.id, cleanData);
            } else {
                result = await createProject(cleanData);
            }

            document.body.removeChild(loadingToast);

            if (result.success) {
                setSuccessMessage(publishNow ? 'Project Published Successfully! 🚀' : 'Project Saved as Draft! 💾');
                // Wait a bit for the user to see the success message before redirecting
                setTimeout(() => {
                    router.push('/admin/projects');
                    router.refresh();
                }, 1500);
            } else {
                // Show error toast
                const errorToast = document.createElement('div');
                errorToast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3 animate-in fade-in slide-in-from-top-5 duration-300';
                errorToast.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><span class="font-semibold">${result.error || 'Failed to save project'}</span>`;
                document.body.appendChild(errorToast);
                setTimeout(() => document.body.removeChild(errorToast), 3000);
            }
        } catch (error) {
            console.error('Error saving project:', error);
            if (document.body.contains(loadingToast)) document.body.removeChild(loadingToast);
            const errorToast = document.createElement('div');
            errorToast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3 animate-in fade-in slide-in-from-top-5 duration-300';
            errorToast.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><span class="font-semibold">An unexpected error occurred</span>`;
            document.body.appendChild(errorToast);
            setTimeout(() => document.body.removeChild(errorToast), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Success Modal */}
            {successMessage && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-[#0f172a] border border-green-500/30 p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 animate-in zoom-in-95 duration-300 max-w-sm w-full mx-4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-green-500/10 blur-3xl rounded-full" />
                        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 z-10">
                            <CheckCircle className="h-10 w-10 text-white animate-bounce" />
                        </div>
                        <h3 className="text-2xl font-black text-white text-center z-10">Success!</h3>
                        <p className="text-blue-100 text-center z-10 font-medium">{successMessage}</p>
                        <div className="w-full bg-white/10 h-1 mt-4 rounded-full overflow-hidden z-10">
                            <div className="h-full bg-green-500 animate-progress-indeterminate" />
                        </div>
                    </div>
                </div>
            )}

            {/* AI Generator Modal */}
            {isAiModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-2xl bg-[#0f172a] border border-blue-500/30 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-blue-900/40 to-violet-900/40">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500 rounded-lg shadow-lg shadow-blue-500/30">
                                        <Sparkles className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white">AI Project Assistant</h3>
                                        <p className="text-blue-200/70 text-sm">Autofill details from a link or an idea</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsAiModalOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex gap-4 mb-6">
                                <button
                                    onClick={() => setAiMode('url')}
                                    className={`flex-1 p-4 rounded-xl border transition-all duration-200 flex flex-col items-center gap-2 ${aiMode === 'url'
                                        ? 'bg-blue-600/20 border-blue-500 data-[state=active]:shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                                        }`}
                                >
                                    <Globe className={`h-6 w-6 ${aiMode === 'url' ? 'text-blue-400' : 'text-slate-400'}`} />
                                    <span className={`font-semibold ${aiMode === 'url' ? 'text-white' : 'text-slate-400'}`}>From Link</span>
                                </button>
                                <button
                                    onClick={() => setAiMode('idea')}
                                    className={`flex-1 p-4 rounded-xl border transition-all duration-200 flex flex-col items-center gap-2 ${aiMode === 'idea'
                                        ? 'bg-violet-600/20 border-violet-500 data-[state=active]:shadow-[0_0_20px_rgba(139,92,246,0.2)]'
                                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                                        }`}
                                >
                                    <Lightbulb className={`h-6 w-6 ${aiMode === 'idea' ? 'text-violet-400' : 'text-slate-400'}`} />
                                    <span className={`font-semibold ${aiMode === 'idea' ? 'text-white' : 'text-slate-400'}`}>From Idea</span>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-white">
                                    {aiMode === 'url' ? 'Paste Webpage Link' : 'Describe your Idea'}
                                </label>
                                {aiMode === 'url' ? (
                                    <input
                                        type="url"
                                        value={aiInput}
                                        onChange={(e) => setAiInput(e.target.value)}
                                        placeholder="https://hackathon.com/challenges/..."
                                        className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                                    />
                                ) : (
                                    <textarea
                                        rows={4}
                                        value={aiInput}
                                        onChange={(e) => setAiInput(e.target.value)}
                                        placeholder="e.g. A platform for students to share notes using AI summary features..."
                                        className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-3">
                            <button
                                onClick={() => setIsAiModalOpen(false)}
                                className="px-5 py-2.5 rounded-lg font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAiGenerate}
                                disabled={!aiInput.trim() || aiLoading}
                                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 disabled:opacity-50 text-white font-bold rounded-lg shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
                            >
                                {aiLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="h-4 w-4" />
                                        Generate Magic
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="glass-card shadow-2xl overflow-hidden backdrop-blur-xl border border-white/10 relative">
                {/* AI Banner Button - Positioned absolutely */}
                <div className="absolute top-4 right-6 z-20">
                    <button
                        type="button"
                        onClick={() => setIsAiModalOpen(true)}
                        className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600/90 to-violet-600/90 hover:from-blue-500 hover:to-violet-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                        <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                        AI Auto-Fill
                    </button>
                </div>

                {/* Section Tabs */}
                <div className="border-b border-white/10 bg-white/5 px-6 py-4 overflow-x-auto scrollbar-thin pt-5 sm:pt-4">
                    <div className="flex gap-2 min-w-max pr-32">
                        {sections.map((section) => {
                            const Icon = section.icon;
                            const isActive = activeSection === section.id;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${isActive
                                        ? `bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] ring-1 ring-blue-400`
                                        : 'bg-white/5 text-blue-200 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-blue-400'}`} />
                                    {section.title}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <form onSubmit={(e) => handleSubmit(e, false)} className="p-8">
                    {/* Section 0: Basic Info */}
                    {activeSection === 0 && (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <label className="block text-sm font-bold text-blue-100 mb-2">
                                    Project Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/30 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                    placeholder="e.g., AI-Powered Learning Platform"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-blue-100 mb-2">
                                    Problem Statement *
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.problemStatement}
                                    onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/30 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                    placeholder="Describe the problem this project aims to solve..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-blue-100 mb-2">
                                    Proposed Solution *
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.proposedSolution}
                                    onChange={(e) => setFormData({ ...formData, proposedSolution: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/30 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                    placeholder="Explain your proposed solution approach..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-blue-100 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    required
                                    rows={6}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/30 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                    placeholder="Detailed project description..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Section 1: Details */}
                    {activeSection === 1 && (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <label className="block text-sm font-bold text-blue-100 mb-2">
                                    Features
                                </label>
                                {formData.features.map((feature, idx) => (
                                    <div key={idx} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={feature}
                                            onChange={(e) => updateArrayItem('features', idx, e.target.value)}
                                            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/30 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                            placeholder={`Feature #${idx + 1}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('features', idx)}
                                            className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('features')}
                                    className="mt-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Feature
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-blue-100 mb-2">
                                    Advantages
                                </label>
                                {formData.advantages.map((advantage, idx) => (
                                    <div key={idx} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={advantage}
                                            onChange={(e) => updateArrayItem('advantages', idx, e.target.value)}
                                            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/30 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                            placeholder={`Advantage #${idx + 1}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('advantages', idx)}
                                            className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('advantages')}
                                    className="mt-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Advantage
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Section 2: Technical */}
                    {activeSection === 2 && (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <label className="block text-sm font-bold text-blue-100 mb-2">
                                    Technologies
                                </label>
                                {formData.technologies.map((tech, idx) => (
                                    <div key={idx} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={tech}
                                            onChange={(e) => updateArrayItem('technologies', idx, e.target.value)}
                                            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/30 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                            placeholder="e.g., React, Node.js, Firebase"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('technologies', idx)}
                                            className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('technologies')}
                                    className="mt-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Technology
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-blue-100 mb-2">
                                    Tools
                                </label>
                                {formData.tools.map((tool, idx) => (
                                    <div key={idx} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={tool}
                                            onChange={(e) => updateArrayItem('tools', idx, e.target.value)}
                                            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/30 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                            placeholder="e.g., Git, GitHub, Figma, Jira"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('tools', idx)}
                                            className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('tools')}
                                    className="mt-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Tool
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Section 3: Team & Dates */}
                    {activeSection === 3 && (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <label className="block text-sm font-bold text-blue-100 mb-4">
                                    Team Size Requirements
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-blue-300 mb-1">
                                            Min Members *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            value={formData.teamSize.min}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                teamSize: { ...formData.teamSize, min: parseInt(e.target.value) }
                                            })}
                                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/30 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-blue-300 mb-1">
                                            Max Members *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            value={formData.teamSize.max}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                teamSize: { ...formData.teamSize, max: parseInt(e.target.value) }
                                            })}
                                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/30 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-blue-300 mb-1">
                                            Boys (Optional)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={formData.teamSize.boysCount || ''}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                teamSize: { ...formData.teamSize, boysCount: e.target.value ? parseInt(e.target.value) : undefined }
                                            })}
                                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/30 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-blue-300 mb-1">
                                            Girls (Optional)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={formData.teamSize.girlsCount || ''}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                teamSize: { ...formData.teamSize, girlsCount: e.target.value ? parseInt(e.target.value) : undefined }
                                            })}
                                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/30 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-blue-100 mb-2">
                                        Registration Start *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.registrationStartDate}
                                        onChange={(e) => setFormData({ ...formData, registrationStartDate: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/30 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 [color-scheme:dark]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-blue-100 mb-2">
                                        Registration End *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.registrationEndDate}
                                        onChange={(e) => setFormData({ ...formData, registrationEndDate: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/30 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 [color-scheme:dark]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-blue-100 mb-2">
                                        Submission Date *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.submissionDate}
                                        onChange={(e) => setFormData({ ...formData, submissionDate: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/30 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 [color-scheme:dark]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-blue-100 mb-2">
                                    Registration Link (Optional)
                                </label>
                                <input
                                    type="url"
                                    value={formData.registrationLink}
                                    onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/30 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    placeholder="https://forms.google.com/..."
                                />
                                <p className="text-xs text-blue-300/60 mt-1">
                                    Google Forms, Microsoft Forms, or any registration link
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-blue-100 mb-2">
                                    Max Registrations (Optional)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.maxRegistrations || ''}
                                    onChange={(e) => setFormData({ ...formData, maxRegistrations: e.target.value ? parseInt(e.target.value) : undefined })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/30 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    placeholder="Leave empty for unlimited"
                                />
                            </div>
                        </div>
                    )}

                    {/* Section 4: Rewards & Rules */}
                    {activeSection === 4 && (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <label className="block text-sm font-bold text-blue-100 mb-2">
                                    Certificates
                                </label>
                                <textarea
                                    rows={3}
                                    value={formData.certificates}
                                    onChange={(e) => setFormData({ ...formData, certificates: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/30 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    placeholder="Describe what certificates will be awarded..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-blue-100 mb-2">
                                    Awards & Prizes
                                </label>
                                <textarea
                                    rows={3}
                                    value={formData.awards}
                                    onChange={(e) => setFormData({ ...formData, awards: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/30 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    placeholder="List any prizes, recognition, or awards..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-blue-100 mb-2">
                                    Rules & Regulations *
                                </label>
                                <textarea
                                    required
                                    rows={6}
                                    value={formData.rulesAndRegulations}
                                    onChange={(e) => setFormData({ ...formData, rulesAndRegulations: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/30 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono text-sm"
                                    placeholder="Enter rules and regulations (supports Markdown)..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-blue-100 mb-2">
                                    Eligibility Criteria
                                </label>
                                {formData.eligibility.map((criteria, idx) => (
                                    <div key={idx} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={criteria}
                                            onChange={(e) => updateArrayItem('eligibility', idx, e.target.value)}
                                            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/30 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                            placeholder={`Eligibility #${idx + 1}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('eligibility', idx)}
                                            className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('eligibility')}
                                    className="mt-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Criteria
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-8 pt-6 border-t border-white/10">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-blue-200 font-semibold rounded-xl transition-colors flex items-center gap-2 border border-white/10"
                        >
                            <X className="h-5 w-5" />
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-5 w-5" />
                                    Save as Draft
                                </>
                            )}
                        </button>

                        {!project && (
                            <button
                                type="button"
                                onClick={(e) => handleSubmit(e, true)}
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
                            >
                                <CheckCircle className="h-5 w-5" />
                                Save & Publish
                            </button>
                        )}
                    </div>
                </form>

                <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
            </div>
        </>
    );
}
