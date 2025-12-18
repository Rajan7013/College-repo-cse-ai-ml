'use client';

import { useState } from 'react';
import { submitFeedback } from '@/lib/actions/user-profile';
import { Send } from 'lucide-react';

export default function FeedbackPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general' as 'bug' | 'feature' | 'general' | 'complaint',
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const result = await submitFeedback(formData);
        setSubmitting(false);

        if (result.success) {
            alert('Thank you for your feedback!');
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: '',
                category: 'general',
            });
        } else {
            alert(result.error || 'Failed to submit feedback');
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-black text-white mb-4">Share Your Feedback</h2>
            <p className="text-blue-200 mb-8">
                Your feedback helps us improve EduNexus. Let us know what you think!
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-white mb-2">Name *</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="glass-input w-full"
                            placeholder="Your name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-white mb-2">Email *</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="glass-input w-full"
                            placeholder="your@email.com"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-white mb-2">Category *</label>
                    <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                        className="glass-input w-full"
                    >
                        <option value="general" className="bg-slate-800">General Feedback</option>
                        <option value="bug" className="bg-slate-800">Bug Report 🐛</option>
                        <option value="feature" className="bg-slate-800">Feature Request ✨</option>
                        <option value="complaint" className="bg-slate-800">Complaint ⚠️</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold text-white mb-2">Subject *</label>
                    <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="glass-input w-full"
                        placeholder="Brief summary of your feedback"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-white mb-2">Message *</label>
                    <textarea
                        required
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="glass-input w-full resize-none"
                        placeholder="Please provide detailed feedback..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="btn-gradient w-full px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    <Send className="h-5 w-5" />
                    {submitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
            </form>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-card p-6 border-l-4 border-blue-500">
                    <div className="text-3xl mb-3">💡</div>
                    <h3 className="font-bold text-white mb-2">Suggestions Welcome</h3>
                    <p className="text-sm text-blue-100">
                        Have an idea for a new feature? We would love to hear it! Use the Feature Request category.
                    </p>
                </div>

                <div className="glass-card p-6 border-l-4 border-red-500">
                    <div className="text-3xl mb-3">🐛</div>
                    <h3 className="font-bold text-white mb-2">Found a Bug?</h3>
                    <p className="text-sm text-blue-100">
                        Report bugs with as much detail as possible including steps to reproduce and screenshots if available.
                    </p>
                </div>
            </div>
        </div>
    );
}
