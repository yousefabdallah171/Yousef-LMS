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

test.describe('admin students and comments flow', () => {
  test('admin can view a student in the roster and open the detail page', async ({
    page,
    request,
  }) => {
    await waitForApiHealth(request)
    const student = await registerStudent(request, `${Date.now()}-students-list`)
    const adminTokens = await loginAsAdmin(request)

    await openPageAsAuthenticatedUser(page, '/admin/students', adminTokens)

    const row = page.locator('tr').filter({ hasText: student.user.email }).first()
    await expect(row).toBeVisible()
    await row.getByRole('link').click()

    await expect(page).toHaveURL(new RegExp(`/admin/students/${student.user.id}$`))
    await expect(page.locator('body')).toContainText(student.user.name)
    await expect(page.locator('body')).toContainText(student.user.email)
  })

  test('admin can delete a lesson comment from moderation page', async ({ page, request }) => {
    await waitForApiHealth(request)
    const suffix = `${Date.now()}-comments`
    const student = await registerStudent(request, suffix)
    const adminTokens = await loginAsAdmin(request)

    const coursesResponse = await request.get(`${apiBaseURL}/api/v1/courses`)
    expect(coursesResponse.ok()).toBeTruthy()
    const coursesPayload = (await coursesResponse.json()) as {
      courses: Array<{ id: string; slug: string }>
    }
    const course = coursesPayload.courses.find((entry) => entry.slug === 'ai-ml-diploma')
    expect(course).toBeTruthy()

    const order = await createOrder(request, student.tokens, course!.id)
    await approveOrder(request, adminTokens, order.id)

    const detailResponse = await request.get(`${apiBaseURL}/api/v1/courses/${course!.slug}`, {
      headers: {
        Authorization: `Bearer ${student.tokens.accessToken}`,
      },
    })
    expect(detailResponse.ok()).toBeTruthy()
    const detailPayload = (await detailResponse.json()) as {
      course: {
        sections: Array<{
          lessons: Array<{ id: string }>
        }>
      }
    }
    const lessonId = detailPayload.course.sections[0]?.lessons[0]?.id
    expect(lessonId).toBeTruthy()

    const commentText = `تعليق إداري ${suffix}`
    const createCommentResponse = await request.post(
      `${apiBaseURL}/api/v1/lessons/${lessonId}/comments`,
      {
        headers: {
          Authorization: `Bearer ${student.tokens.accessToken}`,
        },
        data: {
          content: commentText,
        },
      },
    )
    expect(createCommentResponse.ok()).toBeTruthy()

    await openPageAsAuthenticatedUser(page, '/admin/comments', adminTokens)

    const commentRow = page.locator('tr').filter({ hasText: commentText }).first()
    await expect(commentRow).toBeVisible()
    page.once('dialog', (dialog) => dialog.accept())
    await commentRow.getByRole('button').last().click()
    await expect(page.locator('tr').filter({ hasText: commentText })).toHaveCount(0)

    const commentsResponse = await request.get(`${apiBaseURL}/api/v1/lessons/${lessonId}/comments`)
    expect(commentsResponse.ok()).toBeTruthy()
    const commentsPayload = (await commentsResponse.json()) as {
      comments: Array<{ content: string }>
    }
    expect(commentsPayload.comments.some((comment) => comment.content === commentText)).toBeFalsy()
  })
})
