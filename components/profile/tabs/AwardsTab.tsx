'use client';

import { UserProfile } from '@/lib/types/profile';

interface AwardsTabProps {
    profile: UserProfile | null;
    isEditing: boolean;
}

export default function AwardsTab({ profile, isEditing }: AwardsTabProps) {
    if (!isEditing) {
        return (
            <div className="space-y-6">
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">🏆</div>
                    <h3 className="text-3xl font-black text-white mb-2">Awards & Achievements</h3>
                    <p className="text-blue-200">Your accomplishments and recognitions</p>
                </div>

                {profile?.awards && profile.awards.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {profile.awards.map((award, i) => (
                            <div key={i} className="group relative bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-sm p-6 rounded-2xl border border-amber-400/20 hover:border-amber-400/40 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 hover:-translate-y-2">
                                <div className="absolute top-4 right-4 text-4xl opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all">🏆</div>
                                <h4 className="text-2xl font-black text-white mb-2 relative z-10">{award.title}</h4>
                                <p className="text-sm font-semibold text-amber-300 mb-1">🏅 {award.issuer}</p>
                                <p className="text-xs text-blue-200 mb-3">📅 {new Date(award.date).toISOString().split('T')[0]}</p>
                                {award.description && (
                                    <p className="text-sm text-blue-100 leading-relaxed bg-white/5 p-3 rounded-lg">{award.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white/5 backdrop-blur-sm rounded-2xl border border-blue-400/10">
                        <div className="text-6xl mb-4 opacity-50">🏅</div>
                        <p className="text-xl text-blue-200 font-semibold mb-2">No Awards Yet</p>
                        <p className="text-blue-300">Your achievements will appear here</p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="text-center py-16 bg-white/5 backdrop-blur-sm rounded-2xl border border-blue-400/10">
            <div className="text-6xl mb-4">🏆</div>
            <p className="text-xl text-white font-bold mb-2">Awards Management Coming Soon!</p>
            <p className="text-blue-200 mb-4">For now, view your awards in view mode.</p>
            <p className="text-sm text-blue-300">Switch off edit mode to see your awards</p>
        </div>
    );
}
