'use client';

import { useState } from 'react';
import { UserProfile } from '@/lib/types/profile';
import { upsertUserProfile } from '@/lib/actions/user-profile';
import { Save } from 'lucide-react';

interface AcademicTabProps {
    profile: UserProfile | null;
    isEditing: boolean;
}

export default function AcademicTab({ profile, isEditing }: AcademicTabProps) {
    const [formData, setFormData] = useState({
        rollNumber: profile?.rollNumber || '',
        course: profile?.course || '',
        branch: profile?.branch || '',
        yearOfStudy: profile?.yearOfStudy || 1,
        semester: profile?.semester || 1,
        batch: profile?.batch || '',
        cgpa: profile?.cgpa || 0,
        tenthMarks: profile?.tenthMarks || 0,
        twelfthMarks: profile?.twelfthMarks || 0,
        universityRegNo: profile?.universityRegNo || '',
    });
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        const result = await upsertUserProfile(formData);
        setSaving(false);
        if (result.success) {
            alert('Academic details updated!');
            window.location.reload();
        } else {
            alert(result.error || 'Failed to save');
        }
    };

    if (!isEditing) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    { label: 'Roll Number', value: profile?.rollNumber || '-', icon: '🎓' },
                    { label: 'Course', value: profile?.course || '-', icon: '📚' },
                    { label: 'Branch', value: profile?.branch || '-', icon: '🔬' },
                    { label: 'Year of Study', value: profile?.yearOfStudy ? `Year ${profile.yearOfStudy}` : '-', icon: '📅' },
                    { label: 'Semester', value: profile?.semester ? `Semester ${profile.semester}` : '-', icon: '📖' },
                    { label: 'Batch', value: profile?.batch || '-', icon: '👥' },
                    { label: 'CGPA', value: profile?.cgpa || '-', icon: '⭐' },
                    { label: '10th Marks', value: profile?.tenthMarks ? `${profile.tenthMarks}%` : '-', icon: '📊' },
                    { label: '12th Marks', value: profile?.twelfthMarks ? `${profile.twelfthMarks}%` : '-', icon: '📈' },
                    { label: 'University Reg. No', value: profile?.universityRegNo || '-', icon: '🏛️' },
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
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <span>🎓</span> Roll Number *
                    </label>
                    <input
                        type="text"
                        value={formData.rollNumber}
                        onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                        className="w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                        placeholder="2023001"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <span>📚</span> Course
                    </label>
                    <input
                        type="text"
                        value={formData.course}
                        onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                        className="w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                        placeholder="B.Tech"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <span>🔬</span> Branch
                    </label>
                    <input
                        type="text"
                        value={formData.branch}
                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                        className="w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                        placeholder="CSE AI & ML"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <span>📅</span> Year of Study
                    </label>
                    <select
                        value={formData.yearOfStudy}
                        onChange={(e) => setFormData({ ...formData, yearOfStudy: parseInt(e.target.value) })}
                        className="w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                    >
                        <option value="1" className="bg-slate-800">1st Year</option>
                        <option value="2" className="bg-slate-800">2nd Year</option>
                        <option value="3" className="bg-slate-800">3rd Year</option>
                        <option value="4" className="bg-slate-800">4th Year</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <span>📖</span> Semester
                    </label>
                    <select
                        value={formData.semester}
                        onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                        className="w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                            <option key={sem} value={sem} className="bg-slate-800">Semester {sem}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <span>👥</span> Batch
                    </label>
                    <input
                        type="text"
                        value={formData.batch}
                        onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                        className="w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                        placeholder="2023-2027"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <span>⭐</span> Current CGPA
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        value={formData.cgpa}
                        onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) })}
                        className="w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                        placeholder="8.5"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <span>📊</span> 10th Marks (%)
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={formData.tenthMarks}
                        onChange={(e) => setFormData({ ...formData, tenthMarks: parseFloat(e.target.value) })}
                        className="w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                        placeholder="90.5"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <span>📈</span> 12th Marks (%)
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={formData.twelfthMarks}
                        onChange={(e) => setFormData({ ...formData, twelfthMarks: parseFloat(e.target.value) })}
                        className="w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                        placeholder="85.0"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <span>🏛️</span> University Registration No
                    </label>
                    <input
                        type="text"
                        value={formData.universityRegNo}
                        onChange={(e) => setFormData({ ...formData, universityRegNo: e.target.value })}
                        className="w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                        placeholder="UNI2023001"
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
                <span className="relative z-10">{saving ? 'Saving...' : 'Save Academic Details'}</span>
            </button>
        </div>
    );
}
