'use client';

import { useState, useEffect } from 'react';
import { getProfile, updateProfile, type Profile } from '@/lib/actions/profile';
import { User, Loader2, Save, Sparkles, Check, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const BRANCHES = [
    { value: 'CSE_AI_ML', label: 'CSE (AI & ML)' },
    { value: 'CSE', label: 'Computer Science' },
    { value: 'ECE', label: 'Electronics & Communication' },
    { value: 'EEE', label: 'Electrical & Electronics' },
    { value: 'MECH', label: 'Mechanical' },
    { value: 'CIVIL', label: 'Civil' },
];

const AVATARS = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Trouble",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Buster",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Shadow",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Snowball",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Milo",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Sassy",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Oscar",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Lola",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Leo",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Bailey",
];

export default function EditProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [profile, setProfile] = useState<Profile>({
        displayName: '',
        rollNumber: '',
        year: 1,
        branch: 'CSE_AI_ML',
        bio: '',
        photoURL: ''
    });

    useEffect(() => {
        async function fetchProfile() {
            const data = await getProfile();
            if (data) {
                setProfile(data.profile);
            }
            setLoading(false);
        }
        fetchProfile();
    }, []);

    const selectAvatar = (url: string) => {
        setProfile({ ...profile, photoURL: url });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        const result = await updateProfile(profile);

        if (result.success) {
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            // Don't redirect immediately so user can see the success and their new avatar
            setTimeout(() => {
                router.push('/profile');
            }, 1000);
        } else {
            setMessage({ type: 'error', text: result.message });
        }

        setSaving(false);
    };

    const inputClasses = "w-full px-4 py-3 bg-[#0f172a]/50 border border-white/10 rounded-xl text-white placeholder-blue-200/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium";
    const labelClasses = "block text-sm font-semibold text-blue-200 mb-2";

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-navy)]">
                <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-navy)] relative overflow-hidden font-sans text-white">
            {/* Aurora Background */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-500/20 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
            </div>

            <div className="max-w-4xl mx-auto py-12 px-4 relative z-10">
                <Link href="/profile" className="inline-flex items-center text-sm text-blue-200 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Profile
                </Link>

                <div className="glass-card p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4 border-b border-white/10 pb-6">
                        <div>
                            <h1 className="text-3xl font-black text-white flex items-center gap-3">
                                <Sparkles className="h-6 w-6 text-purple-400" />
                                Edit Profile
                            </h1>
                            <p className="text-blue-200 mt-2">Update your personal details and choose your avatar.</p>
                        </div>
                        {message && (
                            <div className={`px-4 py-2 rounded-xl flex items-center gap-2 font-medium animate-in fade-in slide-in-from-top-2 ${message.type === 'success'
                                    ? 'bg-green-500/20 text-green-200 border border-green-500/20'
                                    : 'bg-red-500/20 text-red-200 border border-red-500/20'
                                }`}>
                                {message.type === 'success' ? <ShieldCheck className="h-4 w-4" /> : <Loader2 className="h-4 w-4" />}
                                {message.text}
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        {/* Avatar Selection */}
                        <div>
                            <label className="block text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                <User className="h-4 w-4 text-blue-400" />
                                Choose Your Look
                            </label>

                            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
                                {AVATARS.map((avatar, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => selectAvatar(avatar)}
                                        className={`relative group rounded-full overflow-hidden transition-all duration-300 ${profile.photoURL === avatar
                                                ? 'ring-4 ring-purple-500 scale-110 shadow-lg shadow-purple-500/50 grayscale-0'
                                                : 'ring-2 ring-white/10 hover:ring-white/50 grayscale hover:grayscale-0 hover:scale-105'
                                            }`}
                                    >
                                        <img
                                            src={avatar}
                                            alt={`Avatar ${idx + 1}`}
                                            className="w-full h-full bg-[#0f172a]"
                                        />
                                        {profile.photoURL === avatar && (
                                            <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                                                <Check className="h-6 w-6 text-white drop-shadow-md" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-blue-300 mt-3 text-center md:text-left">
                                Select an avatar that best represents you.
                            </p>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Display Name */}
                            <div className="md:col-span-2">
                                <label className={labelClasses}>Display Name</label>
                                <input
                                    type="text"
                                    value={profile.displayName}
                                    onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                                    className={inputClasses}
                                    placeholder="Your Name"
                                    required
                                />
                            </div>

                            {/* Roll Number */}
                            <div>
                                <label className={labelClasses}>Roll Number</label>
                                <input
                                    type="text"
                                    value={profile.rollNumber}
                                    onChange={(e) => setProfile({ ...profile, rollNumber: e.target.value })}
                                    className={inputClasses}
                                    placeholder="e.g., 21R11A05B6"
                                />
                            </div>

                            {/* Branch */}
                            <div>
                                <label className={labelClasses}>Branch</label>
                                <div className="relative">
                                    <select
                                        value={profile.branch}
                                        onChange={(e) => setProfile({ ...profile, branch: e.target.value })}
                                        className={`${inputClasses} appearance-none cursor-pointer`}
                                        required
                                    >
                                        {BRANCHES.map(branch => (
                                            <option key={branch.value} value={branch.value} className="bg-[#0f172a]">
                                                {branch.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Year */}
                            <div>
                                <label className={labelClasses}>Year</label>
                                <div className="relative">
                                    <select
                                        value={profile.year}
                                        onChange={(e) => setProfile({ ...profile, year: parseInt(e.target.value) })}
                                        className={`${inputClasses} appearance-none cursor-pointer`}
                                        required
                                    >
                                        <option value="1" className="bg-[#0f172a]">1st Year</option>
                                        <option value="2" className="bg-[#0f172a]">2nd Year</option>
                                        <option value="3" className="bg-[#0f172a]">3rd Year</option>
                                        <option value="4" className="bg-[#0f172a]">4th Year</option>
                                    </select>
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="md:col-span-2">
                                <label className={labelClasses}>Bio (Optional)</label>
                                <textarea
                                    value={profile.bio}
                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                    rows={4}
                                    placeholder="Tell us about yourself..."
                                    className={inputClasses}
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/10">
                            <button
                                type="button"
                                onClick={() => router.push('/profile')}
                                className="px-6 py-3 rounded-xl font-bold text-blue-200 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>Saving Changes...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-5 w-5" />
                                        <span>Save Profile</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
