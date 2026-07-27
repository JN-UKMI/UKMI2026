export function LdfCardSkeleton() {
  return (
    <div className="h-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden animate-pulse">
      {/* ── Mobile: Horizontal | sm+: Vertical ── */}
      <div className="flex flex-row sm:flex-col h-full">
        {/* Image placeholder */}
        <div className="relative w-28 h-28 sm:w-full sm:aspect-[16/10] shrink-0 overflow-hidden bg-gray-200 dark:bg-gray-800">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300 dark:text-gray-700"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 18"
            >
              <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 5.55 1.906-3.81A.973.973 0 0 1 13.931 8a.965.965 0 0 1 .9.5l2.044 4.095Z" />
            </svg>
          </div>
        </div>

        {/* Content placeholder */}
        <div className="flex-1 p-3 sm:p-5 flex flex-col justify-between min-w-0">
          <div className="space-y-2 sm:space-y-3">
            {/* Name placeholder — 2 lines */}
            <div className="space-y-1.5">
              <div className="h-4 sm:h-5 bg-gray-200 dark:bg-gray-800 rounded-lg w-3/4" />
              <div className="h-4 sm:h-5 bg-gray-200 dark:bg-gray-800 rounded-lg w-1/2 sm:hidden" />
            </div>

            {/* Description placeholder — 2 lines mobile, 3 lines desktop */}
            <div className="space-y-1.5">
              <div className="h-3 sm:h-3.5 bg-gray-100 dark:bg-gray-800/60 rounded-lg w-full" />
              <div className="h-3 sm:h-3.5 bg-gray-100 dark:bg-gray-800/60 rounded-lg w-5/6" />
              <div className="h-3 sm:h-3.5 bg-gray-100 dark:bg-gray-800/60 rounded-lg w-4/6 hidden sm:block" />
            </div>
          </div>

          {/* Button placeholder */}
          <div className="pt-1.5 sm:pt-4 mt-auto">
            <div className="h-9 sm:h-10 bg-gradient-to-r from-purple-300 to-pink-300 dark:from-purple-800/40 dark:to-pink-800/40 rounded-xl w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
