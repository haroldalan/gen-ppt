import { NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const REGION = process.env.AWS_REGION!;
const BUCKET = process.env.OUTPUT_BUCKET!;
const client = new S3Client({ region: REGION });

export async function GET(
  _req: Request,
  { params }: { params: { run: string } }
) {
  const { run } = params;
  const key = `runs/${run}/frontend_status.json`;

  // Generate a 60s presigned URL
  const url = await getSignedUrl(
    client,
    new GetObjectCommand({ Bucket: BUCKET, Key: key }),
    { expiresIn: 60 }
  );

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    // Let the client keep retrying on 404/403
    return NextResponse.json(
      { error: 'status not ready', code: res.status },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
