# API Contract: Students (Admin)

**Versioned**: `/api/v1/admin/students*`

---

## GET /api/v1/admin/students

List all registered students (admin only).

**Auth**: Bearer JWT (role = admin)

**Query Parameters**:
- `page`: (optional) Page number (default 1)
- `limit`: (optional) Results per page (default 20, max 100)

**Response 200**:
```json
{
  "students": [
    {
      "id": "uuid",
      "name": "string",
      "email": "string",
      "enrollmentCount": 3,
      "joinedAt": "2026-04-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 250,
    "pages": 13
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

---

## GET /api/v1/admin/students/:id

Get student detail with enrollments (admin only).

**Auth**: Bearer JWT (role = admin)

**Response 200**:
```json
{
  "student": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "joinedAt": "2026-04-01T00:00:00Z",
    "enrollments": [
      {
        "courseId": "uuid",
        "courseName": "string (Arabic)",
        "enrolledAt": "2026-04-05T00:00:00Z",
        "lessonsWatched": 8
      }
    ]
  }
}
```

**Response 404 — Not Found**:
```json
{
  "code": "STUDENT_NOT_FOUND",
  "message": "Student not found"
}
```

**Response 403 — Forbidden**:
```json
{
  "code": "FORBIDDEN",
  "message": "Admin role required"
}
```
