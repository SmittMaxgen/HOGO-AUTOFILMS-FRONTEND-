import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ─── Fix Leaflet default marker icons ────────────────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// ─── Custom coloured dot icons ────────────────────────────────────────────────
const makeIcon = (color) =>
  L.divIcon({
    className: "",
    html: `<div style="
      width:14px;height:14px;border-radius:50%;
      background:${color};border:3px solid #fff;
      box-shadow:0 0 6px rgba(0,0,0,0.45);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

const startIcon = makeIcon("#2e7d32"); // green
const endIcon = makeIcon("#c62828"); // red
const midIcon = makeIcon("#1565c0"); // blue

// ─── Auto-fit bounds when points change ──────────────────────────────────────
const FitBounds = ({ points }) => {
  const map = useMap();
  useEffect(() => {
    if (points.length > 1) {
      map.fitBounds(L.latLngBounds(points), { padding: [40, 40] });
    } else if (points.length === 1) {
      map.setView(points[0], 15);
    }
  }, [points, map]);
  return null;
};

// ─── PageHeader ───────────────────────────────────────────────────────────────
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

// ─── InfoBadge ────────────────────────────────────────────────────────────────
const InfoBadge = ({ label, value }) => (
  <Box
    sx={{
      px: 2,
      py: 1,
      bgcolor: "#fafafa",
      border: "1px solid #ebebeb",
      borderRadius: 2,
      minWidth: 130,
    }}
  >
    <Typography variant="caption" color="text.secondary" fontWeight={700}>
      {label}
    </Typography>
    <Typography variant="body2" fontWeight={600} color="#1a1a1a">
      {value ?? "—"}
    </Typography>
  </Box>
);

// ─── LegendDot ────────────────────────────────────────────────────────────────
const LegendDot = ({ color, label, line }) => (
  <Box display="flex" alignItems="center" gap={0.8}>
    {line ? (
      <Box sx={{ width: 24, height: 4, bgcolor: color, borderRadius: 1 }} />
    ) : (
      <Box
        sx={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          bgcolor: color,
          border: "2px solid #fff",
          boxShadow: "0 0 4px rgba(0,0,0,0.3)",
        }}
      />
    )}
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
  </Box>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const DemoTripMap = ({ trip, onBack }) => {
  const [locations, setLocations] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (!trip?.id) return;

    const load = async () => {
      setFetchLoading(true);
      setFetchError(null);
      try {
        const res = await fetch(
          `https://apidata.hogonnindia.com/trip-location/?trip_id=${trip.id}`,
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        // Handle both array response and { data: [...] } / { results: [...] }
        const raw = Array.isArray(json)
          ? json
          : (json.data ?? json.results ?? []);

        // Sort by time so polyline draws in correct order
        const sorted = [...raw].sort(
          (a, b) => new Date(a.time) - new Date(b.time),
        );
        setLocations(sorted);
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setFetchLoading(false);
      }
    };

    load();
  }, [trip?.id]);

  if (!trip) return <div>Loading Trip…</div>;

  const routePoints = locations.map((loc) => [
    parseFloat(loc.latitude),
    parseFloat(loc.longitude),
  ]);

  // Total distance = max distance value across all points (already cumulative in API)
  const totalDistanceKm =
    locations.length > 0
      ? (
          Math.max(...locations.map((l) => parseFloat(l.distance || 0))) / 1000
        ).toFixed(2)
      : trip.total_distance
        ? (trip.total_distance / 1000).toFixed(2)
        : "—";

  const defaultCenter = [23.0225, 72.5714]; // Ahmedabad fallback

  return (
    <Box mt={4}>
      <PageHeader title="Trip Route" onBack={onBack} />

      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        {/* ── Summary strip ─────────────────────────────────────────────── */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          flexWrap="wrap"
          mb={3}
          alignItems="flex-start"
        >
          <InfoBadge label="Status" value={trip.status} />
          <InfoBadge label="Total Distance" value={`${totalDistanceKm} KM`} />
          <InfoBadge
            label="Start Time"
            value={
              trip.start_time ? new Date(trip.start_time).toLocaleString() : "—"
            }
          />
          {trip.end_time && (
            <InfoBadge
              label="End Time"
              value={new Date(trip.end_time).toLocaleString()}
            />
          )}
          <InfoBadge label="Location Points" value={locations.length} />
        </Stack>

        {/* ── Loading state ──────────────────────────────────────────────── */}
        {fetchLoading && (
          <Box display="flex" alignItems="center" gap={1.5} mb={2}>
            <CircularProgress size={20} sx={{ color: "#D20000" }} />
            <Typography variant="body2" color="text.secondary">
              Loading route data…
            </Typography>
          </Box>
        )}

        {/* ── Error state ────────────────────────────────────────────────── */}
        {fetchError && (
          <Box
            mb={2}
            px={2}
            py={1}
            sx={{
              bgcolor: "#fce4ec",
              borderRadius: 1,
              border: "1px solid #ef9a9a",
            }}
          >
            <Typography variant="body2" color="#c62828">
              Failed to load route points: {fetchError}
            </Typography>
          </Box>
        )}

        {/* ── Empty state ────────────────────────────────────────────────── */}
        {!fetchLoading && !fetchError && locations.length === 0 && (
          <Box
            mb={2}
            px={2}
            py={1}
            sx={{
              bgcolor: "#fff8e1",
              borderRadius: 1,
              border: "1px solid #ffe082",
            }}
          >
            <Typography variant="body2" color="#f57c00">
              No location points found for this trip.
            </Typography>
          </Box>
        )}

        {/* ── Map ───────────────────────────────────────────────────────── */}
        <MapContainer
          center={defaultCenter}
          zoom={13}
          style={{ height: "600px", width: "100%", borderRadius: "12px" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {routePoints.length > 0 && <FitBounds points={routePoints} />}

          {/* Red route line */}
          {routePoints.length > 1 && (
            <Polyline
              positions={routePoints}
              color="#D20000"
              weight={5}
              opacity={0.85}
            />
          )}

          {/* All location markers */}
          {locations.map((loc, i) => {
            const isFirst = i === 0;
            const isLast = i === locations.length - 1;
            const icon = isFirst ? startIcon : isLast ? endIcon : midIcon;
            const pos = [parseFloat(loc.latitude), parseFloat(loc.longitude)];

            return (
              <Marker key={loc.id ?? i} position={pos} icon={icon}>
                <Popup>
                  <Box sx={{ minWidth: 190 }}>
                    <Typography fontWeight={700} fontSize={13} mb={0.5}>
                      {isFirst
                        ? "🟢 Start Point"
                        : isLast
                          ? "🔴 End Point"
                          : `📍 Point ${i + 1}`}
                    </Typography>
                    <Typography fontSize={12}>
                      <strong>Time:</strong>{" "}
                      {loc.time ? new Date(loc.time).toLocaleString() : "—"}
                    </Typography>
                    <Typography fontSize={12}>
                      <strong>Lat:</strong> {loc.latitude}
                    </Typography>
                    <Typography fontSize={12}>
                      <strong>Lng:</strong> {loc.longitude}
                    </Typography>
                    <Typography fontSize={12}>
                      <strong>Distance:</strong>{" "}
                      {loc.distance
                        ? `${(parseFloat(loc.distance) / 1000).toFixed(2)} KM`
                        : "—"}
                    </Typography>
                    {loc.status && (
                      <Typography fontSize={12}>
                        <strong>Status:</strong> {loc.status}
                      </Typography>
                    )}
                  </Box>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* ── Legend ────────────────────────────────────────────────────── */}
        <Stack direction="row" spacing={2} mt={2} flexWrap="wrap">
          <LegendDot color="#2e7d32" label="Start" />
          <LegendDot color="#1565c0" label="Waypoint" />
          <LegendDot color="#c62828" label="End / Latest" />
          <LegendDot color="#D20000" label="Route" line />
        </Stack>
      </Paper>
    </Box>
  );
};

export default DemoTripMap;
