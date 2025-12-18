'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
    {
        category: 'General',
        questions: [
            {
                q: 'What is EduNexus?',
                a: 'EduNexus is a comprehensive educational platform for managing academic resources, projects, and student profiles. It provides easy access to study materials, project opportunities, and profile management.'
            },
            {
                q: 'Who can use EduNexus?',
                a: 'EduNexus is designed for students and educators. Students can access resources, manage their profiles, and participate in projects. Administrators can upload content and manage projects.'
            },
            {
                q: 'Is EduNexus free to use?',
                a: 'Yes, EduNexus is completely free for all students and educators at our institution.'
            }
        ]
    },
    {
        category: 'Resources',
        questions: [
            {
                q: 'How do I access study materials?',
                a: 'Navigate to the Resources page from the navbar, select your year and semester, then choose your subject to view all available materials including notes, PDFs, videos, and more.'
            },
            {
                q: 'Can I download resources offline?',
                a: 'Yes! Most PDFs and documents can be downloaded for offline viewing. Click the download icon on any resource.'
            },
            {
                q: 'How often are resources updated?',
                a: 'Resources are updated regularly by administrators. New content is added throughout the semester based on curriculum needs.'
            }
        ]
    },
    {
        category: 'Projects',
        questions: [
            {
                q: 'How do I register for a project?',
                a: 'Go to the Projects page, browse available projects, click on one you are interested in, and click the "Register Now" button if registration is open.'
            },
            {
                q: 'Can I work on multiple projects?',
                a: 'Yes, you can register for multiple projects as long as you meet the eligibility criteria and can manage the workload.'
            },
            {
                q: 'What happens after I register?',
                a: 'After registration, you will receive confirmation and further instructions via email. Check the project detail page for updates and team information.'
            }
        ]
    },
    {
        category: 'Profile',
        questions: [
            {
                q: 'How do I edit my profile?',
                a: 'Go to Profile from the navbar, click "Edit Profile", make your changes in any of the 6 tabs (Personal, Academic, Contact, Goals, Skills, Awards), and click Save.'
            },
            {
                q: 'What information should I add to my profile?',
                a: 'We recommend completing all sections for a comprehensive profile: personal details, academic information, contact details, goals, skills, and awards. This helps with project matching and opportunities.'
            },
            {
                q: 'Is my profile information private?',
                a: 'Your basic information (name, roll number, year) may be visible to administrators. Detailed information is kept private and used only for platform functionality.'
            }
        ]
    },
    {
        category: 'Technical',
        questions: [
            {
                q: 'Which browsers are supported?',
                a: 'EduNexus works best on modern browsers: Chrome, Firefox, Safari, and Edge. We recommend using the latest version for optimal performance.'
            },
            {
                q: 'Can I use EduNexus on mobile?',
                a: 'Yes! EduNexus is fully responsive and works great on mobile devices, tablets, and desktops.'
            },
            {
                q: 'I found a bug. How do I report it?',
                a: 'Please use the Feedback form (Settings → Feedback) and select "Bug Report" as the category. Provide as much detail as possible.'
            }
        ]
    }
];

export default function FAQsPage() {
    const [openIndex, setOpenIndex] = useState<string | null>(null);

    const toggleQuestion = (categoryIdx: number, questionIdx: number) => {
        const key = `${categoryIdx}-${questionIdx}`;
        setOpenIndex(openIndex === key ? null : key);
    };

    return (
        <div>
            <h2 className="text-3xl font-black text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-blue-200 mb-8">Find answers to common questions about EduNexus.</p>

            <div className="space-y-8">
                {faqs.map((category, catIdx) => (
                    <div key={catIdx}>
                        <h3 className="text-2xl font-bold text-cyan-300 mb-4 flex items-center gap-2">
                            <span className="text-3xl">❓</span>
                            {category.category}
                        </h3>
                        <div className="space-y-3">
                            {category.questions.map((faq, qIdx) => {
                                const key = `${catIdx}-${qIdx}`;
                                const isOpen = openIndex === key;

                                return (
                                    <div key={qIdx} className="glass-card overflow-hidden hover:border-blue-400/30 transition-all">
                                        <button
                                            onClick={() => toggleQuestion(catIdx, qIdx)}
                                            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                                        >
                                            <span className="font-semibold text-white pr-4">{faq.q}</span>
                                            {isOpen ? (
                                                <ChevronUp className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                                            ) : (
                                                <ChevronDown className="h-5 w-5 text-blue-400 flex-shrink-0" />
                                            )}
                                        </button>

                                        {isOpen && (
                                            <div className="px-6 py-4 bg-white/5 border-t border-blue-400/10">
                                                <p className="text-blue-100 leading-relaxed">{faq.a}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 glass-card p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-2 border-blue-400/20">
                <h3 className="text-2xl font-bold text-white mb-2">Still have questions?</h3>
                <p className="text-blue-100 mb-4">Cannot find what you are looking for? We are here to help!</p>
                <a href="/settings/contact" className="inline-block btn-gradient px-6 py-3 rounded-xl font-bold">
                    Contact Us
                </a>
            </div>
        </div>
    );
}
