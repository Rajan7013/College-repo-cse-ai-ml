'use client';

import { useState } from 'react';
import { UserProfile } from '@/lib/types/profile';
import { upsertUserProfile } from '@/lib/actions/user-profile';
import { Save, Plus, X } from 'lucide-react';

interface GoalsTabProps {
    profile: UserProfile | null;
    isEditing: boolean;
}

export default function GoalsTab({ profile, isEditing }: GoalsTabProps) {
    const [formData, setFormData] = useState({
        shortTermGoals: profile?.shortTermGoals || [''],
        longTermGoals: profile?.longTermGoals || [''],
        careerAim: profile?.careerAim || '',
        dreamCompany: profile?.dreamCompany || '',
    });
    const [saving, setSaving] = useState(false);

    const addGoal = (type: 'short' | 'long') => {
        if (type === 'short') {
            setFormData({ ...formData, shortTermGoals: [...formData.shortTermGoals, ''] });
        } else {
            setFormData({ ...formData, longTermGoals: [...formData.longTermGoals, ''] });
        }
    };

    const removeGoal = (type: 'short' | 'long', index: number) => {
        if (type === 'short') {
            setFormData({ ...formData, shortTermGoals: formData.shortTermGoals.filter((_, i) => i !== index) });
        } else {
            setFormData({ ...formData, longTermGoals: formData.longTermGoals.filter((_, i) => i !== index) });
        }
    };

    const updateGoal = (type: 'short' | 'long', index: number, value: string) => {
        if (type === 'short') {
            const updated = [...formData.shortTermGoals];
            updated[index] = value;
            setFormData({ ...formData, shortTermGoals: updated });
        } else {
            const updated = [...formData.longTermGoals];
            updated[index] = value;
            setFormData({ ...formData, longTermGoals: updated });
        }
    };

    const handleSave = async () => {
        setSaving(true);
        const result = await upsertUserProfile({
            shortTermGoals: formData.shortTermGoals.filter(g => g.trim() !== ''),
            longTermGoals: formData.longTermGoals.filter(g => g.trim() !== ''),
            careerAim: formData.careerAim,
            dreamCompany: formData.dreamCompany,
        });
        setSaving(false);
        if (result.success) {
            alert('Goals updated!');
            window.location.reload();
        }
    };

    if (!isEditing) {
        return (
            <div className="space-y-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/10 hover:border-blue-400/30 transition-all">
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                        <span className="text-3xl">🎯</span>
                        Short-term Goals (1 Year)
                    </h3>
                    {profile?.shortTermGoals && profile.shortTermGoals.length > 0 ? (
                        <ul className="space-y-3">
                            {profile.shortTermGoals.map((goal, i) => (
                                <li key={i} className="flex items-start gap-3 bg-cyan-500/10 backdrop-blur-sm p-4 rounded-xl border border-cyan-400/20">
                                    <span className="text-cyan-400 font-bold text-lg">•</span>
                                    <span className="text-blue-100 flex-1">{goal}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-blue-300">No short-term goals set</p>
                    )}
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/10 hover:border-blue-400/30 transition-all">
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                        <span className="text-3xl">🚀</span>
                        Long-term Goals (5 Years)
                    </h3>
                    {profile?.longTermGoals && profile.longTermGoals.length > 0 ? (
                        <ul className="space-y-3">
                            {profile.longTermGoals.map((goal, i) => (
                                <li key={i} className="flex items-start gap-3 bg-blue-500/10 backdrop-blur-sm p-4 rounded-xl border border-blue-400/20">
                                    <span className="text-blue-400 font-bold text-lg">•</span>
                                    <span className="text-blue-100 flex-1">{goal}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-blue-300">No long-term goals set</p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/10 hover:border-blue-400/30 transition-all">
                        <div className="text-3xl mb-3">💼</div>
                        <label className="text-sm font-bold text-blue-300 uppercase">Career Aim</label>
                        <p className="text-xl font-bold text-white mt-2">{profile?.careerAim || '-'}</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/10 hover:border-blue-400/30 transition-all">
                        <div className="text-3xl mb-3">🏢</div>
                        <label className="text-sm font-bold text-blue-300 uppercase">Dream Company</label>
                        <p className="text-xl font-bold text-white mt-2">{profile?.dreamCompany || '-'}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/10">
                <label className="block text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span className="text-2xl">🎯</span>
                    Short-term Goals (1 Year)
                </label>
                {formData.shortTermGoals.map((goal, i) => (
                    <div key={i} className="flex gap-2 mb-3">
                        <input
                            type="text"
                            value={goal}
                            onChange={(e) => updateGoal('short', i, e.target.value)}
                            className="flex-1 px-4 py-3 bg-white/5 border border-cyan-400/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                            placeholder={`Goal #${i + 1}`}
                        />
                        <button
                            onClick={() => removeGoal('short', i)}
                            className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl transition-all border border-red-400/20"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                ))}
                <button
                    onClick={() => addGoal('short')}
                    className="mt-2 px-4 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-xl font-semibold flex items-center gap-2 border border-cyan-400/20 transition-all"
                >
                    <Plus className="h-5 w-5" />
                    Add Short-term Goal
                </button>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/10">
                <label className="block text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span className="text-2xl">🚀</span>
                    Long-term Goals (5 Years)
                </label>
                {formData.longTermGoals.map((goal, i) => (
                    <div key={i} className="flex gap-2 mb-3">
                        <input
                            type="text"
                            value={goal}
                            onChange={(e) => updateGoal('long', i, e.target.value)}
                            className="flex-1 px-4 py-3 bg-white/5 border border-blue-400/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all"
                            placeholder={`Goal #${i + 1}`}
                        />
                        <button
                            onClick={() => removeGoal('long', i)}
                            className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl transition-all border border-red-400/20"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                ))}
                <button
                    onClick={() => addGoal('long')}
                    className="mt-2 px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-xl font-semibold flex items-center gap-2 border border-blue-400/20 transition-all"
                >
                    <Plus className="h-5 w-5" />
                    Add Long-term Goal
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-white mb-2">💼 Career Aim</label>
                    <input
                        type="text"
                        value={formData.careerAim}
                        onChange={(e) => setFormData({ ...formData, careerAim: e.target.value })}
                        className="w-full px-4 py-4 bg-white/5 border border-blue-400/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                        placeholder="Software Engineer, Data Scientist..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-white mb-2">🏢 Dream Company</label>
                    <input
                        type="text"
                        value={formData.dreamCompany}
                        onChange={(e) => setFormData({ ...formData, dreamCompany: e.target.value })}
                        className="w-full px-4 py-4 bg-white/5 border border-blue-400/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                        placeholder="Google, Microsoft, Amazon..."
                    />
                </div>
            </div>

            <button
                onClick={handleSave}
                disabled={saving}
                className="group relative w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-xl shadow-xl shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 group-hover:translate-x-full transition-transform duration-700"></div>
                <Save className="h-5 w-5 relative z-10" />
                <span className="relative z-10">{saving ? 'Saving...' : 'Save Goals'}</span>
            </button>
        </div>
    );
}
