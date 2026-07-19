import { BookOpen, Heart, Users } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "LDF & Doa",
    description:
      "Lembaga Dakwah Fakultas (LDF) binaan JN UKMI dan kumpulan doa harian, doa-doa pilihan untuk diamalkan sehari-hari.",
    href: "/ldf",
  },
  {
    icon: Heart,
    title: "Kajian Rutin",
    description:
      "Ikuti kajian islami rutin setiap pekan. Berbagai tema menarik dari pembicara kompeten untuk menambah wawasan dan keimanan.",
    href: "/artikel?category=Kajian",
  },
  {
    icon: Users,
    title: "Komunitas",
    description:
      "Bergabung dengan komunitas mahasiswa islami yang aktif. Berbagi ilmu, pengalaman, dan kebersamaan dalam suasana ukhuwah.",
    href: "/tentang",
  },
];

export function FeatureCards() {
  return (
    <section className="bg-gray-50 px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-forest-900 md:text-4xl">
            Layanan Kami
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            Sumber daya islami untuk kehidupan mahasiswa
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-600/10 text-purple-600">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold text-forest-900">
                  {feature.title}
                </h3>
                <p className="mt-2 leading-relaxed text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
