import { Router } from 'express'

import { prisma } from '../lib/prisma.js'

const coursesRouter = Router()

coursesRouter.get('/', async (_req, res) => {
  const courses = await prisma.course.findMany({
    where: {
      status: 'PUBLISHED',
    },
    include: {
      sections: {
        include: {
          lessons: {
            select: {
              id: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return res.status(200).json({
    courses: courses.map((course) => ({
      id: course.id,
      slug: course.slug,
      title: course.title,
      description: course.description,
      thumbnailUrl: course.thumbnailUrl,
      price: Number(course.price),
      lessonsCount: course.sections.reduce(
        (count, section) => count + section.lessons.length,
        0,
      ),
      createdAt: course.createdAt.toISOString(),
    })),
  })
})

export { coursesRouter }
