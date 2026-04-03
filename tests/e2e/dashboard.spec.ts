import { expect, test } from '@playwright/test'

import {
  approveOrder,
  createOrder,
  getFirstPublishedCourse,
  loginAsAdmin,
  openPageAsAuthenticatedUser,
  registerStudent,
  rejectOrder,
  waitForApiHealth,
} from './helpers'

test.describe('student dashboard flow', () => {
  test.describe.configure({ mode: 'serial' })

  test('student sees empty dashboard states before any orders or enrollments', async ({
    page,
    request,
  }) => {
    await waitForApiHealth(request)
    const student = await registerStudent(request, `${Date.now()}-empty`)

    await openPageAsAuthenticatedUser(page, '/dashboard', student.tokens)

    const enrollmentsSection = page.locator('section', {
      has: page.getByRole('heading', { name: 'دوراتي' }),
    })
    const ordersSection = page.locator('section', {
      has: page.getByRole('heading', { name: 'طلباتي' }),
    })

    await expect(page).toHaveURL(/\/dashboard$/)
    await expect(page.getByRole('heading', { name: 'لوحة التحكم' })).toBeVisible()
    await expect(enrollmentsSection.getByText('لم تنضم إلى أي دورة بعد')).toBeVisible()
    await expect(ordersSection.getByText('لا توجد طلبات حتى الآن')).toBeVisible()
  })

  test('student sees pending order status on the dashboard after proof submission', async ({
    page,
    request,
  }) => {
    await waitForApiHealth(request)
    const course = await getFirstPublishedCourse(request)
    const student = await registerStudent(request, `${Date.now()}-pending`)

    await createOrder(request, student.tokens, course.id)
    await openPageAsAuthenticatedUser(page, '/dashboard', student.tokens)

    const enrollmentsSection = page.locator('section', {
      has: page.getByRole('heading', { name: 'دوراتي' }),
    })
    const ordersSection = page.locator('section', {
      has: page.getByRole('heading', { name: 'طلباتي' }),
    })
    const pendingOrder = ordersSection.locator('article', { hasText: course.title }).first()

    await expect(page.getByRole('heading', { name: 'طلباتي' })).toBeVisible()
    await expect(pendingOrder).toBeVisible()
    await expect(pendingOrder.getByText('قيد المراجعة')).toBeVisible()
    await expect(enrollmentsSection.getByText('لم تنضم إلى أي دورة بعد')).toBeVisible()
  })

  test('student sees approved order and enrolled course card after admin approval', async ({
    page,
    request,
  }) => {
    await waitForApiHealth(request)
    const course = await getFirstPublishedCourse(request)
    const student = await registerStudent(request, `${Date.now()}-approved`)
    const adminTokens = await loginAsAdmin(request)
    const order = await createOrder(request, student.tokens, course.id)

    await approveOrder(request, adminTokens, order.id)
    await openPageAsAuthenticatedUser(page, '/dashboard', student.tokens)

    const enrollmentsSection = page.locator('section', {
      has: page.getByRole('heading', { name: 'دوراتي' }),
    })
    const ordersSection = page.locator('section', {
      has: page.getByRole('heading', { name: 'طلباتي' }),
    })
    const enrolledCourseCard = enrollmentsSection.locator('article', { hasText: course.title }).first()

    await expect(enrolledCourseCard).toBeVisible()
    await expect(
      enrolledCourseCard.getByRole('link', { name: 'متابعة التعلم' }),
    ).toHaveAttribute('href', new RegExp(`/courses/${course.slug}/lessons/`))
    await expect(ordersSection.getByText('مقبول')).toBeVisible()
    await expect(enrollmentsSection.getByText('لم تنضم إلى أي دورة بعد')).toHaveCount(0)
  })

  test('student sees rejection reason and resubmit action after admin rejection', async ({
    page,
    request,
  }) => {
    await waitForApiHealth(request)
    const course = await getFirstPublishedCourse(request)
    const student = await registerStudent(request, `${Date.now()}-rejected`)
    const adminTokens = await loginAsAdmin(request)
    const order = await createOrder(request, student.tokens, course.id)
    const rejectionReason = 'الملف المرفوع غير واضح'

    await rejectOrder(request, adminTokens, order.id, rejectionReason)
    await openPageAsAuthenticatedUser(page, '/dashboard', student.tokens)

    const ordersSection = page.locator('section', {
      has: page.getByRole('heading', { name: 'طلباتي' }),
    })
    const rejectedOrder = ordersSection.locator('article', { hasText: course.title }).first()

    await expect(rejectedOrder.getByText('مرفوض')).toBeVisible()
    await expect(rejectedOrder.getByText(rejectionReason)).toBeVisible()
    await expect(
      rejectedOrder.getByRole('link', { name: 'إعادة إرسال الإثبات' }),
    ).toHaveAttribute('href', `/payment/${course.id}`)
  })
})
