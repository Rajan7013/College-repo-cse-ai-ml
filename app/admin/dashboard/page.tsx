import { getAdminStats } from '@/lib/actions/admin';
import { getUserRole } from '@/lib/actions/resources';
import { redirect } from 'next/navigation';
import { BarChart3, Users, FileText, Upload, TrendingUp, Clock, ShieldCheck, GraduationCap } from 'lucide-react';
import Link from 'next/link';

import DeleteButton from '@/components/DeleteButton';
import UserManagementTable from '@/components/UserManagementTable';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import UserRoleManager from '@/components/admin/UserRoleManager';

export const dynamic = 'force-dynamic';


export default async function AdminDashboardPage() {
    const userRole = await getUserRole();

    if (userRole !== 'admin') {
        redirect('/dashboard');
    }

    const stats = await getAdminStats();

    if (!stats) {
        return <div className="p-8 text-white">Error loading stats</div>;
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
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 md:mb-12 glass-card p-6 md:p-8 bg-gradient-to-r from-blue-900/40 to-slate-900/40">
                    <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                        <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30 shrink-0">
                            <ShieldCheck className="h-8 w-8 md:h-10 md:w-10 text-cyan-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">Admin Dashboard</h1>
                            <p className="text-blue-200 text-sm md:text-base">Overview of your academic resource repository</p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                    {/* Total Resources */}
                    <div className="glass-card p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <FileText className="h-16 w-16 text-blue-400" />
                        </div>
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
                                <FileText className="h-6 w-6 md:h-8 md:w-8 text-cyan-400" />
                            </div>
                            <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                                <TrendingUp className="h-3 w-3" />
                                +12%
                            </span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black text-white mb-1 relative z-10">
                            {stats.totalResources}
                        </h3>
                        <p className="text-sm text-blue-300 relative z-10">Total Resources</p>
                    </div>

                    {/* Total Users */}
                    <div className="glass-card p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Users className="h-16 w-16 text-emerald-400" />
                        </div>
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
                                <Users className="h-6 w-6 md:h-8 md:w-8 text-emerald-400" />
                            </div>
                            <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                                <TrendingUp className="h-3 w-3" />
                                +5%
                            </span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black text-white mb-1 relative z-10">
                            {stats.totalUsers}
                        </h3>
                        <p className="text-sm text-blue-300 relative z-10">Registered Users</p>
                    </div>

                    {/* Quick Upload */}
                    <Link href="/admin/upload">
                        <div className="btn-gradient p-6 rounded-xl shadow-lg h-full flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity"></div>
                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                    <Upload className="h-6 w-6 md:h-8 md:w-8 text-white" />
                                </div>
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-xl md:text-2xl font-black text-white mb-1">
                                    Upload
                                </h3>
                                <p className="text-xs md:text-sm text-blue-100 font-medium">Add New Resource</p>
                            </div>
                        </div>
                    </Link>

                    {/* Curriculum Manager */}
                    <Link href="/admin/curriculum">
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-6 rounded-xl shadow-lg h-full flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer relative overflow-hidden border border-white/10">
                            <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity"></div>
                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                    <GraduationCap className="h-6 w-6 md:h-8 md:w-8 text-white" />
                                </div>
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-xl md:text-2xl font-black text-white mb-1">
                                    Curriculum
                                </h3>
                                <p className="text-xs md:text-sm text-indigo-100 font-medium">Manage Subjects</p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Analytics Section */}
                <div className="glass-card p-4 md:p-6 mb-8 overflow-hidden">
                    <h2 className="text-lg md:text-xl font-bold text-white mb-6 flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5 text-purple-400" />
                        <span>Behavior Analytics</span>
                    </h2>
                    <div className="overflow-x-auto pb-2">
                        <div className="min-w-[600px]">
                            <AnalyticsDashboard />
                        </div>
                    </div>
                </div>

                {/* Role Management */}
                <div className="glass-card p-4 md:p-6 mb-8">
                    <h2 className="text-lg md:text-xl font-bold text-white mb-6 flex items-center space-x-2">
                        <ShieldCheck className="h-5 w-5 text-emerald-400" />
                        <span>Role Management</span>
                    </h2>
                    <div className="overflow-x-auto pb-2">
                        <UserRoleManager />
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Resources by Type */}
                    <div className="glass-card p-4 md:p-6">
                        <h2 className="text-lg md:text-xl font-bold text-white mb-6 flex items-center space-x-2">
                            <BarChart3 className="h-5 w-5 text-cyan-400" />
                            <span>Resources by Document Type</span>
                        </h2>
                        <div className="space-y-4">
                            {Object.entries(stats.resourcesByType)
                                .sort(([, a], [, b]) => b - a)
                                .slice(0, 6)
                                .map(([type, count]) => {
                                    const percentage = (count / stats.totalResources) * 100;
                                    return (
                                        <div key={type}>
                                            <div className="flex justify-between text-xs md:text-sm mb-2">
                                                <span className="text-blue-200 font-medium">{type}</span>
                                                <span className="text-white font-bold">{count}</span>
                                            </div>
                                            <div className="w-full bg-blue-900/40 rounded-full h-2">
                                                <div
                                                    className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>

                    {/* Resources by Regulation */}
                    <div className="glass-card p-4 md:p-6">
                        <h2 className="text-lg md:text-xl font-bold text-white mb-6 flex items-center space-x-2">
                            <BarChart3 className="h-5 w-5 text-emerald-400" />
                            <span>Resources by Regulation</span>
                        </h2>
                        <div className="space-y-4">
                            {Object.entries(stats.resourcesByRegulation)
                                .sort(([, a], [, b]) => b - a)
                                .map(([regulation, count]) => {
                                    const percentage = (count / stats.totalResources) * 100;
                                    return (
                                        <div key={regulation}>
                                            <div className="flex justify-between text-xs md:text-sm mb-2">
                                                <span className="text-blue-200 font-medium">{regulation}</span>
                                                <span className="text-white font-bold">{count}</span>
                                            </div>
                                            <div className="w-full bg-blue-900/40 rounded-full h-2">
                                                <div
                                                    className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
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
                <div className="glass-card p-4 md:p-6 mb-8">
                    <h2 className="text-lg md:text-xl font-bold text-white mb-6 flex items-center space-x-2">
                        <BarChart3 className="h-5 w-5 text-purple-400" />
                        <span>Resources by Branch</span>
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                        {Object.entries(stats.resourcesByBranch)
                            .sort(([, a], [, b]) => b - a)
                            .map(([branch, count]) => (
                                <div key={branch} className="text-center p-3 md:p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                                    <p className="text-2xl md:text-3xl font-black text-white mb-1">{count}</p>
                                    <p className="text-[10px] md:text-xs text-blue-300 font-bold uppercase tracking-wider">{getBranchLabel(branch)}</p>
                                </div>
                            ))}
                    </div>
                </div>

                {/* User Management */}
                <div className="glass-card p-6 mb-8">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                        <Users className="h-5 w-5 text-cyan-400" />
                        <span>Registered Users</span>
                    </h2>
                    <UserManagementTable />
                </div>

                {/* Recent Uploads */}
                <div className="glass-card p-6">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-orange-400" />
                        <span>Recent Uploads</span>
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-blue-500/20">
                                    <th className="text-left py-4 px-4 text-xs font-bold text-blue-300 uppercase tracking-wider">Title</th>
                                    <th className="text-left py-4 px-4 text-xs font-bold text-blue-300 uppercase tracking-wider">Type</th>
                                    <th className="text-left py-4 px-4 text-xs font-bold text-blue-300 uppercase tracking-wider">Regulation</th>
                                    <th className="text-left py-4 px-4 text-xs font-bold text-blue-300 uppercase tracking-wider">Uploaded</th>
                                    <th className="text-center py-4 px-4 text-xs font-bold text-blue-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-blue-500/10">
                                {stats.recentResources.map((resource) => (
                                    <tr key={resource.id} className="hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-4 text-sm text-white font-medium">{resource.title}</td>
                                        <td className="py-4 px-4 text-sm text-blue-200">
                                            <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-lg text-xs font-bold border border-blue-500/30">
                                                {resource.documentType}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-blue-200">{resource.regulation}</td>
                                        <td className="py-4 px-4 text-sm text-blue-200">
                                            {new Date(resource.uploadedAt).toLocaleString().split(',')[0]}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-center space-x-2">
                                                <a
                                                    href={resource.fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-colors"
                                                    title="View"
                                                >
                                                    <div className="h-4 w-4">
                                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </div>
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
