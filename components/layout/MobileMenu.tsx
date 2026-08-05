"use client";

import { useState } from "react";
import { ChevronDown, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TransitionLink } from "@/components/ui/TransitionLink";

type NavItem = {
  label: string;
  href?: string;
  target?: string;
  rel?: string;
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
    <motion.div
      initial={{ opacity: 0, y: -12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.98, transition: { duration: 0.18 } }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="md:hidden absolute top-full left-4 right-4 z-50 mt-2 glass rounded-2xl shadow-2xl border border-gray-200/90 dark:border-lime/40 dark:ring-1 dark:ring-lime/20 overflow-hidden p-3"
    >
      <div className="flex flex-col gap-1">
        {items.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: 0.06 + index * 0.05,
              duration: 0.32,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {item.items ? (
              <MobileSubMenu item={item} onClose={onClose} />
            ) : (
              <MobileLink
                href={item.href || "#"}
                label={item.label}
                target={item.target}
                rel={item.rel}
                onClick={onClose}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Kontak button at bottom */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 + items.length * 0.05, duration: 0.3 }}
        className="pt-3 mt-2 border-t border-gray-100 dark:border-gray-800 px-1"
      >
        <TransitionLink
          href="/kontak"
          onClick={onClose}
          className="flex items-center justify-center gap-2 w-full bg-forest-600 hover:bg-forest-800 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-forest-600/30 active:scale-95 cursor-pointer"
        >
          <Phone className="w-4 h-4" />
          Kontak
        </TransitionLink>
      </motion.div>
    </motion.div>
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
    <div className="rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm text-gray-800 dark:text-gray-200 hover:bg-forest-50 dark:hover:bg-gray-800 hover:text-forest-700 font-bold transition-all rounded-xl cursor-pointer"
      >
        {item.label}
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -6 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -6, transition: { duration: 0.15 } }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="bg-gray-50/80 dark:bg-gray-800/60 rounded-xl p-2 my-1 space-y-1 border border-gray-100 dark:border-gray-800 overflow-hidden"
          >
            {item.items?.map((sub) =>
              sub.items ? (
                <div key={sub.label} className="pt-1 first:pt-0">
                  <span className="block px-3 py-1 text-[11px] font-black uppercase tracking-wider text-forest-600 dark:text-lime">
                    {sub.label}
                  </span>
                  <div className="pl-2 space-y-0.5 border-l-2 border-forest-200/60 dark:border-gray-700 ml-3 my-1">
                    {sub.items.map((leaf) => (
                      <MobileLink
                        key={leaf.label}
                        href={leaf.href || "#"}
                        label={leaf.label}
                        target={leaf.target}
                        rel={leaf.rel}
                        onClick={onClose}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <MobileLink
                  key={sub.label}
                  href={sub.href || "#"}
                  label={sub.label}
                  target={sub.target}
                  rel={sub.rel}
                  onClick={onClose}
                />
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileLink({
  href,
  label,
  target,
  rel,
  onClick,
}: {
  href: string;
  label: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
}) {
  return (
    <TransitionLink
      href={href}
      target={target}
      rel={rel}
      className="block px-3.5 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-forest-50 dark:hover:bg-gray-800 hover:text-forest-700 dark:hover:text-lime transition-all rounded-xl cursor-pointer"
      onClick={onClick}
    >
      {label}
    </TransitionLink>
  );
}
