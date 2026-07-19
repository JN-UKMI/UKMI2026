import { defineType, defineField } from "sanity"

export const article = defineType({
  name: "article",
  title: "Article",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Judul artikel",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "URL-friendly identifier (auto-generated from title)",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description: "Kategori artikel",
      options: {
        list: [
          { title: "Kegiatan", value: "Kegiatan" },
          { title: "Kajian", value: "Kajian" },
          { title: "Isu", value: "Isu" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      description: "Gambar sampul artikel",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "Deskripsi gambar untuk aksesibilitas",
        }),
      ],
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      description: "Ringkasan singkat artikel (tampil di kartu/list)",
      rows: 3,
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      description: "Konten utama artikel (Portable Text)",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
          },
        },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      description: "Tanggal publikasi artikel",
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      description: "Nama penulis artikel",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      description: "Tag / kata kunci artikel",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description: "Tandai sebagai artikel unggulan (tampil di hero/section utama)",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "coverImage",
    },
  },
})
