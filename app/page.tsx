'use client';

import Link from 'next/link';
import { Search, ChevronRight, BookOpen, Rocket, Users, Zap, Shield, Award, GraduationCap, Sparkles, Star, ArrowRight, LayoutDashboard, FileText, Cpu, CheckCircle, Clock, Filter, Smartphone, Wifi } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import { getHomeStats, type HomeStats } from '@/lib/actions/stats';
import { useRouter } from 'next/navigation';

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

        <div className="text-center max-w-7xl mx-auto relative w-full">


          {/* Main Headline - FLUID TYPOGRAPHY */}
          <h1 className="font-black text-white mb-4 leading-[1.1] tracking-tight animate-fade-in text-[clamp(2rem,5vw+1rem,5rem)]">
            Your Academic <br />
            <span className="relative inline-block mt-1 md:mt-2">
              <span className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 blur-xl md:blur-2xl opacity-30"></span>
              <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 animate-shimmer bg-[length:200%_auto]">
                Command Center
              </span>
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-sm md:text-lg text-blue-200/70 mb-6 md:mb-8 max-w-lg md:max-w-2xl mx-auto leading-relaxed animate-fade-in animation-delay-200 px-4">
            A unified ecosystem for students and faculty. Seamlessly manage resources, showcase projects, and track syllabus—all in one platform.
          </p>

          {/* Search Bar */}
          {user && (
            <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto mb-6 animate-fade-in-up animation-delay-300">
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
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mb-8 md:mb-12 animate-fade-in-up animation-delay-400 w-full sm:w-auto px-4 sm:px-0">
            {user ? (
              <>
                <Link href="/projects" className="w-full sm:w-auto">
                  <button className="w-full sm:min-w-[180px] px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all duration-300 flex items-center justify-center gap-2 text-sm md:text-base">
                    <Rocket className="h-4 w-4 md:h-5 md:w-5" />
                    <span>Explore Projects</span>
                  </button>
                </Link>
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="group w-full sm:w-auto sm:min-w-[160px] px-6 py-3 bg-white text-blue-950 font-bold rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-sm md:text-base">
                    <span>Get Started</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </SignInButton>
                <Link href="#features" className="w-full sm:w-auto">
                  <button className="w-full sm:min-w-[140px] px-6 py-3 text-blue-200 hover:text-white font-medium transition-colors flex items-center justify-center gap-2 text-sm md:text-base">
                    <span>Learn More</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Stats integrated - Improved Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-4xl mx-auto border-t border-white/5 pt-6 md:pt-8 animate-fade-in-up animation-delay-400">
            {[
              { label: 'Active Students', value: `${stats.totalStudents}+`, icon: Users },
              { label: 'Resources', value: `${stats.totalResources}+`, icon: FileText },
              { label: 'Projects', value: `${stats.totalProjects}+`, icon: Rocket },
              { label: 'Uptime', value: stats.uptime, icon: Zap },
            ].map((stat, i) => (
              <div key={i} className="text-center group hover:bg-white/5 p-3 rounded-2xl transition-colors">
                <div className="flex items-center justify-center mb-2 text-blue-400 group-hover:scale-110 transition-transform">
                  <stat.icon className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <div className="text-xl md:text-2xl lg:text-3xl font-black text-white mb-1 leading-none">{stat.value}</div>
                <div className="text-[10px] md:text-xs text-blue-300/60 uppercase tracking-widest font-medium leading-none mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Bento Grid - Dynamic Resizing */}
      <section id="features" className="relative z-10 py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-blue-950/20 backdrop-blur-sm border-t border-white/5">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-blue-400 font-bold tracking-[0.2em] text-xs md:text-sm uppercase mb-2">Powering Ambition</h2>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-4">Designed for Excellence</h3>
            <p className="max-w-xl mx-auto text-blue-200/60 text-sm md:text-base">A suite of powerful tools built to enhance every aspect of your academic journey.</p>
          </div>

          <div className="max-w-md mx-auto">
            {/* Feature 1: Resources */}
            <Link href="/resources" className="block">
              <div className="glass-card p-6 md:p-8 flex flex-col justify-between overflow-hidden relative group h-full min-h-[280px] hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-[40px] -mr-8 -mt-8 transition-all group-hover:bg-blue-500/20"></div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform duration-500">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">Resource Library</h4>
                    <p className="text-blue-200/70 text-sm leading-relaxed">Access lecture notes, previous papers, and lab manuals organized by Branch and Year.</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-blue-400 text-sm font-semibold mt-6 group-hover:gap-2.5 transition-custom">
                    <span>View Library</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>



          </div>
        </div>
      </section>

      {/* Strong CTA Section */}
      <section className="relative z-10 py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600/20 to-cyan-600/10 border-y border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-md border border-blue-500/30 rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="text-blue-200 text-xs font-bold tracking-wider uppercase">Join the Future of Learning</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
            Ready to Transform Your
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 animate-shimmer bg-[length:200%_auto]">
              Academic Journey?
            </span>
          </h2>

          <p className="text-lg text-blue-200/70 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join {stats.totalStudents}+ students already using EduNexus to access {stats.totalResources}+ resources, showcase projects, and excel in their studies.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {user ? (
              <>
                <Link href="/search">
                  <button className="group w-full sm:w-auto px-8 py-4 bg-white text-blue-950 font-bold rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                    <Search className="h-5 w-5" />
                    <span>Start Searching</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link href="/projects">
                  <button className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 backdrop-blur-sm transition-all duration-300 flex items-center justify-center gap-2">
                    <Rocket className="h-5 w-5" />
                    <span>View Projects</span>
                  </button>
                </Link>
              </>
            ) : (
              <>
                <SignUpButton mode="modal">
                  <button className="group w-full sm:w-auto px-8 py-4 bg-white text-blue-950 font-bold rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                    <span>Get Started Free</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <button className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 backdrop-blur-sm transition-all duration-300">
                    Sign In
                  </button>
                </SignInButton>
              </>
            )}
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-blue-200/60 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-400" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-400" />
              <span>{stats.totalStudents}+ Active Users</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-400" />
              <span>{stats.uptime} Uptime</span>
            </div>
          </div>
        </div>
      </section>

      <div className="mb-4"></div>

      <Footer />
    </div>
  );
}
