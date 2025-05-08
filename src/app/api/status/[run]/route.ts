import { NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const REGION = process.env.AWS_REGION!;
const BUCKET = process.env.OUTPUT_BUCKET!;
const ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID!;
const SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY!;

const client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
});

// Handle CORS preflight requests
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}

export async function GET(
  _req: Request,
  { params }: { params: { run: string } }
) {
  const { run } = params;
  const key = `runs/${run}/frontend_status.json`;

  try {
    // Generate a 60s presigned URL
    const url = await getSignedUrl(
      client,
      new GetObjectCommand({ Bucket: BUCKET, Key: key }),
      { expiresIn: 60 }
    );

    const res = await fetch(url, { cache: 'no-store' });

    if (!res.ok) {
      console.error(`Status fetch failed: ${res.status}`);
      // Let the client keep retrying on 404/403
      return NextResponse.json(
        { error: 'status not ready', code: res.status },
        {
          status: res.status,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Error accessing S3:', error);
    return NextResponse.json(
      { error: 'Failed to access S3' },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  }
}
