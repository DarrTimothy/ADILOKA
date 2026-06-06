"use client";

import { useEffect, useState } from "react";
import type { Game, Region, Media } from "@/type";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { useSidebar } from "@/context/SidebarContext";
import ProvinceModal from "./ProvinceModal";
import ProvinceGameList from "./ProvinceGameList";
import ProvinceGameDetail from "./ProvinceGameDetail";
import Skeleton from "@/components/ui/Skeleton";

type Props = {
  selectedProvince: Region | null;
  setRefreshRegions: React.Dispatch<React.SetStateAction<number>>;
};

export default function ProvinceSidebar({
  selectedProvince,
  setRefreshRegions,
}: Props) {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [loadingGames, setLoadingGames] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completing, setCompleting] = useState(false);
  const { selectedPopularGame, setShowPopularWeek } = useSidebar();

  function closePreview() {
    setPreviewImage(null);
    setPreviewVideo(null);
  }

  async function fetchGames(regionCode: string) {
    try {
      setLoadingGames(true);

      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/traditional-games?region=${regionCode}`,
        {
          method: "GET",
        },
      );

      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }

      const json = await res.json();

      console.log("LIST RESPONSE:", json);
      console.log("RESULT:", json.result);
      console.log("IS ARRAY:", Array.isArray(json.result));

      setGames(json.result?.data || []);
    } catch (error) {
      console.error("FETCH GAMES ERROR:", error);
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
      setLoadingDetail(true);

      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/traditional-games/${game.id}`,
        {
          method: "GET",
        },
      );

      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
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
    } catch (error) {
      console.error("HANDLE GAME CLICK ERROR:", error);
    } finally {
      setLoadingDetail(false);
    }
  }

  async function handleCompleteGame() {
    if (!selectedGame) return;

    try {
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

      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }

      const json = await res.json();

      setIsCompleted(json.result?.is_completed || false);
      setRefreshRegions((prev) => prev + 1);
      setShowPopularWeek(true);
    } catch (error) {
      console.error("COMPLETE GAME ERROR:", error);
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
        <ProvinceModal
          previewImage={previewImage}
          previewVideo={previewVideo}
          onClose={closePreview}
        />

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
