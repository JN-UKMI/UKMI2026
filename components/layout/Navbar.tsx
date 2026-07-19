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
      { label: "Penjelasan JN UKMI", href: "/tentang" },
      { label: "Kabinet Iskandar Muda", href: "/kabinet" },
      {
        label: "Bidang",
        items: [
          { label: "Sekretaris", href: "/bidang/sekretaris" },
          { label: "Bendahara", href: "/bidang/bendahara" },
          { label: "Media", href: "/bidang/media" },
          { label: "Syiar", href: "/bidang/syiar" },
          { label: "Internal", href: "/bidang/internal" },
          { label: "Eksternal", href: "/bidang/eksternal" },
        ],
      },
    ],
  },
  { label: "Artikel", href: "/artikel" },
  {
    label: "Features",
    items: [
      { label: "Doa-doa", href: "/doa-doa" },
      { label: "Al Kahfi", href: "/al-kahfi" },
      { label: "Al Masurat", href: "/al-masurat" },
    ],
  },
  { label: "LDF", href: "/ldf" },
];

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="px-4 py-2 text-gray-700 hover:text-forest-600 font-medium">
      {label}
    </Link>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const close = () => setMobileOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <Image src="/logo-jnukmi.png" alt="JN UKMI Logo" width={40} height={40} className="h-10 w-auto" />
            <span className="hidden sm:inline font-bold text-lg text-forest-900">JN UKMI</span>
          </div>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) =>
              item.items ? (
                <NavDropdown key={item.label} item={item} />
              ) : (
                <NavLink key={item.label} href={item.href || "#"} label={item.label} />
              )
            )}
          </div>

          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setMobileOpen(!mobileOpen)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {mobileOpen && <MobileMenu items={navItems} onClose={close} />}
      </div>
    </nav>
  );
}
