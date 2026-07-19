import { Metadata } from "next";
import { LdfCard } from "@/components/ldf/LdfCard";
import { loadLDF } from "@/lib/content";

export const metadata: Metadata = {
  title: "Lembaga Dakwah Fakultas | LDF Directory",
  description: "Direktori Lembaga Dakwah Fakultas di kampus UNS",
};

export default async function LdfPage() {
  const ldfList = await loadLDF();

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-forest-900 sm:text-4xl">
            Lembaga Dakwah Fakultas
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Direktori Lembaga Dakwah Fakultas di kampus UNS
          </p>
        </div>

        {ldfList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-slate-600">
              Belum ada data LDF yang tersedia
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {ldfList.map((ldf) => (
              <LdfCard key={ldf.nama} ldf={ldf} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
