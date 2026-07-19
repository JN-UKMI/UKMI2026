import { promises as fs } from "fs"
import path from "path"
import type {
  HomeContent,
  AboutContent,
  KabinetContent,
  Bidang,
  LDF,
  ContactInfo,
  DoaHarianContent,
  DoaItem,
} from "./types"

const contentDir = path.join(process.cwd(), "content")

export async function loadHome(): Promise<HomeContent> {
  const file = await fs.readFile(path.join(contentDir, "home.json"), "utf-8")
  return JSON.parse(file)
}

export async function loadAbout(): Promise<AboutContent> {
  const file = await fs.readFile(path.join(contentDir, "about.json"), "utf-8")
  return JSON.parse(file)
}

export async function loadKabinet(): Promise<KabinetContent> {
  const file = await fs.readFile(path.join(contentDir, "kabinet.json"), "utf-8")
  return JSON.parse(file)
}

export async function loadBidang(slug: string): Promise<Bidang> {
  const file = await fs.readFile(
    path.join(contentDir, "bidang", `${slug}.json`),
    "utf-8"
  )
  return JSON.parse(file)
}

export async function loadLDF(): Promise<LDF[]> {
  const file = await fs.readFile(path.join(contentDir, "ldf.json"), "utf-8")
  return JSON.parse(file)
}

export async function loadContact(): Promise<ContactInfo> {
  const file = await fs.readFile(path.join(contentDir, "contact.json"), "utf-8")
  return JSON.parse(file)
}

export async function loadDoaHarian(): Promise<DoaHarianContent> {
  const file = await fs.readFile(
    path.join(contentDir, "doa-harian.json"),
    "utf-8"
  )
  return JSON.parse(file)
}

export async function loadDoaDoa(): Promise<DoaItem[]> {
  const file = await fs.readFile(path.join(contentDir, "doa-doa.json"), "utf-8")
  return JSON.parse(file)
}
