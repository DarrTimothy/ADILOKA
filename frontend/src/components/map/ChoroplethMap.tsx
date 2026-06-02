"use client";

import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import type { LatLngExpression } from "leaflet";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { useSidebar } from "@/context/SidebarContext";

const center: LatLngExpression = [-2.5, 118];

type Props = {
  selectedProvince: any;
  setSelectedProvince: (province: any) => void;
  refreshRegions: number;
};

export default function ChoroplethMap({
  selectedProvince,
  setSelectedProvince,
  refreshRegions,
}: Props) {
  const { setShowPopularWeek } = useSidebar();
  const [geoData, setGeoData] = useState<any>(null);
  const mapRef = useRef<any>(null);
  const indonesiaBounds: [[number, number], [number, number]] = [
    [-25.0, 90.0],
    [20.0, 155.0],
  ];
  function getProvinceStyle(isCompleted: boolean) {
    return {
      weight: 1.5,
      color: isCompleted ? "#15803D" : "#B85C5C",
      fillColor: isCompleted ? "#22C55E" : "#DC2626",
      fillOpacity: 0.6,
    };
  }

  function getHoverStyle(isCompleted: boolean) {
    return {
      weight: 3,
      color: isCompleted ? "#166534" : "#7F1D1D",
      fillColor: isCompleted ? "#16A34A" : "#B91C1C",
      fillOpacity: 0.85,
    };
  }

  function InteractiveProvinces({ data }: { data: any }) {
    const map = useMap();

    function onEachProvince(feature: any, layer: any) {
      (layer as any)._isActive = false;
      const props = feature.properties;
      const provinceStyle = getProvinceStyle(props.is_completed);

      layer.bindTooltip(props.province_name, {
        sticky: true,
        direction: "center",
        className: "province-label",
        opacity: 1,
      });

      layer.on({
        mouseover: (e: any) => {
          if (!(layer as any)._isActive) {
            layer.setStyle(getHoverStyle(props.is_completed));
          }
        },

        mouseout: () => {
          if (!(layer as any)._isActive) {
            layer.setStyle(provinceStyle);
          }
        },

        click: () => {
          setSelectedProvince(props);

          setShowPopularWeek(false);

          const isActive = (layer as any)._isActive;

          if (isActive) {
            (layer as any)._isActive = false;
            layer.setStyle(provinceStyle);

            map.flyToBounds(indonesiaBounds, {
              duration: 0.8,
            });

            return;
          }

          const mapLayers = (layer as any)._map?._layers;
          if (mapLayers) {
            Object.values(mapLayers).forEach((item: any) => {
              if (item.feature) {
                item._isActive = false;
                item.setStyle?.(
                  getProvinceStyle(item.feature.properties.is_completed),
                );
              }
            });
          }

          (layer as any)._isActive = true;
          layer.setStyle(getHoverStyle(props.is_completed));
          layer.bringToFront();

          const bounds = layer.getBounds();
          map.flyToBounds(bounds, {
            paddingTopLeft: [120, 80],
            paddingBottomRight: [80, 80],
            duration: 0.9,
          });
        },
      });
    }

    return (
      <GeoJSON
        data={data}
        style={(feature: any) =>
          getProvinceStyle(feature?.properties?.is_completed)
        }
        onEachFeature={onEachProvince}
      />
    );
  }

  useEffect(() => {
    async function loadAllRegions() {
      try {
        let page = 1;
        let allFeatures: any[] = [];
        let hasMore = true;

        while (hasMore) {
          const url = `${process.env.NEXT_PUBLIC_API_URL}/regions?page=${page}`;
          console.log("Fetching:", url);

          const res = await fetchWithAuth(url, {
            method: "GET",
          });

          console.log("STATUS:", res.status);

          const text = await res.text();

          console.log("RESPONSE:", text);

          if (!res.ok) {
            console.error("HTTP ERROR");
            return;
          }

          const json = JSON.parse(text);

          if (!json?.result?.data) {
            console.error("Struktur data tidak sesuai:", json);
            break;
          }

          const data = json.result.data;

          if (data.length === 0) {
            hasMore = false;
            break;
          }
          console.log("REGIONS DATA:", data);
          const features = data.map((region: any) => {
            console.log(region.province_name, region.is_completed);

            return {
              type: "Feature",
              properties: {
                id: region.id,
                province_name: region.province_name,
                bps_code: region.bps_code,
                is_completed: region.is_completed,
              },
              geometry: {
                type: region.geometry_type,
                coordinates: region.coordinates,
              },
            };
          });

          allFeatures.push(...features);
          page++;
        }

        setGeoData({
          type: "FeatureCollection",
          features: allFeatures,
        });
      } catch (error) {
        console.error("Fetch gagal total:", error);
      }
    }

    loadAllRegions();
  }, [refreshRegions]);

  return (
    <div className="h-full w-full">
      <MapContainer
        ref={mapRef}
        className="z-0"
        center={center}
        zoom={5}
        minZoom={5}
        maxZoom={9}
        maxBounds={indonesiaBounds}
        maxBoundsViscosity={1.0}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors &copy; CARTO"
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
        />

        {geoData && <InteractiveProvinces data={geoData} />}
      </MapContainer>
    </div>
  );
}
