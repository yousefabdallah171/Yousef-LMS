import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

type UploadableProofFile = {
  buffer: Buffer
  originalname: string
  mimetype: string
}

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim()
const bucketName = process.env.R2_BUCKET_NAME?.trim()
const region = process.env.R2_BUCKET_REGION?.trim() || 'auto'
const accessKeyId = process.env.CLOUDFLARE_ACCESS_KEY_ID?.trim()
const secretAccessKey = process.env.CLOUDFLARE_SECRET_ACCESS_KEY?.trim()
const localUploadPrefix = '/uploads/'
const localUploadRoute = '/uploads/local'
const localProofRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  '.runtime',
  'proofs',
)

const r2Client =
  accountId && accessKeyId && secretAccessKey && bucketName && accountId !== 'local-dev'
    ? new S3Client({
        region,
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      })
    : null

function getFileExtension(mimeType: string) {
  if (mimeType === 'image/jpeg') {
    return 'jpg'
  }

  if (mimeType === 'image/png') {
    return 'png'
  }

  return 'pdf'
}

function getServerOrigin() {
  if (process.env.SERVER_PUBLIC_URL?.trim()) {
    return process.env.SERVER_PUBLIC_URL.trim().replace(/\/+$/, '')
  }

  const port = process.env.PORT?.trim() || '3000'
  return `http://localhost:${port}`
}

function getLocalProofUrl(relativePath: string) {
  return `${getServerOrigin()}${relativePath}`
}

function getProofSigningSecret() {
  return process.env.PROOF_URL_SECRET?.trim() || process.env.JWT_SECRET?.trim() || 'local-proof-secret'
}

function signLocalProofPath(relativePath: string, expiresAt: string) {
  return createHmac('sha256', getProofSigningSecret())
    .update(`${relativePath}:${expiresAt}`)
    .digest('hex')
}

function getLocalProofPath(relativePath: string) {
  const normalizedRelativePath = relativePath
    .replace(/^\/uploads\/?/, '')
    .replace(/\//g, path.sep)
  const resolvedPath = path.resolve(localProofRoot, normalizedRelativePath)
  const relativeToRoot = path.relative(localProofRoot, resolvedPath)

  if (relativeToRoot.startsWith('..') || path.isAbsolute(relativeToRoot)) {
    return null
  }

  return resolvedPath
}

function getSignedLocalProofUrl(relativePath: string, expiresInSeconds: number) {
  const expiresAt = `${Math.floor(Date.now() / 1000) + expiresInSeconds}`
  const signature = signLocalProofPath(relativePath, expiresAt)
  const filename = path.basename(relativePath)
  const searchParams = new URLSearchParams({
    path: relativePath,
    exp: expiresAt,
    sig: signature,
  })

  return getLocalProofUrl(
    `${localUploadRoute}/${encodeURIComponent(filename)}?${searchParams.toString()}`,
  )
}

async function ensureLocalProofDir(directory: string) {
  await fs.mkdir(directory, { recursive: true })
}

export function getLocalProofRoot() {
  return localProofRoot
}

export async function uploadProofFile(file: UploadableProofFile, orderId: string) {
  const extension = getFileExtension(file.mimetype)
  const objectKey = `proofs/${orderId}/${randomUUID()}.${extension}`

  if (!r2Client || !bucketName) {
    const relativePath = `/uploads/${objectKey}`
    const targetPath = getLocalProofPath(relativePath)

    if (!targetPath) {
      throw new Error('Failed to resolve local proof storage path')
    }

    await ensureLocalProofDir(path.dirname(targetPath))
    await fs.writeFile(targetPath, file.buffer)

    return relativePath
  }

  await r2Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentDisposition: `inline; filename="${file.originalname}"`,
    }),
  )

  return objectKey
}

export async function generateSignedUrl(objectKey: string, expiresInSeconds = 60 * 60) {
  if (!objectKey) {
    return ''
  }

  if (objectKey.startsWith(localUploadPrefix)) {
    return getSignedLocalProofUrl(objectKey, expiresInSeconds)
  }

  if (!r2Client || !bucketName) {
    return objectKey
  }

  return getSignedUrl(
    r2Client,
    new GetObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    }),
    { expiresIn: expiresInSeconds },
  )
}

export async function deleteProofFile(objectKey: string) {
  if (!objectKey) {
    return
  }

  if (objectKey.startsWith(localUploadPrefix)) {
    const localProofPath = getLocalProofPath(objectKey)

    if (!localProofPath) {
      return
    }

    await fs.rm(localProofPath, { force: true })
    return
  }

  if (!r2Client || !bucketName) {
    return
  }

  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    }),
  )
}

export function verifyLocalProofAccess(relativePath: string, expiresAt: string, signature: string) {
  if (!relativePath.startsWith(localUploadPrefix) || !/^\d+$/.test(expiresAt) || !signature) {
    return false
  }

  const expiresAtSeconds = Number(expiresAt)

  if (!Number.isFinite(expiresAtSeconds) || expiresAtSeconds < Math.floor(Date.now() / 1000)) {
    return false
  }

  const expectedSignature = signLocalProofPath(relativePath, expiresAt)
  const providedSignature = Buffer.from(signature, 'hex')
  const expectedSignatureBuffer = Buffer.from(expectedSignature, 'hex')

  if (providedSignature.length !== expectedSignatureBuffer.length) {
    return false
  }

  return timingSafeEqual(providedSignature, expectedSignatureBuffer)
}

export function resolveLocalProofPath(relativePath: string) {
  return getLocalProofPath(relativePath)
}
