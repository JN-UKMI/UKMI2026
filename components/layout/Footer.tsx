"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import contactData from "@/content/kontak/main.json";
import { MapEmbed } from "./MapEmbed";
import { StaggerContainer, StaggerItem } from "@/components/ui/motion";

export function Footer() {
  return (
    <footer className="relative z-20 bg-forest-900 dark:bg-[#070D07] text-white pt-16 pb-8 border-t-2 border-lime/60 dark:border-lime/50 transition-colors duration-300 overflow-hidden">
      {/* Decorative glow di pojok footer */}
      <div className="pointer-events-none absolute -top-40 -left-32 w-[30rem] h-[30rem] rounded-full bg-lime/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 w-[30rem] h-[30rem] rounded-full bg-lime/10 blur-3xl" />

      <div className="max-w-6xl mx-auto px-4 relative">
        <StaggerContainer staggerChildren={0.12} className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Column 1: Logo + Brand */}
          <StaggerItem className="space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="/image/logo-jnukmi.svg"
                alt="JN UKMI Logo"
                width={44}
                height={44}
                className="h-11 w-auto"
              />
              <h3 className="text-lg font-bold text-white">JN UKMI</h3>
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              Jamaah Nurul Huda &mdash; Unit Kegiatan Mahasiswa Islam Universitas Sebelas Maret. Wadah pengembangan nilai-nilai keislaman.
            </p>
            <div className="flex items-center gap-3 pt-1">
              {/* Instagram */}
              <a
                href="https://instagram.com/jnukmiuns"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 hover:text-white transition-all duration-300 shadow-xs hover:shadow-md motion-safe:hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/70"
                aria-label="Instagram JN UKMI"
                title="Instagram JN UKMI"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/@jnukmiuns"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-red-600 hover:text-white transition-all duration-300 shadow-xs hover:shadow-md motion-safe:hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/70"
                aria-label="YouTube JN UKMI UNS"
                title="YouTube JN UKMI UNS"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

              {/* Spotify */}
              <a
                href="https://open.spotify.com/show/5PSDOR33zWFxnl2AOu8Rx8?si=f206341bc5114af8"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#1DB954] hover:text-white transition-all duration-300 shadow-xs hover:shadow-md motion-safe:hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/70"
                aria-label="Spotify HEARME UKMI"
                title="Spotify HEARME UKMI"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@jnukmiuns"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-black hover:text-white hover:border hover:border-white/40 transition-all duration-300 shadow-xs hover:shadow-md motion-safe:hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/70"
                aria-label="TikTok JN UKMI UNS"
                title="TikTok JN UKMI UNS"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>

              {/* Telegram */}
              <a
                href="https://t.me/WejanganGrafisJNUKMI"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#229ED9] hover:text-white transition-all duration-300 shadow-xs hover:shadow-md motion-safe:hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/70"
                aria-label="Telegram Wejangan Grafis JN UKMI"
                title="Telegram Wejangan Grafis JN UKMI"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
            </div>
          </StaggerItem>

          {/* Column 2: Address / Contact */}
          <StaggerItem className="space-y-4">
            <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider">Kontak</h4>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-forest-400 dark:text-lime text-xs font-medium">Email</p>
                <a href={`mailto:${contactData.email}`} className="group inline-flex items-center gap-1 text-white/60 hover:text-white transition-all duration-200 mt-0.5 motion-safe:hover:translate-x-1 focus-visible:outline-none focus-visible:text-lime">
                  {contactData.email}
                </a>
              </div>
              <div>
                <p className="text-forest-400 dark:text-lime text-xs font-medium">Telepon</p>
                <a href={`tel:${contactData.phone}`} className="group inline-flex items-center gap-1 text-white/60 hover:text-white transition-all duration-200 mt-0.5 motion-safe:hover:translate-x-1 focus-visible:outline-none focus-visible:text-lime">
                  {contactData.phone}
                </a>
              </div>
              <div>
                <p className="text-forest-400 dark:text-lime text-xs font-medium">Alamat</p>
                <p className="text-white/60 leading-relaxed mt-0.5">{contactData.address}</p>
              </div>
            </div>
          </StaggerItem>

          {/* Column 3: Map */}
          <StaggerItem className="space-y-4">
            <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider">Lokasi</h4>
            <div className="rounded-lg overflow-hidden border border-white/10 shadow-lg shadow-black/20 hover:shadow-lime/20 transition-shadow duration-300">
              <MapEmbed />
            </div>
          </StaggerItem>
        </StaggerContainer>

        <div className="border-t border-white/10 dark:border-forest-900/80 pt-8 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70">
          <div className="flex flex-col sm:flex-row items-center gap-1.5 text-center sm:text-left">
            <span className="font-semibold text-white">&copy; {new Date().getFullYear()} JN UKMI UNS</span>
            <span className="hidden sm:inline text-white/30">&bull;</span>
            <span>Kabinet Iskandar Muda</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-white/60">Dibuat oleh:</span>
            <a
              href="https://syaikhasril.web.id"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/90 hover:text-lime font-semibold transition-all duration-200 cursor-pointer group flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10 hover:border-lime/40 motion-safe:hover:-translate-y-0.5 hover:shadow-lg hover:shadow-lime/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/70"
              title="Kunjungi website portofolio Syaikhasril Maulana Firdaus"
            >
              <span>Syaikhasril Maulana Firdaus</span>
              <ExternalLink className="w-3.5 h-3.5 text-lime/80 group-hover:text-lime transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
