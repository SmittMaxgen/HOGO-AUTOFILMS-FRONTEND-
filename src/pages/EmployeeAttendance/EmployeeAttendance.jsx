// // // // import { useEffect, useState, useCallback } from "react";
// // // // import { useDispatch, useSelector } from "react-redux";
// // // // import { getEmployeeAttendances } from "../../feature/employeeAttendance/employeeAttendanceThunks";
// // // // import {
// // // //   selectEmployeeAttendances,
// // // //   selectEmployeeAttendanceLoading,
// // // //   selectEmployeeAttendanceCount,
// // // //   selectEmployeeAttendanceError,
// // // // } from "../../feature/employeeAttendance/employeeAttendanceSelector";
// // // // import { Box, Typography } from "@mui/material";

// // // // // ─── Helpers ──────────────────────────────────────────────────────────────────
// // // // function todayStr() {
// // // //   return new Date().toISOString().split("T")[0]; // "2026-03-19"
// // // // }

// // // // function currentMonthRange() {
// // // //   const now = new Date();
// // // //   const y = now.getFullYear();
// // // //   const m = String(now.getMonth() + 1).padStart(2, "0");
// // // //   return {
// // // //     from: `${y}-${m}-01`,
// // // //     to: `${y}-${m}-${new Date(y, now.getMonth() + 1, 0).getDate()}`,
// // // //   };
// // // // }

// // // // function fmtTime(iso) {
// // // //   if (!iso) return "—";
// // // //   const d = new Date(iso);
// // // //   return d.toLocaleTimeString([], {
// // // //     hour: "2-digit",
// // // //     minute: "2-digit",
// // // //     hour12: true,
// // // //   });
// // // // }

// // // // function fmtDate(str) {
// // // //   if (!str) return "—";
// // // //   return new Date(str).toLocaleDateString("en-IN", {
// // // //     day: "2-digit",
// // // //     month: "short",
// // // //     year: "numeric",
// // // //   });
// // // // }

// // // // function calcHours(start, end) {
// // // //   if (!start || !end) return null;
// // // //   const diff = (new Date(end) - new Date(start)) / 3600000;
// // // //   return diff > 0 ? diff.toFixed(1) : null;
// // // // }

// // // // // ─── Status badge ─────────────────────────────────────────────────────────────
// // // // function Badge({ label, color, bg }) {
// // // //   return (
// // // //     <span
// // // //       style={{
// // // //         background: bg,
// // // //         color,
// // // //         fontSize: "11px",
// // // //         fontWeight: 700,
// // // //         padding: "3px 10px",
// // // //         borderRadius: "20px",
// // // //         whiteSpace: "nowrap",
// // // //       }}
// // // //     >
// // // //       {label}
// // // //     </span>
// // // //   );
// // // // }

// // // // function StatusBadge({ record }) {
// // // //   if (record.full_leave)
// // // //     return <Badge label="Full Leave" color="#ef4444" bg="#fef2f2" />;
// // // //   if (record.half_leave)
// // // //     return <Badge label="Half Leave" color="#f59e0b" bg="#fffbeb" />;
// // // //   if (record.status)
// // // //     return <Badge label="Present" color="#10b981" bg="#f0fdf4" />;
// // // //   return <Badge label="Absent" color="#6b7280" bg="#f3f4f6" />;
// // // // }

// // // // // ─── Stat Card ────────────────────────────────────────────────────────────────
// // // // function StatCard({ label, value, icon, color }) {
// // // //   return (
// // // //     <div
// // // //       style={{
// // // //         background: "#fff",
// // // //         border: "1px solid #e2e8f0",
// // // //         borderRadius: "12px",
// // // //         padding: "16px 20px",
// // // //         display: "flex",
// // // //         alignItems: "center",
// // // //         gap: "14px",
// // // //         flex: "1 1 140px",
// // // //         boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
// // // //       }}
// // // //     >
// // // //       <div
// // // //         style={{
// // // //           width: "42px",
// // // //           height: "42px",
// // // //           borderRadius: "10px",
// // // //           background: color + "18",
// // // //           display: "flex",
// // // //           alignItems: "center",
// // // //           justifyContent: "center",
// // // //           fontSize: "20px",
// // // //           flexShrink: 0,
// // // //         }}
// // // //       >
// // // //         {icon}
// // // //       </div>
// // // //       <div>
// // // //         <p
// // // //           style={{
// // // //             margin: 0,
// // // //             fontSize: "22px",
// // // //             fontWeight: 800,
// // // //             color: "#0f172a",
// // // //           }}
// // // //         >
// // // //           {value}
// // // //         </p>
// // // //         <p
// // // //           style={{
// // // //             margin: 0,
// // // //             fontSize: "12px",
// // // //             color: "#64748b",
// // // //             fontWeight: 500,
// // // //           }}
// // // //         >
// // // //           {label}
// // // //         </p>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // // ─── Attendance Row ───────────────────────────────────────────────────────────
// // // // function AttendanceRow({ record, isFirst }) {
// // // //   const hours =
// // // //     record.total_hours ?? calcHours(record.start_time, record.end_time);
// // // //   return (
// // // //     <tr
// // // //       style={{
// // // //         borderTop: isFirst ? "none" : "1px solid #f1f5f9",
// // // //         transition: "background 0.15s",
// // // //       }}
// // // //       onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
// // // //       onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
// // // //     >
// // // //       <td style={td}>{fmtDate(record.date)}</td>
// // // //       <td style={td}>
// // // //         <StatusBadge record={record} />
// // // //       </td>
// // // //       <td style={{ ...td, color: "#10b981", fontWeight: 600 }}>
// // // //         {record.start_time ? fmtTime(record.start_time) : "—"}
// // // //       </td>
// // // //       <td style={{ ...td, color: "#ef4444", fontWeight: 600 }}>
// // // //         {record.end_time ? fmtTime(record.end_time) : "—"}
// // // //       </td>
// // // //       <td
// // // //         style={{ ...td, fontWeight: 700, color: hours ? "#6366f1" : "#94a3b8" }}
// // // //       >
// // // //         {hours ? `${hours}h` : "—"}
// // // //       </td>
// // // //     </tr>
// // // //   );
// // // // }

// // // // const th = {
// // // //   padding: "10px 14px",
// // // //   fontSize: "11px",
// // // //   fontWeight: 700,
// // // //   color: "#94a3b8",
// // // //   textTransform: "uppercase",
// // // //   letterSpacing: "0.06em",
// // // //   textAlign: "left",
// // // //   background: "#f8fafc",
// // // //   whiteSpace: "nowrap",
// // // // };

// // // // const td = {
// // // //   padding: "12px 14px",
// // // //   fontSize: "13px",
// // // //   color: "#374151",
// // // // };

// // // // // ─── Skeleton ─────────────────────────────────────────────────────────────────
// // // // function TableSkeleton({ rows = 5 }) {
// // // //   return (
// // // //     <>
// // // //       <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
// // // //       {Array.from({ length: rows }).map((_, i) => (
// // // //         <tr
// // // //           key={i}
// // // //           style={{ borderTop: i === 0 ? "none" : "1px solid #f1f5f9" }}
// // // //         >
// // // //           {Array.from({ length: 5 }).map((_, j) => (
// // // //             <td key={j} style={td}>
// // // //               <div
// // // //                 style={{
// // // //                   height: "13px",
// // // //                   width: ["90px", "70px", "60px", "60px", "45px"][j],
// // // //                   borderRadius: "6px",
// // // //                   background:
// // // //                     "linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)",
// // // //                   backgroundSize: "200% 100%",
// // // //                   animation: "shimmer 1.4s infinite",
// // // //                 }}
// // // //               />
// // // //             </td>
// // // //           ))}
// // // //         </tr>
// // // //       ))}
// // // //     </>
// // // //   );
// // // // }

// // // // // ─── Tab pill ─────────────────────────────────────────────────────────────────
// // // // function Tab({ label, active, onClick }) {
// // // //   return (
// // // //     <button
// // // //       onClick={onClick}
// // // //       style={{
// // // //         padding: "7px 18px",
// // // //         fontSize: "13px",
// // // //         fontWeight: 600,
// // // //         borderRadius: "8px",
// // // //         border: "none",
// // // //         cursor: "pointer",
// // // //         transition: "all 0.18s",
// // // //         background: active ? "#6366f1" : "transparent",
// // // //         color: active ? "#fff" : "#64748b",
// // // //         boxShadow: active ? "0 2px 8px #6366f130" : "none",
// // // //       }}
// // // //     >
// // // //       {label}
// // // //     </button>
// // // //   );
// // // // }

// // // // // ─── Main Module ──────────────────────────────────────────────────────────────
// // // // /**
// // // //  * AttendanceModule
// // // //  *
// // // //  * Props:
// // // //  *  @param {number|string} [employee_id]  - If passed, fetches attendance for that
// // // //  *                                          specific employee. Otherwise fetches all.
// // // //  *  @param {string}        [title]        - Optional heading override
// // // //  */
// // // // export default function AttendanceModule({ employee_id, title }) {
// // // //   const dispatch = useDispatch();
// // // //   const allList = useSelector(selectEmployeeAttendances);
// // // //   const loading = useSelector(selectEmployeeAttendanceLoading);
// // // //   const count = useSelector(selectEmployeeAttendanceCount);
// // // //   const error = useSelector(selectEmployeeAttendanceError);

// // // //   // ── View mode: "today" | "month" | "custom" ───────────────────────────────
// // // //   const [mode, setMode] = useState("today");
// // // //   const [customDate, setCustomDate] = useState(todayStr());

// // // //   // ── Fetch based on mode ───────────────────────────────────────────────────
// // // //   const fetchData = useCallback(() => {
// // // //     const base = employee_id ? { employee: employee_id } : {};

// // // //     if (mode === "today") {
// // // //       dispatch(getEmployeeAttendances({ ...base, date: todayStr() }));
// // // //     } else if (mode === "month") {
// // // //       // API supports date param - fetch all then filter client-side for month
// // // //       dispatch(getEmployeeAttendances({ ...base }));
// // // //     } else {
// // // //       dispatch(getEmployeeAttendances({ ...base, date: customDate }));
// // // //     }
// // // //   }, [mode, customDate, employee_id, dispatch]);

// // // //   useEffect(() => {
// // // //     fetchData();
// // // //   }, [fetchData]);

// // // //   // ── Filter list for month view client-side ────────────────────────────────
// // // //   const displayList = (() => {
// // // //     if (mode === "month") {
// // // //       const { from, to } = currentMonthRange();
// // // //       return allList.filter((r) => r.date >= from && r.date <= to);
// // // //     }
// // // //     return allList;
// // // //   })();

// // // //   // ── Stats ─────────────────────────────────────────────────────────────────
// // // //   const present = displayList.filter(
// // // //     (r) => r.status && !r.full_leave && !r.half_leave,
// // // //   ).length;
// // // //   const fullLeave = displayList.filter((r) => r.full_leave).length;
// // // //   const halfLeave = displayList.filter((r) => r.half_leave).length;
// // // //   const absent = displayList.filter((r) => !r.status).length;
// // // //   const avgHours = displayList.length
// // // //     ? (
// // // //         displayList.reduce((s, r) => s + (r.total_hours || 0), 0) /
// // // //         displayList.length
// // // //       ).toFixed(1)
// // // //     : "0.0";

// // // //   return (
// // // //     <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
// // // //       <link
// // // //         href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap"
// // // //         rel="stylesheet"
// // // //       />

// // // //       {/* ── Header ───────────────────────────────────────────────────────── */}
// // // //       <div style={{ marginBottom: "20px" }}>
// // // //         {/* <h2
// // // //           style={{
// // // //             margin: 0,
// // // //             fontSize: "22px",
// // // //             fontWeight: 800,
// // // //             color: "#0f172a",
// // // //           }}
// // // //         >
// // // //           {title ||
// // // //             (employee_id ? "Employee Attendance" : "Attendance Records")}
// // // //         </h2> */}
// // // //         <Box display="flex" alignItems="center" gap={1.5} mb={3}>
// // // //           <Box
// // // //             sx={{ width: 5, height: 32, bgcolor: "#D20000", borderRadius: 1 }}
// // // //           />
// // // //           <Typography variant="h5" fontWeight={800} color="#1a1a1a">
// // // //             {title ||
// // // //               (employee_id ? "Employee Attendance" : "Attendance Records")}
// // // //           </Typography>
// // // //         </Box>
// // // //         {employee_id && (
// // // //           <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#64748b" }}>
// // // //             Employee ID: <b>#{employee_id}</b>
// // // //           </p>
// // // //         )}
// // // //       </div>

// // // //       {/* ── Tabs ─────────────────────────────────────────────────────────── */}
// // // //       <div
// // // //         style={{
// // // //           display: "flex",
// // // //           alignItems: "center",
// // // //           gap: "6px",
// // // //           background: "#f1f5f9",
// // // //           borderRadius: "10px",
// // // //           padding: "5px",
// // // //           marginBottom: "20px",
// // // //           width: "fit-content",
// // // //           flexWrap: "wrap",
// // // //         }}
// // // //       >
// // // //         <Tab
// // // //           label="Today"
// // // //           active={mode === "today"}
// // // //           onClick={() => setMode("today")}
// // // //         />
// // // //         <Tab
// // // //           label="This Month"
// // // //           active={mode === "month"}
// // // //           onClick={() => setMode("month")}
// // // //         />
// // // //         <Tab
// // // //           label="By Date"
// // // //           active={mode === "custom"}
// // // //           onClick={() => setMode("custom")}
// // // //         />

// // // //         {mode === "custom" && (
// // // //           <input
// // // //             type="date"
// // // //             value={customDate}
// // // //             onChange={(e) => setCustomDate(e.target.value)}
// // // //             style={{
// // // //               border: "1px solid #cbd5e1",
// // // //               borderRadius: "8px",
// // // //               padding: "6px 10px",
// // // //               fontSize: "13px",
// // // //               color: "#374151",
// // // //               background: "#fff",
// // // //               outline: "none",
// // // //               cursor: "pointer",
// // // //             }}
// // // //           />
// // // //         )}
// // // //       </div>

// // // //       {/* ── Error ────────────────────────────────────────────────────────── */}
// // // //       {error && (
// // // //         <div
// // // //           style={{
// // // //             background: "#fef2f2",
// // // //             border: "1px solid #fecaca",
// // // //             borderRadius: "10px",
// // // //             padding: "14px 18px",
// // // //             color: "#dc2626",
// // // //             fontSize: "14px",
// // // //             marginBottom: "16px",
// // // //           }}
// // // //         >
// // // //           ⚠️ {error}
// // // //         </div>
// // // //       )}

// // // //       {/* ── Stats row ────────────────────────────────────────────────────── */}
// // // //       <div
// // // //         style={{
// // // //           display: "flex",
// // // //           gap: "12px",
// // // //           flexWrap: "wrap",
// // // //           marginBottom: "20px",
// // // //         }}
// // // //       >
// // // //         <StatCard label="Present" value={present} icon="✅" color="#10b981" />
// // // //         <StatCard
// // // //           label="Full Leave"
// // // //           value={fullLeave}
// // // //           icon="🏖️"
// // // //           color="#ef4444"
// // // //         />
// // // //         <StatCard
// // // //           label="Half Leave"
// // // //           value={halfLeave}
// // // //           icon="⏰"
// // // //           color="#f59e0b"
// // // //         />
// // // //         <StatCard label="Absent" value={absent} icon="❌" color="#6b7280" />
// // // //         <StatCard
// // // //           label="Avg Hours"
// // // //           value={`${avgHours}h`}
// // // //           icon="⏱️"
// // // //           color="#6366f1"
// // // //         />
// // // //       </div>

// // // //       {/* ── Table ────────────────────────────────────────────────────────── */}
// // // //       <div
// // // //         style={{
// // // //           background: "#fff",
// // // //           border: "1px solid #e2e8f0",
// // // //           borderRadius: "12px",
// // // //           overflow: "hidden",
// // // //           boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
// // // //         }}
// // // //       >
// // // //         {/* Table header row */}
// // // //         <div
// // // //           style={{
// // // //             padding: "14px 18px",
// // // //             borderBottom: "1px solid #e2e8f0",
// // // //             display: "flex",
// // // //             justifyContent: "space-between",
// // // //             alignItems: "center",
// // // //           }}
// // // //         >
// // // //           <p
// // // //             style={{
// // // //               margin: 0,
// // // //               fontSize: "14px",
// // // //               fontWeight: 700,
// // // //               color: "#1e293b",
// // // //             }}
// // // //           >
// // // //             {mode === "today"
// // // //               ? `Today — ${fmtDate(todayStr())}`
// // // //               : mode === "month"
// // // //                 ? `This Month — ${new Date().toLocaleString("en-IN", { month: "long", year: "numeric" })}`
// // // //                 : `Date — ${fmtDate(customDate)}`}
// // // //           </p>
// // // //           <span
// // // //             style={{
// // // //               background: "#6366f110",
// // // //               color: "#6366f1",
// // // //               fontSize: "12px",
// // // //               fontWeight: 700,
// // // //               padding: "4px 12px",
// // // //               borderRadius: "20px",
// // // //             }}
// // // //           >
// // // //             {loading
// // // //               ? "…"
// // // //               : `${displayList.length} record${displayList.length !== 1 ? "s" : ""}`}
// // // //           </span>
// // // //         </div>

// // // //         <div style={{ overflowX: "auto" }}>
// // // //           <table style={{ width: "100%", borderCollapse: "collapse" }}>
// // // //             <thead>
// // // //               <tr>
// // // //                 <th style={th}>Date</th>
// // // //                 <th style={th}>Status</th>
// // // //                 <th style={th}>Check In</th>
// // // //                 <th style={th}>Check Out</th>
// // // //                 <th style={th}>Hours</th>
// // // //               </tr>
// // // //             </thead>
// // // //             <tbody>
// // // //               {loading ? (
// // // //                 <TableSkeleton rows={5} />
// // // //               ) : displayList.length === 0 ? (
// // // //                 <tr>
// // // //                   <td
// // // //                     colSpan={5}
// // // //                     style={{
// // // //                       padding: "48px",
// // // //                       textAlign: "center",
// // // //                       color: "#94a3b8",
// // // //                       fontSize: "14px",
// // // //                     }}
// // // //                   >
// // // //                     No attendance records found.
// // // //                   </td>
// // // //                 </tr>
// // // //               ) : (
// // // //                 displayList.map((r, i) => (
// // // //                   <AttendanceRow key={r.id} record={r} isFirst={i === 0} />
// // // //                 ))
// // // //               )}
// // // //             </tbody>
// // // //           </table>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // /*
// // // // ─────────────────────────────────────────────────────────────
// // // //   USAGE EXAMPLES
// // // // ─────────────────────────────────────────────────────────────

// // // //   // Show ALL employees' attendance
// // // //   <AttendanceModule />

// // // //   // Show a specific employee's attendance
// // // //   <AttendanceModule employee_id={21} />

// // // //   // With a custom title
// // // //   <AttendanceModule employee_id={21} title="John's Attendance Report" />

// // // //   Default view is "Today". User can switch tabs to:
// // // //     → This Month  (filters client-side by current month)
// // // //     → By Date     (shows a date picker, fetches that specific date)

// // // // ─────────────────────────────────────────────────────────────
// // // // */
// // // import { useEffect, useState, useCallback } from "react";
// // // import { useDispatch, useSelector } from "react-redux";
// // // import { getEmployeeAttendances } from "../../feature/employeeAttendance/employeeAttendanceThunks";
// // // import {
// // //   selectEmployeeAttendances,
// // //   selectEmployeeAttendanceLoading,
// // //   selectEmployeeAttendanceError,
// // // } from "../../feature/employeeAttendance/employeeAttendanceSelector";
// // // import { Box, Typography } from "@mui/material";
// // // import axiosInstance from "../../api/axiosInstance";

// // // // ─── Helpers ──────────────────────────────────────────────────────────────────
// // // function todayStr() {
// // //   return new Date().toISOString().split("T")[0];
// // // }

// // // function fmtTime(iso) {
// // //   if (!iso) return "—";
// // //   const d = new Date(iso);
// // //   if (isNaN(d)) return "—";
// // //   return d.toLocaleTimeString([], {
// // //     hour: "2-digit",
// // //     minute: "2-digit",
// // //     hour12: true,
// // //   });
// // // }

// // // function fmtDate(str) {
// // //   if (!str) return "—";
// // //   const d = new Date(str);
// // //   if (isNaN(d)) return str;
// // //   return d.toLocaleDateString("en-IN", {
// // //     day: "2-digit",
// // //     month: "short",
// // //     year: "numeric",
// // //   });
// // // }

// // // function calcHours(start, end) {
// // //   if (!start || !end) return null;
// // //   const diff = (new Date(end) - new Date(start)) / 3600000;
// // //   return diff > 0 ? diff.toFixed(1) : null;
// // // }

// // // // ─── Status badge ─────────────────────────────────────────────────────────────
// // // function Badge({ label, color, bg }) {
// // //   return (
// // //     <span
// // //       style={{
// // //         background: bg,
// // //         color,
// // //         fontSize: "11px",
// // //         fontWeight: 700,
// // //         padding: "3px 10px",
// // //         borderRadius: "20px",
// // //         whiteSpace: "nowrap",
// // //       }}
// // //     >
// // //       {label}
// // //     </span>
// // //   );
// // // }

// // // function StatusBadge({ record }) {
// // //   if (record.full_leave)
// // //     return <Badge label="Full Leave" color="#ef4444" bg="#fef2f2" />;
// // //   if (record.half_leave)
// // //     return <Badge label="Half Leave" color="#f59e0b" bg="#fffbeb" />;
// // //   if (record.status)
// // //     return <Badge label="Present" color="#10b981" bg="#f0fdf4" />;
// // //   return <Badge label="Absent" color="#6b7280" bg="#f3f4f6" />;
// // // }

// // // // ─── Stat Card (clickable filter) ─────────────────────────────────────────────
// // // function StatCard({ label, value, icon, color, active, onClick }) {
// // //   return (
// // //     <div
// // //       onClick={onClick}
// // //       title={onClick ? `Click to filter by ${label}` : undefined}
// // //       style={{
// // //         background: active ? color + "12" : "#fff",
// // //         border: `1.5px solid ${active ? color : "#e2e8f0"}`,
// // //         borderRadius: "12px",
// // //         padding: "16px 20px",
// // //         display: "flex",
// // //         alignItems: "center",
// // //         gap: "14px",
// // //         flex: "1 1 130px",
// // //         boxShadow: active
// // //           ? `0 2px 12px ${color}28`
// // //           : "0 1px 4px rgba(0,0,0,0.05)",
// // //         cursor: onClick ? "pointer" : "default",
// // //         transition: "all 0.18s",
// // //         userSelect: "none",
// // //         transform: active ? "translateY(-1px)" : "none",
// // //       }}
// // //     >
// // //       <div
// // //         style={{
// // //           width: "42px",
// // //           height: "42px",
// // //           borderRadius: "10px",
// // //           background: color + "18",
// // //           display: "flex",
// // //           alignItems: "center",
// // //           justifyContent: "center",
// // //           fontSize: "20px",
// // //           flexShrink: 0,
// // //         }}
// // //       >
// // //         {icon}
// // //       </div>
// // //       <div style={{ flex: 1, minWidth: 0 }}>
// // //         <p
// // //           style={{
// // //             margin: 0,
// // //             fontSize: "22px",
// // //             fontWeight: 800,
// // //             color: active ? color : "#0f172a",
// // //           }}
// // //         >
// // //           {value}
// // //         </p>
// // //         <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
// // //           <p
// // //             style={{
// // //               margin: 0,
// // //               fontSize: "12px",
// // //               color: active ? color : "#64748b",
// // //               fontWeight: 600,
// // //             }}
// // //           >
// // //             {label}
// // //           </p>
// // //           {active && (
// // //             <span
// // //               style={{
// // //                 fontSize: "9px",
// // //                 fontWeight: 700,
// // //                 background: color,
// // //                 color: "#fff",
// // //                 padding: "1px 5px",
// // //                 borderRadius: "10px",
// // //               }}
// // //             >
// // //               ON
// // //             </span>
// // //           )}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // // ─── Table styles ─────────────────────────────────────────────────────────────
// // // const th = {
// // //   padding: "10px 14px",
// // //   fontSize: "11px",
// // //   fontWeight: 700,
// // //   color: "#94a3b8",
// // //   textTransform: "uppercase",
// // //   letterSpacing: "0.06em",
// // //   textAlign: "left",
// // //   background: "#f8fafc",
// // //   whiteSpace: "nowrap",
// // // };
// // // const td = { padding: "12px 14px", fontSize: "13px", color: "#374151" };

// // // // ─── Attendance Row ───────────────────────────────────────────────────────────
// // // function AttendanceRow({ record, isFirst, showEmployee }) {
// // //   const hours =
// // //     record.total_hours ?? calcHours(record.start_time, record.end_time);
// // //   return (
// // //     <tr
// // //       style={{
// // //         borderTop: isFirst ? "none" : "1px solid #f1f5f9",
// // //         transition: "background 0.15s",
// // //       }}
// // //       onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
// // //       onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
// // //     >
// // //       <td style={td}>{fmtDate(record.date)}</td>
// // //       {showEmployee && (
// // //         <td style={{ ...td, fontWeight: 600, color: "#1e293b" }}>
// // //           {record.employee_name || `#${record.employee}`}
// // //         </td>
// // //       )}
// // //       <td style={td}>
// // //         <StatusBadge record={record} />
// // //       </td>
// // //       <td style={{ ...td, color: "#10b981", fontWeight: 600 }}>
// // //         {record.start_time ? fmtTime(record.start_time) : "—"}
// // //       </td>
// // //       <td style={{ ...td, color: "#ef4444", fontWeight: 600 }}>
// // //         {record.end_time ? fmtTime(record.end_time) : "—"}
// // //       </td>
// // //       <td
// // //         style={{ ...td, fontWeight: 700, color: hours ? "#6366f1" : "#94a3b8" }}
// // //       >
// // //         {hours ? `${hours}h` : "—"}
// // //       </td>
// // //     </tr>
// // //   );
// // // }

// // // // ─── Skeleton ─────────────────────────────────────────────────────────────────
// // // function TableSkeleton({ rows = 5, cols = 6 }) {
// // //   const widths = ["90px", "100px", "70px", "60px", "60px", "45px"];
// // //   return (
// // //     <>
// // //       <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
// // //       {Array.from({ length: rows }).map((_, i) => (
// // //         <tr
// // //           key={i}
// // //           style={{ borderTop: i === 0 ? "none" : "1px solid #f1f5f9" }}
// // //         >
// // //           {Array.from({ length: cols }).map((_, j) => (
// // //             <td key={j} style={td}>
// // //               <div
// // //                 style={{
// // //                   height: "13px",
// // //                   width: widths[j] || "60px",
// // //                   borderRadius: "6px",
// // //                   background:
// // //                     "linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%)",
// // //                   backgroundSize: "200% 100%",
// // //                   animation: "shimmer 1.4s infinite",
// // //                 }}
// // //               />
// // //             </td>
// // //           ))}
// // //         </tr>
// // //       ))}
// // //     </>
// // //   );
// // // }

// // // // ─── Tab pill ─────────────────────────────────────────────────────────────────
// // // function Tab({ label, active, onClick }) {
// // //   return (
// // //     <button
// // //       onClick={onClick}
// // //       style={{
// // //         padding: "7px 18px",
// // //         fontSize: "13px",
// // //         fontWeight: 600,
// // //         borderRadius: "8px",
// // //         border: "none",
// // //         cursor: "pointer",
// // //         transition: "all 0.18s",
// // //         background: active ? "#6366f1" : "transparent",
// // //         color: active ? "#fff" : "#64748b",
// // //         boxShadow: active ? "0 2px 8px #6366f130" : "none",
// // //       }}
// // //     >
// // //       {label}
// // //     </button>
// // //   );
// // // }

// // // const inputStyle = {
// // //   border: "1px solid #cbd5e1",
// // //   borderRadius: "8px",
// // //   padding: "6px 10px",
// // //   fontSize: "13px",
// // //   color: "#374151",
// // //   background: "#fff",
// // //   outline: "none",
// // //   cursor: "pointer",
// // //   height: "34px",
// // // };

// // // // ─── Status filter meta ───────────────────────────────────────────────────────
// // // const STATUS_FILTERS = [
// // //   { key: "present", label: "Present", color: "#10b981", icon: "✅" },
// // //   { key: "full", label: "Full Leave", color: "#ef4444", icon: "🏖️" },
// // //   { key: "half", label: "Half Leave", color: "#f59e0b", icon: "⏰" },
// // //   { key: "absent", label: "Absent", color: "#6b7280", icon: "❌" },
// // // ];

// // // // ─── Main Module ──────────────────────────────────────────────────────────────
// // // export default function AttendanceModule({
// // //   employee_id: propEmployeeId,
// // //   title,
// // //   employees: propEmployees,
// // // }) {
// // //   const dispatch = useDispatch();
// // //   const allList = useSelector(selectEmployeeAttendances);
// // //   const loading = useSelector(selectEmployeeAttendanceLoading);
// // //   const error = useSelector(selectEmployeeAttendanceError);

// // //   // ── View mode ─────────────────────────────────────────────────────────────
// // //   const [mode, setMode] = useState("today");
// // //   const [customDate, setCustomDate] = useState(todayStr());
// // //   const [startDate, setStartDate] = useState(todayStr());
// // //   const [endDate, setEndDate] = useState(todayStr());

// // //   // ── Status filter (client-side) ───────────────────────────────────────────
// // //   // "all" | "present" | "full" | "half" | "absent"
// // //   const [statusFilter, setStatusFilter] = useState("all");

// // //   // ── Employee dropdown ─────────────────────────────────────────────────────
// // //   const [employees, setEmployees] = useState(propEmployees || []);
// // //   const [selectedEmpId, setSelectedEmpId] = useState(propEmployeeId || "");
// // //   const [empLoading, setEmpLoading] = useState(false);

// // //   useEffect(() => {
// // //     if (propEmployeeId || (propEmployees && propEmployees.length > 0)) return;
// // //     setEmpLoading(true);
// // //     axiosInstance
// // //       .get("/employee/")
// // //       .then((res) => {
// // //         const list = Array.isArray(res.data)
// // //           ? res.data
// // //           : (res.data?.data ?? res.data?.results ?? []);
// // //         setEmployees(list);
// // //       })
// // //       .catch(() => setEmployees([]))
// // //       .finally(() => setEmpLoading(false));
// // //   }, [propEmployeeId, propEmployees]);

// // //   // ── Build API payload ─────────────────────────────────────────────────────
// // //   const buildPayload = useCallback(() => {
// // //     const base = {};
// // //     const eid = propEmployeeId || selectedEmpId;
// // //     if (eid) base.employee_id = eid;

// // //     const now = new Date();
// // //     switch (mode) {
// // //       case "today":
// // //         return { ...base, date: todayStr() };
// // //       case "month":
// // //         return { ...base, month: now.getMonth() + 1, year: now.getFullYear() };
// // //       case "date":
// // //         return customDate ? { ...base, date: customDate } : base;
// // //       case "range":
// // //         return startDate && endDate
// // //           ? { ...base, start_date: startDate, end_date: endDate }
// // //           : base;
// // //       default:
// // //         return base;
// // //     }
// // //   }, [mode, customDate, startDate, endDate, propEmployeeId, selectedEmpId]);

// // //   // ── Fetch ─────────────────────────────────────────────────────────────────
// // //   useEffect(() => {
// // //     if (mode === "range" && (!startDate || !endDate)) return;
// // //     if (mode === "date" && !customDate) return;
// // //     dispatch(getEmployeeAttendances(buildPayload()));
// // //   }, [buildPayload, dispatch]);

// // //   // Reset status filter when date range / employee changes
// // //   useEffect(() => {
// // //     setStatusFilter("all");
// // //   }, [mode, customDate, startDate, endDate, selectedEmpId, propEmployeeId]);

// // //   // ── Raw list ──────────────────────────────────────────────────────────────
// // //   const rawList = Array.isArray(allList) ? allList : [];

// // //   // ── Stats — always computed from full rawList ─────────────────────────────
// // //   const stats = {
// // //     present: rawList.filter((r) => r.status && !r.full_leave && !r.half_leave)
// // //       .length,
// // //     full: rawList.filter((r) => r.full_leave).length,
// // //     half: rawList.filter((r) => r.half_leave).length,
// // //     absent: rawList.filter((r) => !r.status).length,
// // //     avgHours: rawList.length
// // //       ? (
// // //           rawList.reduce((s, r) => s + (r.total_hours || 0), 0) / rawList.length
// // //         ).toFixed(1)
// // //       : "0.0",
// // //   };

// // //   // ── Apply client-side status filter ──────────────────────────────────────
// // //   const displayList = rawList.filter((r) => {
// // //     switch (statusFilter) {
// // //       case "present":
// // //         return r.status && !r.full_leave && !r.half_leave;
// // //       case "full":
// // //         return r.full_leave === true;
// // //       case "half":
// // //         return r.half_leave === true;
// // //       case "absent":
// // //         return !r.status;
// // //       default:
// // //         return true;
// // //     }
// // //   });

// // //   const showEmployeeCol = !propEmployeeId;

// // //   const rangeLabel = (() => {
// // //     const now = new Date();
// // //     if (mode === "today") return `Today — ${fmtDate(todayStr())}`;
// // //     if (mode === "month")
// // //       return `This Month — ${now.toLocaleString("en-IN", { month: "long", year: "numeric" })}`;
// // //     if (mode === "date") return `Date — ${fmtDate(customDate)}`;
// // //     if (mode === "range") return `${fmtDate(startDate)} → ${fmtDate(endDate)}`;
// // //     return "";
// // //   })();

// // //   const activeMeta = STATUS_FILTERS.find((f) => f.key === statusFilter);

// // //   return (
// // //     <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
// // //       <link
// // //         href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap"
// // //         rel="stylesheet"
// // //       />

// // //       {/* ── Header ───────────────────────────────────────────────────────── */}
// // //       <Box display="flex" alignItems="center" gap={1.5} mb={3}>
// // //         <Box
// // //           sx={{ width: 5, height: 32, bgcolor: "#D20000", borderRadius: 1 }}
// // //         />
// // //         <Typography variant="h5" fontWeight={800} color="#1a1a1a">
// // //           {title ||
// // //             (propEmployeeId ? "Employee Attendance" : "Attendance Records")}
// // //         </Typography>
// // //       </Box>

// // //       {/* ── Employee Dropdown ─────────────────────────────────────────────── */}
// // //       {!propEmployeeId && (
// // //         <div style={{ marginBottom: "16px" }}>
// // //           <label
// // //             style={{
// // //               fontSize: "12px",
// // //               fontWeight: 700,
// // //               color: "#64748b",
// // //               display: "block",
// // //               marginBottom: "6px",
// // //             }}
// // //           >
// // //             EMPLOYEE
// // //           </label>
// // //           <select
// // //             value={selectedEmpId}
// // //             onChange={(e) => setSelectedEmpId(e.target.value)}
// // //             style={{ ...inputStyle, minWidth: "220px" }}
// // //           >
// // //             <option value="">All Employees</option>
// // //             {empLoading ? (
// // //               <option disabled>Loading…</option>
// // //             ) : (
// // //               employees.map((emp) => (
// // //                 <option key={emp.id} value={emp.id}>
// // //                   {emp.name ||
// // //                     emp.employee_name ||
// // //                     emp.full_name ||
// // //                     `Employee #${emp.id}`}
// // //                 </option>
// // //               ))
// // //             )}
// // //           </select>
// // //         </div>
// // //       )}

// // //       {/* ── Date Tabs ─────────────────────────────────────────────────────── */}
// // //       <div
// // //         style={{
// // //           display: "flex",
// // //           alignItems: "center",
// // //           gap: "6px",
// // //           background: "#f1f5f9",
// // //           borderRadius: "10px",
// // //           padding: "5px",
// // //           marginBottom: "20px",
// // //           width: "fit-content",
// // //           flexWrap: "wrap",
// // //         }}
// // //       >
// // //         <Tab
// // //           label="Today"
// // //           active={mode === "today"}
// // //           onClick={() => setMode("today")}
// // //         />
// // //         <Tab
// // //           label="This Month"
// // //           active={mode === "month"}
// // //           onClick={() => setMode("month")}
// // //         />
// // //         <Tab
// // //           label="By Date"
// // //           active={mode === "date"}
// // //           onClick={() => setMode("date")}
// // //         />
// // //         <Tab
// // //           label="Date Range"
// // //           active={mode === "range"}
// // //           onClick={() => setMode("range")}
// // //         />

// // //         {mode === "date" && (
// // //           <input
// // //             type="date"
// // //             value={customDate}
// // //             max={todayStr()}
// // //             onChange={(e) => setCustomDate(e.target.value || todayStr())}
// // //             style={inputStyle}
// // //           />
// // //         )}

// // //         {mode === "range" && (
// // //           <>
// // //             <input
// // //               type="date"
// // //               value={startDate}
// // //               max={endDate || todayStr()}
// // //               onChange={(e) => {
// // //                 const v = e.target.value || todayStr();
// // //                 setStartDate(v);
// // //                 if (endDate && v > endDate) setEndDate(v);
// // //               }}
// // //               style={inputStyle}
// // //             />
// // //             <span
// // //               style={{ fontSize: "13px", color: "#64748b", fontWeight: 600 }}
// // //             >
// // //               to
// // //             </span>
// // //             <input
// // //               type="date"
// // //               value={endDate}
// // //               min={startDate || undefined}
// // //               max={todayStr()}
// // //               onChange={(e) => {
// // //                 const v = e.target.value || todayStr();
// // //                 setEndDate(v);
// // //                 if (startDate && v < startDate) setStartDate(v);
// // //               }}
// // //               style={inputStyle}
// // //             />
// // //           </>
// // //         )}
// // //       </div>

// // //       {/* ── Error ────────────────────────────────────────────────────────── */}
// // //       {error && (
// // //         <div
// // //           style={{
// // //             background: "#fef2f2",
// // //             border: "1px solid #fecaca",
// // //             borderRadius: "10px",
// // //             padding: "14px 18px",
// // //             color: "#dc2626",
// // //             fontSize: "14px",
// // //             marginBottom: "16px",
// // //           }}
// // //         >
// // //           ⚠️ {error}
// // //         </div>
// // //       )}

// // //       {/* ── Stat Cards — click to filter ──────────────────────────────────── */}
// // //       <div
// // //         style={{
// // //           display: "flex",
// // //           gap: "12px",
// // //           flexWrap: "wrap",
// // //           marginBottom: "8px",
// // //         }}
// // //       >
// // //         <StatCard
// // //           label="Present"
// // //           value={stats.present}
// // //           icon="✅"
// // //           color="#10b981"
// // //           active={statusFilter === "present"}
// // //           onClick={() =>
// // //             setStatusFilter((f) => (f === "present" ? "all" : "present"))
// // //           }
// // //         />
// // //         <StatCard
// // //           label="Full Leave"
// // //           value={stats.full}
// // //           icon="🏖️"
// // //           color="#ef4444"
// // //           active={statusFilter === "full"}
// // //           onClick={() =>
// // //             setStatusFilter((f) => (f === "full" ? "all" : "full"))
// // //           }
// // //         />
// // //         <StatCard
// // //           label="Half Leave"
// // //           value={stats.half}
// // //           icon="⏰"
// // //           color="#f59e0b"
// // //           active={statusFilter === "half"}
// // //           onClick={() =>
// // //             setStatusFilter((f) => (f === "half" ? "all" : "half"))
// // //           }
// // //         />
// // //         <StatCard
// // //           label="Absent"
// // //           value={stats.absent}
// // //           icon="❌"
// // //           color="#6b7280"
// // //           active={statusFilter === "absent"}
// // //           onClick={() =>
// // //             setStatusFilter((f) => (f === "absent" ? "all" : "absent"))
// // //           }
// // //         />
// // //         <StatCard
// // //           label="Avg Hours"
// // //           value={`${stats.avgHours}h`}
// // //           icon="⏱️"
// // //           color="#6366f1"
// // //         />
// // //       </div>

// // //       {/* ── Hint text under cards ─────────────────────────────────────────── */}
// // //       <p
// // //         style={{
// // //           fontSize: "11px",
// // //           color: "#94a3b8",
// // //           margin: "0 0 16px",
// // //           fontWeight: 500,
// // //         }}
// // //       >
// // //         💡 Click a card to filter the table by that status. Click again to
// // //         clear.
// // //       </p>

// // //       {/* ── Active filter pill ────────────────────────────────────────────── */}
// // //       {statusFilter !== "all" && activeMeta && (
// // //         <div
// // //           style={{
// // //             display: "flex",
// // //             alignItems: "center",
// // //             gap: "10px",
// // //             marginBottom: "14px",
// // //             padding: "8px 14px",
// // //             background: activeMeta.color + "0d",
// // //             border: `1px solid ${activeMeta.color}30`,
// // //             borderRadius: "10px",
// // //             width: "fit-content",
// // //           }}
// // //         >
// // //           <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>
// // //             Showing:
// // //           </span>
// // //           <span
// // //             style={{
// // //               display: "inline-flex",
// // //               alignItems: "center",
// // //               gap: "5px",
// // //               color: activeMeta.color,
// // //               fontSize: "13px",
// // //               fontWeight: 700,
// // //             }}
// // //           >
// // //             {activeMeta.icon} {activeMeta.label}
// // //           </span>
// // //           <span style={{ fontSize: "12px", color: "#94a3b8" }}>
// // //             ({displayList.length} of {rawList.length} records)
// // //           </span>
// // //           <button
// // //             onClick={() => setStatusFilter("all")}
// // //             style={{
// // //               background: activeMeta.color + "20",
// // //               border: `1px solid ${activeMeta.color}40`,
// // //               borderRadius: "6px",
// // //               cursor: "pointer",
// // //               color: activeMeta.color,
// // //               fontSize: "12px",
// // //               fontWeight: 700,
// // //               padding: "2px 8px",
// // //             }}
// // //           >
// // //             Clear ×
// // //           </button>
// // //         </div>
// // //       )}

// // //       {/* ── Table ────────────────────────────────────────────────────────── */}
// // //       <div
// // //         style={{
// // //           background: "#fff",
// // //           border: "1px solid #e2e8f0",
// // //           borderRadius: "12px",
// // //           overflow: "hidden",
// // //           boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
// // //         }}
// // //       >
// // //         <div
// // //           style={{
// // //             padding: "14px 18px",
// // //             borderBottom: "1px solid #e2e8f0",
// // //             display: "flex",
// // //             justifyContent: "space-between",
// // //             alignItems: "center",
// // //             flexWrap: "wrap",
// // //             gap: "8px",
// // //           }}
// // //         >
// // //           <p
// // //             style={{
// // //               margin: 0,
// // //               fontSize: "14px",
// // //               fontWeight: 700,
// // //               color: "#1e293b",
// // //             }}
// // //           >
// // //             {rangeLabel}
// // //             {statusFilter !== "all" && activeMeta && (
// // //               <span
// // //                 style={{
// // //                   marginLeft: "8px",
// // //                   fontSize: "12px",
// // //                   fontWeight: 600,
// // //                   color: activeMeta.color,
// // //                   background: activeMeta.color + "12",
// // //                   padding: "2px 8px",
// // //                   borderRadius: "10px",
// // //                 }}
// // //               >
// // //                 {activeMeta.icon} {activeMeta.label} only
// // //               </span>
// // //             )}
// // //           </p>
// // //           <span
// // //             style={{
// // //               background: "#6366f110",
// // //               color: "#6366f1",
// // //               fontSize: "12px",
// // //               fontWeight: 700,
// // //               padding: "4px 12px",
// // //               borderRadius: "20px",
// // //             }}
// // //           >
// // //             {loading
// // //               ? "…"
// // //               : `${displayList.length} record${displayList.length !== 1 ? "s" : ""}`}
// // //           </span>
// // //         </div>

// // //         <div style={{ overflowX: "auto" }}>
// // //           <table style={{ width: "100%", borderCollapse: "collapse" }}>
// // //             <thead>
// // //               <tr>
// // //                 <th style={th}>Date</th>
// // //                 {showEmployeeCol && <th style={th}>Employee</th>}
// // //                 <th style={th}>Status</th>
// // //                 <th style={th}>Check In</th>
// // //                 <th style={th}>Check Out</th>
// // //                 <th style={th}>Hours</th>
// // //               </tr>
// // //             </thead>
// // //             <tbody>
// // //               {loading ? (
// // //                 <TableSkeleton rows={5} cols={showEmployeeCol ? 6 : 5} />
// // //               ) : displayList.length === 0 ? (
// // //                 <tr>
// // //                   <td
// // //                     colSpan={showEmployeeCol ? 6 : 5}
// // //                     style={{
// // //                       padding: "48px",
// // //                       textAlign: "center",
// // //                       color: "#94a3b8",
// // //                       fontSize: "14px",
// // //                     }}
// // //                   >
// // //                     {statusFilter !== "all" && activeMeta
// // //                       ? `No "${activeMeta.label}" records found for this period.`
// // //                       : "No attendance records found."}
// // //                   </td>
// // //                 </tr>
// // //               ) : (
// // //                 displayList.map((r, i) => (
// // //                   <AttendanceRow
// // //                     key={r.id}
// // //                     record={r}
// // //                     isFirst={i === 0}
// // //                     showEmployee={showEmployeeCol}
// // //                   />
// // //                 ))
// // //               )}
// // //             </tbody>
// // //           </table>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }
// // import { useEffect, useState, useCallback } from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import { getEmployeeAttendances } from "../../feature/employeeAttendance/employeeAttendanceThunks";
// // import {
// //   selectEmployeeAttendances,
// //   selectEmployeeAttendanceLoading,
// //   selectEmployeeAttendanceError,
// // } from "../../feature/employeeAttendance/employeeAttendanceSelector";
// // import { Box, Typography } from "@mui/material";
// // import axiosInstance from "../../api/axiosInstance";

// // // ─── Helpers ──────────────────────────────────────────────────────────────────
// // function todayStr() {
// //   return new Date().toISOString().split("T")[0];
// // }
// // function fmtTime(iso) {
// //   if (!iso) return "—";
// //   const d = new Date(iso);
// //   if (isNaN(d)) return "—";
// //   return d.toLocaleTimeString([], {
// //     hour: "2-digit",
// //     minute: "2-digit",
// //     hour12: true,
// //   });
// // }
// // function fmtDate(str) {
// //   if (!str) return "—";
// //   const d = new Date(str);
// //   if (isNaN(d)) return str;
// //   return d.toLocaleDateString("en-IN", {
// //     day: "2-digit",
// //     month: "short",
// //     year: "numeric",
// //   });
// // }
// // function calcHours(start, end) {
// //   if (!start || !end) return null;
// //   const diff = (new Date(end) - new Date(start)) / 3600000;
// //   return diff > 0 ? diff.toFixed(1) : null;
// // }

// // // ─── Status filter → API param mapper ────────────────────────────────────────
// // /**
// //  * Returns extra API params for a given status filter key.
// //  * "all" → no extra params
// //  * "present"  → { status: true,  full_leave: false, half_leave: false }
// //  * "full"     → { full_leave: true }
// //  * "half"     → { half_leave: true }
// //  * "absent"   → { status: false }
// //  */
// // function statusParams(filterKey) {
// //   switch (filterKey) {
// //     case "present":
// //       return { status: true, full_leave: false, half_leave: false };
// //     case "full":
// //       return { full_leave: true };
// //     case "half":
// //       return { half_leave: true };
// //     case "absent":
// //       return { status: false };
// //     default:
// //       return {};
// //   }
// // }

// // // ─── Status filter meta ───────────────────────────────────────────────────────
// // const STATUS_FILTERS = [
// //   { key: "present", label: "Present", color: "#10b981", icon: "✅" },
// //   { key: "full", label: "Full Leave", color: "#ef4444", icon: "🏖️" },
// //   { key: "half", label: "Half Leave", color: "#f59e0b", icon: "⏰" },
// //   { key: "absent", label: "Absent", color: "#6b7280", icon: "❌" },
// // ];

// // // ─── Status badge ─────────────────────────────────────────────────────────────
// // function Badge({ label, color, bg }) {
// //   return (
// //     <span
// //       style={{
// //         background: bg,
// //         color,
// //         fontSize: "11px",
// //         fontWeight: 700,
// //         padding: "3px 10px",
// //         borderRadius: "20px",
// //         whiteSpace: "nowrap",
// //       }}
// //     >
// //       {label}
// //     </span>
// //   );
// // }
// // function StatusBadge({ record }) {
// //   if (record.full_leave)
// //     return <Badge label="Full Leave" color="#ef4444" bg="#fef2f2" />;
// //   if (record.half_leave)
// //     return <Badge label="Half Leave" color="#f59e0b" bg="#fffbeb" />;
// //   if (record.status)
// //     return <Badge label="Present" color="#10b981" bg="#f0fdf4" />;
// //   return <Badge label="Absent" color="#6b7280" bg="#f3f4f6" />;
// // }

// // // ─── Stat Card ────────────────────────────────────────────────────────────────
// // function StatCard({ label, value, icon, color, active, onClick, loading }) {
// //   return (
// //     <div
// //       onClick={onClick}
// //       title={onClick ? `Click to filter by ${label}` : undefined}
// //       style={{
// //         background: active ? color + "12" : "#fff",
// //         border: `1.5px solid ${active ? color : "#e2e8f0"}`,
// //         borderRadius: "12px",
// //         padding: "16px 20px",
// //         display: "flex",
// //         alignItems: "center",
// //         gap: "14px",
// //         flex: "1 1 130px",
// //         boxShadow: active
// //           ? `0 2px 12px ${color}28`
// //           : "0 1px 4px rgba(0,0,0,0.05)",
// //         cursor: onClick ? "pointer" : "default",
// //         transition: "all 0.18s",
// //         userSelect: "none",
// //         transform: active ? "translateY(-1px)" : "none",
// //         opacity: loading ? 0.6 : 1,
// //       }}
// //     >
// //       <div
// //         style={{
// //           width: "42px",
// //           height: "42px",
// //           borderRadius: "10px",
// //           background: color + "18",
// //           display: "flex",
// //           alignItems: "center",
// //           justifyContent: "center",
// //           fontSize: "20px",
// //           flexShrink: 0,
// //         }}
// //       >
// //         {loading && active ? "⏳" : icon}
// //       </div>
// //       <div>
// //         <p
// //           style={{
// //             margin: 0,
// //             fontSize: "22px",
// //             fontWeight: 800,
// //             color: active ? color : "#0f172a",
// //           }}
// //         >
// //           {value}
// //         </p>
// //         <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
// //           <p
// //             style={{
// //               margin: 0,
// //               fontSize: "12px",
// //               color: active ? color : "#64748b",
// //               fontWeight: 600,
// //             }}
// //           >
// //             {label}
// //           </p>
// //           {active && (
// //             <span
// //               style={{
// //                 fontSize: "9px",
// //                 fontWeight: 700,
// //                 background: color,
// //                 color: "#fff",
// //                 padding: "1px 5px",
// //                 borderRadius: "10px",
// //               }}
// //             >
// //               ON
// //             </span>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // ─── Table styles ─────────────────────────────────────────────────────────────
// // const th = {
// //   padding: "10px 14px",
// //   fontSize: "11px",
// //   fontWeight: 700,
// //   color: "#94a3b8",
// //   textTransform: "uppercase",
// //   letterSpacing: "0.06em",
// //   textAlign: "left",
// //   background: "#f8fafc",
// //   whiteSpace: "nowrap",
// // };
// // const td = { padding: "12px 14px", fontSize: "13px", color: "#374151" };

// // // ─── Attendance Row ───────────────────────────────────────────────────────────
// // function AttendanceRow({ record, isFirst, showEmployee }) {
// //   const hours =
// //     record.total_hours ?? calcHours(record.start_time, record.end_time);
// //   return (
// //     <tr
// //       style={{
// //         borderTop: isFirst ? "none" : "1px solid #f1f5f9",
// //         transition: "background 0.15s",
// //       }}
// //       onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
// //       onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
// //     >
// //       <td style={td}>{fmtDate(record.date)}</td>
// //       {showEmployee && (
// //         <td style={{ ...td, fontWeight: 600, color: "#1e293b" }}>
// //           {record.employee_name || `#${record.employee}`}
// //         </td>
// //       )}
// //       <td style={td}>
// //         <StatusBadge record={record} />
// //       </td>
// //       <td style={{ ...td, color: "#10b981", fontWeight: 600 }}>
// //         {record.start_time ? fmtTime(record.start_time) : "—"}
// //       </td>
// //       <td style={{ ...td, color: "#ef4444", fontWeight: 600 }}>
// //         {record.end_time ? fmtTime(record.end_time) : "—"}
// //       </td>
// //       <td
// //         style={{ ...td, fontWeight: 700, color: hours ? "#6366f1" : "#94a3b8" }}
// //       >
// //         {hours ? `${hours}h` : "—"}
// //       </td>
// //     </tr>
// //   );
// // }

// // // ─── Skeleton ─────────────────────────────────────────────────────────────────
// // function TableSkeleton({ rows = 5, cols = 6 }) {
// //   const widths = ["90px", "100px", "70px", "60px", "60px", "45px"];
// //   return (
// //     <>
// //       <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
// //       {Array.from({ length: rows }).map((_, i) => (
// //         <tr
// //           key={i}
// //           style={{ borderTop: i === 0 ? "none" : "1px solid #f1f5f9" }}
// //         >
// //           {Array.from({ length: cols }).map((_, j) => (
// //             <td key={j} style={td}>
// //               <div
// //                 style={{
// //                   height: "13px",
// //                   width: widths[j] || "60px",
// //                   borderRadius: "6px",
// //                   background:
// //                     "linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%)",
// //                   backgroundSize: "200% 100%",
// //                   animation: "shimmer 1.4s infinite",
// //                 }}
// //               />
// //             </td>
// //           ))}
// //         </tr>
// //       ))}
// //     </>
// //   );
// // }

// // // ─── Tab pill ─────────────────────────────────────────────────────────────────
// // function Tab({ label, active, onClick }) {
// //   return (
// //     <button
// //       onClick={onClick}
// //       style={{
// //         padding: "7px 18px",
// //         fontSize: "13px",
// //         fontWeight: 600,
// //         borderRadius: "8px",
// //         border: "none",
// //         cursor: "pointer",
// //         transition: "all 0.18s",
// //         background: active ? "#6366f1" : "transparent",
// //         color: active ? "#fff" : "#64748b",
// //         boxShadow: active ? "0 2px 8px #6366f130" : "none",
// //       }}
// //     >
// //       {label}
// //     </button>
// //   );
// // }

// // const inputStyle = {
// //   border: "1px solid #cbd5e1",
// //   borderRadius: "8px",
// //   padding: "6px 10px",
// //   fontSize: "13px",
// //   color: "#374151",
// //   background: "#fff",
// //   outline: "none",
// //   cursor: "pointer",
// //   height: "34px",
// // };

// // // ─── Main Module ──────────────────────────────────────────────────────────────
// // export default function AttendanceModule({
// //   employee_id: propEmployeeId,
// //   title,
// //   employees: propEmployees,
// // }) {
// //   const dispatch = useDispatch();
// //   const allList = useSelector(selectEmployeeAttendances);
// //   const loading = useSelector(selectEmployeeAttendanceLoading);
// //   const error = useSelector(selectEmployeeAttendanceError);

// //   // ── View mode ─────────────────────────────────────────────────────────────
// //   const [mode, setMode] = useState("today");
// //   const [customDate, setCustomDate] = useState(todayStr());
// //   const [startDate, setStartDate] = useState(todayStr());
// //   const [endDate, setEndDate] = useState(todayStr());

// //   // ── Status filter — "all" | "present" | "full" | "half" | "absent" ───────
// //   const [statusFilter, setStatusFilter] = useState("all");

// //   // ── Employee dropdown ─────────────────────────────────────────────────────
// //   const [employees, setEmployees] = useState(propEmployees || []);
// //   const [selectedEmpId, setSelectedEmpId] = useState(propEmployeeId || "");
// //   const [empLoading, setEmpLoading] = useState(false);

// //   useEffect(() => {
// //     if (propEmployeeId || (propEmployees && propEmployees.length > 0)) return;
// //     setEmpLoading(true);
// //     axiosInstance
// //       .get("/employee/")
// //       .then((res) => {
// //         const list = Array.isArray(res.data)
// //           ? res.data
// //           : (res.data?.data ?? res.data?.results ?? []);
// //         setEmployees(list);
// //       })
// //       .catch(() => setEmployees([]))
// //       .finally(() => setEmpLoading(false));
// //   }, [propEmployeeId, propEmployees]);

// //   // ── Build API payload ─────────────────────────────────────────────────────
// //   // Combines: date/range params + employee_id + status filter params
// //   const buildPayload = useCallback(() => {
// //     const eid = propEmployeeId || selectedEmpId;
// //     const base = eid ? { employee_id: eid } : {};

// //     // Date params
// //     const now = new Date();
// //     let dateParams = {};
// //     switch (mode) {
// //       case "today":
// //         dateParams = { date: todayStr() };
// //         break;
// //       case "month":
// //         dateParams = { month: now.getMonth() + 1, year: now.getFullYear() };
// //         break;
// //       case "date":
// //         dateParams = customDate ? { date: customDate } : {};
// //         break;
// //       case "range":
// //         dateParams =
// //           startDate && endDate
// //             ? { start_date: startDate, end_date: endDate }
// //             : {};
// //         break;
// //       default:
// //         dateParams = {};
// //     }

// //     // Status filter params — merged in so every fetch includes the filter
// //     const filterParams = statusParams(statusFilter);

// //     return { ...base, ...dateParams, ...filterParams };
// //   }, [
// //     mode,
// //     customDate,
// //     startDate,
// //     endDate,
// //     propEmployeeId,
// //     selectedEmpId,
// //     statusFilter,
// //   ]);
// //   //                                                                          ^^^^^^^^^^^^
// //   //                              statusFilter is a dependency so changing it re-triggers fetch

// //   // ── Single useEffect drives ALL fetches ───────────────────────────────────
// //   useEffect(() => {
// //     if (mode === "range" && (!startDate || !endDate)) return;
// //     if (mode === "date" && !customDate) return;
// //     dispatch(getEmployeeAttendances(buildPayload()));
// //   }, [buildPayload, dispatch]);
// //   // buildPayload is memoized via useCallback — it changes whenever any of its
// //   // deps change (mode, dates, employee, or statusFilter), which triggers this effect.

// //   const rawList = Array.isArray(allList) ? allList : [];

// //   // ── Stats — always from rawList (reflects current filter result) ──────────
// //   // When a filter is active, rawList IS already the filtered result from API,
// //   // so we count from it directly.
// //   const present = rawList.filter(
// //     (r) => r.status && !r.full_leave && !r.half_leave,
// //   ).length;
// //   const fullCount = rawList.filter((r) => r.full_leave).length;
// //   const halfCount = rawList.filter((r) => r.half_leave).length;
// //   const absent = rawList.filter((r) => !r.status).length;
// //   const avgHours = rawList.length
// //     ? (
// //         rawList.reduce((s, r) => s + (r.total_hours || 0), 0) / rawList.length
// //       ).toFixed(1)
// //     : "0.0";

// //   const showEmployeeCol = !propEmployeeId;
// //   const activeMeta = STATUS_FILTERS.find((f) => f.key === statusFilter);

// //   const rangeLabel = (() => {
// //     const now = new Date();
// //     if (mode === "today") return `Today — ${fmtDate(todayStr())}`;
// //     if (mode === "month")
// //       return `This Month — ${now.toLocaleString("en-IN", { month: "long", year: "numeric" })}`;
// //     if (mode === "date") return `Date — ${fmtDate(customDate)}`;
// //     if (mode === "range") return `${fmtDate(startDate)} → ${fmtDate(endDate)}`;
// //     return "";
// //   })();

// //   // ── Status filter toggle — resets when date/employee context changes ──────
// //   const handleStatusFilter = (key) => {
// //     setStatusFilter((prev) => (prev === key ? "all" : key));
// //   };
// //   // When switching tabs or employees, reset filter to avoid confusion
// //   const handleModeChange = (newMode) => {
// //     setMode(newMode);
// //     setStatusFilter("all");
// //   };
// //   const handleEmpChange = (id) => {
// //     setSelectedEmpId(id);
// //     setStatusFilter("all");
// //   };

// //   return (
// //     <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
// //       <link
// //         href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap"
// //         rel="stylesheet"
// //       />

// //       {/* ── Header ───────────────────────────────────────────────────────── */}
// //       <Box display="flex" alignItems="center" gap={1.5} mb={3}>
// //         <Box
// //           sx={{ width: 5, height: 32, bgcolor: "#D20000", borderRadius: 1 }}
// //         />
// //         <Typography variant="h5" fontWeight={800} color="#1a1a1a">
// //           {title ||
// //             (propEmployeeId ? "Employee Attendance" : "Attendance Records")}
// //         </Typography>
// //       </Box>

// //       {/* ── Employee Dropdown ─────────────────────────────────────────────── */}
// //       {!propEmployeeId && (
// //         <div style={{ marginBottom: "16px" }}>
// //           <label
// //             style={{
// //               fontSize: "12px",
// //               fontWeight: 700,
// //               color: "#64748b",
// //               display: "block",
// //               marginBottom: "6px",
// //             }}
// //           >
// //             EMPLOYEE
// //           </label>
// //           <select
// //             value={selectedEmpId}
// //             onChange={(e) => handleEmpChange(e.target.value)}
// //             style={{ ...inputStyle, minWidth: "220px" }}
// //           >
// //             <option value="">All Employees</option>
// //             {empLoading ? (
// //               <option disabled>Loading…</option>
// //             ) : (
// //               employees.map((emp) => (
// //                 <option key={emp.id} value={emp.id}>
// //                   {emp.name ||
// //                     emp.employee_name ||
// //                     emp.full_name ||
// //                     `Employee #${emp.id}`}
// //                 </option>
// //               ))
// //             )}
// //           </select>
// //         </div>
// //       )}

// //       {/* ── Date Tabs ─────────────────────────────────────────────────────── */}
// //       <div
// //         style={{
// //           display: "flex",
// //           alignItems: "center",
// //           gap: "6px",
// //           background: "#f1f5f9",
// //           borderRadius: "10px",
// //           padding: "5px",
// //           marginBottom: "20px",
// //           width: "fit-content",
// //           flexWrap: "wrap",
// //         }}
// //       >
// //         <Tab
// //           label="Today"
// //           active={mode === "today"}
// //           onClick={() => handleModeChange("today")}
// //         />
// //         <Tab
// //           label="This Month"
// //           active={mode === "month"}
// //           onClick={() => handleModeChange("month")}
// //         />
// //         <Tab
// //           label="By Date"
// //           active={mode === "date"}
// //           onClick={() => handleModeChange("date")}
// //         />
// //         <Tab
// //           label="Date Range"
// //           active={mode === "range"}
// //           onClick={() => handleModeChange("range")}
// //         />

// //         {mode === "date" && (
// //           <input
// //             type="date"
// //             value={customDate}
// //             max={todayStr()}
// //             onChange={(e) => setCustomDate(e.target.value || todayStr())}
// //             style={inputStyle}
// //           />
// //         )}

// //         {mode === "range" && (
// //           <>
// //             <input
// //               type="date"
// //               value={startDate}
// //               max={endDate || todayStr()}
// //               onChange={(e) => {
// //                 const v = e.target.value || todayStr();
// //                 setStartDate(v);
// //                 if (endDate && v > endDate) setEndDate(v);
// //               }}
// //               style={inputStyle}
// //             />
// //             <span
// //               style={{ fontSize: "13px", color: "#64748b", fontWeight: 600 }}
// //             >
// //               to
// //             </span>
// //             <input
// //               type="date"
// //               value={endDate}
// //               min={startDate || undefined}
// //               max={todayStr()}
// //               onChange={(e) => {
// //                 const v = e.target.value || todayStr();
// //                 setEndDate(v);
// //                 if (startDate && v < startDate) setStartDate(v);
// //               }}
// //               style={inputStyle}
// //             />
// //           </>
// //         )}
// //       </div>

// //       {/* ── Error ────────────────────────────────────────────────────────── */}
// //       {error && (
// //         <div
// //           style={{
// //             background: "#fef2f2",
// //             border: "1px solid #fecaca",
// //             borderRadius: "10px",
// //             padding: "14px 18px",
// //             color: "#dc2626",
// //             fontSize: "14px",
// //             marginBottom: "16px",
// //           }}
// //         >
// //           ⚠️ {error}
// //         </div>
// //       )}

// //       {/* ── Stat Cards — click = API re-fetch with status filter ──────────── */}
// //       <div
// //         style={{
// //           display: "flex",
// //           gap: "12px",
// //           flexWrap: "wrap",
// //           marginBottom: "8px",
// //         }}
// //       >
// //         <StatCard
// //           label="Present"
// //           value={present}
// //           icon="✅"
// //           color="#10b981"
// //           loading={loading}
// //           active={statusFilter === "present"}
// //           onClick={() => handleStatusFilter("present")}
// //         />
// //         <StatCard
// //           label="Full Leave"
// //           value={fullCount}
// //           icon="🏖️"
// //           color="#ef4444"
// //           loading={loading}
// //           active={statusFilter === "full"}
// //           onClick={() => handleStatusFilter("full")}
// //         />
// //         <StatCard
// //           label="Half Leave"
// //           value={halfCount}
// //           icon="⏰"
// //           color="#f59e0b"
// //           loading={loading}
// //           active={statusFilter === "half"}
// //           onClick={() => handleStatusFilter("half")}
// //         />
// //         <StatCard
// //           label="Absent"
// //           value={absent}
// //           icon="❌"
// //           color="#6b7280"
// //           loading={loading}
// //           active={statusFilter === "absent"}
// //           onClick={() => handleStatusFilter("absent")}
// //         />
// //         <StatCard
// //           label="Avg Hours"
// //           value={`${avgHours}h`}
// //           icon="⏱️"
// //           color="#6366f1"
// //         />
// //       </div>

// //       {/* ── Hint ─────────────────────────────────────────────────────────── */}
// //       <p
// //         style={{
// //           fontSize: "11px",
// //           color: "#94a3b8",
// //           margin: "0 0 16px",
// //           fontWeight: 500,
// //         }}
// //       >
// //         💡 Click a card to filter — triggers a live API call. Click again to
// //         clear.
// //       </p>

// //       {/* ── Active filter pill ────────────────────────────────────────────── */}
// //       {statusFilter !== "all" && activeMeta && (
// //         <div
// //           style={{
// //             display: "flex",
// //             alignItems: "center",
// //             gap: "10px",
// //             marginBottom: "14px",
// //             padding: "8px 14px",
// //             background: activeMeta.color + "0d",
// //             border: `1px solid ${activeMeta.color}30`,
// //             borderRadius: "10px",
// //             width: "fit-content",
// //           }}
// //         >
// //           <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>
// //             API filtered by:
// //           </span>
// //           <span
// //             style={{
// //               display: "inline-flex",
// //               alignItems: "center",
// //               gap: "5px",
// //               color: activeMeta.color,
// //               fontSize: "13px",
// //               fontWeight: 700,
// //             }}
// //           >
// //             {activeMeta.icon} {activeMeta.label}
// //           </span>
// //           <span style={{ fontSize: "12px", color: "#94a3b8" }}>
// //             ({rawList.length} records)
// //           </span>
// //           <button
// //             onClick={() => setStatusFilter("all")}
// //             style={{
// //               background: activeMeta.color + "20",
// //               border: `1px solid ${activeMeta.color}40`,
// //               borderRadius: "6px",
// //               cursor: "pointer",
// //               color: activeMeta.color,
// //               fontSize: "12px",
// //               fontWeight: 700,
// //               padding: "2px 8px",
// //             }}
// //           >
// //             Clear ×
// //           </button>
// //         </div>
// //       )}

// //       {/* ── Table ────────────────────────────────────────────────────────── */}
// //       <div
// //         style={{
// //           background: "#fff",
// //           border: "1px solid #e2e8f0",
// //           borderRadius: "12px",
// //           overflow: "hidden",
// //           boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
// //         }}
// //       >
// //         <div
// //           style={{
// //             padding: "14px 18px",
// //             borderBottom: "1px solid #e2e8f0",
// //             display: "flex",
// //             justifyContent: "space-between",
// //             alignItems: "center",
// //             flexWrap: "wrap",
// //             gap: "8px",
// //           }}
// //         >
// //           <p
// //             style={{
// //               margin: 0,
// //               fontSize: "14px",
// //               fontWeight: 700,
// //               color: "#1e293b",
// //             }}
// //           >
// //             {rangeLabel}
// //             {statusFilter !== "all" && activeMeta && (
// //               <span
// //                 style={{
// //                   marginLeft: "8px",
// //                   fontSize: "12px",
// //                   fontWeight: 600,
// //                   color: activeMeta.color,
// //                   background: activeMeta.color + "12",
// //                   padding: "2px 8px",
// //                   borderRadius: "10px",
// //                 }}
// //               >
// //                 {activeMeta.icon} {activeMeta.label} only
// //               </span>
// //             )}
// //           </p>
// //           <span
// //             style={{
// //               background: "#6366f110",
// //               color: "#6366f1",
// //               fontSize: "12px",
// //               fontWeight: 700,
// //               padding: "4px 12px",
// //               borderRadius: "20px",
// //             }}
// //           >
// //             {loading
// //               ? "…"
// //               : `${rawList.length} record${rawList.length !== 1 ? "s" : ""}`}
// //           </span>
// //         </div>

// //         <div style={{ overflowX: "auto" }}>
// //           <table style={{ width: "100%", borderCollapse: "collapse" }}>
// //             <thead>
// //               <tr>
// //                 <th style={th}>Date</th>
// //                 {showEmployeeCol && <th style={th}>Employee</th>}
// //                 <th style={th}>Status</th>
// //                 <th style={th}>Check In</th>
// //                 <th style={th}>Check Out</th>
// //                 <th style={th}>Hours</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {loading ? (
// //                 <TableSkeleton rows={5} cols={showEmployeeCol ? 6 : 5} />
// //               ) : rawList.length === 0 ? (
// //                 <tr>
// //                   <td
// //                     colSpan={showEmployeeCol ? 6 : 5}
// //                     style={{
// //                       padding: "48px",
// //                       textAlign: "center",
// //                       color: "#94a3b8",
// //                       fontSize: "14px",
// //                     }}
// //                   >
// //                     {statusFilter !== "all" && activeMeta
// //                       ? `No "${activeMeta.label}" records found for this period.`
// //                       : "No attendance records found."}
// //                   </td>
// //                 </tr>
// //               ) : (
// //                 rawList.map((r, i) => (
// //                   <AttendanceRow
// //                     key={r.id}
// //                     record={r}
// //                     isFirst={i === 0}
// //                     showEmployee={showEmployeeCol}
// //                   />
// //                 ))
// //               )}
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// import { useEffect, useState, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getEmployeeAttendances } from "../../feature/employeeAttendance/employeeAttendanceThunks";
// import {
//   selectEmployeeAttendances,
//   selectEmployeeAttendanceLoading,
//   selectEmployeeAttendanceError,
// } from "../../feature/employeeAttendance/employeeAttendanceSelector";
// import { Box, Typography } from "@mui/material";
// import axiosInstance from "../../api/axiosInstance";

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// function todayStr() {
//   return new Date().toISOString().split("T")[0];
// }
// function fmtTime(iso) {
//   if (!iso) return "—";
//   const d = new Date(iso);
//   if (isNaN(d)) return "—";
//   return d.toLocaleTimeString([], {
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true,
//   });
// }
// function fmtDate(str) {
//   if (!str) return "—";
//   const d = new Date(str);
//   if (isNaN(d)) return str;
//   return d.toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// }
// function calcHours(start, end) {
//   if (!start || !end) return null;
//   const diff = (new Date(end) - new Date(start)) / 3600000;
//   return diff > 0 ? diff.toFixed(1) : null;
// }

// // ─── Status filter → API param mapper ────────────────────────────────────────
// /**
//  * Returns extra API params for a given status filter key.
//  * "all" → no extra params
//  * "present"  → { status: true,  full_leave: false, half_leave: false }
//  * "full"     → { full_leave: true }
//  * "half"     → { half_leave: true }
//  * "absent"   → { status: false }
//  */
// function statusParams(filterKey) {
//   switch (filterKey) {
//     case "present":
//       return { status: true, full_leave: false, half_leave: false };
//     case "full":
//       return { full_leave: true };
//     case "half":
//       return { half_leave: true };
//     case "absent":
//       return { status: false };
//     default:
//       return {};
//   }
// }

// // ─── Status filter meta ───────────────────────────────────────────────────────
// const STATUS_FILTERS = [
//   { key: "present", label: "Present", color: "#10b981", icon: "✅" },
//   { key: "full", label: "Full Leave", color: "#ef4444", icon: "🏖️" },
//   { key: "half", label: "Half Leave", color: "#f59e0b", icon: "⏰" },
//   { key: "absent", label: "Absent", color: "#6b7280", icon: "❌" },
// ];

// // ─── Status badge ─────────────────────────────────────────────────────────────
// function Badge({ label, color, bg }) {
//   return (
//     <span
//       style={{
//         background: bg,
//         color,
//         fontSize: "11px",
//         fontWeight: 700,
//         padding: "3px 10px",
//         borderRadius: "20px",
//         whiteSpace: "nowrap",
//       }}
//     >
//       {label}
//     </span>
//   );
// }
// function StatusBadge({ record }) {
//   if (record.full_leave)
//     return <Badge label="Full Leave" color="#ef4444" bg="#fef2f2" />;
//   if (record.half_leave)
//     return <Badge label="Half Leave" color="#f59e0b" bg="#fffbeb" />;
//   if (record.status)
//     return <Badge label="Present" color="#10b981" bg="#f0fdf4" />;
//   return <Badge label="Absent" color="#6b7280" bg="#f3f4f6" />;
// }

// // ─── Stat Card ────────────────────────────────────────────────────────────────
// function StatCard({ label, value, icon, color, active, onClick, loading }) {
//   return (
//     <div
//       onClick={onClick}
//       title={onClick ? `Click to filter by ${label}` : undefined}
//       style={{
//         background: active ? color + "12" : "#fff",
//         border: `1.5px solid ${active ? color : "#e2e8f0"}`,
//         borderRadius: "12px",
//         padding: "16px 20px",
//         display: "flex",
//         alignItems: "center",
//         gap: "14px",
//         flex: "1 1 130px",
//         boxShadow: active
//           ? `0 2px 12px ${color}28`
//           : "0 1px 4px rgba(0,0,0,0.05)",
//         cursor: onClick ? "pointer" : "default",
//         transition: "all 0.18s",
//         userSelect: "none",
//         transform: active ? "translateY(-1px)" : "none",
//         opacity: loading ? 0.6 : 1,
//       }}
//     >
//       <div
//         style={{
//           width: "42px",
//           height: "42px",
//           borderRadius: "10px",
//           background: color + "18",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           fontSize: "20px",
//           flexShrink: 0,
//         }}
//       >
//         {loading && active ? "⏳" : icon}
//       </div>
//       <div>
//         <p
//           style={{
//             margin: 0,
//             fontSize: "22px",
//             fontWeight: 800,
//             color: active ? color : "#0f172a",
//           }}
//         >
//           {value}
//         </p>
//         <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
//           <p
//             style={{
//               margin: 0,
//               fontSize: "12px",
//               color: active ? color : "#64748b",
//               fontWeight: 600,
//             }}
//           >
//             {label}
//           </p>
//           {active && (
//             <span
//               style={{
//                 fontSize: "9px",
//                 fontWeight: 700,
//                 background: color,
//                 color: "#fff",
//                 padding: "1px 5px",
//                 borderRadius: "10px",
//               }}
//             >
//               ON
//             </span>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Table styles ─────────────────────────────────────────────────────────────
// const th = {
//   padding: "10px 14px",
//   fontSize: "11px",
//   fontWeight: 700,
//   color: "#94a3b8",
//   textTransform: "uppercase",
//   letterSpacing: "0.06em",
//   textAlign: "left",
//   background: "#f8fafc",
//   whiteSpace: "nowrap",
// };
// const td = { padding: "12px 14px", fontSize: "13px", color: "#374151" };

// // ─── Attendance Row ───────────────────────────────────────────────────────────
// function AttendanceRow({ record, isFirst, showEmployee }) {
//   const hours =
//     record.total_hours ?? calcHours(record.start_time, record.end_time);
//   return (
//     <tr
//       style={{
//         borderTop: isFirst ? "none" : "1px solid #f1f5f9",
//         transition: "background 0.15s",
//       }}
//       onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
//       onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
//     >
//       <td style={td}>{fmtDate(record.date)}</td>
//       {showEmployee && (
//         <td style={{ ...td, fontWeight: 600, color: "#1e293b" }}>
//           {record.employee_name || `#${record.employee}`}
//         </td>
//       )}
//       <td style={td}>
//         <StatusBadge record={record} />
//       </td>
//       <td style={{ ...td, color: "#10b981", fontWeight: 600 }}>
//         {record.start_time ? fmtTime(record.start_time) : "—"}
//       </td>
//       <td style={{ ...td, color: "#ef4444", fontWeight: 600 }}>
//         {record.end_time ? fmtTime(record.end_time) : "—"}
//       </td>
//       <td
//         style={{ ...td, fontWeight: 700, color: hours ? "#6366f1" : "#94a3b8" }}
//       >
//         {hours ? `${hours}h` : "—"}
//       </td>
//     </tr>
//   );
// }

// // ─── Skeleton ─────────────────────────────────────────────────────────────────
// function TableSkeleton({ rows = 5, cols = 6 }) {
//   const widths = ["90px", "100px", "70px", "60px", "60px", "45px"];
//   return (
//     <>
//       <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
//       {Array.from({ length: rows }).map((_, i) => (
//         <tr
//           key={i}
//           style={{ borderTop: i === 0 ? "none" : "1px solid #f1f5f9" }}
//         >
//           {Array.from({ length: cols }).map((_, j) => (
//             <td key={j} style={td}>
//               <div
//                 style={{
//                   height: "13px",
//                   width: widths[j] || "60px",
//                   borderRadius: "6px",
//                   background:
//                     "linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%)",
//                   backgroundSize: "200% 100%",
//                   animation: "shimmer 1.4s infinite",
//                 }}
//               />
//             </td>
//           ))}
//         </tr>
//       ))}
//     </>
//   );
// }

// // ─── Tab pill ─────────────────────────────────────────────────────────────────
// function Tab({ label, active, onClick }) {
//   return (
//     <button
//       onClick={onClick}
//       style={{
//         padding: "7px 18px",
//         fontSize: "13px",
//         fontWeight: 600,
//         borderRadius: "8px",
//         border: "none",
//         cursor: "pointer",
//         transition: "all 0.18s",
//         background: active ? "#6366f1" : "transparent",
//         color: active ? "#fff" : "#64748b",
//         boxShadow: active ? "0 2px 8px #6366f130" : "none",
//       }}
//     >
//       {label}
//     </button>
//   );
// }

// const inputStyle = {
//   border: "1px solid #cbd5e1",
//   borderRadius: "8px",
//   padding: "6px 10px",
//   fontSize: "13px",
//   color: "#374151",
//   background: "#fff",
//   outline: "none",
//   cursor: "pointer",
//   height: "34px",
// };

// // ─── Main Module ──────────────────────────────────────────────────────────────
// export default function AttendanceModule({
//   employee_id: propEmployeeId,
//   title,
//   employees: propEmployees,
// }) {
//   const dispatch = useDispatch();
//   const allList = useSelector(selectEmployeeAttendances);
//   const loading = useSelector(selectEmployeeAttendanceLoading);
//   const error = useSelector(selectEmployeeAttendanceError);

//   // ── View mode ─────────────────────────────────────────────────────────────
//   const [mode, setMode] = useState("today");
//   const [customDate, setCustomDate] = useState(todayStr());
//   const [startDate, setStartDate] = useState(todayStr());
//   const [endDate, setEndDate] = useState(todayStr());

//   // ── Status filter — "all" | "present" | "full" | "half" | "absent" ───────
//   const [statusFilter, setStatusFilter] = useState("all");

//   // ── Employee dropdown ─────────────────────────────────────────────────────
//   const [employees, setEmployees] = useState(propEmployees || []);
//   const [selectedEmpId, setSelectedEmpId] = useState(propEmployeeId || "");
//   const [empLoading, setEmpLoading] = useState(false);

//   useEffect(() => {
//     if (propEmployeeId || (propEmployees && propEmployees.length > 0)) return;
//     setEmpLoading(true);
//     axiosInstance
//       .get("/employee/")
//       .then((res) => {
//         const list = Array.isArray(res.data)
//           ? res.data
//           : (res.data?.data ?? res.data?.results ?? []);
//         setEmployees(list);
//       })
//       .catch(() => setEmployees([]))
//       .finally(() => setEmpLoading(false));
//   }, [propEmployeeId, propEmployees]);

//   // ── Build API payload ─────────────────────────────────────────────────────
//   // Combines: date/range params + employee_id + status filter params
//   const buildPayload = useCallback(() => {
//     const eid = propEmployeeId || selectedEmpId;
//     const base = eid ? { employee_id: eid } : {};

//     // Date params
//     const now = new Date();
//     let dateParams = {};
//     switch (mode) {
//       case "today":
//         dateParams = { date: todayStr() };
//         break;
//       case "month":
//         dateParams = { month: now.getMonth() + 1, year: now.getFullYear() };
//         break;
//       case "date":
//         dateParams = customDate ? { date: customDate } : {};
//         break;
//       case "range":
//         dateParams =
//           startDate && endDate
//             ? { start_date: startDate, end_date: endDate }
//             : {};
//         break;
//       default:
//         dateParams = {};
//     }

//     // Status filter params — merged in so every fetch includes the filter
//     const filterParams = statusParams(statusFilter);

//     return { ...base, ...dateParams, ...filterParams };
//   }, [
//     mode,
//     customDate,
//     startDate,
//     endDate,
//     propEmployeeId,
//     selectedEmpId,
//     statusFilter,
//   ]);
//   //                                                                          ^^^^^^^^^^^^
//   //                              statusFilter is a dependency so changing it re-triggers fetch

//   // ── Single useEffect drives ALL fetches ───────────────────────────────────
//   useEffect(() => {
//     if (mode === "range" && (!startDate || !endDate)) return;
//     if (mode === "date" && !customDate) return;
//     dispatch(getEmployeeAttendances(buildPayload()));
//   }, [buildPayload, dispatch]);
//   // buildPayload is memoized via useCallback — it changes whenever any of its
//   // deps change (mode, dates, employee, or statusFilter), which triggers this effect.

//   const rawList = Array.isArray(allList) ? allList : [];

//   // ── Stats — always from rawList (reflects current filter result) ──────────
//   // When a filter is active, rawList IS already the filtered result from API,
//   // so we count from it directly.
//   const present = rawList.filter(
//     (r) => r.status && !r.full_leave && !r.half_leave,
//   ).length;
//   const fullCount = rawList.filter((r) => r.full_leave).length;
//   const halfCount = rawList.filter((r) => r.half_leave).length;
//   const absent = rawList.filter((r) => !r.status).length;
//   const avgHours = rawList.length
//     ? (
//         rawList.reduce((s, r) => s + (r.total_hours || 0), 0) / rawList.length
//       ).toFixed(1)
//     : "0.0";

//   const showEmployeeCol = !propEmployeeId;
//   const activeMeta = STATUS_FILTERS.find((f) => f.key === statusFilter);

//   const rangeLabel = (() => {
//     const now = new Date();
//     if (mode === "today") return `Today — ${fmtDate(todayStr())}`;
//     if (mode === "month")
//       return `This Month — ${now.toLocaleString("en-IN", { month: "long", year: "numeric" })}`;
//     if (mode === "date") return `Date — ${fmtDate(customDate)}`;
//     if (mode === "range") return `${fmtDate(startDate)} → ${fmtDate(endDate)}`;
//     return "";
//   })();

//   // ── Status filter toggle — resets when date/employee context changes ──────
//   const handleStatusFilter = (key) => {
//     setStatusFilter((prev) => (prev === key ? "all" : key));
//   };
//   // When switching tabs or employees, reset filter to avoid confusion
//   const handleModeChange = (newMode) => {
//     setMode(newMode);
//     setStatusFilter("all");
//   };
//   const handleEmpChange = (id) => {
//     setSelectedEmpId(id);
//     setStatusFilter("all");
//   };

//   return (
//     <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
//       <link
//         href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap"
//         rel="stylesheet"
//       />

//       {/* ── Header ───────────────────────────────────────────────────────── */}
//       <Box display="flex" alignItems="center" gap={1.5} mb={3}>
//         <Box
//           sx={{ width: 5, height: 32, bgcolor: "#D20000", borderRadius: 1 }}
//         />
//         <Typography variant="h5" fontWeight={800} color="#1a1a1a">
//           {title ||
//             (propEmployeeId ? "Employee Attendance" : "Attendance Records")}
//         </Typography>
//       </Box>

//       {/* ── Employee Dropdown ─────────────────────────────────────────────── */}
//       {!propEmployeeId && (
//         <div style={{ marginBottom: "16px" }}>
//           <label
//             style={{
//               fontSize: "12px",
//               fontWeight: 700,
//               color: "#64748b",
//               display: "block",
//               marginBottom: "6px",
//             }}
//           >
//             EMPLOYEE
//           </label>
//           <select
//             value={selectedEmpId}
//             onChange={(e) => handleEmpChange(e.target.value)}
//             style={{ ...inputStyle, minWidth: "220px" }}
//           >
//             <option value="">All Employees</option>
//             {empLoading ? (
//               <option disabled>Loading…</option>
//             ) : (
//               employees.map((emp) => (
//                 <option key={emp.id} value={emp.id}>
//                   {emp.name ||
//                     emp.employee_name ||
//                     emp.full_name ||
//                     `Employee #${emp.id}`}
//                 </option>
//               ))
//             )}
//           </select>
//         </div>
//       )}

//       {/* ── Date Tabs ─────────────────────────────────────────────────────── */}
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: "6px",
//           background: "#f1f5f9",
//           borderRadius: "10px",
//           padding: "5px",
//           marginBottom: "20px",
//           width: "fit-content",
//           flexWrap: "wrap",
//         }}
//       >
//         <Tab
//           label="Today"
//           active={mode === "today"}
//           onClick={() => handleModeChange("today")}
//         />
//         <Tab
//           label="This Month"
//           active={mode === "month"}
//           onClick={() => handleModeChange("month")}
//         />
//         <Tab
//           label="By Date"
//           active={mode === "date"}
//           onClick={() => handleModeChange("date")}
//         />
//         <Tab
//           label="Date Range"
//           active={mode === "range"}
//           onClick={() => handleModeChange("range")}
//         />

//         {mode === "date" && (
//           <input
//             type="date"
//             value={customDate}
//             max={todayStr()}
//             onChange={(e) => setCustomDate(e.target.value || todayStr())}
//             style={inputStyle}
//           />
//         )}

//         {mode === "range" && (
//           <>
//             <input
//               type="date"
//               value={startDate}
//               max={endDate || todayStr()}
//               onChange={(e) => {
//                 const v = e.target.value || todayStr();
//                 setStartDate(v);
//                 if (endDate && v > endDate) setEndDate(v);
//               }}
//               style={inputStyle}
//             />
//             <span
//               style={{ fontSize: "13px", color: "#64748b", fontWeight: 600 }}
//             >
//               to
//             </span>
//             <input
//               type="date"
//               value={endDate}
//               min={startDate || undefined}
//               max={todayStr()}
//               onChange={(e) => {
//                 const v = e.target.value || todayStr();
//                 setEndDate(v);
//                 if (startDate && v < startDate) setStartDate(v);
//               }}
//               style={inputStyle}
//             />
//           </>
//         )}
//       </div>

//       {/* ── Error ────────────────────────────────────────────────────────── */}
//       {error && (
//         <div
//           style={{
//             background: "#fef2f2",
//             border: "1px solid #fecaca",
//             borderRadius: "10px",
//             padding: "14px 18px",
//             color: "#dc2626",
//             fontSize: "14px",
//             marginBottom: "16px",
//           }}
//         >
//           ⚠️ {error}
//         </div>
//       )}

//       {/* ── Stat Cards — click = API re-fetch with status filter ──────────── */}
//       <div
//         style={{
//           display: "flex",
//           gap: "12px",
//           flexWrap: "wrap",
//           marginBottom: "8px",
//         }}
//       >
//         <StatCard
//           label="Present"
//           value={present}
//           icon="✅"
//           color="#10b981"
//           loading={loading}
//           active={statusFilter === "present"}
//           onClick={() => handleStatusFilter("present")}
//         />
//         <StatCard
//           label="Full Leave"
//           value={fullCount}
//           icon="🏖️"
//           color="#ef4444"
//           loading={loading}
//           active={statusFilter === "full"}
//           onClick={() => handleStatusFilter("full")}
//         />
//         <StatCard
//           label="Half Leave"
//           value={halfCount}
//           icon="⏰"
//           color="#f59e0b"
//           loading={loading}
//           active={statusFilter === "half"}
//           onClick={() => handleStatusFilter("half")}
//         />
//         <StatCard
//           label="Absent"
//           value={absent}
//           icon="❌"
//           color="#6b7280"
//           loading={loading}
//           active={statusFilter === "absent"}
//           onClick={() => handleStatusFilter("absent")}
//         />
//         <StatCard
//           label="Avg Hours"
//           value={`${avgHours}h`}
//           icon="⏱️"
//           color="#6366f1"
//         />
//       </div>

//       {/* ── Hint ─────────────────────────────────────────────────────────── */}
//       <p
//         style={{
//           fontSize: "11px",
//           color: "#94a3b8",
//           margin: "0 0 16px",
//           fontWeight: 500,
//         }}
//       >
//         💡 Click a card to filter — triggers a live API call. Click again to
//         clear.
//       </p>

//       {/* ── Active filter pill ────────────────────────────────────────────── */}
//       {statusFilter !== "all" && activeMeta && (
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "10px",
//             marginBottom: "14px",
//             padding: "8px 14px",
//             background: activeMeta.color + "0d",
//             border: `1px solid ${activeMeta.color}30`,
//             borderRadius: "10px",
//             width: "fit-content",
//           }}
//         >
//           <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>
//             API filtered by:
//           </span>
//           <span
//             style={{
//               display: "inline-flex",
//               alignItems: "center",
//               gap: "5px",
//               color: activeMeta.color,
//               fontSize: "13px",
//               fontWeight: 700,
//             }}
//           >
//             {activeMeta.icon} {activeMeta.label}
//           </span>
//           <span style={{ fontSize: "12px", color: "#94a3b8" }}>
//             ({rawList.length} records)
//           </span>
//           <button
//             onClick={() => setStatusFilter("all")}
//             style={{
//               background: activeMeta.color + "20",
//               border: `1px solid ${activeMeta.color}40`,
//               borderRadius: "6px",
//               cursor: "pointer",
//               color: activeMeta.color,
//               fontSize: "12px",
//               fontWeight: 700,
//               padding: "2px 8px",
//             }}
//           >
//             Clear ×
//           </button>
//         </div>
//       )}

//       {/* ── Table ────────────────────────────────────────────────────────── */}
//       <div
//         style={{
//           background: "#fff",
//           border: "1px solid #e2e8f0",
//           borderRadius: "12px",
//           overflow: "hidden",
//           boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
//         }}
//       >
//         <div
//           style={{
//             padding: "14px 18px",
//             borderBottom: "1px solid #e2e8f0",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             flexWrap: "wrap",
//             gap: "8px",
//           }}
//         >
//           <p
//             style={{
//               margin: 0,
//               fontSize: "14px",
//               fontWeight: 700,
//               color: "#1e293b",
//             }}
//           >
//             {rangeLabel}
//             {statusFilter !== "all" && activeMeta && (
//               <span
//                 style={{
//                   marginLeft: "8px",
//                   fontSize: "12px",
//                   fontWeight: 600,
//                   color: activeMeta.color,
//                   background: activeMeta.color + "12",
//                   padding: "2px 8px",
//                   borderRadius: "10px",
//                 }}
//               >
//                 {activeMeta.icon} {activeMeta.label} only
//               </span>
//             )}
//           </p>
//           <span
//             style={{
//               background: "#6366f110",
//               color: "#6366f1",
//               fontSize: "12px",
//               fontWeight: 700,
//               padding: "4px 12px",
//               borderRadius: "20px",
//             }}
//           >
//             {loading
//               ? "…"
//               : `${rawList.length} record${rawList.length !== 1 ? "s" : ""}`}
//           </span>
//         </div>

//         <div style={{ overflowX: "auto" }}>
//           <table style={{ width: "100%", borderCollapse: "collapse" }}>
//             <thead>
//               <tr>
//                 <th style={th}>Date</th>
//                 {showEmployeeCol && <th style={th}>Employee</th>}
//                 <th style={th}>Status</th>
//                 <th style={th}>Check In</th>
//                 <th style={th}>Check Out</th>
//                 <th style={th}>Hours</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <TableSkeleton rows={5} cols={showEmployeeCol ? 6 : 5} />
//               ) : rawList.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={showEmployeeCol ? 6 : 5}
//                     style={{
//                       padding: "48px",
//                       textAlign: "center",
//                       color: "#94a3b8",
//                       fontSize: "14px",
//                     }}
//                   >
//                     {statusFilter !== "all" && activeMeta
//                       ? `No "${activeMeta.label}" records found for this period.`
//                       : "No attendance records found."}
//                   </td>
//                 </tr>
//               ) : (
//                 rawList.map((r, i) => (
//                   <AttendanceRow
//                     key={r.id}
//                     record={r}
//                     isFirst={i === 0}
//                     showEmployee={showEmployeeCol}
//                   />
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }
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
  { key: "present", label: "Present", color: "#10b981", icon: "✅" },
  { key: "full", label: "Full Leave", color: "#ef4444", icon: "🏖️" },
  { key: "half", label: "Half Leave", color: "#f59e0b", icon: "⏰" },
  { key: "absent", label: "Absent", color: "#6b7280", icon: "❌" },
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
          color: "#6366f1",
          fontWeight: 600,
          marginBottom: "8px",
          background: "#6366f108",
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
            color = "#6366f1";
          }
          if (inR) {
            bg = "#6366f118";
            radius = "0";
            color = "#374151";
          }
          if (start) {
            bg = "#6366f1";
            color = "#fff";
            radius = inR || end ? "8px 0 0 8px" : "8px";
          }
          if (end) {
            bg = "#6366f1";
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
          <span style={{ fontSize: "11px", color: "#6366f1", fontWeight: 600 }}>
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
    background: active ? "#6366f112" : "#f1f5f9",
    color: active ? "#6366f1" : "#94a3b8",
    border: `1px solid ${active ? "#6366f130" : "#e2e8f0"}`,
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
  if (record.full_leave)
    return <Badge label="Full Leave" color="#ef4444" bg="#fef2f2" />;
  if (record.half_leave)
    return <Badge label="Half Leave" color="#f59e0b" bg="#fffbeb" />;
  if (record.status)
    return <Badge label="Present" color="#10b981" bg="#f0fdf4" />;
  return <Badge label="Absent" color="#6b7280" bg="#f3f4f6" />;
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
        style={{ ...td, fontWeight: 700, color: hours ? "#6366f1" : "#94a3b8" }}
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
        background: active ? "#6366f1" : "transparent",
        color: active ? "#fff" : "#64748b",
        boxShadow: active ? "0 2px 8px #6366f130" : "none",
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
}) {
  const dispatch = useDispatch();
  const allList = useSelector(selectEmployeeAttendances);
  const loading = useSelector(selectEmployeeAttendanceLoading);
  const error = useSelector(selectEmployeeAttendanceError);

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
      <Box display="flex" alignItems="center" gap={1.5} mb={3}>
        <Box
          sx={{ width: 5, height: 32, bgcolor: "#D20000", borderRadius: 1 }}
        />
        <Typography variant="h5" fontWeight={800} color="#1a1a1a">
          {title ||
            (propEmployeeId ? "Employee Attendance" : "Attendance Records")}
        </Typography>
      </Box>

      {/* ── Employee Dropdown ─────────────────────────────────────────────── */}
      {!propEmployeeId && (
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "#64748b",
              display: "block",
              marginBottom: "6px",
            }}
          >
            EMPLOYEE
          </label>
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
              employees?.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name ||
                    emp.employee_name ||
                    emp.full_name ||
                    `Employee #${emp.id}`}
                </option>
              ))
            )}
          </select>
        </div>
      )}

      {/* ── Date Tabs ─────────────────────────────────────────────────────── */}
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

        {/* Range: single button that opens the unified range calendar */}
        {mode === "range" && (
          <button
            onClick={() => setShowCal((v) => !v)}
            style={{
              ...inputStyle,
              cursor: "pointer",
              fontWeight: 600,
              color: startDate && endDate ? "#6366f1" : "#94a3b8",
              background: showCal ? "#6366f108" : "#fff",
              border: `1px solid ${showCal ? "#6366f1" : "#cbd5e1"}`,
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
        )}
      </div>

      {/* ── Range Calendar dropdown ───────────────────────────────────────── */}
      {mode === "range" && showCal && (
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
      )}

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

      {/* ── Stat Cards ───────────────────────────────────────────────────── */}
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
          color="#6366f1"
        />
      </div>
      <p
        style={{
          fontSize: "11px",
          color: "#94a3b8",
          margin: "0 0 16px",
          fontWeight: 500,
        }}
      >
        💡 Click a card to filter — triggers a live API call. Click again to
        clear.
      </p>

      {/* ── Active filter pill ────────────────────────────────────────────── */}
      {statusFilter !== "all" && activeMeta && (
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
      )}

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
        <div
          style={{
            padding: "14px 18px",
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
              color: "#1e293b",
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
              : `${rawList.length} record${rawList.length !== 1 ? "s" : ""}`}
          </span>
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
