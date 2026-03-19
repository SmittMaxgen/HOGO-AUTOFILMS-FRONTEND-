import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeAttendances } from "../../feature/employeeAttendance/employeeAttendanceThunks";
import {
  selectEmployeeAttendances,
  selectEmployeeAttendanceLoading,
  selectEmployeeAttendanceCount,
  selectEmployeeAttendanceError,
} from "../../feature/employeeAttendance/employeeAttendanceSelector";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function todayStr() {
  return new Date().toISOString().split("T")[0]; // "2026-03-19"
}

function currentMonthRange() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  return {
    from: `${y}-${m}-01`,
    to: `${y}-${m}-${new Date(y, now.getMonth() + 1, 0).getDate()}`,
  };
}

function fmtTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function fmtDate(str) {
  if (!str) return "—";
  return new Date(str).toLocaleDateString("en-IN", {
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
  if (record.full_leave)
    return <Badge label="Full Leave" color="#ef4444" bg="#fef2f2" />;
  if (record.half_leave)
    return <Badge label="Half Leave" color="#f59e0b" bg="#fffbeb" />;
  if (record.status)
    return <Badge label="Present" color="#10b981" bg="#f0fdf4" />;
  return <Badge label="Absent" color="#6b7280" bg="#f3f4f6" />;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        flex: "1 1 140px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
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
        {icon}
      </div>
      <div>
        <p
          style={{
            margin: 0,
            fontSize: "22px",
            fontWeight: 800,
            color: "#0f172a",
          }}
        >
          {value}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "12px",
            color: "#64748b",
            fontWeight: 500,
          }}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

// ─── Attendance Row ───────────────────────────────────────────────────────────
function AttendanceRow({ record, isFirst }) {
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
        style={{ ...td, fontWeight: 700, color: hours ? "#6366f1" : "#94a3b8" }}
      >
        {hours ? `${hours}h` : "—"}
      </td>
    </tr>
  );
}

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

const td = {
  padding: "12px 14px",
  fontSize: "13px",
  color: "#374151",
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function TableSkeleton({ rows = 5 }) {
  return (
    <>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      {Array.from({ length: rows }).map((_, i) => (
        <tr
          key={i}
          style={{ borderTop: i === 0 ? "none" : "1px solid #f1f5f9" }}
        >
          {Array.from({ length: 5 }).map((_, j) => (
            <td key={j} style={td}>
              <div
                style={{
                  height: "13px",
                  width: ["90px", "70px", "60px", "60px", "45px"][j],
                  borderRadius: "6px",
                  background:
                    "linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)",
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

// ─── Tab pill ─────────────────────────────────────────────────────────────────
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
        background: active ? "#6366f1" : "transparent",
        color: active ? "#fff" : "#64748b",
        boxShadow: active ? "0 2px 8px #6366f130" : "none",
      }}
    >
      {label}
    </button>
  );
}

// ─── Main Module ──────────────────────────────────────────────────────────────
/**
 * AttendanceModule
 *
 * Props:
 *  @param {number|string} [employee_id]  - If passed, fetches attendance for that
 *                                          specific employee. Otherwise fetches all.
 *  @param {string}        [title]        - Optional heading override
 */
export default function AttendanceModule({ employee_id, title }) {
  const dispatch = useDispatch();
  const allList = useSelector(selectEmployeeAttendances);
  const loading = useSelector(selectEmployeeAttendanceLoading);
  const count = useSelector(selectEmployeeAttendanceCount);
  const error = useSelector(selectEmployeeAttendanceError);

  // ── View mode: "today" | "month" | "custom" ───────────────────────────────
  const [mode, setMode] = useState("today");
  const [customDate, setCustomDate] = useState(todayStr());

  // ── Fetch based on mode ───────────────────────────────────────────────────
  const fetchData = useCallback(() => {
    const base = employee_id ? { employee: employee_id } : {};

    if (mode === "today") {
      dispatch(getEmployeeAttendances({ ...base, date: todayStr() }));
    } else if (mode === "month") {
      // API supports date param - fetch all then filter client-side for month
      dispatch(getEmployeeAttendances({ ...base }));
    } else {
      dispatch(getEmployeeAttendances({ ...base, date: customDate }));
    }
  }, [mode, customDate, employee_id, dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Filter list for month view client-side ────────────────────────────────
  const displayList = (() => {
    if (mode === "month") {
      const { from, to } = currentMonthRange();
      return allList.filter((r) => r.date >= from && r.date <= to);
    }
    return allList;
  })();

  // ── Stats ─────────────────────────────────────────────────────────────────
  const present = displayList.filter(
    (r) => r.status && !r.full_leave && !r.half_leave,
  ).length;
  const fullLeave = displayList.filter((r) => r.full_leave).length;
  const halfLeave = displayList.filter((r) => r.half_leave).length;
  const absent = displayList.filter((r) => !r.status).length;
  const avgHours = displayList.length
    ? (
        displayList.reduce((s, r) => s + (r.total_hours || 0), 0) /
        displayList.length
      ).toFixed(1)
    : "0.0";

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: "20px" }}>
        <h2
          style={{
            margin: 0,
            fontSize: "22px",
            fontWeight: 800,
            color: "#0f172a",
          }}
        >
          {title ||
            (employee_id ? "Employee Attendance" : "All Attendance Records")}
        </h2>
        {employee_id && (
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#64748b" }}>
            Employee ID: <b>#{employee_id}</b>
          </p>
        )}
      </div>

      {/* ── Tabs ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          background: "#f1f5f9",
          borderRadius: "10px",
          padding: "5px",
          marginBottom: "20px",
          width: "fit-content",
          flexWrap: "wrap",
        }}
      >
        <Tab
          label="Today"
          active={mode === "today"}
          onClick={() => setMode("today")}
        />
        <Tab
          label="This Month"
          active={mode === "month"}
          onClick={() => setMode("month")}
        />
        <Tab
          label="By Date"
          active={mode === "custom"}
          onClick={() => setMode("custom")}
        />

        {mode === "custom" && (
          <input
            type="date"
            value={customDate}
            onChange={(e) => setCustomDate(e.target.value)}
            style={{
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              padding: "6px 10px",
              fontSize: "13px",
              color: "#374151",
              background: "#fff",
              outline: "none",
              cursor: "pointer",
            }}
          />
        )}
      </div>

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

      {/* ── Stats row ────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <StatCard label="Present" value={present} icon="✅" color="#10b981" />
        <StatCard
          label="Full Leave"
          value={fullLeave}
          icon="🏖️"
          color="#ef4444"
        />
        <StatCard
          label="Half Leave"
          value={halfLeave}
          icon="⏰"
          color="#f59e0b"
        />
        <StatCard label="Absent" value={absent} icon="❌" color="#6b7280" />
        <StatCard
          label="Avg Hours"
          value={`${avgHours}h`}
          icon="⏱️"
          color="#6366f1"
        />
      </div>

      {/* ── Table ────────────────────────────────────────────────────────── */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}
      >
        {/* Table header row */}
        <div
          style={{
            padding: "14px 18px",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              fontWeight: 700,
              color: "#1e293b",
            }}
          >
            {mode === "today"
              ? `Today — ${fmtDate(todayStr())}`
              : mode === "month"
                ? `This Month — ${new Date().toLocaleString("en-IN", { month: "long", year: "numeric" })}`
                : `Date — ${fmtDate(customDate)}`}
          </p>
          <span
            style={{
              background: "#6366f110",
              color: "#6366f1",
              fontSize: "12px",
              fontWeight: 700,
              padding: "4px 12px",
              borderRadius: "20px",
            }}
          >
            {loading
              ? "…"
              : `${displayList.length} record${displayList.length !== 1 ? "s" : ""}`}
          </span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>Date</th>
                <th style={th}>Status</th>
                <th style={th}>Check In</th>
                <th style={th}>Check Out</th>
                <th style={th}>Hours</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeleton rows={5} />
              ) : displayList.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      padding: "48px",
                      textAlign: "center",
                      color: "#94a3b8",
                      fontSize: "14px",
                    }}
                  >
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                displayList.map((r, i) => (
                  <AttendanceRow key={r.id} record={r} isFirst={i === 0} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/*
─────────────────────────────────────────────────────────────
  USAGE EXAMPLES
─────────────────────────────────────────────────────────────

  // Show ALL employees' attendance
  <AttendanceModule />

  // Show a specific employee's attendance
  <AttendanceModule employee_id={21} />

  // With a custom title
  <AttendanceModule employee_id={21} title="John's Attendance Report" />

  Default view is "Today". User can switch tabs to:
    → This Month  (filters client-side by current month)
    → By Date     (shows a date picker, fetches that specific date)

─────────────────────────────────────────────────────────────
*/
