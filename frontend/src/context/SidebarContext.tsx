"use client";

import { createContext, useContext, useState } from "react";
import type { Game } from "@/type";

type SidebarContextType = {
  showPopularWeek: boolean;
  setShowPopularWeek: React.Dispatch<React.SetStateAction<boolean>>;
  selectedPopularGame: Game | null;
  setSelectedPopularGame: React.Dispatch<React.SetStateAction<Game | null>>;
  previewImage: string | null;
  setPreviewImage: React.Dispatch<React.SetStateAction<string | null>>;
  previewVideo: string | null;
  setPreviewVideo: React.Dispatch<React.SetStateAction<string | null>>;
};

const SidebarContext = createContext<SidebarContextType | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [showPopularWeek, setShowPopularWeek] = useState(false);
  const [selectedPopularGame, setSelectedPopularGame] = useState<Game | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);

  return (
    <SidebarContext.Provider
      value={{
        showPopularWeek,
        setShowPopularWeek,
        selectedPopularGame,
        setSelectedPopularGame,
        previewImage,
        setPreviewImage,
        previewVideo,
        setPreviewVideo,
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