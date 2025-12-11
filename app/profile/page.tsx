import { getProfile, getFavoriteResources, getRecentlyViewedResources } from '@/lib/actions/profile';
import { User, BookMarked, Clock, Download as DownloadIcon, Edit } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-6">
                            {/* Profile Picture */}
                            <div className="relative">
                                {profile.profile.photoURL ? (
                                    <img
                                        src={profile.profile.photoURL}
                                        alt={profile.profile.displayName}
                                        className="w-24 h-24 rounded-full object-cover border-4 border-blue-200"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center border-4 border-blue-200">
                                        <User className="h-12 w-12 text-white" />
                                    </div>
                                )}
                            </div>

                            {/* Profile Info */}
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                                    {profile.profile.displayName}
                                </h1>
                                <p className="text-gray-600 mb-2">{profile.email}</p>
                                {profile.profile.rollNumber && (
                                    <p className="text-sm font-semibold text-blue-600 mb-1">
                                        Roll No: {profile.profile.rollNumber}
                                    </p>
                                )}
                                <p className="text-sm text-gray-600">
                                    Year {profile.profile.year} • {getBranchLabel(profile.profile.branch)}
                                </p>
                                {profile.profile.bio && (
                                    <p className="text-sm text-gray-700 mt-3 max-w-md">
                                        {profile.profile.bio}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Edit Button */}
                        <Link href="/profile/edit">
                            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                                <Edit className="h-4 w-4" />
                                <span>Edit Profile</span>
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Favorites Section */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex items-center space-x-2 mb-4">
                        <BookMarked className="h-6 w-6 text-blue-600" />
                        <h2 className="text-xl font-bold text-gray-900">
                            Favorites ({favorites.length})
                        </h2>
                    </div>

                    {favorites.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {favorites.map((resource) => (
                                <a
                                    key={resource.id}
                                    href={resource.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
                                >
                                    <h3 className="font-semibold text-gray-900 mb-1">{resource.title}</h3>
                                    <p className="text-sm text-gray-600">
                                        {resource.subjectCode} • {resource.documentType}
                                    </p>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">
                            No favorites yet. Bookmark resources from the dashboard!
                        </p>
                    )}
                </div>

                {/* Recently Viewed Section */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center space-x-2 mb-4">
                        <Clock className="h-6 w-6 text-blue-600" />
                        <h2 className="text-xl font-bold text-gray-900">
                            Recently Viewed ({recentlyViewed.length})
                        </h2>
                    </div>

                    {recentlyViewed.length > 0 ? (
                        <div className="space-y-3">
                            {recentlyViewed.map((resource) => (
                                <a
                                    key={resource.id}
                                    href={resource.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
                                >
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                                        <p className="text-sm text-gray-600">
                                            {resource.subjectCode} • {resource.documentType}
                                        </p>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {resource.fileType}
                                    </span>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">
                            No recently viewed resources yet.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
