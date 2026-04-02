import { expect, test, type Page } from '@playwright/test'

const adminCredentials = {
  email: 'admin@youseflms.com',
  password: 'ChangeMe123!',
}

async function loginAsAdmin(page: Page) {
  await page.goto('/login')
  await page.locator('#login-email').fill(adminCredentials.email)
  await page.locator('#login-password').fill(adminCredentials.password)
  await page.locator('button[type="submit"]').click()
  await expect(page).toHaveURL(/\/admin$/)
}

test.describe('admin orders flow', () => {
  test('admin can open the orders list and navigate to order detail when present', async ({
    page,
  }) => {
    await loginAsAdmin(page)

    await page.locator('aside a[href="/admin/orders"]').click()
    await expect(page).toHaveURL(/\/admin\/orders$/)
    await expect(page.locator('h1')).toHaveCount(1)

    const detailLinks = page.locator('a[href^="/admin/orders/"]')
    const detailCount = await detailLinks.count()

    if (detailCount === 0) {
      await expect(page.locator('table')).toHaveCount(0)
      return
    }

    const firstHref = await detailLinks.first().getAttribute('href')
    expect(firstHref).toBeTruthy()

    await detailLinks.first().click()
    await expect(page).toHaveURL(new RegExp(`${firstHref}.*$`))
    await expect(page.locator('a[href="/admin/orders"]')).toHaveCount(1)
  })
})
