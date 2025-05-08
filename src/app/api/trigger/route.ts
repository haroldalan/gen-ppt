import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();              // { run_id: 'uuid' }
  const url  = process.env.NEXT_PUBLIC_GENERATE_URL!;

  const aws = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!aws.ok) {
    const txt = await aws.text();
    return NextResponse.json({ error: txt }, { status: 500 });
  }

  const data = await aws.json();
  return NextResponse.json(data);             // { executionArn: … }
}
