"use client";

import { createContext, useContext, useState } from "react";
import type { Game } from "@/type";

type SidebarContextType = {
  showPopularWeek: boolean;
  setShowPopularWeek: React.Dispatch<React.SetStateAction<boolean>>;
  selectedPopularGame: Game | null;
  setSelectedPopularGame: React.Dispatch<React.SetStateAction<Game | null>>;
};

const SidebarContext = createContext<SidebarContextType | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [showPopularWeek, setShowPopularWeek] = useState(false);
  const [selectedPopularGame, setSelectedPopularGame] = useState<Game | null>(
    null,
  );

  return (
    <SidebarContext.Provider
      value={{
        showPopularWeek,
        setShowPopularWeek,
        selectedPopularGame,
        setSelectedPopularGame,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("SidebarContext belum dibungkus Provider");
  }

  return context;
}
