"use client";

import dynamic from "next/dynamic";
import MapToolbar from "./MapToolbar";
import type { Region } from "@/type";

const ChoroplethMap = dynamic(() => import("./ChoroplethMap"), {
  ssr: false,
});

type Props = {
  selectedProvince: Region | null;
  setSelectedProvince: (province: Region | null) => void;
  refreshRegions: number;
  searchProvince: string;
  setSearchProvince: React.Dispatch<React.SetStateAction<string>>;
  searchTrigger: number;
  setSearchTrigger: React.Dispatch<React.SetStateAction<number>>;
  isSidebarOpen: boolean; 
};

export default function MapWrapper({
  selectedProvince,
  setSelectedProvince,
  refreshRegions,
  searchProvince,
  setSearchProvince,
  searchTrigger,
  setSearchTrigger,
  isSidebarOpen, 
}: Props) {
  return (
    <div className="relative flex-1 h-full w-full overflow-hidden">
      <div 
        className={`absolute top-4 md:top-6 left-0 right-0 z-1000 justify-center pointer-events-none px-4
          ${isSidebarOpen ? "hidden md:flex" : "flex"}`}
      >
        <div className="pointer-events-auto w-full max-w-4xl flex justify-center">
          <MapToolbar
            searchProvince={searchProvince}
            setSearchProvince={setSearchProvince}
            setSearchTrigger={setSearchTrigger}
            isSidebarOpen={isSidebarOpen} 
          />
        </div>
      </div>
      <div className="absolute inset-0">
        <ChoroplethMap
          selectedProvince={selectedProvince}
          setSelectedProvince={setSelectedProvince}
          refreshRegions={refreshRegions}
          searchProvince={searchProvince}
          searchTrigger={searchTrigger}
        />
      </div>
    </div>
  );
}