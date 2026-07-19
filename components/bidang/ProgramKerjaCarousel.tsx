interface ProgramKerjaCarouselProps {
  program_kerja: Array<{ title: string; description: string }>;
}

export function ProgramKerjaCarousel({ program_kerja }: ProgramKerjaCarouselProps) {
  if (!program_kerja || program_kerja.length === 0) return null;

  return (
    <section className="bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-forest-900 mb-8 text-center">
          Program Kerja
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {program_kerja.map((prog, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="w-10 h-10 bg-forest-400/20 text-forest-600 rounded-lg flex items-center justify-center font-bold mb-4">
                {i + 1}
              </div>
              <h3 className="font-semibold text-forest-900 mb-2">{prog.title}</h3>
              <p className="text-gray-600 text-sm">{prog.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
