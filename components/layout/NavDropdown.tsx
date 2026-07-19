"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

type NavItem = {
  label: string;
  href?: string;
  items?: NavItem[];
};

export function NavDropdown({ item }: { item: NavItem }) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggle = (label: string) =>
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-forest-600 cursor-default outline-none transition-colors">
        {item.label}
        <ChevronDown className="w-4 h-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        sideOffset={8}
        className="w-auto min-w-0 bg-white rounded-xl shadow-lg border border-gray-100 p-1.5 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-open:slide-in-from-top-2 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-closed:slide-out-to-top-2 duration-200"
      >
        {item.items?.map((sub) =>
          sub.items ? (
            <div key={sub.label}>
              <button
                onClick={() => toggle(sub.label)}
                className="w-full flex items-center justify-between pl-[18px] pr-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors"
              >
                {sub.label}
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${openSections[sub.label] ? "rotate-90" : ""}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ease-in-out ${
                  openSections[sub.label] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="pt-0.5">
                  {sub.items.map((leaf) => (
                    <DropdownMenuItem key={leaf.label}>
                      <a
                        href={leaf.href || "#"}
                        className="block w-full text-sm rounded-md px-5 py-1.5 hover:bg-gray-100 transition-colors"
                      >
                        {leaf.label}
                      </a>
                    </DropdownMenuItem>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <DropdownMenuItem key={sub.label}>
              <a
                href={sub.href || "#"}
                className="block w-full text-sm rounded-md px-3 py-1.5 hover:bg-gray-100 transition-colors"
              >
                {sub.label}
              </a>
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
