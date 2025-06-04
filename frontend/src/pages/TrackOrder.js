import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { io } from "socket.io-client";

const socket = io("http://localhost:5001");

const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [partnerCoords, setPartnerCoords] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const partnerIdRef = useRef(null);

  // Fetch order info from backend (replace with real API)
  const fetchOrderInfo = async (id) => {
    setLoading(true);
    setError("");
    setTrackingInfo(null);
    setPartnerCoords(null);
    try {
      // Replace with your real API endpoint
      const res = await fetch(`/api/order/${id}`);
      if (!res.ok) throw new Error("Order not found");
      const order = await res.json();
      setTrackingInfo(order);
      // Assume order.assigned_driver_id is the partnerId
      partnerIdRef.current = order.assigned_driver_id;
    } catch (err) {
      setError("Order not found. Please check the Order ID.");
    }
    setLoading(false);
  };

  useEffect(() => {
    // Listen for live partner location updates
    socket.on("partnerLocationUpdate", ({ partnerId, coords }) => {
      if (partnerIdRef.current && partnerId === partnerIdRef.current) {
        setPartnerCoords(coords);
      }
    });
    return () => {
      socket.off("partnerLocationUpdate");
    };
  }, []);

  const handleTrack = () => {
    if (!orderId.trim()) return;
    fetchOrderInfo(orderId.trim());
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-green-700">
        Track Your Order
      </h2>
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={handleTrack}
          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg flex items-center gap-1"
        >
          <Search size={18} />
          Track
        </button>
      </div>

      {loading && <div className="text-center text-gray-500">Loading...</div>}

      {trackingInfo && (
        <div className="bg-green-100 p-4 rounded-lg mt-4">
          <p>
            <strong>Status:</strong> {trackingInfo.status}
          </p>
          <p>
            <strong>Delivery Partner:</strong> {trackingInfo.driver_name || "Assigned"}
          </p>
          <p>
            <strong>Estimated Delivery:</strong> {trackingInfo.estimated_delivery || "-"}
          </p>
          {partnerCoords ? (
            <div className="mt-4">
              <strong>Live Location:</strong>
              <MapContainer center={partnerCoords} zoom={15} style={{ height: 200, width: "100%" }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <Marker position={partnerCoords} icon={markerIcon}>
                  <Popup>Delivery Partner's Current Location</Popup>
                </Marker>
              </MapContainer>
            </div>
          ) : (
            <div className="text-gray-500 mt-2">Waiting for live location...</div>
          )}
        </div>
      )}

      {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
    </div>
  );
};

export default TrackOrder;
