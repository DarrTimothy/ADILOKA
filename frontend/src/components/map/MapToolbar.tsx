"use client";

import { Search } from "lucide-react";

const islands = [
  "Semua",
  "Sumatera",
  "Jawa & Bali",
  "Kalimantan",
  "Sulawesi",
  "Papua & Maluku",
];

export default function MapToolbar() {
  return (
    <div className="flex items-center justify-between gap-4 w-full max-w-6xl px-6">
      {/* Quick Search */}
      <div className="flex items-center gap-2 flex-wrap">
        {islands.map((island) => (
          <button
            key={island}
            className="px-5 py-2.5 rounded-full bg-white/95 backdrop-blur-md text-sm font-semibold text-gray-700 border border-gray-200 shadow-md hover:bg-[#7B0000] 
            hover:text-white hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
            {island}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-gray-200 w-full max-w-sm">
        <Search size={18} className="text-gray-400" />

        <input
          type="text"
          placeholder="Cari provinsi..."
          className="w-full outline-none text-sm bg-transparent"
        />
      </div>
    </div>
  );
}
