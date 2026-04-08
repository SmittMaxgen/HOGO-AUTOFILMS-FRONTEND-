import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLeaveBalances } from "../../feature/leaveBalance/leaveBalanceThunks";
import {
  selectLeaveBalances,
  selectLeaveBalanceLoading,
  selectLeaveBalanceError,
} from "../../feature/leaveBalance/leaveBalanceSelector";
import { Box, Typography } from "@mui/material";

// ─── Leave type columns ───────────────────────────────────────────────────────
const LEAVE_FIELDS = [
  {
    key: "cl",
    label: "Casual Leave",
    short: "CL",
    color: "#D20000",
    bg: "#fef2f2",
  },
  {
    key: "sl",
    label: "Sick Leave",
    short: "SL",
    color: "#f59e0b",
    bg: "#fffbeb",
  },
  {
    key: "pl",
    label: "Paid Leave",
    short: "PL",
    color: "#10b981",
    bg: "#f0fdf4",
  },
  {
    key: "ul",
    label: "Unpaid Leave",
    short: "UL",
    color: "#ef4444",
    bg: "#fef2f2",
  },
  {
    key: "compensatory_off",
    label: "Comp Off",
    short: "CO",
    color: "#3b82f6",
    bg: "#eff6ff",
  },
  {
    key: "public_holiday",
    label: "Public Holiday",
    short: "PH",
    color: "#8b5cf6",
    bg: "#f5f3ff",
  },
  {
    key: "maternity_leave",
    label: "Maternity",
    short: "ML",
    color: "#ec4899",
    bg: "#fdf2f8",
  },
  {
    key: "paternity_leave",
    label: "Paternity",
    short: "PAT",
    color: "#14b8a6",
    bg: "#f0fdfa",
  },
];

// ─── Group records by employee_id ─────────────────────────────────────────────
function groupByEmployee(list) {
  const map = {};
  list.forEach((record) => {
    const eid = record.employee_id;
    if (!map[eid]) map[eid] = { employee_id: eid, records: [] };
    map[eid].records.push(record);
  });
  return Object.values(map);
}

// sum a field across all records for one employee
function getVal(group, key) {
  return group.records.reduce((s, r) => s + (r[key] ?? 0), 0);
}

// ─── Cell ─────────────────────────────────────────────────────────────────────
function Cell({ value, max, color }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
      }}
    >
      <span
        style={{
          fontSize: "15px",
          fontWeight: 800,
          color: value === 0 ? "#cbd5e1" : color,
        }}
      >
        {value}
      </span>
      <div
        style={{
          width: "52px",
          height: "5px",
          background: "#f1f5f9",
          borderRadius: "99px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: value === 0 ? "#e2e8f0" : color,
            borderRadius: "99px",
            transition: "width 0.4s ease",
          }}
        />
      </div>
      <span
        style={{
          fontSize: "10px",
          fontWeight: 700,
          color: value === 0 ? "#cbd5e1" : color,
        }}
      >
        {Math.round(pct)}%
      </span>
    </div>
  );
}

// ─── Shimmer ──────────────────────────────────────────────────────────────────
const shimmer = {
  background: "linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.4s infinite",
  borderRadius: "6px",
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const thBase = {
  padding: "14px 10px",
  fontWeight: 700,
  background: "#f8fafc",
  borderBottom: "2px solid #e2e8f0",
  borderRight: "1px solid #f1f5f9",
  textAlign: "center",
  whiteSpace: "nowrap",
};

const tdBase = {
  padding: "14px 10px",
  textAlign: "center",
  borderBottom: "1px solid #f1f5f9",
  borderRight: "1px solid #f1f5f9",
  verticalAlign: "middle",
};

const empTd = {
  padding: "14px 16px",
  textAlign: "left",
  borderBottom: "1px solid #f1f5f9",
  borderRight: "2px solid #e2e8f0",
  background: "#fafafe",
  position: "sticky",
  left: 0,
  zIndex: 1,
  whiteSpace: "nowrap",
};

// ─── Main Module ──────────────────────────────────────────────────────────────
/**
 * LeaveBalanceModule
 *
 * Props:
 *  @param {number|string} [employee_id] — specific employee, omit for all
 *  @param {Array}         [employees]   — Redux list to resolve names
 *  @param {string}        [title]       — optional heading override
 */
export default function LeaveBalanceModule({
  employee_id,
  employees = [],
  title,
}) {
  const dispatch = useDispatch();
  const list = useSelector(selectLeaveBalances);
  const loading = useSelector(selectLeaveBalanceLoading);
  const error = useSelector(selectLeaveBalanceError);

  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(""); // "" = All
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    dispatch(getLeaveBalances(employee_id ? { employee_id } : {}));
  }, [employee_id, dispatch]);

  const grouped = groupByEmployee(list).filter((g) => {
    if (!search.trim()) return true;
    const emp = employees?.find((e) => e.id === g.employee_id);
    const name = emp?.name || emp?.full_name || "";
    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      String(g.employee_id).includes(search)
    );
  });

  const totalAllocated = list.reduce((s, r) => s + (r.total_allocated || 0), 0);
  const totalUsed = list.reduce((s, r) => s + (r.used_days || 0), 0);
  const totalRemaining = list.reduce((s, r) => s + (r.remaining_days || 0), 0);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          {/* <h2
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: 800,
              color: "#0d0e36",
            }}
          >
            {title ||
              (employee_id ? "Employee Leave Balance" : "Leave Balances")}
          </h2> */}

          <Box display="flex" alignItems="center" gap={1.5} mb={3}>
            <Box
              sx={{ width: 5, height: 32, bgcolor: "#D20000", borderRadius: 1 }}
            />
            <Typography variant="h5" fontWeight={800} color="#0d0e36">
              {title ||
                (employee_id ? "Employee Leave Balance" : "Leave Balances")}
            </Typography>
          </Box>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#94a3b8" }}>
            {loading
              ? "Loading…"
              : `${grouped.length} employee${grouped.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        {!loading && list.length > 0 && (
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {[
              { label: "Allocated", value: totalAllocated, color: "#D20000" },
              { label: "Used", value: totalUsed, color: "#f59e0b" },
              { label: "Remaining", value: totalRemaining, color: "#10b981" },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                style={{
                  background: color + "12",
                  border: `1px solid ${color}25`,
                  borderRadius: "10px",
                  padding: "8px 16px",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: 800,
                    color,
                  }}
                >
                  {value}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "11px",
                    color: "#64748b",
                    fontWeight: 600,
                  }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Error ──────────────────────────────────────────────────────────── */}
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

      {/* ── Table ──────────────────────────────────────────────────────────── */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
        }}
      >
        {/* Toolbar */}
        <div
          style={{
            background: "linear-gradient(90deg, #D20000 0%, #8B0000 100%)",
            padding: "14px 18px",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "13px",
                color: "#94a3b8",
                pointerEvents: "none",
              }}
            ></span>
            <input
              type="text"
              placeholder="Search employee…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                paddingLeft: "32px",
                paddingRight: "12px",
                paddingTop: "7px",
                paddingBottom: "7px",
                fontSize: "13px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                outline: "none",
                color: "#374151",
                background: "#f8fafc",
                width: "200px",
              }}
              onFocus={(e) => (e.target.style.border = "1px solid #D20000")}
              onBlur={(e) => (e.target.style.border = "1px solid #e2e8f0")}
            />
          </div>
          {/* ── Month + Year Filters ── */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {/* Year */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              style={{
                padding: "7px 12px",
                fontSize: "13px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                outline: "none",
                color: "#374151",
                background: "#f8fafc",
                cursor: "pointer",
                fontWeight: 600,
              }}
              onFocus={(e) => (e.target.style.border = "1px solid #D20000")}
              onBlur={(e) => (e.target.style.border = "1px solid #e2e8f0")}
            >
              <option value="">All Years</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>

            {/* Month */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{
                padding: "7px 12px",
                fontSize: "13px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                outline: "none",
                color: "#374151",
                background: "#f8fafc",
                cursor: "pointer",
                fontWeight: 600,
              }}
              onFocus={(e) => (e.target.style.border = "1px solid #D20000")}
              onBlur={(e) => (e.target.style.border = "1px solid #e2e8f0")}
            >
              <option value="">All Months</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>

            {/* Clear button — only show if any filter active */}
            {(selectedMonth || selectedYear) && (
              <button
                onClick={() => {
                  setSelectedMonth("");
                  setSelectedYear("");
                }}
                style={{
                  padding: "7px 12px",
                  fontSize: "12px",
                  fontWeight: 700,
                  border: "1px solid #fecaca",
                  borderRadius: "8px",
                  background: "#fef2f2",
                  color: "#ef4444",
                  cursor: "pointer",
                }}
              >
                ✕ Clear
              </button>
            )}
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            {/* ── THEAD — leave types as columns ───────────────────────── */}
            <thead>
              <tr>
                {/* sticky top-left corner */}
                <th
                  style={{
                    ...thBase,
                    textAlign: "left",
                    padding: "14px 16px",
                    minWidth: "200px",
                    position: "sticky",
                    left: 0,
                    zIndex: 2,
                    borderRight: "2px solid #e2e8f0",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                    }}
                  >
                    Employee
                  </span>
                </th>

                {/* one column per leave field */}
                {LEAVE_FIELDS.map((field) => (
                  <th key={field.key} style={{ ...thBase, minWidth: "100px" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <span
                        style={{
                          background: field.bg,
                          color: field.color,
                          fontSize: "10px",
                          fontWeight: 800,
                          padding: "3px 8px",
                          borderRadius: "5px",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {field.short}
                      </span>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#374151",
                        }}
                      >
                        {field.label}
                      </span>
                    </div>
                  </th>
                ))}

                {/* summary columns */}
                <th
                  style={{
                    ...thBase,
                    minWidth: "80px",
                    background: "#f0fdf4",
                    borderLeft: "2px solid #e2e8f0",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#10b981",
                    }}
                  >
                    Used
                  </span>
                </th>
                <th
                  style={{ ...thBase, minWidth: "90px", background: "#fef2f2" }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#D20000",
                    }}
                  >
                    Allocated
                  </span>
                </th>
                <th
                  style={{ ...thBase, minWidth: "90px", background: "#fafafe" }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#64748b",
                    }}
                  >
                    Remaining
                  </span>
                </th>
              </tr>
            </thead>

            {/* ── TBODY — employees as rows ─────────────────────────────── */}
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ ...empTd }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{
                            ...shimmer,
                            width: 34,
                            height: 34,
                            borderRadius: "8px",
                            flexShrink: 0,
                          }}
                        />
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "5px",
                          }}
                        >
                          <div style={{ ...shimmer, height: 12, width: 90 }} />
                          <div style={{ ...shimmer, height: 10, width: 55 }} />
                        </div>
                      </div>
                    </td>
                    {Array.from({ length: LEAVE_FIELDS.length + 3 }).map(
                      (_, j) => (
                        <td key={j} style={tdBase}>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <div
                              style={{ ...shimmer, height: 15, width: 24 }}
                            />
                            <div
                              style={{
                                ...shimmer,
                                height: 4,
                                width: 52,
                                borderRadius: "99px",
                              }}
                            />
                            <div
                              style={{ ...shimmer, height: 10, width: 28 }}
                            />
                          </div>
                        </td>
                      ),
                    )}
                  </tr>
                ))
              ) : grouped.length === 0 ? (
                <tr>
                  <td
                    colSpan={LEAVE_FIELDS.length + 4}
                    style={{
                      padding: "48px",
                      textAlign: "center",
                      color: "#94a3b8",
                      fontSize: "14px",
                    }}
                  >
                    {search
                      ? `No results for "${search}"`
                      : "No leave balance records found."}
                  </td>
                </tr>
              ) : (
                grouped.map((group, gIdx) => {
                  const emp = employees?.find(
                    (e) => e.id === group.employee_id,
                  );
                  const name = group?.records?.[0]?.employee_name || null;

                  const initial = name ? name[0].toUpperCase() : "#";
                  const max = getVal(group, "total_allocated");
                  const used = getVal(group, "used_days");
                  const remaining = getVal(group, "remaining_days");

                  return (
                    <tr
                      key={group.employee_id}
                      style={{
                        background: gIdx % 2 === 0 ? "#fff" : "#fafafe",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#fff0f0")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                          gIdx % 2 === 0 ? "#fff" : "#fafafe")
                      }
                    >
                      {/* ── Employee cell (sticky left) ─────────────────── */}
                      <td
                        style={{
                          ...empTd,
                          background: gIdx % 2 === 0 ? "#fafafe" : "#f4f6ff",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <div
                            style={{
                              width: "34px",
                              height: "34px",
                              borderRadius: "8px",
                              background:
                                "linear-gradient(90deg, #D20000 0%, #8B0000 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#fff",
                              fontWeight: 800,
                              fontSize: "13px",
                              flexShrink: 0,
                            }}
                          >
                            {initial}
                          </div>
                          <div>
                            <p
                              style={{
                                margin: 0,
                                fontSize: "13px",
                                fontWeight: 700,
                                color: "#0d0e36",
                              }}
                            >
                              {name || `Employee`}
                            </p>
                            <p
                              style={{
                                margin: 0,
                                fontSize: "11px",
                                color: "#94a3b8",
                              }}
                            >
                              ID #{group.employee_id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* ── One cell per leave field ────────────────────── */}
                      {LEAVE_FIELDS.map((field) => {
                        const value = getVal(group, field.key);
                        return (
                          <td key={field.key} style={tdBase}>
                            <Cell value={value} max={max} color={field.color} />
                          </td>
                        );
                      })}

                      {/* ── Summary cells ───────────────────────────────── */}
                      <td
                        style={{
                          ...tdBase,
                          background: "#f0fdf420",
                          borderLeft: "2px solid #e2e8f0",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "15px",
                            fontWeight: 800,
                            color: "#f59e0b",
                          }}
                        >
                          {used}
                        </span>
                      </td>
                      <td style={{ ...tdBase, background: "#D2000010" }}>
                        <span
                          style={{
                            fontSize: "15px",
                            fontWeight: 800,
                            color: "#D20000",
                          }}
                        >
                          {max}
                        </span>
                      </td>
                      <td style={{ ...tdBase }}>
                        <span
                          style={{
                            fontSize: "15px",
                            fontWeight: 800,
                            color: remaining === 0 ? "#ef4444" : "#10b981",
                          }}
                        >
                          {remaining}
                        </span>
                      </td>
                    </tr>
                  );
                })
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

  // All employees
  <LeaveBalanceModule />

  // With names from Redux
  const employees = useSelector(selectEmployees);
  <LeaveBalanceModule employees={employees} />

  // Specific employee
  <LeaveBalanceModule employee_id={19} employees={employees} />

─────────────────────────────────────────────────────────────
*/
