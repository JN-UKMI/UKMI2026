"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

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

const chevron = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
  </svg>
);

const hamburger = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

function NavLink({ href, label, onClick, isMobile }: { href: string; label: string; onClick?: () => void; isMobile?: boolean }) {
  return (
    <Link
      href={href}
      className={isMobile ? "block px-4 py-2 text-gray-700 hover:bg-gray-100" : "px-4 py-2 text-gray-700 hover:text-green-700 font-medium"}
      onClick={onClick}
    >
      {label}
    </Link>
  );
}

function renderSubMenu(items: NavItem[], isMobile?: boolean) {
  return (
    <div className={isMobile ? "bg-gray-50" : "absolute left-0 w-48 bg-white border rounded-lg shadow-lg py-2 z-50"}>
      {items.map((sub) =>
        sub.items ? (
          <div key={sub.label}>
            <span className="block px-4 py-2 text-xs font-semibold uppercase tracking-wider text-green-700">
              {sub.label}
            </span>
            {renderSubMenu(sub.items, isMobile)}
          </div>
        ) : (
          <NavLink key={sub.label} href={sub.href || "#"} label={sub.label} onClick={isMobile ? undefined : undefined} isMobile={isMobile} />
        )
      )}
    </div>
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
            <span className="hidden sm:inline font-bold text-lg text-green-900">JN UKMI</span>
          </div>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) =>
              item.items ? (
                <div key={item.label} className="relative group">
                  <button className="px-4 py-2 text-gray-700 hover:text-green-700 font-medium flex items-center gap-1 cursor-default">
                    {item.label}
                    {chevron}
                  </button>
                  <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 pt-1">
                    {renderSubMenu(item.items)}
                  </div>
                </div>
              ) : (
                <NavLink key={item.label} href={item.href || "#"} label={item.label} />
              )
            )}
          </div>

          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setMobileOpen(!mobileOpen)}>
            {hamburger}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200">
            {navItems.map((item) =>
              item.items ? (
                <MobileSubMenu key={item.label} item={item} onClose={close} />
              ) : (
                <NavLink key={item.label} href={item.href || "#"} label={item.label} onClick={close} isMobile />
              )
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

function MobileSubMenu({ item, onClose }: { item: NavItem; onClose: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100 font-medium"
      >
        {item.label}
        <span className={`transition ${open ? "rotate-180" : ""}`}>{chevron}</span>
      </button>
      {open && (
        <div className="bg-gray-50">
          {item.items?.map((sub) =>
            sub.items ? (
              <div key={sub.label}>
                <span className="block px-6 py-1 text-xs font-semibold uppercase text-green-700">{sub.label}</span>
                {sub.items.map((leaf) => (
                  <NavLink key={leaf.label} href={leaf.href || "#"} label={leaf.label} onClick={onClose} isMobile />
                ))}
              </div>
            ) : (
              <NavLink key={sub.label} href={sub.href || "#"} label={sub.label} onClick={onClose} isMobile />
            )
          )}
        </div>
      )}
    </div>
  );
}
