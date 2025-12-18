'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, Shield, FileText, HelpCircle, Info, Mail, MessageSquare } from 'lucide-react';

export default function SettingsSidebar() {
    const pathname = usePathname();

    const links = [
        { href: '/settings', label: 'Account', icon: Settings },
        { href: '/settings/privacy', label: 'Privacy Policy', icon: Shield },
        { href: '/settings/terms', label: 'Terms of Service', icon: FileText },
        { href: '/settings/faqs', label: 'FAQs', icon: HelpCircle },
        { href: '/settings/about', label: 'About Us', icon: Info },
        { href: '/settings/contact', label: 'Contact', icon: Mail },
        { href: '/settings/feedback', label: 'Feedback', icon: MessageSquare },
    ];

    return (
        <nav className="glass-card p-4">
            <div className="space-y-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${isActive
                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50'
                                    : 'text-blue-200 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            <Icon className={`h-5 w-5 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                            {link.label}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
