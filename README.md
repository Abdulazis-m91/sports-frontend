# 🏆 Sports App - Frontend (React)

Frontend aplikasi Sports App menggunakan React JS, Tailwind CSS, dan Zustand untuk menampilkan liga, tim, dan favorit.

## 📋 Teknologi yang Digunakan

- **React JS** 18
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Zustand** (State Management)
- **React Router** (Routing)
- **Axios** (HTTP Client)
- **Framer Motion** (Animasi)
- **Shadcn/UI** (Component Library)

## ⚙️ Persyaratan Sistem

- Node.js >= 18
- npm

## 🚀 Cara Instalasi & Menjalankan

### 1. Clone Repository

```bash
git clone https://github.com/Abdulazis-m91/sports-frontend.git
cd sports-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Konfigurasi API

Buka file `src/api/axios.ts` dan pastikan baseURL mengarah ke backend:

```typescript
baseURL: "http://127.0.0.1:8000/api"
```

### 4. Jalankan Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:8080`

---

> ⚠️ **Pastikan Backend sudah berjalan** di `http://127.0.0.1:8000` sebelum menjalankan frontend.

---

## 📱 Fitur Aplikasi

### Halaman Publik (Tanpa Login)
- **Daftar Liga** — Menampilkan 6 liga top dunia dengan logo
- **Daftar Tim** — Menampilkan tim-tim dalam liga yang dipilih
- **Detail Tim** — Info lengkap tim, pertandingan terakhir (waktu WIB), dan klasemen liga

### Halaman Privat (Wajib Login)
- **Profil** — Menampilkan data profil pengguna
- **Favorit** — Tambah, hapus, dan lihat daftar tim favorit

### Fitur Lainnya
- 🌙 Dark/Light Mode
- 📱 Responsive Design
- ⚡ Loading Skeleton
- 🔐 Protected Routes
- 🎨 Smooth Animations

---

## 🏗️ Struktur Folder

```
src/
├── api/          # Konfigurasi Axios
├── assets/       # Gambar dan aset
├── components/   # Komponen reusable
│   ├── ui/       # Shadcn UI components
│   ├── Navbar
│   ├── AuthDialog
│   ├── ProfileDialog
│   └── ...
├── hooks/        # Custom hooks
├── pages/        # Halaman aplikasi
│   ├── Index
│   ├── LeaguesPage
│   ├── TeamsPage
│   ├── TeamDetailPage
│   ├── FavoritesPage
│   └── ProfilePage
├── store/        # Zustand store
└── lib/          # Utility functions
```

---

## 🔗 Menjalankan Lengkap (Backend + Frontend)

### Terminal 1 — Backend
```bash
cd sports-backend
php artisan serve --port=8000
```

### Terminal 2 — Frontend
```bash
cd sports-frontend
npm run dev
```

Buka browser di `http://localhost:8080`

---

## 👤 Author

**Abdul Azis** - [Abdulazis-m91](https://github.com/Abdulazis-m91)
