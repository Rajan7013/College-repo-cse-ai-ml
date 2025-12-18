'use client';

import Link from 'next/link';
import { Search, ChevronRight, BookOpen, Rocket, Users, Zap, Shield, Award, GraduationCap, Sparkles, Star, ArrowRight, LayoutDashboard, FileText, Cpu, CheckCircle, Clock, Filter, Smartphone, Wifi } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import Footer from '@/components/Footer';

export default function Home() {
  const { user, isLoaded } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      <section className="relative z-10 flex flex-col items-center justify-center pt-8 pb-4 px-4 sm:px-6 lg:px-8">
        {/* Abstract Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

        <div className="text-center max-w-5xl mx-auto relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-500/10 backdrop-blur-md border border-blue-500/20 rounded-full px-3 py-0.5 mb-3 animate-fade-in-down">
            <Sparkles className="h-2.5 w-2.5 text-blue-400" />
            <span className="text-blue-200 text-[9px] font-bold tracking-wider uppercase">Department of CSE (AI & ML)</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2 leading-[1.1] tracking-tight animate-fade-in">
            Your Academic <br />
            <span className="relative inline-block mt-0.5">
              <span className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 blur-xl opacity-30"></span>
              <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 animate-shimmer bg-[length:200%_auto]">
                Command Center
              </span>
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xs md:text-sm text-blue-200/70 mb-4 max-w-xl mx-auto leading-relaxed animate-fade-in animation-delay-200">
            A unified ecosystem for students and faculty. Seamlessly manage resources, showcase projects, and track syllabus—all in one platform.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 justify-center items-center mb-5 animate-fade-in-up animation-delay-400">
            {user ? (
              <>
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <button className="group relative w-full px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all duration-300 flex items-center justify-center gap-1.5 text-xs">
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    <span>Go to Dashboard</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link href="/resources" className="w-full sm:w-auto">
                  <button className="w-full px-5 py-2 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg border border-white/10 backdrop-blur-sm transition-all duration-300 flex items-center justify-center gap-1.5 text-xs">
                    <BookOpen className="h-3.5 w-3.5 text-blue-300" />
                    <span>Browse Resources</span>
                  </button>
                </Link>
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="group w-full sm:w-auto px-5 py-2 bg-white text-blue-950 font-bold rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-1.5 text-xs">
                    <span>Get Started</span>
                    <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </SignInButton>
                <Link href="#features" className="w-full sm:w-auto">
                  <button className="w-full px-5 py-2 text-blue-200 hover:text-white font-medium transition-colors flex items-center justify-center gap-1.5 text-xs">
                    <span>Learn More</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Stats integrated */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-w-3xl mx-auto border-t border-white/5 pt-3 animate-fade-in-up animation-delay-400">
            {[
              { label: 'Active Students', value: '120+', icon: Users },
              { label: 'Resources', value: '500+', icon: FileText },
              { label: 'Projects', value: '45+', icon: Rocket },
              { label: 'Uptime', value: '99.9%', icon: Zap },
            ].map((stat, i) => (
              <div key={i} className="text-center group hover:bg-white/5 p-1.5 rounded-lg transition-colors">
                <div className="flex items-center justify-center mb-0.5 text-blue-400 group-hover:scale-110 transition-transform">
                  <stat.icon className="h-3.5 w-3.5" />
                </div>
                <div className="text-lg font-bold text-white mb-0 leading-none">{stat.value}</div>
                <div className="text-[8px] text-blue-300/60 uppercase tracking-widest font-medium leading-none mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="relative z-10 py-6 px-4 sm:px-6 lg:px-8 bg-blue-950/20 backdrop-blur-sm border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-4">
            <h2 className="text-blue-400 font-bold tracking-widest text-[8px] uppercase mb-0.5">Powering Ambition</h2>
            <h3 className="text-xl md:text-2xl font-black text-white mb-1.5">Designed for Excellence</h3>
            <p className="max-w-xl mx-auto text-blue-200/60 text-xs">A suite of powerful tools built to enhance every aspect of your academic journey.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 auto-rows-fr">
            {/* Feature 1: Resources */}
            <div className="glass-card p-4 flex flex-col justify-between overflow-hidden relative group h-full min-h-[250px]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-[40px] -mr-8 -mt-8 transition-all group-hover:bg-blue-500/20"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform duration-500">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Resource Library</h4>
                  <p className="text-blue-200/70 text-xs leading-relaxed">Access lecture notes, previous papers, and lab manuals organized by Branch and Year.</p>
                </div>
                <div className="flex items-center gap-1.5 text-blue-400 text-xs font-semibold mt-auto group-hover:gap-2.5 transition-custom cursor-pointer">
                  <span>View Library</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </div>

            {/* Feature 2: Projects */}
            <div className="glass-card p-4 flex flex-col justify-between overflow-hidden relative group h-full min-h-[250px]">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-6 text-cyan-400 group-hover:scale-110 transition-transform duration-500">
                    <Rocket className="h-5 w-5" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Project Showcase</h4>
                  <p className="text-blue-200/70 text-xs leading-relaxed">Publish your best work, display team details, and build a verified academic portfolio.</p>
                </div>
                <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-semibold mt-auto group-hover:gap-2.5 transition-custom cursor-pointer">
                  <span>Browse Projects</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </div>

            {/* Feature 3: Curriculum */}
            <div className="glass-card p-4 flex flex-col justify-between overflow-hidden relative group h-full min-h-[250px]">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-10 h-10 bg-violet-500/20 rounded-lg flex items-center justify-center mb-6 text-violet-400 group-hover:scale-110 transition-transform duration-500">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Smart Curriculum</h4>
                  <p className="text-blue-200/70 text-xs leading-relaxed">View Syllabus by Regulation, Year, and Semester. Includes Subject Codes.</p>
                </div>
                <div className="flex items-center gap-1.5 text-violet-400 text-xs font-semibold mt-auto group-hover:gap-2.5 transition-custom cursor-pointer">
                  <span>Check Syllabus</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </div>

            {/* Feature 4: Dashboard */}
            <div className="glass-card p-4 flex flex-col justify-between overflow-hidden relative group h-full min-h-[250px]">
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-[40px] -ml-8 -mb-8 transition-all group-hover:bg-emerald-500/20"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform duration-500">
                    <LayoutDashboard className="h-5 w-5" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Your Dashboard</h4>
                  <p className="text-blue-200/70 text-xs leading-relaxed">Track uploaded projects, favorites, and academic status in one unified view.</p>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold mt-auto group-hover:gap-2.5 transition-custom cursor-pointer">
                  <span>Go to Dashboard</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </div>
          </div>

          {/* New Section: Study Essentials */}
          <div className="mt-6">
            <div className="text-center mb-3">
              <h2 className="text-blue-400 font-bold tracking-widest text-[8px] uppercase mb-0.5">Academic Arsenal</h2>
              <h3 className="text-lg md:text-xl font-black text-white mb-1.5">Essential Study Materials</h3>
              <p className="max-w-xl mx-auto text-blue-200/60 text-[10px]">Everything you need to ace your exams, organized for quick access.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { title: 'Lecture Notes', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10', desc: 'Unit-wise notes' },
                { title: 'Question Papers', icon: FileText, color: 'text-rose-400', bg: 'bg-rose-500/10', desc: 'Prev years & practice' },
                { title: 'Lab Manuals', icon: Cpu, color: 'text-emerald-400', bg: 'bg-emerald-500/10', desc: 'Practical guides' },
                { title: 'Syllabus', icon: BookOpen, color: 'text-amber-400', bg: 'bg-amber-500/10', desc: 'Regs & Subjects' },
              ].map((item, i) => (
                <div key={i} className="glass-card p-4 text-center hover:bg-white/5 transition-all cursor-pointer group min-h-[160px] md:min-h-[250px] flex flex-col justify-center items-center">
                  <div className={`w-10 h-10 md:w-12 md:h-12 ${item.bg} rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform`}>
                    <item.icon className={`h-5 w-5 md:h-6 md:w-6 ${item.color}`} />
                  </div>
                  <h4 className="text-xs md:text-sm font-bold text-white mb-1.5 md:mb-2">{item.title}</h4>
                  <p className="text-[10px] md:text-xs text-blue-200/60 leading-relaxed max-w-[120px] mx-auto">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* New Section: Problem vs Solution */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-3 items-center">
            <div className="glass-card p-6 border-l-2 border-rose-500/50 min-h-[250px] flex flex-col justify-center">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-rose-400">The Problem:</span> Fragmented Knowledge
              </h3>
              <ul className="space-y-3 text-blue-200/70 text-xs">
                <li className="flex gap-2">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span><strong>Scattered:</strong> Notes lost in WhatsApp groups/drives.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span><strong>Lost History:</strong> Question papers hard to find.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span><strong>No Structure:</strong> Hard to filter by Regulation.</span>
                </li>
              </ul>
            </div>

            <div className="glass-card p-6 border-l-2 border-emerald-500/50 bg-emerald-500/5 min-h-[250px] flex flex-col justify-center">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-emerald-400">The Solution:</span> EduNexus AI
              </h3>
              <ul className="space-y-3 text-blue-200/80 text-xs">
                <li className="flex gap-2">
                  <Shield className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span><strong>Unified Vault:</strong> Central hub for everything.</span>
                </li>
                <li className="flex gap-2">
                  <Zap className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span><strong>Smart Filter:</strong> By Reg, Year, Sem, Subject.</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span><strong>Tiered Structure:</strong> Find content 10x faster.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* New Section: Key Advantages */}
          <div className="mt-5 border-t border-white/5 pt-4 pb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              {[
                { title: '24/7 Access', desc: 'Anytime', icon: Clock },
                { title: 'Smart Filtering', desc: 'Instant', icon: Filter },
                { title: 'Universal Access', desc: 'All Devices', icon: Smartphone },
                { title: 'Always Live', desc: '365 Days', icon: Wifi },
              ].map((item, i) => (
                <div key={i} className="group py-4 glass-card">
                  <div className="w-8 h-8 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center mb-2 group-hover:bg-blue-500/20 transition-colors">
                    <item.icon className="h-4 w-4 text-cyan-400" />
                  </div>
                  <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
                  <p className="text-blue-200/50 text-[9px] uppercase tracking-wider">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mb-4"></div>

      <Footer />
    </div>
  );
}
