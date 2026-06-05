"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type MarkerData = {
  id: number;
  title: string;
  lat: number;
  lng: number;
  href: string;
};

export function PropertyMap({ markers, center, zoom }: { markers: MarkerData[]; center?: [number, number]; zoom?: number }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || instanceRef.current) return;

    const map = L.map(mapRef.current, {
      scrollWheelZoom: false,
    }).setView(center ?? [-23.5505, -46.6333], zoom ?? 10);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);

    markers.forEach((m) => {
      const marker = L.marker([m.lat, m.lng]).addTo(map);
      marker.bindPopup(`<a href="${m.href}" class="text-sm font-medium text-blue-600 hover:underline">${m.title}</a>`);
    });

    if (markers.length > 1) {
      map.fitBounds(markers.map((m) => [m.lat, m.lng] as [number, number]), { padding: [40, 40] });
    }

    instanceRef.current = map;

    return () => {
      map.remove();
      instanceRef.current = null;
    };
  }, []);

  return <div ref={mapRef} className="h-80 w-full rounded-xl border border-slate-200 dark:border-slate-700" />;
}
