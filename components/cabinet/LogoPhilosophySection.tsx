import Image from "next/image";

interface LogoPhilosophySectionProps {
  logoPath?: string;
  filosofi: string;
}

export function LogoPhilosophySection({
  logoPath = "/public/logo-jnukmi.png",
  filosofi,
}: LogoPhilosophySectionProps) {
  const hasLogo = logoPath !== "/public/placeholder.png";

  return (
    <section className="mb-12">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex flex-col md:flex-row gap-8 items-center p-8">
          <div className="w-1/2 max-w-lg flex-shrink-0">
            <Image
              src={hasLogo ? logoPath : "/public/placeholder.png"}
              alt="Logo JN UKMI"
              width={200}
              height={200}
              className="mx-auto"
              unoptimized
            />
          </div>
          <div className="w-1/2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Filosofi Logo</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {filosofi}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}