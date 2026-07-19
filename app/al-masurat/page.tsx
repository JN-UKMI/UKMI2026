"use client";

import { useState } from "react";
import doaHarian from "@/content/doa-harian.json";

type Doa = {
  arabic: string;
  latin: string;
  terjemahan: string;
};

type DoaHarian = {
  pagi: Doa[];
  sore: Doa[];
};

const data = doaHarian as DoaHarian;
const tabs = ["Pagi", "Sore"] as const;
type Tab = (typeof tabs)[number];

export default function AlMasuratPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Pagi");

  const items = data[activeTab.toLowerCase() as keyof DoaHarian];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-b from-green-900 to-green-700 text-white py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Al-Ma&rsquo;surat
          </h1>
          <p className="text-lg text-green-100">
            Dzikir pagi & petang sesuai sunnah
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-3xl mx-auto px-4 -mt-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-green-700 text-white shadow"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Daftar Doa */}
      <div className="max-w-3xl mx-auto px-4 pb-12 space-y-4">
        {items.length === 0 ? (
          <p className="text-center text-gray-400 py-12">
            Belum ada doa untuk kategori ini.
          </p>
        ) : (
          items.map((doa, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <p
                className="text-2xl md:text-3xl leading-[2.2] text-right mb-4"
                style={{ fontFamily: "serif" }}
                dir="rtl"
              >
                {doa.arabic}
              </p>
              <p className="text-sm text-gray-500 italic mb-2">
                {doa.latin}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {doa.terjemahan}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
