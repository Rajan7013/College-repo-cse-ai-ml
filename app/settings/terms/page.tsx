export default function TermsPage() {
    return (
        <div className="prose-invert max-w-none">
            <h2 className="text-3xl font-black text-white mb-4">Terms of Service</h2>
            <p className="text-blue-200 mb-8">Last updated: 2024-12-26</p>

            <div className="space-y-6 text-blue-100">
                <section className="glass-card p-6 hover:bg-white/10 transition-all">
                    <h3 className="text-2xl font-bold text-white mb-3">1. Acceptance of Terms</h3>
                    <p className="text-blue-100">By accessing and using EduNexus, you agree to be bound by these Terms of Service. If you do not agree, please discontinue use immediately.</p>
                </section>

                <section className="glass-card p-6 hover:bg-white/10 transition-all">
                    <h3 className="text-2xl font-bold text-white mb-3">2. User Accounts</h3>
                    <p className="mb-3">When creating an account, you agree to:</p>
                    <ul className="list-disc pl-6 space-y-2 text-blue-100">
                        <li>Provide accurate and complete information</li>
                        <li>Maintain the security of your account credentials</li>
                        <li>Accept responsibility for all activities under your account</li>
                        <li>Notify us immediately of unauthorized access</li>
                    </ul>
                </section>

                <section className="glass-card p-6 hover:bg-white/10 transition-all">
                    <h3 className="text-2xl font-bold text-white mb-3">3. Acceptable Use</h3>
                    <p className="mb-3">You agree NOT to:</p>
                    <ul className="list-disc pl-6 space-y-2 text-blue-100">
                        <li>Upload malicious content or viruses</li>
                        <li>Violate intellectual property rights</li>
                        <li>Share inappropriate or offensive content</li>
                        <li>Attempt to breach security measures</li>
                        <li>Use the service for illegal activities</li>
                    </ul>
                </section>

                <section className="glass-card p-6 hover:bg-white/10 transition-all">
                    <h3 className="text-2xl font-bold text-white mb-3">4. Content Ownership</h3>
                    <p className="text-blue-100">You retain ownership of content you upload. By uploading, you grant us a license to store, display, and distribute your content as necessary to provide the service.</p>
                </section>

                <section className="glass-card p-6 hover:bg-white/10 transition-all">
                    <h3 className="text-2xl font-bold text-white mb-3">5. Academic Integrity</h3>
                    <p className="text-blue-100">This platform is designed to support learning. Users must maintain academic integrity and use resources responsibly. Plagiarism and cheating are strictly prohibited.</p>
                </section>

                <section className="glass-card p-6 hover:bg-white/10 transition-all">
                    <h3 className="text-2xl font-bold text-white mb-3">6. Service Availability</h3>
                    <p className="text-blue-100">We strive for 99% uptime but do not guarantee uninterrupted service. We reserve the right to modify or discontinue features with notice.</p>
                </section>

                <section className="glass-card p-6 hover:bg-white/10 transition-all">
                    <h3 className="text-2xl font-bold text-white mb-3">7. Limitation of Liability</h3>
                    <p className="text-blue-100">EduNexus is provided "as is" without warranties. We are not liable for any damages arising from use of the service.</p>
                </section>

                <section className="glass-card p-6 hover:bg-white/10 transition-all">
                    <h3 className="text-2xl font-bold text-white mb-3">8. Termination</h3>
                    <p className="text-blue-100">We reserve the right to suspend or terminate accounts that violate these terms without prior notice.</p>
                </section>

                <section className="glass-card p-6 hover:bg-white/10 transition-all">
                    <h3 className="text-2xl font-bold text-white mb-3">9. Changes to Terms</h3>
                    <p className="text-blue-100">We may update these terms periodically. Continued use after changes constitutes acceptance of the new terms.</p>
                </section>

                <section className="glass-card p-6 hover:bg-white/10 transition-all">
                    <h3 className="text-2xl font-bold text-white mb-3">10. Contact</h3>
                    <p className="text-blue-100">For questions about these Terms, visit Settings → Contact.</p>
                </section>
            </div>
        </div>
    );
}
