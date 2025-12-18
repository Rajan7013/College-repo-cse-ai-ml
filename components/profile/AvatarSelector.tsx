'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';

interface Avatar {
    id: string;
    emoji: string;
    label: string;
    gradient: string;
}

const AVATARS: Avatar[] = [
    // Boys
    { id: 'boy-1', emoji: '👨‍🎓', label: 'Student Boy 1', gradient: 'from-blue-500 to-cyan-500' },
    { id: 'boy-2', emoji: '👨‍💻', label: 'Tech Boy', gradient: 'from-indigo-500 to-blue-500' },
    { id: 'boy-3', emoji: '👨‍🔬', label: 'Scientist Boy', gradient: 'from-violet-500 to-purple-500' },
    { id: 'boy-4', emoji: '🧑‍💼', label: 'Professional Boy', gradient: 'from-blue-600 to-indigo-600' },

    // Girls
    { id: 'girl-1', emoji: '👩‍🎓', label: 'Student Girl 1', gradient: 'from-pink-500 to-rose-500' },
    { id: 'girl-2', emoji: '👩‍💻', label: 'Tech Girl', gradient: 'from-purple-500 to-pink-500' },
    { id: 'girl-3', emoji: '👩‍🔬', label: 'Scientist Girl', gradient: 'from-rose-500 to-pink-500' },
    { id: 'girl-4', emoji: '👩‍💼', label: 'Professional Girl', gradient: 'from-pink-600 to-purple-600' },

    // Admin/Faculty
    { id: 'admin-1', emoji: '👨‍🏫', label: 'Male Professor', gradient: 'from-amber-500 to-orange-500' },
    { id: 'admin-2', emoji: '👩‍🏫', label: 'Female Professor', gradient: 'from-orange-500 to-red-500' },
    { id: 'admin-3', emoji: '🧑‍🏫', label: 'Faculty', gradient: 'from-yellow-500 to-amber-500' },

    // Additional
    { id: 'neutral-1', emoji: '🧑‍🎓', label: 'Student', gradient: 'from-emerald-500 to-green-500' },
    { id: 'neutral-2', emoji: '🧑‍💻', label: 'Developer', gradient: 'from-cyan-500 to-teal-500' },
    { id: 'neutral-3', emoji: '🤓', label: 'Nerd', gradient: 'from-slate-500 to-gray-500' },
    { id: 'star', emoji: '⭐', label: 'Star Student', gradient: 'from-yellow-400 to-amber-400' },
    { id: 'robot', emoji: '🤖', label: 'AI Enthusiast', gradient: 'from-blue-400 to-cyan-400' },
];

interface AvatarSelectorProps {
    selectedAvatar?: string;
    onSelect: (avatar: Avatar) => void;
}

export default function AvatarSelector({ selectedAvatar, onSelect }: AvatarSelectorProps) {
    const [selected, setSelected] = useState(selectedAvatar || AVATARS[0].id);

    const handleSelect = (avatar: Avatar) => {
        setSelected(avatar.id);
        onSelect(avatar);
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold text-white mb-2">Choose Your Avatar</h3>
                <p className="text-sm text-blue-200">Select an avatar that represents you</p>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {AVATARS.map((avatar) => {
                    const isSelected = selected === avatar.id;

                    return (
                        <button
                            key={avatar.id}
                            onClick={() => handleSelect(avatar)}
                            className={`group relative aspect-square rounded-2xl transition-all duration-300 ${isSelected
                                    ? 'scale-110 ring-4 ring-white/50 shadow-2xl'
                                    : 'hover:scale-105 hover:shadow-xl'
                                }`}
                            title={avatar.label}
                        >
                            {/* Gradient Background */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${avatar.gradient} rounded-2xl transition-all duration-300 ${isSelected ? 'opacity-100' : 'opacity-70 group-hover:opacity-90'
                                }`}></div>

                            {/* Emoji */}
                            <div className="absolute inset-0 flex items-center justify-center text-4xl transform group-hover:scale-110 transition-transform">
                                {avatar.emoji}
                            </div>

                            {/* Selected Checkmark */}
                            {isSelected && (
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg animate-bounce">
                                    <Check className="h-4 w-4 text-blue-600" />
                                </div>
                            )}

                            {/* Hover Glow */}
                            <div className={`absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity ${isSelected ? 'opacity-30' : ''
                                }`}></div>
                        </button>
                    );
                })}
            </div>

            {/* Selected Avatar Preview */}
            <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className={`w-16 h-16 bg-gradient-to-br ${AVATARS.find(a => a.id === selected)?.gradient} rounded-2xl flex items-center justify-center text-4xl shadow-lg`}>
                    {AVATARS.find(a => a.id === selected)?.emoji}
                </div>
                <div>
                    <p className="text-sm text-blue-200">Selected Avatar</p>
                    <p className="font-bold text-white">{AVATARS.find(a => a.id === selected)?.label}</p>
                </div>
            </div>
        </div>
    );
}

export { AVATARS };
export type { Avatar };
