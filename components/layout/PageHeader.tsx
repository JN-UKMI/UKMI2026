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
    <header className="bg-gradient-to-b from-forest-50/50 via-white to-white border-b border-gray-100 pt-10 pb-8 px-4 text-center">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {badge && (
          <span className="inline-block px-3.5 py-1 mb-3 bg-forest-600/10 border border-forest-600/20 text-forest-700 rounded-full text-xs font-bold uppercase tracking-widest">
            {badge}
          </span>
        )}

        <h1 className="text-3xl md:text-5xl font-black text-forest-900 uppercase tracking-wider flex items-center justify-center gap-3">
          {icon && <span className="text-forest-600">{icon}</span>}
          {title}
        </h1>

        {subtitle && (
          <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed mt-3">
            {subtitle}
          </p>
        )}

        {/* Accent Bar */}
        <div className="w-16 h-1 bg-forest-600/30 rounded-full mt-4" />

        {children && <div className="mt-6">{children}</div>}
      </div>
    </header>
  );
}
