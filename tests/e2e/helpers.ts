import fs from 'node:fs'
import path from 'node:path'

import type { APIRequestContext, Page } from '@playwright/test'
import { expect } from '@playwright/test'

const apiBaseURL = process.env.PLAYWRIGHT_API_URL ?? 'http://localhost:3000'
const tokenStorageKey = 'yousef-lms.auth-tokens'
const proofFileBuffer = fs.readFileSync(
  path.resolve('tests', 'fixtures', 'payment-proof.pdf'),
)

type AuthTokens = {
  accessToken: string
  refreshToken: string
}

type CourseSummary = {
  id: string
  slug: string
  title: string
}

export async function getFirstPublishedCourse(request: APIRequestContext) {
  const response = await request.get(`${apiBaseURL}/api/v1/courses`)

  if (!response.ok()) {
    throw new Error(`Failed to fetch courses: ${response.status()}`)
  }

  const payload = (await response.json()) as {
    courses: CourseSummary[]
  }

  const course = payload.courses[0]

  if (!course) {
    throw new Error('No published course is available for Playwright setup')
  }

  return course
}

export async function waitForApiHealth(request: APIRequestContext) {
  await expect
    .poll(
      async () => {
        try {
          const response = await request.get(`${apiBaseURL}/health`)
          return response.ok()
        } catch {
          return false
        }
      },
      {
        timeout: 60_000,
      },
    )
    .toBeTruthy()
}

export async function registerStudent(request: APIRequestContext, suffix: string) {
  const email = `student-${suffix}@example.com`
  const password = 'ChangeMe123!'
  const response = await request.post(`${apiBaseURL}/api/v1/auth/register`, {
    data: {
      name: `Student ${suffix}`,
      email,
      password,
    },
  })

  if (!response.ok()) {
    throw new Error(`Failed to register student: ${response.status()}`)
  }

  const payload = (await response.json()) as AuthTokens & {
    user: {
      id: string
      email: string
      name: string
    }
  }

  return {
    email,
    password,
    user: payload.user,
    tokens: {
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
    },
  }
}

export async function loginAsAdmin(request: APIRequestContext) {
  const response = await request.post(`${apiBaseURL}/api/v1/auth/login`, {
    data: {
      email: 'admin@youseflms.com',
      password: 'ChangeMe123!',
    },
  })

  if (!response.ok()) {
    throw new Error(`Failed to login as admin: ${response.status()}`)
  }

  const payload = (await response.json()) as AuthTokens

  return payload
}

export async function createOrder(
  request: APIRequestContext,
  tokens: AuthTokens,
  courseId: string,
) {
  const response = await request.post(`${apiBaseURL}/api/v1/orders`, {
    headers: {
      Authorization: `Bearer ${tokens.accessToken}`,
    },
    multipart: {
      courseId,
      proofFile: {
        name: 'payment-proof.pdf',
        mimeType: 'application/pdf',
        buffer: proofFileBuffer,
      },
    },
  })

  if (!response.ok()) {
    throw new Error(`Failed to create order: ${response.status()}`)
  }

  const payload = (await response.json()) as {
    order: {
      id: string
      courseId: string
      status: string
    }
  }

  return payload.order
}

export async function approveOrder(
  request: APIRequestContext,
  adminTokens: AuthTokens,
  orderId: string,
) {
  const response = await request.post(`${apiBaseURL}/api/v1/admin/orders/${orderId}/approve`, {
    headers: {
      Authorization: `Bearer ${adminTokens.accessToken}`,
    },
  })

  if (!response.ok()) {
    throw new Error(`Failed to approve order: ${response.status()}`)
  }
}

export async function rejectOrder(
  request: APIRequestContext,
  adminTokens: AuthTokens,
  orderId: string,
  reason: string,
) {
  const response = await request.post(`${apiBaseURL}/api/v1/admin/orders/${orderId}/reject`, {
    headers: {
      Authorization: `Bearer ${adminTokens.accessToken}`,
    },
    data: {
      reason,
    },
  })

  if (!response.ok()) {
    throw new Error(`Failed to reject order: ${response.status()}`)
  }
}

export async function openPageAsAuthenticatedUser(
  page: Page,
  targetPath: string,
  tokens: AuthTokens,
) {
  await page.addInitScript(
    ({ key, value }) => {
      window.sessionStorage.setItem(key, value)
    },
    {
      key: tokenStorageKey,
      value: JSON.stringify(tokens),
    },
  )

  await page.goto(targetPath)
}
