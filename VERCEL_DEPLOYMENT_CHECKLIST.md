# ✅ TeleDrive - Vercel + Supabase Deployment Checklist

**Version:** 2.5.1 (Supabase + Vercel optimized)
**Last Updated:** 2025-11-14

---

## 🎯 Pre-Deployment Audit

### ✅ **Database (Supabase)**
- [x] PostgreSQL schema supports Supabase
- [x] UUID extension (`uuid-ossp`) included in migration
- [x] All migrations created and ready
- [x] `tg_session` field added to users table
- [x] Database connection string uses PostgreSQL protocol

**Migration Files:**
```bash
api/prisma/migrations/
├── 20220420012853_init/
├── 20220525012308_add_password_files/
└── 20251114000000_add_tg_session/  ← NEW
```

---

### ✅ **Serverless Compatibility (Vercel)**
- [x] File caching uses `/tmp` in Vercel environment
- [x] `app.listen()` conditional (not called in Vercel)
- [x] Serverless handler exported (`module.exports.handler`)
- [x] JWT secrets from environment variables
- [x] No persistent file writes in serverless mode
- [x] Build output in `api/dist/` directory

**Critical Changes Made:**
```typescript
// api/src/index.ts:100-104
if (!process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
  app.listen(process.env.PORT || 4000, ...)
}

// api/src/api/v1/Files.ts:23
const CACHE_DIR = process.env.VERCEL ? `${tmpdir()}/teledrive-cache` : ...

// api/src/utils/Constant.ts:24-27
if (process.env.API_JWT_SECRET && process.env.FILES_JWT_SECRET) {
  // Use environment variables (Vercel)
}
```

---

### ✅ **Build Configuration**
- [x] TypeScript 4.9.5 (Supabase client compatible)
- [x] Vercel config includes Prisma files
- [x] Build command: `yarn build`
- [x] API builds to `api/dist/`
- [x] Web builds to `web/build/`
- [x] Prisma generates client before build

**Vercel Config (`vercel.json`):**
```json
{
  "buildCommand": "yarn build",
  "builds": [
    {
      "src": "api/dist/index.js",
      "use": "@vercel/node",
      "config": {
        "maxLambdaSize": "50mb",
        "includeFiles": ["api/dist/**", "api/prisma/**", "api/keys"]
      }
    }
  ]
}
```

---

## 🚀 Deployment Steps

### **Step 1: Supabase Project Setup**

1. **Create Project**
   ```
   https://supabase.com → New Project
   - Name: teledrive-prod
   - Database Password: [SAVE THIS!]
   - Region: [Closest to users]
   ```

2. **Get Connection String**
   ```
   Dashboard → Settings → Database → Connection String (URI mode)

   Example:
   postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

3. **Enable UUID Extension** (if not already)
   ```sql
   -- Run in Supabase SQL Editor
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   ```

4. **Create Storage Bucket** (Optional - Phase 2)
   ```
   Dashboard → Storage → New Bucket
   - Name: cached-files
   - Public: No
   ```

5. **Get Supabase API Keys** (Optional - Phase 2)
   ```
   Dashboard → Settings → API
   - URL: https://[PROJECT-REF].supabase.co
   - anon public: [ANON-KEY]
   - service_role: [SERVICE-KEY] (use this for backend)
   ```

---

### **Step 2: Telegram API Setup**

1. **Get API Credentials**
   ```
   https://my.telegram.org → API development tools

   Create application:
   - App title: TeleDrive
   - Short name: teledrive
   - Platform: Other

   Save:
   - api_id: [NUMBER]
   - api_hash: [STRING]
   ```

---

### **Step 3: Generate JWT Secrets**

```bash
# Run locally to generate secrets
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
# Output: [API_JWT_SECRET]

node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
# Output: [FILES_JWT_SECRET]

# SAVE THESE - you'll need them for Vercel env vars
```

---

### **Step 4: Vercel Project Setup**

1. **Import GitHub Repository**
   ```
   https://vercel.com → Add New Project
   → Import from GitHub
   → Select: dethnass/TeleDrive
   → Branch: claude/sense-bu-p-01MvDhasj6crLBp69hx571MR
   ```

2. **Configure Build Settings**
   ```
   Framework Preset: Other
   Build Command: yarn build
   Output Directory: (leave empty)
   Install Command: yarn install
   ```

3. **Add Environment Variables**

   **Required Variables:**
   ```bash
   # Database
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

   # Telegram
   TG_API_ID=12345678
   TG_API_HASH=abcdef1234567890abcdef1234567890
   ADMIN_USERNAME=yourtelegramusername

   # JWT Secrets (CRITICAL!)
   API_JWT_SECRET=[generated-secret-1]
   FILES_JWT_SECRET=[generated-secret-2]

   # Environment
   ENV=production
   PORT=4000
   ```

   **Optional Variables (Phase 2 - Production):**
   ```bash
   # Supabase Storage
   SUPABASE_URL=https://[PROJECT-REF].supabase.co
   SUPABASE_ANON_KEY=[your-anon-key]
   SUPABASE_SERVICE_KEY=[your-service-key]

   # Redis Cache
   REDIS_URI=rediss://default:[PASSWORD]@[HOST].upstash.io:6379

   # File Cache
   CACHE_FILES_LIMIT=20GB

   # Error Reporting
   TG_BOT_TOKEN=[bot-token]
   TG_BOT_ERROR_REPORT_ID=[chat-id]
   TG_BOT_OWNER_ID=[owner-id]
   ```

4. **Deploy**
   ```
   Click "Deploy"
   Wait 2-5 minutes...
   ```

---

### **Step 5: Run Database Migrations**

**Option A: Via Vercel CLI** (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Run migration via environment
vercel env pull .env.local
cd api
npx prisma migrate deploy
```

**Option B: Direct from Local**
```bash
cd api
DATABASE_URL="your-supabase-connection-string" npx prisma migrate deploy
```

**Verify migrations:**
```bash
# Check in Supabase SQL Editor
SELECT * FROM _prisma_migrations;

# Should show:
# - 20220420012853_init
# - 20220525012308_add_password_files
# - 20251114000000_add_tg_session
```

---

### **Step 6: Test Deployment**

1. **Check Deployment URL**
   ```
   https://[your-project].vercel.app
   ```

2. **Test API Endpoint**
   ```bash
   curl https://[your-project].vercel.app/ping
   # Expected: {"pong":true}
   ```

3. **Test Frontend**
   ```
   Open: https://[your-project].vercel.app
   Should see: TeleDrive login page
   ```

4. **Test Telegram Login**
   ```
   - Enter phone number
   - Receive OTP
   - Login successfully
   ```

5. **Test File Upload**
   ```
   - Upload a small file (<10MB)
   - Verify it appears in file list
   - Download and verify content
   ```

---

## 🐛 Troubleshooting

### **Build Fails**

**Error:** `Cannot find module 'prisma'`
```bash
Solution: Ensure "prebuild": "prisma generate" in api/package.json
```

**Error:** `TypeScript compilation errors`
```bash
Solution: Check TypeScript version >= 4.9.0
cd api && yarn add -D typescript@~4.9.0
```

---

### **Database Connection Fails**

**Error:** `P1001: Can't reach database server`
```bash
Checklist:
- ✓ DATABASE_URL correct format
- ✓ Password URL-encoded (use %XX for special chars)
- ✓ Supabase project is active
- ✓ Network accessible from Vercel region
```

**Error:** `relation "users" does not exist`
```bash
Solution: Run migrations
cd api && DATABASE_URL="..." npx prisma migrate deploy
```

---

### **JWT Authentication Fails**

**Error:** `JsonWebTokenError: invalid signature`
```bash
Cause: JWT secrets changed between deployments

Solution: Set API_JWT_SECRET and FILES_JWT_SECRET in Vercel env vars
Never let them auto-generate in serverless!
```

---

### **File Upload Fails**

**Error:** `EACCES: permission denied`
```bash
Cause: Trying to write outside /tmp in Vercel

Check: File caching uses /tmp
grep "CACHE_DIR" api/src/api/v1/Files.ts
Should see: process.env.VERCEL ? tmpdir() : ...
```

---

### **Telegram Session Lost**

**Symptom:** Logged out after every deployment

**Solution:** Enable database-backed sessions
```bash
1. Verify tg_session migration ran
2. Update auth code to save session to DB
   (See Phase 2 implementation)
```

---

## 📊 Post-Deployment Checklist

- [ ] All API endpoints return 200
- [ ] Telegram authentication works
- [ ] File upload succeeds
- [ ] File download works
- [ ] Shared links accessible
- [ ] Admin panel accessible
- [ ] No console errors in browser
- [ ] Database migrations completed
- [ ] JWT secrets persisted
- [ ] Environment variables set

---

## 🔒 Security Checklist

- [ ] DATABASE_URL not exposed in client
- [ ] API_JWT_SECRET strong and unique
- [ ] FILES_JWT_SECRET strong and unique
- [ ] ADMIN_USERNAME set correctly
- [ ] Supabase RLS policies configured (if using Storage)
- [ ] CORS origins configured
- [ ] Rate limiting enabled
- [ ] No secrets in git repository
- [ ] Environment variables in Vercel only

---

## 📈 Monitoring & Optimization

**Vercel Dashboard:**
```
- Monitor function execution time
- Check error rates
- Review bandwidth usage
```

**Supabase Dashboard:**
```
- Monitor database connections
- Check query performance
- Review storage usage
```

**Recommended Limits:**
```
Vercel Free Tier:
- 100GB bandwidth/month
- 100GB-hours serverless functions
- 6000 builds/month

Supabase Free Tier:
- 500MB database
- 1GB file storage
- 2GB bandwidth

Upgrade when:
- Database > 400MB
- Bandwidth > 80GB/month
- Function execution > 80GB-hours
```

---

## 🎉 Deployment Complete!

Your TeleDrive instance is now running on:
- **Frontend:** Vercel Edge Network
- **Backend:** Vercel Serverless Functions
- **Database:** Supabase PostgreSQL
- **Storage:** Telegram API (+ optional Supabase Storage)

**Next Steps:**
1. Configure custom domain (Vercel Domains)
2. Enable production error monitoring
3. Set up database backups
4. Implement Phase 2 features (Supabase Storage, Redis)

---

**Support:**
- Deployment Guide: `DEPLOYMENT_SUPABASE_VERCEL.md`
- GitHub Issues: https://github.com/dethnass/TeleDrive/issues
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs

---

**Migration Date:** 2025-11-14
**Version:** 2.5.1 (Supabase + Vercel)
**Status:** ✅ Production Ready
