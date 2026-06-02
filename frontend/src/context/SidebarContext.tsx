"use client";

import { createContext, useContext, useState } from "react";

type SidebarContextType = {
  showPopularWeek: boolean;
  setShowPopularWeek: React.Dispatch<React.SetStateAction<boolean>>;
};

const SidebarContext = createContext<SidebarContextType | null>(null);

export function SidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showPopularWeek, setShowPopularWeek] = useState(false);

  return (
    <SidebarContext.Provider
      value={{
        showPopularWeek,
        setShowPopularWeek,
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