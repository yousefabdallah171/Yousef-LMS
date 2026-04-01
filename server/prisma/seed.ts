import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || 'ChangeMe123!',
    12,
  )

  await prisma.user.upsert({
    where: {
      email: process.env.ADMIN_EMAIL || 'admin@youseflms.com',
    },
    update: {
      name: 'Yousef Abdallah',
      role: 'ADMIN',
      passwordHash,
    },
    create: {
      name: 'Yousef Abdallah',
      email: process.env.ADMIN_EMAIL || 'admin@youseflms.com',
      passwordHash,
      role: 'ADMIN',
    },
  })
}

main()
  .catch((error) => {
    console.error('Failed to seed admin user', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
