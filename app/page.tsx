'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, ChevronRight, BookOpen, Rocket, Users, Zap, Shield, Award, GraduationCap, Sparkles, Star, ArrowRight, LayoutDashboard, FileText, Cpu, CheckCircle, Clock, Filter, Smartphone, Wifi } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import { getHomeStats, type HomeStats } from '@/lib/actions/stats';
import { useRouter } from 'next/navigation';
import AnimatedCounter from '@/components/AnimatedCounter';
import CustomCursor from '@/components/CustomCursor';
import StudentIllustration from '@/components/StudentIllustration';

export default function Home() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<HomeStats>({
    totalStudents: 120,
    totalResources: 500,
    totalProjects: 45,
    uptime: '99.9%',
  });

  useEffect(() => {
    setMounted(true);

    // Fetch real stats
    getHomeStats().then(setStats).catch(console.error);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/search');
    }
  };

  if (!mounted || !isLoaded) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-200/60 font-medium tracking-wide animate-pulse">Initializing EduNexus...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] overflow-x-hidden selection:bg-blue-500/30">
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Adjusted blobs for mobile: larger scale to ensure visibility */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] md:w-[40%] h-[80%] md:h-[40%] bg-blue-600/20 rounded-full blur-[80px] md:blur-[128px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] md:w-[40%] h-[80%] md:h-[40%] bg-violet-600/10 rounded-full blur-[80px] md:blur-[128px] animate-pulse delay-1000"></div>
        <div className="absolute top-[20%] right-[10%] w-[60%] md:w-[30%] h-[60%] md:h-[30%] bg-cyan-500/10 rounded-full blur-[60px] md:blur-[96px] animate-pulse delay-2000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center pt-8 pb-4 px-4 sm:px-6 lg:px-8 min-h-[60vh] md:min-h-[70vh]">
        {/* Abstract Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:2rem_2rem] md:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

        <div className="text-center max-w-7xl mx-auto relative w-full grid md:grid-cols-2 gap-8 items-center">
          {/* Left: Text Content */}
          <div className="text-center md:text-left">
            {/* Main Headline - FLUID TYPOGRAPHY */}
            <h1 className="font-black text-white mb-4 leading-[1.1] tracking-tight animate-fade-in text-[clamp(2rem,5vw+1rem,5rem)]">
              <span className="text-blue-400">Complete</span>{' '}
              <span className="text-cyan-400">Academic</span>{' '}
              <br className="hidden sm:block" />
              <span className="relative inline-block mt-1 md:mt-2">
                <span className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 blur-xl md:blur-2xl opacity-30"></span>
                <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 animate-shimmer bg-[length:200%_auto]">
                  Ecosystem
                </span>
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-sm md:text-lg text-blue-200/70 mb-6 md:mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed animate-fade-in animation-delay-200 px-4 md:px-0">
              Where faculty create, students learn, and administration monitors—all seamlessly connected in one platform. Access resources 24/7 from any device.
            </p>

            {/* Search Bar */}
            {user && (
              <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto md:mx-0 mb-6 animate-fade-in-up animation-delay-300">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-blue-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search notes, papers, assignments..."
                    className="w-full pl-12 pr-4 py-4 text-base bg-[#0f172a]/60 backdrop-blur-md border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-blue-300/50 transition-all"
                  />
                </div>
              </form>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center md:justify-start items-center mb-8 md:mb-12 animate-fade-in-up animation-delay-400 w-full sm:w-auto px-4 sm:px-0">
              {!user && (
                <SignInButton mode="modal">
                  <button className="group w-full sm:w-auto sm:min-w-[180px] px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-sm md:text-base">
                    <span>Get Started Free</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </SignInButton>
              )}
            </div>
          </div>

          {/* Right: Hero Illustration - Animated */}
          <div className="relative animate-fade-in animation-delay-500">
            <div className="relative w-full h-[250px] md:h-[400px] lg:h-[500px]">
              <StudentIllustration />
            </div>
          </div>
        </div>

        {/* Stats Grid - Full Width Below */}
        <div className="w-full max-w-7xl mx-auto mt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-4xl mx-auto border-t border-white/5 pt-6 md:pt-8 animate-fade-in-up animation-delay-400">
            {[
              { label: 'Active Students', value: stats.totalStudents, suffix: '+', icon: Users, color: 'text-blue-400' },
              { label: 'Resources', value: stats.totalResources, suffix: '+', icon: FileText, color: 'text-emerald-400' },
              { label: 'Projects', value: stats.totalProjects, suffix: '+', icon: Rocket, color: 'text-purple-400' },
              { label: 'Uptime', value: 99.9, suffix: '%', icon: Zap, color: 'text-cyan-400', decimals: 1 },
            ].map((stat, i) => (
              <div key={i} className="text-center group hover:bg-white/5 p-3 rounded-2xl transition-all duration-300 hover:scale-105">
                <div className={`flex items-center justify-center mb-2 ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <div className="text-xl md:text-2xl lg:text-3xl font-black text-white mb-1 leading-none">
                  <AnimatedCounter
                    end={stat.value}
                    suffix={stat.suffix}
                    decimals={stat.decimals || 0}
                    duration={2500}
                  />
                </div>
                <div className="text-[10px] md:text-xs text-blue-300/60 uppercase tracking-widest font-medium leading-none mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Minimal */}
      <section className="relative z-10 py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Faculty Card */}
            <div className="glass-card p-6 hover:scale-105 transition-transform">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-white">For Faculty</h3>
              </div>
              <p className="text-sm text-blue-200/70">Upload once, share forever. No laptop needed in class.</p>
            </div>

            {/* Students Card */}
            <div className="glass-card p-6 hover:scale-105 transition-transform">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <BookOpen className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-white">For Students</h3>
              </div>
              <p className="text-sm text-blue-200/70">Study anytime, anywhere. All notes, papers, and resources in one place.</p>
            </div>

            {/* Admin Card */}
            <div className="glass-card p-6 hover:scale-105 transition-transform">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <LayoutDashboard className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-white">For Admin</h3>
              </div>
              <p className="text-sm text-blue-200/70">Real-time analytics. Track engagement and resource usage.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Simple 3 Steps */}
      <section className="relative z-10 py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-blue-950/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-black text-white text-center mb-10">
            How It <span className="text-cyan-400">Works</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/20 border border-blue-400/30 mb-4">
                <span className="text-2xl font-black text-blue-400">1</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Sign In</h3>
              <p className="text-sm text-blue-200/70">One-click login with your Google account</p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400/30 mb-4">
                <span className="text-2xl font-black text-cyan-400">2</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Navigate</h3>
              <p className="text-sm text-blue-200/70">Find your subject by year, semester, and unit</p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/20 border border-purple-400/30 mb-4">
                <span className="text-2xl font-black text-purple-400">3</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Access</h3>
              <p className="text-sm text-blue-200/70">View or download resources instantly</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mb-4"></div>

      <Footer />
    </div >
  );
}
