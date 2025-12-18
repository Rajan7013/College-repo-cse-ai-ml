import Link from 'next/link';
import { getSubjects } from '@/lib/actions/curriculum';
import CurriculumList from '@/components/admin/CurriculumList';
import { Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CurriculumPage() {
    // Fetch all subjects initially
    const subjects = await getSubjects();

    return (
        <div className="min-h-screen bg-[var(--bg-navy)] relative overflow-hidden font-sans text-white">
            {/* Aurora Background */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-500/20 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
            </div>

            <div className="container mx-auto py-12 px-4 md:px-8 max-w-7xl relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-white mb-2">Curriculum Manager</h1>
                        <p className="text-blue-200 text-lg">Manage your institution's syllabus, regulations, and subjects.</p>
                    </div>
                    <div>
                        <Link href="/admin/curriculum/create">
                            <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transition-all hover:scale-105 active:scale-95">
                                <Plus className="h-5 w-5" /> Add New Subject
                            </button>
                        </Link>
                    </div>
                </div>

                <CurriculumList initialSubjects={subjects} />
            </div>
        </div>
    );
}
