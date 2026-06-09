"use client";

import Link from "next/link";
import type { Game, Region } from "@/type";

type Props = {
  selectedGame: Game;
  selectedProvince: Region | null;
  isCompleted: boolean;
  completing: boolean;
  onBack: () => void;
  onComplete: () => void;
  onPreviewImage: (url: string) => void;
  onPreviewVideo: (url: string) => void;
  onShowScore: () => void;
};

export default function ProvinceGameDetail({
  selectedGame,
  selectedProvince,
  isCompleted,
  onBack,
  onPreviewImage,
  onPreviewVideo,
  onShowScore,
}: Props) {
  return (
    <aside className="w-full h-full bg-[#FCFCFC] border-r border-gray-100 overflow-y-auto">
      <div className="px-5 pt-5">
        <button
          onClick={onBack}
          className="
            inline-flex items-center gap-2
            bg-white border border-[#7B0000]/20
            px-4 py-2.5 rounded-xl
            text-sm font-semibold text-[#7B0000]
            hover:bg-[#7B0000]
            hover:text-white
            hover:shadow-md
            hover:-translate-y-0.5
            active:scale-[0.98]
            transition-all duration-300
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
              <h1 className="text-2xl lg:text-[28px] leading-tight font-bold text-[#1F1F1F]">
                {selectedGame.title}
              </h1>

              <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                {selectedGame.subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* VIDEO */}
      <div className="px-5 mt-7">
        <div className="relative rounded-3xl overflow-hidden">
          <video
            src={selectedGame.videoUrl}
            controls
            preload="metadata"
            className="w-full h-52 lg:h-64 object-cover"
          />

          {selectedGame.videoUrl && (
            <button
              onClick={() => onPreviewVideo(selectedGame.videoUrl)}
              className="cursor-pointer absolute inset-0 flex items-center justify-center"
            >
              <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-full bg-[#8B0000]/90 flex items-center justify-center">
                <span className="text-white text-xl lg:text-3xl ml-1">▶</span>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* THUMBNAILS */}
      <div className="px-5 mt-4">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {selectedGame.media
            ?.filter((item) => item.type === "image")
            .map((item, index) => (
              <img
                key={index}
                src={item.url}
                alt={`Foto ${index + 1}`}
                onClick={() => onPreviewImage(item.url)}
                className="
                  w-14 h-14 lg:w-20 lg:h-20 shrink-0 rounded-xl
                  object-cover border border-gray-200
                  hover:border-[#7B0000]
                  cursor-pointer
                  transition-all duration-300
                "
              />
            ))}
        </div>
      </div>

      {/* INFO */}
      <div className="px-5 mt-5">
        <div className="bg-white rounded-[28px] p-5 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#2B0A0A] flex items-center gap-2 mb-4">
            <span className="w-1.5 h-6 bg-[#7B0000] rounded-full"></span>
            Informasi Permainan
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xs text-gray-500 tracking-wide">Min Pemain</p>

              <p className="mt-1 text-2xl font-bold text-[#7B0000]">
                {selectedGame.minPlayers ?? "-"}
              </p>
            </div>

            <div className="text-center sm:border-x border-gray-100">
              <p className="text-xs text-gray-500 tracking-wide">Max Pemain</p>

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

      {/* DESKRIPSI */}
      <div className="px-5 mt-6">
        <div className="bg-white rounded-[28px] p-4 lg:p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#2B0A0A] flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[#7B0000] rounded-full"></span>
            Tentang Permainan
          </h2>
          <p className="mt-4 text-sm lg:text-[15px] leading-8 text-gray-700">
            {selectedGame.description}
          </p>
        </div>
      </div>

      {/* CARA BERMAIN */}
      <div className="px-5 mt-8 pb-15">
        <div className="bg-white rounded-[28px] p-4 lg:p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#2B0A0A] flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[#7B0000] rounded-full"></span>
            Cara Bermain
          </h2>

          <ol className="mt-4 space-y-1 text-sm lg:text-[15px] leading-8 text-gray-700 list-decimal pl-5">
            {selectedGame.howToPlay
              ?.split(/\d+\.\s/)
              .filter(Boolean)
              .map((step, index) => (
                <li key={index}>{step.trim()}</li>
              ))}
          </ol>
        </div>

        {isCompleted ? (
          <button
            onClick={onShowScore}
            className="
      mt-8 w-full flex items-center justify-center gap-3
      bg-[#7B0000]
      hover:bg-[#5E0000]
      text-white font-semibold text-base py-4
      rounded-2xl
      shadow-md shadow-[#7B0000]/20
      hover:shadow-xl
      hover:-translate-y-1
      active:scale-[0.98]
      transition-all duration-300
      cursor-pointer
    "
          >
            <span>Lihat Nilai</span>
            <span className="text-xl">→</span>
          </button>
        ) : (
          <Link
            href={`/quiz/${selectedGame.id}`}
            className="
      mt-8 w-full flex items-center justify-center gap-3
      bg-[#7B0000]
      hover:bg-[#5E0000]
      text-white font-semibold text-base py-4
      rounded-2xl
      shadow-md shadow-[#7B0000]/20
      hover:shadow-xl
      hover:-translate-y-1
      active:scale-[0.98]
      transition-all duration-300
    "
          >
            <span>Mulai Quiz</span>
            <span className="text-xl">→</span>
          </Link>
        )}
      </div>
    </aside>
  );
}
