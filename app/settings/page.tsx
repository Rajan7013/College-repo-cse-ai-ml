import { Key, Bell, Trash2 } from 'lucide-react';

export default function AccountSettingsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-black text-white mb-2">Account Settings</h2>
                <p className="text-blue-200">Manage your account preferences and security</p>
            </div>

            {/* Change Password */}
            <div className="glass-card p-6 hover:bg-white/10 transition-all">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                        <Key className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">Change Password</h3>
                        <p className="text-blue-200 mb-4">Update your password to keep your account secure</p>
                        <button className="btn-gradient px-6 py-3 rounded-xl font-bold">
                            Update Password
                        </button>
                        <p className="text-sm text-blue-300 mt-3">⚠️ Coming Soon</p>
                    </div>
                </div>
            </div>

            {/* Notification Preferences */}
            <div className="glass-card p-6 hover:bg-white/10 transition-all">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                        <Bell className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">Notification Preferences</h3>
                        <p className="text-blue-200 mb-4">Control how you receive notifications</p>
                        <button className="btn-gradient px-6 py-3 rounded-xl font-bold">
                            Manage Notifications
                        </button>
                        <p className="text-sm text-blue-300 mt-3">⚠️ Coming Soon</p>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="glass-card p-6 border-2 border-red-500/30 hover:border-red-500/50 transition-all">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl flex items-center justify-center">
                        <Trash2 className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-red-300 mb-2">Danger Zone</h3>
                        <p className="text-blue-200 mb-4">Permanently delete your account and all data</p>
                        <button className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold rounded-xl border-2 border-red-500/30 hover:border-red-500/50 transition-all">
                            Delete Account
                        </button>
                        <p className="text-sm text-red-300 mt-3">⚠️ This action cannot be undone</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
