import multer from 'multer'
import type { NextFunction, Request, Response } from 'express'

const MAX_PROOF_SIZE_BYTES = 5 * 1024 * 1024

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_PROOF_SIZE_BYTES,
    files: 1,
  },
})

function getDetectedMimeType(buffer: Buffer) {
  if (buffer.length >= 2 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    return 'image/jpeg'
  }

  if (
    buffer.length >= 4 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return 'image/png'
  }

  if (
    buffer.length >= 4 &&
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46
  ) {
    return 'application/pdf'
  }

  return null
}

export const proofUploadMiddleware = upload.single('proofFile')

export function handleProofUploadErrors(
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
    return res.status(422).json({
      code: 'FILE_TOO_LARGE',
      message: 'File exceeds the maximum size of 5MB',
      details: {
        maxSize: '5MB',
      },
    })
  }

  return next(error)
}

export function validateProofFile(req: Request, res: Response, next: NextFunction) {
  const file = req.file

  if (!file) {
    return res.status(422).json({
      code: 'VALIDATION_ERROR',
      message: 'Request validation failed',
      details: {
        fields: {
          proofFile: 'Payment proof file is required',
        },
      },
    })
  }

  const detectedMimeType = getDetectedMimeType(file.buffer)

  if (!detectedMimeType) {
    return res.status(422).json({
      code: 'INVALID_FILE_TYPE',
      message: 'Only JPG, PNG, and PDF files are allowed',
      details: {
        mimeType: file.mimetype || 'application/octet-stream',
      },
    })
  }

  file.mimetype = detectedMimeType
  return next()
}
