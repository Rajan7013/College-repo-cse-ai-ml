'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Edit,
    Trash2,
    Eye,
    Calendar,
    Users,
    Clock,
    CheckCircle,
    XCircle,
    FileText
} from 'lucide-react';
import { Project } from '@/lib/types/projects';
import { deleteProject, toggleProjectStatus } from '@/lib/actions/projects';
import { useRouter } from 'next/navigation';

interface ProjectsGridProps {
    initialProjects: Project[];
}

export default function ProjectsGrid({ initialProjects }: ProjectsGridProps) {
    const [projects, setProjects] = useState(initialProjects);
    const [filter, setFilter] = useState<string>('all');
    const router = useRouter();

    const filteredProjects = projects.filter(p => {
        if (filter === 'all') return true;
        return p.status === filter;
    });

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        const result = await deleteProject(id);
        if (result.success) {
            setProjects(projects.filter(p => p.id !== id));
        } else {
            alert(result.error || 'Failed to delete project');
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'published' ? 'draft' : 'published';
        const result = await toggleProjectStatus(id, newStatus as 'published' | 'draft');

        if (result.success) {
            setProjects(projects.map(p =>
                p.id === id ? { ...p, status: newStatus as any } : p
            ));
            router.refresh();
        } else {
            alert(result.error || 'Failed to update status');
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            draft: 'bg-gray-100 text-gray-700 border-gray-200',
            published: 'bg-green-100 text-green-700 border-green-200',
            closed: 'bg-red-100 text-red-700 border-red-200',
            archived: 'bg-slate-100 text-slate-700 border-slate-200'
        };

        const icons = {
            draft: FileText,
            published: CheckCircle,
            closed: XCircle,
            archived: Clock
        };

        const Icon = icons[status as keyof typeof icons];

        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${styles[status as keyof typeof styles]}`}>
                <Icon className="h-3.5 w-3.5" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <div>
            {/* Filters */}
            <div className="flex gap-2 mb-8 flex-wrap">
                {['all', 'draft', 'published', 'closed', 'archived'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 border ${filter === f
                            ? 'bg-blue-600 text-white border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                            : 'bg-white/5 text-blue-200 border-white/10 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                        <span className={`ml-2 text-xs py-0.5 px-1.5 rounded-md ${filter === f ? 'bg-white/20 text-white' : 'bg-white/10 text-blue-300'}`}>
                            {f === 'all' ? projects.length : projects.filter(p => p.status === f).length}
                        </span>
                    </button>
                ))}
            </div>

            {/* Grid */}
            {filteredProjects.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                    <FileText className="h-16 w-16 text-blue-400/50 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No projects found</h3>
                    <p className="text-blue-200/70 mb-8 max-w-sm mx-auto">
                        {filter === 'all'
                            ? 'Create your first project to get started'
                            : `No ${filter} projects found.`
                        }
                    </p>
                    <Link href="/admin/projects/new">
                        <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all">
                            Create Project
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <div
                            key={project.id}
                            className="group glass-card rounded-2xl p-6 border border-white/10 hover:border-blue-400/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-300 flex flex-col relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-violet-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

                            {/* Status Badge */}
                            <div className="flex items-center justify-between mb-4">
                                {getStatusBadge(project.status)}
                                <span className="text-xs text-blue-300/60 flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                                    <Eye className="h-3.5 w-3.5" />
                                    {project.views || 0}
                                </span>
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors">
                                {project.title}
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-blue-100/70 mb-6 line-clamp-3 flex-grow">
                                {project.description}
                            </p>

                            {/* Meta Info */}
                            <div className="space-y-3 mb-6 text-xs font-medium">
                                <div className="flex items-center gap-2 text-blue-200">
                                    <Users className="h-4 w-4 text-blue-400" />
                                    <span>Team: <span className="text-white">{project.teamSize.min}-{project.teamSize.max} members</span></span>
                                </div>
                                <div className="flex items-center gap-2 text-blue-200">
                                    <Calendar className="h-4 w-4 text-emerald-400" />
                                    <span>Due: <span className="text-white">{new Date(project.submissionDate).toISOString().split('T')[0]}</span></span>
                                </div>
                            </div>

                            {/* Technologies */}
                            <div className="flex flex-wrap gap-1 mb-6">
                                {project.technologies.slice(0, 3).map((tech, idx) => (
                                    <span
                                        key={idx}
                                        className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded-lg text-xs font-medium"
                                    >
                                        {tech}
                                    </span>
                                ))}
                                {project.technologies.length > 3 && (
                                    <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-blue-300 rounded-lg text-xs font-medium">
                                        +{project.technologies.length - 3}
                                    </span>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-4 border-t border-white/10">
                                <Link href={`/admin/projects/${project.id}/edit`} className="flex-1">
                                    <button className="w-full px-3 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 border border-white/5">
                                        <Edit className="h-4 w-4 text-blue-400" />
                                        Edit
                                    </button>
                                </Link>

                                <button
                                    onClick={() => handleToggleStatus(project.id, project.status)}
                                    className={`flex-1 px-3 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 border ${project.status === 'published'
                                        ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/20'
                                        : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20'
                                        }`}
                                >
                                    {project.status === 'published' ? (
                                        <>
                                            <XCircle className="h-4 w-4" />
                                            Unpublish
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="h-4 w-4" />
                                            Publish
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={() => handleDelete(project.id)}
                                    className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg font-semibold text-sm transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
