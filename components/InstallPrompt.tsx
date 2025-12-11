'use client';

import { useState, useEffect } from 'react';
import { X, Download, Share, Smartphone } from 'lucide-react';

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Check if it's iOS
        const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(isIosDevice);

        // Register Service Worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/sw.js')
                .then((registration) => console.log('Scope: ', registration.scope))
                .catch((err) => console.log('SW Registration Failed: ', err));
        }

        // Capture install prompt
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            // Check if already installed
            if (!window.matchMedia('(display-mode: standalone)').matches) {
                setShowPrompt(true);
            }
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Check strict display mode for iOS
        if (isIosDevice && !window.matchMedia('(display-mode: standalone)').matches) {
            // Ideally verify if recently shown to avoid annoying user
            const lastDismissed = localStorage.getItem('installPromptDismissed');
            if (!lastDismissed || Date.now() - parseInt(lastDismissed) > 86400000) { // 24 hours
                setShowPrompt(true);
            }
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setShowPrompt(false);
        }
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('installPromptDismissed', Date.now().toString());
    };

    if (!showPrompt) return null;

    return (
        <div className="fixed bottom-20 left-4 right-4 md:bottom-20 md:right-4 md:left-auto md:w-96 bg-gradient-to-r from-blue-900 to-slate-900 rounded-2xl shadow-2xl p-4 z-50 animate-fade-in border border-blue-700/50 backdrop-blur-sm">
            <button
                onClick={handleDismiss}
                className="absolute -top-3 -right-3 bg-slate-800 text-white p-1.5 rounded-full shadow-lg border border-slate-600 hover:bg-slate-700"
            >
                <X className="h-4 w-4" />
            </button>

            <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-inner">
                    <img src="/icon-192x192.png" alt="App Icon" className="w-10 h-10 object-contain drop-shadow-md" />
                </div>
                <div className="flex-1">
                    <h3 className="text-white font-bold text-lg leading-tight mb-1">Install EduNexus App</h3>
                    <p className="text-blue-200 text-sm mb-3">
                        {isIOS
                            ? "Install for the best full-screen experience!"
                            : "Add to Home Screen for quick access and full-screen view!"}
                    </p>

                    {isIOS ? (
                        <div className="bg-slate-800/50 rounded-lg p-2 text-xs text-blue-100 border border-blue-500/30">
                            <p className="flex items-center gap-2 mb-1">
                                1. Tap <Share className="h-4 w-4" /> <strong>Share</strong> button
                            </p>
                            <p className="flex items-center gap-2">
                                2. Select <span className="bg-slate-700 px-1 rounded border border-slate-600">+</span> <strong>Add to Home Screen</strong>
                            </p>
                        </div>
                    ) : (
                        <button
                            onClick={handleInstallClick}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center space-x-2"
                        >
                            <Download className="h-4 w-4" />
                            <span>Install App Now</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
