# TeleDrive - Supabase + Vercel Deployment Guide

Bu döküman TeleDrive'ı Supabase (database) ve Vercel (hosting) ile nasıl deploy edeceğinizi adım adım anlatır.

## 📋 Ön Gereksinimler

- [ ] GitHub hesabı
- [ ] Vercel hesabı (GitHub ile giriş yapın)
- [ ] Supabase hesabı (ücretsiz tier yeterli)
- [ ] Telegram API credentials ([my.telegram.org](https://my.telegram.org))

---

## 🚀 PHASE 1: Minimal Deployment (15-20 dakika)

### Adım 1: Supabase Projesi Oluşturun

1. [supabase.com](https://supabase.com) → "New Project"
2. Proje bilgilerini doldurun:
   - **Name**: `teledrive-db` (veya istediğiniz isim)
   - **Database Password**: Güçlü bir şifre (kaydedin!)
   - **Region**: Size en yakın bölge
3. Proje oluşturulana kadar bekleyin (~2 dakika)

### Adım 2: Database Connection String Alın

1. Supabase Dashboard → **Settings** → **Database**
2. **Connection string** → **URI** seçin
3. Connection string'i kopyalayın:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
4. `[YOUR-PASSWORD]` kısmını kendi şifrenizle değiştirin

### Adım 3: Telegram API Credentials Alın

1. [my.telegram.org](https://my.telegram.org) → Login
2. **API development tools**
3. **Create new application**:
   - App title: `TeleDrive`
   - Short name: `teledrive`
   - Platform: **Other**
4. `api_id` ve `api_hash` değerlerini kaydedin

### Adım 4: GitHub Repository'yi Fork/Clone Edin

Bu repository'yi fork edin veya kendi hesabınıza pushlayın.

### Adım 5: Vercel'e Deploy Edin

1. [vercel.com](https://vercel.com) → **Add New Project**
2. GitHub repository'nizi import edin
3. **Configure Project**:
   - **Framework Preset**: Other
   - **Build Command**: `yarn build`
   - **Output Directory**: Leave empty
   - **Install Command**: `yarn install`

4. **Environment Variables** ekleyin:

```bash
# Required
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
TG_API_ID=12345678
TG_API_HASH=abcdef1234567890abcdef1234567890
ADMIN_USERNAME=yourtelegramusername

# Optional
ENV=production
PORT=4000
CACHE_FILES_LIMIT=20GB
```

5. **Deploy** butonuna tıklayın

### Adım 6: Database Migration'ları Çalıştırın

Vercel deployment tamamlandıktan sonra:

1. Vercel Dashboard → **Your Project** → **Settings** → **Functions**
2. Ya da local'de:

```bash
cd api
DATABASE_URL="your-supabase-url" npx prisma migrate deploy
```

### Adım 7: Test Edin

1. Vercel deployment URL'inizi açın (örn: `https://your-project.vercel.app`)
2. Telegram ile giriş yapmayı deneyin
3. Dosya upload/download test edin

---

## ✅ Phase 1 Tamamlandı!

Artık temel bir TeleDrive deployment'ınız var:
- ✅ Supabase PostgreSQL database
- ✅ Vercel serverless hosting
- ✅ Telegram authentication
- ✅ File upload/download (geçici /tmp cache)

**Sınırlamalar:**
- File caching ephemeral (her deployment'ta sıfırlanır)
- Redis cache yok (performans düşük olabilir)
- Telegram sessions in-memory (logout olabilir)

---

## 🔧 PHASE 2: Production-Ready Setup

Phase 2 için aşağıdaki özellikleri ekleyeceğiz:

### Gelecek Özellikler:
- [ ] **Supabase Storage** - Persistent file caching
- [ ] **Upstash Redis** - Fast caching layer
- [ ] **Database session storage** - Persistent Telegram sessions
- [ ] **Error monitoring** - Better logging
- [ ] **Rate limiting** - API protection

**Phase 2 dokümantasyonu ayrı bir dosyada olacak.**

---

## 🐛 Troubleshooting

### Database bağlantı hatası

```bash
Error: P1001: Can't reach database server
```

**Çözüm:**
- Supabase database şifresini kontrol edin
- Connection string formatını kontrol edin
- Supabase projesinin aktif olduğunu kontrol edin

### Vercel build hatası

```bash
Error: Cannot find module 'prisma'
```

**Çözüm:**
- `package.json`'da `prebuild: prisma generate` olduğunu kontrol edin
- Vercel'de build command `yarn build` olduğunu kontrol edin

### Telegram authentication hatası

```bash
Error: API_ID_INVALID
```

**Çözüm:**
- `TG_API_ID` ve `TG_API_HASH` environment variables'ı kontrol edin
- my.telegram.org'dan doğru değerleri aldığınızdan emin olun

### File upload çalışmıyor

**Kontrol edin:**
- `/tmp` dizinine yazma izni var mı (Vercel'de otomatik)
- File size limitleri (`CACHE_FILES_LIMIT`)
- Telegram API rate limits

---

## 📊 Maliyet Analizi

| Servis | Free Tier | Aylık Maliyet |
|--------|-----------|---------------|
| **Supabase** | 500MB DB, 1GB storage | $0 |
| **Vercel** | 100GB bandwidth, Hobby plan | $0 |
| **TOPLAM** | | **$0/ay** |

**Ölçeklendirme:**
- Supabase Pro: $25/ay (8GB DB, 100GB storage)
- Vercel Pro: $20/ay (1TB bandwidth)

---

## 🔒 Güvenlik Notları

1. **Database şifresini güvenli tutun**
2. **Telegram API credentials'ı paylaşmayın**
3. **ADMIN_USERNAME'i doğru ayarlayın**
4. **Environment variables'ı GitHub'a pushlamamayın**

---

## 📞 Destek

- GitHub Issues: [TeleDrive Issues](https://github.com/mgilangjanuar/teledrive/issues)
- Discord: [TeleDrive Discord](https://discord.gg/PKNVJwAZnR)

---

**Deployment tarihi**: 2025-11-14
**Version**: 2.5.1 (Supabase + Vercel optimized)
