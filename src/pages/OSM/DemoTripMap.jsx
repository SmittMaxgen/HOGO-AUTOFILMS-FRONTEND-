import { Box, Paper, Stack, Typography, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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

// ─── PageHeader (local copy so DemoTripMap is self-contained) ─────────────────
const PageHeader = ({ title, onBack }) => (
  <Box
    display="flex"
    alignItems="center"
    mb={3}
    px={2}
    py={1.5}
    sx={{
      background: "linear-gradient(90deg, #D20000 0%, #8B0000 100%)",
      borderRadius: 2,
      boxShadow: "0 4px 12px rgba(210,0,0,0.25)",
    }}
  >
    {onBack && (
      <IconButton onClick={onBack} sx={{ color: "#fff", mr: 1.5 }}>
        <ArrowBackIcon />
      </IconButton>
    )}
    <Typography variant="h6" fontWeight={700} color="#fff" letterSpacing={1}>
      {title}
    </Typography>
  </Box>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const DemoTripMap = ({ trip, onBack }) => {
  if (!trip) return <div>Loading Trip...</div>;

  const routePoints = trip.trip_locations
    ? trip.trip_locations.map((loc) => [loc.latitude, loc.longitude])
    : [];

  const center =
    routePoints.length > 0
      ? routePoints[Math.floor(routePoints.length / 2)]
      : [23.0225, 72.5714]; // Default: Ahmedabad

  return (
    <Box mt={4}>
      <PageHeader title="Trip Route" onBack={onBack} />

      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Stack spacing={2} mb={3}>
          <Typography variant="h6" fontWeight={700}>
            Trip Details
          </Typography>
          <Typography>
            <strong>Status:</strong> {trip.status}
          </Typography>
          <Typography>
            <strong>Total Distance:</strong>{" "}
            {(trip.total_distance / 1000).toFixed(2)} KM
          </Typography>
          <Typography>
            <strong>Start Time:</strong>{" "}
            {new Date(trip.start_time).toLocaleString()}
          </Typography>
          {trip.end_time && (
            <Typography>
              <strong>End Time:</strong>{" "}
              {new Date(trip.end_time).toLocaleString()}
            </Typography>
          )}
        </Stack>

        <MapContainer
          center={center}
          zoom={13}
          style={{ height: "600px", width: "100%", borderRadius: "12px" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {routePoints.length > 0 && (
            <>
              <Marker position={routePoints[0]}>
                <Popup>Start Point</Popup>
              </Marker>
              <Marker position={routePoints[routePoints.length - 1]}>
                <Popup>End Point</Popup>
              </Marker>
              <Polyline positions={routePoints} color="#d20000" weight={6} />
            </>
          )}
        </MapContainer>
      </Paper>
    </Box>
  );
};

export default DemoTripMap;
