import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || '7bd147285e9aa78fe2ebf672f583d63b';
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '4d37a2a0732e620c6b9dff97407f00e3';
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || 'f8b3d117d572d9452fb9a839b23440d064010bf0d353c53f88253f9b0ea832ae';
const bucketName = process.env.CLOUDFLARE_R2_BUCKET || 'tehranroom-hotels';
const publicDomain = process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN || 'https://pub-21796cddad1240e5a3025e20598a025b.r2.dev';

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export async function uploadToR2(
  fileBuffer: Buffer,
  originalFilename: string,
  folder: 'hotels' | 'rooms' | 'receipts' | 'general' = 'general',
  contentType: string = 'image/jpeg'
): Promise<{ url: string; key: string }> {
  const cleanName = originalFilename.replace(/[^a-zA-Z0-9.-]/g, '_');
  const key = `${folder}/${Date.now()}_${cleanName}`;

  await r2Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    })
  );

  const url = `${publicDomain}/${key}`;
  return { url, key };
}

