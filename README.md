# 📚 StudyHub

Aplikasi web produktivitas mahasiswa yang dibangun dengan **React.js + Vite + Firebase + Cloudinary**, di-deploy di **Railway**. StudyHub membantu pengguna mengelola **catatan kuliah (Notes)**, **daftar tugas (Tasks)**, dan **kartu belajar (Flashcards)** dalam satu dashboard real-time. Catatan juga bisa dilampiri gambar yang di-host di Cloudinary.

## ✨ Fitur

- 🔐 **Authentication** — Register & Login menggunakan Firebase Authentication (email/password)
- 📧 **Email Verification (Webmailer)** — Setelah register, link verifikasi otomatis dikirim ke email user
- 📝 **Notes CRUD** — buat, lihat, edit, hapus catatan, dengan **lampiran gambar (via Cloudinary)**
- ✅ **Tasks CRUD** — kelola tugas dengan deadline, prioritas (low/medium/high), dan status selesai
- 🎴 **Flashcards CRUD** — buat kartu Q&A untuk belajar
- ☁️ **Firebase Realtime Database** — semua data tersinkronisasi real-time per user
- 🖼️ **Cloudinary Image Upload** — upload langsung dari browser via unsigned upload preset
- 🛡️ **Protected Routes** — halaman dashboard hanya bisa diakses jika sudah login
- 🚀 **Deployed di Railway** dengan custom Express server (SPA fallback)

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | **React 18** |
| Build tool | **Vite 5** |
| Routing | React Router DOM v6 |
| Authentication | Firebase Authentication |
| Database | Firebase Realtime Database |
| Image Storage | **Cloudinary** (unsigned upload) |
| Email Verification | Firebase Auth `sendEmailVerification` |
| Production server | Express (SPA fallback) |
| Hosting | **Railway** |

## ☁️ Layanan Cloud yang Digunakan

1. **Firebase Authentication** — register, login, email verification
2. **Firebase Realtime Database** — penyimpanan Notes, Tasks, Flashcards
3. **Cloudinary** — image hosting untuk lampiran Notes (poin tambahan)
4. **Railway** — hosting aplikasi (poin tambahan)

## 📋 12 Fungsi CRUD

| # | Operasi | Entitas | Service | Hook |
|---|---|---|---|---|
| 1  | CREATE | Notes      | `createNote()`        | `useNotes().create()` |
| 2  | READ   | Notes      | `subscribeNotes()`    | `useNotes().notes` |
| 3  | UPDATE | Notes      | `updateNote()`        | `useNotes().update()` |
| 4  | DELETE | Notes      | `deleteNote()`        | `useNotes().remove()` |
| 5  | CREATE | Tasks      | `createTask()`        | `useTasks().create()` |
| 6  | READ   | Tasks      | `subscribeTasks()`    | `useTasks().tasks` |
| 7  | UPDATE | Tasks      | `updateTask()`        | `useTasks().update()` |
| 8  | DELETE | Tasks      | `deleteTask()`        | `useTasks().remove()` |
| 9  | CREATE | Flashcards | `createFlashcard()`   | `useFlashcards().create()` |
| 10 | READ   | Flashcards | `subscribeFlashcards()` | `useFlashcards().flashcards` |
| 11 | UPDATE | Flashcards | `updateFlashcard()`   | `useFlashcards().update()` |
| 12 | DELETE | Flashcards | `deleteFlashcard()`   | `useFlashcards().remove()` |

## 📂 Arsitektur Folder

```
studyhub/
├── public/
├── src/
│   ├── main.jsx                     # entry point (Router + AuthProvider)
│   ├── App.jsx                      # routing
│   ├── index.css                    # global styles + design tokens
│   │
│   ├── firebase/config.js           # init Firebase dari env vars
│   ├── contexts/AuthContext.jsx     # global auth state + useAuth hook
│   │
│   ├── services/                    # ⬅ pure functions, no React deps
│   │   ├── notesService.js          # CRUD #1 — Notes
│   │   ├── tasksService.js          # CRUD #2 — Tasks
│   │   ├── flashcardsService.js     # CRUD #3 — Flashcards
│   │   └── cloudinaryService.js     # upload gambar ke Cloudinary
│   │
│   ├── hooks/                       # ⬅ wrap services + manage state
│   │   ├── useNotes.js
│   │   ├── useTasks.js
│   │   └── useFlashcards.js
│   │
│   ├── components/
│   │   ├── ProtectedRoute.jsx       # route guard
│   │   ├── Navbar.jsx
│   │   ├── VerifyBanner.jsx
│   │   ├── notes/{NoteForm,NoteList}.jsx
│   │   ├── tasks/{TaskForm,TaskList}.jsx
│   │   └── flashcards/{FlashcardForm,FlashcardList}.jsx
│   │
│   └── pages/
│       ├── Login.jsx
│       ├── Register.jsx
│       └── Dashboard.jsx
│
├── server.js                        # Express server untuk Railway
├── .env.example                     # template environment variables
├── .gitignore
├── index.html                       # Vite entry HTML
├── package.json
├── vite.config.js
├── firebase.json                    # database rules config (opsional)
├── database.rules.json              # Realtime Database security rules
└── README.md
```

## 🧠 Best Practices yang Diterapkan

1. **Separation of Concerns** — `services/` (Firebase + Cloudinary) → `hooks/` (state) → `components/` (UI). Setiap layer punya tanggung jawab tunggal.
2. **Custom Hooks** — `useNotes`, `useTasks`, `useFlashcards` membungkus subscribe/CRUD sehingga komponen tidak perlu tahu detail Firebase.
3. **Context API** untuk auth state global, dengan custom hook `useAuth()`.
4. **Protected Routes** — halaman dashboard dijaga oleh komponen `ProtectedRoute`.
5. **Environment Variables** — semua kredensial (Firebase + Cloudinary) tidak di-hardcode, disimpan di `.env.local` (di-gitignore).
6. **Subscription Cleanup** — semua `onValue` listener di-unsubscribe via cleanup function di `useEffect`.
7. **Unsigned Upload** untuk Cloudinary — tidak ada API secret di sisi client.
8. **Controlled Forms** dengan validation, loading state, dan error handling.
9. **Database Rules** memastikan data antar user terisolasi.

## 🚀 Setup & Menjalankan Lokal

### 1. Clone & install
```bash
git clone https://github.com/USERNAME/studyhub.git
cd studyhub
npm install
```

### 2. Setup Firebase
1. Buat project di [Firebase Console](https://console.firebase.google.com)
2. Aktifkan **Authentication → Email/Password**
3. Aktifkan **Realtime Database** (start in locked mode)
4. Paste isi `database.rules.json` ke tab Rules → Publish
5. Project Settings → General → Your apps → Web app → salin config

### 3. Setup Cloudinary
1. Daftar gratis di [cloudinary.com](https://cloudinary.com)
2. Dashboard → catat **Cloud Name**
3. Settings → **Upload** → scroll ke "Upload presets" → **Add upload preset**
4. Set **Signing Mode = Unsigned**, beri nama (mis. `studyhub_unsigned`), Save
5. Catat nama preset tersebut

### 4. Setup environment variables
```bash
cp .env.example .env.local
```
Isi `.env.local` dengan credentials Firebase + Cloudinary Anda:
```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_DATABASE_URL=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

VITE_CLOUDINARY_CLOUD_NAME=...
VITE_CLOUDINARY_UPLOAD_PRESET=...
```

### 5. Jalankan dev server
```bash
npm run dev
```
Buka `http://localhost:5173`

## ☁️ Deploy ke Railway

### Cara cepat (via dashboard)
1. Push repo ke GitHub.
2. Buka [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo** → pilih repo Anda.
3. Railway otomatis mendeteksi project Node.js dengan **Nixpacks**, menjalankan `npm install`, lalu `npm run build`, lalu `npm start`.
4. Setelah service jalan, buka tab **Variables** dan tambahkan semua variable dari `.env.local` (Firebase + Cloudinary).
5. Buka tab **Settings → Networking** → klik **Generate Domain** untuk dapat URL publik (contoh: `https://studyhub-production.up.railway.app`).
6. Redeploy bila perlu — selesai!

### Kenapa pakai Express server di Railway?
Karena Vite menghasilkan static SPA, kita butuh server yang:
- Menyajikan file dari `dist/`
- Fallback semua route ke `index.html` agar React Router bekerja
- Listen di `process.env.PORT` (Railway inject otomatis)

File `server.js` sudah handle semua itu.

## 🔒 Database Rules

Setiap user hanya bisa membaca/menulis data miliknya sendiri. Lihat `database.rules.json`:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid == $uid",
        ".write": "auth != null && auth.uid == $uid"
      }
    }
  }
}
```

## 👤 Author

Tugas ALP Modul 4 — Cloud Services
