"use client";

import { useState } from "react";

import MapWrapper from "@/components/map/MapWrapper";
import ProvinceSidebar from "@/components/sidebar/ProvinceSidebar";

export default function Home() {
  const [selectedProvince, setSelectedProvince] = useState<any>(null);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <ProvinceSidebar selectedProvince={selectedProvince} />

        <div className="flex-1 flex">
          <MapWrapper
            selectedProvince={selectedProvince}
            setSelectedProvince={setSelectedProvince}
          />
        </div>
      </div>
    </div>
  );
}
