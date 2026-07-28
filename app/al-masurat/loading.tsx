import { Loader2 } from "lucide-react";

export default function AlMasuratLoading() {
  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center gap-4 transition-colors duration-300">
      <Loader2 className="w-10 h-10 text-forest-600 dark:text-lime animate-spin" />
      <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold tracking-wide">
        Menyiapkan Al-Ma&apos;surat...
      </p>
    </div>
  );
}
