import { S3Client } from '@aws-sdk/client-s3';

// Validate required environment variables
if (!process.env.R2_ACCESS_KEY_ID) {
    throw new Error('R2_ACCESS_KEY_ID environment variable is required');
}

if (!process.env.R2_SECRET_ACCESS_KEY) {
    throw new Error('R2_SECRET_ACCESS_KEY environment variable is required');
}

if (!process.env.R2_ACCOUNT_ID) {
    throw new Error('R2_ACCOUNT_ID environment variable is required');
}

if (!process.env.R2_BUCKET_NAME) {
    throw new Error('R2_BUCKET_NAME environment variable is required');
}

// Initialize S3 Client for Cloudflare R2
export const r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
});

// Export bucket name for convenience
export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

export default r2Client;
