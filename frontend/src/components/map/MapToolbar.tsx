"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  searchProvince: string;
  setSearchProvince: React.Dispatch<React.SetStateAction<string>>;
  setSearchTrigger: React.Dispatch<React.SetStateAction<number>>;
  isSidebarOpen: boolean;
};

export default function MapToolbar({
  searchProvince,
  setSearchProvince,
  setSearchTrigger,
  isSidebarOpen,
}: Props) {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("province-history");

    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  function handleSearch() {
    if (!searchProvince.trim()) return;

    const province = searchProvince.trim();

    const updated = [
      province,
      ...history.filter(
        (item) => item.toLowerCase() !== province.toLowerCase(),
      ),
    ].slice(0, 5);

    setHistory(updated);

    localStorage.setItem("province-history", JSON.stringify(updated));

    setSearchTrigger((prev) => prev + 1);
  }

  return (
    <div
      className={`
      ${isSidebarOpen ? "hidden md:flex" : "flex"} 
      flex-col-reverse md:flex-row md:items-center justify-between gap-4 md:gap-6 px-4 md:px-5 py-3 w-full max-w-full overflow-hidden
    `}
    >
      <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 md:flex-wrap max-w-full no-scrollbar">
        {history.map((province) => (
          <button
            key={province}
            onClick={() => {
              setSearchProvince(province);
              setSearchTrigger((prev) => prev + 1);
            }}
            className="whitespace-nowrap px-3 py-1.5 md:px-5 md:py-2.5 rounded-full bg-white/95 backdrop-blur-md text-xs md:text-sm font-semibold text-gray-700 border border-gray-200 
            shadow-md hover:bg-[#7B0000] hover:text-white transition-all duration-300 cursor-pointer"
          >
            {province}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-3 bg-[#F8F8F8] px-4 py-2.5 md:py-2 rounded-xl border border-gray-200 w-full md:w-72 shadow-lg md:shadow-xl shrink-0">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          value={searchProvince}
          onChange={(e) => setSearchProvince(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          placeholder="Cari provinsi..."
          className="w-full outline-none text-sm bg-transparent text-[#2B0A0A] placeholder:text-gray-500 font-medium"
        />
      </div>
    </div>
  );
}
