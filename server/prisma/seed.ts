import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'
import { Prisma } from '@prisma/client'

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

  await prisma.course.upsert({
    where: {
      slug: 'ai-ml-diploma',
    },
    update: {
      title: 'دبلومة الذكاء الاصطناعي والتعلم الآلي',
      description:
        'مسار عملي يغطي أساسيات الذكاء الاصطناعي والتعلم الآلي وبناء التطبيقات الذكية باللغة العربية.',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
      price: new Prisma.Decimal(199),
      status: 'PUBLISHED',
      sections: {
        deleteMany: {},
        create: [
          {
            title: 'مقدمة في الذكاء الاصطناعي',
            orderIndex: 1,
            lessons: {
              create: [
                {
                  title: 'ما هو الذكاء الاصطناعي؟',
                  videoUrl: 'https://example.com/videos/intro-ai',
                  orderIndex: 1,
                  isFreePreview: true,
                },
                {
                  title: 'أنواع التعلم الآلي',
                  videoUrl: 'https://example.com/videos/ml-types',
                  orderIndex: 2,
                  isFreePreview: true,
                },
                {
                  title: 'تطبيقات عملية في السوق',
                  videoUrl: 'https://example.com/videos/market-apps',
                  orderIndex: 3,
                  isFreePreview: false,
                },
              ],
            },
          },
          {
            title: 'أساسيات بايثون للذكاء الاصطناعي',
            orderIndex: 2,
            lessons: {
              create: [
                {
                  title: 'تجهيز بيئة العمل',
                  videoUrl: 'https://example.com/videos/setup',
                  orderIndex: 1,
                  isFreePreview: false,
                },
                {
                  title: 'التعامل مع البيانات باستخدام NumPy',
                  videoUrl: 'https://example.com/videos/numpy',
                  orderIndex: 2,
                  isFreePreview: false,
                },
              ],
            },
          },
        ],
      },
    },
    create: {
      slug: 'ai-ml-diploma',
      title: 'دبلومة الذكاء الاصطناعي والتعلم الآلي',
      description:
        'مسار عملي يغطي أساسيات الذكاء الاصطناعي والتعلم الآلي وبناء التطبيقات الذكية باللغة العربية.',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
      price: new Prisma.Decimal(199),
      status: 'PUBLISHED',
      sections: {
        create: [
          {
            title: 'مقدمة في الذكاء الاصطناعي',
            orderIndex: 1,
            lessons: {
              create: [
                {
                  title: 'ما هو الذكاء الاصطناعي؟',
                  videoUrl: 'https://example.com/videos/intro-ai',
                  orderIndex: 1,
                  isFreePreview: true,
                },
                {
                  title: 'أنواع التعلم الآلي',
                  videoUrl: 'https://example.com/videos/ml-types',
                  orderIndex: 2,
                  isFreePreview: true,
                },
                {
                  title: 'تطبيقات عملية في السوق',
                  videoUrl: 'https://example.com/videos/market-apps',
                  orderIndex: 3,
                  isFreePreview: false,
                },
              ],
            },
          },
          {
            title: 'أساسيات بايثون للذكاء الاصطناعي',
            orderIndex: 2,
            lessons: {
              create: [
                {
                  title: 'تجهيز بيئة العمل',
                  videoUrl: 'https://example.com/videos/setup',
                  orderIndex: 1,
                  isFreePreview: false,
                },
                {
                  title: 'التعامل مع البيانات باستخدام NumPy',
                  videoUrl: 'https://example.com/videos/numpy',
                  orderIndex: 2,
                  isFreePreview: false,
                },
              ],
            },
          },
        ],
      },
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
