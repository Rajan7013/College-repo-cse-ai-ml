import { GraduationCap, Target, Users, Zap } from 'lucide-react';

export default function AboutPage() {
    return (
        <div>
            <h2 className="text-3xl font-black text-white mb-4">About EduNexus</h2>
            <p className="text-xl text-blue-200 mb-8 leading-relaxed">
                EduNexus is a modern educational platform designed to enhance the learning experience for students and educators.
            </p>

            <div className="space-y-8">
                <section className="glass-card p-6 hover:bg-white/10 transition-all">
                    <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-3">
                        <Target className="h-6 w-6 text-cyan-400" />
                        Our Mission
                    </h3>
                    <p className="text-blue-100 leading-relaxed">
                        To provide seamless access to educational resources, foster collaborative learning, and empower students
                        to achieve their academic and career goals through innovative technology solutions.
                    </p>
                </section>

                <section>
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                        <Zap className="h-6 w-6 text-yellow-400" />
                        Key Features
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="glass-card p-6 hover:bg-white/10 transition-all border-l-4 border-blue-500">
                            <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                <span className="text-2xl">📚</span>
                                Resource Library
                            </h4>
                            <p className="text-sm text-blue-100">Comprehensive collection of study materials, notes, and references organized by subject and year.</p>
                        </div>
                        <div className="glass-card p-6 hover:bg-white/10 transition-all border-l-4 border-cyan-500">
                            <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                <span className="text-2xl">🚀</span>
                                Project Hub
                            </h4>
                            <p className="text-sm text-blue-100">Discover and participate in exciting project opportunities with detailed requirements and team management.</p>
                        </div>
                        <div className="glass-card p-6 hover:bg-white/10 transition-all border-l-4 border-purple-500">
                            <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                <span className="text-2xl">👤</span>
                                Profile Management
                            </h4>
                            <p className="text-sm text-blue-100">Comprehensive profile system to track your academic journey, skills, goals, and achievements.</p>
                        </div>
                        <div className="glass-card p-6 hover:bg-white/10 transition-all border-l-4 border-amber-500">
                            <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                <span className="text-2xl">⚡</span>
                                Fast & Intuitive
                            </h4>
                            <p className="text-sm text-blue-100">Lightning-fast performance with a beautiful, user-friendly interface designed for productivity.</p>
                        </div>
                    </div>
                </section>

                <section className="glass-card p-6 hover:bg-white/10 transition-all">
                    <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-3">
                        <Users className="h-6 w-6 text-emerald-400" />
                        Who We Serve
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="text-3xl">🎓</div>
                            <div>
                                <h4 className="font-bold text-white">Students</h4>
                                <p className="text-sm text-blue-100">Access resources, manage profiles, participate in projects, and track academic progress.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="text-3xl">👨‍🏫</div>
                            <div>
                                <h4 className="font-bold text-white">Educators</h4>
                                <p className="text-sm text-blue-100">Upload resources, create project opportunities, and manage student engagement.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="glass-card p-6 hover:bg-white/10 transition-all">
                    <h3 className="text-2xl font-bold text-white mb-3">Technology Stack</h3>
                    <p className="text-blue-100 mb-4">Built with modern, cutting-edge technologies:</p>
                    <div className="flex flex-wrap gap-3">
                        {['Next.js 15', 'React', 'TypeScript', 'Tailwind CSS', 'Firebase', 'Clerk Auth'].map((tech, i) => (
                            <span key={i} className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 text-white rounded-xl text-sm font-semibold hover:scale-105 transition-transform">
                                {tech}
                            </span>
                        ))}
                    </div>
                </section>

                <section className="glass-card p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-2 border-blue-400/20">
                    <h3 className="text-2xl font-bold text-white mb-2">Get Involved</h3>
                    <p className="text-blue-100 mb-4">
                        Have feedback or suggestions? We would love to hear from you! Your input helps us improve EduNexus for everyone.
                    </p>
                    <a href="/settings/feedback" className="inline-block btn-gradient px-6 py-3 rounded-xl font-bold">
                        Share Feedback
                    </a>
                </section>
            </div>
        </div>
    );
}
