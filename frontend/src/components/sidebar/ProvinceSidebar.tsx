"use client";

import { useEffect, useState } from "react";
import type { Game } from "@/type";
import Link from "next/link";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

type Props = {
  selectedProvince: any;
};

export default function ProvinceSidebar({ selectedProvince }: Props) {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const [loadingGames, setLoadingGames] = useState(false);

  const [loadingDetail, setLoadingDetail] = useState(false);

  const [games, setGames] = useState<Game[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [isCompleted, setIsCompleted] = useState(false);

  const [completing, setCompleting] = useState(false);

  const [previewVideo, setPreviewVideo] = useState<string | null>(null);

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

      setIsCompleted(result.is_completed || false);

      setSelectedGame({
        id: result.id,
        title: result.title,
        subtitle: result.subtitle,
        category: "Permainan Tradisional",
        description: result.description,
        howToPlay: result.how_to_play,
        image: result.cover_img,
        videoUrl: videoMedia?.url?.replace("watch?v=", "embed/") || "",
        videoThumbnail: videoMedia?.url?.replace(
          "https://www.youtube.com/watch?v=",
          "",
        ),
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
        },
      );

      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }

      const json = await res.json();

      console.log("COMPLETE RESPONSE:", json);

      setIsCompleted(json.result?.is_completed || false);
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
            <iframe
              src={previewVideo}
              className="w-full aspect-video rounded-xl"
              allowFullScreen
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

        <aside className="w-[420px] bg-[#FCFCFC] border-r border-gray-100 overflow-y-auto">
          <div className="px-5 pt-5">
            <button
              onClick={() => setSelectedGame(null)}
              className="
        flex items-center gap-1.5
        text-sm font-medium text-[#7B0000]
        hover:opacity-70 transition
        cursor-pointer
      "
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

              <button
                onClick={handleCompleteGame}
                disabled={completing || isCompleted}
                className={`
          mt-5 w-full rounded-2xl py-4
          text-sm font-semibold text-white
          transition-all duration-300

          ${isCompleted ? "bg-[#8B0000]" : "bg-[#7B0000] hover:bg-[#5E0000]"}

          ${completing ? "opacity-70" : ""}
        `}
              >
                {completing
                  ? "Menyimpan..."
                  : isCompleted
                    ? "✔ Sudah Dijelajahi"
                    : "Tandai Sudah Dijelajahi"}
              </button>
            </div>
          </div>
          <div className="px-5 mt-7">
            <div className="relative rounded-3xl overflow-hidden">
              <img
                src={`https://img.youtube.com/vi/${selectedGame.videoThumbnail}/hqdefault.jpg`}
                alt={selectedGame.title}
                className="w-full h-64 object-cover"
              />

              {selectedGame.videoUrl && (
                <button
                  onClick={() => setPreviewVideo(selectedGame.videoUrl || null)}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-20 h-20 rounded-full bg-[#8B0000]/90 flex items-center justify-center">
                    <span className="text-white text-3xl ml-1">▶</span>
                  </div>
                </button>
              )}
            </div>
          </div>
          {/* THUMBNAIL SECTION */}
          <div className="px-5 mt-4 flex gap-3 overflow-x-auto pb-1">
            {/* Thumbnail foto */}
            <img
              src={selectedGame.image}
              alt="Thumbnail"
              onClick={() => setPreviewImage(selectedGame.image || null)}
              className="w-20 h-20 rounded-xl object-cover border-2 border-[#7B0000] cursor-pointer"
            />

            {/* Thumbnail foto kedua dummy */}
            <img
              src={selectedGame.image}
              alt="Thumbnail"
              onClick={() => setPreviewImage(selectedGame.image || null)}
              className="w-20 h-20 rounded-xl object-cover cursor-pointer"
            />

            {/* More photos */}
            <div className="w-20 h-20 rounded-xl bg-gray-200 flex flex-col items-center justify-center text-sm text-gray-500">
              <span className="font-semibold">+5</span>
              <span>Foto</span>
            </div>
          </div>

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

          <div className="px-5 mt-8">
            <div className="bg-white rounded-[28px] p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-[#2B0A0A] flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#7B0000] rounded-full"></span>
                Cara Bermain
              </h2>

              <p className="mt-4 text-[15px] leading-8 text-gray-700">
                {selectedGame.howToPlay}
              </p>
            </div>

            <Link
              href={`/quiz/${selectedGame.id}`}
              onClick={() => console.log(`/quiz/${selectedGame.id}`)}
              className="
      mt-8 flex items-center justify-center gap-3
      bg-[#7B0000] hover:bg-[#5E0000]
      active:scale-[0.98]
      transition-all duration-300

      text-white font-semibold text-lg

      py-4 rounded-2xl
      shadow-lg shadow-[#7B0000]/20
    "
            >
              <span>Mulai Quiz</span>

              <span className="text-xl">→</span>
            </Link>
          </div>
        </aside>
      </>
    );
  }

  return (
    <aside className="w-105 bg-white border-r p-5">
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
              className="border rounded-lg p-4 hover:shadow transition"
            >
              <h3 className="font-semibold">{game.title}</h3>

              <p className="text-xs text-gray-500">{game.subtitle}</p>

              <button
                onClick={() => handleGameClick(game)}
                className="cursor-pointer mt-3 text-sm text-[#7B0000] font-medium"
              >
                Lihat Detail →
              </button>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
