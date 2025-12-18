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
      <section className="relative z-10 flex flex-col items-center justify-center pt-8 pb-4 px-4 sm:px-6 lg:px-8 min-h-[60vh] md:min-h-[70vh]">
        {/* Abstract Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:2rem_2rem] md:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

        <div className="text-center max-w-7xl mx-auto relative w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-500/10 backdrop-blur-md border border-blue-500/20 rounded-full px-3 py-1 mb-4 md:mb-6 animate-fade-in-down scale-90 md:scale-100">
            <Sparkles className="h-3 w-3 text-blue-400" />
            <span className="text-blue-200 text-[10px] md:text-xs font-bold tracking-wider uppercase">Department of CSE (AI & ML)</span>
          </div>

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

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mb-8 md:mb-12 animate-fade-in-up animation-delay-400 w-full sm:w-auto px-4 sm:px-0">
            {user ? (
              <>
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <button className="group relative w-full sm:min-w-[180px] px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all duration-300 flex items-center justify-center gap-2 text-sm md:text-base">
                    <LayoutDashboard className="h-4 w-4 md:h-5 md:w-5" />
                    <span>Go to Dashboard</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link href="/resources" className="w-full sm:w-auto">
                  <button className="w-full sm:min-w-[180px] px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 backdrop-blur-sm transition-all duration-300 flex items-center justify-center gap-2 text-sm md:text-base">
                    <BookOpen className="h-4 w-4 md:h-5 md:w-5 text-blue-300" />
                    <span>Browse Resources</span>
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
              { label: 'Active Students', value: '120+', icon: Users },
              { label: 'Resources', value: '500+', icon: FileText },
              { label: 'Projects', value: '45+', icon: Rocket },
              { label: 'Uptime', value: '99.9%', icon: Zap },
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Feature 1: Resources */}
            <div className="glass-card p-6 md:p-8 flex flex-col justify-between overflow-hidden relative group h-full min-h-[280px] hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-[40px] -mr-8 -mt-8 transition-all group-hover:bg-blue-500/20"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform duration-500">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">Resource Library</h4>
                  <p className="text-blue-200/70 text-sm leading-relaxed">Access lecture notes, previous papers, and lab manuals organized by Branch and Year.</p>
                </div>
                <div className="flex items-center gap-1.5 text-blue-400 text-sm font-semibold mt-6 group-hover:gap-2.5 transition-custom cursor-pointer">
                  <span>View Library</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Feature 2: Projects */}
            <div className="glass-card p-6 md:p-8 flex flex-col justify-between overflow-hidden relative group h-full min-h-[280px] hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-6 text-cyan-400 group-hover:scale-110 transition-transform duration-500">
                    <Rocket className="h-6 w-6" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">Project Showcase</h4>
                  <p className="text-blue-200/70 text-sm leading-relaxed">Publish your best work, display team details, and build a verified academic portfolio.</p>
                </div>
                <div className="flex items-center gap-1.5 text-cyan-400 text-sm font-semibold mt-6 group-hover:gap-2.5 transition-custom cursor-pointer">
                  <span>Browse Projects</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Feature 3: Curriculum */}
            <div className="glass-card p-6 md:p-8 flex flex-col justify-between overflow-hidden relative group h-full min-h-[280px] hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center mb-6 text-violet-400 group-hover:scale-110 transition-transform duration-500">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">Smart Curriculum</h4>
                  <p className="text-blue-200/70 text-sm leading-relaxed">View Syllabus by Regulation, Year, and Semester. Includes Subject Codes.</p>
                </div>
                <div className="flex items-center gap-1.5 text-violet-400 text-sm font-semibold mt-6 group-hover:gap-2.5 transition-custom cursor-pointer">
                  <span>Check Syllabus</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Feature 4: Dashboard */}
            <div className="glass-card p-6 md:p-8 flex flex-col justify-between overflow-hidden relative group h-full min-h-[280px] hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-[40px] -ml-8 -mb-8 transition-all group-hover:bg-emerald-500/20"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform duration-500">
                    <LayoutDashboard className="h-6 w-6" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">Your Dashboard</h4>
                  <p className="text-blue-200/70 text-sm leading-relaxed">Track uploaded projects, favorites, and academic status in one unified view.</p>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 text-sm font-semibold mt-6 group-hover:gap-2.5 transition-custom cursor-pointer">
                  <span>Go to Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>

          {/* New Section: Study Essentials */}
          <div className="mt-12 md:mt-20">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-blue-400 font-bold tracking-[0.2em] text-xs md:text-sm uppercase mb-2">Academic Arsenal</h2>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-4">Essential Study Materials</h3>
              <p className="max-w-xl mx-auto text-blue-200/60 text-sm md:text-base">Everything you need to ace your exams, organized for quick access.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {[
                { title: 'Lecture Notes', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10', desc: 'Unit-wise notes', type: 'Notes' },
                { title: 'Mid-1 Papers', icon: FileText, color: 'text-rose-400', bg: 'bg-rose-500/10', desc: 'First Mid Exams', type: 'MID-1 Question Paper' },
                { title: 'Mid-2 Papers', icon: FileText, color: 'text-purple-400', bg: 'bg-purple-500/10', desc: 'Second Mid Exams', type: 'MID-2 Question Paper' },
                { title: 'Lab Manuals', icon: Cpu, color: 'text-emerald-400', bg: 'bg-emerald-500/10', desc: 'Practical guides', type: 'Lab Manual' },
                { title: 'Sem Exams', icon: Award, color: 'text-amber-400', bg: 'bg-amber-500/10', desc: 'Final Papers', type: 'Final Semester Exam' },
                { title: 'Assignments', icon: CheckCircle, color: 'text-cyan-400', bg: 'bg-cyan-500/10', desc: 'Practice work', type: 'Assignment' },
                { title: 'Syllabus', icon: BookOpen, color: 'text-indigo-400', bg: 'bg-indigo-500/10', desc: 'Regulations', type: 'Syllabus' },
                { title: 'Browse All', icon: ArrowRight, color: 'text-white', bg: 'bg-white/10', desc: 'View everything', type: '' },
              ].map((item, i) => (
                <Link
                  key={i}
                  href={`/search${item.type ? `?documentType=${encodeURIComponent(item.type)}` : ''}`}
                  className="block group"
                >
                  <div className="glass-card p-4 md:p-6 text-center hover:bg-white/5 transition-all cursor-pointer h-full min-h-[160px] md:min-h-[200px] flex flex-col justify-center items-center border border-white/5 hover:border-blue-400/30 hover:shadow-glow hover:-translate-y-1">
                    <div className={`w-12 h-12 md:w-16 md:h-16 ${item.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <item.icon className={`h-6 w-6 md:h-8 md:w-8 ${item.color}`} />
                    </div>
                    <h4 className="text-sm md:text-lg font-bold text-white mb-2">{item.title}</h4>
                    <p className="text-xs text-blue-200/60 leading-relaxed max-w-[140px] mx-auto">{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* New Section: Problem vs Solution */}
          <div className="mt-12 md:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 items-stretch">
            <div className="glass-card p-6 md:p-10 border-l-4 border-rose-500/50 flex flex-col justify-center">
              <h3 className="text-lg md:text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-rose-400">The Problem:</span> Fragmented Knowledge
              </h3>
              <ul className="space-y-4 text-blue-200/70 text-sm md:text-base">
                <li className="flex gap-3">
                  <span className="text-rose-500 font-bold shrink-0 text-lg">✕</span>
                  <span><strong>Scattered:</strong> Notes lost in WhatsApp groups/drives.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-rose-500 font-bold shrink-0 text-lg">✕</span>
                  <span><strong>Lost History:</strong> Question papers hard to find.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-rose-500 font-bold shrink-0 text-lg">✕</span>
                  <span><strong>No Structure:</strong> Hard to filter by Regulation.</span>
                </li>
              </ul>
            </div>

            <div className="glass-card p-6 md:p-10 border-l-4 border-emerald-500/50 bg-emerald-500/5 flex flex-col justify-center">
              <h3 className="text-lg md:text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-emerald-400">The Solution:</span> EduNexus AI
              </h3>
              <ul className="space-y-4 text-blue-200/80 text-sm md:text-base">
                <li className="flex gap-3">
                  <Shield className="h-5 w-5 md:h-6 md:w-6 text-emerald-400 shrink-0" />
                  <span><strong>Unified Vault:</strong> Central hub for everything.</span>
                </li>
                <li className="flex gap-3">
                  <Zap className="h-5 w-5 md:h-6 md:w-6 text-emerald-400 shrink-0" />
                  <span><strong>Smart Filter:</strong> By Reg, Year, Sem, Subject.</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-emerald-400 shrink-0" />
                  <span><strong>Tiered Structure:</strong> Find content 10x faster.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* New Section: Key Advantages - Fixed Grid */}
          <div className="mt-12 md:mt-16 border-t border-white/5 pt-8 md:pt-12 pb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                { title: '24/7 Access', desc: 'Anytime', icon: Clock },
                { title: 'Smart Filtering', desc: 'Instant', icon: Filter },
                { title: 'Universal Access', desc: 'All Devices', icon: Smartphone },
                { title: 'Always Live', desc: '365 Days', icon: Wifi },
              ].map((item, i) => (
                <div key={i} className="group py-6 glass-card hover:bg-white/5 transition-colors">
                  <div className="w-10 h-10 md:w-12 md:h-12 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-500/20 transition-colors">
                    <item.icon className="h-5 w-5 md:h-6 md:w-6 text-cyan-400" />
                  </div>
                  <h4 className="text-white font-bold text-sm md:text-lg mb-1">{item.title}</h4>
                  <p className="text-blue-200/50 text-[10px] md:text-xs uppercase tracking-wider">{item.desc}</p>
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
