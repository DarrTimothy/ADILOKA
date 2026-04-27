import MapWrapper from "@/components/map/MapWrapper";
import Header from "@/components/layout/Header";
import ProvinceSidebar from "@/components/sidebar/ProvinceSidebar";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <ProvinceSidebar />
        <MapWrapper />
      </div>
    </div>
  );
}
