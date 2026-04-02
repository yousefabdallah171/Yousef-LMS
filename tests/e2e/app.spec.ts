import { expect, test } from '@playwright/test'

const adminCredentials = {
  email: 'admin@youseflms.com',
  password: 'ChangeMe123!',
}

test.describe('public flows', () => {
  test('home page renders featured content from the API', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'تعلم البرمجة',
    )
    await expect(page.getByRole('heading', { name: 'الدورات المميزة' })).toBeVisible()
    await expect(
      page.getByRole('heading', {
        name: 'دبلومة الذكاء الاصطناعي والتعلم الآلي',
      }),
    ).toBeVisible()
    await expect(page.getByText('5 درس')).toBeVisible()
    await expect(page.getByText('مهندس فول ستاك')).toBeVisible()
  })

  test('catalog search and sort controls work', async ({ page }) => {
    await page.goto('/courses')

    await expect(
      page.getByRole('heading', { name: 'مكتبة الدورات' }),
    ).toBeVisible()

    const search = page.getByRole('searchbox', { name: 'ابحث عن دورة' })
    await search.fill('الذكاء')
    await expect(
      page.getByRole('heading', {
        name: 'دبلومة الذكاء الاصطناعي والتعلم الآلي',
      }),
    ).toBeVisible()

    await search.fill('غير موجودة')
    await expect(page.getByText('لا توجد دورات منشورة حالياً')).toBeVisible()

    await search.fill('')
    await page.locator('select').selectOption('title')
    await expect(
      page.getByRole('heading', {
        name: 'دبلومة الذكاء الاصطناعي والتعلم الآلي',
      }),
    ).toBeVisible()
  })

  test('protected routes redirect unauthenticated users to login', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login$/)

    await page.goto('/admin')
    await expect(page).toHaveURL(/\/login$/)
  })

  test('course detail hides locked video URLs for anonymous visitors', async ({
    request,
  }) => {
    const response = await request.get('http://localhost:3000/api/v1/courses/ai-ml-diploma')
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

    expect(previewLessons.length).toBeGreaterThan(0)
    expect(lockedLessons.length).toBeGreaterThan(0)
    expect(previewLessons.every((lesson) => typeof lesson.videoUrl === 'string')).toBeTruthy()
    expect(lockedLessons.every((lesson) => lesson.videoUrl === undefined)).toBeTruthy()
  })

  test('course detail page renders preview-first curriculum for anonymous users', async ({
    page,
  }) => {
    await page.goto('/courses/ai-ml-diploma')

    await expect(page).toHaveURL(/\/courses\/ai-ml-diploma$/)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('heading', { level: 2 })).toHaveCount(1)
    await expect(page.getByRole('link', { name: /مشاهدة الدروس المجانية/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /تطبيقات عملية في السوق/i })).toBeVisible()
  })

  test('preview lesson page renders video and opens purchase modal for locked next lesson', async ({
    page,
  }) => {
    const courseResponse = await page.request.get(
      'http://localhost:3000/api/v1/courses/ai-ml-diploma',
    )
    expect(courseResponse.ok()).toBeTruthy()

    const coursePayload = (await courseResponse.json()) as {
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

    const lessons = coursePayload.course.sections.flatMap((section) => section.lessons)
    const secondPreviewLesson = lessons.filter((lesson) => lesson.isFreePreview)[1]
    const firstLockedLesson = lessons.find((lesson) => !lesson.isFreePreview)

    expect(secondPreviewLesson).toBeTruthy()
    expect(firstLockedLesson).toBeTruthy()

    await page.goto(`/courses/ai-ml-diploma/lessons/${secondPreviewLesson!.id}`)

    await expect(page).toHaveURL(
      new RegExp(`/courses/ai-ml-diploma/lessons/${secondPreviewLesson!.id}$`),
    )
    await expect(page.locator('iframe')).toHaveAttribute('src', /example\.com\/videos\/ml-types/)
    await expect(page.getByRole('button', { name: /الدرس التالي/i })).toBeVisible()

    await page.getByRole('button', { name: /الدرس التالي/i }).click()

    await expect(
      page.getByRole('heading', { name: /أكمل الشراء للمتابعة/i }),
    ).toBeVisible()
    await expect(
      page.getByRole('dialog').getByText(new RegExp(firstLockedLesson!.title)),
    ).toBeVisible()
    await expect(page).toHaveURL(
      new RegExp(`/courses/ai-ml-diploma/lessons/${secondPreviewLesson!.id}$`),
    )
  })

  test('locked lesson route returns the enrollment-required state for anonymous users', async ({
    page,
  }) => {
    const courseResponse = await page.request.get(
      'http://localhost:3000/api/v1/courses/ai-ml-diploma',
    )
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
    await expect(page.getByRole('heading', { name: /مقفل/i })).toBeVisible()
    await expect(page.getByText(/هذا الدرس متاح فقط للطلاب المسجلين/i)).toBeVisible()
  })
})

test.describe('admin flow', () => {
  test('admin can enter the admin area and see Arabic chrome', async ({
    page,
    request,
  }) => {
    const response = await request.post('http://localhost:3000/api/v1/auth/login', {
      data: adminCredentials,
    })
    expect(response.ok()).toBeTruthy()

    const auth = (await response.json()) as {
      accessToken: string
      refreshToken: string
    }

    await page.addInitScript((tokens) => {
      window.localStorage.setItem('yousef_lms.refresh_token', tokens.refreshToken)
      window.sessionStorage.clear()
    }, auth)

    await page.route('**/api/v1/auth/refresh', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(auth),
      })
    })

    await page.goto('/admin')

    await expect(page).toHaveURL(/\/admin$/)
    await expect(page.getByText('لوحة الإدارة')).toBeVisible()
    const adminAside = page.getByRole('complementary')
    await expect(adminAside.getByRole('link', { name: 'نظرة عامة' })).toBeVisible()
    await expect(adminAside.getByRole('link', { name: 'الدورات' })).toBeVisible()
    await expect(adminAside.getByRole('button', { name: /فاتح|داكن/ })).toBeVisible()
  })
})
