# API Contract: Enrollments

**Versioned**: `/api/v1/enrollments*`

---

## GET /api/v1/enrollments/my

Get current student's enrollments.

**Auth**: Bearer JWT (student required)

**Response 200**:
```json
{
  "enrollments": [
    {
      "id": "uuid",
      "courseId": "uuid",
      "courseName": "string (Arabic)",
      "courseThumbnail": "string (URL)",
      "price": 299.99,
      "enrolledAt": "2026-04-01T00:00:00Z",
      "lessonsCount": 12,
      "lessonsWatched": 3
    }
  ]
}
```

**Response 200 — Empty**:
```json
{
  "enrollments": []
}
```

**Response 401 — Unauthorized**:
```json
{
  "code": "UNAUTHORIZED",
  "message": "Authentication required"
}
```
