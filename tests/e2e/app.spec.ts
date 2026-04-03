import { expect, test } from '@playwright/test'

const adminCredentials = {
  email: 'admin@youseflms.com',
  password: 'ChangeMe123!',
}

const apiBaseURL = process.env.PLAYWRIGHT_API_URL ?? 'http://localhost:3000'

test.describe('public flows', () => {
  test('home page renders featured course content from the API', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.locator('main')).toContainText('دبلومة الذكاء الاصطناعي والتعلم الآلي')
    await expect(page.locator('main a[href^="/courses/"]').first()).toBeVisible()
  })

  test('catalog search and sort controls work', async ({ page }) => {
    await page.goto('/courses')

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    const search = page.locator('input[type="search"]')
    await search.fill('الذكاء')
    await expect(page.locator('a[href="/courses/ai-ml-diploma"]').first()).toBeVisible()

    await search.fill('غير موجودة')
    await expect(page.locator('article')).toHaveCount(0)

    await search.fill('')
    await page.locator('select').selectOption('title')
    await expect(page.locator('a[href="/courses/ai-ml-diploma"]').first()).toBeVisible()
  })

  test('protected routes redirect unauthenticated users to login', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login\?returnUrl=%2Fdashboard$/)

    await page.goto('/admin')
    await expect(page).toHaveURL(/\/login\?returnUrl=%2Fadmin$/)
  })

  test('course detail hides locked video URLs for anonymous visitors', async ({
    request,
  }) => {
    const response = await request.get(`${apiBaseURL}/api/v1/courses/ai-ml-diploma`)
    expect(response.ok()).toBeTruthy()

    const payload = (await response.json()) as {
      course: {
        sections: Array<{
          lessons: Array<{
            id: string
            isFreePreview: boolean
            videoUrl?: string
          }>
        }>
      }
      enrollment: {
        enrolled: boolean
      }
    }

    expect(payload.enrollment.enrolled).toBeFalsy()

    const lessons = payload.course.sections.flatMap((section) => section.lessons)
    const previewLessons = lessons.filter((lesson) => lesson.isFreePreview)
    const lockedLessons = lessons.filter((lesson) => !lesson.isFreePreview)

    expect(previewLessons.length).toBe(5)
    expect(lockedLessons.length).toBeGreaterThan(0)
    expect(previewLessons.every((lesson) => typeof lesson.videoUrl === 'string')).toBeTruthy()
    expect(lockedLessons.every((lesson) => lesson.videoUrl === undefined)).toBeTruthy()
  })

  test('course detail page renders preview-first curriculum for anonymous users', async ({
    page,
    request,
  }) => {
    const response = await request.get(`${apiBaseURL}/api/v1/courses/ai-ml-diploma`)
    expect(response.ok()).toBeTruthy()

    const payload = (await response.json()) as {
      course: {
        sections: Array<{
          lessons: Array<{
            id: string
            title: string
            isFreePreview: boolean
          }>
        }>
      }
    }

    const firstPreviewLesson = payload.course.sections
      .flatMap((section) => section.lessons)
      .find((lesson) => lesson.isFreePreview)
    const firstLockedLesson = payload.course.sections
      .flatMap((section) => section.lessons)
      .find((lesson) => !lesson.isFreePreview)

    expect(firstPreviewLesson).toBeTruthy()
    expect(firstLockedLesson).toBeTruthy()

    await page.goto('/courses/ai-ml-diploma')

    await expect(page).toHaveURL(/\/courses\/ai-ml-diploma$/)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('link', { name: 'مشاهدة الدروس المجانية' })).toBeVisible()
    await expect(
      page.getByRole('button', { name: new RegExp(firstLockedLesson!.title) }),
    ).toBeVisible()
  })

  test('last free preview lesson opens purchase modal for the next paid lesson', async ({
    page,
  }) => {
    const courseResponse = await page.request.get(`${apiBaseURL}/api/v1/courses/ai-ml-diploma`)
    expect(courseResponse.ok()).toBeTruthy()

    const coursePayload = (await courseResponse.json()) as {
      course: {
        sections: Array<{
          lessons: Array<{
            id: string
            title: string
            orderIndex: number
            isFreePreview: boolean
          }>
        }>
      }
    }

    const lessons = coursePayload.course.sections.flatMap((section) => section.lessons)
    const lastPreviewLesson = lessons.filter((lesson) => lesson.isFreePreview).at(-1)
    const firstLockedLesson = lessons.find((lesson) => !lesson.isFreePreview)

    expect(lastPreviewLesson).toBeTruthy()
    expect(firstLockedLesson).toBeTruthy()

    await page.goto(`/courses/ai-ml-diploma/lessons/${lastPreviewLesson!.id}`)

    await expect(page).toHaveURL(
      new RegExp(`/courses/ai-ml-diploma/lessons/${lastPreviewLesson!.id}$`),
    )
    await expect(page.locator('iframe')).toBeVisible()
    await expect(page.getByRole('button').last()).toBeVisible()

    await page.getByRole('button').last().click()

    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByRole('dialog')).toContainText(firstLockedLesson!.title)
    await expect(page).toHaveURL(
      new RegExp(`/courses/ai-ml-diploma/lessons/${lastPreviewLesson!.id}$`),
    )
  })

  test('locked lesson route for anonymous users renders the enrollment-required fallback', async ({
    page,
  }) => {
    const courseResponse = await page.request.get(`${apiBaseURL}/api/v1/courses/ai-ml-diploma`)
    expect(courseResponse.ok()).toBeTruthy()

    const coursePayload = (await courseResponse.json()) as {
      course: {
        sections: Array<{
          lessons: Array<{
            id: string
            isFreePreview: boolean
          }>
        }>
      }
    }

    const firstLockedLesson = coursePayload.course.sections
      .flatMap((section) => section.lessons)
      .find((lesson) => !lesson.isFreePreview)

    expect(firstLockedLesson).toBeTruthy()

    await page.goto(`/courses/ai-ml-diploma/lessons/${firstLockedLesson!.id}`)

    await expect(page).toHaveURL(
      new RegExp(`/courses/ai-ml-diploma/lessons/${firstLockedLesson!.id}$`),
    )
    await expect(page.locator('iframe')).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'إعادة تحميل الدرس' })).toBeVisible()
    await expect(page.locator('main')).toContainText('المسجلين')
  })
})

test.describe('admin flow', () => {
  test('admin can enter the admin area and see admin chrome', async ({ page }) => {
    await page.goto('/login')
    await page.locator('#login-email').fill(adminCredentials.email)
    await page.locator('#login-password').fill(adminCredentials.password)
    await page.locator('button[type="submit"]').click()

    await expect(page).toHaveURL(/\/admin$/)
    const adminAside = page.getByRole('complementary')
    await expect(adminAside).toBeVisible()
    await expect(adminAside.getByRole('link', { name: 'نظرة عامة' })).toBeVisible()
    await expect(adminAside.locator('a[href="/admin/courses"]')).toBeVisible()
  })
})
