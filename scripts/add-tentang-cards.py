#!/usr/bin/env python3
"""Add tentang_cards to all 7 bidang JSON files."""

import json
import os

BASE = "content/bidang"

cards_data = {
    "bendahara": [
        {"icon": "dollarsign", "title": "Tata Kelola Keuangan", "description": "Pembuatan laporan keuangan kas besar secara berkala dan transparansi kas pengurus yang akuntabel."},
        {"icon": "trendingup", "title": "Penggalian Dana", "description": "Pengajuan proposal pendanaan, RAB, dan SPJ ke Rektorat/Mawa serta penarikan kas pengurus rutin tiap bulan."},
        {"icon": "bookopen", "title": "Pelatihan Administrasi", "description": "PELAPIS: pembekalan pembuatan TOR, proposal, SIK, RAB, dan alur SPJ bagi seluruh pengurus."},
        {"icon": "store", "title": "Unit Usaha Mandiri", "description": "UKMI Cloth, UKMI Store, dan Kantin Kejujuran sebagai usaha ekonomi kreatif mandiri yang berkelanjutan."},
    ],
    "eksternal": [
        {"icon": "users", "title": "Forum Alumni & Jejaring", "description": "Silaturahmi alumni, sharing time, FGD, Grebeg Wisuda, SIDAK, dan koordinasi Formas 13 LDF se-UNS."},
        {"icon": "heart", "title": "Pengabdian Masyarakat", "description": "Dusun Binaan (DusBin) dengan pembinaan TPA interaktif, public speaking, dan pelatihan keterampilan anak-anak."},
        {"icon": "globe", "title": "Sosial Kemasyarakatan", "description": "SOSMA Berbagi: interaksi kebersamaan dan penyaluran bantuan ke lembaga sosial/panti secara berkala."},
        {"icon": "star", "title": "Qurban Bersama", "description": "Qurma: penggalangan dana, penyembelihan, dan penyaluran daging qurban bagi masyarakat membutuhkan di daerah binaan."},
    ],
    "internal": [
        {"icon": "users", "title": "Pembinaan Mahasiswa Baru", "description": "EXPO SAMARU & MIB: penyambutan, pendataan, dan pembinaan intensif mahasiswa baru muslim UNS."},
        {"icon": "bookopen", "title": "Mentoring & Kaderisasi", "description": "IMT, MENTOR Plus: pembekalan mentor dan pembinaan rutin terstruktur melalui diskusi kelompok kecil 2x/bulan."},
        {"icon": "award", "title": "Pengembangan Pengurus", "description": "UPGRADE: pelatihan kepemimpinan, pengayaan materi, dan pembekalan manajemen proker 2x seperiode."},
        {"icon": "star", "title": "Spiritualitas Harian", "description": "Daily Quest (DQ): pemantauan dan rekapitulasi amalan harian pengurus secara digital untuk menjaga disiplin spiritual."},
    ],
    "kemuslimahan": [
        {"icon": "heart", "title": "Pembinaan Muslimah", "description": "MUSPACE: wadah pembinaan rutin, pelatihan crafting, dan kajian keislaman dialogis kolaboratif untuk muslimah."},
        {"icon": "megaphone", "title": "Syiar Digital Muslimah", "description": "GALAKSI & TTS: dakwah media sosial via konten edukatif, kuis interaktif, dan reminder kemuslimahan."},
        {"icon": "users", "title": "Koordinasi LDF se-UNS", "description": "Silat FORNIS: sharing session, FGD, dan penyelarasan dakwah kemuslimahan antara LDK dan LDF se-UNS."},
        {"icon": "star", "title": "Event Akbar Muslimah", "description": "GEMUS (Gema Muslimah): perlombaan, seminar, kajian akbar, dan bedah buku untuk melahirkan muslimah berdaya."},
    ],
    "media": [
        {"icon": "megaphone", "title": "Publikasi Digital", "description": "Publish It!: pengelolaan media sosial (Instagram, TikTok, Telegram, YouTube) berbasis SOP publikasi sebagai sarana dakwah."},
        {"icon": "palette", "title": "Desain & Kreatif", "description": "Pelatihan desain grafis & videografi serta Wejangan Grafis: poster dakwah dan infografis edukatif rutin."},
        {"icon": "globe", "title": "Website & Konten", "description": "KINIUKMI & Website JN UKMI: rubrik kajian Islam kontemporer, buletin digital, dan pusat informasi organisasi."},
        {"icon": "camera", "title": "Produksi Video & Podcast", "description": "KREASIIN, Hearme, dan Company Profile: video dakwah singkat, talkshow podcast, dan profil resmi organisasi."},
    ],
    "sekretaris": [
        {"icon": "filetext", "title": "Persidangan Organisasi", "description": "Raker, Pleno Tengah, Pleno Akhir, dan Muktamar: siklus lengkap sidang, evaluasi, dan estafet kepemimpinan."},
        {"icon": "clipboard", "title": "Administrasi & Arsip", "description": "Inventarisasi, pengelolaan surat digital, sosialisasi BPO, dan BUMI: perpustakaan untuk literasi pengurus."},
        {"icon": "settings", "title": "Sekretariat & Koordinasi", "description": "Piket Sekre, Rapat Harian Terbatas, dan Kalender UKMI untuk koordinasi rutin dan kebersihan sekretariat."},
        {"icon": "shield", "title": "Tata Kelola Organisasi", "description": "Penataan barang inventaris, penjagaan kerapian, dan standarisasi tata kelola Sekretariat JN UKMI."},
    ],
    "syiar": [
        {"icon": "bookopen", "title": "Kajian Rutin", "description": "KANTIN: majelis kajian rutin dan diskusi interaktif di Masjid Nurul Huda UNS untuk meningkatkan wawasan keislaman."},
        {"icon": "star", "title": "Festival Islam", "description": "SIFT: festival Islam terbesar di UNS dengan talkshow/kajian akbar, perlombaan islami, dan social campaign."},
        {"icon": "megaphone", "title": "Media Syiar Kampus", "description": "Al Khobar, UKMI Reels, QuizLam: mikroblog edukatif, video dakwah singkat, dan kuis interaktif Islam."},
        {"icon": "compass", "title": "Kajian Strategis", "description": "FOKUS: kajian mendalam, pencerdasan ilmiah, dan forum diskusi terhadap isu strategis keumatan dan nasional."},
    ],
}

for slug, cards in cards_data.items():
    filepath = os.path.join(BASE, f"{slug}.json")
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)
    data["tentang_cards"] = cards
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"✅ {slug}.json — {len(cards)} cards")

print("\nDone! All 7 bidang JSONs updated.")
