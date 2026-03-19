// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getLeaveBalances } from "../../feature/leaveBalance/leaveBalanceThunks";
// import {
//   selectLeaveBalances,
//   selectLeaveBalanceLoading,
//   selectLeaveBalanceError,
// } from "../../feature/leaveBalance/leaveBalanceSelector";

// // ─── Leave type config ────────────────────────────────────────────────────────
// const LEAVE_FIELDS = [
//   { key: "cl", label: "Casual Leave", color: "#6366f1" },
//   { key: "sl", label: "Sick Leave", color: "#f59e0b" },
//   { key: "pl", label: "Paid Leave", color: "#10b981" },
//   { key: "ul", label: "Unpaid Leave", color: "#ef4444" },
//   { key: "compensatory_off", label: "Comp Off", color: "#3b82f6" },
//   { key: "public_holiday", label: "Public Holiday", color: "#8b5cf6" },
//   { key: "maternity_leave", label: "Maternity Leave", color: "#ec4899" },
//   { key: "paternity_leave", label: "Paternity Leave", color: "#14b8a6" },
// ];

// // ─── Single leave card ────────────────────────────────────────────────────────
// function LeaveCard({ record }) {
//   const usedPct =
//     record.total_allocated > 0
//       ? Math.min(100, (record.used_days / record.total_allocated) * 100)
//       : 0;

//   const statusColor =
//     record.remaining_days === 0
//       ? "#ef4444"
//       : record.remaining_days <= 2
//         ? "#f59e0b"
//         : "#10b981";

//   return (
//     <div
//       style={{
//         background: "#ffffff",
//         border: "1px solid #e2e8f0",
//         borderRadius: "12px",
//         padding: "20px",
//         display: "flex",
//         flexDirection: "column",
//         gap: "12px",
//         boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
//         transition: "box-shadow 0.2s",
//       }}
//       onMouseEnter={(e) =>
//         (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)")
//       }
//       onMouseLeave={(e) =>
//         (e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)")
//       }
//     >
//       {/* Header */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "flex-start",
//         }}
//       >
//         <div>
//           <p
//             style={{
//               margin: 0,
//               fontSize: "11px",
//               color: "#94a3b8",
//               textTransform: "uppercase",
//               letterSpacing: "0.08em",
//               fontWeight: 600,
//             }}
//           >
//             Leave Type
//           </p>
//           <p
//             style={{
//               margin: "4px 0 0",
//               fontSize: "15px",
//               fontWeight: 700,
//               color: "#1e293b",
//               textTransform: "capitalize",
//             }}
//           >
//             {record.leave_type}
//           </p>
//         </div>
//         <span
//           style={{
//             background: statusColor + "18",
//             color: statusColor,
//             fontSize: "12px",
//             fontWeight: 700,
//             padding: "4px 10px",
//             borderRadius: "20px",
//           }}
//         >
//           {record.remaining_days} left
//         </span>
//       </div>

//       {/* Progress bar */}
//       <div>
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             marginBottom: "6px",
//           }}
//         >
//           <span style={{ fontSize: "12px", color: "#64748b" }}>
//             Used: <b>{record.used_days}</b>
//           </span>
//           <span style={{ fontSize: "12px", color: "#64748b" }}>
//             Total: <b>{record.total_allocated}</b>
//           </span>
//         </div>
//         <div
//           style={{
//             background: "#f1f5f9",
//             borderRadius: "99px",
//             height: "7px",
//             overflow: "hidden",
//           }}
//         >
//           <div
//             style={{
//               width: `${usedPct}%`,
//               height: "100%",
//               borderRadius: "99px",
//               background:
//                 usedPct >= 100
//                   ? "#ef4444"
//                   : usedPct >= 70
//                     ? "#f59e0b"
//                     : "#10b981",
//               transition: "width 0.5s ease",
//             }}
//           />
//         </div>
//       </div>

//       {/* Leave-type breakdown chips */}
//       <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
//         {LEAVE_FIELDS.map(({ key, label, color }) =>
//           record[key] > 0 ? (
//             <span
//               key={key}
//               style={{
//                 background: color + "15",
//                 color,
//                 fontSize: "11px",
//                 fontWeight: 600,
//                 padding: "3px 8px",
//                 borderRadius: "6px",
//                 whiteSpace: "nowrap",
//               }}
//             >
//               {label}: {record[key]}
//             </span>
//           ) : null,
//         )}
//       </div>
//     </div>
//   );
// }

// // ─── Skeleton loader ──────────────────────────────────────────────────────────
// function SkeletonCard() {
//   return (
//     <div
//       style={{
//         background: "#f8fafc",
//         border: "1px solid #e2e8f0",
//         borderRadius: "12px",
//         padding: "20px",
//         display: "flex",
//         flexDirection: "column",
//         gap: "12px",
//       }}
//     >
//       {[80, 120, 60, 100].map((w, i) => (
//         <div
//           key={i}
//           style={{
//             height: "14px",
//             width: `${w}%`,
//             maxWidth: `${w}%`,
//             background:
//               "linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)",
//             backgroundSize: "200% 100%",
//             animation: "shimmer 1.4s infinite",
//             borderRadius: "6px",
//           }}
//         />
//       ))}
//       <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
//     </div>
//   );
// }

// // ─── Summary row ──────────────────────────────────────────────────────────────
// function SummaryBadge({ label, value, color }) {
//   return (
//     <div
//       style={{
//         background: color + "12",
//         border: `1px solid ${color}30`,
//         borderRadius: "10px",
//         padding: "10px 16px",
//         textAlign: "center",
//         minWidth: "80px",
//       }}
//     >
//       <p style={{ margin: 0, fontSize: "20px", fontWeight: 800, color }}>
//         {value}
//       </p>
//       <p
//         style={{
//           margin: "2px 0 0",
//           fontSize: "11px",
//           color: "#64748b",
//           fontWeight: 600,
//         }}
//       >
//         {label}
//       </p>
//     </div>
//   );
// }

// // ─── Main Module ──────────────────────────────────────────────────────────────
// /**
//  * LeaveBalanceModule
//  *
//  * Props:
//  *  @param {number|string} [employee_id]  - If passed, fetches leave balance for
//  *                                          that specific employee. Otherwise fetches all.
//  *  @param {string}        [title]        - Optional heading override
//  */
// export default function LeaveBalanceModule({ employee_id, title }) {
//   const dispatch = useDispatch();
//   const list = useSelector(selectLeaveBalances);
//   const loading = useSelector(selectLeaveBalanceLoading);
//   const error = useSelector(selectLeaveBalanceError);

//   useEffect(() => {
//     const payload = employee_id ? { employee_id } : {};
//     dispatch(getLeaveBalances(payload));
//   }, [employee_id, dispatch]);

//   // ── Summary totals ──────────────────────────────────────────────────────────
//   const totalAllocated = list.reduce((s, r) => s + (r.total_allocated || 0), 0);
//   const totalUsed = list.reduce((s, r) => s + (r.used_days || 0), 0);
//   const totalRemaining = list.reduce((s, r) => s + (r.remaining_days || 0), 0);

//   return (
//     <div style={{ fontFamily: "'DM Sans', sans-serif", padding: "0" }}>
//       <link
//         href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap"
//         rel="stylesheet"
//       />

//       {/* ── Header ─────────────────────────────────────────────────────────── */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "flex-end",
//           marginBottom: "20px",
//           flexWrap: "wrap",
//           gap: "12px",
//         }}
//       >
//         <div>
//           <h2
//             style={{
//               margin: 0,
//               fontSize: "22px",
//               fontWeight: 800,
//               color: "#0f172a",
//             }}
//           >
//             {title ||
//               (employee_id ? "Employee Leave Balance" : "All Leave Balances")}
//           </h2>
//           {employee_id && (
//             <p
//               style={{ margin: "4px 0 0", fontSize: "13px", color: "#64748b" }}
//             >
//               Employee ID: <b>#{employee_id}</b>
//             </p>
//           )}
//         </div>

//         {/* Summary badges */}
//         {!loading && list.length > 0 && (
//           <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
//             <SummaryBadge
//               label="Allocated"
//               value={totalAllocated}
//               color="#6366f1"
//             />
//             <SummaryBadge label="Used" value={totalUsed} color="#f59e0b" />
//             <SummaryBadge
//               label="Remaining"
//               value={totalRemaining}
//               color="#10b981"
//             />
//           </div>
//         )}
//       </div>

//       {/* ── Error ──────────────────────────────────────────────────────────── */}
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

//       {/* ── Grid ───────────────────────────────────────────────────────────── */}
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
//           gap: "16px",
//         }}
//       >
//         {loading ? (
//           Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
//         ) : list.length === 0 ? (
//           <div
//             style={{
//               gridColumn: "1/-1",
//               textAlign: "center",
//               padding: "48px 0",
//               color: "#94a3b8",
//               fontSize: "15px",
//             }}
//           >
//             No leave balance records found.
//           </div>
//         ) : (
//           list.map((record) => <LeaveCard key={record.id} record={record} />)
//         )}
//       </div>
//     </div>
//   );
// }

// /*
// ─────────────────────────────────────────────────────────────
//   USAGE EXAMPLES
// ─────────────────────────────────────────────────────────────

//   // Show ALL employees' leave balances
//   <LeaveBalanceModule />

//   // Show a specific employee's leave balances
//   <LeaveBalanceModule employee_id={19} />

//   // With a custom title
//   <LeaveBalanceModule employee_id={8} title="John's Leave Summary" />

// ─────────────────────────────────────────────────────────────
// */

// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getLeaveBalances } from "../../feature/leaveBalance/leaveBalanceThunks";
// import {
//   selectLeaveBalances,
//   selectLeaveBalanceLoading,
//   selectLeaveBalanceError,
// } from "../../feature/leaveBalance/leaveBalanceSelector";

// // ─── Leave type chip colors ───────────────────────────────────────────────────
// const LEAVE_TYPE_COLORS = {
//   "paid leave": { color: "#10b981", bg: "#f0fdf4" },
//   sick: { color: "#f59e0b", bg: "#fffbeb" },
//   casual: { color: "#6366f1", bg: "#eef2ff" },
//   unpaid: { color: "#ef4444", bg: "#fef2f2" },
//   compensatory: { color: "#3b82f6", bg: "#eff6ff" },
//   maternity: { color: "#ec4899", bg: "#fdf2f8" },
//   paternity: { color: "#14b8a6", bg: "#f0fdfa" },
//   "public holiday": { color: "#8b5cf6", bg: "#f5f3ff" },
// };

// const LEAVE_FIELDS = [
//   { key: "cl", label: "Casual" },
//   { key: "sl", label: "Sick" },
//   { key: "pl", label: "Paid" },
//   { key: "ul", label: "Unpaid" },
//   { key: "compensatory_off", label: "Comp Off" },
//   { key: "public_holiday", label: "Public Holiday" },
//   { key: "maternity_leave", label: "Maternity" },
//   { key: "paternity_leave", label: "Paternity" },
// ];

// function getLeaveColor(leaveType = "") {
//   const key = Object.keys(LEAVE_TYPE_COLORS).find((k) =>
//     leaveType.toLowerCase().includes(k),
//   );
//   return LEAVE_TYPE_COLORS[key] || { color: "#64748b", bg: "#f8fafc" };
// }

// // ─── Group records by employee_id ─────────────────────────────────────────────
// function groupByEmployee(list) {
//   const map = {};
//   list.forEach((record) => {
//     const eid = record.employee_id;
//     if (!map[eid]) map[eid] = { employee_id: eid, leaves: [] };
//     map[eid].leaves.push(record);
//   });
//   return Object.values(map);
// }

// // ─── Progress bar ─────────────────────────────────────────────────────────────
// function ProgressBar({ used, total }) {
//   const pct = total > 0 ? Math.min(100, (used / total) * 100) : 0;
//   const barColor = pct >= 100 ? "#ef4444" : pct >= 70 ? "#f59e0b" : "#10b981";
//   return (
//     <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//       <div
//         style={{
//           flex: 1,
//           height: "6px",
//           background: "#f1f5f9",
//           borderRadius: "99px",
//           overflow: "hidden",
//         }}
//       >
//         <div
//           style={{
//             width: `${pct}%`,
//             height: "100%",
//             borderRadius: "99px",
//             background: barColor,
//             transition: "width 0.5s ease",
//           }}
//         />
//       </div>
//       <span
//         style={{
//           fontSize: "11px",
//           fontWeight: 700,
//           color: barColor,
//           minWidth: "32px",
//         }}
//       >
//         {Math.round(pct)}%
//       </span>
//     </div>
//   );
// }

// // ─── Single leave type row inside employee card ───────────────────────────────
// function LeaveRow({ record }) {
//   const { color, bg } = getLeaveColor(record.leave_type);
//   const hasBreakdown = LEAVE_FIELDS.some((f) => record[f.key] > 0);

//   return (
//     <div
//       style={{
//         padding: "12px 14px",
//         borderRadius: "10px",
//         background: "#fafafa",
//         border: "1px solid #f1f5f9",
//         display: "flex",
//         flexDirection: "column",
//         gap: "8px",
//       }}
//     >
//       {/* Type label + remaining */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <span
//           style={{
//             background: bg,
//             color,
//             fontSize: "12px",
//             fontWeight: 700,
//             padding: "3px 10px",
//             borderRadius: "6px",
//             textTransform: "capitalize",
//           }}
//         >
//           {record.leave_type}
//         </span>
//         <span
//           style={{
//             fontSize: "12px",
//             fontWeight: 700,
//             color: record.remaining_days === 0 ? "#ef4444" : "#10b981",
//           }}
//         >
//           {record.remaining_days} / {record.total_allocated} left
//         </span>
//       </div>

//       {/* Progress bar */}
//       <ProgressBar used={record.used_days} total={record.total_allocated} />

//       {/* Breakdown chips */}
//       {hasBreakdown && (
//         <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
//           {LEAVE_FIELDS.map(({ key, label }) =>
//             record[key] > 0 ? (
//               <span
//                 key={key}
//                 style={{
//                   background: "#e2e8f0",
//                   color: "#475569",
//                   fontSize: "10px",
//                   fontWeight: 600,
//                   padding: "2px 8px",
//                   borderRadius: "5px",
//                 }}
//               >
//                 {label}: {record[key]}
//               </span>
//             ) : null,
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── Employee grouped card ────────────────────────────────────────────────────
// function EmployeeLeaveCard({ group, employees }) {
//   const employee = employees?.find((e) => e.id === group.employee_id);
//   const name = employee?.name || employee?.full_name || null;
//   const initial = name ? name[0].toUpperCase() : "#";

//   const totalAllocated = group.leaves.reduce(
//     (s, r) => s + (r.total_allocated || 0),
//     0,
//   );
//   const totalUsed = group.leaves.reduce((s, r) => s + (r.used_days || 0), 0);
//   const totalRemaining = group.leaves.reduce(
//     (s, r) => s + (r.remaining_days || 0),
//     0,
//   );

//   return (
//     <div
//       style={{
//         background: "#ffffff",
//         border: "1px solid #e2e8f0",
//         borderRadius: "14px",
//         overflow: "hidden",
//         boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
//         transition: "box-shadow 0.2s",
//       }}
//       onMouseEnter={(e) =>
//         (e.currentTarget.style.boxShadow = "0 4px 18px rgba(0,0,0,0.10)")
//       }
//       onMouseLeave={(e) =>
//         (e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)")
//       }
//     >
//       {/* ── Card Header ──────────────────────────────────────────────────── */}
//       <div
//         style={{
//           padding: "16px 18px",
//           background: "linear-gradient(135deg, #6366f108, #818cf808)",
//           borderBottom: "1px solid #e2e8f0",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           flexWrap: "wrap",
//           gap: "10px",
//         }}
//       >
//         {/* Avatar + name/id */}
//         <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//           <div
//             style={{
//               width: "40px",
//               height: "40px",
//               borderRadius: "10px",
//               background: "linear-gradient(135deg, #6366f1, #818cf8)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               color: "#fff",
//               fontWeight: 800,
//               fontSize: "16px",
//               flexShrink: 0,
//             }}
//           >
//             {initial}
//           </div>
//           <div>
//             <p
//               style={{
//                 margin: 0,
//                 fontSize: "15px",
//                 fontWeight: 800,
//                 color: "#0f172a",
//               }}
//             >
//               {name || `Employee #${group.employee_id}`}
//             </p>
//             <p
//               style={{
//                 margin: 0,
//                 fontSize: "12px",
//                 color: "#94a3b8",
//                 fontWeight: 500,
//               }}
//             >
//               ID: #{group.employee_id} · {group.leaves.length} leave type
//               {group.leaves.length !== 1 ? "s" : ""}
//             </p>
//           </div>
//         </div>

//         {/* Summary pills */}
//         <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
//           {[
//             { label: "Allocated", value: totalAllocated, color: "#6366f1" },
//             { label: "Used", value: totalUsed, color: "#f59e0b" },
//             { label: "Remaining", value: totalRemaining, color: "#10b981" },
//           ].map(({ label, value, color }) => (
//             <div
//               key={label}
//               style={{
//                 background: color + "12",
//                 border: `1px solid ${color}25`,
//                 borderRadius: "8px",
//                 padding: "5px 12px",
//                 textAlign: "center",
//               }}
//             >
//               <p
//                 style={{ margin: 0, fontSize: "14px", fontWeight: 800, color }}
//               >
//                 {value}
//               </p>
//               <p
//                 style={{
//                   margin: 0,
//                   fontSize: "10px",
//                   color: "#64748b",
//                   fontWeight: 600,
//                 }}
//               >
//                 {label}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ── Leave rows ───────────────────────────────────────────────────── */}
//       <div
//         style={{
//           padding: "14px",
//           display: "flex",
//           flexDirection: "column",
//           gap: "10px",
//         }}
//       >
//         {group.leaves.map((record) => (
//           <LeaveRow key={record.id} record={record} />
//         ))}
//       </div>
//     </div>
//   );
// }

// // ─── Shimmer skeleton ─────────────────────────────────────────────────────────
// const shimmerStyle = {
//   background: "linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)",
//   backgroundSize: "200% 100%",
//   animation: "shimmer 1.4s infinite",
//   borderRadius: "6px",
// };

// function SkeletonCard() {
//   return (
//     <div
//       style={{
//         background: "#fff",
//         border: "1px solid #e2e8f0",
//         borderRadius: "14px",
//         overflow: "hidden",
//       }}
//     >
//       <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
//       <div
//         style={{
//           padding: "16px 18px",
//           borderBottom: "1px solid #e2e8f0",
//           display: "flex",
//           gap: "12px",
//           alignItems: "center",
//         }}
//       >
//         <div
//           style={{
//             ...shimmerStyle,
//             width: 40,
//             height: 40,
//             borderRadius: "10px",
//             flexShrink: 0,
//           }}
//         />
//         <div
//           style={{
//             flex: 1,
//             display: "flex",
//             flexDirection: "column",
//             gap: "6px",
//           }}
//         >
//           <div style={{ ...shimmerStyle, height: 14, width: "50%" }} />
//           <div style={{ ...shimmerStyle, height: 11, width: "30%" }} />
//         </div>
//       </div>
//       <div
//         style={{
//           padding: "14px",
//           display: "flex",
//           flexDirection: "column",
//           gap: "10px",
//         }}
//       >
//         {[1, 2].map((i) => (
//           <div
//             key={i}
//             style={{
//               background: "#fafafa",
//               border: "1px solid #f1f5f9",
//               borderRadius: "10px",
//               padding: "12px 14px",
//               display: "flex",
//               flexDirection: "column",
//               gap: "8px",
//             }}
//           >
//             <div style={{ ...shimmerStyle, height: 14, width: "45%" }} />
//             <div
//               style={{
//                 ...shimmerStyle,
//                 height: 6,
//                 width: "100%",
//                 borderRadius: "99px",
//               }}
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ─── Main Module ──────────────────────────────────────────────────────────────
// /**
//  * LeaveBalanceModule
//  *
//  * Props:
//  *  @param {number|string} [employee_id]  - Fetch specific employee. Omit for all.
//  *  @param {Array}         [employees]    - Optional array from Redux to resolve
//  *                                          employee names by id.
//  *                                          e.g. useSelector(selectEmployees)
//  *  @param {string}        [title]        - Optional heading override
//  */
// export default function LeaveBalanceModule({
//   employee_id,
//   employees = [],
//   title,
// }) {
//   const dispatch = useDispatch();
//   const list = useSelector(selectLeaveBalances);
//   const loading = useSelector(selectLeaveBalanceLoading);
//   const error = useSelector(selectLeaveBalanceError);

//   useEffect(() => {
//     const payload = employee_id ? { employee_id } : {};
//     dispatch(getLeaveBalances(payload));
//   }, [employee_id, dispatch]);

//   const grouped = groupByEmployee(list);

//   const totalAllocated = list.reduce((s, r) => s + (r.total_allocated || 0), 0);
//   const totalUsed = list.reduce((s, r) => s + (r.used_days || 0), 0);
//   const totalRemaining = list.reduce((s, r) => s + (r.remaining_days || 0), 0);

//   return (
//     <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
//       <link
//         href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap"
//         rel="stylesheet"
//       />

//       {/* ── Header ─────────────────────────────────────────────────────────── */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "flex-end",
//           marginBottom: "20px",
//           flexWrap: "wrap",
//           gap: "12px",
//         }}
//       >
//         <div>
//           <h2
//             style={{
//               margin: 0,
//               fontSize: "22px",
//               fontWeight: 800,
//               color: "#0f172a",
//             }}
//           >
//             {title ||
//               (employee_id ? "Employee Leave Balance" : "All Leave Balances")}
//           </h2>
//           <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#94a3b8" }}>
//             {loading
//               ? "Loading…"
//               : `${grouped.length} employee${grouped.length !== 1 ? "s" : ""} · ${list.length} leave record${list.length !== 1 ? "s" : ""}`}
//           </p>
//         </div>

//         {/* Global summary */}
//         {!loading && list.length > 0 && (
//           <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
//             {[
//               { label: "Allocated", value: totalAllocated, color: "#6366f1" },
//               { label: "Used", value: totalUsed, color: "#f59e0b" },
//               { label: "Remaining", value: totalRemaining, color: "#10b981" },
//             ].map(({ label, value, color }) => (
//               <div
//                 key={label}
//                 style={{
//                   background: color + "12",
//                   border: `1px solid ${color}25`,
//                   borderRadius: "10px",
//                   padding: "8px 16px",
//                   textAlign: "center",
//                 }}
//               >
//                 <p
//                   style={{
//                     margin: 0,
//                     fontSize: "18px",
//                     fontWeight: 800,
//                     color,
//                   }}
//                 >
//                   {value}
//                 </p>
//                 <p
//                   style={{
//                     margin: 0,
//                     fontSize: "11px",
//                     color: "#64748b",
//                     fontWeight: 600,
//                   }}
//                 >
//                   {label}
//                 </p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* ── Error ──────────────────────────────────────────────────────────── */}
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

//       {/* ── Cards Grid ─────────────────────────────────────────────────────── */}
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
//           gap: "16px",
//         }}
//       >
//         {loading ? (
//           Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
//         ) : grouped.length === 0 ? (
//           <div
//             style={{
//               gridColumn: "1/-1",
//               textAlign: "center",
//               padding: "48px 0",
//               color: "#94a3b8",
//               fontSize: "15px",
//             }}
//           >
//             No leave balance records found.
//           </div>
//         ) : (
//           grouped.map((group) => (
//             <EmployeeLeaveCard
//               key={group.employee_id}
//               group={group}
//               employees={employees}
//             />
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// /*
// ─────────────────────────────────────────────────────────────
//   USAGE EXAMPLES
// ─────────────────────────────────────────────────────────────

//   // All employees grouped — shows ID only (no name)
//   <LeaveBalanceModule />

//   // All employees with names resolved from Redux
//   const employees = useSelector(selectEmployees);
//   <LeaveBalanceModule employees={employees} />

//   // Specific employee only
//   <LeaveBalanceModule employee_id={19} employees={employees} />

//   // Custom title
//   <LeaveBalanceModule employee_id={19} employees={employees} title="John's Leaves" />

// ─────────────────────────────────────────────────────────────
// */

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLeaveBalances } from "../../feature/leaveBalance/leaveBalanceThunks";
import {
  selectLeaveBalances,
  selectLeaveBalanceLoading,
  selectLeaveBalanceError,
} from "../../feature/leaveBalance/leaveBalanceSelector";

// ─── Leave type columns ───────────────────────────────────────────────────────
const LEAVE_FIELDS = [
  {
    key: "cl",
    label: "Casual Leave",
    short: "CL",
    color: "#6366f1",
    bg: "#eef2ff",
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
          <h2
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            {title ||
              (employee_id ? "Employee Leave Balance" : "All Leave Balances")}
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#94a3b8" }}>
            {loading
              ? "Loading…"
              : `${grouped.length} employee${grouped.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        {!loading && list.length > 0 && (
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {[
              { label: "Allocated", value: totalAllocated, color: "#6366f1" },
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
            padding: "14px 18px",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
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
            Leave Balance Breakdown
          </p>
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
            >
              🔍
            </span>
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
              onFocus={(e) => (e.target.style.border = "1px solid #6366f1")}
              onBlur={(e) => (e.target.style.border = "1px solid #e2e8f0")}
            />
          </div>
          {/* Month Filter */}
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
            onFocus={(e) => (e.target.style.border = "1px solid #6366f1")}
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
                  style={{ ...thBase, minWidth: "90px", background: "#eef2ff" }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#6366f1",
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
                  const name = emp?.name || emp?.full_name || null;
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
                        (e.currentTarget.style.background = "#f0f4ff")
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
                                "linear-gradient(135deg, #6366f1, #818cf8)",
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
                                color: "#0f172a",
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
                      <td style={{ ...tdBase, background: "#eef2ff20" }}>
                        <span
                          style={{
                            fontSize: "15px",
                            fontWeight: 800,
                            color: "#6366f1",
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
