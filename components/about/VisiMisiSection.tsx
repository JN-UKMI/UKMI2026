interface VisiMisiSectionProps {
  visi: string;
  misi: string;
}

export function VisiMisiSection({ visi, misi }: VisiMisiSectionProps) {
  return (
    <>
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-forest-900 mb-8 text-center">
            Visi
          </h2>
          <p className="text-lg text-muted leading-relaxed max-w-3xl mx-auto">
            {visi}
          </p>
        </div>
      </section>

      <section className="py-16 px-4 bg-transparent">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-forest-900 mb-8 text-center">
            Misi
          </h2>
          <p className="text-lg text-muted leading-relaxed">
            {misi}
          </p>
        </div>
      </section>
    </>
  );
}