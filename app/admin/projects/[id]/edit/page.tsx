import { Suspense } from 'react';
import { getProjectById } from '@/lib/actions/projects';
import { notFound } from 'next/navigation';
import ProjectForm from '@/components/admin/projects/ProjectForm';

interface EditProjectPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
    const { id } = await params;
    const project = await getProjectById(id);

    if (!project) {
        notFound();
    }

    return (
        <div className="min-h-screen py-12 px-4 relative overflow-hidden">
            {/* Background Ambience matches Home Page */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[128px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[128px] pointer-events-none"></div>

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                        Edit Project
                    </h1>
                    <p className="text-lg text-blue-200/70 max-w-2xl mx-auto">
                        Update project details and manage teams.
                    </p>
                </div>

                <Suspense fallback={<LoadingForm />}>
                    <ProjectForm project={project} />
                </Suspense>
            </div>
        </div>
    );
}

function LoadingForm() {
    return (
        <div className="bg-white/5 rounded-2xl p-8 shadow-2xl border border-white/10 animate-pulse backdrop-blur-xl">
            <div className="space-y-6">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i}>
                        <div className="h-4 bg-white/10 rounded w-1/4 mb-2"></div>
                        <div className="h-10 bg-white/5 rounded"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
