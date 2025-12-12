import { getAdminStats } from '@/lib/actions/admin';
import { getUserRole } from '@/lib/actions/resources';
import { redirect } from 'next/navigation';
import { BarChart3, Users, FileText, Upload, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';

import DeleteButton from '@/components/DeleteButton';
import UserManagementTable from '@/components/UserManagementTable';

export const dynamic = 'force-dynamic';


export default async function AdminDashboardPage() {
    const userRole = await getUserRole();

    if (userRole !== 'admin') {
        redirect('/dashboard');
    }

    const stats = await getAdminStats();

    if (!stats) {
        return <div>Error loading stats</div>;
    }

    const getBranchLabel = (branch: string) => {
        const labels: Record<string, string> = {
            'CSE_AI_ML': 'CSE (AI & ML)',
            'CSE': 'CSE',
            'ECE': 'ECE',
            'EEE': 'EEE',
            'MECH': 'MECH',
            'CIVIL': 'CIVIL'
        };
        return labels[branch] || branch;
    };

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                    <p className="text-gray-600">Overview of your academic resource repository</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Resources */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <FileText className="h-8 w-8 text-blue-600" />
                            </div>
                            <TrendingUp className="h-5 w-5 text-green-500" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            {stats.totalResources}
                        </h3>
                        <p className="text-sm text-gray-600">Total Resources</p>
                    </div>

                    {/* Total Users */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <Users className="h-8 w-8 text-green-600" />
                            </div>
                            <TrendingUp className="h-5 w-5 text-green-500" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            {stats.totalUsers}
                        </h3>
                        <p className="text-sm text-gray-600">Registered Users</p>
                    </div>

                    {/* Document Types */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <BarChart3 className="h-8 w-8 text-purple-600" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            {Object.keys(stats.resourcesByType).length}
                        </h3>
                        <p className="text-sm text-gray-600">Document Types</p>
                    </div>

                    {/* Quick Upload */}
                    <Link href="/admin/upload">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                                    <Upload className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-1">
                                Upload
                            </h3>
                            <p className="text-sm text-blue-100">Add New Resource</p>
                        </div>
                    </Link>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Resources by Type */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                            <BarChart3 className="h-5 w-5 text-blue-600" />
                            <span>Resources by Document Type</span>
                        </h2>
                        <div className="space-y-3">
                            {Object.entries(stats.resourcesByType)
                                .sort(([, a], [, b]) => b - a)
                                .slice(0, 6)
                                .map(([type, count]) => {
                                    const percentage = (count / stats.totalResources) * 100;
                                    return (
                                        <div key={type}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-700 font-medium">{type}</span>
                                                <span className="text-gray-900 font-bold">{count}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>

                    {/* Resources by Regulation */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                            <BarChart3 className="h-5 w-5 text-green-600" />
                            <span>Resources by Regulation</span>
                        </h2>
                        <div className="space-y-3">
                            {Object.entries(stats.resourcesByRegulation)
                                .sort(([, a], [, b]) => b - a)
                                .map(([regulation, count]) => {
                                    const percentage = (count / stats.totalResources) * 100;
                                    return (
                                        <div key={regulation}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-700 font-medium">{regulation}</span>
                                                <span className="text-gray-900 font-bold">{count}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-green-600 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>

                {/* Resources by Branch */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                        <BarChart3 className="h-5 w-5 text-purple-600" />
                        <span>Resources by Branch</span>
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {Object.entries(stats.resourcesByBranch)
                            .sort(([, a], [, b]) => b - a)
                            .map(([branch, count]) => (
                                <div key={branch} className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                                    <p className="text-sm text-gray-600 mt-1">{getBranchLabel(branch)}</p>
                                </div>
                            ))}
                    </div>
                </div>

                {/* User Management */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                        <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span>User Management</span>
                    </h2>
                    <UserManagementTable />
                </div>

                {/* Recent Uploads */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-orange-600" />
                        <span>Recent Uploads</span>
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Title</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Regulation</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Uploaded</th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentResources.map((resource) => (
                                    <tr key={resource.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm text-gray-900">{resource.title}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{resource.documentType}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{resource.regulation}</td>
                                        <td className="py-3 px-4 text-sm text-gray-500">
                                            {new Date(resource.uploadedAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-center space-x-2">
                                                <a
                                                    href={resource.fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="View"
                                                >
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </a>
                                                <DeleteButton resourceId={resource.id} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
