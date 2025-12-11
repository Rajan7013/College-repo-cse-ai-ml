'use client';

import { useState, useEffect } from 'react';
import { getProfile, updateProfile, uploadProfilePicture, type Profile } from '@/lib/actions/profile';
import { User, Loader2, Upload, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

const BRANCHES = [
    { value: 'CSE_AI_ML', label: 'CSE (AI & ML)' },
    { value: 'CSE', label: 'Computer Science' },
    { value: 'ECE', label: 'Electronics & Communication' },
    { value: 'EEE', label: 'Electrical & Electronics' },
    { value: 'MECH', label: 'Mechanical' },
    { value: 'CIVIL', label: 'Civil' },
];

export default function EditProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
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

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingPhoto(true);
        setMessage(null);

        const formData = new FormData();
        formData.append('photo', file);

        const result = await uploadProfilePicture(formData);

        if (result.success && result.photoURL) {
            setProfile({ ...profile, photoURL: result.photoURL });
            setMessage({ type: 'success', text: 'Profile picture uploaded!' });
        } else {
            setMessage({ type: 'error', text: result.message });
        }

        setUploadingPhoto(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        const result = await updateProfile(profile);

        if (result.success) {
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setTimeout(() => {
                router.push('/profile');
            }, 1500);
        } else {
            setMessage({ type: 'error', text: result.message });
        }

        setSaving(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Profile</h1>

                    {/* Message */}
                    {message && (
                        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Profile Picture */}
                        <div className="flex items-center space-x-6">
                            <div className="relative">
                                {profile.photoURL ? (
                                    <img
                                        src={profile.photoURL}
                                        alt="Profile"
                                        className="w-24 h-24 rounded-full object-cover border-4 border-blue-200"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center border-4 border-blue-200">
                                        <User className="h-12 w-12 text-white" />
                                    </div>
                                )}
                                {uploadingPhoto && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                                        <Loader2 className="h-8 w-8 text-white animate-spin" />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        className="hidden"
                                        disabled={uploadingPhoto}
                                    />
                                    <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-700 transition-colors">
                                        <Upload className="h-4 w-4" />
                                        <span>Upload Photo</span>
                                    </div>
                                </label>
                                <p className="text-xs text-gray-500 mt-1">Max 5MB, JPG/PNG</p>
                            </div>
                        </div>

                        {/* Display Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Display Name *
                            </label>
                            <input
                                type="text"
                                value={profile.displayName}
                                onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                required
                            />
                        </div>

                        {/* Roll Number */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Roll Number
                            </label>
                            <input
                                type="text"
                                value={profile.rollNumber}
                                onChange={(e) => setProfile({ ...profile, rollNumber: e.target.value })}
                                placeholder="e.g., 21R11A05B6"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            />
                        </div>

                        {/* Year & Branch */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Year *
                                </label>
                                <select
                                    value={profile.year}
                                    onChange={(e) => setProfile({ ...profile, year: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                    required
                                >
                                    <option value="1">1st Year</option>
                                    <option value="2">2nd Year</option>
                                    <option value="3">3rd Year</option>
                                    <option value="4">4th Year</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Branch *
                                </label>
                                <select
                                    value={profile.branch}
                                    onChange={(e) => setProfile({ ...profile, branch: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                    required
                                >
                                    {BRANCHES.map(branch => (
                                        <option key={branch.value} value={branch.value}>
                                            {branch.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Bio (Optional)
                            </label>
                            <textarea
                                value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                rows={3}
                                placeholder="Tell us about yourself..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-5 w-5" />
                                        <span>Save Changes</span>
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => router.push('/profile')}
                                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
