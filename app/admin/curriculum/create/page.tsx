import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Suspense } from 'react';
export const maxDuration = 60;

import SubjectForm from '@/components/admin/SubjectForm';

export default function CreateSubjectPage() {
    return (
        <div className="min-h-screen bg-[var(--bg-navy)] relative overflow-hidden font-sans text-white">
            {/* Aurora Background */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-500/20 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
            </div>

            <div className="max-w-4xl mx-auto py-12 px-4 relative z-10">
                <div className="mb-10">
                    <Link href="/admin/curriculum" className="inline-flex items-center text-sm text-blue-200 hover:text-white mb-4 transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Curriculum
                    </Link>
                    <h1 className="text-4xl font-black tracking-tight text-white mb-2">Add New Subject</h1>
                    <p className="text-blue-200 text-lg">
                        Define a new subject, its units, and syllabus details.
                    </p>
                </div>

                <SubjectForm />
            </div>
        </div>
    );
}
