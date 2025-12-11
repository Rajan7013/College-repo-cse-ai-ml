import { headers } from 'next/headers';

export const runtime = 'edge';

export async function GET() {
    const headersList = await headers();
    const host = headersList.get('host') || 'edu-svcet.vercel.app';

    return new Response(
        `const CACHE_NAME = 'edunexus-v1';
const urlsToCache = [
  '/',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  // Simple check for PWA requirements, but prefer network due to dynamic Next.js interactions
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
`,
        {
            headers: {
                'Content-Type': 'application/javascript',
                'Cache-Control': 'public, max-age=0, must-revalidate',
            },
        }
    );
}
