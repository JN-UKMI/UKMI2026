"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DoaCard } from "./DoaCard";

type Doa = {
  arabic: string;
  latin: string;
  terjemahan: string;
};

type DoaTabsProps = {
  pagi: Doa[];
  sore: Doa[];
};

export function DoaTabs({ pagi, sore }: DoaTabsProps) {
  return (
    <Tabs defaultValue="pagi" className="max-w-3xl mx-auto px-4 pb-12">
      <div className="-mt-6 mb-8">
        <TabsList className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-1">
          <TabsTrigger value="pagi" className="flex-1 data-[state=active]:bg-forest-600 data-[state=active]:text-white data-[state=active]:shadow rounded-lg">
            Pagi
          </TabsTrigger>
          <TabsTrigger value="sore" className="flex-1 data-[state=active]:bg-forest-600 data-[state=active]:text-white data-[state=active]:shadow rounded-lg">
            Sore
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="pagi" className="space-y-4 mt-0">
        {pagi.length === 0 ? (
          <p className="text-center text-gray-400 py-12">
            Belum ada doa untuk kategori ini.
          </p>
        ) : (
          pagi.map((doa, idx) => <DoaCard key={idx} {...doa} />)
        )}
      </TabsContent>

      <TabsContent value="sore" className="space-y-4 mt-0">
        {sore.length === 0 ? (
          <p className="text-center text-gray-400 py-12">
            Belum ada doa untuk kategori ini.
          </p>
        ) : (
          sore.map((doa, idx) => <DoaCard key={idx} {...doa} />)
        )}
      </TabsContent>
    </Tabs>
  );
}
