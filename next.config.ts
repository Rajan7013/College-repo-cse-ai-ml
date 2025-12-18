import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Updated from middlewareClientMaxBodySize as per warning
    // proxyClientMaxBodySize: '150mb', // Actually strictly strictly typing might fail if typings are old.
    // Let's safe-bet: allow serverActions limit to handle it, but if warning persists, we rename.
    // The warning said "Please use experimental.proxyClientMaxBodySize".
    // I will try to use that.
    serverActions: {
      bodySizeLimit: '150mb',
    },
    // middlewareClientMaxBodySize: '150mb', // Deprecated
  },
};

export default nextConfig;
