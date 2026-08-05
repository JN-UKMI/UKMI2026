import { defineField, defineType } from "sanity";

export const mediaPost = defineType({
  name: "mediaPost",
  title: "Media Space",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Judul Konten",
      type: "string",
      description: "Judul singkat konten (tampil saat hover)",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Deskripsi",
      type: "text",
      rows: 3,
      description: "Deskripsi singkat yang tampil saat hover",
    }),
    defineField({
      name: "image",
      title: "Gambar",
      type: "image",
      description: "Gambar/foto postingan (rasio persegi atau portrait direkomendasikan)",
      options: { hotspot: true },
    }),
    defineField({
      name: "instagramUrl",
      title: "Link Instagram / Postingan",
      type: "url",
      description: "Dibuka saat sel diklik",
    }),
    defineField({
      name: "createdAt",
      title: "Tanggal Dibuat",
      type: "datetime",
      description: "Digunakan untuk pengurutan (terbaru tampil di sel besar)",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "instagramUrl",
      media: "image",
    },
  },
});
