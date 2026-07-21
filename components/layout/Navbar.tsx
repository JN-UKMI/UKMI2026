"use client";

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu } from "lucide-react";
import { NavDropdown } from "./NavDropdown";
import { MobileMenu } from "./MobileMenu";

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
          { label: "Media", href: "/bidang/media" },
          { label: "Syiar", href: "/bidang/syiar" },
          { label: "Internal", href: "/bidang/internal" },
          { label: "Eksternal", href: "/bidang/eksternal" },
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
  { label: "LDF", href: "/ldf" },
];

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-forest-600 transition-colors">
      {label}
    </Link>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const close = () => setMobileOpen(false);

  return (
    <nav className="sticky top-0 z-50 py-3 px-4">
      <div className="max-w-6xl mx-auto relative">
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 px-5 py-2">
          {/* KIRI: Logo + Nama */}
          <div className="flex items-center gap-2.5">
            <Image src="/image/logo-jnukmi.svg" alt="JN UKMI Logo" width={36} height={36} className="h-9 w-auto shrink-0" />
            <span className="font-bold text-base text-forest-900 whitespace-nowrap">JN UKMI</span>
          </div>

          {/* TENGAH: Nav links */}
          <div className="hidden md:flex items-center gap-0.5">
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
            <Link
              href="/kontak"
              className="hidden md:inline-flex items-center gap-1.5 bg-forest-600 hover:bg-forest-800 text-white text-sm font-medium px-4 py-1.5 rounded-full transition-colors"
            >
              Kontak
            </Link>
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
