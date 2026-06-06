"use client";

import type { Game } from "@/type";
import ProvinceGameCard from "./ProvinceGamecard";

type Props = {
  games: Game[];
  onSelect: (game: Game) => void;
};

export default function ProvinceGameList({
  games,
  onSelect,
}: Props) {
  if (games.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Belum ada permainan tradisional.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {games.map((game) => (
        <ProvinceGameCard
          key={game.id}
          game={game}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}