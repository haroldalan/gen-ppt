import { NextRequest, NextResponse } from 'next/server'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const REGION = process.env.AWS_REGION!
const BUCKET = process.env.OUTPUT_BUCKET!

const s3 = new S3Client({ region: REGION })

export async function GET(
  request: NextRequest,
  { params }: { params: { run: string } }
) {
  const { run } = params
  const prefix = `runs/${run}/previews/`

  const manifestCmd = new GetObjectCommand({
    Bucket: BUCKET,
    Key: `${prefix}manifest.json`,
  })
  const manifestUrl = await getSignedUrl(s3, manifestCmd, { expiresIn: 600 })
  const res = await fetch(manifestUrl)
  if (!res.ok) {
    return NextResponse.json({ error: 'Manifest not found' }, { status: 404 })
  }
  const { slides, pptx } = await res.json()

  const slideUrls = await Promise.all(
    slides.map((fn: string) =>
      getSignedUrl(
        s3,
        new GetObjectCommand({ Bucket: BUCKET, Key: `${prefix}${fn}` }),
        { expiresIn: 600 }
      )
    )
  )

  const pptKey = `runs/${run}/pptx/${pptx}`
  const pptUrl = await getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: BUCKET, Key: pptKey }),
    { expiresIn: 600 }
  )

  return NextResponse.json({ slideUrls, pptUrl })
}
