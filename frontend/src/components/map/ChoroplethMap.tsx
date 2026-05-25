"use client";

import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import type { LatLngExpression } from "leaflet";

const center: LatLngExpression = [-2.5, 118];

type Props = {
  selectedProvince: any;
  setSelectedProvince: (province: any) => void;
};

export default function ChoroplethMap({
  selectedProvince,
  setSelectedProvince,
}: Props) {
  const [geoData, setGeoData] = useState<any>(null);
  const indonesiaBounds: [[number, number], [number, number]] = [
    [-25.0, 90.0],
    [20.0, 155.0],
  ];
  const defaultStyle = {
    weight: 1,
    color: "#B85C5C",
    fillOpacity: 0.6,
  };

  const hoverStyle = {
    weight: 3,
    color: "#A94442",
    fillOpacity: 0.75,
  };

  function InteractiveProvinces({ data }: { data: any }) {
    const map = useMap();

    function onEachProvince(feature: any, layer: any) {
      (layer as any)._isActive = false;
      const props = feature.properties;

      layer.bindTooltip(props.province_name, {
        sticky: true,
        direction: "center",
        className: "province-label",
        opacity: 1,
      });

      layer.on({
        mouseover: (e: any) => {
          if (!(layer as any)._isActive) {
            layer.setStyle(hoverStyle);
          }
        },

        mouseout: () => {
          if (!(layer as any)._isActive) {
            layer.setStyle(defaultStyle);
          }
        },

        click: () => {
          setSelectedProvince(props);

          const isActive = (layer as any)._isActive;

          if (isActive) {
            (layer as any)._isActive = false;
            layer.setStyle(defaultStyle);

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
                item.setStyle?.(defaultStyle);
              }
            });
          }

          (layer as any)._isActive = true;
          layer.setStyle(hoverStyle);
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
        style={() => defaultStyle}
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
          const url = `http://127.0.0.1:8000/api/regions?page=${page}`;
          console.log("Fetching:", url);

          const res = await fetch(url);

          if (!res.ok) {
            const errorText = await res.text();

            console.error("HTTP error:", res.status);
            console.error("DETAIL ERROR:", errorText);

            return;
          }

          const json = await res.json();

          if (!json?.result?.data) {
            console.error("Struktur data tidak sesuai:", json);
            break;
          }

          const data = json.result.data;

          if (data.length === 0) {
            hasMore = false;
            break;
          }

          const features = data.map((region: any) => ({
            type: "Feature",
            properties: {
              id: region.id,
              province_name: region.province_name,
              bps_code: region.bps_code,
            },
            geometry: {
              type: region.geometry_type,
              coordinates: region.coordinates,
            },
          }));

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
  }, []);

  return (
    <div className="relative h-full w-full">
      <MapContainer
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
