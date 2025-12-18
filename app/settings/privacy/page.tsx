export default function PrivacyPage() {
    return (
        <div className="prose-invert max-w-none">
            <h2 className="text-3xl font-black text-white mb-4">Privacy Policy</h2>
            <p className="text-blue-200 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="space-y-6 text-blue-100">
                <section className="glass-card p-6 hover:bg-white/10 transition-all">
                    <h3 className="text-2xl font-bold text-white mb-3">1. Information We Collect</h3>
                    <p className="mb-3">We collect information that you provide directly to us, including:</p>
                    <ul className="list-disc pl-6 space-y-2 text-blue-100">
                        <li>Personal information (name, email, roll number, contact details)</li>
                        <li>Academic information (course, branch, year, CGPA)</li>
                        <li>Profile information (bio, skills, goals, achievements)</li>
                        <li>Usage data and activity logs</li>
                    </ul>
                </section>

                <section className="glass-card p-6 hover:bg-white/10 transition-all">
                    <h3 className="text-2xl font-bold text-white mb-3">2. How We Use Your Information</h3>
                    <p className="mb-3">We use the collected information for:</p>
                    <ul className="list-disc pl-6 space-y-2 text-blue-100">
                        <li>Providing and maintaining the service</li>
                        <li>Personalizing your experience</li>
                        <li>Managing your academic resources and projects</li>
                        <li>Communicating important updates</li>
                        <li>Improving our services</li>
                    </ul>
                </section>

                <section className="glass-card p-6 hover:bg-white/10 transition-all">
                    <h3 className="text-2xl font-bold text-white mb-3">3. Data Security</h3>
                    <p className="text-blue-100">We implement appropriate security measures to protect your personal information. Your data is stored securely using industry-standard encryption and access controls.</p>
                </section>

                <section className="glass-card p-6 hover:bg-white/10 transition-all">
                    <h3 className="text-2xl font-bold text-white mb-3">4. Data Sharing</h3>
                    <p className="mb-3">We do not sell your personal information. We may share data only in these cases:</p>
                    <ul className="list-disc pl-6 space-y-2 text-blue-100">
                        <li>With your explicit consent</li>
                        <li>With educational institution administrators (as required)</li>
                        <li>To comply with legal obligations</li>
                    </ul>
                </section>

                <section className="glass-card p-6 hover:bg-white/10 transition-all">
                    <h3 className="text-2xl font-bold text-white mb-3">5. Your Rights</h3>
                    <p className="mb-3">You have the right to:</p>
                    <ul className="list-disc pl-6 space-y-2 text-blue-100">
                        <li>Access your personal data</li>
                        <li>Update or correct your information</li>
                        <li>Request deletion of your account</li>
                        <li>Opt-out of communications</li>
                    </ul>
                </section>

                <section className="glass-card p-6 hover:bg-white/10 transition-all">
                    <h3 className="text-2xl font-bold text-white mb-3">6. Cookies</h3>
                    <p className="text-blue-100">We use cookies and similar technologies to enhance your experience, analyze usage, and maintain session security.</p>
                </section>

                <section className="glass-card p-6 hover:bg-white/10 transition-all">
                    <h3 className="text-2xl font-bold text-white mb-3">7. Contact Us</h3>
                    <p className="text-blue-100">If you have questions about this Privacy Policy, please contact us through the Settings → Contact page.</p>
                </section>
            </div>
        </div>
    );
}
