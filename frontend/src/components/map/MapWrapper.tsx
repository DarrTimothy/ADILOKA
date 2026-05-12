"use client"

import dynamic from "next/dynamic";

const ChoroplethMap = dynamic(
    () => import("./ChoroplethMap"),
    { ssr:false }
);

export default function MapWrapper() {
  return (
    <div className="flex-1">
      <ChoroplethMap />
    </div>
  );
}