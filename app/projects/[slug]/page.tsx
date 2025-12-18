import { Suspense } from 'react';
import { getProjectBySlug } from '@/lib/actions/projects';
import { getProjectTeams } from '@/lib/actions/project-teams';
import { getActiveProjectForms } from '@/lib/actions/project-forms';
import { notFound } from 'next/navigation';
import ProjectDetailView from '@/components/projects/ProjectDetailView';

interface ProjectDetailPageProps {
    params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);

    if (!project) {
        notFound();
    }

    const [teams, forms] = await Promise.all([
        getProjectTeams(project.id),
        getActiveProjectForms(project.id)
    ]);

    return (
        <div className="min-h-screen">
            <Suspense fallback={<LoadingView />}>
                <ProjectDetailView project={project} teams={teams} forms={forms} />
            </Suspense>
        </div>
    );
}

function LoadingView() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-blue-200 font-semibold">Loading project details...</p>
            </div>
        </div>
    );
}
