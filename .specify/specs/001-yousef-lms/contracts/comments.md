# API Contract: Comments

**Versioned**: `/api/v1/lessons*`, `/api/v1/admin/comments*`

---

## GET /api/v1/lessons/:id/comments

Get all comments for a lesson (public, no auth required).

**Auth**: None

**Response 200**:
```json
{
  "comments": [
    {
      "id": "uuid",
      "authorName": "string (student name)",
      "content": "string (Arabic, bidirectional text)",
      "createdAt": "2026-04-01T00:00:00Z"
    }
  ]
}
```

**Response 200 — No Comments**:
```json
{
  "comments": []
}
```

**Response 404 — Lesson Not Found**:
```json
{
  "code": "LESSON_NOT_FOUND",
  "message": "Lesson not found"
}
```

---

## POST /api/v1/lessons/:id/comments

Post comment on lesson (enrolled students only).

**Auth**: Bearer JWT (enrolled student required)

**Request**:
```json
{
  "content": "string (min 1 char, max 1000 chars)"
}
```

**Response 201 — Success**:
```json
{
  "comment": {
    "id": "uuid",
    "content": "string",
    "authorName": "string",
    "createdAt": "2026-04-01T00:00:00Z"
  }
}
```

**Response 403 — Enrollment Required**:
```json
{
  "code": "ENROLLMENT_REQUIRED",
  "message": "Enrollment is required to comment on this lesson"
}
```

**Response 422 — Empty Content**:
```json
{
  "code": "EMPTY_CONTENT",
  "message": "Comment content cannot be empty"
}
```

**Response 429 — Comment Rate Limited**:
```json
{
  "code": "COMMENT_RATE_LIMITED",
  "message": "Too many comments submitted in a short time.",
  "details": {
    "retryAfterSeconds": 60
  }
}
```

---

## DELETE /api/v1/admin/comments/:id

Delete comment (admin only).

**Auth**: Bearer JWT (role = admin)

**Response 200**:
```json
{
  "message": "Comment deleted"
}
```

**Response 404 — Not Found**:
```json
{
  "code": "COMMENT_NOT_FOUND",
  "message": "Comment not found"
}
```

**Response 403 — Forbidden**:
```json
{
  "code": "FORBIDDEN",
  "message": "Admin role required"
}
```
