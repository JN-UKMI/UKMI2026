# Website JN UKMI UNS 2026 - Kabinet Iskandar Muda

Website resmi Jamaah Nurul Huda Unit Kegiatan Mahasiswa Islam (JN UKMI) Universitas Sebelas Maret (UNS). Platform ini berfungsi sebagai pusat informasi dakwah kampus, profil bidang kabinet, direktori lembaga mitra, artikel kajian, serta layanan islami mahasiswa.

---

## Tech Stack & Fitur

- **Framework**: Next.js 16 (App Router), React 19, TypeScript strict.
- **Styling**: Tailwind CSS v4 (Desain modern, bertema Light Mode dengan warna Forest Green, Sage, dan Lime).
- **CMS**: Sanity CMS (Untuk publikasi artikel, kajian, dan rilis kegiatan).
- **Animasi Transisi**: Framer Motion (Transisi slide 100% bebas blink menggunakan teknik *interceptor TransitionLink*).
- **Fitur Utama**:
  - Hero Interaktif & Carousel Quotes Islami (rotasi otomatis 30 detik + progress bar).
  - Direktori **Kabinet**, **LDF (Lembaga Dakwah Fakultas)**, **OKI (Ormawa Kerohanian Islam)**, dan **Partner**.
  - Layanan Islami (Al-Kahfi API, Al-Masurat digital, Doa Harian, Buku panduan UKMI).

---

## Getting Started (Cara Memulai)

### 1. Klon Repositori
```bash
git clone https://github.com/Syaasr/UKMI2026.git
cd website
```

### 2. Pasang Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Salin file `.env.example` menjadi `.env.local` dan lengkapi nilainya:
```bash
cp .env.example .env.local
```

Isi `.env.local` dengan konfigurasi berikut:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=ksc63oa8
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_WRITE_TOKEN=masukkan_write_token_sanity_disini
NEXT_PUBLIC_BASE_URL=http://localhost:3000
KODE_AKSES_ADMIN=UKMI2026
KODE_AKSES_PENGURUS=UKMI2026
```

### 4. Jalankan Development Server
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat hasilnya secara lokal.

### 5. Kompilasi Build Produksi
Untuk memastikan tidak ada kesalahan TypeScript atau layout sebelum di-deploy:
```bash
npm run build
```

---

## Struktur Rute Halaman
- `/` - Beranda (Hero, Kegiatan Terkini, Kalender, quotes)
- `/tentang` - Visi, Misi, Sejarah, & Milestones
- `/kabinet` - Pengurus Kabinet Iskandar Muda
- `/bidang/[slug]` - Detail program & staf 6 Bidang + Bendahara & Sekretaris
- `/artikel` - Daftar artikel/kajian dari Sanity CMS
- `/partner` - Direktori Partner Dakwah UNS
- `/oki` - Direktori Ormawa Kerohanian Islam (Ilmu Quran, Seni Religi)
- `/ldf` - Direktori Lembaga Dakwah Fakultas UNS
- `/al-kahfi` - Baca Al-Kahfi lengkap terjemahan
- `/al-masurat` - Bacaan Al-Masurat pagi dan sore
- `/kontak` - Hubungi JN UKMI
