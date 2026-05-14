import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const DemoTripMap = () => {
  // Sample Data (Static)
  const trip = {
    order_id: "HOGO-ORD-7845",
    driver_id: "DRV-023",
    status: "Delivered",
    total_distance: 12450, // in meters
    start_time: "2026-05-14 09:15 AM",
    end_time: "2026-05-14 10:45 AM",
    pickup_lat: 28.6139,
    pickup_lng: 77.209,
    delivery_lat: 28.5355,
    delivery_lng: 77.391,
  };

  // Sample Route Points (Actual path taken by driver)
  const routePoints = [
    [28.6139, 77.209],
    [28.625, 77.22],
    [28.618, 77.25],
    [28.59, 77.28],
    [28.565, 77.32],
    [28.54, 77.36],
    [28.5355, 77.391],
  ];

  const center = [
    (trip.pickup_lat + trip.delivery_lat) / 2,
    (trip.pickup_lng + trip.delivery_lng) / 2,
  ];

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>
        HogoAutoFilms - Delivery Trip Demo
      </h1>

      <div
        style={{
          background: "#f8f9fa",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2>Order Details</h2>
        <p>
          <strong>Order ID:</strong> {trip.order_id}
        </p>
        <p>
          <strong>Driver ID:</strong> {trip.driver_id}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span style={{ color: "green", fontWeight: "bold" }}>
            {trip.status}
          </span>
        </p>
        <p>
          <strong>Total Distance Suffered:</strong>{" "}
          {(trip.total_distance / 1000).toFixed(2)} KM
        </p>
        <p>
          <strong>Start Time:</strong> {trip.start_time}
        </p>
        <p>
          <strong>End Time:</strong> {trip.end_time}
        </p>
      </div>

      {/* OpenStreetMap */}
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "600px", width: "100%", borderRadius: "10px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Pickup Marker */}
        <Marker position={[trip.pickup_lat, trip.pickup_lng]}>
          <Popup>
            <strong>Pickup Location</strong>
            <br />
            Order: {trip.order_id}
          </Popup>
        </Marker>

        {/* Delivery Marker */}
        <Marker position={[trip.delivery_lat, trip.delivery_lng]}>
          <Popup>
            <strong>Delivery Location</strong>
            <br />
            Order Completed
          </Popup>
        </Marker>

        {/* Route Path */}
        <Polyline
          positions={routePoints}
          color="#007bff"
          weight={6}
          opacity={0.85}
        />
      </MapContainer>

      <p style={{ textAlign: "center", marginTop: "10px", color: "#666" }}>
        Blue line shows the actual path taken by driver (Suffered Distance)
      </p>
    </div>
  );
};

export default DemoTripMap;
