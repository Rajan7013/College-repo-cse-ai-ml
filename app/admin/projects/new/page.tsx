import { Suspense } from 'react';
import ProjectForm from '@/components/admin/projects/ProjectForm';

export default function NewProjectPage() {
    return (
        <div className="min-h-screen py-12 px-4 relative overflow-hidden">
            {/* Background Ambience matches Home Page */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[128px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[128px] pointer-events-none"></div>

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                        Create New Project
                    </h1>
                    <p className="text-lg text-blue-200/70 max-w-2xl mx-auto">
                        Define a project opportunity for students. Set the goals, requirements, and timeline for a successful collaboration.
                    </p>
                </div>

                <Suspense fallback={<div className="text-white text-center py-20">Loading form...</div>}>
                    <ProjectForm />
                </Suspense>
            </div>
        </div>
    );
}
