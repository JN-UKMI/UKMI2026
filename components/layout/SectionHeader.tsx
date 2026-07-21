import { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  className?: string;
}

export function SectionHeader({ title, subtitle, icon, className = "" }: SectionHeaderProps) {
  return (
    <div className={`flex flex-col items-center text-center mb-10 ${className}`}>
      {/* 1. Top Icon Container (using lucide-react SVG icons) */}
      {icon && (
        <div className="w-12 h-12 bg-forest-600/10 text-forest-600 rounded-2xl flex items-center justify-center mb-3 border border-forest-600/20 shadow-sm transition-transform hover:scale-105">
          {icon}
        </div>
      )}

      {/* 2. Main Title */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-forest-900 uppercase tracking-wider">
        {title}
      </h2>

      {/* 3. Subtitle */}
      {subtitle && (
        <p className="text-sm md:text-base text-gray-500 max-w-xl mx-auto font-medium leading-relaxed mt-2">
          {subtitle}
        </p>
      )}

      {/* 4. Bottom Lime Accent Bar */}
      <div className="w-14 h-1 bg-lime rounded-full mt-3 shadow-sm opacity-90" />
    </div>
  );
}
