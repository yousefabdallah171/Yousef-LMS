import type { NextFunction, Request, Response } from 'express'
import type { ZodType } from 'zod'
import { ZodError } from 'zod'

export function validate<T>(schema: ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const fields = Object.fromEntries(
          error.issues.map((issue) => [
            issue.path.join('.') || 'root',
            issue.message,
          ]),
        )

        return res.status(422).json({
          code: 'VALIDATION_ERROR',
          message: 'Request validation failed',
          details: {
            fields,
          },
        })
      }

      return next(error)
    }
  }
}
