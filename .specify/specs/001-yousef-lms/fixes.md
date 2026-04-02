# Fix Tasks — Yousef LMS (Phase 2 Audit)

**Branch**: `feature/phase-2-foundation` → merged to `main`  
**Audited**: 2026-04-01  
**Scope**: All files currently in the codebase. Phase 3+ features (courses, orders, enrollments) are not yet built — those missing routes are tracked in `tasks.md`, not here.

Each task is marked with severity and the file it targets.

---

## CRITICAL

### FIX-001 — Remove access token from localStorage `[tokenStore.ts]`

**File**: `client/src/services/tokenStore.ts`  
**Lines**: 6, 39, 57–58, 72

**Problem**: The access token is being written to and read back from `localStorage`. The plan and constitution both specify that access tokens must live in memory only. `localStorage` is readable by any JavaScript on the page — an XSS vulnerability would expose access tokens directly.

**What to fix**:
- Delete the `ACCESS_TOKEN_KEY` constant (line 6).
- Remove `readStoredToken(ACCESS_TOKEN_KEY)` from the `tokens` initializer (line 39). The `accessToken` field should initialize to `null`.
- Remove the `writeStoredToken(ACCESS_TOKEN_KEY, ...)` call inside `setAuthTokens` (lines 57–58). Only the `refreshToken` branch should call `writeStoredToken`.
- Remove the `writeStoredToken(ACCESS_TOKEN_KEY, null)` call inside `clearAuthTokens` (line 72). Only the refresh token key needs to be cleared from storage.

**Keep unchanged**: `REFRESH_TOKEN_KEY` and its read/write — refresh tokens in `localStorage` is correct per spec (they are opaque, long-lived, and needed across page reloads).

---

### FIX-002 — Fix AuthContext: user state initialized from stale localStorage token `[AuthContext.tsx]`

**File**: `client/src/context/AuthContext.tsx`  
**Lines**: 93–106

**Problem**: Caused by FIX-001. Because `getAccessToken()` currently returns a value from `localStorage` on page load, `useState(() => getUserFromAccessToken(getAccessToken()))` (line 93) initializes `user` from a possibly-expired JWT without checking expiry. Then the `useEffect` on line 102 short-circuits (`if (accessToken) return`) and skips the refresh call — so the UI shows a logged-in user whose access token is already expired, causing every API call to 401.

**What to fix**: After fixing FIX-001, `getAccessToken()` will return `null` on page load (memory is empty). The `useState` initializer will correctly return `null`, and the `useEffect` will proceed to the refresh branch (lines 108–129), which restores session from the stored refresh token. No code change is needed here **if FIX-001 is applied first**. Verify this works end-to-end after FIX-001.

---

## HIGH

### FIX-003 — Populate ar.json with all Arabic translations `[ar.json]`

**File**: `client/src/i18n/locales/ar.json`  
**Lines**: 1–9

**Problem**: The file is entirely empty (`{}` in every namespace). The i18n system is wired up correctly but there are zero translation strings. Every `t('key')` call returns the key itself as a fallback. This means all future UI that uses `useTranslation()` will silently display raw key strings instead of Arabic text.

**What to fix**: Populate every namespace with the Arabic strings required by the UI. At minimum (based on current components and spec):

```json
{
  "common": {
    "loading": "جارٍ التحميل...",
    "backHome": "العودة للرئيسية",
    "serverHealth": "صحة الخادم"
  },
  "nav": {
    "home": "الرئيسية",
    "courses": "الدورات",
    "dashboard": "لوحة التحكم",
    "admin": "الإدارة",
    "login": "تسجيل الدخول",
    "register": "إنشاء حساب",
    "logout": "تسجيل الخروج",
    "themeDark": "داكن",
    "themeLight": "فاتح",
    "brandTagline": "منصة تعلم عربية",
    "brandName": "يوسف LMS"
  },
  "auth": {
    "loginTitle": "تسجيل الدخول",
    "registerTitle": "إنشاء حساب",
    "forgotPassword": "نسيت كلمة المرور",
    "resetPassword": "إعادة تعيين كلمة المرور"
  },
  "catalog": {
    "title": "الدورات التدريبية",
    "detail": "تفاصيل الدورة",
    "lessonPlayer": "مشغّل الدرس"
  },
  "dashboard": {
    "title": "لوحة التحكم"
  },
  "admin": {
    "overview": "نظرة عامة",
    "courses": "الدورات",
    "orders": "الطلبات",
    "students": "الطلاب",
    "comments": "التعليقات"
  },
  "errors": {
    "notFound": "الصفحة غير موجودة",
    "notFoundDesc": "المسار المطلوب غير موجود في الموقع.",
    "nothingHere": "لا يوجد شيء هنا",
    "nothingHereDesc": "استخدم كتالوج الدورات أو عد إلى الصفحة الرئيسية.",
    "forbidden": "غير مسموح",
    "serverError": "خطأ في الخادم",
    "offline": "غير متصل بالإنترنت",
    "sessionExpired": "انتهت الجلسة"
  },
  "placeholder": {
    "routeReady": "هذا المسار جاهز لتطبيق الشاشة المستخرجة من Stitch."
  }
}
```

Expand this as each real page is built in later phases.

---

### FIX-004 — Replace hardcoded English strings in Navigation.tsx with i18n `[Navigation.tsx]`

**File**: `client/src/components/Navigation.tsx`  
**Lines**: 26–27, 33, 36, 40, 45, 52, 56, 61, 63

**Problem**: All user-visible strings are hardcoded in English. Spec requires ALL UI strings to be in Arabic via react-i18next. Even brand text must be in the Arabic locale file so it can be changed from a single place.

**What to fix**: Import `useTranslation` from `react-i18next` and replace every hardcoded string:

| Current (English) | Translation key |
|---|---|
| `"Arabic-first LMS"` | `t('nav.brandTagline')` |
| `"Yousef LMS"` | `t('nav.brandName')` |
| `"Home"` | `t('nav.home')` |
| `"Courses"` | `t('nav.courses')` |
| `"Dashboard"` | `t('nav.dashboard')` |
| `"Admin"` | `t('nav.admin')` |
| `"Light"` / `"Dark"` | `t('nav.themeLight')` / `t('nav.themeDark')` |
| `"Logout"` | `t('nav.logout')` |
| `"Login"` | `t('nav.login')` |
| `"Register"` | `t('nav.register')` |

---

### FIX-005 — Replace hardcoded English strings in PlaceholderPage.tsx with i18n `[PlaceholderPage.tsx]`

**File**: `client/src/pages/PlaceholderPage.tsx`  
**Lines**: 14 (default prop), 34, 45–51

**Problem**: `PlaceholderPage` shows developer-facing English text to users. The inline paragraph (line 34) and all `NotFoundPlaceholder` strings (lines 45–51) are hardcoded English.

**What to fix**: Use `useTranslation`:

| Current | Translation key |
|---|---|
| `"Foundation ready"` (default status) | `t('placeholder.routeReady')` (or keep as dev-only — see note) |
| `"This route is now part of..."` | `t('placeholder.routeReady')` |
| `"Page not found"` | `t('errors.notFound')` |
| `"The requested route is outside..."` | `t('errors.notFoundDesc')` |
| `"Nothing here yet"` | `t('errors.nothingHere')` |
| `"Use the course catalog or return..."` | `t('errors.nothingHereDesc')` |
| `"Back home"` | `t('common.backHome')` |

**Note**: The `PlaceholderPage` component itself is temporary scaffolding that will be replaced by real pages. The `NotFoundPlaceholder` is permanent — it must definitely be translated. The inline paragraph can be translated or hidden in production — translating it is safer.

---

### FIX-006 — Replace hardcoded "Loading..." in route guards with i18n `[ProtectedRoute.tsx, AdminRoute.tsx]`

**Files**:  
- `client/src/components/ProtectedRoute.tsx` line 10  
- `client/src/components/AdminRoute.tsx` line 9

**Problem**: Both guards render `"Loading..."` (English) while the auth state is being resolved.

**What to fix**: In both files, import `useTranslation` and replace `"Loading..."` with `{t('common.loading')}`.

---

### FIX-007 — App.tsx: Translate PlaceholderPage titles and subtitles `[App.tsx]`

**File**: `client/src/App.tsx`  
**Lines**: 34–254

**Problem**: Every `<PlaceholderPage>` instance passes hardcoded English `title` and `subtitle` props. These are displayed in the page header which users see.

**What to fix**: In `App.tsx`, import `useTranslation` (or extract to a component that uses the hook) and replace English titles/subtitles with `t(...)` calls. Map each route to its Arabic translation key from `ar.json`.

**Note**: Since `App` is not a component that currently calls any hooks (it is a component but `PlaceholderPage` is being replaced by real pages), the cleaner fix is to convert the route definitions to use `t()` inside a wrapper, or add a `useTranslation` call at the top of the `App` function. The latter is straightforward since `App` is already a React function component.

---

## MEDIUM

### FIX-008 — Add startup env var validation in server.ts `[server.ts]`

**File**: `server/src/server.ts`

**Problem**: The server starts without verifying required environment variables. `JWT_SECRET` is only checked the first time a token is signed (inside a request handler). If it is missing, the server boots successfully but then throws an unhandled error during the first auth request. `DATABASE_URL` is not validated at all.

**What to fix**: Before calling `app.listen`, validate all required env vars and exit with a clear error if any are missing:

```ts
const required = ['JWT_SECRET', 'DATABASE_URL']
for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`)
    process.exit(1)
  }
}
```

---

### FIX-009 — CORS: Support array of origins `[app.ts]`

**File**: `server/src/app.ts`  
**Line**: 21

**Problem**: `origin: process.env.FRONTEND_URL || 'http://localhost:5173'` is a single string. In a real deployment you may need to allow both a staging URL and the production URL (or `localhost` during local dev alongside the Docker network origin). The current code silently rejects any request from a second origin.

**What to fix**: Parse `FRONTEND_URL` as a comma-separated list and pass an array to `cors`:

```ts
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

app.use(cors({ origin: allowedOrigins.length === 1 ? allowedOrigins[0] : allowedOrigins }))
```

---

### FIX-010 — Add security headers to nginx.conf `[nginx.conf]`

**File**: `client/nginx.conf`

**Problem**: The nginx config proxies correctly but sends no browser security headers. Without these headers, the browser allows:
- The app to be framed in iframes (clickjacking risk)
- MIME-type sniffing (content-type confusion attacks)
- Inline scripts that could facilitate XSS

**What to fix**: Add the following headers inside the `server {}` block (before the `location` blocks):

```nginx
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'" always;
```

Adjust `Content-Security-Policy` as real features are added (e.g., R2 image domains, video CDN).

---

### FIX-011 — Add periodic cleanup for expired refresh tokens `[auth.ts]`

**File**: `server/src/routes/auth.ts`

**Problem**: Refresh tokens are never deleted from the database — they accumulate indefinitely with `revokedAt` set. Over time the `refresh_tokens` table can grow to millions of rows, slowing down token lookup queries.

**What to fix**: Add a cleanup utility and call it on a schedule. Two options:

**Option A (simplest)**: Add a cleanup function and call it inside the `/refresh` endpoint on a probabilistic basis (e.g., 1% of refresh calls trigger a cleanup). This avoids needing a cron job:

```ts
async function cleanupExpiredTokens() {
  await prisma.refreshToken.deleteMany({
    where: {
      OR: [
        { expiresAt: { lt: new Date() } },
        { revokedAt: { lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      ],
    },
  })
}
```

**Option B**: Wire up the existing `CronCreate` system (if available) to run cleanup nightly.

---

## LOW

### FIX-012 — Use separate JWT secrets for access and refresh tokens `[jwt.ts]`

**File**: `server/src/utils/jwt.ts`  
**Lines**: 33, 40

**Problem**: Both `signAccessToken` and `signRefreshToken` use the same `JWT_SECRET`. While the refresh endpoint guards against access-token-as-refresh-token abuse (by checking `payload.type !== 'refresh'`), using separate secrets is defense-in-depth: a compromised refresh token cannot be used to forge access tokens and vice versa.

**What to fix**:
- Add `JWT_REFRESH_SECRET` to `.env.example` and `docker-compose.yml`.
- Create a `getJwtRefreshSecret()` function that reads `JWT_REFRESH_SECRET`.
- Use `getJwtRefreshSecret()` in `signRefreshToken` and `verifyRefreshToken`.
- Use `getJwtSecret()` in `signAccessToken` and `verifyAccessToken` (unchanged).

---

### FIX-013 — Increase Redis retry setting for resilience `[redis.ts]`

**File**: `server/src/utils/redis.ts`  
**Line**: 16

**Problem**: `maxRetriesPerRequest: 1` means that if Redis is momentarily unavailable (pod restart, brief network blip), any in-flight request fails immediately with a Redis error rather than retrying. This is acceptable in development but will cause unnecessary errors in production during rolling deploys.

**What to fix**: Increase to `maxRetriesPerRequest: 3`. Also add a connection error handler to prevent unhandled rejection crashes:

```ts
redis.on('error', (err) => {
  console.error('Redis connection error:', err)
})
```

---

## SUMMARY

| ID | Severity | File | Description |
|---|---|---|---|
| FIX-001 | CRITICAL | tokenStore.ts | Access token must not be stored in localStorage |
| FIX-002 | CRITICAL | AuthContext.tsx | User state initialized from stale token (cascades from FIX-001) |
| FIX-003 | HIGH | ar.json | Translation file is empty — all i18n keys return nothing |
| FIX-004 | HIGH | Navigation.tsx | All UI strings hardcoded in English |
| FIX-005 | HIGH | PlaceholderPage.tsx | All UI strings hardcoded in English |
| FIX-006 | HIGH | ProtectedRoute.tsx, AdminRoute.tsx | "Loading..." hardcoded in English |
| FIX-007 | HIGH | App.tsx | PlaceholderPage titles/subtitles hardcoded in English |
| FIX-008 | MEDIUM | server.ts | No env var validation at startup |
| FIX-009 | MEDIUM | app.ts | CORS only allows one origin |
| FIX-010 | MEDIUM | nginx.conf | Missing browser security headers |
| FIX-011 | MEDIUM | auth.ts | Expired refresh tokens never deleted from DB |
| FIX-012 | LOW | jwt.ts | Same secret used for access and refresh tokens |
| FIX-013 | LOW | redis.ts | Redis retry count too low, no error handler |

**Apply in order**: FIX-001 → FIX-002 (verify) → FIX-003 → FIX-004 through FIX-007 (can be parallel) → FIX-008 through FIX-013 (any order).
