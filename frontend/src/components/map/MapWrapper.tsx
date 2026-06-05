"use client";

import dynamic from "next/dynamic";
import MapToolbar from "./MapToolbar";

const ChoroplethMap = dynamic(() => import("./ChoroplethMap"), {
  ssr: false,
});

type Props = {
  selectedProvince: any;
  setSelectedProvince: (province: any) => void;
  refreshRegions: number;
  searchProvince: string;
  setSearchProvince: React.Dispatch<React.SetStateAction<string>>;
  searchTrigger: number;
  setSearchTrigger: React.Dispatch<React.SetStateAction<number>>;
};

export default function MapWrapper({
  selectedProvince,
  setSelectedProvince,
  refreshRegions,
  searchProvince,
  setSearchProvince,
  searchTrigger,
  setSearchTrigger,
}: Props) {
  return (
    <div className="relative flex-1 h-full">
      {/* Toolbar Overlay */}
      <div className="absolute top-6 left-0 right-0 z-1000 flex justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <MapToolbar
            searchProvince={searchProvince}
            setSearchProvince={setSearchProvince}
            setSearchTrigger={setSearchTrigger}
          />
        </div>
      </div>

      {/* Map */}
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
