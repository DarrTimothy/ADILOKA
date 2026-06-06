"use client";

import type { Game } from "@/type";

type Props = {
  game: Game;
  onSelect: (game: Game) => void;
};

export default function ProvinceGameCard({ game, onSelect }: Props) {
  return (
    <div className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:border-[#7B0000]/30 transition-all duration-300">
      <div className="relative">
        <img
          src={game.cover_img ?? game.image}
          alt={game.title}
          className="w-full h-32 sm:h-36 object-cover group-hover:scale-[1.03] transition-transform duration-500"
        />

        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-[#7B0000] text-[11px] font-semibold px-3 py-1 rounded-full">
            Permainan Tradisional
          </span>
        </div>
      </div>

      <div className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-bold text-[#2B0A0A] line-clamp-1">
          {game.title}
        </h3>

        <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-2">
          {game.subtitle}
        </p>

        <button
          onClick={() => onSelect(game)}
          className="mt-5 w-full flex items-center justify-center gap-2 bg-[#7B0000] hover:bg-[#5E0000] text-white font-semibold text-xs sm:text-sm py-2.5 sm:py-3 
          rounded-xl shadow-md shadow-[#7B0000]/20 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
        >
          <span>Mulai Jelajahi</span>
        </button>
      </div>
    </div>
  );
}
