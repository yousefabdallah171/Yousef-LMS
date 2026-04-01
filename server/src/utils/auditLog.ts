import type { Prisma } from '@prisma/client'

import { prisma } from '../lib/prisma.js'

export async function logAdminAction(
  adminId: string,
  actionType: string,
  targetEntity: string,
  targetId: string,
  details?: Prisma.InputJsonValue,
) {
  return prisma.auditLog.create({
    data: {
      adminId,
      actionType,
      targetEntity,
      targetId,
      details,
    },
  })
}
