import Link from 'next/link';
import Image from 'next/image';
import { Search, Users, ChevronRight, ShieldCheck, Library } from 'lucide-react';
import { auth } from '@clerk/nextjs/server';
import { SignInButton, SignUpButton } from '@clerk/nextjs';
import AnimatedCounter from '@/components/AnimatedCounter';
import HeroImageCarousel from '@/components/HeroImageCarousel';


export default async function Home() {
  const { userId } = await auth();

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

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/3 mix-blend-multiply"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo-50 rounded-full blur-3xl opacity-60 translate-y-1/3 -translate-x-1/4 mix-blend-multiply"></div>
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-violet-50 rounded-full blur-3xl opacity-40 -translate-x-1/2 -translate-y-1/2 mix-blend-multiply"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-8 pb-12 lg:pt-12 lg:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-6 lg:gap-8">

        {/* Hero Text - 40% */}
        <div className="flex-1 w-full lg:w-[40%] text-center lg:text-left space-y-6 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-blue-100 rounded-full px-4 py-1.5 mb-3 shadow-sm ring-1 ring-blue-50">
            <span className="flex h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="text-sm font-bold text-blue-700 tracking-wide uppercase">Department of CSE (AI & ML)</span>
          </div>

          <h1 className="text-2xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight whitespace-nowrap">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">Smart Learning</span> for AI & ML
          </h1>

          <p className="text-lg lg:text-xl text-slate-900 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
            Your complete academic hub for CSE (AI & ML). Access curated resources instantly.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            {userId ? (
              <>
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <button className="group relative w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-xl shadow-lg hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2 overflow-hidden">
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                    <Search className="h-5 w-5" />
                    <span>Access Library</span>
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link href="/profile" className="w-full sm:w-auto">
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

          {!userId && (
            <p className="text-sm text-slate-500 font-medium">
              * Institutional email required for faculty registration
            </p>
          )}
        </div>

        {/* Hero Image - 60% */}
        <div className="flex-1 w-full lg:w-[60%] relative px-2 lg:px-0">
          <div className="relative w-full h-[350px] lg:h-[450px] rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-slate-200/60 backdrop-blur-xl animate-float hover:shadow-[0_15px_50px_rgba(0,0,0,0.15)] transition-shadow duration-500">
            <HeroImageCarousel />
            {/* Subtle Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/5 to-transparent pointer-events-none"></div>
          </div>

          {/* Floating Elements - Compact */}
          <div className="absolute -bottom-3 -left-3 z-20 bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-slate-200/60 flex items-center gap-1.5 animate-bounce-slow hidden lg:flex hover:scale-105 transition-transform cursor-default">
            <div className="p-1.5 bg-green-50 rounded-md border border-green-100">
              <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
            </div>
            <div>
              <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider leading-tight">Verified</p>
              <p className="text-slate-900 font-extrabold text-[11px] leading-tight">Curated</p>
            </div>
          </div>

          <div className="absolute -top-3 -right-3 z-20 bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-slate-200/60 flex items-center gap-1.5 animate-bounce-slow-delay hidden lg:flex hover:scale-105 transition-transform cursor-default">
            <div className="p-1.5 bg-orange-50 rounded-md border border-orange-100">
              <Library className="h-3.5 w-3.5 text-orange-600" />
            </div>
            <div>
              <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider leading-tight">Resources</p>
              <p className="text-slate-900 font-extrabold text-[11px] leading-tight">5k+</p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Showcase Section */}
      <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-full mx-auto">
          <div className="text-center mb-6">
            <div className="inline-block mb-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700 font-bold text-xs uppercase tracking-wider shadow-sm">
              Platform Overview
            </div>
            <h2 className="text-2xl md:text-4xl font-bold mb-3 tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">Experience EduNexus</span>
            </h2>
            <p className="text-sm text-slate-900 leading-relaxed max-w-2xl mx-auto">
              Watch how our platform revolutionizes academic resource management
            </p>
          </div>

          <div className="relative w-full h-[300px] lg:h-[400px] rounded-2xl overflow-hidden shadow-2xl border-2 border-blue-200/50 bg-slate-900 group">
            <video
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/showcase-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>
      </section>

      {/* Stats Strip - Straight */}
      <div className="relative z-10 bg-slate-900 py-6 md:py-8 mt-4 md:mt-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { label: 'Active Students', value: 1200, suffix: '+' },
            { label: 'Learning Resources', value: 5000, suffix: '+' },
            { label: 'Faculty Members', value: 45, suffix: '+' },
            { label: 'Success Rate', value: 98, suffix: '%' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center group cursor-default">
              <span className="text-xl md:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-1 group-hover:scale-110 transition-transform duration-300">
                <AnimatedCounter end={stat.value} duration={2500} suffix={stat.suffix} />
              </span>
              <span className="text-[10px] text-blue-200 font-bold uppercase tracking-widest">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-8 max-w-3xl mx-auto">
          <div className="inline-block mb-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700 font-bold text-xs uppercase tracking-wider shadow-sm">
            Why Choose EduNexus?
          </div>
          <h2 className="text-2xl md:text-4xl font-bold mb-3 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">Engineered for Excellence</span>
          </h2>
          <p className="text-sm text-slate-900 leading-relaxed">
            Our platform is built with the precision of code and the accessibility of a modern library.
            Experience a new standard in academic resource management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`group relative bg-white rounded-xl border border-slate-100 hover:border-blue-100 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden hover:-translate-y-1`}
            >
              {/* Hover Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Image Section - Full Card */}
              <div className="relative h-80 w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 overflow-hidden flex justify-center items-center">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-200 via-slate-50 to-white"></div>
                <div className="relative w-full h-full transform group-hover:scale-105 transition-all duration-500">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Text Content - Overlay at Bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-4 border-t border-blue-100">
                <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-slate-900 leading-snug text-xs font-medium">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-white border-t border-slate-100 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-1.5 mb-3 opacity-90 hover:opacity-100 transition-opacity">
            <div className="h-5 w-5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-md"></div>
            <span className="text-base font-bold text-slate-900 tracking-tight">EduNexus</span>
          </div>
          <p className="text-slate-500 font-medium text-xs">
            &copy; {new Date().getFullYear()} College Dept of CSE (AI & ML). <br className="sm:hidden" />
            Crafted for academic excellence.
          </p>
        </div>
      </footer>

      {/* CSS for custom animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(2deg); }
            50% { transform: translateY(-15px) rotate(1deg); }
          }
          @keyframes bounce-slow {
             0%, 100% { transform: translateY(0px); }
             50% { transform: translateY(-8px); }
          }
           @keyframes bounce-slow-delay {
             0%, 100% { transform: translateY(0px); }
             50% { transform: translateY(-8px); }
          }
          @keyframes shimmer {
            100% { transform: translateX(100%); }
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
           .animate-bounce-slow {
            animation: bounce-slow 4s ease-in-out infinite;
          }
           .animate-bounce-slow-delay {
            animation: bounce-slow-delay 5s ease-in-out infinite 1s;
          }
          .group:hover .animate-shimmer {
            animation: shimmer 1s infinite;
          }
        `}} />
    </div>
  );
}
