"use client";

import dynamic from "next/dynamic";

const ChoroplethMap = dynamic(() => import("./ChoroplethMap"), { ssr: false });

type Props = {
  selectedProvince: any;
  setSelectedProvince: (province: any) => void;
};

export default function MapWrapper({
  selectedProvince,
  setSelectedProvince,
}: Props) {
  return (
    <div className="flex-1">
      <ChoroplethMap
        selectedProvince={selectedProvince}
        setSelectedProvince={setSelectedProvince}
      />
    </div>
  );
}
