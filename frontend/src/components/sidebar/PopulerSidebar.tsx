"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export default function PopulerSidebar() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPopularGames() {
      try {
        const res = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/traditional-games/popular-week`,
          {
            method: "GET",
          }
        );

        const json = await res.json();

        setGames(json.result || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadPopularGames();
  }, []);

  return (
    <aside className="w-full bg-white border-r border-gray-200 p-5 overflow-y-auto">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp size={22} className="text-green-600" />

        <h2 className="text-xl font-bold text-[#7B0000]">
          Populer Minggu Ini
        </h2>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">Memuat data...</p>
      ) : (
        <div className="space-y-4">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <img
                src={game.cover_img}
                alt={game.title}
                className="w-full h-40 object-cover"
              />

              <div className="p-4">
                <h3 className="font-bold text-[#2B0A0A]">
                  {game.title}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {game.region?.province_name}
                </p>

                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {game.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}