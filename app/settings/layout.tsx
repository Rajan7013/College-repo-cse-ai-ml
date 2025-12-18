import { Settings as SettingsIcon } from 'lucide-react';
import SettingsSidebar from '@/components/settings/SettingsSidebar';

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="glass-card p-6 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl">
                            <SettingsIcon className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-white">Settings</h1>
                            <p className="text-blue-200">Manage your account and preferences</p>
                        </div>
                    </div>
                </div>

                {/* Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <aside className="lg:col-span-1">
                        <SettingsSidebar />
                    </aside>
                    <main className="lg:col-span-3">
                        <div className="glass-card p-8">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
