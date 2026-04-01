# API Contract: Orders & Payments

**Versioned**: `/api/v1/orders*`, `/api/v1/admin/orders*`

---

## POST /api/v1/orders

Create purchase order with proof image upload (multipart/form-data).

**Auth**: Bearer JWT (student required)

**Request** (multipart/form-data):
```
courseId: uuid (form field)
proofFile: binary (file upload, JPG/PNG/PDF, max 5MB)
```

**Response 201 — Success**:
```json
{
  "order": {
    "id": "uuid",
    "courseId": "uuid",
    "status": "pending_review",
    "createdAt": "2026-04-01T00:00:00Z"
  }
}
```

**Response 409 — Order Already Exists**:
```json
{
  "code": "ORDER_ALREADY_EXISTS",
  "message": "A pending order already exists for this course",
  "details": {}
}
```

**Response 409 — Already Enrolled**:
```json
{
  "code": "ALREADY_ENROLLED",
  "message": "You are already enrolled in this course"
}
```

**Response 422 — Invalid File Type**:
```json
{
  "code": "INVALID_FILE_TYPE",
  "message": "Only JPG, PNG, and PDF files are allowed",
  "details": {
    "mimeType": "application/octet-stream"
  }
}
```

**Response 422 — File Too Large**:
```json
{
  "code": "FILE_TOO_LARGE",
  "message": "File exceeds the maximum size of 5MB",
  "details": {
    "maxSize": "5MB",
    "uploadedSize": "7MB"
  }
}
```

**Response 429 — Upload Rate Limited**:
```json
{
  "code": "UPLOAD_RATE_LIMITED",
  "message": "Upload limit reached. Please try again later.",
  "details": {
    "retryAfterSeconds": 3600
  }
}
```

---

## GET /api/v1/orders/my

Get current student's orders (all statuses).

**Auth**: Bearer JWT (student required)

**Response 200**:
```json
{
  "orders": [
    {
      "id": "uuid",
      "courseId": "uuid",
      "courseName": "string (Arabic)",
      "status": "pending_review | approved | rejected",
      "rejectionReason": "string or null",
      "createdAt": "2026-04-01T00:00:00Z",
      "reviewedAt": "2026-04-02T00:00:00Z or null"
    }
  ]
}
```

---

## GET /api/v1/admin/orders

List all orders with optional status filter (admin only).

**Auth**: Bearer JWT (role = admin)

**Query Parameters**:
- `status`: (optional) `pending_review | approved | rejected`
- `page`: (optional) Page number for pagination (default 1)
- `limit`: (optional) Results per page (default 20, max 100)

**Response 200**:
```json
{
  "orders": [
    {
      "id": "uuid",
      "studentId": "uuid",
      "studentName": "string",
      "studentEmail": "string",
      "courseId": "uuid",
      "courseName": "string (Arabic)",
      "status": "pending_review | approved | rejected",
      "proofUrl": "signed URL (1-hour expiry)",
      "rejectionReason": "string or null",
      "createdAt": "2026-04-01T00:00:00Z",
      "reviewedAt": "2026-04-02T00:00:00Z or null",
      "reviewedBy": "uuid or null"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

## GET /api/v1/admin/orders/:id

Get order detail with proof image access (admin only).

**Auth**: Bearer JWT (role = admin)

**Response 200**:
```json
{
  "order": {
    "id": "uuid",
    "studentId": "uuid",
    "studentName": "string",
    "studentEmail": "string",
    "courseId": "uuid",
    "courseName": "string (Arabic)",
    "status": "pending_review | approved | rejected",
    "proofUrl": "signed URL (1-hour expiry, admin access only)",
    "rejectionReason": "string or null",
    "createdAt": "2026-04-01T00:00:00Z",
    "reviewedAt": "2026-04-02T00:00:00Z or null",
    "reviewedBy": "uuid or null"
  }
}
```

**Response 404 — Not Found**:
```json
{
  "code": "ORDER_NOT_FOUND",
  "message": "Order not found"
}
```

---

## POST /api/v1/admin/orders/:id/approve

Approve order and create enrollment (admin only).

**Auth**: Bearer JWT (role = admin)

**Request**: Empty body

**Response 200 — Success**:
```json
{
  "order": {
    "id": "uuid",
    "status": "approved",
    "reviewedAt": "2026-04-01T00:00:00Z"
  },
  "enrollment": {
    "id": "uuid",
    "courseId": "uuid",
    "studentId": "uuid"
  }
}
```

**Response 409 — Already Approved**:
```json
{
  "code": "ALREADY_APPROVED",
  "message": "Order has already been approved"
}
```

**Response 404 — Not Found**:
```json
{
  "code": "ORDER_NOT_FOUND",
  "message": "Order was not found"
}
```

---

## POST /api/v1/admin/orders/:id/reject

Reject order with optional reason (admin only).

**Auth**: Bearer JWT (role = admin)

**Request**:
```json
{
  "reason": "string (optional, max 500 chars)"
}
```

**Response 200**:
```json
{
  "order": {
    "id": "uuid",
    "status": "rejected",
    "rejectionReason": "string or null",
    "reviewedAt": "2026-04-01T00:00:00Z"
  }
}
```

**Response 404 — Not Found**:
```json
{
  "code": "ORDER_NOT_FOUND",
  "message": "Order was not found"
}
```

---

## Proof Image Signed URL Endpoint

**GET /api/v1/admin/orders/:orderId/proof-image**

Generates a signed URL for the proof image (accessible only to admin, 1-hour expiry).

**Auth**: Bearer JWT (role = admin)

**Response 200**:
```json
{
  "proofUrl": "https://yourstorage.example.com/proofs/uuid?signed=token&expires=1hour"
}
```

**Response 403 — Forbidden**:
```json
{
  "code": "FORBIDDEN",
  "message": "Admin role required to access proof images"
}
```
