# API Contract: Authentication

**Versioned**: `/api/v1/auth/*`  
**Auth**: None (public endpoints)  
**Rate Limit**: 10 requests per minute per IP (on login, register)

---

## POST /api/v1/auth/register

Register a new student account.

**Request**:
```json
{
  "name": "string (1-100 chars)",
  "email": "string (valid email format)",
  "password": "string (min 8 chars)"
}
```

**Response 201 — Success**:
```json
{
  "user": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "role": "student"
  },
  "accessToken": "string (JWT, 15min expiry)",
  "refreshToken": "string (JWT, 7day expiry)"
}
```

**Response 409 — Email Already Exists**:
```json
{
  "code": "EMAIL_ALREADY_EXISTS",
  "message": "Email is already registered",
  "details": {}
}
```

**Response 422 — Validation Error**:
```json
{
  "code": "VALIDATION_ERROR",
  "message": "Request validation failed",
  "details": {
    "fields": {
      "email": "Invalid email format",
      "password": "Password must be at least 8 characters"
    }
  }
}
```

**Response 429 — Rate Limited**:
```json
{
  "code": "RATE_LIMITED",
  "message": "Too many registration attempts. Please try again later.",
  "details": {
    "retryAfterSeconds": 60
  }
}
```

---

## POST /api/v1/auth/login

Authenticate and receive access/refresh tokens.

**Request**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Response 200 — Success**:
```json
{
  "user": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "role": "admin | student"
  },
  "accessToken": "string (JWT, 15min expiry)",
  "refreshToken": "string (JWT, 7day expiry)"
}
```

**Response 401 — Invalid Credentials**:
```json
{
  "code": "INVALID_CREDENTIALS",
  "message": "Email or password is incorrect",
  "details": {}
}
```

**Response 429 — Rate Limited**:
```json
{
  "code": "RATE_LIMITED",
  "message": "Too many login attempts. Please try again later.",
  "details": {
    "retryAfterSeconds": 300
  }
}
```

---

## POST /api/v1/auth/logout

Revoke refresh token and end session.

**Auth**: Bearer JWT (required)

**Request**: Empty body

**Response 200 — Success**:
```json
{
  "message": "Logged out successfully"
}
```

**Response 401 — Unauthorized**:
```json
{
  "code": "UNAUTHORIZED",
  "message": "No valid authentication token provided"
}
```

---

## POST /api/v1/auth/refresh

Exchange refresh token for new access token (and rotate refresh token).

**Auth**: None (refresh token sent in body)

**Request**:
```json
{
  "refreshToken": "string (JWT)"
}
```

**Response 200 — Success**:
```json
{
  "accessToken": "string (JWT, 15min expiry)",
  "refreshToken": "string (JWT, 7day expiry, new)"
}
```

**Response 401 — Invalid or Expired Refresh Token**:
```json
{
  "code": "INVALID_REFRESH_TOKEN",
  "message": "Refresh token is invalid or expired",
  "details": {}
}
```

---

## Error Handling Standards

**All endpoints return 5xx for server errors:**
```json
{
  "code": "INTERNAL_SERVER_ERROR",
  "message": "An unexpected error occurred",
  "details": {}
}
```

**Token format**: JWT header.payload.signature
- Access token claims: { sub (userId), role, iat, exp (15min) }
- Refresh token claims: { sub (userId), type: 'refresh', iat, exp (7days) }

**Security**:
- Passwords never returned in response
- Refresh token stored hashed in database
- Old refresh token revoked when new one issued (rotation)
- Rate limiting enforced per IP
