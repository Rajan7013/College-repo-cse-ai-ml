'use client';

import { useState } from 'react';
import { deleteResource } from '@/lib/actions/manage';
import { Trash2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DeleteButton({ resourceId }: { resourceId: string }) {
    const [deleting, setDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this resource? This action cannot be undone.')) {
            return;
        }

        setDeleting(true);
        const result = await deleteResource(resourceId);

        if (result.success) {
            router.refresh();
        } else {
            alert(result.message);
            setDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors disabled:opacity-50"
            title="Delete"
        >
            {deleting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
                <Trash2 className="h-4 w-4" />
            )}
        </button>
    );
}
