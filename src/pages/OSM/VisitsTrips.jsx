import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Paper,
  Stack,
  Typography,
  IconButton,
  CircularProgress,
  MenuItem,
  TextField,
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

import { getEmployees } from "../../feature/employee/employeeThunks";
import {
  selectEmployees,
  selectEmployeeLoading,
  selectEmployeeError,
} from "../../feature/employee/employeeSelector";

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

// ─── Parse "DD-MM-YYYY hh:mm:ss AM/PM" into a real Date ──────────────────────
const parseTimestamp = (ts) => {
  if (!ts) return null;
  const [datePart, timePart, ampm] = ts.split(" ");
  if (!datePart || !timePart) return null;
  const [day, month, year] = datePart.split("-").map(Number);
  let [hours, minutes, seconds] = timePart.split(":").map(Number);
  if (ampm === "PM" && hours !== 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;
  return new Date(year, month - 1, day, hours, minutes, seconds);
};

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

const API_BASE = "https://apidata.hogonnindia.com/trip-location/";

// ─── Main Component ───────────────────────────────────────────────────────────
// Props:
//   onBack -> optional back button handler
const EmployeeTripMap = ({ onBack }) => {
  const dispatch = useDispatch();

  // ── Employee list (Redux) ────────────────────────────────────────────────
  const employees = useSelector(selectEmployees);
  const empLoading = useSelector(selectEmployeeLoading);
  const empError = useSelector(selectEmployeeError);

  useEffect(() => {
    dispatch(getEmployees());
  }, [dispatch]);

  // ── Selection state ──────────────────────────────────────────────────────
  const todayStr = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState(todayStr);

  // ── Trip location state ──────────────────────────────────────────────────
  const [locations, setLocations] = useState([]);
  const [totalDistanceKm, setTotalDistanceKm] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (!employeeId) {
      setLocations([]);
      setTotalDistanceKm(null);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setFetchLoading(true);
      setFetchError(null);
      setLocations([]);
      setTotalDistanceKm(null);

      try {
        let url = `${API_BASE}?employee_id=${employeeId}&date=${date}`;
        let allData = [];
        let firstPageTotalKm = null;

        // Walk through every page via the "next" link
        while (url) {
          const res = await fetch(url);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const json = await res.json();

          if (
            firstPageTotalKm === null &&
            typeof json.total_distance_km === "number"
          ) {
            firstPageTotalKm = json.total_distance_km;
          }

          const pageData = Array.isArray(json.data) ? json.data : [];
          allData = allData.concat(pageData);

          url = json.next || null;
        }

        if (cancelled) return;

        // API returns newest-first; sort ascending so the route/polyline draws in order
        const sorted = [...allData].sort(
          (a, b) => parseTimestamp(a.timestamp) - parseTimestamp(b.timestamp),
        );

        setLocations(sorted);
        setTotalDistanceKm(firstPageTotalKm);
      } catch (err) {
        if (!cancelled) setFetchError(err.message);
      } finally {
        if (!cancelled) setFetchLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [employeeId, date]);

  const routePoints = locations.map((loc) => [
    parseFloat(loc.latitude),
    parseFloat(loc.longitude),
  ]);

  const employeeName = locations[0]?.employee_name;
  const latestStatus = locations[locations.length - 1]?.status;
  const startTs = locations[0]?.timestamp;
  const endTs = locations[locations.length - 1]?.timestamp;

  const distanceLabel =
    totalDistanceKm !== null ? `${totalDistanceKm.toFixed(2)} KM` : "—";

  const defaultCenter = [23.0225, 72.5714]; // Ahmedabad fallback

  return (
    <Box mt={4}>
      <PageHeader
        title={employeeName ? `Trip Route — ${employeeName}` : "Trip Route"}
        onBack={onBack}
      />

      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        {/* ── Selector row ──────────────────────────────────────────────── */}
<Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          mb={3}
          // alignItems={{ xs: "stretch", sm: "flex-end" }}
          sx={{ width: "100%" }}
        >
          <TextField
            select
            label="Employee"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            size="small"
            // sx={{ flex: { sm: "1 1 320px" }, minWidth: 240 }}
            disabled={empLoading}
            helperText={empError ? `Failed to load employees: ${empError}` : " "}
            error={Boolean(empError)}
          >
            <MenuItem value="">
              <em>Select Employee</em>
            </MenuItem>
            {employees.map((emp) => (
              <MenuItem key={emp.id} value={emp.id}>
                {`${emp.first_name ?? ""} ${emp.last_name ?? ""}`.trim() ||
                  `Employee #${emp.id}`}
                {emp.employee_code ? ` (${emp.employee_code})` : ""}
              </MenuItem>
            ))}
          </TextField>

<TextField
            label="Date"
            type="date"
            size="small"
            value={date}
            onChange={(e) => setDate(e.target.value || todayStr)}
            InputLabelProps={{ shrink: true }}
            // sx={{ flex: { sm: "1 1 220px" }, minWidth: 180 }}
          />
        </Stack>

        {/* ── No employee selected ─────────────────────────────────────── */}
        {!employeeId && (
          <Box
            mb={2}
            px={2}
            py={1.5}
            sx={{
              bgcolor: "#f5f5f5",
              borderRadius: 1,
              border: "1px solid #e0e0e0",
              textAlign: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Select an employee to view their route on {date}.
            </Typography>
          </Box>
        )}

        {employeeId && (
          <>
            {/* ── Summary strip ─────────────────────────────────────────── */}
<Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              flexWrap="wrap"
              mb={3}
              alignItems="flex-start"
              sx={{ width: "100%", "& > *": { flex: "1 1 150px" } }}
            >
              <InfoBadge label="Date" value={date} />
              <InfoBadge label="Status" value={latestStatus} />
              <InfoBadge label="Total Distance" value={distanceLabel} />
              <InfoBadge label="Start Time" value={startTs || "—"} />
              <InfoBadge label="Last Update" value={endTs || "—"} />
              <InfoBadge label="Location Points" value={locations.length} />
            </Stack>

            {/* ── Loading state ────────────────────────────────────────── */}
            {fetchLoading && (
              <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                <CircularProgress size={20} sx={{ color: "#D20000" }} />
                <Typography variant="body2" color="text.secondary">
                  Loading route data…
                </Typography>
              </Box>
            )}

            {/* ── Error state ───────────────────────────────────────────── */}
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

            {/* ── Empty state ───────────────────────────────────────────── */}
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
                  No location points found for this employee on this date.
                </Typography>
              </Box>
            )}

            {/* ── Map ───────────────────────────────────────────────────── */}
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

              {routePoints.length > 1 && (
                <Polyline
                  positions={routePoints}
                  color="#D20000"
                  weight={5}
                  opacity={0.85}
                />
              )}

              {locations.map((loc, i) => {
                const isFirst = i === 0;
                const isLast = i === locations.length - 1;
                const icon = isFirst ? startIcon : isLast ? endIcon : midIcon;
                const pos = [
                  parseFloat(loc.latitude),
                  parseFloat(loc.longitude),
                ];

                return (
                  <Marker key={loc.id ?? i} position={pos} icon={icon}>
                    <Popup>
                      <Box sx={{ minWidth: 190 }}>
                        <Typography fontWeight={700} fontSize={13} mb={0.5}>
                          {isFirst
                            ? "🟢 Start Point"
                            : isLast
                              ? "🔴 Latest Point"
                              : `📍 Point ${i + 1}`}
                        </Typography>
                        <Typography fontSize={12}>
                          <strong>Time:</strong> {loc.timestamp || "—"}
                        </Typography>
                        <Typography fontSize={12}>
                          <strong>Lat:</strong> {loc.latitude}
                        </Typography>
                        <Typography fontSize={12}>
                          <strong>Lng:</strong> {loc.longitude}
                        </Typography>
                        <Typography fontSize={12}>
                          <strong>Since prev:</strong>{" "}
                          {typeof loc.distance_from_previous === "number"
                            ? `${loc.distance_from_previous.toFixed(2)} m`
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

            {/* ── Legend ────────────────────────────────────────────────── */}
            <Stack direction="row" spacing={2} mt={2} flexWrap="wrap">
              <LegendDot color="#2e7d32" label="Start" />
              <LegendDot color="#1565c0" label="Waypoint" />
              <LegendDot color="#c62828" label="Latest" />
              <LegendDot color="#D20000" label="Route" line />
            </Stack>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default EmployeeTripMap;
