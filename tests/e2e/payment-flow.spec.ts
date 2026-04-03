import path from 'node:path'

import { expect, test } from '@playwright/test'

test.describe('payment flow', () => {
  test('student can register, upload payment proof, and see a pending order on the dashboard', async ({
    page,
    request,
  }) => {
    let targetCourse: { id: string; title: string } | null = null

    await expect
      .poll(
        async () => {
          try {
            const courseResponse = await request.get('http://localhost:3000/api/v1/courses')

            if (!courseResponse.ok()) {
              return null
            }

            const payload = (await courseResponse.json()) as {
              courses: Array<{
                id: string
                title: string
              }>
            }

            targetCourse = payload.courses[0] ?? null
            return targetCourse?.id ?? null
          } catch {
            return null
          }
        },
        {
          timeout: 60000,
        },
      )
      .not.toBeNull()

    expect(targetCourse).toBeTruthy()

    const timestamp = Date.now()
    const proofFilePath = path.resolve('tests', 'fixtures', 'payment-proof.pdf')

    await page.goto(`/register?returnUrl=${encodeURIComponent(`/payment/${targetCourse!.id}`)}`)
    await page.locator('#register-name').fill(`Student ${timestamp}`)
    await page.locator('#register-email').fill(`student-${timestamp}@example.com`)
    await page.locator('#register-password').fill('ChangeMe123!')
    await page.locator('#register-confirm-password').fill('ChangeMe123!')
    await page.locator('button[type="submit"]').click()

    await expect(page).toHaveURL(new RegExp(`/payment/${targetCourse!.id}$`))

    await page.locator(`a[href="/payment/${targetCourse!.id}/proof"]`).click()
    await expect(page).toHaveURL(new RegExp(`/payment/${targetCourse!.id}/proof$`))

    await page.locator('input[type="file"]').setInputFiles(proofFilePath)
    await page.locator('button[type="submit"]').click()

    await expect(
      page.getByRole('heading', { name: 'تم إرسال الطلب بنجاح' }),
    ).toBeVisible({ timeout: 15000 })

    await page.getByRole('main').getByRole('link', { name: 'لوحة التحكم' }).click()
    await expect(page).toHaveURL(/\/dashboard$/)
    const orderCard = page.locator('div.rounded-2xl', { hasText: targetCourse!.title }).first()
    await expect(orderCard).toBeVisible()
    await expect(orderCard.getByText(/قيد المراجعة/i)).toBeVisible()
  })
})
