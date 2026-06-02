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
};

export default function MapWrapper({
  selectedProvince,
  setSelectedProvince,
  refreshRegions,
}: Props) {
  return (
    <div className="relative flex-1 h-full">
      {/* Toolbar Overlay */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[9999] w-full pointer-events-none">
        <div className="flex justify-center pointer-events-auto">
          <MapToolbar />
        </div>
      </div>

      {/* Map */}
      <div className="absolute inset-0">
        <ChoroplethMap
          selectedProvince={selectedProvince}
          setSelectedProvince={setSelectedProvince}
          refreshRegions={refreshRegions}
        />
      </div>
    </div>
  );
}