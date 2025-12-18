'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, Users, ChevronRight, ShieldCheck, Library } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Lazy load heavy components
const AnimatedCounter = dynamic(() => import('@/components/AnimatedCounter'), { ssr: false });
const HeroImageCarousel = dynamic(() => import('@/components/HeroImageCarousel'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 animate-pulse" />
});

export default function HomePage() {
    const { user, isLoaded } = useUser();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const features = [
        {
            title: "Precision Filtering",
            desc: "Drill down by Regulation, Year, Branch, and Subject Code instantly.",
            image: "/feature-filter.png",
            color: "border-blue-100"
        },
        {
            title: "High-Speed Access",
            desc: "Optimized Cloudflare R2 storage ensures milliseconds latency.",
            image: "/feature-speed.png",
            color: "border-indigo-100"
        },
        {
            title: "Quality Assurance",
            desc: "Every resource is verified by faculty admins before publishing.",
            image: "/feature-qa.png",
            color: "border-emerald-100"
        },
        {
            title: "Exam Readiness",
            desc: "Dedicated sections for Previous Question Papers (Mid & End Sem).",
            image: "/feature-exam.png",
            color: "border-amber-100"
        },
        {
            title: "Comprehensive Coverage",
            desc: "From Notes to Lab Manuals, everything is organized and indexed.",
            image: "/feature-coverage.png",
            color: "border-violet-100"
        },
        {
            title: "Collaborative Growth",
            desc: "A unified platform connecting Students, Faculty, and Administrators.",
            image: "/feature-growth.png",
            color: "border-teal-100"
        }
    ];

    // Show loading state while auth is loading
    if (!mounted || !isLoaded) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">

            {/* Decorative Background Elements - Simplified */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-40"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-3xl opacity-40"></div>
            </div>

            {/* Hero Section */}
            <section className="relative z-10 pt-8 pb-12 lg:pt-12 lg:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-6 lg:gap-8">

                {/* Hero Text - 40% */}
                <div className="flex-1 w-full lg:w-[40%] text-center lg:text-left space-y-6">
                    <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-blue-100 rounded-full px-4 py-1.5 mb-3 shadow-sm">
                        <span className="flex h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                        <span className="text-sm font-bold text-blue-700 tracking-wide uppercase">Department of CSE (AI & ML)</span>
                    </div>

                    <h1 className="text-2xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight whitespace-nowrap">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">Smart Learning</span> for AI & ML
                    </h1>

                    <p className="text-lg lg:text-xl text-slate-900 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                        Your complete academic hub for CSE (AI & ML). Access curated resources instantly.
                    </p>

                    {/* CTA Buttons - Client-side auth check */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                        {user ? (
                            <>
                                <Link href="/resources" className="w-full sm:w-auto">
                                    <button className="group relative w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-xl shadow-lg hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2">
                                        <Search className="h-5 w-5" />
                                        <span>Access Library</span>
                                        <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </Link>
                                <Link href="/admin/dashboard" className="w-full sm:w-auto">
                                    <button className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-base rounded-xl shadow-md border border-slate-200 hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2">
                                        <Users className="h-5 w-5 text-slate-500" />
                                        <span>My Dashboard</span>
                                    </button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <SignInButton mode="modal">
                                    <button className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                                        Student Login
                                    </button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <button className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-900 font-semibold text-base rounded-xl shadow-md border border-slate-200 hover:border-slate-300 hover:-translate-y-1 transition-all duration-300">
                                        Faculty Access
                                    </button>
                                </SignUpButton>
                            </>
                        )}
                    </div>

                    {!user && (
                        <p className="text-sm text-slate-500 font-medium">
                            * Institutional email required for faculty registration
                        </p>
                    )}
                </div>

                {/* Hero Image - 60% with Lazy Loading */}
                <div className="flex-1 w-full lg:w-[60%] relative px-2 lg:px-0">
                    <div className="relative w-full h-[350px] lg:h-[450px] rounded-xl overflow-hidden shadow-xl border border-slate-200/60">
                        <HeroImageCarousel />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/5 to-transparent pointer-events-none"></div>
                    </div>

                    {/* Floating Elements */}
                    <div className="absolute -bottom-3 -left-3 z-20 bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-slate-200/60 flex items-center gap-1.5 hidden lg:flex">
                        <div className="p-1.5 bg-green-50 rounded-md border border-green-100">
                            <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-[8px] text-slate-500 font-bold uppercase">Verified</p>
                            <p className="text-slate-900 font-extrabold text-[11px]">Curated</p>
                        </div>
                    </div>

                    <div className="absolute -top-3 -right-3 z-20 bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-slate-200/60 flex items-center gap-1.5 hidden lg:flex">
                        <div className="p-1.5 bg-orange-50 rounded-md border border-orange-100">
                            <Library className="h-3.5 w-3.5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-[8px] text-slate-500 font-bold uppercase">Resources</p>
                            <p className="text-slate-900 font-extrabold text-[11px]">5k+</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Video Section - Lazy Loaded */}
            <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <div className="max-w-full mx-auto">
                    <div className="text-center mb-6">
                        <div className="inline-block mb-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700 font-bold text-xs uppercase">
                            Platform Overview
                        </div>
                        <h2 className="text-2xl md:text-4xl font-bold mb-3">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">Experience EduNexus</span>
                        </h2>
                        <p className="text-sm text-slate-900 max-w-2xl mx-auto">
                            Watch how our platform revolutionizes academic resource management
                        </p>
                    </div>

                    <div className="relative w-full h-[300px] lg:h-[400px] rounded-2xl overflow-hidden shadow-2xl border-2 border-blue-200/50 bg-slate-900">
                        <video
                            className="w-full h-full object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="metadata"
                            loading="lazy"
                        >
                            <source src="/showcase-video.mp4" type="video/mp4" />
                        </video>
                    </div>
                </div>
            </section>

            {/* Stats Strip */}
            <div className="relative z-10 bg-slate-900 py-6 md:py-8">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    {[
                        { label: 'Active Students', value: 1200, suffix: '+' },
                        { label: 'Learning Resources', value: 5000, suffix: '+' },
                        { label: 'Faculty Members', value: 45, suffix: '+' },
                        { label: 'Success Rate', value: 98, suffix: '%' },
                    ].map((stat, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <span className="text-xl md:text-2xl font-extrabold text-white mb-1">
                                <AnimatedCounter end={stat.value} duration={2500} suffix={stat.suffix} />
                            </span>
                            <span className="text-[10px] text-blue-200 font-bold uppercase">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Features Section - Continue from original... */}
            {/* Rest of the page will continue similarly with optimizations */}
        </div>
    );
}
