"use client";

import { useState } from "react";

import MapWrapper from "@/components/map/MapWrapper";
import ProvinceSidebar from "@/components/province-sidebar/ProvinceSidebar";
import PopulerSidebar from "@/components/sidebar/PopulerSidebar";
import ProvinceModal from "@/components/province-sidebar/ProvinceModal"; 
import { useSidebar } from "@/context/SidebarContext";

export default function Home() {
  const { 
    showPopularWeek, 
    selectedPopularGame, 
    setShowPopularWeek, 
    setSelectedPopularGame,
    previewImage,
    previewVideo,
    setPreviewImage,
    setPreviewVideo
  } = useSidebar();

  const [selectedProvince, setSelectedProvince] = useState<any>(null);
  const [refreshRegions, setRefreshRegions] = useState(0);
  const [searchProvince, setSearchProvince] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(0);
  const isSidebarLeftOpen = showPopularWeek;
  const isSidebarRightOpen = (selectedProvince || selectedPopularGame) && !showPopularWeek;
  const isSidebarOpen = isSidebarLeftOpen || isSidebarRightOpen;

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden relative"> 
        <div className="flex-1 relative h-full w-full">
          <MapWrapper
            selectedProvince={selectedProvince}
            setSelectedProvince={setSelectedProvince}
            refreshRegions={refreshRegions}
            searchProvince={searchProvince}
            setSearchProvince={setSearchProvince}
            searchTrigger={searchTrigger}
            setSearchTrigger={setSearchTrigger}
            isSidebarOpen={isSidebarOpen}
          />
        </div>
        <div
          className={`h-full bg-white transition-all duration-300 ease-in-out overflow-hidden z-20 border-l border-gray-100
            ${showPopularWeek ? "w-full md:w-80 lg:w-96 opacity-100" : "w-0 opacity-0"}`}
        >
          <PopulerSidebar 
            refreshRegions={refreshRegions} 
            onCloseSidebar={() => setShowPopularWeek(false)}
          />
        </div>
        <div
          className={`h-full bg-white transition-all duration-300 ease-in-out overflow-hidden z-20
            ${(selectedProvince || selectedPopularGame) && !showPopularWeek
              ? "w-full md:w-105 opacity-100"
              : "w-0 opacity-0"}`}
        >
          <ProvinceSidebar
            selectedProvince={selectedProvince}
            setRefreshRegions={setRefreshRegions}
            onCloseSidebar={() => {
              setSelectedProvince(null);
              setSelectedPopularGame(null);
            }}
          />
        </div>
      </div>
      <ProvinceModal
        previewImage={previewImage}
        previewVideo={previewVideo}
        onClose={() => {
          setPreviewImage(null);
          setPreviewVideo(null);
        }}
      />
    </div>
  );
}