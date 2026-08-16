"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { usePathname } from "next/navigation";
import { TransitionLink } from "@/components/ui/TransitionLink";

type NavItem = {
  label: string;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  items?: NavItem[];
};

export function NavDropdown({ item }: { item: NavItem }) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const pathname = usePathname();

  const toggle = (label: string) =>
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));

  // Check if any sub-item of this dropdown is currently active
  const isAnyChildActive = item.items?.some((sub) => {
    if (sub.items) {
      return sub.items.some((leaf) => leaf.href && pathname.startsWith(leaf.href));
    }
    return sub.href && pathname.startsWith(sub.href);
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Menu dropdown ${item.label}`}
        className={`group flex items-center gap-1 px-3.5 py-1.5 text-sm transition-all duration-150 rounded-lg border-2 active:scale-95 cursor-default outline-none
          ${
            isAnyChildActive
              ? "bg-forest-600 dark:bg-forest-600 text-white font-bold border-forest-600 dark:border-forest-500 shadow-md"
              : "text-gray-700 dark:text-gray-200 font-semibold border-transparent hover:border-forest-600/80 hover:bg-forest-50/50 dark:hover:bg-gray-800 active:bg-forest-200/50 active:border-forest-700/60"
          }
        `}
      >
        {item.label}
        <ChevronDown className="w-4 h-4 transition-transform duration-300 group-data-[popup-open]:rotate-180" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        sideOffset={8}
        className="w-auto min-w-0 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-lime dark:ring-1 dark:ring-lime/30 p-1.5 data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-top-2 data-closed:animate-out data-closed:fade-out-0 data-closed:slide-out-to-top-2 duration-200"
      >
        {item.items?.map((sub) =>
          sub.items ? (
            <div key={sub.label}>
              <button
                onClick={() => toggle(sub.label)}
                aria-expanded={!!openSections[sub.label]}
                aria-controls={`sub-menu-${sub.label}`}
                className="w-full flex items-center justify-between pl-3 pr-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-forest-600 dark:hover:text-lime hover:bg-forest-50/60 dark:hover:bg-gray-800 rounded-md transition-all duration-200 motion-safe:hover:translate-x-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40 dark:focus-visible:ring-lime/50"
              >
                &nbsp;&nbsp;{sub.label}
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${openSections[sub.label] ? "rotate-90" : ""}`}
                />
              </button>
              <div
                id={`sub-menu-${sub.label}`}
                className={`overflow-hidden transition-all duration-200 ease-in-out ${
                  openSections[sub.label] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="pt-0.5">
                  {sub.items.map((leaf) => (
                    <DropdownMenuItem key={leaf.label}>
                      {leaf.onClick ? (
                        <button
                          type="button"
                          onClick={leaf.onClick}
                          className="group/leaf block w-full text-left text-sm rounded-md pl-[26px] pr-3 py-1.5 font-medium text-gray-700 dark:text-gray-200 border-2 border-transparent hover:border-forest-600/80 hover:bg-forest-50/50 dark:hover:bg-gray-800 active:bg-forest-200/50 active:scale-95 motion-safe:hover:translate-x-1 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40 dark:focus-visible:ring-lime/50 cursor-pointer"
                        >
                          {leaf.label}
                        </button>
                      ) : (
                        <TransitionLink
                          href={leaf.href || "#"}
                          target={leaf.target}
                          rel={leaf.rel}
                          className="group/leaf block w-full text-sm rounded-md pl-[26px] pr-3 py-1.5 font-medium text-gray-700 dark:text-gray-200 border-2 border-transparent hover:border-forest-600/80 hover:bg-forest-50/50 dark:hover:bg-gray-800 active:bg-forest-200/50 active:scale-95 motion-safe:hover:translate-x-1 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40 dark:focus-visible:ring-lime/50"
                        >
                          {leaf.label}
                        </TransitionLink>
                      )}
                    </DropdownMenuItem>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <DropdownMenuItem key={sub.label}>
              {sub.onClick ? (
                <button
                  type="button"
                  onClick={sub.onClick}
                  className="block w-full text-left text-sm rounded-md px-3 py-1.5 font-medium text-gray-700 dark:text-gray-200 border-2 border-transparent hover:border-forest-600/80 hover:bg-forest-50/50 dark:hover:bg-gray-800 active:bg-forest-200/50 active:scale-95 motion-safe:hover:translate-x-1 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40 dark:focus-visible:ring-lime/50 cursor-pointer"
                >
                  {sub.label}
                </button>
              ) : (
                <TransitionLink
                  href={sub.href || "#"}
                  target={sub.target}
                  rel={sub.rel}
                  className="block w-full text-sm rounded-md px-3 py-1.5 font-medium text-gray-700 dark:text-gray-200 border-2 border-transparent hover:border-forest-600/80 hover:bg-forest-50/50 dark:hover:bg-gray-800 active:bg-forest-200/50 active:scale-95 motion-safe:hover:translate-x-1 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40 dark:focus-visible:ring-lime/50"
                >
                  {sub.label}
                </TransitionLink>
              )}
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
