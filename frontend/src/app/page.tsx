import MapWrapper from "@/components/map/MapWrapper";
import ProvinceSidebar from "@/components/sidebar/ProvinceSidebar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <ProvinceSidebar />
        <div className="flex-1 flex">
          <MapWrapper />
        </div>
      </div>
    </div>
  );
}
