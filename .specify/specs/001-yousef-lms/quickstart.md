# Quick Start: Local Development Setup

**Yousef LMS v1.0** — Full-stack Arabic-first LMS

---

## Prerequisites

- **Node.js**: 20+ (LTS)
- **npm**: 9+ (comes with Node.js)
- **Docker Desktop / Docker Engine**: Recommended default for local setup
- **Docker Compose**: Required for the one-command local stack
- **PostgreSQL**: 15+ (only if running outside Docker)
- **Git**: For cloning and version control

---

## Step 1: Clone Repository

```bash
git clone https://github.com/yousef/lms-platform.git
cd lms-platform
```

---

## Step 2: Install Dependencies

Install dependencies for all packages (client, server, shared):

```bash
npm install
```

This installs dependencies for:
- `/client` (React frontend)
- `/server` (Express backend)
- `/shared` (Shared types)

For the recommended Docker workflow, these dependencies are still useful for linting, codegen, and local tooling, but the app stack itself should run through Docker Compose.

---

## Step 3: Set Up Environment Variables

**Backend (.env setup):**

Copy the example file and fill in your values:

```bash
cp server/.env.example server/.env
```

**server/.env** (required variables):

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/yousef_lms_dev

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Redis (Upstash in production, local for dev)
REDIS_URL=redis://localhost:6379

# Cloudflare R2
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_ACCESS_KEY_ID=your-access-key
CLOUDFLARE_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=yousef-lms-proofs-dev
R2_BUCKET_REGION=auto

# Resend Email
RESEND_API_KEY=your-resend-api-key

# Server
PORT=3000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env.local setup):**

```bash
cp client/.env.example client/.env.local
```

**client/.env.local** (minimal):

```env
VITE_API_URL=http://localhost:3000
VITE_API_VERSION=v1
```

---

## Step 4: Start the Local Stack with Docker Compose

**Recommended path**

Run the full app stack with Docker:

```bash
docker compose up --build
```

This should start:
- `client`
- `server`
- `postgres`
- `redis`

Expected local endpoints:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

If the project adds root package scripts for Docker, prefer:

```bash
npm run docker:up
```

---

## Step 5: Set Up Database

**Option A: Local PostgreSQL (Docker)**

```bash
docker run -d \
  --name yousef-lms-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=yousef_lms_dev \
  -p 5432:5432 \
  postgres:15
```

Update `DATABASE_URL` in `server/.env`:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/yousef_lms_dev
```

**Option B: Supabase (Production-like)**

1. Create a project at https://supabase.com
2. Copy the PostgreSQL connection string
3. Update `DATABASE_URL` in `server/.env`

**Run Migrations:**

```bash
cd server
npx prisma migrate dev --name init
```

This will:
- Create the database schema
- Generate Prisma client
- Optionally seed sample data

---

## Step 6: Set Up Redis (Local)

**Option A: Docker**

```bash
docker run -d \
  --name yousef-lms-redis \
  -p 6379:6379 \
  redis:7-alpine
```

Update `REDIS_URL` in `server/.env`:
```
REDIS_URL=redis://localhost:6379
```

**Option B: Skip for basic development**

If not needed immediately, comment out Redis-dependent features or use in-memory store during development.

---

## Step 7: Start Development Servers

**Option A: Docker-first (recommended)**

```bash
docker compose up --build
```

or, if available:

```bash
npm run docker:up
```

**Option B: From repository root, start both frontend and backend outside Docker**

```bash
npm run dev
```

This runs (in parallel):
- **Frontend**: Vite dev server at http://localhost:5173 (hot reload enabled)
- **Backend**: Express server at http://localhost:3000 (nodemon auto-restart on file changes)

---

## Step 8: Verify Setup

**Frontend**:
1. Open http://localhost:5173 in your browser
2. Should see the Yousef LMS homepage (Arabic, RTL layout)
3. Open DevTools → Console → check for errors

**Backend**:
1. Terminal shows "Server listening on port 3000"
2. Test a public endpoint:
   ```bash
   curl http://localhost:3000/api/v1/courses
   ```
   Should return: `{ "courses": [] }` (or populated if seed data exists)

**Database**:
```bash
cd server
npx prisma studio
```
Opens Prisma Studio at http://localhost:5555 to inspect database tables

---

## Step 9: Create Test Account

**Via API (register):**

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Student",
    "email": "student@example.com",
    "password": "password123"
  }'
```

**Via Prisma Studio**:
1. Open Prisma Studio (see above)
2. Click "Users" table
3. Create a new record manually

---

## Step 10: Test Key Flows

**1. Browse Courses (public)**:
```bash
curl http://localhost:3000/api/v1/courses
```

**2. Register & Login**:
```bash
# Register
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123"}'

# Response includes accessToken
# Use token in Authorization header:
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/enrollments/my
```

**3. Create Admin Course** (use admin token):
```bash
curl -X POST http://localhost:3000/api/v1/admin/courses \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "تعلم Python",
    "description": "<p>دورة شاملة</p>",
    "thumbnailUrl": "https://example.com/image.jpg",
    "price": 299.99
  }'
```

---

## Common Development Tasks

### Run Tests

**Backend Unit Tests**:
```bash
cd server
npm run test:unit
```

**Backend Integration Tests**:
```bash
cd server
npm run test:integration
```

**Frontend Tests**:
```bash
cd client
npm run test
```

### Type Check

```bash
npm run type-check
```

Checks TypeScript across all packages.

### Lint & Format

```bash
npm run lint       # Check for linting errors
npm run format     # Auto-format code
```

### Database Schema Changes

**Create a migration:**
```bash
cd server
npx prisma migrate dev --name add_new_feature
```

**View schema in Prisma Studio:**
```bash
cd server
npx prisma studio
```

### Stop Development Servers

```bash
Press Ctrl+C in the terminal
```

Docker:

```bash
docker compose down
```

or, if available:

```bash
npm run docker:down
```

---

## Troubleshooting

**Docker containers do not start**:
```bash
docker compose logs
docker compose up --build
docker compose down -v
```

- Confirm Docker Desktop / Docker Engine is running
- Use `down -v` only when you intentionally want to reset local container state

**"Cannot find module" errors**:
```bash
rm -rf node_modules package-lock.json
npm install
```

**Database connection failed**:
- Check PostgreSQL is running
- Verify `DATABASE_URL` in `server/.env`
- Ensure database name exists

**Port 5173 or 3000 already in use**:
```bash
# Find process using port
lsof -i :5173      # Frontend
lsof -i :3000      # Backend

# Kill process (macOS/Linux)
kill -9 <PID>

# Or change port in vite.config.ts or app.ts
```

**RTL/Arabic text not displaying**:
- Check browser supports RTL text (all modern browsers do)
- Open DevTools → check `<html dir="rtl">` is present
- Check ar.json translation file is loaded

**Dark mode not toggling**:
- Check localStorage for "theme" key
- Verify Tailwind dark mode in `tailwind.config.js`
- Check CSS variables in `index.css`

---

## Next Steps

1. ✅ Development environment set up
2. → Start Phase 1 implementation (foundation, auth, catalog)
3. → Run `/speckit.tasks` for detailed task breakdown
4. → Create feature branches and start coding

---

## Useful Commands Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start both frontend and backend |
| `npm run type-check` | TypeScript type checking |
| `npm run lint` | ESLint check |
| `npm run format` | Code formatting |
| `cd server && npx prisma studio` | View/edit database |
| `cd server && npx prisma migrate dev --name NAME` | Create DB migration |
| `cd server && npm run test:unit` | Run backend unit tests |
| `cd client && npm run test` | Run frontend tests |

---

**Ready to start development!** 🚀

