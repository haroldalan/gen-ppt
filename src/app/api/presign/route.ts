import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { run_id } = await req.json();
  const url = process.env.NEXT_PUBLIC_PRESIGN_URL;

  //   --- DEBUG LOGS ---
  console.log('🔐 PRESIGN_URL env =', url);
  console.log('🔐 run_id =', run_id);
  // --------------------

  if (!url) {
    return NextResponse.json(
      { error: 'PRESIGN_URL not set in .env.local' },
      { status: 500 },
    );
  }

  const lambdaRes = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ run_id }),
  });

  console.log('🔐 Lambda status', lambdaRes.status);

  if (!lambdaRes.ok) {
    const text = await lambdaRes.text();
    console.error('🔐 Lambda error body:', text);
    return NextResponse.json({ error: text }, { status: 500 });
  }

  const { putUrl } = await lambdaRes.json();
  return NextResponse.json({ putUrl });
}
