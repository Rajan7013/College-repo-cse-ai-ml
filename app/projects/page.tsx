import { Suspense } from 'react';
export const dynamic = 'force-dynamic';

import { getPublishedProjects } from '@/lib/actions/projects';
import ProjectsHero from '@/components/projects/ProjectsHero';
import ProjectsGrid from '@/components/projects/ProjectsGrid';
import { getUserRole } from '@/lib/actions/resources';
import Link from 'next/link';
import { Settings } from 'lucide-react';

export default async function ProjectsPage() {
    const projects = await getPublishedProjects();
    const role = await getUserRole();
    const isAdmin = role === 'admin';

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="relative">
                <ProjectsHero />
                {isAdmin && (
                    <div className="absolute top-4 right-4 z-20">
                        <Link
                            href="/admin/projects"
                            className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-white/20 transition-all shadow-lg"
                        >
                            <Settings className="h-4 w-4" />
                            Manage Projects
                        </Link>
                    </div>
                )}
            </div>

            {/* Projects Grid */}
            <section className="py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <Suspense fallback={<LoadingGrid />}>
                        <ProjectsGrid projects={projects} />
                    </Suspense>
                </div>
            </section>
        </div>
    );
}

function LoadingGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                    key={i}
                    className="glass-card p-6 animate-pulse"
                >
                    <div className="h-12 w-12 bg-white/10 rounded-xl mb-4"></div>
                    <div className="h-6 bg-white/10 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-white/10 rounded w-full mb-2"></div>
                    <div className="h-4 bg-white/10 rounded w-2/3 mb-4"></div>
                    <div className="flex gap-2 mb-4">
                        <div className="h-6 w-16 bg-white/10 rounded"></div>
                        <div className="h-6 w-16 bg-white/10 rounded"></div>
                    </div>
                    <div className="h-10 bg-white/10 rounded"></div>
                </div>
            ))}
        </div>
    );
}
