"use client";

import { usePageTransition } from "@/components/ui/LoadingProvider";

interface TransitionLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

export function TransitionLink({ href, children, ...props }: TransitionLinkProps) {
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
      if (props.onClick) props.onClick(e);
      return;
    }

    e.preventDefault();
    if (props.onClick) props.onClick(e);
    navigateWithTransition(href);
  };

  return (
    <a href={href} {...props} onClick={handleClick}>
      {children}
    </a>
  );
}
