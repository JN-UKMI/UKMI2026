# Website Resmi JN UKMI UNS 2026

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat&logo=tailwind-css)
![Sanity CMS](https://img.shields.io/badge/Sanity-CMS-F03E2F?style=flat&logo=sanity)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat&logo=supabase)
![NextAuth](https://img.shields.io/badge/NextAuth.js-v5%20Beta-purple?style=flat&logo=auth0)

Selamat datang di repositori resmi **Website Jamaah Nurul Huda Unit Kegiatan Mahasiswa Islam (JN UKMI)** Universitas Sebelas Maret (UNS) untuk **Kabinet Iskandar Muda (2026)**.

Platform ini berfungsi sebagai portal informasi pusat dakwah kampus, direktori jaringan lembaga, publikasi artikel & kajian islami via in-house rich text editor, layanan islami digital interaktif, serta pusat pengelolaan organisasi terpadu melalui Panel Admin internal.

---

## Fitur Unggulan

### 1. Kalender Interaktif UKMI & Puasa Sunnah
- **Sinkronisasi Database**: Terhubung langsung ke Supabase (`kalender_events`) untuk jadwal agenda dinamis dan puasa sunnah (Senin-Kamis, Ayyamul Bidh, dll).
- **Pemetaan Warna Bidang (*Multi-Dot Badges*)**: Tanggal kalender menampilkan titik indikator warna spesifik sesuai bidang penanggung jawab:
  - **Ketum**: Hitam / Putih
  - **Sekum**: Ungu (`#9333ea`)
  - **Bendum**: Rose (`#f43f5e`)
  - **Syiar**: Lime Logo (`#8ECD04`)
  - **Internal**: Merah Gelap (`#b91c1c`)
  - **Eksternal**: Amber (`#92400e`)
  - **Media**: Cyan (`#06b6d4`)
  - **Kemuslimahan**: Pink (`#ec4899`)
  - **Puasa Sunnah**: Emerald Green (`#059669`)
- **Detail Agenda Sisi Kanan**: Kartu agenda otomatis bergeser dan menampilkan detail waktu, lokasi, dan deskripsi kegiatan saat tanggal dipilih.

### 2. Panel Admin Terpadu (`/admin`)
Panel internal berbasis Google OAuth multi-factor dengan otorisasi berbasis Supabase allowlist:
- **Tab 1: Antrean Draf**: Meninjau artikel kiriman publik, memoderasi, menolak, atau menyetujui artikel untuk langsung terbit ke Sanity CMS.
- **Tab 2: Artikel Terbit**: Katalog grid artikel aktif dengan opsi edit langsung dan hapus.
- **Tab 3: Event Terdekat**: Manajemen poster kegiatan seru UKMI (upload gambar max 2MB + kalender visual).
- **Tab 4: Media Space**: Pengelolaan Bento Grid beranda (tambah, edit, reorder urutan, dan lightbox).
- **Tab 5: Kalender UKMI**: CRUD agenda lengkap dengan filter dropdown per-bulan, pemilih kategori (Agenda UKMI / Puasa), date picker kalender visual, dan penugasan bidang.
- **Tab 6: Kelola Admin**: Manajemen allowlist email admin Google OAuth (tambah/hapus akses admin via antarmuka web).

### 3. In-House Rich Text Editor (Novel / TipTap)
- Editor modern bergaya Notion di `/artikel/tulis` (publik) dan `/admin/artikel/[id]/edit` (admin).
- Mendukung *slash commands* (`/`), headings (H1–H3), blockquote, code blocks, bullet/numbered lists, dividers, upload gambar inline, dan pintasan *escape* block (`Ctrl/Cmd+Enter` atau `Enter 2×`).

### 4. Universal Command Palette (Pencarian Cepat `Ctrl+K`)
- Pop-up pencarian cepat yang mengindeks halaman, artikel Sanity, kumpulan doa, dan agenda kegiatan.
- Dilengkapi isolasi *overscroll containment* dan `data-lenis-prevent` agar roda mouse (*mouse wheel*) fokus menggulir daftar hasil tanpa menggeser latar belakang.

### 5. Layanan Islami Digital & Resource Suite
- **Al-Kahfi**: Bacaan digital Surat Al-Kahfi lengkap ayat demi ayat beserta terjemahan Indonesia.
- **Al-Ma'tsurat**: Dzikir pagi & petang dengan audio player murottal terintegrasi.
- **Doa-doa Harian**: Database doa dan zikir harian mahasiswa.
- **UKMI Store & Buku UKMI**: Katalog peminjaman perlengkapan dakwah dan perpustakaan organisasi.
- **Jaringan Dakwah**: Direktori resmi LDF (Lembaga Dakwah Fakultas), OKI, dan Media Partner.

### 6. Keamanan & Aksesibilitas Web (a11y)
- **Nonce-Based Content Security Policy (CSP)** di `proxy.ts` tanpa `'unsafe-inline'` pada scripts.
- **Strict Headers**: HSTS Preload (TLS 1.3), X-Frame-Options, Anti-MIME sniffing, COOP, Permissions-Policy.
- **Validasi Zod 4 & Sanitasi HTML**: Semua API boundary divalidasi ketat terhadap skema Zod dan sanitasi tag HTML.
- **Keyboard Navigation**: Skip-to-content accessibility link (`sr-only` yang aktif saat tombol `Tab` ditekan).

---

## Tech Stack

| Lapisan | Teknologi |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router, Turbopack Dev, Webpack Production Build) |
| **UI Library** | React 19, TypeScript (Strict Mode) |
| **Styling** | Tailwind CSS v4 (Tokens `@theme` di `globals.css`, Brand 2-Tone: Forest & Lime `#8ECD04`) |
| **Animasi & Interaksi** | Framer Motion 12, `tw-animate-css`, Lenis Smooth Scroll |
| **Editor** | Novel (TipTap-based rich text editor) |
| **Database & CMS** | Supabase PostgreSQL + Sanity Headless CMS (`ksc63oa8`) |
| **Autentikasi** | NextAuth v5 (Google OAuth Provider) + Dynamic Supabase Allowlist |
| **Validasi & Sanitasi** | Zod 4 + Sanitize-HTML |
| **Ikon** | Lucide React |
| **Testing** | Vitest 3, Testing Library (JSDOM), Playwright (E2E) |

---

## Panduan Memulai (Getting Started)

### 1. Klon Repositori
```bash
git clone https://github.com/Syaasr/UKMI2026.git
cd UKMI2026/website
```

### 2. Instal Dependensi
Pastikan **Node.js 18+** dan **pnpm** telah terpasang:
```bash
pnpm install
```

### 3. Konfigurasi Environment Variables
Salin template konfigurasi dan sesuaikan nilainya:
```bash
cp .env.example .env.local
```

Contoh konfigurasi `.env.local`:
```env
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=ksc63oa8
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_WRITE_TOKEN=sk...

# Domain URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# NextAuth v5 & Google OAuth
AUTH_SECRET=rahasia_auth_random_string_32_karakter
AUTH_GOOGLE_ID=google_client_id.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=google_client_secret
ADMIN_EMAILS=admin1@gmail.com,admin2@gmail.com

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

### 4. Jalankan Development Server
```bash
pnpm dev
```
Buka browser pada alamat [http://localhost:3000](http://localhost:3000).

---

## Struktur Rute Aplikasi (Route Map)

```
app/
├── (public)
│   ├── page.tsx                     # Beranda (Hero, Quote, Agenda, Bento Media, Kalender)
│   ├── tentang/                     # Profil, Visi-Misi, Sejarah, & Nilai
│   ├── kabinet/                     # Struktur Kabinet Iskandar Muda
│   ├── bidang/[slug]/               # 7 Halaman Bidang (Sekretaris, Bendahara, Syiar, dll)
│   ├── artikel/                     # Katalog Artikel & Kajian Sanity
│   ├── artikel/tulis/               # Form Tulis Artikel Publik (Masuk Antrean Draf)
│   ├── artikel/[slug]/              # Detail Artikel & Bacaan Terkait
│   ├── al-kahfi/                    # Al-Kahfi Digital
│   ├── al-matsurat/                 # Al-Ma'tsurat Kubro & Sughro + Audio
│   ├── doa-doa/                     # Database Doa & Zikir
│   ├── buku-ukmi/                   # Perpustakaan Buku UKMI
│   ├── ukmi-store/                  # Peminjaman Alat & Store
│   ├── ldf/                         # Direktori Lembaga Dakwah Fakultas UNS
│   ├── oki/                         # Direktori Organisasi Kerohanian Islam
│   ├── partner/                     # Direktori Media Partner & Kerjasama
│   └── kontak/                      # Halaman Kontak & Saluran Pengurus
├── admin/                           # Panel Admin Internal (Google OAuth RBAC)
│   ├── page.tsx                     # Controller 6 Tab Admin (Draf, Terbit, Event, Media, Kalender, Admins)
│   └── artikel/[id]/edit/           # Editor Artikel Khusus Admin
└── api/
    ├── admin/                       # Endpoints Operasi Admin (Zod-protected)
    ├── artikel/                     # API Artikel & Draf
    ├── kalender/                    # API Kalender UKMI & Puasa
    └── search/                      # API Pencarian Cepat Global
```

---

## Perintah Script (Available Scripts)

| Perintah | Deskripsi |
| :--- | :--- |
| `pnpm dev` | Menjalankan Next.js development server (dengan Turbopack & alokasi memori). |
| `pnpm build` | Membangun build produksi (Webpack) dan memvalidasi tipe TypeScript. |
| `pnpm start` | Menjalankan web server dari hasil build produksi lokal. |
| `pnpm lint` | Menjalankan pemeriksaan linter ESLint (flat config). |
| `pnpm typecheck` | Menjalankan pengecekan tipe statis TypeScript (`tsc --noEmit`). |
| `pnpm test` | Menjalankan seluruh pengujian unit & integrasi via Vitest. |
| `pnpm test:e2e` | Menjalankan end-to-end testing dengan Playwright. |

---

## Panduan Kontribusi
1. **Fork** repositori ini ke akun GitHub Anda.
2. Buat branch fitur baru (`git checkout -b fitur/nama-fitur`).
3. Pastikan kode lulus uji kualitas (`pnpm lint && pnpm typecheck && pnpm test`).
4. Lakukan commit dengan pesan deskriptif (`git commit -m 'feat: menambahkan fitur XYZ'`).
5. Push ke branch Anda dan buat **Pull Request**.

---
*Dikelola dengan bangga oleh Biro Media dan Informasi (Medinfo) & Web Development Team JN UKMI UNS Kabinet Iskandar Muda 2026.*
