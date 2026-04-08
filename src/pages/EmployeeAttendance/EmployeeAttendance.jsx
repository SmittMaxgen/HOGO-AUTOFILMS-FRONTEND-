import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeAttendances } from "../../feature/employeeAttendance/employeeAttendanceThunks";
import {
  selectEmployeeAttendances,
  selectEmployeeAttendanceLoading,
  selectEmployeeAttendanceError,
} from "../../feature/employeeAttendance/employeeAttendanceSelector";
import { Box, Typography } from "@mui/material";
import axiosInstance from "../../api/axiosInstance";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function todayStr() {
  return new Date().toISOString().split("T")[0];
}
function toDateObj(str) {
  if (!str) return null;
  const d = new Date(str + "T00:00:00");
  return isNaN(d) ? null : d;
}
function fmtTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d)) return "—";
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
function fmtDate(str) {
  if (!str) return "—";
  const d = toDateObj(str);
  if (!d) return str;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
function calcHours(start, end) {
  if (!start || !end) return null;
  const diff = (new Date(end) - new Date(start)) / 3600000;
  return diff > 0 ? diff.toFixed(1) : null;
}
function isoDate(d) {
  return d.toISOString().split("T")[0];
}

// ─── Status filter → API param mapper ────────────────────────────────────────
function statusParams(filterKey) {
  switch (filterKey) {
    case "present":
      return { status: true, full_leave: false, half_leave: false };
    case "full":
      return { full_leave: true };
    case "half":
      return { half_leave: true };
    case "absent":
      return { status: false };
    default:
      return {};
  }
}

const STATUS_FILTERS = [
  { key: "present", label: "Present" },
  { key: "full", label: "Full Leave" },
  { key: "half", label: "Half Leave" },
  { key: "absent", label: "Absent" },
];

// ─── Range Calendar ───────────────────────────────────────────────────────────
/**
 * A single inline calendar that supports:
 *  - Click 1 → sets startDate
 *  - Click 2 → sets endDate (must be >= startDate)
 *  - Hover   → preview the range
 *  - Highlights the full range between start and end
 */
function RangeCalendar({ startDate, endDate, onChange }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-indexed
  const [hovered, setHovered] = useState(null); // Date obj
  // picking state: "start" → next click sets start, "end" → next click sets end
  const [picking, setPicking] = useState("start");

  const startObj = toDateObj(startDate);
  const endObj = toDateObj(endDate);

  // Days grid
  const firstDay = new Date(viewYear, viewMonth, 1);
  const lastDay = new Date(viewYear, viewMonth + 1, 0);
  const startDow = firstDay.getDay(); // 0=Sun
  const daysInMonth = lastDay.getDate();

  const cells = [];
  // leading empty cells
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++)
    cells.push(new Date(viewYear, viewMonth, d));

  function prevMonth() {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else setViewMonth((m) => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else setViewMonth((m) => m + 1);
  }

  function handleDayClick(day) {
    if (day > today) return; // no future dates
    const ds = isoDate(day);

    if (picking === "start") {
      // Reset range, start picking end
      onChange({ startDate: ds, endDate: null });
      setPicking("end");
    } else {
      // End date must be >= start date
      if (startObj && day < startObj) {
        // Clicked before start → treat as new start
        onChange({ startDate: ds, endDate: null });
        setPicking("end");
      } else {
        onChange({ startDate, endDate: ds });
        setPicking("start"); // ready for next fresh pick
      }
    }
  }

  // Determine range bounds for highlighting
  const rangeStart = startObj;
  const rangeEnd =
    picking === "end" && hovered
      ? startObj && hovered >= startObj
        ? hovered
        : null
      : endObj;

  function inRange(day) {
    if (!rangeStart || !rangeEnd) return false;
    return day > rangeStart && day < rangeEnd;
  }
  function isStart(day) {
    return rangeStart && isoDate(day) === isoDate(rangeStart);
  }
  function isEnd(day) {
    return rangeEnd && isoDate(day) === isoDate(rangeEnd);
  }
  function isFuture(day) {
    return day > today;
  }

  const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: "14px",
        padding: "16px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
        width: "300px",
        userSelect: "none",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <button onClick={prevMonth} style={navBtn}>
          ‹
        </button>
        <span style={{ fontWeight: 700, fontSize: "14px", color: "#1e293b" }}>
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth} style={navBtn}>
          ›
        </button>
      </div>

      {/* ── Picking hint ── */}
      <div
        style={{
          textAlign: "center",
          fontSize: "11px",
          color: "#D20000",
          fontWeight: 600,
          marginBottom: "8px",
          background: "#D2000008",
          borderRadius: "6px",
          padding: "4px",
        }}
      >
        {picking === "start"
          ? startObj && endObj
            ? "Click to pick new start date"
            : "Click to pick start date"
          : "Click to pick end date"}
      </div>

      {/* ── Day headers ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7,1fr)",
          gap: "2px",
          marginBottom: "4px",
        }}
      >
        {DAYS.map((d) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontSize: "11px",
              fontWeight: 700,
              color: "#94a3b8",
              padding: "4px 0",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* ── Day cells ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7,1fr)",
          gap: "2px",
        }}
      >
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />;

          const future = isFuture(day);
          const start = isStart(day);
          const end = isEnd(day);
          const inR = inRange(day);
          const isToday = isoDate(day) === todayStr();
          const cap = start || end;

          let bg = "transparent",
            color = "#374151",
            radius = "8px";
          if (future) color = "#cbd5e1";
          if (isToday && !cap && !inR) {
            bg = "#f1f5f9";
            color = "#D20000";
          }
          if (inR) {
            bg = "#D2000018";
            radius = "0";
            color = "#374151";
          }
          if (start) {
            bg = "#D20000";
            color = "#fff";
            radius = inR || end ? "8px 0 0 8px" : "8px";
          }
          if (end) {
            bg = "#D20000";
            color = "#fff";
            radius = inR || start ? "0 8px 8px 0" : "8px";
          }
          if (start && end) radius = "8px"; // same day = start & end both true → full radius

          return (
            <div
              key={isoDate(day)}
              onClick={() => !future && handleDayClick(day)}
              onMouseEnter={() => picking === "end" && setHovered(day)}
              onMouseLeave={() => setHovered(null)}
              style={{
                textAlign: "center",
                padding: "6px 2px",
                fontSize: "12px",
                fontWeight: cap ? 700 : 500,
                background: bg,
                color,
                borderRadius: radius,
                cursor: future ? "not-allowed" : "pointer",
                transition: "background 0.12s",
              }}
            >
              {day.getDate()}
            </div>
          );
        })}
      </div>

      {/* ── Selected range display ── */}
      <div
        style={{
          marginTop: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        <span style={rangeChip(!!startDate)}>
          {startDate ? fmtDate(startDate) : "Start"}
        </span>
        <span style={{ color: "#94a3b8", fontSize: "12px" }}>→</span>
        <span style={rangeChip(!!endDate)}>
          {endDate ? fmtDate(endDate) : "End"}
        </span>
        {startDate && endDate && (
          <span style={{ fontSize: "11px", color: "#D20000", fontWeight: 600 }}>
            (
            {Math.round(
              (toDateObj(endDate) - toDateObj(startDate)) / 86400000,
            ) + 1}
            d)
          </span>
        )}
      </div>
    </div>
  );
}

const navBtn = {
  background: "#f1f5f9",
  border: "none",
  borderRadius: "8px",
  width: "28px",
  height: "28px",
  cursor: "pointer",
  fontSize: "16px",
  color: "#374151",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
function rangeChip(active) {
  return {
    fontSize: "11px",
    fontWeight: 700,
    padding: "3px 8px",
    borderRadius: "6px",
    background: active ? "#D2000012" : "#f1f5f9",
    color: active ? "#D20000" : "#94a3b8",
    border: `1px solid ${active ? "#D2000030" : "#e2e8f0"}`,
  };
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function Badge({ label, color, bg }) {
  return (
    <span
      style={{
        background: bg,
        color,
        fontSize: "11px",
        fontWeight: 700,
        padding: "3px 10px",
        borderRadius: "20px",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}
function StatusBadge({ record }) {
  if (record.full_leave) return <Badge label="Full Leave" bg="#fef2f2" />;
  if (record.half_leave) return <Badge label="Half Leave" bg="#fffbeb" />;
  if (record.status) return <Badge label="Present" bg="#f0fdf4" />;
  return <Badge label="Absent" bg="#f3f4f6" />;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color, active, onClick, loading }) {
  return (
    <div
      onClick={onClick}
      title={onClick ? `Click to filter by ${label}` : undefined}
      style={{
        background: active ? color + "12" : "#fff",
        border: `1.5px solid ${active ? color : "#e2e8f0"}`,
        borderRadius: "12px",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        flex: "1 1 130px",
        boxShadow: active
          ? `0 2px 12px ${color}28`
          : "0 1px 4px rgba(0,0,0,0.05)",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.18s",
        userSelect: "none",
        transform: active ? "translateY(-1px)" : "none",
        opacity: loading ? 0.6 : 1,
      }}
    >
      <div
        style={{
          width: "42px",
          height: "42px",
          borderRadius: "10px",
          background: color + "18",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          flexShrink: 0,
        }}
      >
        {loading && active ? "⏳" : icon}
      </div>
      <div>
        <p
          style={{
            margin: 0,
            fontSize: "22px",
            fontWeight: 800,
            color: active ? color : "#0f172a",
          }}
        >
          {value}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              color: active ? color : "#64748b",
              fontWeight: 600,
            }}
          >
            {label}
          </p>
          {active && (
            <span
              style={{
                fontSize: "9px",
                fontWeight: 700,
                background: color,
                color: "#fff",
                padding: "1px 5px",
                borderRadius: "10px",
              }}
            >
              ON
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Table styles ─────────────────────────────────────────────────────────────
const th = {
  padding: "10px 14px",
  fontSize: "11px",
  fontWeight: 700,
  color: "#94a3b8",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  textAlign: "left",
  background: "#f8fafc",
  whiteSpace: "nowrap",
};
const td = { padding: "12px 14px", fontSize: "13px", color: "#374151" };

function AttendanceRow({ record, isFirst, showEmployee }) {
  const hours =
    record.total_hours ?? calcHours(record.start_time, record.end_time);
  return (
    <tr
      style={{
        borderTop: isFirst ? "none" : "1px solid #f1f5f9",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <td style={td}>{fmtDate(record.date)}</td>
      {showEmployee && (
        <td style={{ ...td, fontWeight: 600, color: "#1e293b" }}>
          {record.employee_name || `#${record.employee}`}
        </td>
      )}
      <td style={td}>
        <StatusBadge record={record} />
      </td>
      <td style={{ ...td, color: "#10b981", fontWeight: 600 }}>
        {record.start_time ? fmtTime(record.start_time) : "—"}
      </td>
      <td style={{ ...td, color: "#ef4444", fontWeight: 600 }}>
        {record.end_time ? fmtTime(record.end_time) : "—"}
      </td>
      <td
        style={{ ...td, fontWeight: 700, color: hours ? "#D20000" : "#94a3b8" }}
      >
        {hours ? `${hours}h` : "—"}
      </td>
    </tr>
  );
}

function TableSkeleton({ rows = 5, cols = 6 }) {
  const widths = ["90px", "100px", "70px", "60px", "60px", "45px"];
  return (
    <>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      {Array.from({ length: rows }).map((_, i) => (
        <tr
          key={i}
          style={{ borderTop: i === 0 ? "none" : "1px solid #f1f5f9" }}
        >
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} style={td}>
              <div
                style={{
                  height: "13px",
                  width: widths[j] || "60px",
                  borderRadius: "6px",
                  background:
                    "linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.4s infinite",
                }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "7px 18px",
        fontSize: "13px",
        fontWeight: 600,
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        transition: "all 0.18s",
        background: active ? "#D20000" : "transparent",
        color: active ? "#fff" : "#64748b",
        // boxShadow: active ? "0 2px 8px #6366f130" : "none",
        boxShadow: active ? "0 2px 8px #D2000030" : "none",
      }}
    >
      {label}
    </button>
  );
}

const inputStyle = {
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  padding: "6px 10px",
  fontSize: "13px",
  color: "#374151",
  background: "#fff",
  outline: "none",
  cursor: "pointer",
  height: "34px",
};

// ─── Main Module ──────────────────────────────────────────────────────────────
export default function AttendanceModule({
  employee_id: propEmployeeId,
  title,
  employees: propEmployees,
  disabled = false,
}) {
  const dispatch = useDispatch();
  const allList = useSelector(selectEmployeeAttendances);
  const loading = useSelector(selectEmployeeAttendanceLoading);
  const error = useSelector(selectEmployeeAttendanceError);
  const btnRef = useRef(null);

  const [mode, setMode] = useState("today");
  const [customDate, setCustomDate] = useState(todayStr());

  // Range — single calendar updates both
  const [startDate, setStartDate] = useState(todayStr());
  const [endDate, setEndDate] = useState(todayStr());
  const [showCal, setShowCal] = useState(false);
  const calRef = useRef(null);

  const [statusFilter, setStatusFilter] = useState("all");
  const [employees, setEmployees] = useState(propEmployees || []);
  const [selectedEmpId, setSelectedEmpId] = useState(propEmployeeId || "");
  const [empLoading, setEmpLoading] = useState(false);

  // Close calendar on outside click
  useEffect(() => {
    function onClickOutside(e) {
      if (calRef.current && !calRef.current.contains(e.target))
        setShowCal(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Fetch employees
  useEffect(() => {
    if (propEmployeeId || (propEmployees && propEmployees.length > 0)) return;
    setEmpLoading(true);
    axiosInstance
      .get("/employee/")
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : (res.data?.data ?? res.data?.results ?? []);
        setEmployees(list);
      })
      .catch(() => setEmployees([]))
      .finally(() => setEmpLoading(false));
  }, [propEmployeeId, propEmployees]);

  // Build API payload
  const buildPayload = useCallback(() => {
    const eid = propEmployeeId || selectedEmpId;
    const base = eid ? { employee_id: eid } : {};
    const now = new Date();

    let dateParams = {};
    switch (mode) {
      case "today":
        dateParams = { date: todayStr() };
        break;
      case "month":
        dateParams = { month: now.getMonth() + 1, year: now.getFullYear() };
        break;
      case "date":
        dateParams = customDate ? { date: customDate } : {};
        break;
      case "range":
        dateParams =
          startDate && endDate
            ? { start_date: startDate, end_date: endDate }
            : {};
        break;
      default:
        dateParams = {};
    }

    return { ...base, ...dateParams, ...statusParams(statusFilter) };
  }, [
    mode,
    customDate,
    startDate,
    endDate,
    propEmployeeId,
    selectedEmpId,
    statusFilter,
  ]);

  // Fetch — fires whenever buildPayload changes
  useEffect(() => {
    if (mode === "range" && (!startDate || !endDate)) return; // wait for complete range
    if (mode === "date" && !customDate) return;
    dispatch(getEmployeeAttendances(buildPayload()));
  }, [buildPayload, dispatch]);

  // Reset filter on context change
  const handleModeChange = (m) => {
    setMode(m);
    setStatusFilter("all");
    if (m !== "range") setShowCal(false);
  };
  const handleEmpChange = (id) => {
    setSelectedEmpId(id);
    setStatusFilter("all");
  };

  // Range calendar onChange
  function handleRangeChange({ startDate: s, endDate: e }) {
    setStartDate(s || startDate);
    setEndDate(e || "");
    // Auto-fetch only when both dates are selected
    if (s && e) setShowCal(false);
  }

  const rawList = Array.isArray(allList) ? allList : [];
  const present = rawList.filter(
    (r) => r.status && !r.full_leave && !r.half_leave,
  ).length;
  const fullCount = rawList.filter((r) => r.full_leave).length;
  const halfCount = rawList.filter((r) => r.half_leave).length;
  const absent = rawList.filter((r) => !r.status).length;
  const avgHours = rawList.length
    ? (
        rawList.reduce((s, r) => s + (r.total_hours || 0), 0) / rawList.length
      ).toFixed(1)
    : "0.0";

  const showEmployeeCol = !propEmployeeId;
  const activeMeta = STATUS_FILTERS.find((f) => f.key === statusFilter);

  const rangeLabel = (() => {
    const now = new Date();
    if (mode === "today") return `Today — ${fmtDate(todayStr())}`;
    if (mode === "month")
      return `This Month — ${now.toLocaleString("en-IN", { month: "long", year: "numeric" })}`;
    if (mode === "date") return `Date — ${fmtDate(customDate)}`;
    if (mode === "range")
      return startDate && endDate
        ? `${fmtDate(startDate)} → ${fmtDate(endDate)}`
        : "Select range";
    return "";
  })();

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      {/* ── Header ───────────────────────────────────────────────────────── */}
      {disabled === false && (
        <Box display="flex" alignItems="center" gap={1.5} mb={3}>
          <Box
            sx={{ width: 5, height: 32, bgcolor: "#D20000", borderRadius: 1 }}
          />
          <Typography variant="h5" fontWeight={800} color="#1a1a1a">
            {title ||
              (propEmployeeId ? "Employee Attendance" : "Attendance Records")}
          </Typography>
        </Box>
      )}

      {/* ── Stat Cards ───────────────────────────────────────────────────── */}
      {disabled === false && (
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "8px",
          }}
        >
          <StatCard
            label="Present"
            value={present}
            icon="✅"
            color="#10b981"
            loading={loading}
            active={statusFilter === "present"}
            onClick={() =>
              setStatusFilter((f) => (f === "present" ? "all" : "present"))
            }
          />
          <StatCard
            label="Full Leave"
            value={fullCount}
            icon="🏖️"
            color="#ef4444"
            loading={loading}
            active={statusFilter === "full"}
            onClick={() =>
              setStatusFilter((f) => (f === "full" ? "all" : "full"))
            }
          />
          <StatCard
            label="Half Leave"
            value={halfCount}
            icon="⏰"
            color="#f59e0b"
            loading={loading}
            active={statusFilter === "half"}
            onClick={() =>
              setStatusFilter((f) => (f === "half" ? "all" : "half"))
            }
          />
          <StatCard
            label="Absent"
            value={absent}
            icon="❌"
            color="#6b7280"
            loading={loading}
            active={statusFilter === "absent"}
            onClick={() =>
              setStatusFilter((f) => (f === "absent" ? "all" : "absent"))
            }
          />
          <StatCard
            label="Avg Hours"
            value={`${avgHours}h`}
            icon="⏱️"
            color="#D20000"
          />
        </div>
      )}

      <p
        style={{
          fontSize: "11px",
          color: "#94a3b8",
          margin: "0 0 16px",
          fontWeight: 500,
        }}
      ></p>

      {/* ── Active filter pill ────────────────────────────────────────────── */}
      {/* {statusFilter !== "all" && activeMeta && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "14px",
            padding: "8px 14px",
            background: activeMeta.color + "0d",
            border: `1px solid ${activeMeta.color}30`,
            borderRadius: "10px",
            width: "fit-content",
          }}
        >
          <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>
            API filtered by:
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              color: activeMeta.color,
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            {activeMeta.icon} {activeMeta.label}
          </span>
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>
            ({rawList.length} records)
          </span>
          <button
            onClick={() => setStatusFilter("all")}
            style={{
              background: activeMeta.color + "20",
              border: `1px solid ${activeMeta.color}40`,
              borderRadius: "6px",
              cursor: "pointer",
              color: activeMeta.color,
              fontSize: "12px",
              fontWeight: 700,
              padding: "2px 8px",
            }}
          >
            Clear ×
          </button>
        </div>
      )} */}

      {/* ── Date Tabs ─────────────────────────────────────────────────────── */}

      {/* ── Range Calendar dropdown ───────────────────────────────────────── */}
      {/* {mode === "range" && showCal && (
        <div
          ref={calRef}
          style={{
            position: "relative",
            zIndex: 100,
            marginTop: "-14px",
            marginBottom: "16px",
          }}
        >
          <RangeCalendar
            startDate={startDate}
            endDate={endDate}
            onChange={handleRangeChange}
          />
        </div>
      )} */}
      {/* Range: single button that opens the unified range calendar */}
      {/* {mode === "range" && (
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowCal((v) => !v)}
            style={{
              ...inputStyle,
              cursor: "pointer",
              fontWeight: 600,
              color: startDate && endDate ? "#D20000" : "#94a3b8",
              background: showCal ? "#D2000008" : "#fff",
              border: `1px solid ${showCal ? "#D20000" : "#cbd5e1"}`,
              minWidth: "200px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            📅{" "}
            {startDate && endDate
              ? `${fmtDate(startDate)} → ${fmtDate(endDate)}`
              : startDate
                ? `${fmtDate(startDate)} → pick end`
                : "Select date range"}
          </button>

          {showCal && (
            <div
              ref={calRef}
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                right: 0,
                zIndex: 999,
              }}
            >
              <RangeCalendar
                startDate={startDate}
                endDate={endDate}
                onChange={handleRangeChange}
              />
            </div>
          )}
        </div>
      )} */}

      {/* Range: single button that opens the unified range calendar */}

      {/* ── Error ────────────────────────────────────────────────────────── */}
      {error && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "10px",
            padding: "14px 18px",
            color: "#dc2626",
            fontSize: "14px",
            marginBottom: "16px",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* ── Table ────────────────────────────────────────────────────────── */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          overflow: "visible",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}
      >
        {/* <div
          style={{
            padding: "14px 18px",
            background: "linear-gradient(90deg, #D20000 0%, #8B0000 100%)",
            color: "#fff",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              fontWeight: 700,
              color: "white",
            }}
          >
            {rangeLabel}
            {statusFilter !== "all" && activeMeta && (
              <span
                style={{
                  marginLeft: "8px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: activeMeta.color,
                  background: activeMeta.color + "12",
                  padding: "2px 8px",
                  borderRadius: "10px",
                }}
              >
                {activeMeta.icon} {activeMeta.label} only
              </span>
            )}
          </p>
          <span
            style={{
              background: "#D2000010",
              color: "white",
              fontSize: "12px",
              fontWeight: 700,
              padding: "4px 12px",
              borderRadius: "20px",
            }}
          >
            {loading
              ? "…"
              : `${rawList.length} record${rawList.length !== 1 ? "s" : ""}`}
          </span>
        </div> */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            // gap: "6px",
            background: "#1a1a2e",
            // background: "#f1f5f9",
            // borderRadius: "10px",
            padding: "7px",
            marginBottom: "20px",
            // width: "fit-content",
            flexWrap: "wrap",
            overflow: "visible",
            position: "relative",
          }}
        >
          <div>
            <Tab
              label="Today"
              active={mode === "today"}
              onClick={() => handleModeChange("today")}
            />
            <Tab
              label="This Month"
              active={mode === "month"}
              onClick={() => handleModeChange("month")}
            />
            <Tab
              label="By Date"
              active={mode === "date"}
              onClick={() => handleModeChange("date")}
            />
            <Tab
              label="Date Range"
              active={mode === "range"}
              onClick={() => handleModeChange("range")}
            />
          </div>

          <div style={{ display: "flex", gap: 5 }}>
            {/* ── Employee Dropdown ─────────────────────────────────────────────── */}
            {mode === "range" && (
              <div style={{ position: "relative" }}>
                <button
                  ref={btnRef}
                  onClick={() => setShowCal((v) => !v)}
                  style={{
                    ...inputStyle,
                    cursor: "pointer",
                    fontWeight: 600,
                    color: startDate && endDate ? "#D20000" : "#94a3b8",
                    background: showCal ? "#D2000008" : "#fff",
                    border: `1px solid ${showCal ? "#D20000" : "#cbd5e1"}`,
                    minWidth: "200px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  📅{" "}
                  {startDate && endDate
                    ? `${fmtDate(startDate)} → ${fmtDate(endDate)}`
                    : startDate
                      ? `${fmtDate(startDate)} → pick end`
                      : "Select date range"}
                </button>

                {showCal && (
                  <div
                    ref={calRef}
                    style={{
                      position: "fixed",
                      top: btnRef.current
                        ? btnRef.current.getBoundingClientRect().bottom +
                          6 +
                          "px"
                        : "auto",
                      right: btnRef.current
                        ? window.innerWidth -
                          btnRef.current.getBoundingClientRect().right +
                          "px"
                        : "20px",
                      zIndex: 9999,
                    }}
                  >
                    <RangeCalendar
                      startDate={startDate}
                      endDate={endDate}
                      onChange={handleRangeChange}
                    />
                  </div>
                )}
              </div>
            )}
            {!propEmployeeId && (
              <div>
                <select
                  value={selectedEmpId}
                  onChange={(e) => handleEmpChange(e.target.value)}
                  style={{ ...inputStyle, minWidth: "220px" }}
                >
                  <option value="">All Employees</option>
                  {empLoading ? (
                    <option disabled>Loading…</option>
                  ) : (
                    employees &&
                    employees.length > 0 &&
                    employees?.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {`${emp.first_name || ""} ${emp.last_name || ""}` ||
                          emp.name ||
                          emp.employee_name ||
                          emp.full_name ||
                          `Employee #${emp.id}`}
                      </option>
                    ))
                  )}
                </select>
              </div>
            )}
            {/* Single date picker */}
            {mode === "date" && (
              <input
                type="date"
                value={customDate}
                max={todayStr()}
                onChange={(e) => setCustomDate(e.target.value || todayStr())}
                style={inputStyle}
              />
            )}
          </div>

          {/* Range: single button that opens the unified range calendar */}
          {/* {mode === "range" && (
            <button
              onClick={() => setShowCal((v) => !v)}
              style={{
                ...inputStyle,
                cursor: "pointer",
                fontWeight: 600,
                color: startDate && endDate ? "#D20000" : "#94a3b8",
                background: showCal ? "#D2000008" : "#fff",
                border: `1px solid ${showCal ? "#D20000" : "#cbd5e1"}`,
                minWidth: "200px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              📅{" "}
              {startDate && endDate
                ? `${fmtDate(startDate)} → ${fmtDate(endDate)}`
                : startDate
                  ? `${fmtDate(startDate)} → pick end`
                  : "Select date range"}
            </button>
          )} */}
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>Date</th>
                {showEmployeeCol && <th style={th}>Employee</th>}
                <th style={th}>Status</th>
                <th style={th}>Check In</th>
                <th style={th}>Check Out</th>
                <th style={th}>Hours</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeleton rows={5} cols={showEmployeeCol ? 6 : 5} />
              ) : rawList.length === 0 ? (
                <tr>
                  <td
                    colSpan={showEmployeeCol ? 6 : 5}
                    style={{
                      padding: "48px",
                      textAlign: "center",
                      color: "#94a3b8",
                      fontSize: "14px",
                    }}
                  >
                    {statusFilter !== "all" && activeMeta
                      ? `No "${activeMeta.label}" records found for this period.`
                      : "No attendance records found."}
                  </td>
                </tr>
              ) : (
                rawList.map((r, i) => (
                  <AttendanceRow
                    key={r.id}
                    record={r}
                    isFirst={i === 0}
                    showEmployee={showEmployeeCol}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
