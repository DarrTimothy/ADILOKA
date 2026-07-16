# 🗺️ Adiloka

**Adiloka** adalah aplikasi web edukasi yang memperkenalkan permainan tradisional dari **38 provinsi di Indonesia** melalui peta interaktif. Pengguna dapat menjelajahi berbagai permainan tradisional berdasarkan provinsi asalnya serta mempelajari informasi penting mengenai permainan tersebut.

Aplikasi ini dikembangkan sebagai bagian dari penelitian skripsi Program Studi Teknik Informatika dengan tujuan membantu pelestarian budaya Indonesia dan meningkatkan pengetahuan generasi muda terhadap permainan tradisional daerah melalui media digital yang interaktif.

---

## ✨ Fitur Utama

### 🗺️ Peta Interaktif Indonesia

Menampilkan 38 provinsi di Indonesia yang dapat dieksplorasi untuk melihat permainan tradisional dari masing-masing daerah.

### 🎮 Informasi Permainan Tradisional

Setiap permainan tradisional dilengkapi dengan informasi seperti:

- Deskripsi
- Cara bermain
- Jumlah pemain minimum
- Jumlah pemain maksimum
- Durasi permainan
- Galeri gambar
- Video pembelajaran

### 🧠 Kuis Edukasi

Menguji pemahaman pengguna mengenai permainan tradisional yang telah dipelajari.

### 🔍 Pencarian Permainan

Memudahkan pengguna menemukan permainan tradisional berdasarkan nama permainan.

---

## 🛠️ Teknologi yang Digunakan

### Frontend

- Next.js 16
- TypeScript
- Tailwind CSS
- React Leaflet

### Backend

- Laravel 12
- Laravel Sanctum
- REST API

### Database

- PostgreSQL

---

# Prerequisites

Pastikan perangkat telah terpasang:

- PHP 8.2 atau lebih baru
- Composer
- Node.js 20 atau lebih baru
- npm 10 atau lebih baru
- PostgreSQL
- Git

---

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone <repository-url>
cd adiloka
```

### 2. Setup Backend

Masuk ke folder backend.

Install dependency Laravel:

```bash
composer install
```

Salin file environment:

```bash
cp .env.example .env
```

Generate application key:

```bash
php artisan key:generate
```

Konfigurasikan PostgreSQL pada file `.env`:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

Jalankan migrasi dan seeder:

```bash
php artisan migrate --seed
```

Buat symbolic link untuk mengakses file media dari folder `storage`.

```bash
php artisan storage:link
```

Jalankan backend:

```bash
php artisan serve
```

Backend berjalan pada:

```
http://localhost:8000
```

### 3. Setup Frontend

Install dependency:

Masuk ke folder frontend.

```bash
cd frontend
```

Salin file environment.

```bash
cp .env.example .env
```

Install dependency.

```bash
npm install
```

Jalankan frontend.

```bash
npm run dev
```

Frontend berjalan pada:

```
http://localhost:3000
```

---

## 🎯 Tujuan Pengembangan

Adiloka dikembangkan untuk:

- Memperkenalkan permainan tradisional dari 38 provinsi di Indonesia.
- Mendukung pelestarian budaya Indonesia melalui digitalisasi informasi.
- Menyediakan media pembelajaran budaya yang menarik dan mudah diakses.
- Meningkatkan kesadaran generasi muda terhadap kekayaan budaya bangsa.

---

## 📚 Sumber Data

Data permainan tradisional dalam aplikasi ini dikumpulkan dari berbagai sumber, antara lain:

- Jurnal dan artikel ilmiah
- Buku dan literatur budaya
- Repositori pendidikan
- Dokumentasi pemerintah
- Video pembelajaran dan dokumentasi permainan tradisional di YouTube
- Blog dan situs web yang membahas budaya Indonesia

---

## 👨‍💻 Tim Pengembang

- Darren Christian
- Girven Adrianus
- Frendy Marcellino

Program Studi Teknik Informatika / Computer Science  
Bina Nusantara University  
Tahun 2026

---
