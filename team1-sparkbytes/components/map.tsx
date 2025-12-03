"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Map() {
  const center: [number, number] = [42.3505, -71.1054]; // BU campus center

  return (
    <div style={{ height: "70vh", width: "100%", marginTop: 20 }}>
      <MapContainer
        center={center}
        zoom={15}
        scrollWheelZoom={false}
        style={{
          height: "100%",
          width: "100%",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
}
