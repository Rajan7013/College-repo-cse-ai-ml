import Link from 'next/link';
import { GraduationCap, Search, Users, Award, Zap, Target, BookOpen, ChevronRight } from 'lucide-react';
import { auth } from '@clerk/nextjs/server';

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo/Icon */}
            <div className="flex justify-center mb-8 animate-float">
              <div className="p-4 bg-blue-600 rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300">
                <GraduationCap className="h-16 w-16 text-white" />
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight" style={{ fontFamily: 'var(--font-poppins)' }}>
              EduNexus
              <span className="block text-blue-600 mt-2 text-2xl md:text-4xl font-medium">Academic Repository</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-poppins)' }}>
              The central hub for <span className="font-semibold text-slate-900">B.Tech CSE (AI & ML)</span> resources.
              Access notes, papers, and projects instantly.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {userId ? (
                <>
                  <Link href="/dashboard">
                    <button className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 text-lg">
                      <Search className="h-5 w-5" />
                      <span>Explore Resources</span>
                      <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                  <Link href="/profile">
                    <button className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl shadow-md border border-slate-200 transition-all duration-300 flex items-center space-x-2 text-lg">
                      <Users className="h-5 w-5 text-slate-500" />
                      <span>My Profile</span>
                    </button>
                  </Link>
                </>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/sign-in">
                    <button className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 text-lg">
                      Sign In to Access
                    </button>
                  </Link>
                  <Link href="/sign-up">
                    <button className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 font-semibold rounded-xl shadow-md border border-slate-200 transition-all duration-300 text-lg">
                      Create Account
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'var(--font-poppins)' }}>
              Professional Academic Tools
            </h2>
            <p className="text-lg text-slate-600">Streamlined features for efficient learning</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Cards with professional styling */}
            {[
              { icon: BookOpen, title: "Structured Content", desc: "Organized by year, branch, and regulation", color: "blue" },
              { icon: Search, title: "Smart Search", desc: "Find any resource in milliseconds", color: "indigo" },
              { icon: Zap, title: "Instant Access", desc: "View PDFs and Docs directly in-browser", color: "sky" },
              { icon: Target, title: "Exam Focused", desc: "Curated materials for academic success", color: "slate" }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm p-8 border border-slate-100 hover:shadow-md transition-shadow">
                <div className={`bg-${feature.color}-50 w-12 h-12 rounded-lg flex items-center justify-center mb-6`}>
                  <feature.icon className={`h-6 w-6 text-${feature.color}-600`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-900 py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="p-6 border border-slate-700 rounded-2xl">
              <p className="text-5xl font-bold mb-2">11+</p>
              <p className="text-slate-400">Resource Categories</p>
            </div>
            <div className="p-6 border border-slate-700 rounded-2xl">
              <p className="text-5xl font-bold mb-2">8+</p>
              <p className="text-slate-400">File Formats Supported</p>
            </div>
            <div className="p-6 border border-slate-700 rounded-2xl">
              <p className="text-5xl font-bold mb-2">CSE</p>
              <p className="text-slate-400">Specialized Content</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-500 font-medium">© 2025 EduNexus. All rights reserved.</p>
          <p className="text-slate-400 text-sm mt-2">Built for Excellence.</p>
        </div>
      </footer>
    </div>
  );
}
