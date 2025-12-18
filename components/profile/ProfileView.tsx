'use client';

import { useState } from 'react';
import { UserProfile } from '@/lib/types/profile';
import {
    User,
    GraduationCap,
    Phone,
    Target,
    Code,
    Award,
    Edit,
    Save,
    X,
    Sparkles
} from 'lucide-react';
import PersonalTab from './tabs/PersonalTab';
import AcademicTab from './tabs/AcademicTab';
import ContactTab from './tabs/ContactTab';
import GoalsTab from './tabs/GoalsTab';
import SkillsTab from './tabs/SkillsTab';
import AwardsTab from './tabs/AwardsTab';
import AvatarSelector, { AVATARS } from './AvatarSelector';

interface ProfileViewProps {
    initialProfile: UserProfile | null;
}

export default function ProfileView({ initialProfile }: ProfileViewProps) {
    const [activeTab, setActiveTab] = useState('personal');
    const [isEditing, setIsEditing] = useState(!initialProfile);
    const [showAvatarSelector, setShowAvatarSelector] = useState(false);
    const [selectedAvatarId, setSelectedAvatarId] = useState(initialProfile?.profilePhoto || 'boy-1');

    const tabs = [
        { id: 'personal', label: 'Personal', icon: User },
        { id: 'academic', label: 'Academic', icon: GraduationCap },
        { id: 'contact', label: 'Contact', icon: Phone },
        { id: 'goals', label: 'Goals', icon: Target },
        { id: 'skills', label: 'Skills', icon: Code },
        { id: 'awards', label: 'Awards', icon: Award },
    ];

    const currentAvatar = AVATARS.find(a => a.id === selectedAvatarId) || AVATARS[0];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0A1628] via-[#1e3a8a] to-[#3b82f6] py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header Card */}
                <div className="relative bg-blue-900/30 backdrop-blur-md rounded-3xl p-8 mb-6 border border-blue-400/20 shadow-2xl shadow-blue-500/20 overflow-hidden group">
                    {/* Animated Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            <button
                                onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                                className="group/avatar relative cursor-pointer"
                            >
                                <div className={`w-28 h-28 bg-gradient-to-br ${currentAvatar.gradient} rounded-3xl flex items-center justify-center text-6xl shadow-2xl transform transition-all duration-300 hover:scale-110 hover:rotate-3 border-4 border-white/20`}>
                                    {currentAvatar.emoji}
                                </div>
                                {isEditing && (
                                    <div className="absolute inset-0 bg-black/50 rounded-3xl flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                                        <Edit className="h-6 w-6 text-white" />
                                    </div>
                                )}
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white/30">
                                    <Sparkles className="h-5 w-5 text-white" />
                                </div>
                            </button>
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-4xl font-black text-white mb-2">
                                {initialProfile?.fullName || 'Complete Your Profile'}
                            </h1>
                            {initialProfile?.rollNumber && (
                                <p className="text-sm font-semibold text-cyan-300 mb-2 inline-flex items-center gap-2">
                                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                                    Roll No: {initialProfile.rollNumber}
                                </p>
                            )}
                            {initialProfile?.course && initialProfile?.yearOfStudy && (
                                <p className="text-blue-200">
                                    Year {initialProfile.yearOfStudy} • {initialProfile.course}
                                </p>
                            )}
                        </div>

                        {/* Edit Toggle Button */}
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`relative px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all duration-300 transform hover:scale-105 ${isEditing
                                    ? 'bg-white/10 hover:bg-white/15 text-white border-2 border-white/20'
                                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white shadow-xl shadow-blue-500/50'
                                }`}
                        >
                            {isEditing ? (
                                <>
                                    <X className="h-5 w-5" />
                                    Cancel
                                </>
                            ) : (
                                <>
                                    <Edit className="h-5 w-5" />
                                    Edit Profile
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Avatar Selector Modal */}
                {showAvatarSelector && isEditing && (
                    <div className="bg-blue-900/30 backdrop-blur-md rounded-3xl p-8 mb-6 border border-blue-400/20 shadow-2xl shadow-blue-500/20">
                        <AvatarSelector
                            selectedAvatar={selectedAvatarId}
                            onSelect={(avatar) => {
                                setSelectedAvatarId(avatar.id);
                                setShowAvatarSelector(false);
                            }}
                        />
                    </div>
                )}

                {/* Tabs Card */}
                <div className="bg-blue-900/30 backdrop-blur-md rounded-3xl overflow-hidden border border-blue-400/20 shadow-2xl shadow-blue-500/20">
                    {/* Tab Navigation */}
                    <div className="border-b border-blue-400/20 bg-blue-900/20 px-6 py-4 overflow-x-auto">
                        <div className="flex gap-2 min-w-max">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`relative px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-3 group ${isActive
                                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50 scale-105'
                                                : 'bg-white/5 text-blue-200 hover:bg-white/10 hover:text-white'
                                            }`}
                                    >
                                        <Icon className={`h-5 w-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                        {tab.label}
                                        {isActive && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 animate-shimmer"></div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-8">
                        {activeTab === 'personal' && (
                            <PersonalTab profile={initialProfile} isEditing={isEditing} />
                        )}
                        {activeTab === 'academic' && (
                            <AcademicTab profile={initialProfile} isEditing={isEditing} />
                        )}
                        {activeTab === 'contact' && (
                            <ContactTab profile={initialProfile} isEditing={isEditing} />
                        )}
                        {activeTab === 'goals' && (
                            <GoalsTab profile={initialProfile} isEditing={isEditing} />
                        )}
                        {activeTab === 'skills' && (
                            <SkillsTab profile={initialProfile} isEditing={isEditing} />
                        )}
                        {activeTab === 'awards' && (
                            <AwardsTab profile={initialProfile} isEditing={isEditing} />
                        )}
                    </div>
                </div>
            </div>

            {/* Custom Shimmer Animation */}
            <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
        </div>
    );
}
