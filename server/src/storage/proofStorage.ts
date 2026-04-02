import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim()
const bucketName = process.env.R2_BUCKET_NAME?.trim()
const region = process.env.R2_BUCKET_REGION?.trim() || 'auto'
const accessKeyId = process.env.CLOUDFLARE_ACCESS_KEY_ID?.trim()
const secretAccessKey = process.env.CLOUDFLARE_SECRET_ACCESS_KEY?.trim()

const r2Client =
  accountId && accessKeyId && secretAccessKey
    ? new S3Client({
        region,
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      })
    : null

function isAbsoluteUrl(value: string) {
  return /^https?:\/\//i.test(value)
}

export async function getSignedProofUrl(proofUrl: string) {
  if (!proofUrl) {
    return ''
  }

  if (isAbsoluteUrl(proofUrl) || !r2Client || !bucketName) {
    return proofUrl
  }

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: proofUrl,
  })

  return getSignedUrl(r2Client, command, {
    expiresIn: 60 * 60,
  })
}
