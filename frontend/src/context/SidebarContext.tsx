"use client";

import { createContext, useContext, useState } from "react";

type SidebarContextType = {
  showPopularWeek: boolean;
  setShowPopularWeek: React.Dispatch<React.SetStateAction<boolean>>;

  selectedPopularGame: any;
  setSelectedPopularGame: React.Dispatch<React.SetStateAction<any>>;
};

const SidebarContext = createContext<SidebarContextType | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [showPopularWeek, setShowPopularWeek] = useState(false);
  const [selectedPopularGame, setSelectedPopularGame] = useState<any>(null);

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
