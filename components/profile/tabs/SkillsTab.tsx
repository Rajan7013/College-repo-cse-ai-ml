'use client';

import { useState } from 'react';
import { UserProfile } from '@/lib/types/profile';
import { upsertUserProfile } from '@/lib/actions/user-profile';
import { Save, Plus, X } from 'lucide-react';

interface SkillsTabProps {
    profile: UserProfile | null;
    isEditing: boolean;
}

export default function SkillsTab({ profile, isEditing }: SkillsTabProps) {
    const [formData, setFormData] = useState({
        technicalSkills: profile?.technicalSkills || [],
        softSkills: profile?.softSkills || [],
        strengths: profile?.strengths || [],
        weaknesses: profile?.weaknesses || [],
    });
    const [inputValues, setInputValues] = useState({ tech: '', soft: '', strength: '', weakness: '' });
    const [saving, setSaving] = useState(false);

    const addItem = (field: 'technicalSkills' | 'softSkills' | 'strengths' | 'weaknesses', value: string) => {
        if (value.trim()) {
            setFormData({ ...formData, [field]: [...formData[field], value.trim()] });
            const key = field === 'technicalSkills' ? 'tech' : field === 'softSkills' ? 'soft' : field === 'strengths' ? 'strength' : 'weakness';
            setInputValues({ ...inputValues, [key]: '' });
        }
    };

    const removeItem = (field: string, index: number) => {
        setFormData({ ...formData, [field]: formData[field as keyof typeof formData].filter((_: any, i: number) => i !== index) });
    };

    const handleSave = async () => {
        setSaving(true);
        await upsertUserProfile(formData);
        setSaving(false);
        alert('Skills updated!');
        window.location.reload();
    };

    if (!isEditing) {
        return (
            <div className="space-y-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/10">
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3"><span className="text-3xl">💻</span>Technical Skills</h3>
                    <div className="flex flex-wrap gap-3">
                        {profile?.technicalSkills?.map((skill, i) => (
                            <span key={i} className="px-5 py-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 border border-blue-400/30 text-white rounded-xl font-bold shadow-lg hover:shadow-blue-500/30 transition-all hover:scale-105">{skill}</span>
                        )) || <p className="text-blue-300">No technical skills added</p>}
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/10">
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3"><span className="text-3xl">🤝</span>Soft Skills</h3>
                    <div className="flex flex-wrap gap-3">
                        {profile?.softSkills?.map((skill, i) => (
                            <span key={i} className="px-5 py-3 bg-gradient-to-r from-emerald-500/20 to-green-500/20 hover:from-emerald-500/30 hover:to-green-500/30 border border-emerald-400/30 text-white rounded-xl font-bold shadow-lg hover:shadow-emerald-500/30 transition-all hover:scale-105">{skill}</span>
                        )) || <p className="text-blue-300">No soft skills added</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/10">
                        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3"><span className="text-3xl">💪</span>Strengths</h3>
                        <ul className="space-y-2">
                            {profile?.strengths?.map((s, i) => (
                                <li key={i} className="flex items-start gap-2 bg-green-500/10 p-3 rounded-lg border border-green-400/20"><span className="text-green-400 font-bold">✓</span><span className="text-blue-100">{s}</span></li>
                            )) || <p className="text-blue-300">No strengths listed</p>}
                        </ul>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/10">
                        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3"><span className="text-3xl">📈</span>Areas to Improve</h3>
                        <ul className="space-y-2">
                            {profile?.weaknesses?.map((w, i) => (
                                <li key={i} className="flex items-start gap-2 bg-amber-500/10 p-3 rounded-lg border border-amber-400/20"><span className="text-amber-400 font-bold">•</span><span className="text-blue-100">{w}</span></li>
                            )) || <p className="text-blue-300">No areas added</p>}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/10">
                <label className="block text-lg font-bold text-white mb-4 flex items-center gap-2"><span className="text-2xl">💻</span>Technical Skills</label>
                <div className="flex gap-2 mb-3">
                    <input type="text" value={inputValues.tech} onChange={(e) => setInputValues({ ...inputValues, tech: e.target.value })} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('technicalSkills', inputValues.tech))} className="flex-1 px-4 py-3 bg-white/5 border border-blue-400/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30" placeholder="React, Python, SQL..." />
                    <button onClick={() => addItem('technicalSkills', inputValues.tech)} className="px-5 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white rounded-xl font-bold shadow-lg transition-all"><Plus className="h-5 w-5" /></button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {formData.technicalSkills.map((skill, i) => (
                        <span key={i} className="px-4 py-2 bg-blue-500/20 border border-blue-400/30 text-blue-100 rounded-xl flex items-center gap-2 hover:bg-blue-500/30 transition-all"><span>{skill}</span><button onClick={() => removeItem('technicalSkills', i)} className="hover:text-red-400"><X className="h-4 w-4" /></button></span>
                    ))}
                </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/10">
                <label className="block text-lg font-bold text-white mb-4 flex items-center gap-2"><span className="text-2xl">🤝</span>Soft Skills</label>
                <div className="flex gap-2 mb-3">
                    <input type="text" value={inputValues.soft} onChange={(e) => setInputValues({ ...inputValues, soft: e.target.value })} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('softSkills', inputValues.soft))} className="flex-1 px-4 py-3 bg-white/5 border border-emerald-400/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30" placeholder="Leadership, Communication..." />
                    <button onClick={() => addItem('softSkills', inputValues.soft)} className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white rounded-xl font-bold shadow-lg transition-all"><Plus className="h-5 w-5" /></button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {formData.softSkills.map((skill, i) => (
                        <span key={i} className="px-4 py-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-100 rounded-xl flex items-center gap-2 hover:bg-emerald-500/30 transition-all"><span>{skill}</span><button onClick={() => removeItem('softSkills', i)} className="hover:text-red-400"><X className="h-4 w-4" /></button></span>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/10">
                    <label className="block text-lg font-bold text-white mb-4">💪 Strengths</label>
                    <div className="flex gap-2 mb-3">
                        <input type="text" value={inputValues.strength} onChange={(e) => setInputValues({ ...inputValues, strength: e.target.value })} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('strengths', inputValues.strength))} className="flex-1 px-4 py-3 bg-white/5 border border-green-400/20 rounded-xl text-white focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/30" placeholder="Add strength..." />
                        <button onClick={() => addItem('strengths', inputValues.strength)} className="px-4 bg-green-500/30 hover:bg-green-500/40 text-green-300 rounded-xl"><Plus className="h-5 w-5" /></button>
                    </div>
                    <div className="space-y-2">
                        {formData.strengths.map((s, i) => (
                            <div key={i} className="flex items-center justify-between bg-green-500/10 p-3 rounded-lg border border-green-400/20"><span className="text-blue-100">{s}</span><button onClick={() => removeItem('strengths', i)} className="text-red-400 hover:text-red-300"><X className="h-4 w-4" /></button></div>
                        ))}
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/10">
                    <label className="block text-lg font-bold text-white mb-4">📈 Areas to Improve</label>
                    <div className="flex gap-2 mb-3">
                        <input type="text" value={inputValues.weakness} onChange={(e) => setInputValues({ ...inputValues, weakness: e.target.value })} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('weaknesses', inputValues.weakness))} className="flex-1 px-4 py-3 bg-white/5 border border-amber-400/20 rounded-xl text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30" placeholder="Add area..." />
                        <button onClick={() => addItem('weaknesses', inputValues.weakness)} className="px-4 bg-amber-500/30 hover:bg-amber-500/40 text-amber-300 rounded-xl"><Plus className="h-5 w-5" /></button>
                    </div>
                    <div className="space-y-2">
                        {formData.weaknesses.map((w, i) => (
                            <div key={i} className="flex items-center justify-between bg-amber-500/10 p-3 rounded-lg border border-amber-400/20"><span className="text-blue-100">{w}</span><button onClick={() => removeItem('weaknesses', i)} className="text-red-400 hover:text-red-300"><X className="h-4 w-4" /></button></div>
                        ))}
                    </div>
                </div>
            </div>

            <button onClick={handleSave} disabled={saving} className="group relative w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-xl shadow-xl shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 group-hover:translate-x-full transition-transform duration-700"></div>
                <Save className="h-5 w-5 relative z-10" />
                <span className="relative z-10">{saving ? 'Saving...' : 'Save Skills'}</span>
            </button>
        </div>
    );
}
