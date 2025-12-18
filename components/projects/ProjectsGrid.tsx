'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Project } from '@/lib/types/projects';
import { Calendar, Users, MapPin, Clock, ExternalLink, Sparkles } from 'lucide-react';

interface ProjectsGridProps {
    projects: Project[];
}

export default function ProjectsGrid({ projects }: ProjectsGridProps) {
    const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all');

    const filteredProjects = projects.filter(p => {
        if (filter === 'open') return p.status === 'published' && p.registrationStatus === 'open';
        if (filter === 'closed') return p.registrationStatus === 'closed';
        return true;
    });

    return (
        <div>
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-8">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${filter === 'all'
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                            : 'glass-card text-blue-200 hover:text-white hover:bg-white/10'
                        }`}
                >
                    All Projects
                </button>
                <button
                    onClick={() => setFilter('open')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${filter === 'open'
                            ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg'
                            : 'glass-card text-blue-200 hover:text-white hover:bg-white/10'
                        }`}
                >
                    Open for Registration
                </button>
                <button
                    onClick={() => setFilter('closed')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${filter === 'closed'
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                            : 'glass-card text-blue-200 hover:text-white hover:bg-white/10'
                        }`}
                >
                    Closed
                </button>
            </div>

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
                <div className="glass-card p-16 text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-2xl font-bold text-white mb-2">No Projects Found</h3>
                    <p className="text-blue-200">Try adjusting your filters or check back later</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <Link
                            key={project.id}
                            href={`/projects/${project.slug}`}
                            className="group glass-card p-6 hover:bg-white/10 hover:scale-105 transition-all duration-300"
                        >
                            {/* Status Badge */}
                            <div className="flex items-center justify-between mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${project.registrationStatus === 'open'
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                                        : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                                    }`}>
                                    {project.registrationStatus === 'open' ? '✓ Open' : '🔒 Closed'}
                                </span>
                                {project.featured && (
                                    <Sparkles className="h-5 w-5 text-yellow-400" />
                                )}
                            </div>

                            {/* Title */}
                            <h3 className="text-2xl font-black text-white mb-3 group-hover:text-cyan-300 transition-colors">
                                {project.title}
                            </h3>

                            {/* Description */}
                            <p className="text-blue-100 mb-4 line-clamp-2">
                                {project.shortDescription}
                            </p>

                            {/* Meta Info */}
                            <div className="space-y-2 mb-4">
                                {project.duration && (
                                    <div className="flex items-center gap-2 text-sm text-blue-200">
                                        <Clock className="h-4 w-4 text-cyan-400" />
                                        {project.duration}
                                    </div>
                                )}
                                {project.mode && (
                                    <div className="flex items-center gap-2 text-sm text-blue-200">
                                        <MapPin className="h-4 w-4 text-emerald-400" />
                                        {project.mode}
                                    </div>
                                )}
                                {project.teamSize && (
                                    <div className="flex items-center gap-2 text-sm text-blue-200">
                                        <Users className="h-4 w-4 text-purple-400" />
                                        Team Size: {project.teamSize.min}-{project.teamSize.max}
                                    </div>
                                )}
                            </div>

                            {/* Technologies */}
                            {project.technologies && project.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.technologies.slice(0, 3).map((tech, i) => (
                                        <span key={i} className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 text-blue-100 rounded-lg text-xs font-semibold">
                                            {tech}
                                        </span>
                                    ))}
                                    {project.technologies.length > 3 && (
                                        <span className="px-3 py-1 bg-white/10 text-blue-200 rounded-lg text-xs">
                                            +{project.technologies.length - 3}
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* View Details Button */}
                            <div className="flex items-center gap-2 text-cyan-300 font-semibold group-hover:gap-3 transition-all">
                                <span>View Details</span>
                                <ExternalLink className="h-4 w-4" />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
