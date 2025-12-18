'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Calendar,
    Users,
    Clock,
    Award,
    ExternalLink,
    CheckCircle,
    Code,
    Wrench,
    FileText,
    Shield,
    TrendingUp,
    Target,
    ArrowLeft,
    Eye,
    Sparkles
} from 'lucide-react';
import { Project, ProjectTeam, ProjectForm } from '@/lib/types/projects';

interface ProjectDetailViewProps {
    project: Project;
    teams: ProjectTeam[];
    forms: ProjectForm[];
}

export default function ProjectDetailView({ project, teams, forms }: ProjectDetailViewProps) {
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Target },
        { id: 'details', label: 'Details', icon: FileText },
        { id: 'technical', label: 'Technical', icon: Code },
        { id: 'teams', label: 'Teams', icon: Users, count: teams.length },
        { id: 'forms', label: 'Forms', icon: ExternalLink, count: forms.length },
        { id: 'rules', label: 'Rules', icon: Shield },
    ];

    const isRegistrationOpen = () => {
        const now = new Date();
        const start = new Date(project.registrationStartDate);
        const end = new Date(project.registrationEndDate);
        return now >= start && now <= end;
    };

    const daysUntilDeadline = () => {
        const now = new Date();
        const deadline = new Date(project.submissionDate);
        const diff = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return diff;
    };

    return (
        <div>
            {/* Hero Header */}
            <div className="relative py-16 px-4 overflow-hidden">
                <div className="relative max-w-7xl mx-auto">
                    {/* Back Button */}
                    <Link href="/projects" className="inline-flex items-center gap-2 glass-card px-4 py-2 hover:bg-white/10 mb-6 group transition-all text-blue-200 hover:text-white">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-semibold">Back to Projects</span>
                    </Link>

                    <div className="flex flex-col lg:flex-row lg:items-start gap-8">
                        {/* Left: Title & Meta */}
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full mb-4">
                                <Eye className="h-4 w-4 text-cyan-300" />
                                <span className="text-sm font-bold text-cyan-300">{project.views} views</span>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                                {project.title}
                            </h1>

                            <p className="text-xl text-blue-200 mb-8 leading-relaxed max-w-3xl">
                                {project.problemStatement}
                            </p>

                            {/* Quick Meta */}
                            <div className="flex flex-wrap gap-4 text-white">
                                <div className="glass-card px-4 py-2 flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-cyan-400" />
                                    <span className="font-semibold">Deadline: {new Date(project.submissionDate).toLocaleDateString()}</span>
                                </div>
                                <div className="glass-card px-4 py-2 flex items-center gap-2">
                                    <Users className="h-5 w-5 text-cyan-400" />
                                    <span className="font-semibold">Team: {project.teamSize.min}-{project.teamSize.max}</span>
                                </div>
                                <div className="glass-card px-4 py-2 flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-cyan-400" />
                                    <span className={`font-semibold ${isRegistrationOpen() ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {isRegistrationOpen() ? 'Registration Open' : 'Registration Closed'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Info Cards */}
                        <div className="lg:w-80 space-y-4">
                            {/* Deadline Card */}
                            <div className="glass-card p-6 text-center transform hover:scale-105 transition-all duration-300">
                                <div className="inline-flex p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl mb-3 shadow-lg">
                                    <TrendingUp className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-blue-200 font-semibold uppercase tracking-wider mb-1">Days Remaining</p>
                                    <p className="text-4xl font-black text-white">{daysUntilDeadline()}</p>
                                </div>
                            </div>

                            {/* Registration Button */}
                            {isRegistrationOpen() && project.registrationLink && (
                                <a
                                    href={project.registrationLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-gradient w-full py-4 text-lg font-bold rounded-xl shadow-xl flex items-center justify-center gap-2 group"
                                >
                                    Register Now
                                    <ExternalLink className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left: Tabs Content */}
                    <div className="flex-1">
                        {/* Tab Navigation */}
                        <div className="flex gap-2 mb-8 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-blue-500/50 scrollbar-track-transparent">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap border ${isActive
                                                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-transparent shadow-lg scale-105'
                                                : 'glass-card text-blue-200 hover:text-white hover:bg-white/10 border-blue-500/10'
                                            }`}
                                    >
                                        <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-cyan-400'}`} />
                                        {tab.label}
                                        {tab.count !== undefined && tab.count > 0 && (
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${isActive ? 'bg-white/20' : 'bg-blue-500/20 text-cyan-300'
                                                }`}>
                                                {tab.count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Tab Content */}
                        <div className="glass-card p-8 min-h-[500px]">
                            {/* Overview Tab */}
                            {activeTab === 'overview' && (
                                <div className="space-y-8 animate-fade-in">
                                    <div>
                                        <h3 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
                                            <Target className="h-7 w-7 text-cyan-400" />
                                            Problem Statement
                                        </h3>
                                        <p className="text-blue-100 leading-relaxed text-lg">
                                            {project.problemStatement}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
                                            <CheckCircle className="h-7 w-7 text-emerald-400" />
                                            Proposed Solution
                                        </h3>
                                        <p className="text-blue-100 leading-relaxed text-lg">
                                            {project.proposedSolution}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-2xl font-black text-white mb-4">
                                            Description
                                        </h3>
                                        <p className="text-blue-200 leading-relaxed whitespace-pre-wrap text-lg">
                                            {project.description}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Details Tab */}
                            {activeTab === 'details' && (
                                <div className="space-y-8 animate-fade-in">
                                    {project.features.length > 0 && (
                                        <div>
                                            <h3 className="text-2xl font-black text-white mb-6">Key Features</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {project.features.map((feature, idx) => (
                                                    <div key={idx} className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-blue-500/20">
                                                        <CheckCircle className="h-5 w-5 text-cyan-400 mt-1 flex-shrink-0" />
                                                        <span className="text-blue-100 font-medium">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {project.advantages.length > 0 && (
                                        <div>
                                            <h3 className="text-2xl font-black text-white mb-6">Advantages</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {project.advantages.map((advantage, idx) => (
                                                    <div key={idx} className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-emerald-500/20">
                                                        <TrendingUp className="h-5 w-5 text-emerald-400 mt-1 flex-shrink-0" />
                                                        <span className="text-blue-100 font-medium">{advantage}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Technical Tab */}
                            {activeTab === 'technical' && (
                                <div className="space-y-8 animate-fade-in">
                                    <div>
                                        <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                                            <Code className="h-7 w-7 text-purple-400" />
                                            Technologies
                                        </h3>
                                        <div className="flex flex-wrap gap-3">
                                            {project.technologies.map((tech, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold shadow-lg"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                                            <Wrench className="h-7 w-7 text-amber-400" />
                                            Tools & Libraries
                                        </h3>
                                        <div className="flex flex-wrap gap-3">
                                            {project.tools.map((tool, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold shadow-lg"
                                                >
                                                    {tool}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Teams Tab */}
                            {activeTab === 'teams' && (
                                <div className="animate-fade-in">
                                    {teams.length > 0 ? (
                                        <div className="space-y-6">
                                            <h3 className="text-2xl font-black text-white mb-6">
                                                Registered Teams ({teams.length})
                                            </h3>
                                            {teams.map((team) => (
                                                <div key={team.id} className="bg-white/5 rounded-xl p-6 border border-blue-500/20 hover:border-blue-400/50 transition-all">
                                                    <div className="flex items-center justify-between mb-6">
                                                        <h4 className="text-xl font-bold text-white flex items-center gap-2">
                                                            <Users className="h-5 w-5 text-cyan-400" />
                                                            {team.teamName}
                                                        </h4>
                                                        <span className="px-4 py-1 bg-blue-500/20 text-cyan-300 rounded-full text-sm font-bold border border-blue-400/30">
                                                            Team #{team.teamNumber}
                                                        </span>
                                                    </div>

                                                    {/* Team Leader */}
                                                    <div className="mb-6 p-4 bg-gradient-to-r from-blue-900/50 to-indigo-900/50 rounded-xl border border-blue-500/30">
                                                        <p className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2">Team Leader</p>
                                                        <div className="flex justify-between items-center">
                                                            <p className="font-bold text-white text-lg">{team.teamLeader.name}</p>
                                                            <p className="text-sm text-blue-200 bg-black/20 px-3 py-1 rounded-lg font-mono">
                                                                {team.teamLeader.rollNumber}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Members */}
                                                    {team.members.length > 0 && (
                                                        <div className="space-y-3">
                                                            <p className="font-bold text-blue-200 text-sm uppercase tracking-wide">Team Members</p>
                                                            {team.members.map((member, idx) => (
                                                                <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                                                    <div>
                                                                        <p className="font-semibold text-white">{member.name}</p>
                                                                        <p className="text-xs text-blue-300">{member.rollNumber}</p>
                                                                    </div>
                                                                    <span className="px-3 py-1 bg-white/10 text-blue-200 rounded-lg text-xs font-bold">
                                                                        {member.role}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Tools */}
                                                    {team.toolsUsed.length > 0 && (
                                                        <div className="mt-6 pt-4 border-t border-white/10">
                                                            <p className="text-xs font-bold text-blue-300 mb-2 uppercase">Tools Used</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {team.toolsUsed.map((tool, idx) => (
                                                                    <span key={idx} className="px-3 py-1 bg-blue-500/10 text-blue-200 rounded-lg text-xs font-semibold border border-blue-500/20">
                                                                        {tool}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <Users className="h-16 w-16 text-blue-400/30 mx-auto mb-4" />
                                            <p className="text-white font-bold text-lg">No teams created yet</p>
                                            <p className="text-blue-200">Be the first team to register!</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Forms Tab */}
                            {activeTab === 'forms' && (
                                <div className="animate-fade-in">
                                    {forms.length > 0 ? (
                                        <div className="space-y-4">
                                            <h3 className="text-2xl font-black text-white mb-6">
                                                Available Forms & Docs
                                            </h3>
                                            {forms.map((form) => (
                                                <div key={form.id} className="glass-card p-6 border-l-4 border-l-cyan-400 hover:scale-[1.02] transition-all">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="flex-1">
                                                            <h4 className="text-xl font-bold text-white mb-2">{form.title}</h4>
                                                            <p className="text-blue-200 mb-3">{form.description}</p>
                                                            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold border border-indigo-400/30">
                                                                {form.purpose}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <a
                                                        href={form.formUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn-gradient inline-flex items-center gap-2 px-6 py-2 pb-2.5 rounded-xl font-bold shadow-lg"
                                                    >
                                                        Open Form
                                                        <ExternalLink className="h-4 w-4" />
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <FileText className="h-16 w-16 text-blue-400/30 mx-auto mb-4" />
                                            <p className="text-white font-bold text-lg">No forms availble</p>
                                            <p className="text-blue-200">Use the main registration link above</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Rules Tab */}
                            {activeTab === 'rules' && (
                                <div className="space-y-8 animate-fade-in">
                                    <div className="bg-white/5 rounded-xl p-8 border border-white/10">
                                        <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                                            <Shield className="h-7 w-7 text-cyan-400" />
                                            Rules & Regulations
                                        </h3>
                                        <div className="prose max-w-none text-blue-100">
                                            <pre className="whitespace-pre-wrap font-sans leading-relaxed">
                                                {project.rulesAndRegulations}
                                            </pre>
                                        </div>
                                    </div>

                                    {project.eligibility.length > 0 && (
                                        <div>
                                            <h3 className="text-2xl font-black text-white mb-6">
                                                Eligibility Criteria
                                            </h3>
                                            <div className="space-y-3">
                                                {project.eligibility.map((criteria, idx) => (
                                                    <div key={idx} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-emerald-500/20">
                                                        <div className="h-8 w-8 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                                            <CheckCircle className="h-5 w-5 text-emerald-400" />
                                                        </div>
                                                        <span className="text-white font-medium">{criteria}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Sidebar */}
                    <div className="lg:w-80 space-y-6">
                        {/* Registration Dates */}
                        <div className="glass-card p-6">
                            <h3 className="font-black text-white mb-4 flex items-center gap-2 text-lg">
                                <Calendar className="h-5 w-5 text-cyan-400" />
                                Important Dates
                            </h3>
                            <div className="space-y-4">
                                <div className="bg-white/5 p-3 rounded-xl">
                                    <p className="text-xs font-bold text-blue-300 uppercase mb-1">Registration Start</p>
                                    <p className="text-white font-bold">
                                        {new Date(project.registrationStartDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="bg-white/5 p-3 rounded-xl">
                                    <p className="text-xs font-bold text-blue-300 uppercase mb-1">Registration End</p>
                                    <p className="text-white font-bold">
                                        {new Date(project.registrationEndDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl">
                                    <p className="text-xs font-bold text-rose-300 uppercase mb-1">Submission Deadline</p>
                                    <p className="text-white font-bold">
                                        {new Date(project.submissionDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Rewards */}
                        {(project.certificates || project.awards) && (
                            <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-6 backdrop-blur-md">
                                <h3 className="font-black text-white mb-4 flex items-center gap-2 text-lg">
                                    <Award className="h-5 w-5 text-amber-400" />
                                    Rewards & Perks
                                </h3>
                                {project.certificates && (
                                    <div className="mb-4">
                                        <p className="text-xs font-bold text-amber-300 uppercase mb-1">Certificates</p>
                                        <p className="text-sm text-blue-100 leading-relaxed bg-black/20 p-2 rounded-lg">{project.certificates}</p>
                                    </div>
                                )}
                                {project.awards && (
                                    <div>
                                        <p className="text-xs font-bold text-amber-300 uppercase mb-1">Awards</p>
                                        <p className="text-sm text-blue-100 leading-relaxed bg-black/20 p-2 rounded-lg">{project.awards}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Team Size */}
                        <div className="glass-card p-6">
                            <h3 className="font-black text-white mb-4 flex items-center gap-2 text-lg">
                                <Users className="h-5 w-5 text-cyan-400" />
                                Team Requirements
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                                    <span className="font-bold text-blue-200">Total Size</span>
                                    <span className="text-white font-mono bg-blue-500/20 px-2 py-0.5 rounded">{project.teamSize.min}-{project.teamSize.max}</span>
                                </div>
                                {project.teamSize.boysCount !== undefined && (
                                    <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                                        <span className="font-bold text-blue-200">Boys</span>
                                        <span className="text-white font-mono bg-blue-500/20 px-2 py-0.5 rounded">{project.teamSize.boysCount}</span>
                                    </div>
                                )}
                                {project.teamSize.girlsCount !== undefined && (
                                    <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                                        <span className="font-bold text-blue-200">Girls</span>
                                        <span className="text-white font-mono bg-blue-500/20 px-2 py-0.5 rounded">{project.teamSize.girlsCount}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
