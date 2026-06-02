"use client";

import { useEffect, useState } from "react";
import type { Game } from "@/type";
import Link from "next/link";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { useSidebar } from "@/context/SidebarContext";

type Props = {
  selectedProvince: any;
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
  const [isCompleted, setIsCompleted] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const { selectedPopularGame } = useSidebar();

  async function fetchGames(regionCode: string) {
    try {
      setLoadingGames(true);

      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/traditional-games?region=${regionCode}`,
        {
          method: "GET",
        },
      );

      console.log("LIST STATUS:", res.status);

      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }

      const json = await res.json();

      console.log("LIST RESPONSE:", json);

      setGames(json.result || []);
    } catch (error) {
      console.error("FETCH GAMES ERROR:", error);

      setGames([]);
    } finally {
      setLoadingGames(false);
    }
  }

  useEffect(() => {
    if (!selectedProvince?.bps_code) return;

    console.log("SELECTED BPS CODE:", selectedProvince.bps_code);

    setSelectedGame(null);

    fetchGames(selectedProvince.bps_code);
  }, [selectedProvince?.bps_code]);

  useEffect(() => {
    if (!selectedPopularGame) return;

    handleGameClick(selectedPopularGame);
  }, [selectedPopularGame]);

  async function handleGameClick(game: Game | undefined) {
    if (!game) {
      console.error("Game tidak ditemukan");
      return;
    }

    console.log("GAME CLICKED:", game);

    const url = `${process.env.NEXT_PUBLIC_API_URL}/traditional-games/${game.id}`;

    console.log("FETCH URL:", url);

    try {
      setLoadingDetail(true);

      const res = await fetchWithAuth(url, {
        method: "GET",
      });

      console.log("DETAIL STATUS:", res.status);

      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }

      const json = await res.json();

      console.log("DETAIL RESPONSE:", json);

      const result = json?.result;

      if (!result) {
        console.error("Result kosong");
        return;
      }

      const videoMedia = result.media?.find(
        (item: any) => item.type === "video",
      );

      const imageMedia = result.media?.filter(
        (item: any) => item.type === "image",
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

      console.log("COMPLETE RESPONSE:", json);

      setIsCompleted(json.result?.is_completed || false);
      setRefreshRegions((prev) => prev + 1);
    } catch (error) {
      console.error("COMPLETE GAME ERROR:", error);
    } finally {
      setCompleting(false);
    }
  }

  const renderPreviewModal = () => {
    if (!previewImage && !previewVideo) return null;

    return (
      <div
        className="fixed inset-0 z-9999 bg-black/80 flex items-center justify-center p-5"
        onClick={() => {
          setPreviewImage(null);
          setPreviewVideo(null);
        }}
      >
        <div
          className="relative max-w-5xl w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              setPreviewImage(null);
              setPreviewVideo(null);
            }}
            className="absolute -top-12 right-0 text-white text-3xl cursor-pointer"
          >
            ✕
          </button>

          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="w-full max-h-[85vh] object-contain rounded-xl"
            />
          )}

          {previewVideo && (
            <video
              src={previewVideo}
              controls
              autoPlay
              className="w-full max-h-[85vh] rounded-xl"
            />
          )}
        </div>
      </div>
    );
  };

  if (loadingGames) {
    return (
      <aside className="w-105 bg-white border-r p-5">
        <div className="h-5 w-24 bg-gray-200 rounded mb-6"></div>

        <div className="space-y-4">
          <div className="h-24 bg-gray-200 rounded-xl"></div>

          <div className="h-24 bg-gray-200 rounded-xl"></div>

          <div className="h-24 bg-gray-200 rounded-xl"></div>
        </div>
      </aside>
    );
  }

  if (loadingDetail) {
    return (
      <aside className="w-105 bg-white border-r p-5">
        <div className="h-5 w-24 bg-gray-200 rounded mb-6"></div>

        <div className="w-full h-48 bg-gray-200 rounded-xl"></div>

        <div className="mt-4 h-7 w-40 bg-gray-200 rounded"></div>

        <div className="mt-2 h-4 w-52 bg-gray-200 rounded"></div>

        <div className="mt-6 space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>

          <div className="h-4 bg-gray-200 rounded"></div>

          <div className="h-4 w-4/5 bg-gray-200 rounded"></div>
        </div>

        <div className="mt-6 h-52 bg-gray-200 rounded-xl"></div>
      </aside>
    );
  }

  if (selectedGame) {
    return (
      <>
        {renderPreviewModal()}

        <aside className="w-full h-full bg-[#FCFCFC] border-r border-gray-100 overflow-y-auto">
          <div className="px-5 pt-5">
            <button
              onClick={() => setSelectedGame(null)}
              className="inline-flex items-center gap-2 bg-white border border-[#7B0000]/20 px-4 py-2.5 rounded-xl text-sm font-semibold text-[#7B0000] 
              hover:bg-[#7B0000] hover:text-white hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 cursor-pointer"
            >
              <span>←</span>

              <span>Kembali</span>
            </button>

            <div className="mt-5">
              <p className="text-[11px] uppercase tracking-wide text-gray-400 font-medium">
                {selectedProvince?.province_name}
              </p>

              <div className="mt-2 flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-[28px] leading-tight font-bold text-[#1F1F1F]">
                    {selectedGame.title}
                  </h1>

                  <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                    {selectedGame.subtitle}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="px-5 mt-7">
            <div className="relative rounded-3xl overflow-hidden">
              <video
                src={selectedGame.videoUrl}
                controls
                preload="metadata"
                className="w-full h-64 object-cover"
              />

              {selectedGame.videoUrl && (
                <button
                  onClick={() => setPreviewVideo(selectedGame.videoUrl || null)}
                  className="cursor-pointer absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-20 h-20 rounded-full bg-[#8B0000]/90 flex items-center justify-center">
                    <span className="text-white text-3xl ml-1">▶</span>
                  </div>
                </button>
              )}
            </div>
          </div>
          {/* THUMBNAIL SECTION */}
          <div className="px-5 mt-4">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {selectedGame.media
                ?.filter((item) => item.type === "image")
                .map((item, index) => (
                  <img
                    key={index}
                    src={item.url}
                    alt={`Foto ${index + 1}`}
                    onClick={() => setPreviewImage(item.url)}
                    className="w-20 h-20 shrink-0 rounded-xl object-cover border border-gray-200 hover:border-[#7B0000] cursor-pointer transition-all duration-300"
                  />
                ))}
            </div>
          </div>

          {/* INFO PERMAINAN */}
          <div className="px-5 mt-5">
            <div className="bg-white rounded-[28px] p-5 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-[#2B0A0A] flex items-center gap-2 mb-4">
                <span className="w-1.5 h-6 bg-[#7B0000] rounded-full"></span>
                Informasi Permainan
              </h2>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500 tracking-wide">
                    Min Pemain
                  </p>

                  <p className="mt-1 text-2xl font-bold text-[#7B0000]">
                    {selectedGame.minPlayers ?? "-"}
                  </p>
                </div>

                <div className="text-center border-x border-gray-100">
                  <p className="text-xs text-gray-500 tracking-wide">
                    Max Pemain
                  </p>

                  <p className="mt-1 text-2xl font-bold text-[#7B0000]">
                    {selectedGame.maxPlayers ?? "-"}
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-xs text-gray-500 tracking-wide">Durasi</p>

                  <p className="mt-1 text-2xl font-bold text-[#7B0000]">
                    {selectedGame.duration ?? "-"}
                  </p>

                  <p className="text-xs text-gray-400">Menit</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tentang Permainan */}
          <div className="px-5 mt-6">
            <div className="bg-white rounded-[28px] p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-[#2B0A0A] flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#7B0000] rounded-full"></span>
                Tentang Permainan
              </h2>

              <p className="mt-4 text-[15px] leading-8 text-gray-700">
                {selectedGame.description}
              </p>
            </div>
          </div>

          <div className="px-5 mt-8 pb-15">
            <div className="bg-white rounded-[28px] p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-[#2B0A0A] flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#7B0000] rounded-full"></span>
                Cara Bermain
              </h2>

              <ol className="mt-4 space-y-1 text-[15px] leading-8 text-gray-700 list-decimal pl-5">
                {selectedGame.howToPlay
                  ?.split(/\d+\.\s/)
                  .filter(Boolean)
                  .map((step, index) => (
                    <li key={index}>{step.trim()}</li>
                  ))}
              </ol>
            </div>

            <Link
              href={`/quiz/${selectedGame.id}`}
              onClick={() => console.log(`/quiz/${selectedGame.id}`)}
              className="mt-8 w-full flex items-center justify-center gap-3 bg-[#7B0000] hover:bg-[#5E0000] text-white font-semibold text-base py-4 
              rounded-2xl shadow-md shadow-[#7B0000]/20 hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] transition-all duration-300"
            >
              <span>Mulai Quiz</span>

              <span className="text-xl">→</span>
            </Link>
            <button
              onClick={handleCompleteGame}
              disabled={completing || isCompleted}
              className={`mt-5 w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-base font-semibold shadow-md transition-all duration-300 active:scale-[0.98]
                 ${
                   isCompleted
                     ? `bg-green-600 hover:bg-green-700 text-white shadow-green-600/20 hover:shadow-xl hover:-translate-y-1 `
                     : `bg-white border border-[#7B0000] text-[#7B0000] hover:bg-[#7B0000] hover:text-white hover:shadow-xl hover:-translate-y-1`
                 }
                ${completing ? "opacity-70 cursor-not-allowed" : ""} cursor-pointer`}
            >
              {completing
                ? "Menyimpan..."
                : isCompleted
                  ? "✓ Permainan Selesai"
                  : "Tandai Wilayah Selesai"}
            </button>
          </div>
        </aside>
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
        <div className="space-y-4">
          {games.length === 0 && (
            <p className="text-sm text-gray-500">
              Belum ada permainan tradisional.
            </p>
          )}

          {games.map((game) => (
            <div
              key={game.id}
              className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:border-[#7B0000]/30 
              transition-all duration-300"
            >
              <div className="relative">
                <img
                  src={game.cover_img || game.image}
                  alt={game.title}
                  className="w-full h-36 object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />

                <div className="absolute top-3 left-3">
                  <span className=" bg-white/90 backdrop-blur-sm text-[#7B0000] text-[11px] font-semibold px-3 py-1 rounded-full">
                    Permainan Tradisional
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-bold text-[#2B0A0A] line-clamp-1">
                  {game.title}
                </h3>

                <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-2">
                  {game.subtitle}
                </p>

                <button
                  onClick={() => handleGameClick(game)}
                  className="mt-5 w-full flex items-center justify-center gap-2 bg-[#7B0000] hover:bg-[#5E0000] text-white font-semibold text-sm py-3 rounded-xl shadow-md 
                  shadow-[#7B0000]/20 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
                >
                  <span>Mulai Jelajahi</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
