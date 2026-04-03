import bcrypt from 'bcrypt'
import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const seedCourseSections = [
  {
    title: 'مقدمة في الذكاء الاصطناعي',
    orderIndex: 1,
    lessons: [
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
        isFreePreview: true,
      },
    ],
  },
  {
    title: 'أساسيات بايثون للذكاء الاصطناعي',
    orderIndex: 2,
    lessons: [
      {
        title: 'تجهيز بيئة العمل',
        videoUrl: 'https://example.com/videos/setup',
        orderIndex: 4,
        isFreePreview: true,
      },
      {
        title: 'التعامل مع البيانات باستخدام NumPy',
        videoUrl: 'https://example.com/videos/numpy',
        orderIndex: 5,
        isFreePreview: true,
      },
      {
        title:
          '\u0628\u0646\u0627\u0621 \u0623\u0648\u0644 \u0646\u0645\u0648\u0630\u062c \u062a\u0646\u0628\u0624\u064a',
        videoUrl: 'https://example.com/videos/first-model',
        orderIndex: 6,
        isFreePreview: false,
      },
    ],
  },
] as const

async function ensureSeedCourseContent(courseId: string) {
  for (const sectionDefinition of seedCourseSections) {
    const section = await prisma.section.upsert({
      where: {
        courseId_orderIndex: {
          courseId,
          orderIndex: sectionDefinition.orderIndex,
        },
      },
      update: {
        title: sectionDefinition.title,
      },
      create: {
        courseId,
        title: sectionDefinition.title,
        orderIndex: sectionDefinition.orderIndex,
      },
    })

    for (const lessonDefinition of sectionDefinition.lessons) {
      await prisma.lesson.upsert({
        where: {
          sectionId_orderIndex: {
            sectionId: section.id,
            orderIndex: lessonDefinition.orderIndex,
          },
        },
        update: {
          title: lessonDefinition.title,
          videoUrl: lessonDefinition.videoUrl,
          isFreePreview: lessonDefinition.isFreePreview,
        },
        create: {
          sectionId: section.id,
          title: lessonDefinition.title,
          videoUrl: lessonDefinition.videoUrl,
          orderIndex: lessonDefinition.orderIndex,
          isFreePreview: lessonDefinition.isFreePreview,
        },
      })
    }
  }
}

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

  const course = await prisma.course.upsert({
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
    },
  })

  await ensureSeedCourseContent(course.id)
}

main()
  .catch((error) => {
    console.error('Failed to seed admin user', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
