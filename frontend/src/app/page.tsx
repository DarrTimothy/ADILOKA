"use client";

import { useState } from "react";

import MapWrapper from "@/components/map/MapWrapper";
import ProvinceSidebar from "@/components/sidebar/ProvinceSidebar";
import PopulerSidebar from "@/components/sidebar/PopulerSidebar";
import { useSidebar } from "@/context/SidebarContext";

export default function Home() {
  const { showPopularWeek } = useSidebar();
  const [selectedProvince, setSelectedProvince] = useState<any>(null);
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [refreshRegions, setRefreshRegions] = useState(0);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        <div
          className={`h-full bg-white transition-all duration-300 ease-in-out overflow-hidden
    ${showPopularWeek ? "w-96 opacity-100" : "w-0 opacity-0"}`}
        >
          <PopulerSidebar />
        </div>

        <div className="flex-1 flex relative">
          <MapWrapper
            selectedProvince={selectedProvince}
            setSelectedProvince={setSelectedProvince}
            refreshRegions={refreshRegions}
          />
        </div>

        <div
          className={`h-full bg-white transition-all duration-300 ease-in-out overflow-hidden
    ${
      selectedProvince && !showPopularWeek
        ? "w-[420px] opacity-100"
        : "w-0 opacity-0"
    }`}
        >
          <ProvinceSidebar
            selectedProvince={selectedProvince}
            setRefreshRegions={setRefreshRegions}
          />
        </div>
      </div>
    </div>
  );
}
