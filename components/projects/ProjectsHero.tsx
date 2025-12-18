'use client';

import { Rocket, Sparkles } from 'lucide-react';

export default function ProjectsHero() {
  return (
    <div className="relative overflow-hidden py-24">
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern"></div>

      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 glass-card px-6 py-2.5 mb-8">
          <Rocket className="h-4 w-4 text-cyan-400" />
          <span className="text-white font-bold text-sm">Project Opportunities</span>
          <Sparkles className="h-4 w-4 text-yellow-400" />
        </div>

        {/* Heading */}
        <h1 className="text-6xl md:text-7xl font-black text-white mb-6">
          Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Projects</span>
        </h1>

        <p className="text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
          Discover exciting project opportunities, build your skills, and make an impact
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-12 mb-8">
          <div className="text-center">
            <div className="text-4xl font-black text-white">50+</div>
            <div className="text-sm text-blue-200">Active Projects</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-white">200+</div>
            <div className="text-sm text-blue-200">Students Involved</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-white">15+</div>
            <div className="text-sm text-blue-200">Technologies</div>
          </div>
        </div>
      </div>
    </div>
  );
}
