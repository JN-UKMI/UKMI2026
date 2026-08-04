import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  icon?: ReactNode;
  children?: ReactNode;
}

export function PageHeader({ title, subtitle, badge, icon, children }: PageHeaderProps) {
  return (
    <header className="bg-gradient-to-b from-forest-50/50 via-white to-white dark:from-forest-950/40 dark:via-gray-950 dark:to-gray-950 border-b border-gray-100 dark:border-gray-800 pt-10 pb-8 px-4 text-center transition-colors duration-300">
      <div className="max-w-4xl mx-auto flex flex-col items-center">


        <h1 className="text-3xl md:text-5xl font-black text-forest-900 dark:text-lime uppercase tracking-wider flex items-center justify-center gap-3">
          {icon && <span className="text-forest-600 dark:text-lime">{icon}</span>}
          {title}
        </h1>

        {subtitle && (
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed mt-3">
            {subtitle}
          </p>
        )}

        {/* Accent Bar */}
        <div className="w-16 h-1 bg-forest-600/30 dark:bg-lime/50 rounded-full mt-4" />

        {children && <div className="mt-6">{children}</div>}
      </div>
    </header>
  );
}
