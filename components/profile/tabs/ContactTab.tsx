'use client';

import { useState } from 'react';
import { UserProfile } from '@/lib/types/profile';
import { upsertUserProfile } from '@/lib/actions/user-profile';
import { Save, Mail, Phone, Linkedin, Github, Globe } from 'lucide-react';

interface ContactTabProps {
    profile: UserProfile | null;
    isEditing: boolean;
}

export default function ContactTab({ profile, isEditing }: ContactTabProps) {
    const [formData, setFormData] = useState({
        emailPrimary: profile?.emailPrimary || '',
        emailSecondary: profile?.emailSecondary || '',
        phonePrimary: profile?.phonePrimary || '',
        phoneSecondary: profile?.phoneSecondary || '',
        linkedIn: profile?.linkedIn || '',
        github: profile?.github || '',
        portfolio: profile?.portfolio || '',
    });
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        await upsertUserProfile(formData);
        setSaving(false);
        alert('Contact details updated!');
        window.location.reload();
    };

    if (!isEditing) {
        return (
            <div className="space-y-6">
                {/* Email Section */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/10 hover:border-blue-400/30 transition-all">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                        <Mail className="h-6 w-6 text-cyan-400" />
                        Email Addresses
                    </h3>
                    <div className="space-y-3">
                        <div className="bg-white/5 rounded-xl p-4 border border-blue-400/10">
                            <label className="text-sm font-bold text-blue-300 uppercase block mb-1">Primary Email</label>
                            <p className="text-lg font-semibold text-white">{profile?.emailPrimary || '-'}</p>
                        </div>
                        {profile?.emailSecondary && (
                            <div className="bg-white/5 rounded-xl p-4 border border-blue-400/10">
                                <label className="text-sm font-bold text-blue-300 uppercase block mb-1">Secondary Email</label>
                                <p className="text-lg font-semibold text-white">{profile.emailSecondary}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Phone Section */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/10 hover:border-blue-400/30 transition-all">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                        <Phone className="h-6 w-6 text-emerald-400" />
                        Phone Numbers
                    </h3>
                    <div className="space-y-3">
                        <div className="bg-white/5 rounded-xl p-4 border border-blue-400/10">
                            <label className="text-sm font-bold text-blue-300 uppercase block mb-1">Primary Phone</label>
                            <p className="text-lg font-semibold text-white">{profile?.phonePrimary || '-'}</p>
                        </div>
                        {profile?.phoneSecondary && (
                            <div className="bg-white/5 rounded-xl p-4 border border-blue-400/10">
                                <label className="text-sm font-bold text-blue-300 uppercase block mb-1">Secondary Phone</label>
                                <p className="text-lg font-semibold text-white">{profile.phoneSecondary}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Social Links */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/10 hover:border-blue-400/30 transition-all">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                        <Globe className="h-6 w-6 text-violet-400" />
                        Social & Professional Links
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {profile?.linkedIn && (
                            <a href={profile.linkedIn} target="_blank" rel="noopener noreferrer" className="group bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-400/20 hover:border-blue-400/40 hover:shadow-lg hover:shadow-blue-500/20 transition-all">
                                <Linkedin className="h-6 w-6 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                                <label className="text-sm font-bold text-blue-300 uppercase block mb-1">LinkedIn</label>
                                <p className="text-sm text-blue-100 truncate">{profile.linkedIn}</p>
                            </a>
                        )}
                        {profile?.github && (
                            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="group bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-xl p-4 border border-violet-400/20 hover:border-violet-400/40 hover:shadow-lg hover:shadow-violet-500/20 transition-all">
                                <Github className="h-6 w-6 text-violet-400 mb-2 group-hover:scale-110 transition-transform" />
                                <label className="text-sm font-bold text-violet-300 uppercase block mb-1">GitHub</label>
                                <p className="text-sm text-blue-100 truncate">{profile.github}</p>
                            </a>
                        )}
                        {profile?.portfolio && (
                            <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" className="group bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-xl p-4 border border-emerald-400/20 hover:border-emerald-400/40 hover:shadow-lg hover:shadow-emerald-500/20 transition-all">
                                <Globe className="h-6 w-6 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                                <label className="text-sm font-bold text-emerald-300 uppercase block mb-1">Portfolio</label>
                                <p className="text-sm text-blue-100 truncate">{profile.portfolio}</p>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-cyan-400" />
                        Primary Email *
                    </label>
                    <input
                        type="email"
                        required
                        value={formData.emailPrimary}
                        onChange={(e) => setFormData({ ...formData, emailPrimary: e.target.value })}
                        className="w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                        placeholder="student@example.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-blue-400" />
                        Secondary Email
                    </label>
                    <input
                        type="email"
                        value={formData.emailSecondary}
                        onChange={(e) => setFormData({ ...formData, emailSecondary: e.target.value })}
                        className="w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                        placeholder="alternate@example.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <Phone className="h-4 w-4 text-emerald-400" />
                        Primary Phone
                    </label>
                    <input
                        type="tel"
                        value={formData.phonePrimary}
                        onChange={(e) => setFormData({ ...formData, phonePrimary: e.target.value })}
                        className="w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition-all"
                        placeholder="+91 1234567890"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <Phone className="h-4 w-4 text-green-400" />
                        Secondary Phone
                    </label>
                    <input
                        type="tel"
                        value={formData.phoneSecondary}
                        onChange={(e) => setFormData({ ...formData, phoneSecondary: e.target.value })}
                        className="w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition-all"
                        placeholder="+91 0987654321"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <Linkedin className="h-4 w-4 text-blue-400" />
                        LinkedIn Profile
                    </label>
                    <input
                        type="url"
                        value={formData.linkedIn}
                        onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                        className="w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all"
                        placeholder="https://linkedin.com/in/yourprofile"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <Github className="h-4 w-4 text-violet-400" />
                        GitHub Profile
                    </label>
                    <input
                        type="url"
                        value={formData.github}
                        onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                        className="w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/30 transition-all"
                        placeholder="https://github.com/yourprofile"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <Globe className="h-4 w-4 text-emerald-400" />
                        Portfolio Website
                    </label>
                    <input
                        type="url"
                        value={formData.portfolio}
                        onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                        className="w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition-all"
                        placeholder="https://yourportfolio.com"
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
                <span className="relative z-10">{saving ? 'Saving...' : 'Save Contact Details'}</span>
            </button>
        </div>
    );
}
