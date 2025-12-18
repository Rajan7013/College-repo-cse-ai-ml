'use client';

import { useState } from 'react';
import { seedCurriculum } from '@/lib/actions/curriculum';
import { Database, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SeedButton() {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleSeed = async () => {
        if (!confirm('This will overwrite existing subjects with the same codes. Continue?')) return;

        setIsLoading(true);
        setStatus('idle');
        setMessage('');

        try {
            const result = await seedCurriculum();
            if (result.success) {
                setStatus('success');
                setMessage(result.message || 'Seeding successful');
                router.refresh();
            } else {
                setStatus('error');
                setMessage(result.error || 'Failed to seed');
            }
        } catch (error) {
            setStatus('error');
            setMessage('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-end gap-2">
            <button
                onClick={handleSeed}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-orange-700 border border-orange-200 rounded-lg hover:bg-orange-50 hover:text-orange-800 disabled:opacity-50 transition-colors text-sm font-medium"
            >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
                Seed Database from Static Files
            </button>
            {status === 'success' && (
                <span className="text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> {message}
                </span>
            )}
            {status === 'error' && (
                <span className="text-xs text-red-600 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> {message}
                </span>
            )}
        </div>
    );
}
