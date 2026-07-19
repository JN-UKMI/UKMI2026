import { defineConfig } from "sanity"
import { article } from "./schemas/article"

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID

if (!projectId) {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable. " +
      "Set it in .env.local before starting the Sanity Studio."
  )
}

export default defineConfig({
  name: "default",
  title: "JN UKMI",
  projectId,
  dataset: "production",
  basePath: "/studio",
  schema: { types: [article] },
})
