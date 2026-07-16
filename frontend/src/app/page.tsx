"use client";

import { useEffect } from "react";
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

  useEffect(() => {
    if (selectedProvince || selectedPopularGame) {
      setShowPopularWeek(false);
    }
  }, [selectedProvince, selectedPopularGame, setShowPopularWeek]);

  useEffect(() => {
    if (showPopularWeek) {
      setSelectedProvince(null);
      setSelectedPopularGame(null);
    }
  }, [showPopularWeek, setSelectedPopularGame]);

  const isSidebarLeftOpen = showPopularWeek;
  const isSidebarRightOpen = (selectedProvince || selectedPopularGame) !== null;
  const isSidebarOpen = isSidebarLeftOpen || isSidebarRightOpen;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      <div className="flex flex-1 overflow-hidden relative"> 
        <div
          className={`h-full bg-white transition-all duration-300 ease-in-out overflow-y-auto z-20 border-r border-gray-100 shrink-0
            ${showPopularWeek ? "w-full md:w-80 lg:w-96 opacity-100" : "w-0 opacity-0 pointer-events-none border-none"}`}
        >
          <div className="w-full h-full min-w-[320px] lg:min-w-[384px]">
            <PopulerSidebar 
              refreshRegions={refreshRegions} 
              onCloseSidebar={() => setShowPopularWeek(false)}
            />
          </div>
        </div>
        
        <div className="flex-1 relative h-full w-full overflow-hidden">
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
          className={`h-full bg-white transition-all duration-300 ease-in-out overflow-y-auto z-20 border-l border-gray-100 shrink-0
            ${(selectedProvince || selectedPopularGame)
              ? "w-full md:w-105 opacity-100"
              : "w-0 opacity-0 pointer-events-none border-none"}`}
        >
          <div className="w-full h-full min-w-105">
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