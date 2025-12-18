import { getProfile, getFavoriteResources, getRecentlyViewedResources } from '@/lib/actions/profile';
import { User, BookMarked, Clock, Edit, GraduationCap, MapPin, Mail, Sparkles, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
    const profile = await getProfile();

    if (!profile) {
        redirect('/sign-in');
    }

    const favorites = await getFavoriteResources();
    const recentlyViewed = await getRecentlyViewedResources();

    const getBranchLabel = (branch: string) => {
        const labels: Record<string, string> = {
            'CSE_AI_ML': 'CSE (AI & ML)',
            'CSE': 'Computer Science',
            'ECE': 'Electronics & Communication',
            'EEE': 'Electrical & Electronics',
            'MECH': 'Mechanical',
            'CIVIL': 'Civil'
        };
        return labels[branch] || branch;
    };

    return (
        <div className="min-h-screen bg-[var(--bg-navy)] relative overflow-hidden font-sans text-white">
            {/* Aurora Background */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-500/20 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto py-12 px-4 space-y-8">
                {/* Header Card */}
                <div className="glass-card p-8 rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-violet-500/10 blur-3xl rounded-full -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-150" />

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                        {/* Profile Picture */}
                        <div className="relative group/avatar">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full blur-md opacity-50 group-hover/avatar:opacity-75 transition-opacity" />
                            {profile.profile.photoURL ? (
                                <img
                                    src={profile.profile.photoURL}
                                    alt={profile.profile.displayName}
                                    className="w-32 h-32 rounded-full object-cover border-4 border-white/10 relative z-10 shadow-2xl"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center border-4 border-white/10 relative z-10 shadow-2xl">
                                    <User className="h-16 w-16 text-white/90" />
                                </div>
                            )}
                            <div className="absolute bottom-1 right-1 z-20 bg-[#0f172a] p-1.5 rounded-full border border-white/20">
                                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 text-center md:text-left space-y-2">
                            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
                                <div>
                                    <h1 className="text-4xl font-black text-white tracking-tight mb-1 flex items-center gap-2 justify-center md:justify-start">
                                        {profile.profile.displayName}
                                        <Sparkles className="h-6 w-6 text-yellow-400 fill-yellow-400/20" />
                                    </h1>
                                    <div className="flex items-center gap-2 text-blue-200 justify-center md:justify-start">
                                        <Mail className="h-4 w-4" />
                                        <span>{profile.email}</span>
                                    </div>
                                </div>

                                <Link href="/profile/edit">
                                    <button className="flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 transition-all hover:scale-105 active:scale-95 group/btn">
                                        <Edit className="h-4 w-4 text-blue-400 group-hover/btn:text-blue-300 transition-colors" />
                                        <span>Edit Profile</span>
                                    </button>
                                </Link>
                            </div>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
                                {profile.profile.rollNumber && (
                                    <div className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-300 text-sm font-bold flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                                        {profile.profile.rollNumber}
                                    </div>
                                )}
                                <div className="px-4 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-300 text-sm font-bold flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4" />
                                    {getBranchLabel(profile.profile.branch)}
                                </div>
                                <div className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-300 text-sm font-bold flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    Year {profile.profile.year}
                                </div>
                            </div>

                            {profile.profile.bio && (
                                <p className="text-blue-100/80 leading-relaxed max-w-2xl text-lg pt-2 italic">
                                    "{profile.profile.bio}"
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Favorites Section */}
                    <div className="glass-card p-6 rounded-3xl h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-blue-500/20 rounded-xl">
                                <BookMarked className="h-6 w-6 text-blue-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white">
                                Favorite Resources <span className="text-blue-400 text-sm ml-2">({favorites.length})</span>
                            </h2>
                        </div>

                        {favorites.length > 0 ? (
                            <div className="grid gap-3">
                                {favorites.slice(0, 4).map((resource) => (
                                    <a
                                        key={resource.id}
                                        href={resource.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex flex-col p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-blue-500/30 rounded-2xl transition-all duration-300"
                                    >
                                        <h3 className="font-bold text-white group-hover:text-blue-300 transition-colors truncate">
                                            {resource.title}
                                        </h3>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-xs font-medium text-blue-300/60 bg-blue-500/10 px-2 py-0.5 rounded-md">
                                                {resource.subjectCode}
                                            </span>
                                            <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors uppercase tracking-wider font-bold">
                                                {resource.documentType}
                                            </span>
                                        </div>
                                    </a>
                                ))}
                                {favorites.length > 4 && (
                                    <button className="w-full py-3 text-sm font-bold text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-xl transition-all">
                                        View All Favorites
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-4 border-2 border-dashed border-white/5 rounded-2xl">
                                <BookMarked className="h-12 w-12 text-white/10 mb-3" />
                                <p className="text-white/40 font-medium">No favorites yet</p>
                                <p className="text-sm text-white/20 mt-1">Bookmark resources from the dashboard!</p>
                            </div>
                        )}
                    </div>

                    {/* Recently Viewed Section */}
                    <div className="glass-card p-6 rounded-3xl h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-violet-500/20 rounded-xl">
                                <Clock className="h-6 w-6 text-violet-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white">
                                Recently Viewed <span className="text-violet-400 text-sm ml-2">({recentlyViewed.length})</span>
                            </h2>
                        </div>

                        {recentlyViewed.length > 0 ? (
                            <div className="grid gap-3">
                                {recentlyViewed.slice(0, 4).map((resource) => (
                                    <a
                                        key={resource.id}
                                        href={resource.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-violet-500/30 rounded-2xl transition-all duration-300"
                                    >
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-white group-hover:text-violet-300 transition-colors truncate">
                                                {resource.title}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs font-medium text-violet-300/60">
                                                    {resource.subjectCode}
                                                </span>
                                                <span className="w-1 h-1 rounded-full bg-white/20" />
                                                <span className="text-xs text-white/40">
                                                    {resource.documentType}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="ml-4 px-2 py-1 bg-white/5 rounded-lg text-[10px] font-bold text-white/30 uppercase tracking-wider group-hover:bg-violet-500/20 group-hover:text-violet-300 transition-all">
                                            {resource.fileType}
                                        </div>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-4 border-2 border-dashed border-white/5 rounded-2xl">
                                <Clock className="h-12 w-12 text-white/10 mb-3" />
                                <p className="text-white/40 font-medium">No history yet</p>
                                <p className="text-sm text-white/20 mt-1">Start exploring resources!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
