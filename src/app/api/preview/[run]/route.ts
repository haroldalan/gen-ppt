import { NextResponse } from 'next/server'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const REGION = process.env.AWS_REGION!
const BUCKET = process.env.OUTPUT_BUCKET!   // must be set in .env.local

const s3 = new S3Client({ region: REGION })

export async function GET(
  request: Request,
  context: { params: { run: string } }
) {
  const { run } = context.params
  const prefix = `runs/${run}/previews/`

  // fetch manifest.json
  const manifestCmd = new GetObjectCommand({
    Bucket: BUCKET,
    Key:    `${prefix}manifest.json`,
  })
  const manifestUrl = await getSignedUrl(s3, manifestCmd, { expiresIn: 600 })
  const res = await fetch(manifestUrl)
  if (!res.ok) {
    return NextResponse.json({ error: 'Manifest not found' }, { status: 404 })
  }
  const { slides, pptx } = (await res.json()) as {
    slides: string[]
    pptx:   string
  }

  // presign slide images
  const slideUrls = await Promise.all(
    slides.map((fn) =>
      getSignedUrl(
        s3,
        new GetObjectCommand({ Bucket: BUCKET, Key: `${prefix}${fn}` }),
        { expiresIn: 600 }
      )
    )
  )

  // presign the PPTX file
  const pptKey = `runs/${run}/pptx/${pptx}`
  const pptUrl = await getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: BUCKET, Key: pptKey }),
    { expiresIn: 600 }
  )

  return NextResponse.json({ slideUrls, pptUrl })
}