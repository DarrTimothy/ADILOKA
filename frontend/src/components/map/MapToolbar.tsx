"use client";

import { Search, X, MapPin } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNotif } from "@/context/NotifContext";

type Props = {
  searchProvince: string;
  setSearchProvince: React.Dispatch<React.SetStateAction<string>>;
  setSearchTrigger: React.Dispatch<React.SetStateAction<number>>;
  isSidebarOpen: boolean;
};

interface RegionData {
  province_name: string;
  bps_code: string;
  geometry_type: string;
  is_completed: boolean;
  coordinates: any[];
}

interface BackendResponse {
  success: boolean;
  message: string;
  result: {
    current_page: number;
    data: RegionData[];
  };
}

export default function MapToolbar({
  searchProvince,
  setSearchProvince,
  setSearchTrigger,
  isSidebarOpen,
}: Props) {
  const [history, setHistory] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { showNotif } = useNotif();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("province-history");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (!searchProvince.trim()) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/regions?q=${encodeURIComponent(searchProvince.trim())}`,
        );
        if (!response.ok) throw new Error("Gagal mengambil data");

        const resData: BackendResponse = await response.json();

        if (resData.success && resData.result?.data) {
          const provinceNames = resData.result.data.map(
            (item) => item.province_name,
          );
          setSuggestions(provinceNames);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching regions:", error);
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchProvince]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function triggerMapZoom(provinceName: string) {
    const updated = [
      provinceName,
      ...history.filter(
        (item) => item.toLowerCase() !== provinceName.toLowerCase(),
      ),
    ].slice(0, 5);

    setHistory(updated);
    localStorage.setItem("province-history", JSON.stringify(updated));
    setSearchProvince(provinceName);
    setSearchTrigger((prev) => prev + 1);
    setIsDropdownOpen(false);
  }

  async function handleSearch() {
    if (!searchProvince.trim()) return;

    const query = searchProvince.trim();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/regions?q=${encodeURIComponent(query)}`,
      );
      if (!response.ok) throw new Error("Gagal mengambil data");

      const resData: BackendResponse = await response.json();

      if (resData.success && resData.result?.data) {
        const provinceNames = resData.result.data.map(
          (item) => item.province_name,
        );
        const exactMatch = provinceNames.find(
          (name) =>
            name.toLowerCase() === query.toLowerCase() ||
            name.toLowerCase().includes(query.toLowerCase()),
        );

        if (!exactMatch) {
          showNotif(
            "Provinsi tidak ditemukan! Silakan pilih dari saran dropdown yang tersedia.",
            "error",
          );
          setSearchProvince("");
          setIsDropdownOpen(false);
          return;
        }

        triggerMapZoom(exactMatch);
      }
    } catch (error) {
      showNotif(
        "Gagal terhubung ke server untuk memvalidasi provinsi.",
        "error",
      );
    }
  }

  function handleDeleteHistory(e: React.MouseEvent, provinceToDelete: string) {
    e.stopPropagation();
    const updated = history.filter((item) => item !== provinceToDelete);
    setHistory(updated);
    localStorage.setItem("province-history", JSON.stringify(updated));
  }

  return (
    <div
      className={`
      ${isSidebarOpen ? "hidden md:flex" : "flex"} 
      flex-col-reverse md:flex-row md:items-center justify-between gap-4 md:gap-6 px-4 md:px-5 py-3 w-full max-w-full
    `}
    >
      <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 md:flex-wrap max-w-full no-scrollbar shrink-0">
        {history.map((province) => (
          <div
            key={province}
            onClick={() => triggerMapZoom(province)}
            className="relative whitespace-nowrap flex items-center justify-center pl-4 pr-7 py-1.5 md:py-2 rounded-full bg-white/95 backdrop-blur-md text-xs md:text-sm font-semibold text-gray-700 border border-gray-200 
            shadow-md hover:bg-[#7B0000] hover:text-white transition-all duration-300 cursor-pointer"
          >
            <span>{province}</span>
            <button
              onClick={(e) => handleDeleteHistory(e, province)}
              className="absolute top-1/2 -translate-y-1/2 right-2 p-0.5 rounded-full text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>

      <div
        ref={dropdownRef}
        className="relative w-full md:w-72 shrink-0 z-[9999]"
      >
        <div className="flex items-center gap-3 bg-[#F8F8F8] px-4 py-2.5 md:py-2 rounded-xl border border-gray-200 shadow-lg md:shadow-xl">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            value={searchProvince}
            onChange={(e) => {
              setSearchProvince(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="Cari provinsi..."
            className="w-full outline-none text-sm bg-transparent text-[#2B0A0A] placeholder:text-gray-500 font-medium"
          />
        </div>

        {isDropdownOpen && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-2xl overflow-hidden z-[9999] max-h-60 overflow-y-auto no-scrollbar">
            <div className="px-3 py-1.5 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
              Hasil Pencarian Provinsi
            </div>
            {suggestions.map((province) => (
              <div
                key={province}
                onClick={() => triggerMapZoom(province)}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#7B0000] hover:text-white text-gray-700 text-sm font-semibold transition-colors duration-200 cursor-pointer"
              >
                <MapPin size={14} className="opacity-60 shrink-0" />
                <span className="truncate">{province}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
