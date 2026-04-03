import { expect, test } from '@playwright/test'

import {
  approveOrder,
  createOrder,
  loginAsAdmin,
  openPageAsAuthenticatedUser,
  registerStudent,
  waitForApiHealth,
} from './helpers'

const apiBaseURL = process.env.PLAYWRIGHT_API_URL ?? 'http://localhost:3000'

test.describe('enrolled lesson access flow', () => {
  test('enrolled student can open the paid lesson and progress updates on player and dashboard', async ({
    page,
    request,
  }) => {
    await waitForApiHealth(request)
    const coursesResponse = await request.get(`${apiBaseURL}/api/v1/courses`)
    expect(coursesResponse.ok()).toBeTruthy()
    const coursesPayload = (await coursesResponse.json()) as {
      courses: Array<{
        id: string
        slug: string
      }>
    }
    const course = coursesPayload.courses.find((entry) => entry.slug === 'ai-ml-diploma')
    expect(course).toBeTruthy()
    const student = await registerStudent(request, `${Date.now()}-lesson-access`)
    const adminTokens = await loginAsAdmin(request)
    const order = await createOrder(request, student.tokens, course!.id)

    await approveOrder(request, adminTokens, order.id)

    const courseResponse = await request.get(`${apiBaseURL}/api/v1/courses/${course.slug}`, {
      headers: {
        Authorization: `Bearer ${student.tokens.accessToken}`,
      },
    })
    expect(courseResponse.ok()).toBeTruthy()

    const coursePayload = (await courseResponse.json()) as {
      course: {
        sections: Array<{
          lessons: Array<{
            id: string
            orderIndex: number
            isFreePreview: boolean
            videoUrl?: string
          }>
        }>
      }
      enrollment: {
        enrolled: boolean
      }
    }

    expect(coursePayload.enrollment.enrolled).toBeTruthy()

    const lessons = coursePayload.course.sections.flatMap((section) => section.lessons)
    const paidLesson = lessons.find((lesson) => !lesson.isFreePreview)
    expect(paidLesson).toBeTruthy()
    expect(paidLesson?.isFreePreview).toBeFalsy()
    expect(typeof paidLesson?.videoUrl).toBe('string')

    await openPageAsAuthenticatedUser(
      page,
      `/courses/${course!.slug}/lessons/${paidLesson!.id}`,
      student.tokens,
    )

    await expect(page).toHaveURL(new RegExp(`/courses/${course!.slug}/lessons/${paidLesson!.id}$`))
    await expect(page.locator('iframe')).toHaveAttribute('src', paidLesson!.videoUrl!)
    await expect(
      page.locator(`aside a[href^="/courses/${course!.slug}/lessons/"]`),
    ).toHaveCount(6)
    await expect(page.locator('main')).toContainText('0%')
    await page
      .getByRole('button', {
        name: /ابدأ المشاهدة/i,
      })
      .click()

    await page.waitForTimeout(2_000)
    await page.reload()

    await expect(page.locator('main')).toContainText('تمت المشاهدة')
    await expect(page.locator('main')).toContainText('1 من 6')

    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/dashboard$/)
    await expect(page.getByText('1 / 6')).toBeVisible()
    await expect(page.getByRole('link', { name: 'متابعة التعلم' }).first()).toHaveAttribute(
      'href',
      new RegExp(`/courses/${course!.slug}/lessons/`),
    )
  })
})
