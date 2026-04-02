 # Code Review — Branch `feature/us1-catalog-home-progress` (commit 8e46f22)

**Date**: 2026-04-02  
**Branch**: `feature/us1-catalog-home-progress` vs `main`  
**Commit**: `8e46f22c459a000e5616e714b6231f9c6ac3993e`  
**Status**: Review complete

---

## Issues Found: 12 Total

### CRITICAL ISSUES (Score >= 90)

#### 1. AdminChrome.tsx: 8+ hardcoded English UI strings — NO i18n **[92/100]**

**File**: `client/src/components/admin/AdminChrome.tsx`  
**Lines**: 23, 27–30, 35–44, 52

**Violation**: Constitution Principle I — "All UI strings must be in Arabic"

**Issue**: AdminChrome contains hardcoded English navigation labels and UI text:
- "Admin panel" (line 23)
- "Admin" fallback (line 27)
- Navigation links: "Overview", "Courses", "Orders", "Students", "Comments" (lines 35–44)
- Theme toggle button text (line 52)

No `useTranslation` hook is imported. These strings are visible on every admin page.

**Evidence**: 
```tsx
<div className="...">Admin panel</div>
<h2 ...>{user?.name || 'Admin'}</h2>
<NavLink ... to="/admin">Overview</NavLink>
<NavLink ... to="/admin/courses">Courses</NavLink>
```

**Translation keys exist** in `ar.json` under `nav.*` namespace (nav.overview, nav.courses, nav.orders, nav.students, nav.comments).

**Fix**: Add `useTranslation()` hook and replace all hardcoded strings with `t()` calls, following the pattern used in `Navigation.tsx`.

---

#### 2. CourseCatalogPage.tsx: Physical directional CSS properties (right/left/pr/pl) — **[92/100]**

**File**: `client/src/pages/CourseCatalogPage.tsx`  
**Lines**: 81, 86, 101, 109

**Violation**: Constitution Principle I — "All layouts use CSS logical properties... never hardcoded left/right values"

**Issue**: Uses physical directional properties instead of logical equivalents:
- Line 81: `absolute right-4` — search icon positioned with physical right
- Line 86: `pr-12` — padding-right hardcoded
- Line 101: `pl-10` — padding-left hardcoded
- Line 109: `absolute left-3` — sort icon positioned with physical left

In RTL, these break the layout: icons appear on wrong sides, padding is applied to wrong edges.

**Fix**: Replace with logical properties:
- `right-4` → `end-4`
- `pr-12` → `pe-12`
- `pl-10` → `ps-10`
- `left-3` → `start-3`

---

#### 3. ar.json: English values in instructor tags namespace — **[92/100]**

**File**: `client/src/i18n/locales/ar.json`  
**Lines**: 112–114

**Violation**: Constitution Principle I — "All UI strings must be in Arabic"

**Issue**: The `home.instructor.tags` object contains English values:
```json
"tags": {
  "fullstack": "Full Stack Engineer",
  "ai": "AI Architecture",
  "data": "Data Science"
}
```

These are rendered directly in `HomePage.tsx` (lines 199–206) as instructor qualifications visible to all users.

**Fix**: Replace with Arabic technical terms:
```json
"tags": {
  "fullstack": "مهندس فول ستاك",
  "ai": "هندسة الذكاء الاصطناعي",
  "data": "علم البيانات"
}
```

---

### HIGH ISSUES (Score >= 85)

#### 4. HomePage.tsx: Multiple `text-right` uses instead of logical `text-end` — **[88/100]**

**File**: `client/src/pages/HomePage.tsx`  
**Lines**: 32, 52, 86, 106, 189, 190, 208, 209, 217, 218, 241, 242, 248, 249 (10+ instances)

**Violation**: Constitution Principle I — "CSS logical properties only... never hardcoded left/right values"

**Issue**: Uses physical `text-right` throughout instead of logical `text-end`. While functionally identical in RTL context, this violates the architectural mandate and should use logical properties for consistency and future-proofing.

**Example**:
```tsx
<div className="text-right">          // line 32 — should be text-end
<div className="md:text-right">        // line 86 — should be md:text-end
<div className="order-1 text-right lg:order-2">  // line 189
```

**Fix**: Replace all `text-right` with `text-end` and `md:text-right` with `md:text-end` throughout the component.

---

#### 5. PageShell.tsx: Brand label "Yousef LMS" not i18n'd — **[85/100]**

**File**: `client/src/components/layout/PageShell.tsx`  
**Line**: 16

**Violation**: Constitution Principle I — "All UI strings must be in Arabic"

**Issue**: Hardcoded English brand name rendered on every auth page, placeholder page, and dashboard:
```tsx
<p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
  Yousef LMS
</p>
```

**Translation exists**: `"nav.brandName": "يوسف LMS"` is in `ar.json`; `Navigation.tsx` correctly uses it.

**Fix**: Import `useTranslation`, add `const { t } = useTranslation()`, and replace with `{t('nav.brandName')}`.

---

### MEDIUM ISSUES (Score 70–84)

#### 6. JWT verifyAccessToken: No runtime type validation on role field — **[78/100]**

**File**: `server/src/utils/jwt.ts`  
**Lines**: 55–58

**Issue**: `verifyAccessToken()` does not validate that `payload.role` exists or that the token has the correct type:

```ts
export function verifyAccessToken(token: string) {
  return jwt.verify(token, getJwtSecret()) as jwt.JwtPayload & AccessTokenPayload
}
```

If `JWT_SECRET` and `JWT_REFRESH_SECRET` are accidentally set to the same value, a refresh token could be accepted as an access token. The `requireAuth` middleware (auth.ts:29) assigns `req.user.role = payload.role` without null-checking, allowing an undefined role to pass through.

**Why this matters**: Flagged in PR #2, never fixed. Defense-in-depth principle requires validation at verify-time, not just cryptographic boundary.

**Fix**: Add runtime validation:
```ts
export function verifyAccessToken(token: string) {
  const payload = jwt.verify(token, getJwtSecret()) as jwt.JwtPayload & AccessTokenPayload
  if (!payload.role || !['admin', 'student'].includes(payload.role)) {
    throw new Error('Invalid access token: missing or invalid role')
  }
  if (payload.type === 'refresh') {
    throw new Error('Refresh token cannot be used as access token')
  }
  return payload
}
```

---

#### 7. nginx.conf: CSP exposes internal Docker hostname — **[72/100]**

**File**: `client/nginx.conf`  
**Line**: 11

**Issue**: `Content-Security-Policy` header includes `http://server:3000` (Docker-internal hostname) which is leaked to browsers in HTTP response headers:

```
add_header Content-Security-Policy "... connect-src 'self' http://server:3000 http://localhost:3000; ..." always;
```

The `http://server:3000` hostname is only valid inside the Docker network and is leaked in CSP headers visible to external parties, disclosing internal infrastructure topology.

**Impact**: Low functional impact (``'self'`` covers the proxy correctly), but violates operational security principles.

**Fix**: Remove the internal hostname from CSP; keep only `'self'`:
```
connect-src 'self';
```

---

### LOWER PRIORITY ISSUES

#### 8. CourseCard.tsx: "Free Preview" badge always rendered — **[Unscored, Medium severity]**

**File**: `client/src/components/CourseCard.tsx`  
**Lines**: 70–72

**Issue**: The "Free Preview" badge is unconditionally rendered on every course card:
```tsx
<div className="absolute right-4 top-4 ...">
  {t('catalog.freePreview')}
</div>
```

The `CourseCardProps` has no `isFreePreview` field, so every course misleads users into thinking it has free access. Spec says "First 5 lessons free to all visitors" but not all courses necessarily have 5+ lessons.

**Fix**: Add `isFreePreview` boolean to `CourseCardProps`, pass data from API, and render badge conditionally:
```tsx
{isFreePreview && (
  <div className="absolute end-4 top-4 ...">
    {t('catalog.freePreview')}
  </div>
)}
```

---

#### 9. AuthContext + apiClient: Silent token refresh doesn't update user state — **[Unscored, Medium severity]**

**File**: `client/src/context/AuthContext.tsx` + `client/src/services/apiClient.ts`  
**Lines**: 113–129 (AuthContext refresh handler) vs 51–81 (apiClient interceptor)

**Issue**: When the 401 interceptor silently refreshes the token via `/auth/refresh`, it updates `tokenStore` but never updates `AuthContext.user` state. The user state can become stale relative to the actual access token.

**Scenario**: After a silent background token refresh, `AuthContext` reports the user with old claims while `apiClient` has a new token with potentially different claims (though unlikely in this app).

**Fix**: After interceptor refresh, dispatch an event or callback to update `AuthContext.user`:
```ts
// In apiClient.ts refresh handler
.then((response) => {
  setAuthTokens({...})
  // NEW: Notify AuthContext to re-derive user from new token
  window.dispatchEvent(new CustomEvent('tokenRefreshed', { detail: response.data.accessToken }))
})
```

---

#### 10. AdminRoute.tsx: Missing `state={{ from: location }}` on unauthenticated redirect — **[Unscored, Low severity]**

**File**: `client/src/components/AdminRoute.tsx`  
**Lines**: 14–16

**Issue**: Unlike `ProtectedRoute.tsx` (which includes `state={{ from: location }}`), `AdminRoute` redirects unauthenticated users to login without preserving the intended destination:

```tsx
if (!user) {
  return <Navigate to="/login" replace />  // Missing state
}
```

After login, the user is sent to the default route instead of their originally-requested admin URL.

**Fix**: Add the state parameter:
```tsx
return <Navigate to="/login" replace state={{ from: location }} />
```

---

#### 11. Database + Redis ports exposed on all interfaces (docker-compose.yml) — **[Unscored, Medium severity]**

**File**: `docker-compose.yml` (not modified in this branch, but still open issue from PR #1)  
**Lines**: 5432:5432, 6379:6379

**Issue**: PostgreSQL and Redis ports are published without binding to `127.0.0.1`, exposing services to the local network on Linux systems. This was flagged in PR #1 and never fixed.

**Fix**: Bind to loopback:
```yaml
ports:
  - "127.0.0.1:5432:5432"
  - "127.0.0.1:6379:6379"
```

---

#### 12. Code comments missing for critical safety logic — **[Unscored, Low severity]**

**File**: `client/src/services/apiClient.ts`  
**Lines**: 37–46 (missing comment on /auth/refresh guard)

**Issue**: The guard that prevents infinite token-refresh loops has no explanatory comment:
```ts
const requestUrl = originalRequest?.url ?? ''

if (requestUrl.includes('/auth/refresh')) {
  clearAuthTokens()
  return Promise.reject(error)
  // ^ No comment explaining why this break-out exists
}
```

**Fix**: Add a comment:
```ts
// If the refresh endpoint itself returns 401, the token is invalid — 
// bail to prevent infinite retry loops
if (requestUrl.includes('/auth/refresh')) {
  clearAuthTokens()
  return Promise.reject(error)
}
```

Also add a JSDoc comment to `requireAdmin` middleware noting its dependency on `requireAuth`:
```ts
// Must be chained after requireAuth in middleware — depends on req.user
export function requireAdmin(req, res, next) { ... }
```

---

## Summary Table

| # | Severity | File | Issue | Score |
|---|----------|------|-------|-------|
| 1 | CRITICAL | AdminChrome.tsx | 8+ hardcoded English strings | 92/100 ✓ |
| 2 | CRITICAL | CourseCatalogPage.tsx | Physical right/left/pr/pl CSS | 92/100 ✓ |
| 3 | CRITICAL | ar.json | English instructor tags | 92/100 ✓ |
| 4 | HIGH | HomePage.tsx | Multiple `text-right` instead of `text-end` | 88/100 ✓ |
| 5 | HIGH | PageShell.tsx | English brand label not i18n'd | 85/100 ✓ |
| 6 | MEDIUM | jwt.ts | No type validation on role field | 78/100 |
| 7 | MEDIUM | nginx.conf | CSP exposes http://server:3000 | 72/100 |
| 8 | MEDIUM | CourseCard.tsx | "Free Preview" badge always shown | — |
| 9 | MEDIUM | AuthContext + apiClient | Silent refresh doesn't sync user state | — |
| 10 | LOW | AdminRoute.tsx | Missing `from` location state | — |
| 11 | MEDIUM | docker-compose.yml | DB/Redis ports exposed (from PR #1) | — |
| 12 | LOW | apiClient.ts | Missing comment on /auth/refresh guard | — |

---

## Issues Filtered by Confidence Score >= 80 (Code Review Threshold)

**5 issues meet the >= 80 threshold**:

1. **AdminChrome.tsx** — 92/100
2. **CourseCatalogPage.tsx** — 92/100
3. **ar.json** — 92/100
4. **HomePage.tsx** — 88/100
5. **PageShell.tsx** — 85/100

---

## Issues Below Threshold (Informational)

- jwt.ts (78/100) — Just below threshold; still high-priority for defense-in-depth
- nginx.conf (72/100) — Operational security concern, not critical
- All unscored issues — Real bugs but lower user impact

---

## Recommendations

**Immediate fix** (all 5 issues >= 80):
1. Add i18n to `AdminChrome.tsx`, `PageShell.tsx`
2. Replace English instructor tags in `ar.json`
3. Replace `text-right` with `text-end` in `HomePage.tsx`
4. Replace physical CSS properties with logical ones in `CourseCatalogPage.tsx`

**Before production**:
- Add type validation to `verifyAccessToken()` (78/100 issue)
- Fix CSP header in `nginx.conf`
- Bind DB/Redis ports to localhost

**Nice-to-have**:
- Add explanatory comments to safety-critical code
- Sync user state on silent token refresh
- Fix AdminRoute redirect preservation

---

**Generated**: 2026-04-02  
**Commit**: 8e46f22c459a000e5616e714b6231f9c6ac3993e  
**Branch**: feature/us1-catalog-home-progress vs main

🤖 Generated with [Claude Code](https://claude.ai/code)
