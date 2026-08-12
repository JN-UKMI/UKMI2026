"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, Mail, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NavDropdown } from "./NavDropdown";
import { MobileMenu } from "./MobileMenu";
import { usePathname } from "next/navigation";

import { TransitionLink } from "@/components/ui/TransitionLink";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

type NavItem = {
  label: string;
  href?: string;
  target?: string;
  rel?: string;
  items?: NavItem[];
};

const navItems: NavItem[] = [
  { label: "Beranda", href: "/" },
  {
    label: "Tentang",
    items: [
      { label: "JN UKMI", href: "/tentang" },
      { label: "Kabinet", href: "/kabinet" },
      {
        label: "Bidang",
        items: [
          { label: "Sekretaris", href: "/bidang/sekretaris" },
          { label: "Bendahara", href: "/bidang/bendahara" },
          { label: "Syiar", href: "/bidang/syiar" },
          { label: "Internal", href: "/bidang/internal" },
          { label: "Eksternal", href: "/bidang/eksternal" },
          { label: "Media", href: "/bidang/media" },
          { label: "Kemuslimahan", href: "/bidang/kemuslimahan" },
        ],
      },
    ],
  },
  { label: "Artikel", href: "/artikel" },
  {
    label: "Layanan",
    items: [
      { label: "Doa-doa", href: "/doa-doa" },
      { label: "Al Kahfi", href: "/al-kahfi" },
      { label: "Al-Ma'tsurat", href: "/al-matsurat" },
      { label: "Buku UKMI", href: "/buku-ukmi" },
      { label: "UKMI Store", href: "/ukmi-store" },
      { label: "BPO", href: "https://uns.id/BPOIskandarMuda_26", target: "_blank", rel: "noopener noreferrer" },
    ],
  },
  {
    label: "Partnership",
    items: [
      { label: "Partner", href: "/partner" },
      { label: "OKI", href: "/oki" },
      { label: "LDF", href: "/ldf" },
    ],
  },
];

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <TransitionLink
      href={href}
      className={`relative px-3.5 py-1.5 text-sm transition-colors duration-200 rounded-lg cursor-pointer flex items-center justify-center font-semibold group
        ${
          isActive
            ? "bg-forest-600 text-white font-bold shadow-md"
            : "text-gray-700 dark:text-gray-200 hover:text-forest-700 dark:hover:text-lime"
        }
      `}
    >
      <span className="relative">
        {label}
        {/* Underline reveal saat hover (non-aktif) */}
        {!isActive && (
          <span className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-forest-600 dark:bg-lime transition-all duration-300 group-hover:w-full" />
        )}
      </span>
    </TransitionLink>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const close = () => setMobileOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="sticky top-0 z-50 py-3 px-4 transition-all duration-300"
    >
      {/* Skip to Main Content Link for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-forest-600 focus:text-white focus:font-bold focus:rounded-xl focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-lime"
      >
        Langsung ke Konten Utama
      </a>

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          animate={{
            y: 0,
            scale: scrolled ? 0.985 : 1,
          }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={`relative flex items-center justify-between rounded-2xl px-5 py-2.5 transition-all duration-300 ${
            scrolled
              ? "glass shadow-xl border border-gray-200/90 dark:border-lime/50 dark:ring-1 dark:ring-lime/30"
              : "glass shadow-md border border-gray-200/60 dark:border-lime/30"
          }`}
        >
          {/* KIRI: Logo + Nama */}
          <TransitionLink href="/" className="flex items-center gap-2.5 cursor-pointer group">
            <motion.div whileHover={{ rotate: 5, scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
              <Image src="/image/logo-jnukmi.svg" alt="JN UKMI Logo" width={36} height={36} className="h-9 w-auto shrink-0" />
            </motion.div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-base text-forest-900 dark:text-lime whitespace-nowrap group-hover:text-forest-600 dark:group-hover:text-lime transition-colors">JN UKMI</span>
              <span className="text-[8px] font-semibold text-forest-600 dark:text-gray-300 tracking-wider whitespace-nowrap">Universitas Sebelas Maret</span>
            </div>
          </TransitionLink>

          {/* TENGAH: Nav links (Absolute Centered) */}
          <div className="hidden md:flex md:absolute md:left-1/2 md:-translate-x-1/2 items-center gap-1">
            {navItems.map((item) =>
              item.items ? (
                <NavDropdown key={item.label} item={item} />
              ) : (
                <NavLink key={item.label} href={item.href || "#"} label={item.label} />
              )
            )}
          </div>

          {/* KANAN: Search, Theme Toggle & Contact */}
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => window.dispatchEvent(new Event("jnukmi:open-search"))}
              aria-label="Buka pencarian (Ctrl+K)"
              title="Cari (Ctrl+K)"
              className="p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:text-forest-700 dark:hover:text-lime hover:bg-forest-50 dark:hover:bg-forest-950/60 transition-colors cursor-pointer border border-transparent hover:border-lime/40 hidden sm:inline-flex"
            >
              <Search className="w-4.5 h-4.5" />
            </motion.button>
            <ThemeToggle />
            <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.96 }}>
              <TransitionLink
                href="/kontak"
                className="hidden md:inline-flex items-center gap-1.5 bg-forest-600 hover:bg-forest-700 text-white text-sm font-semibold px-4 py-1.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-forest-600/30 hover:scale-[1.03] cursor-pointer active:scale-95"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Kontak</span>
              </TransitionLink>
            </motion.div>

            <motion.button
              whileTap={{ scale: 0.9 }}
              className="md:hidden p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle Menu Mobile"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </motion.div>

        <AnimatePresence>
          {mobileOpen && <MobileMenu items={navItems} onClose={close} />}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
