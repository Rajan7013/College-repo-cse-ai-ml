import { Suspense } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getAllProjects } from '@/lib/actions/projects';
import ProjectsGrid from '@/components/admin/projects/ProjectsGrid';

export default async function AdminProjectsPage() {
    const projects = await getAllProjects();

    return (
        <div className="min-h-screen py-12 px-4 relative overflow-hidden">
            {/* Background Ambience matches Home Page */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[128px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[128px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                            Projects Management
                        </h1>
                        <p className="text-lg text-blue-200/70">
                            Create and manage project opportunities for students.
                        </p>
                    </div>

                    <Link href="/admin/projects/new">
                        <button className="mt-6 md:mt-0 px-8 py-3 bg-white text-blue-900 font-bold rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:scale-105 transition-all duration-300 flex items-center gap-2">
                            <Plus className="h-5 w-5" />
                            Create Project
                        </button>
                    </Link>
                </div>

                {/* Projects Grid */}
                <Suspense fallback={<LoadingGrid />}>
                    <ProjectsGrid initialProjects={projects} />
                </Suspense>
            </div>
        </div>
    );
}

function LoadingGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                    key={i}
                    className="bg-white/5 rounded-2xl p-6 border border-white/10 animate-pulse backdrop-blur-sm"
                >
                    <div className="h-6 bg-white/10 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-white/5 rounded w-full mb-2"></div>
                    <div className="h-4 bg-white/5 rounded w-2/3"></div>
                </div>
            ))}
        </div>
    );
}
