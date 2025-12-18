'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSending(false);
        alert('Message sent successfully! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div>
            <h2 className="text-3xl font-black text-white mb-4">Contact Us</h2>
            <p className="text-blue-200 mb-8">Have a question? We are here to help!</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contact Info */}
                <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white mb-4">Get in Touch</h3>

                    <div className="space-y-4">
                        <div className="glass-card p-6 hover:bg-white/10 transition-all border-l-4 border-blue-500">
                            <div className="flex items-start gap-4">
                                <Mail className="h-6 w-6 text-blue-400 mt-1" />
                                <div>
                                    <h4 className="font-bold text-white">Email</h4>
                                    <p className="text-sm text-blue-100">support@edunexus.edu</p>
                                    <p className="text-xs text-blue-300 mt-1">We typically respond within 24 hours</p>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-6 hover:bg-white/10 transition-all border-l-4 border-emerald-500">
                            <div className="flex items-start gap-4">
                                <Phone className="h-6 w-6 text-emerald-400 mt-1" />
                                <div>
                                    <h4 className="font-bold text-white">Phone</h4>
                                    <p className="text-sm text-blue-100">+91 (XXX) XXX-XXXX</p>
                                    <p className="text-xs text-blue-300 mt-1">Monday - Friday, 9 AM - 5 PM</p>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-6 hover:bg-white/10 transition-all border-l-4 border-purple-500">
                            <div className="flex items-start gap-4">
                                <MapPin className="h-6 w-6 text-purple-400 mt-1" />
                                <div>
                                    <h4 className="font-bold text-white">Address</h4>
                                    <p className="text-sm text-blue-100">
                                        College Campus<br />
                                        City, State - PIN<br />
                                        India
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-2 border-amber-400/20">
                        <h4 className="font-bold text-amber-300 mb-2">Quick Help</h4>
                        <p className="text-sm text-blue-100 mb-3">For immediate answers, check our FAQ section.</p>
                        <a href="/settings/faqs" className="inline-block px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold rounded-lg text-sm transition-all border border-amber-400/30">
                            View FAQs
                        </a>
                    </div>
                </div>

                {/* Contact Form */}
                <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Send a Message</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
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

                        <div>
                            <label className="block text-sm font-bold text-white mb-2">Subject *</label>
                            <input
                                type="text"
                                required
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                className="glass-input w-full"
                                placeholder="How can we help?"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-white mb-2">Message *</label>
                            <textarea
                                required
                                rows={5}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="glass-input w-full resize-none"
                                placeholder="Your message..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={sending}
                            className="btn-gradient w-full px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <Send className="h-5 w-5" />
                            {sending ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
