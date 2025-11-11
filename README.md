# Geo Mandiri Kreasi — Backend API

Backend API untuk sistem jasa perizinan lingkungan.
Dibangun menggunakan **Node.js + Express + Prisma (MySQL)**.

> Versi sementara — update terakhir: 12 November 2025

## 🧰 Tech Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **ORM:** Prisma (MySQL)
- **Database:** MySQL 8
- **Auth:** JWT + bcrypt
- **Chatbot:** OpenAI API (GPT-4o-mini)
- **Deployment target:** Railway / Render

## 📁 Struktur Folder

```
geomandiri-backend/
├─ prisma/
│ └─ schema.prisma
├─ src/
│ ├─ controllers/
│ ├─ routes/
│ ├─ middlewares/
│ ├─ services/
│ ├─ utils/
│ ├─ seed/
│ └─ index.js
├─ .env
├─ package.json
└─ docs/
└─ backend.md
```

## ⚙️ Instalasi & Setup

### 1. Clone repository

```bash
git clone https://github.com/{user}/geomandiri-backend.git
cd geomandiri-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Konfigurasi environment

Buat file `.env` di root:

```env
DATABASEURL="mysql://user:pass@localhost:3306/geomandiri"
JWTSECRET="secret123"
OPENAIAPIKEY="sk-..."
PORT=4000
```

### 4. Setup Database

```bash
npx prisma migrate dev --name init
node src/seed/seed.js
```

### 5. Jalankan server

```bash
npm run dev
```

## 🗄️ Database Schema (Prisma)

- **Service**: Data layanan & kategori
- **FAQ**: Pertanyaan umum tiap service
- **Admin**: Data login admin
- **ChatLog**: Riwayat percakapan chatbot
- **Inquiry**: Pesan / kontak user dari website

> Untuk detail, lihat `prisma/schema.prisma`

| Endpoint              | Method | Deskripsi            | Auth | Status |
| --------------------- | ------ | -------------------- | ---- | ------ |
| `/api/services`       | GET    | List semua layanan   | ❌   | ✅     |
| `/api/services/:slug` | GET    | Detail layanan + FAQ | ❌   | ✅     |
| `/api/faqs`           | GET    | Semua FAQ            | ❌   | ✅     |
| `/api/auth/login`     | POST   | Login admin (JWT)    | ❌   | ✅     |
| `/api/chatbot`        | POST   | Chatbot Q&A          | ❌   | ✅     |

## 🔐 Autentikasi (JWT)

- Login admin → `/api/auth/login`
- Response:

  ```json
  { "ok": true, "token": "<jwt-token>" }
  ```

- Tambahkan header Authorization:

  ```
  Authorization: Bearer <jwt-token>
  ```

- Token valid 8 jam.

## 🤖 Chatbot Endpoint

**Endpoint:** `POST /api/chatbot`

**Body:**

```json
{
  "sessionId": "abc123",
  "message": "Apa itu UKL-UPL?",
  "serviceSlug": "ukl-upl"
}
```

**Response:**

```json
{
  "ok": true,
  "reply": "UKL-UPL adalah dokumen pengelolaan dan pemantauan lingkungan..."
}
```

**Proses singkat:**

1. Ambil FAQ dari DB sesuai `serviceSlug`
2. Generate prompt → kirim ke OpenAI
3. Simpan hasil ke `ChatLog`
4. Return `botReply`

## 🧪 Testing Cepat

### Cek Kesehatan API

GET `/api/health` → { ok: true }

### Login Admin

POST `/api/auth/login`

Body:

```json
{ "username": "admin", "password": "admin123" }
```

### Cek Service

GET `/api/services`

### Tes Chatbot

POST `/api/chatbot`

Body:

```json
{ "message": "Apa itu UKL-UPL?", "serviceSlug": "ukl-upl" }
```

### **🔟 Deployment & Env Notes**

## 🚀 Deployment - (COMING SOON)

## 🗓️ Progress Phases

| Phase | Status | Deskripsi                       |
| ----- | ------ | ------------------------------- |
| 0     | ✅     | Setup & konfigurasi             |
| 1     | ✅     | Struktur project & basic server |
| 2     | ✅     | Prisma schema & seed            |
| 3     | ✅     | CRUD Services & FAQ             |
| 4     | ✅     | Auth JWT admin                  |
| 5     | ⏳     | Chatbot integration             |
| 6     | 🔜     | CMS admin panel                 |
| 7     | 🔜     | Frontend integration            |
| 8     | 🔜     | Security & deploy               |
