"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu } from "lucide-react";
import { NavDropdown } from "./NavDropdown";
import { MobileMenu } from "./MobileMenu";
import { usePathname } from "next/navigation";

import { TransitionLink } from "@/components/ui/TransitionLink";

type NavItem = {
  label: string;
  href?: string;
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
      { label: "Al Masurat", href: "/al-masurat" },
      { label: "Buku UKMI", href: "/buku-ukmi" },
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
  // Check if current route matches this link's destination
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <TransitionLink
      href={href}
      className={`px-3.5 py-1.5 text-sm transition-all duration-150 rounded-lg border-2 active:scale-95 cursor-pointer
        ${
          isActive
            ? "bg-forest-100/90 text-forest-900 font-bold border-forest-600/70 shadow-md"
            : "text-gray-700 font-semibold border-transparent hover:border-forest-600/80 hover:bg-forest-50/50 active:bg-forest-200/50 active:border-forest-700/60"
        }
      `}
    >
      {label}
    </TransitionLink>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const close = () => setMobileOpen(false);

  return (
    <nav className="sticky top-0 z-50 py-3 px-4">
      <div className="max-w-6xl mx-auto relative">
        <div className="relative flex items-center justify-between bg-white rounded-2xl shadow-lg border border-gray-100/80 px-5 py-2">
          {/* KIRI: Logo + Nama */}
          <TransitionLink href="/" className="flex items-center gap-2.5 cursor-pointer">
            <Image src="/image/logo-jnukmi.svg" alt="JN UKMI Logo" width={36} height={36} className="h-9 w-auto shrink-0" />
            <div className="flex flex-col leading-none">
              <span className="font-bold text-base text-forest-900 whitespace-nowrap">JN UKMI</span>
              <span className="text-[8px] font-semibold text-forest-600 tracking-wider whitespace-nowrap">Universitas Sebelas Maret</span>
            </div>
          </TransitionLink>

          {/* TENGAH: Nav links (Absolute Centered) */}
          <div className="hidden md:flex md:absolute md:left-1/2 md:-translate-x-1/2 items-center gap-0.5">
            {navItems.map((item) =>
              item.items ? (
                <NavDropdown key={item.label} item={item} />
              ) : (
                <NavLink key={item.label} href={item.href || "#"} label={item.label} />
              )
            )}
          </div>

          {/* KANAN: Contact */}
          <div className="flex items-center gap-3">
            <TransitionLink
              href="/kontak"
              className="hidden md:inline-flex items-center gap-1.5 bg-forest-600 hover:bg-forest-800 text-white text-sm font-medium px-4 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              Kontak
            </TransitionLink>
            <button
              className="md:hidden p-1.5 rounded-lg text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {mobileOpen && <MobileMenu items={navItems} onClose={close} />}
      </div>
    </nav>
  );
}
