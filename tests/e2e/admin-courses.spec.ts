import { expect, test } from '@playwright/test'

import { loginAsAdmin, openPageAsAuthenticatedUser } from './helpers'

test.describe('admin courses flow', () => {
  test('admin can create a course, add curriculum, publish it, and unpublish it again', async ({
    page,
    request,
  }) => {
    const adminTokens = await loginAsAdmin(request)
    const suffix = Date.now().toString()
    const courseTitle = `دورة اختبار ${suffix}`
    const sectionTitle = `مقدمة ${suffix}`
    const lessonTitle = `الدرس الأول ${suffix}`

    await openPageAsAuthenticatedUser(page, '/admin/courses/new', adminTokens)

    await page.locator('#course-title').fill(courseTitle)
    await page
      .locator('#course-description')
      .fill('وصف تجريبي للدورة الجديدة من اختبارات Playwright.')
    await page
      .locator('#course-thumbnail-url')
      .fill('https://images.unsplash.com/photo-1516321318423-f06f85e504b3')
    await page.locator('#course-price').fill('249')

    await page.locator('#save-draft-button').click()
    await expect(page).toHaveURL(/\/admin\/courses\/.+\/edit$/)

    await page.locator('#section-title').fill(sectionTitle)
    await page.locator('#section-order-index').fill('1')
    await page.locator('#add-section-button').click()

    const sectionCard = page.locator('article').filter({ hasText: sectionTitle }).first()
    await expect(sectionCard).toBeVisible()

    await sectionCard.locator('input').nth(0).fill(lessonTitle)
    await sectionCard.locator('input').nth(1).fill('https://www.youtube.com/embed/dQw4w9WgXcQ')
    await sectionCard.locator('textarea').fill('درس تم إنشاؤه من خلال اختبار المتصفح.')
    await sectionCard.locator('button[id^=\"add-lesson-\"]').click()

    await expect(page.locator('body')).toContainText(lessonTitle)

    await page.locator('#publish-course-button').click()

    await page.goto('/courses')
    await expect(page.locator('main')).toContainText(courseTitle)

    await page.goto(`/admin/courses`)
    const row = page.locator('tr').filter({ hasText: courseTitle }).first()
    await expect(row).toBeVisible()
    await row.locator('a').first().click()

    await page.locator('#unpublish-course-button').click()

    await page.goto('/courses')
    await expect(page.locator('main')).not.toContainText(courseTitle)

    await page.goto('/admin/courses')
    await page.locator('tr').filter({ hasText: courseTitle }).first().locator('a').first().click()
    page.once('dialog', (dialog) => dialog.accept())
    await page.locator('#delete-course-button').click()
    await expect(page).toHaveURL(/\/admin\/courses$/)
  })
})
