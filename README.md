# Website Resmi JN UKMI UNS 2026

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat&logo=tailwind-css)
![Sanity CMS](https://img.shields.io/badge/Sanity-CMS-F03E2F?style=flat&logo=sanity)

Selamat datang di repositori resmi **Website Jamaah Nurul Huda Unit Kegiatan Mahasiswa Islam (JN UKMI)** Universitas Sebelas Maret (UNS) untuk **Kabinet Iskandar Muda (2026)**.

Platform ini tidak hanya berfungsi sebagai profil organisasi, namun juga sebagai pusat informasi dakwah kampus, direktori lembaga mitra, publikasi artikel kajian, serta menyediakan layanan islami (seperti Al-Kahfi dan Al-Masurat) bagi seluruh mahasiswa muslim di UNS.

---

## Fitur Utama

- **Profil & Kabinet**: Informasi mendalam tentang Visi, Misi, Sejarah, serta susunan pengurus Kabinet Iskandar Muda beserta detail 6 bidang kerjanya.
- **Publikasi Artikel & Berita**: Terintegrasi dengan Sanity CMS untuk pengelolaan konten kajian, opini, dan rilis kegiatan yang *headless* dan fleksibel.
- **Direktori Lembaga Mitra**: Menampilkan jejaring dakwah kampus termasuk **LDF (Lembaga Dakwah Fakultas)**, **OKI (Ormawa Kerohanian Islam)**, dan **Partner** eksternal.
- **Layanan Islami Digital**:
  - **Al-Kahfi**: Bacaan Surat Al-Kahfi lengkap dengan terjemahan.
  - **Al-Masurat**: Doa zikir pagi dan petang digital yang praktis.
  - **Doa Harian**: Kumpulan doa sehari-hari untuk mahasiswa.
- **UI/UX Modern & Performa Tinggi**: Animasi transisi yang *smooth* dan responsif di berbagai perangkat (dioptimasi penuh untuk *mobile* menggunakan *hardware acceleration*).

## Teknologi yang Digunakan

Website ini dibangun menggunakan *modern tech stack* untuk performa, skalabilitas, dan *developer experience* (DX) terbaik:

- **Core**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4 (Desain khusus dengan warna identitas *Forest Green*, *Sage*, dan *Lime*)
- **Content Management**: Sanity CMS
- **Animasi**: Framer Motion (Dioptimasi untuk performa mobile tanpa *delay unmount*)
- **Icons & Components**: Lucide React, Radix UI/Headless UI

## Panduan Instalasi Lokal (Getting Started)

Ingin berkontribusi atau menjalankan website ini di komputer lokal? Ikuti langkah-langkah berikut:

### 1. Persiapan Awal
Pastikan Anda telah menginstal **Node.js** (versi 18.x atau terbaru) dan **pnpm** (direkomendasikan) atau npm/yarn.

### 2. Klon Repositori
```bash
git clone https://github.com/jnukmi/UKMI2026.git
cd UKMI2026/website # Sesuaikan dengan lokasi repositori
```

### 3. Instal Dependensi
Mengingat proyek ini menggunakan `pnpm` (terdapat `pnpm-lock.yaml`), sangat disarankan menjalankan:
```bash
pnpm install
```

### 4. Konfigurasi Environment Variables
Salin file `.env.example` menjadi `.env.local` dan lengkapi nilainya:
```bash
cp .env.example .env.local
```

Isi `.env.local` dengan konfigurasi seperti berikut:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=ksc63oa8
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_WRITE_TOKEN=masukkan_write_token_sanity_disini
NEXT_PUBLIC_BASE_URL=http://localhost:3000
KODE_AKSES_ADMIN=
KODE_AKSES_PENGURUS=
```
*(Catatan: Token Sanity diperlukan jika Anda perlu mengelola konten via API lokal. Hubungi pengurus utama untuk mendapatkan akses).*

### 5. Jalankan Development Server
```bash
pnpm dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat hasilnya secara lokal.

## Struktur Proyek (Arsitektur Rute Utama)

Proyek ini menggunakan App Router dari Next.js.
- `/` - Beranda utama
- `/tentang` - Visi, Misi, Sejarah, & Milestones
- `/kabinet` - Pengurus Kabinet Iskandar Muda
- `/bidang/[slug]` - Detail program & staf dari masing-masing Bidang
- `/artikel` & `/artikel/[slug]` - Daftar dan detail artikel dari Sanity CMS
- `/ldf`, `/oki`, `/partner` - Direktori jaringan dakwah UNS
- `/al-kahfi`, `/al-masurat`, `/doa-doa` - Fitur layanan islami digital

## Perintah Script Tersedia

- `pnpm dev` : Menjalankan server *development*.
- `pnpm build` : Melakukan kompilasi untuk *production*. Sangat disarankan untuk menjalankannya sebelum membuat *Pull Request* guna memastikan tidak ada masalah tipe data (TypeScript) atau kompilasi.
- `pnpm start` : Menjalankan *build production* di komputer lokal.
- `pnpm lint` : Menjalankan ESLint untuk mengecek standar penulisan kode.

## Panduan Kontribusi

Kami sangat menyambut kontribusi dari anggota UKMI, mahasiswa UNS, maupun *developer* eksternal yang peduli terhadap dakwah kampus!
1. Lakukan **Fork** repositori ini.
2. Buat *branch* fitur baru Anda (`git checkout -b fitur/NamaFitur`).
3. Lakukan *commit* pada perubahan Anda (`git commit -m 'Menambahkan fitur XYZ'`).
4. *Push* ke *branch* tersebut (`git push origin fitur/NamaFitur`).
5. Buka **Pull Request** ke *repository* utama.

---
*Dikelola oleh Biro Media dan Informasi (Medinfo) & Developer Team JN UKMI UNS.*
