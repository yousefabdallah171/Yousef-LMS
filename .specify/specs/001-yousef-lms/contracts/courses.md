# API Contract: Courses

**Versioned**: `/api/v1/courses*`, `/api/v1/admin/courses*`

---

## GET /api/v1/courses

List all published courses (public, no auth required).

**Auth**: None

**Response 200**:
```json
{
  "courses": [
    {
      "id": "uuid",
      "slug": "string",
      "title": "string (Arabic)",
      "description": "string (HTML, Arabic)",
      "thumbnailUrl": "string (URL)",
      "price": 299.99,
      "lessonsCount": 12,
      "createdAt": "2026-04-01T00:00:00Z"
    }
  ]
}
```

**Response 200 — Empty**:
```json
{
  "courses": []
}
```

---

## GET /api/v1/courses/:slug

Get course detail with full lesson list (public, no auth required).

**Auth**: None

**Response 200**:
```json
{
  "course": {
    "id": "uuid",
    "slug": "string",
    "title": "string (Arabic)",
    "description": "string (HTML, Arabic)",
    "thumbnailUrl": "string",
    "price": 299.99,
    "status": "published",
    "sections": [
      {
        "id": "uuid",
        "title": "string (Arabic)",
        "orderIndex": 1,
        "lessons": [
          {
            "id": "uuid",
            "title": "string (Arabic)",
            "orderIndex": 1,
            "isFreePreview": true,
            "videoUrl": "string (external host URL)"
          },
          {
            "id": "uuid",
            "title": "string (Arabic)",
            "orderIndex": 6,
            "isFreePreview": false,
            "videoUrl": "string"
          }
        ]
      }
    ]
  },
  "enrollment": {
    "enrolled": false,
    "enrollmentId": "uuid or null"
  }
}
```

**Response 404 — Not Found**:
```json
{
  "code": "COURSE_NOT_FOUND",
  "message": "Course not found or not published"
}
```

---

## POST /api/v1/admin/courses

Create a new course (admin only).

**Auth**: Bearer JWT (role = admin required)

**Request**:
```json
{
  "title": "string (Arabic, required)",
  "description": "string (HTML, Arabic, required)",
  "thumbnailUrl": "string (URL, required)",
  "price": 299.99
}
```

**Response 201**:
```json
{
  "course": {
    "id": "uuid",
    "slug": "auto-generated",
    "title": "string",
    "description": "string",
    "thumbnailUrl": "string",
    "price": 299.99,
    "status": "draft",
    "createdAt": "2026-04-01T00:00:00Z"
  }
}
```

**Response 403 — Forbidden**:
```json
{
  "code": "FORBIDDEN",
  "message": "Admin role required"
}
```

**Response 422 — Validation Error**:
```json
{
  "code": "VALIDATION_ERROR",
  "message": "Request validation failed",
  "details": {
    "fields": {
      "title": "Title is required",
      "price": "Price must be a number"
    }
  }
}
```

---

## PUT /api/v1/admin/courses/:id

Update course (admin only).

**Auth**: Bearer JWT (role = admin)

**Request**:
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "thumbnailUrl": "string (optional)",
  "price": 299.99
}
```

**Response 200**:
```json
{
  "course": {
    "id": "uuid",
    "slug": "string",
    "title": "string",
    "description": "string",
    "thumbnailUrl": "string",
    "price": 299.99,
    "status": "draft or published",
    "updatedAt": "2026-04-01T00:00:00Z"
  }
}
```

---

## POST /api/v1/admin/courses/:id/publish

Publish course (makes it visible on public catalog).

**Auth**: Bearer JWT (role = admin)

**Request**: Empty body

**Response 200**:
```json
{
  "course": {
    "id": "uuid",
    "status": "published"
  }
}
```

---

## POST /api/v1/admin/courses/:id/unpublish

Unpublish course (hides from public catalog but keeps enrollments).

**Auth**: Bearer JWT (role = admin)

**Request**: Empty body

**Response 200**:
```json
{
  "course": {
    "id": "uuid",
    "status": "draft"
  }
}
```

---

## DELETE /api/v1/admin/courses/:id

Delete course (with warning if active enrollments).

**Auth**: Bearer JWT (role = admin)

**Response 200**:
```json
{
  "message": "Course deleted"
}
```

**Response 409 — Conflict (has enrollments)**:
```json
{
  "code": "COURSE_HAS_ENROLLMENTS",
  "message": "Course has 5 active enrollments. Unpublish instead?",
  "details": {
    "enrollmentCount": 5
  }
}
```

---

## POST /api/v1/admin/courses/:courseId/sections

Add section to course.

**Auth**: Bearer JWT (role = admin)

**Request**:
```json
{
  "title": "string (Arabic)",
  "orderIndex": 1
}
```

**Response 201**:
```json
{
  "section": {
    "id": "uuid",
    "courseId": "uuid",
    "title": "string",
    "orderIndex": 1,
    "createdAt": "2026-04-01T00:00:00Z"
  }
}
```

---

## POST /api/v1/admin/sections/:sectionId/lessons

Add lesson to section.

**Auth**: Bearer JWT (role = admin)

**Request**:
```json
{
  "title": "string (Arabic)",
  "videoUrl": "string (external host URL)",
  "description": "string (HTML, Arabic, optional)"
}
```

**Response 201**:
```json
{
  "lesson": {
    "id": "uuid",
    "sectionId": "uuid",
    "title": "string",
    "videoUrl": "string",
    "description": "string",
    "orderIndex": "computed globally within course",
    "isFreePreview": "computed (orderIndex <= 5)",
    "createdAt": "2026-04-01T00:00:00Z"
  }
}
```

---

## PUT /api/v1/admin/lessons/:id

Update lesson.

**Auth**: Bearer JWT (role = admin)

**Request**:
```json
{
  "title": "string (optional)",
  "videoUrl": "string (optional)",
  "description": "string (optional)"
}
```

**Response 200**:
```json
{
  "lesson": {
    "id": "uuid",
    "title": "string",
    "videoUrl": "string",
    "description": "string",
    "orderIndex": "number",
    "isFreePreview": "boolean",
    "updatedAt": "2026-04-01T00:00:00Z"
  }
}
```

---

## DELETE /api/v1/admin/lessons/:id

Delete lesson.

**Auth**: Bearer JWT (role = admin)

**Response 200**:
```json
{
  "message": "Lesson deleted"
}
```

**Response 409 — Conflict (only lesson in section)**:
```json
{
  "code": "CANNOT_DELETE_ONLY_LESSON",
  "message": "Cannot delete the only lesson in a section. Add another lesson first."
}
```
