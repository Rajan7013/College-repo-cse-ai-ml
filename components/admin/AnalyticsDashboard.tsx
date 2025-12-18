'use client';

import { useState, useEffect } from 'react';
import { getAnalyticsStats } from '@/lib/actions/analytics';
import { Eye, Search, TrendingUp, User, FileText } from 'lucide-react';

export default function AnalyticsDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            const data = await getAnalyticsStats();
            setStats(data.stats);
            setLoading(false);
        }
        fetchStats();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-blue-300">Loading analytics...</div>;
    }

    if (!stats) return null;

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/40 p-5 rounded-xl border border-blue-500/20 flex items-center justify-between">
                    <div>
                        <p className="text-blue-300 text-sm font-medium mb-1">Total Resource Views</p>
                        <h3 className="text-3xl font-black text-white">{stats.totalViews}</h3>
                    </div>
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                        <Eye className="h-6 w-6 text-blue-400" />
                    </div>
                </div>

                <div className="bg-slate-900/40 p-5 rounded-xl border border-blue-500/20 flex items-center justify-between">
                    <div>
                        <p className="text-blue-300 text-sm font-medium mb-1">Total Search Queries</p>
                        <h3 className="text-3xl font-black text-white">{stats.totalSearches}</h3>
                    </div>
                    <div className="p-3 bg-purple-500/20 rounded-lg">
                        <Search className="h-6 w-6 text-purple-400" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Resources */}
                <div className="bg-slate-900/40 p-6 rounded-xl border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-emerald-400" />
                        Most Viewed Resources
                    </h3>
                    <div className="space-y-3">
                        {stats.topResources.length === 0 ? (
                            <p className="text-slate-500 text-sm">No data yet</p>
                        ) : (
                            stats.topResources.map((res: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs text-emerald-400 font-bold">
                                            {idx + 1}
                                        </div>
                                        <span className="text-sm text-blue-100 truncate">{res.title}</span>
                                    </div>
                                    <span className="text-xs font-bold bg-slate-800 px-2 py-1 rounded text-slate-300">
                                        {res.count} views
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Active Students */}
                <div className="bg-slate-900/40 p-6 rounded-xl border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <User className="h-5 w-5 text-orange-400" />
                        Most Active Students
                    </h3>
                    <div className="space-y-3">
                        {stats.activeStudents.length === 0 ? (
                            <p className="text-slate-500 text-sm">No data yet</p>
                        ) : (
                            stats.activeStudents.map((usr: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs text-white uppercase">
                                            {usr.email[0]}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm text-blue-100 font-medium truncate">{usr.email.split('@')[0]}</span>
                                            <span className="text-[10px] text-slate-400 truncate">{usr.email}</span>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold bg-slate-800 px-2 py-1 rounded text-slate-300">
                                        {usr.count} actions
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
