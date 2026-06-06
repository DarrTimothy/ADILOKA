"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { useSidebar } from "@/context/SidebarContext";

type Props = {
  refreshRegions: number;
};

export default function PopulerSidebar({ refreshRegions }: Props) {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedRegions, setCompletedRegions] = useState(0);
  const [totalRegions, setTotalRegions] = useState(0);
  const { setSelectedPopularGame, setShowPopularWeek } = useSidebar();

  useEffect(() => {
    async function loadPopularGames() {
      try {
        const res = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/traditional-games/popular-week`,
          {
            method: "GET",
          },
        );

        const json = await res.json();

        setGames(json.result || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    async function loadRegionProgress() {
      try {
        let page = 1;
        let hasMore = true;

        let allRegions: any[] = [];

        while (hasMore) {
          const res = await fetchWithAuth(
            `${process.env.NEXT_PUBLIC_API_URL}/regions?page=${page}`,
            { method: "GET" },
          );
          const json = await res.json();
          const regions = json?.result?.data || [];
          if (regions.length === 0) {
            hasMore = false;
            break;
          }
          allRegions.push(...regions);

          page++;
        }
        setTotalRegions(allRegions.length);
        const completed = allRegions.filter(
          (region: any) => region.is_completed,
        ).length;

        setCompletedRegions(completed);
      } catch (error) {
        console.error(error);
      }
    }

    loadPopularGames();
    loadRegionProgress();
  }, [refreshRegions]);

  return (
    <aside className="w-full bg-white border-r border-gray-200 p-5 overflow-y-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp size={22} className="text-green-600 shrink-0" />

          <h2 className="text-lg lg:text-xl font-bold text-[#7B0000]">
            Populer Minggu Ini
          </h2>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs sm:text-sm font-medium text-gray-700">
              Progress Jelajah Nusantara
            </span>

            <span className="text-sm font-bold text-[#7B0000]">
              {completedRegions}/{totalRegions}
            </span>
          </div>

          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#7B0000] transition-all duration-500"
              style={{
                width:
                  totalRegions > 0
                    ? `${(completedRegions / totalRegions) * 100}%`
                    : "0%",
              }}
            />
          </div>

          <p className="text-xs text-gray-500 mt-2">
            {totalRegions > 0
              ? `${Math.round(
                  (completedRegions / totalRegions) * 100,
                )}% provinsi selesai`
              : "Belum ada data"}
          </p>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">Memuat data...</p>
      ) : (
        <div className="space-y-4">
          {games.map((game) => (
            <div
              key={game.id}
              onClick={() => {
                console.log("POPULAR GAME:", game);
                setSelectedPopularGame(game);
                setShowPopularWeek(false);
              }}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <img
                src={game.cover_img}
                alt={game.title}
                className="w-full h-32 sm:h-36 lg:h-40 object-cover"
              />

              <div className="p-3 lg:p-4">
                <h3 className="font-bold text-sm lg:text-base text-[#2B0A0A] line-clamp-2">
                  {game.title}
                </h3>

                <p className="text-xs lg:text-sm text-gray-500 mt-1">
                  {game.region?.province_name}
                </p>

                <p className="text-xs lg:text-sm text-gray-600 mt-2 line-clamp-2">
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
