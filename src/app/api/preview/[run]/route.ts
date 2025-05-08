import { NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const REGION = process.env.AWS_REGION!;
const BUCKET = process.env.OUTPUT_BUCKET!;
const s3 = new S3Client({ region: REGION });

export async function GET(
  _req: Request,
  context: { params: Promise<{ run: string }> }
) {
  const { run } = await context.params;
  const prefix = `runs/${run}/previews/`;

  try {
    const manifestUrl = await getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: BUCKET,
        Key: `${prefix}manifest.json`,
      }),
      { expiresIn: 60 }
    );

    const manifestRes = await fetch(manifestUrl);
    const manifest = await manifestRes.json();
    const files = Array.isArray(manifest) ? manifest : manifest.files ?? [];

    const signedUrls = await Promise.all(
      files.map((file: string) =>
        getSignedUrl(
          s3,
          new GetObjectCommand({ Bucket: BUCKET, Key: `${prefix}${file}` }),
          { expiresIn: 60 }
        )
      )
    );

    return NextResponse.json({ slides: signedUrls });
  } catch (err) {
    console.error('❌ Preview fetch failed:', err);
    return NextResponse.json({ error: 'Preview fetch failed' }, { status: 500 });
  }
}
