"use client";

import { useEffect, useState } from "react";
import type { Game, Region, Media } from "@/type";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { useSidebar } from "@/context/SidebarContext";
import { useRouter } from "next/navigation";
import ProvinceGameList from "./ProvinceGameList";
import ProvinceGameDetail from "./ProvinceGameDetail";
import Skeleton from "@/components/ui/Skeleton";

type Props = {
  selectedProvince: Region | null;
  setRefreshRegions: React.Dispatch<React.SetStateAction<number>>;
  onCloseSidebar?: () => void; 
};

export default function ProvinceSidebar({
  selectedProvince,
  setRefreshRegions,
  onCloseSidebar,
}: Props) {
  const router = useRouter();
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [loadingGames, setLoadingGames] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  
  // 1. HAPUS STATE LOKAL LAMA, DAN AMBIL AMUNISI BARU DARI CONTEXT DI BAWAH INI:
  const { selectedPopularGame, setShowPopularWeek, setPreviewImage, setPreviewVideo } = useSidebar();
  
  const [isCompleted, setIsCompleted] = useState(false);
  const [completing, setCompleting] = useState(false);

  // 2. FUNGSI CLOSEPREVIEW LOKAL SUDAH TIDAK DIPERLUKAN LAGI

  async function fetchGames(regionCode: string) {
    try {
      if (!localStorage.getItem("token")) {
        router.push("/login");
        return;
      }

      setLoadingGames(true);

      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/traditional-games?region=${regionCode}`,
        {
          method: "GET",
        },
      );

      if (!res || !res.ok) {
        throw new Error(`HTTP Error: ${res?.status || "Unknown"}`);
      }

      const json = await res.json();
      setGames(json.result?.data || []);
    } catch (error: any) {
      console.error("FETCH GAMES ERROR:", error);
      if (error.message === "UNAUTHORIZED") {
        router.push("/login");
        return;
      }
      setGames([]);
    } finally {
      setLoadingGames(false);
    }
  }

  useEffect(() => {
    if (!selectedProvince?.bps_code) return;

    setSelectedGame(null);
    fetchGames(selectedProvince.bps_code);
  }, [selectedProvince?.bps_code]);

  useEffect(() => {
    if (!selectedPopularGame) return;

    handleGameClick(selectedPopularGame);
  }, [selectedPopularGame]);

  async function handleGameClick(game: Game) {
    try {
      if (!localStorage.getItem("token")) {
        router.push("/login");
        return;
      }

      setLoadingDetail(true);

      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/traditional-games/${game.id}`,
        {
          method: "GET",
        },
      );

      if (!res || !res.ok) {
        throw new Error(`HTTP Error: ${res?.status || "Unknown"}`);
      }

      const json = await res.json();
      const result = json?.result;

      if (!result) return;

      const videoMedia = result.media?.find(
        (item: Media) => item.type === "video",
      );

      const imageMedia = result.media?.filter(
        (item: Media) => item.type === "image",
      );

      setIsCompleted(result.is_completed || false);

      setSelectedGame({
        id: result.id,
        title: result.title,
        subtitle: result.subtitle,
        category: "Permainan Tradisional",
        description: result.description,
        howToPlay: result.how_to_play,
        minPlayers: result.min_players,
        maxPlayers: result.max_players,
        duration: result.duration,
        image: imageMedia?.[0]?.url || "",
        videoUrl: videoMedia?.url || "",
        media: result.media || [],
        is_completed: result.is_completed,
      });
    } catch (error: any) {
      console.error("HANDLE GAME CLICK ERROR:", error);

      if (error.message === "UNAUTHORIZED") {
        setLoadingDetail(false);
        router.push("/login");
        return;
      }
    } finally {
      setLoadingDetail(false);
    }
  }

  async function handleCompleteGame() {
    if (!selectedGame) return;

    try {
      if (!localStorage.getItem("token")) {
        router.push("/login");
        return;
      }

      setCompleting(true);

      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/traditional-games/${selectedGame.id}/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            is_completed: true,
          }),
        },
      );

      if (!res || !res.ok) {
        throw new Error(`HTTP Error: ${res?.status || "Unknown"}`);
      }

      const json = await res.json();

      setIsCompleted(json.result?.is_completed || false);
      setRefreshRegions((prev) => prev + 1);
      setShowPopularWeek(true);
    } catch (error: any) {
      console.error("COMPLETE GAME ERROR:", error);
      if (error.message === "UNAUTHORIZED") {
        setCompleting(false);
        router.push("/login");
        return;
      }
    } finally {
      setCompleting(false);
    }
  }

  if (loadingGames) {
    return (
      <aside className="w-full bg-white border-r p-5">
        <Skeleton className="h-5 w-24 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
      </aside>
    );
  }

  if (loadingDetail) {
    return (
      <aside className="w-full bg-white border-r p-5">
        <Skeleton className="h-5 w-24 mb-6" />
        <Skeleton className="w-full h-48 rounded-xl" />
        <Skeleton className="mt-4 h-7 w-40" />
        <Skeleton className="mt-2 h-4 w-52" />
        <div className="mt-6 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        <Skeleton className="mt-6 h-52 rounded-xl" />
      </aside>
    );
  }

  if (selectedGame) {
    return (
      <>
        {/* 3. Di sini onPreviewImage & onPreviewVideo otomatis mengoperasikan state global context */}
        <ProvinceGameDetail
          selectedGame={selectedGame}
          selectedProvince={selectedProvince}
          isCompleted={isCompleted}
          completing={completing}
          onBack={() => setSelectedGame(null)}
          onComplete={handleCompleteGame}
          onPreviewImage={setPreviewImage}
          onPreviewVideo={setPreviewVideo}
        />
      </>
    );
  }

  return (
    <aside className="w-full bg-white border-r p-5">
      {onCloseSidebar && (
        <div className="flex justify-start mb-4">
          <button
            onClick={onCloseSidebar}
            className="block lg:hidden w-fit py-2 px-5 bg-[#7B0000] hover:bg-[#5E0000] text-white font-bold text-xs tracking-wide rounded-full shadow-md shadow-[#7B0000]/10 active:scale-[0.96] transition-all duration-300 cursor-pointer text-center"
          >
            ✕ Tutup
          </button>
        </div>
      )}

      <h2 className="text-lg font-semibold text-[#7B0000]">
        {selectedProvince?.province_name || "Pilih Provinsi"}
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        {selectedProvince
          ? "Permainan tradisional tersedia"
          : "Klik provinsi pada peta"}
      </p>
      {selectedProvince && (
        <ProvinceGameList games={games} onSelect={handleGameClick} />
      )}
    </aside>
  );
}