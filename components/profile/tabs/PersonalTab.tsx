'use client';

import { useState } from 'react';
import { UserProfile } from '@/lib/types/profile';
import { upsertUserProfile } from '@/lib/actions/user-profile';
import { Save, Sparkles } from 'lucide-react';

interface PersonalTabProps {
    profile: UserProfile | null;
    isEditing: boolean;
}

export default function PersonalTab({ profile, isEditing }: PersonalTabProps) {
    const [formData, setFormData] = useState({
        fullName: profile?.fullName || '',
        dateOfBirth: profile?.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
        gender: profile?.gender || '',
        bio: profile?.bio || '',
    });
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        const result = await upsertUserProfile({
            fullName: formData.fullName,
            dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined,
            gender: formData.gender as any,
            bio: formData.bio,
        });
        setSaving(false);
        if (result.success) {
            alert('Profile updated successfully!');
            window.location.reload();
        } else {
            alert(result.error || 'Failed to save');
        }
    };

    if (!isEditing) {
        return (
            <div className="space-y-6">
                {[
                    { label: 'Full Name', value: profile?.fullName || '-', icon: '👤' },
                    { label: 'Date of Birth', value: profile?.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '-', icon: '🎂' },
                    { label: 'Gender', value: profile?.gender || '-', icon: '⚧' },
                ].map((item, idx) => (
                    <div key={idx} className="group relative bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-blue-400/10 hover:border-blue-400/30 hover:bg-white/10 transition-all duration-300">
                        <div className="flex items-start gap-4">
                            <div className="text-3xl">{item.icon}</div>
                            <div className="flex-1">
                                <label className="text-sm font-bold text-blue-300 uppercase tracking-wide block mb-1">{item.label}</label>
                                <p className="text-lg font-semibold text-white">{item.value}</p>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="relative bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-blue-400/10 hover:border-blue-400/30 hover:bg-white/10 transition-all duration-300">
                    <div className="flex items-start gap-4">
                        <div className="text-3xl">📝</div>
                        <div className="flex-1">
                            <label className="text-sm font-bold text-blue-300 uppercase tracking-wide block mb-1">Bio</label>
                            <p className="text-blue-100 leading-relaxed">{profile?.bio || '-'}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="relative group">
                <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-cyan-400" />
                    Full Name *
                </label>
                <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all duration-300"
                    placeholder="John Doe"
                />
            </div>

            <div className="relative group">
                <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                    Date of Birth
                </label>
                <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all duration-300"
                />
            </div>

            <div className="relative group">
                <label className="block text-sm font-bold text-white mb-2">Gender</label>
                <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all duration-300"
                >
                    <option value="" className="bg-slate-800">Select Gender</option>
                    <option value="Male" className="bg-slate-800">Male</option>
                    <option value="Female" className="bg-slate-800">Female</option>
                    <option value="Other" className="bg-slate-800">Other</option>
                </select>
            </div>

            <div className="relative group">
                <label className="block text-sm font-bold text-white mb-2">Bio</label>
                <textarea
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all duration-300 resize-none"
                    placeholder="Tell us about yourself..."
                />
            </div>

            <button
                onClick={handleSave}
                disabled={saving}
                className="relative group w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-xl shadow-xl shadow-blue-500/50 hover:shadow-cyan-500/50 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 group-hover:translate-x-full transition-transform duration-700"></div>
                <Save className="h-5 w-5 relative z-10" />
                <span className="relative z-10">{saving ? 'Saving...' : 'Save Personal Details'}</span>
            </button>
        </div>
    );
}
