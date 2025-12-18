import { notFound } from 'next/navigation';
import { getSubjectById } from '@/lib/actions/curriculum';
import SubjectForm from '@/components/admin/SubjectForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditSubjectPage({ params }: PageProps) {
    const { id } = await params;
    const subject = await getSubjectById(id);

    if (!subject) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-[#020617] py-10 px-4 relative overflow-hidden selection:bg-blue-500/30">
            {/* Background Ambience */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[128px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/10 rounded-full blur-[128px] animate-pulse delay-1000"></div>
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="mb-8 pl-2">
                    <Link href="/admin/curriculum" className="inline-flex items-center text-sm text-blue-300/60 hover:text-blue-300 mb-4 transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Curriculum
                    </Link>
                    <h1 className="text-3xl font-black text-white tracking-tight mb-2">
                        {subject.name || 'Edit Subject'}
                    </h1>
                    <p className="text-blue-200/60 max-w-2xl text-sm">
                        Update syllabus, units, or subject details. Changes reflect immediately in the student dashboard.
                    </p>
                </div>

                <SubjectForm initialData={subject} />
            </div>
        </div>
    );
}
