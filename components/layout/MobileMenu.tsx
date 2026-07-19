"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Phone } from "lucide-react";

type NavItem = {
  label: string;
  href?: string;
  items?: NavItem[];
};

export function MobileMenu({
  items,
  onClose,
}: {
  items: NavItem[];
  onClose: () => void;
}) {
  return (
    <div className="md:hidden pb-4 border-t border-gray-200">
      {items.map((item) =>
        item.items ? (
          <MobileSubMenu key={item.label} item={item} onClose={onClose} />
        ) : (
          <MobileLink
            key={item.label}
            href={item.href || "#"}
            label={item.label}
            onClick={onClose}
          />
        )
      )}

      {/* Kontak button at bottom */}
      <div className="px-4 pt-3 mt-3 border-t border-gray-100">
        <Link
          href="/ldf"
          onClick={onClose}
          className="flex items-center gap-2 w-full bg-forest-600 hover:bg-forest-800 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Phone className="w-4 h-4" />
          Kontak
        </Link>
      </div>
    </div>
  );
}

function MobileSubMenu({
  item,
  onClose,
}: {
  item: NavItem;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-medium"
      >
        {item.label}
        <ChevronDown
          className={`w-4 h-4 transition ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="bg-gray-50">
          {item.items?.map((sub) =>
            sub.items ? (
              <div key={sub.label}>
                <span className="block px-6 py-1 text-xs font-semibold uppercase text-forest-600">
                  {sub.label}
                </span>
                {sub.items.map((leaf) => (
                  <MobileLink
                    key={leaf.label}
                    href={leaf.href || "#"}
                    label={leaf.label}
                    onClick={onClose}
                  />
                ))}
              </div>
            ) : (
              <MobileLink
                key={sub.label}
                href={sub.href || "#"}
                label={sub.label}
                onClick={onClose}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}

function MobileLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      onClick={onClick}
    >
      {label}
    </Link>
  );
}
