"use client";

import { useRouter } from "next/navigation";
import { usePageTransition } from "@/components/ui/LoadingProvider";

interface TransitionLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

export function TransitionLink({ href, children, ...props }: TransitionLinkProps) {
  const router = useRouter();
  const { navigateWithTransition } = usePageTransition();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Check if it's an external link or a modifier key click
    if (
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      e.metaKey ||
      e.ctrlKey
    ) {
      return;
    }

    e.preventDefault();
    navigateWithTransition(href);
  };

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
