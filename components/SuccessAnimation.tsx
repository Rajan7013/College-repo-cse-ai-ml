'use client';

import { CheckCircle, Sparkles, PartyPopper } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SuccessAnimation() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Trigger animation on mount
        setTimeout(() => setShow(true), 100);
    }, []);

    return (
        <div className={`transform transition-all duration-700 ${show ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
            <div className="bg-gradient-to-br from-green-50 via-green-100 to-emerald-100 rounded-2xl p-10 text-center border-4 border-green-300 shadow-2xl relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <Sparkles className="absolute top-4 left-4 h-8 w-8 text-yellow-500 animate-pulse" />
                    <Sparkles className="absolute top-6 right-8 h-6 w-6 text-yellow-400 animate-pulse delay-100" />
                    <Sparkles className="absolute bottom-8 left-12 h-7 w-7 text-yellow-500 animate-pulse delay-200" />
                    <PartyPopper className="absolute bottom-4 right-6 h-10 w-10 text-orange-400 animate-bounce" />
                </div>

                {/* Main content */}
                <div className="relative z-10">
                    <div className="relative inline-block mb-6">
                        <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                        <CheckCircle className="relative h-24 w-24 text-green-500 mx-auto drop-shadow-lg" />
                        <Sparkles className="absolute -top-2 -right-2 h-10 w-10 text-yellow-400 animate-pulse" />
                        <Sparkles className="absolute -bottom-1 -left-1 h-8 w-8 text-yellow-500 animate-pulse delay-150" />
                    </div>

                    <h3 className="text-3xl font-bold text-green-800 mb-3 animate-bounce">
                        🎉 Congratulations! 🎉
                    </h3>

                    <p className="text-lg text-green-700 font-medium mb-2">
                        Upload Successful!
                    </p>

                    <p className="text-green-600 text-sm">
                        Resource has been uploaded and is now available to all students
                    </p>
                </div>
            </div>
        </div>
    );
}
