"use client";

import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";

type NavItem = {
  label: string;
  href?: string;
  items?: NavItem[];
};

export function NavDropdown({ item }: { item: NavItem }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-forest-600 font-medium cursor-default outline-none">
        {item.label}
        <ChevronDown className="w-4 h-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-48">
        {item.items?.map((sub) =>
          sub.items ? (
            <DropdownMenuSub key={sub.label}>
              <DropdownMenuSubTrigger>
                {sub.label}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {sub.items.map((leaf) => (
                  <DropdownMenuItem key={leaf.label}>
                    <a href={leaf.href || "#"} className="block w-full">{leaf.label}</a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          ) : (
            <DropdownMenuItem key={sub.label}>
              <a href={sub.href || "#"} className="block w-full">{sub.label}</a>
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
