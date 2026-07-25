import { defineField, defineType } from "sanity"

export const kegiatan = defineType({
  name: "kegiatan",
  title: "Event Terdekat",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Judul Event",
      type: "string",
      description: "Nama event / kegiatan",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Tanggal Tampil",
      type: "string",
      description: "Contoh: Sabtu, 26 Juli 2025 · 08.00 WIB",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "dayBadge",
      title: "Angka Hari (Badge)",
      type: "string",
      description: "Angka hari untuk badge di pojok poster. Contoh: 26",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "monthBadge",
      title: "Nama Bulan (Badge)",
      type: "string",
      description: "Nama bulan singkat untuk badge. Contoh: JUL",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      title: "Lokasi",
      type: "string",
      description: "Lokasi pelaksanaan event. Contoh: Masjid Nurul Huda UNS",
    }),
    defineField({
      name: "description",
      title: "Deskripsi Singkat",
      type: "text",
      description: "Deskripsi singkat event",
    }),
    defineField({
      name: "poster",
      title: "Poster Event",
      type: "image",
      description: "Gambar poster event (rasio 3:4 / portrait direkomendasikan)",
      options: { hotspot: true },
    }),
    defineField({
      name: "instagramUrl",
      title: "URL Instagram / Link Detail",
      type: "url",
      description: "Link ke postingan Instagram atau halaman detail event",
    }),
    defineField({
      name: "createdAt",
      title: "Tanggal Dibuat",
      type: "datetime",
      description: "Digunakan untuk pengurutan. Isi dengan tanggal event.",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "date",
      media: "poster",
    },
  },
})
