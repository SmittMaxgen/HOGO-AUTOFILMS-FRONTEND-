// import React, { useEffect, useState, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";

// // ─── Travel Plan Selectors ───────────────────────────────────────────────────
// import {
//   selectTravelPlanList,
//   selectTravelPlanLoading,
//   selectTravelPlanCreateLoading,
//   selectTravelPlanCreateSuccess,
//   selectTravelPlanUpdateLoading,
//   selectTravelPlanUpdateSuccess,
//   selectTravelPlanDeleteLoading,
// } from "../../feature/tavelPlans/travelPlanSelectors";
// import {
//   getTravelPlans,
//   createTravelPlan,
//   updateTravelPlan,
//   deleteTravelPlan,
// } from "../../feature/tavelPlans/travelPlanThunks";
// // import {
// //   clearTravelPlanCreateState,
// //   clearTravelPlanUpdateState,
// //   clearTravelPlanDeleteState,
// // } from "../../feature/tavelPlans/travelPlanSlice";

// import {
//   clearCreateState,
//   clearUpdateState,
//   clearDeleteState,
// } from "../../feature/tavelPlans/travelPlanSlice";
// // ─── Daily Plan Selectors ────────────────────────────────────────────────────
// import {
//   selectDailyPlanList,
//   selectDailyPlanLoading,
//   selectDailyPlanCreateLoading,
//   selectDailyPlanCreateSuccess,
//   selectDailyPlanUpdateLoading,
//   selectDailyPlanUpdateSuccess,
//   selectDailyPlanDeleteLoading,
// } from "../../feature/dailyPlans/dailyPlanSelectors";
// import {
//   getDailyPlans,
//   createDailyPlan,
//   updateDailyPlan,
//   deleteDailyPlan,
// } from "../../feature/dailyPlans/dailyPlanThunks";
// import {
//   clearDailyPlanCreateState,
//   clearDailyPlanUpdateState,
//   clearDailyPlanDeleteState,
// } from "../../feature/dailyPlans/dailyPlanSlice";

// import { getEmployees } from "../../feature/employee/employeeThunks";
// import { selectEmployees } from "../../feature/employee/employeeSelector";
// import { getRegions } from "../../feature/region/regionThunks";
// import { selectRegions } from "../../feature/region/regionSelectors";
// // ─── Helpers ─────────────────────────────────────────────────────────────────
// const MONTHS = [
//   "January",
//   "February",
//   "March",
//   "April",
//   "May",
//   "June",
//   "July",
//   "August",
//   "September",
//   "October",
//   "November",
//   "December",
// ];
// const DAYS = [
//   "Sunday",
//   "Monday",
//   "Tuesday",
//   "Wednesday",
//   "Thursday",
//   "Friday",
//   "Saturday",
// ];
// const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// function monthYearLabel(year, month) {
//   const m = MONTHS[month].slice(0, 3);
//   return `${m}-${String(year).slice(2)}`;
// }

// function formatDateISO(year, month, day) {
//   return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
// }

// function parseISODate(str) {
//   if (!str) return null;
//   const [y, m, d] = str.split("-").map(Number);
//   return new Date(y, m - 1, d);
// }

// function buildCalendarWeeks(year, month) {
//   const firstDay = new Date(year, month, 1).getDay();
//   const daysInMonth = new Date(year, month + 1, 0).getDate();
//   const weeks = [];
//   let day = 1 - firstDay;
//   while (day <= daysInMonth) {
//     const week = [];
//     for (let d = 0; d < 7; d++, day++) {
//       if (day < 1 || day > daysInMonth) week.push(null);
//       else week.push(day);
//     }
//     weeks.push(week);
//   }
//   return weeks;
// }

// // ─── Modal ────────────────────────────────────────────────────────────────────
// function Modal({ title, onClose, children }) {
//   return (
//     <div style={styles.overlay} onClick={onClose}>
//       <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
//         <div style={styles.modalHeader}>
//           <span style={styles.modalTitle}>{title}</span>
//           <button style={styles.closeBtn} onClick={onClose}>
//             ✕
//           </button>
//         </div>
//         <div style={styles.modalBody}>{children}</div>
//       </div>
//     </div>
//   );
// }

// // ─── Field ────────────────────────────────────────────────────────────────────
// function Field({ label, children }) {
//   return (
//     <div style={styles.field}>
//       <label style={styles.fieldLabel}>{label}</label>
//       {children}
//     </div>
//   );
// }

// // ─── Main Component ───────────────────────────────────────────────────────────
// export default function Plan() {
//   const dispatch = useDispatch();

//   const regions = useSelector(selectRegions);
//   // Travel Plan state
//   const travelPlans = useSelector(selectTravelPlanList);
//   const travelLoading = useSelector(selectTravelPlanLoading);
//   const tpCreateLoading = useSelector(selectTravelPlanCreateLoading);
//   const tpCreateSuccess = useSelector(selectTravelPlanCreateSuccess);
//   const tpUpdateLoading = useSelector(selectTravelPlanUpdateLoading);
//   const tpUpdateSuccess = useSelector(selectTravelPlanUpdateSuccess);
//   const tpDeleteLoading = useSelector(selectTravelPlanDeleteLoading);

//   // Daily Plan state
//   const dailyPlans = useSelector(selectDailyPlanList);
//   const dpCreateLoading = useSelector(selectDailyPlanCreateLoading);
//   const dpCreateSuccess = useSelector(selectDailyPlanCreateSuccess);
//   const dpUpdateLoading = useSelector(selectDailyPlanUpdateLoading);
//   const dpUpdateSuccess = useSelector(selectDailyPlanUpdateSuccess);
//   const dpDeleteLoading = useSelector(selectDailyPlanDeleteLoading);

//   //Employee state
//   const employees = useSelector(selectEmployees);

//   // Selected travel plan & calendar month
//   const [selectedTPId, setSelectedTPId] = useState(null);
//   const [calYear, setCalYear] = useState(new Date().getFullYear());
//   const [calMonth, setCalMonth] = useState(new Date().getMonth());

//   // Modals
//   const [showTPModal, setShowTPModal] = useState(false);
//   const [showDPModal, setShowDPModal] = useState(false);
//   const [editingTP, setEditingTP] = useState(null);
//   const [editingDP, setEditingDP] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [filterEmployeeId, setFilterEmployeeId] = useState("");

//   const [employeeSearch, setEmployeeSearch] = useState("");
//   const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);

//   // Travel plan form
//   const [tpForm, setTpForm] = useState({
//     employee_id: "",
//     month: "",
//     start_date: "",
//     end_date: "",
//     region: "",
//     states: "",
//     rm: "",
//     tsm: "",
//   });

//   // Daily plan form
//   const [dpForm, setDpForm] = useState({ place: "", notes: "" });

//   // ── Fetch on mount ──────────────────────────────────────────────────────────
//   useEffect(() => {
//     dispatch(getTravelPlans());
//     dispatch(getDailyPlans());
//     dispatch(getEmployees()); // ← add this
//   }, [dispatch]);

//   useEffect(() => {
//     if (showTPModal && !editingTP) {
//       dispatch(getEmployees());
//     }
//   }, [showTPModal]);

//   // Auto-select first travel plan
//   useEffect(() => {
//     if (travelPlans.length > 0 && !selectedTPId) {
//       const first = travelPlans[0];
//       setSelectedTPId(first.id);
//       const d = parseISODate(first.start_date);
//       if (d) {
//         setCalYear(d.getFullYear());
//         setCalMonth(d.getMonth());
//       }
//     }
//   }, [travelPlans]);

//   // Close TP modal on success
//   useEffect(() => {
//     if (tpCreateSuccess || tpUpdateSuccess) {
//       setShowTPModal(false);
//       setEditingTP(null);
//       dispatch(getTravelPlans());
//       dispatch(clearCreateState());
//       dispatch(clearUpdateState());
//     }
//   }, [tpCreateSuccess, tpUpdateSuccess]);

//   // Close DP modal on success
//   useEffect(() => {
//     if (dpCreateSuccess || dpUpdateSuccess) {
//       setShowDPModal(false);
//       setEditingDP(null);
//       dispatch(getDailyPlans());
//       dispatch(clearDailyPlanCreateState());
//       dispatch(clearDailyPlanUpdateState());
//     }
//   }, [dpCreateSuccess, dpUpdateSuccess]);

//   // ── Derived data ─────────────────────────────────────────────────────────────
//   const filteredTravelPlans = filterEmployeeId
//     ? travelPlans.filter(
//         (tp) => String(tp.employee_id) === String(filterEmployeeId),
//       )
//     : travelPlans;
//   const selectedTP = travelPlans.find((tp) => tp.id === selectedTPId) || null;

//   const dailyByDate = useMemo(() => {
//     const map = {};
//     dailyPlans.forEach((dp) => {
//       if (dp.travel_plan === selectedTPId) {
//         map[dp.date] = dp;
//       }
//     });
//     return map;
//   }, [dailyPlans, selectedTPId]);

//   const weeks = useMemo(
//     () => buildCalendarWeeks(calYear, calMonth),
//     [calYear, calMonth],
//   );

//   // ── Travel Plan CRUD ─────────────────────────────────────────────────────────
//   function openCreateTP() {
//     setEditingTP(null);
//     setTpForm({
//       employee_id: "",
//       month: "",
//       start_date: "",
//       end_date: "",
//       region: "",
//       states: "",
//       rm: "",
//       tsm: "",
//     });
//     setShowTPModal(true);
//   }

//   function openEditTP(tp) {
//     setEditingTP(tp);
//     setTpForm({
//       employee_id: tp.employee_id,
//       month: tp.month,
//       start_date: tp.start_date,
//       end_date: tp.end_date,
//       region: tp.region,
//       states: tp.states,
//       rm: tp.rm,
//       tsm: tp.tsm,
//     });
//     const emp = employees.find((e) => e.id === tp.employee_id);
//     if (emp) {
//       setEmployeeSearch(
//         `${emp.first_name} ${emp.last_name} (${emp.employee_code})`,
//       );
//     } else {
//       setEmployeeSearch("");
//     }
//     setShowTPModal(true);
//   }

//   function handleTPSubmit() {
//     const payload = { ...tpForm, employee_id: Number(tpForm.employee_id) };
//     if (editingTP)
//       dispatch(updateTravelPlan({ id: editingTP.id, data: payload }));
//     else dispatch(createTravelPlan(payload));
//   }

//   function handleDeleteTP(id) {
//     if (window.confirm("Delete this travel plan?")) {
//       dispatch(deleteTravelPlan(id)).then(() => {
//         if (selectedTPId === id) setSelectedTPId(null);
//         dispatch(getTravelPlans());
//         dispatch(clearDeleteState());
//       });
//     }
//   }

//   // ── Daily Plan CRUD ──────────────────────────────────────────────────────────
//   function openCellModal(day) {
//     if (!selectedTPId || !day) return;
//     const dateStr = formatDateISO(calYear, calMonth, day);
//     setSelectedDate(dateStr);
//     const existing = dailyByDate[dateStr];
//     if (existing) {
//       setEditingDP(existing);
//       setDpForm({ place: existing.place, notes: existing.notes });
//     } else {
//       setEditingDP(null);
//       setDpForm({ place: "", notes: "" });
//     }
//     setShowDPModal(true);
//   }

//   function handleDPSubmit() {
//     const payload = {
//       travel_plan: selectedTPId,
//       date: selectedDate,
//       ...dpForm,
//     };
//     if (editingDP)
//       dispatch(updateDailyPlan({ id: editingDP.id, data: payload }));
//     else dispatch(createDailyPlan(payload));
//   }

//   function handleDeleteDP() {
//     if (!editingDP) return;
//     if (window.confirm("Remove this daily plan entry?")) {
//       dispatch(deleteDailyPlan(editingDP.id)).then(() => {
//         setShowDPModal(false);
//         setEditingDP(null);
//         dispatch(getDailyPlans());
//         dispatch(clearDailyPlanDeleteState());
//       });
//     }
//   }

//   // ── Calendar navigation ──────────────────────────────────────────────────────
//   function prevMonth() {
//     if (calMonth === 0) {
//       setCalYear((y) => y - 1);
//       setCalMonth(11);
//     } else setCalMonth((m) => m - 1);
//   }
//   function nextMonth() {
//     if (calMonth === 11) {
//       setCalYear((y) => y + 1);
//       setCalMonth(0);
//     } else setCalMonth((m) => m + 1);
//   }

//   // Is day within travel plan range?
//   function isInRange(day) {
//     if (!selectedTP || !day) return true;
//     const date = new Date(calYear, calMonth, day);
//     const start = parseISODate(selectedTP.start_date);
//     const end = parseISODate(selectedTP.end_date);
//     if (start && date < start) return false;
//     if (end && date > end) return false;
//     return true;
//   }

//   // ── Render ────────────────────────────────────────────────────────────────────
//   return (
//     <div style={styles.page}>
//       {/* ── Top Bar ─────────────────────────────────────────────────── */}
//       <div style={styles.topBar}>
//         <span style={styles.pageTitle}>Travel Plan Manager</span>
//         {/* <button style={styles.primaryBtn} onClick={openCreateTP}>
//           + New Travel Plan
//         </button> */}
//       </div>

//       {/* ── Travel Plan Tabs ─────────────────────────────────────────── */}
//       {travelLoading ? (
//         <div style={styles.loading}>Loading travel plans…</div>
//       ) : (
//         <div style={styles.tabRow}>
//           {travelPlans.map((tp) => (
//             <button
//               key={tp.id}
//               style={{
//                 ...styles.tab,
//                 ...(tp.id === selectedTPId ? styles.tabActive : {}),
//               }}
//               onClick={() => {
//                 setSelectedTPId(tp.id);
//                 const d = parseISODate(tp.start_date);
//                 if (d) {
//                   setCalYear(d.getFullYear());
//                   setCalMonth(d.getMonth());
//                 }
//               }}
//             >
//               {tp.month} — {tp.region}
//             </button>
//           ))}
//         </div>
//       )}

//       {selectedTP && (
//         <>
//           {/* ── Blue Info Table ──────────────────────────────────────── */}
//           <div style={styles.infoCard}>
//             <table style={styles.infoTable}>
//               <tbody>
//                 {[
//                   ["REPORT", "Travel Plan"],
//                   ["MONTH", selectedTP.month],
//                   [
//                     "DATE",
//                     `${selectedTP.start_date} to ${selectedTP.end_date}`,
//                   ],
//                   ["REGION", selectedTP.region],
//                   ["STATE", selectedTP.states],
//                   ["RM", selectedTP.rm],
//                   ["TSM", selectedTP.tsm],
//                 ].map(([label, value]) => (
//                   <tr key={label}>
//                     <td style={styles.infoLabel}>{label}</td>
//                     <td style={styles.infoValue}>{value}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             {/* <div style={styles.infoActions}>
//               <button
//                 style={styles.editBtn}
//                 onClick={() => openEditTP(selectedTP)}
//               >
//                 Edit
//               </button>
//               <button
//                 style={styles.deleteBtn}
//                 onClick={() => handleDeleteTP(selectedTP.id)}
//                 disabled={tpDeleteLoading}
//               >
//                 Delete
//               </button>
//             </div> */}
//           </div>

//           {/* ── Calendar ─────────────────────────────────────────────── */}
//           <div style={styles.calendarCard}>
//             {/* Yellow Header */}
//             <div style={styles.calHeader}>
//               <button style={styles.navBtn} onClick={prevMonth}>
//                 ‹
//               </button>
//               <span style={styles.calTitle}>
//                 {monthYearLabel(calYear, calMonth)}
//               </span>
//               <button style={styles.navBtn} onClick={nextMonth}>
//                 ›
//               </button>
//             </div>

//             {/* Day headers */}
//             <div style={styles.calGrid}>
//               {DAYS.map((d, i) => (
//                 <div
//                   key={d}
//                   style={{
//                     ...styles.dayHeader,
//                     ...(i === 0 ? styles.sunday : {}),
//                   }}
//                 >
//                   <span style={styles.dayFull}>{d}</span>
//                   <span style={styles.dayShort}>{SHORT_DAYS[i]}</span>
//                 </div>
//               ))}

//               {/* Calendar cells */}
//               {weeks.map((week, wi) =>
//                 week.map((day, di) => {
//                   const dateStr = day
//                     ? formatDateISO(calYear, calMonth, day)
//                     : null;
//                   const dpEntry = dateStr ? dailyByDate[dateStr] : null;
//                   const inRange = isInRange(day);
//                   const isEmpty = !day;
//                   const isSunday = di === 0;

//                   return (
//                     <div
//                       key={`${wi}-${di}`}
//                       style={{
//                         ...styles.cell,
//                         ...(isEmpty ? styles.cellEmpty : {}),
//                         ...(!inRange && !isEmpty ? styles.cellOutOfRange : {}),
//                         ...(isSunday && !isEmpty ? styles.cellSunday : {}),
//                         ...(!isEmpty && inRange ? styles.cellClickable : {}),
//                       }}
//                       onClick={() => inRange && !isEmpty && openCellModal(day)}
//                     >
//                       {day && (
//                         <>
//                           <span
//                             style={{
//                               ...styles.dateNum,
//                               ...(isSunday ? styles.sundayNum : {}),
//                             }}
//                           >
//                             {day}
//                           </span>
//                           {dpEntry && (
//                             <div style={styles.dpEntry}>
//                               <span style={styles.dpPlace}>
//                                 📍 {dpEntry.place}
//                               </span>
//                               {dpEntry.notes && (
//                                 <span style={styles.dpNotes}>
//                                   {dpEntry.notes}
//                                 </span>
//                               )}
//                             </div>
//                           )}
//                           {inRange && !dpEntry && (
//                             <span style={styles.addHint}>+ Add</span>
//                           )}
//                         </>
//                       )}
//                     </div>
//                   );
//                 }),
//               )}
//             </div>
//           </div>
//         </>
//       )}

//       {!selectedTP && !travelLoading && (
//         <div style={styles.emptyState}>
//           <p style={styles.emptyText}>No travel plan selected.</p>
//           <button style={styles.primaryBtn} onClick={openCreateTP}>
//             Create your first plan
//           </button>
//         </div>
//       )}

//       {/* ── Travel Plan Modal ─────────────────────────────────────────── */}
//       {showTPModal && (
//         <Modal
//           title={editingTP ? "Edit Travel Plan" : "New Travel Plan"}
//           onClose={() => setShowTPModal(false)}
//         >
//           {/* <Field label="Employee ID">
//             <input
//               style={styles.input}
//               type="number"
//               value={tpForm.employee_id}
//               onChange={(e) =>
//                 setTpForm((f) => ({ ...f, employee_id: e.target.value }))
//               }
//             />
//           </Field> */}
//           <Field label="Employee">
//             <div style={{ position: "relative" }}>
//               <input
//                 style={styles.input}
//                 type="text"
//                 placeholder="Search employee..."
//                 value={employeeSearch}
//                 onChange={(e) => {
//                   setEmployeeSearch(e.target.value);
//                   setShowEmployeeDropdown(true);
//                   // Clear selected employee if user edits the text
//                   setTpForm((f) => ({ ...f, employee_id: "" }));
//                 }}
//                 // onFocus={() => setShowEmployeeDropdown(true)}
//                 onFocus={() => {
//                   setEmployeeSearch("");
//                   setShowEmployeeDropdown(true);
//                   setTpForm((f) => ({ ...f, employee_id: "" }));
//                 }}
//                 // onBlur={() =>
//                 //   setTimeout(() => setShowEmployeeDropdown(false), 150)
//                 // }
//                 onBlur={() => {
//                   setTimeout(() => {
//                     setShowEmployeeDropdown(false);
//                     if (!tpForm.employee_id) {
//                       const emp = employees.find(
//                         (e) => e.id === editingTP?.employee_id,
//                       );
//                       if (emp) {
//                         setEmployeeSearch(
//                           `${emp.first_name} ${emp.last_name} (${emp.employee_code})`,
//                         );
//                         setTpForm((f) => ({
//                           ...f,
//                           employee_id: editingTP.employee_id,
//                         }));
//                       }
//                     }
//                   }, 150);
//                 }}
//               />

//               {showEmployeeDropdown && (
//                 <ul
//                   style={{
//                     position: "absolute",
//                     top: "100%",
//                     left: 0,
//                     right: 0,
//                     background: "#fff",
//                     border: "1px solid #ccc",
//                     borderRadius: 4,
//                     maxHeight: 200,
//                     overflowY: "auto",
//                     zIndex: 1000,
//                     margin: 0,
//                     padding: 0,
//                     listStyle: "none",
//                     boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
//                   }}
//                 >
//                   {employees
//                     .filter((emp) => {
//                       const q = employeeSearch.toLowerCase();
//                       return (
//                         emp.first_name.toLowerCase().includes(q) ||
//                         emp.last_name.toLowerCase().includes(q) ||
//                         emp.employee_code.toLowerCase().includes(q)
//                       );
//                     })
//                     .map((emp) => (
//                       <li
//                         key={emp.id}
//                         onMouseDown={() => {
//                           setTpForm((f) => ({ ...f, employee_id: emp.id }));
//                           setEmployeeSearch(
//                             `${emp.first_name} ${emp.last_name} (${emp.employee_code})`,
//                           );
//                           setShowEmployeeDropdown(false);
//                         }}
//                         style={{
//                           padding: "8px 12px",
//                           cursor: "pointer",
//                           borderBottom: "1px solid #f0f0f0",
//                         }}
//                         onMouseEnter={(e) =>
//                           (e.currentTarget.style.background = "#f5f5f5")
//                         }
//                         onMouseLeave={(e) =>
//                           (e.currentTarget.style.background = "#fff")
//                         }
//                       >
//                         <strong>
//                           {emp.first_name} {emp.last_name}
//                         </strong>{" "}
//                         &nbsp;
//                         <span style={{ color: "#888", fontSize: 12 }}>
//                           {emp.employee_code}
//                         </span>
//                       </li>
//                     ))}

//                   {employees &&
//                     employees?.length > 0 &&
//                     employees?.filter((emp) => {
//                       const q = employeeSearch.toLowerCase();
//                       return (
//                         emp.first_name.toLowerCase().includes(q) ||
//                         emp.last_name.toLowerCase().includes(q) ||
//                         emp.employee_code.toLowerCase().includes(q)
//                       );
//                     }).length === 0 && (
//                       <li style={{ padding: "8px 12px", color: "#aaa" }}>
//                         No employees found
//                       </li>
//                     )}
//                 </ul>
//               )}
//             </div>
//           </Field>
//           <Field label="Month">
//             <select
//               style={styles.input}
//               value={tpForm.month}
//               onChange={(e) =>
//                 setTpForm((f) => ({ ...f, month: e.target.value }))
//               }
//             >
//               <option value="">Select month</option>
//               {MONTHS.map((m) => (
//                 <option key={m} value={m}>
//                   {m}
//                 </option>
//               ))}
//             </select>
//           </Field>
//           <div style={styles.row2}>
//             <Field label="Start Date">
//               <input
//                 style={styles.input}
//                 type="date"
//                 value={tpForm.start_date}
//                 onChange={(e) =>
//                   setTpForm((f) => ({ ...f, start_date: e.target.value }))
//                 }
//               />
//             </Field>
//             <Field label="End Date">
//               <input
//                 style={styles.input}
//                 type="date"
//                 value={tpForm.end_date}
//                 onChange={(e) =>
//                   setTpForm((f) => ({ ...f, end_date: e.target.value }))
//                 }
//               />
//             </Field>
//           </div>
//           <Field label="Region">
//             <input
//               style={styles.input}
//               value={tpForm.region}
//               onChange={(e) =>
//                 setTpForm((f) => ({ ...f, region: e.target.value }))
//               }
//             />
//           </Field>
//           <Field label="States (comma-separated)">
//             <input
//               style={styles.input}
//               value={tpForm.states}
//               onChange={(e) =>
//                 setTpForm((f) => ({ ...f, states: e.target.value }))
//               }
//               placeholder="Gujarat, Maharashtra, Goa…"
//             />
//           </Field>
//           <div style={styles.row2}>
//             <Field label="RM">
//               <input
//                 style={styles.input}
//                 value={tpForm.rm}
//                 onChange={(e) =>
//                   setTpForm((f) => ({ ...f, rm: e.target.value }))
//                 }
//               />
//             </Field>
//             <Field label="TSM">
//               <input
//                 style={styles.input}
//                 value={tpForm.tsm}
//                 onChange={(e) =>
//                   setTpForm((f) => ({ ...f, tsm: e.target.value }))
//                 }
//               />
//             </Field>
//           </div>
//           <div style={styles.modalFooter}>
//             <button
//               style={styles.ghostBtn}
//               onClick={() => setShowTPModal(false)}
//             >
//               Cancel
//             </button>
//             <button
//               style={styles.primaryBtn}
//               onClick={handleTPSubmit}
//               disabled={tpCreateLoading || tpUpdateLoading}
//             >
//               {tpCreateLoading || tpUpdateLoading
//                 ? "Saving…"
//                 : editingTP
//                   ? "Update"
//                   : "Create"}
//             </button>
//           </div>
//         </Modal>
//       )}

//       {/* ── Daily Plan Modal ──────────────────────────────────────────── */}
//       {showDPModal && (
//         <Modal
//           title={
//             editingDP ? `Edit — ${selectedDate}` : `Add Plan — ${selectedDate}`
//           }
//           onClose={() => setShowDPModal(false)}
//         >
//           <Field label="Place / City">
//             <input
//               style={styles.input}
//               value={dpForm.place}
//               onChange={(e) =>
//                 setDpForm((f) => ({ ...f, place: e.target.value }))
//               }
//               placeholder="e.g. Surat"
//             />
//           </Field>
//           <Field label="Notes">
//             <textarea
//               style={{ ...styles.input, minHeight: 90, resize: "vertical" }}
//               value={dpForm.notes}
//               onChange={(e) =>
//                 setDpForm((f) => ({ ...f, notes: e.target.value }))
//               }
//               placeholder="Meeting details, activities…"
//             />
//           </Field>
//           <div style={styles.modalFooter}>
//             {editingDP && (
//               <button
//                 style={styles.deleteBtn}
//                 onClick={handleDeleteDP}
//                 disabled={dpDeleteLoading}
//               >
//                 🗑 Delete
//               </button>
//             )}
//             <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
//               <button
//                 style={styles.ghostBtn}
//                 onClick={() => setShowDPModal(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 style={styles.primaryBtn}
//                 onClick={handleDPSubmit}
//                 disabled={dpCreateLoading || dpUpdateLoading}
//               >
//                 {dpCreateLoading || dpUpdateLoading
//                   ? "Saving…"
//                   : editingDP
//                     ? "Update"
//                     : "Add"}
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// }

// // ─── Styles ────────────────────────────────────────────────────────────────────
// const NAVY = "#0d1a5e";
// const YELLOW = "#f5f07a";
// const BORDER = "#c8c8c8";

// const styles = {
//   page: {
//     fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//     // maxWidth: 1100,
//     margin: "0 auto",
//     padding: "16px 12px 40px",
//     background: "#f4f6fb",
//     minHeight: "100vh",
//   },
//   topBar: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 16,
//     flexWrap: "wrap",
//     gap: 8,
//   },
//   pageTitle: {
//     fontSize: 20,
//     fontWeight: 700,
//     color: NAVY,
//     letterSpacing: 0.5,
//   },
//   tabRow: {
//     display: "flex",
//     flexWrap: "wrap",
//     gap: 8,
//     marginBottom: 16,
//   },
//   tab: {
//     padding: "6px 16px",
//     borderRadius: 4,
//     border: `1px solid ${BORDER}`,
//     background: "#fff",
//     cursor: "pointer",
//     fontSize: 13,
//     color: "#444",
//     fontWeight: 500,
//   },
//   tabActive: {
//     background: NAVY,
//     color: "#fff",
//     borderColor: NAVY,
//   },
//   loading: { textAlign: "center", padding: 32, color: "#666" },

//   // ── Info Card ──────────────────────────────────────────────────────────────
//   infoCard: {
//     background: "#fff",
//     border: `1px solid ${BORDER}`,
//     borderRadius: 4,
//     marginBottom: 20,
//     overflow: "hidden",
//   },
//   infoTable: {
//     width: "100%",
//     borderCollapse: "collapse",
//   },
//   infoLabel: {
//     background: NAVY,
//     color: "#fff",
//     fontWeight: 700,
//     fontSize: 12,
//     letterSpacing: 1,
//     padding: "9px 14px",
//     border: `1px solid #1a2b7a`,
//     width: 130,
//     whiteSpace: "nowrap",
//   },
//   infoValue: {
//     padding: "9px 14px",
//     fontSize: 13,
//     color: "#222",
//     border: `1px solid ${BORDER}`,
//     background: "#fff",
//   },
//   infoActions: {
//     display: "flex",
//     gap: 8,
//     padding: "10px 14px",
//     borderTop: `1px solid ${BORDER}`,
//     background: "#fafafa",
//   },

//   // ── Calendar Card ──────────────────────────────────────────────────────────
//   calendarCard: {
//     background: "#fff",
//     border: `1px solid ${BORDER}`,
//     borderRadius: 4,
//     overflow: "hidden",
//   },
//   calHeader: {
//     background: "linear-gradient(90deg, #D20000 0%, #8B0000 100%)",
//     display: "flex",
//     color: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: "10px 16px",
//     gap: 24,
//     borderBottom: `1px solid ${BORDER}`,
//   },
//   calTitle: {
//     fontWeight: 700,
//     fontSize: 18,
//     // color: "#222",
//     minWidth: 90,
//     textAlign: "center",
//     letterSpacing: 1,
//   },
//   navBtn: {
//     background: "transparent",
//     border: "none",
//     fontSize: 22,
//     cursor: "pointer",
//     // color: "#444",
//     color: "#fff",
//     lineHeight: 1,
//     padding: "0 4px",
//   },
//   calGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(7, 1fr)",
//     borderLeft: `1px solid ${BORDER}`,
//     borderTop: `1px solid ${BORDER}`,
//   },
//   dayHeader: {
//     padding: "10px 6px",
//     textAlign: "center",
//     fontWeight: 600,
//     fontSize: 13,
//     color: "#333",
//     borderRight: `1px solid ${BORDER}`,
//     borderBottom: `1px solid ${BORDER}`,
//     background: "#fafafa",
//     userSelect: "none",
//   },
//   dayFull: { display: "inline" },
//   dayShort: { display: "none" },
//   sunday: { color: "#c0392b" },
//   cell: {
//     minHeight: 90,
//     borderRight: `1px solid ${BORDER}`,
//     borderBottom: `1px solid ${BORDER}`,
//     padding: "4px 6px",
//     verticalAlign: "top",
//     position: "relative",
//     background: "#fff",
//     transition: "background 0.15s",
//   },
//   cellEmpty: { background: "#fafafa" },
//   cellOutOfRange: { background: "#ebebeb" },
//   cellSunday: { background: "#fff8f8" },
//   cellClickable: { cursor: "pointer" },
//   dateNum: {
//     display: "block",
//     textAlign: "right",
//     fontSize: 12,
//     color: "#555",
//     fontWeight: 600,
//     marginBottom: 4,
//   },
//   sundayNum: { color: "#c0392b" },
//   dpEntry: {
//     display: "flex",
//     flexDirection: "column",
//     gap: 2,
//     marginTop: 2,
//   },
//   dpPlace: {
//     fontSize: 11,
//     fontWeight: 600,
//     color: NAVY,
//     background: "#e8ecff",
//     borderRadius: 3,
//     padding: "2px 5px",
//     display: "block",
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//     whiteSpace: "nowrap",
//   },
//   dpNotes: {
//     fontSize: 10,
//     color: "#666",
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//     whiteSpace: "nowrap",
//     display: "block",
//   },
//   addHint: {
//     fontSize: 10,
//     color: "#bbb",
//     position: "absolute",
//     bottom: 4,
//     left: 6,
//     pointerEvents: "none",
//   },

//   // ── Empty State ────────────────────────────────────────────────────────────
//   emptyState: {
//     textAlign: "center",
//     padding: "60px 20px",
//     background: "#fff",
//     borderRadius: 8,
//     border: `1px dashed ${BORDER}`,
//   },
//   emptyText: { color: "#888", marginBottom: 16, fontSize: 15 },

//   // ── Buttons ────────────────────────────────────────────────────────────────
//   primaryBtn: {
//     background: NAVY,
//     color: "#fff",
//     border: "none",
//     borderRadius: 4,
//     padding: "8px 18px",
//     fontSize: 13,
//     fontWeight: 600,
//     cursor: "pointer",
//   },
//   editBtn: {
//     background: "#2980b9",
//     color: "#fff",
//     border: "none",
//     borderRadius: 4,
//     padding: "6px 14px",
//     fontSize: 12,
//     cursor: "pointer",
//   },
//   deleteBtn: {
//     background: "#c0392b",
//     color: "#fff",
//     border: "none",
//     borderRadius: 4,
//     padding: "6px 14px",
//     fontSize: 12,
//     cursor: "pointer",
//   },
//   ghostBtn: {
//     background: "#fff",
//     color: "#333",
//     border: `1px solid ${BORDER}`,
//     borderRadius: 4,
//     padding: "8px 18px",
//     fontSize: 13,
//     cursor: "pointer",
//   },

//   // ── Overlay / Modal ────────────────────────────────────────────────────────
//   overlay: {
//     position: "fixed",
//     inset: 0,
//     background: "rgba(0,0,0,0.45)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     zIndex: 1000,
//     padding: 16,
//   },
//   modal: {
//     background: "#fff",
//     borderRadius: 8,
//     width: "100%",
//     maxWidth: 520,
//     boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
//     maxHeight: "90vh",
//     display: "flex",
//     flexDirection: "column",
//   },
//   modalHeader: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "14px 20px",
//     borderBottom: `1px solid ${BORDER}`,
//     background: NAVY,
//     borderRadius: "8px 8px 0 0",
//   },
//   modalTitle: { fontWeight: 700, fontSize: 15, color: "#fff" },
//   closeBtn: {
//     background: "transparent",
//     border: "none",
//     color: "#fff",
//     fontSize: 18,
//     cursor: "pointer",
//     lineHeight: 1,
//   },
//   modalBody: {
//     padding: "16px 20px",
//     overflowY: "auto",
//     flex: 1,
//   },
//   modalFooter: {
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     paddingTop: 12,
//     marginTop: 4,
//     borderTop: `1px solid ${BORDER}`,
//   },

//   // ── Form ──────────────────────────────────────────────────────────────────
//   field: { marginBottom: 12 },
//   fieldLabel: {
//     display: "block",
//     fontSize: 12,
//     fontWeight: 600,
//     color: "#555",
//     marginBottom: 4,
//     textTransform: "uppercase",
//     letterSpacing: 0.5,
//   },
//   input: {
//     width: "100%",
//     padding: "8px 10px",
//     border: `1px solid ${BORDER}`,
//     borderRadius: 4,
//     fontSize: 13,
//     color: "#222",
//     background: "#fafafa",
//     boxSizing: "border-box",
//     outline: "none",
//     fontFamily: "inherit",
//   },
//   row2: {
//     display: "grid",
//     gridTemplateColumns: "1fr 1fr",
//     gap: 12,
//   },
// };

// // ─── Responsive overrides via <style> injection ───────────────────────────────
// // Inject once to handle media queries (not possible inline)
// if (
//   typeof document !== "undefined" &&
//   !document.getElementById("plan-responsive")
// ) {
//   const tag = document.createElement("style");
//   tag.id = "plan-responsive";
//   tag.textContent = `
//     @media (max-width: 640px) {
//       .plan-day-full { display: none !important; }
//       .plan-day-short { display: inline !important; }
//       .plan-cell { min-height: 60px !important; }
//       .plan-add-hint { display: none !important; }
//       .plan-info-label { width: 80px !important; font-size: 11px !important; }
//     }
//   `;
//   document.head.appendChild(tag);
// }

// import React, { useEffect, useState, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";

// // ─── Travel Plan ─────────────────────────────────────────────────────────────
// import {
//   selectTravelPlanList,
//   selectTravelPlanLoading,
//   selectTravelPlanCreateLoading,
//   selectTravelPlanCreateSuccess,
//   selectTravelPlanUpdateLoading,
//   selectTravelPlanUpdateSuccess,
//   selectTravelPlanDeleteLoading,
// } from "../../feature/tavelPlans/travelPlanSelectors";
// import {
//   getTravelPlans,
//   createTravelPlan,
//   updateTravelPlan,
//   deleteTravelPlan,
// } from "../../feature/tavelPlans/travelPlanThunks";
// import {
//   clearCreateState,
//   clearUpdateState,
//   clearDeleteState,
// } from "../../feature/tavelPlans/travelPlanSlice";

// // ─── Daily Plan ───────────────────────────────────────────────────────────────
// import {
//   selectDailyPlanList,
//   selectDailyPlanCreateLoading,
//   selectDailyPlanCreateSuccess,
//   selectDailyPlanUpdateLoading,
//   selectDailyPlanUpdateSuccess,
//   selectDailyPlanDeleteLoading,
// } from "../../feature/dailyPlans/dailyPlanSelectors";
// import {
//   getDailyPlans,
//   createDailyPlan,
//   updateDailyPlan,
//   deleteDailyPlan,
// } from "../../feature/dailyPlans/dailyPlanThunks";
// import {
//   clearDailyPlanCreateState,
//   clearDailyPlanUpdateState,
//   clearDailyPlanDeleteState,
// } from "../../feature/dailyPlans/dailyPlanSlice";

// // ─── Employee / Region ────────────────────────────────────────────────────────
// import { getEmployees } from "../../feature/employee/employeeThunks";
// import { selectEmployees } from "../../feature/employee/employeeSelector";
// import { getRegions } from "../../feature/region/regionThunks";
// import { selectRegions } from "../../feature/region/regionSelectors";

// // ─── Constants ────────────────────────────────────────────────────────────────
// const MONTHS = [
//   "January",
//   "February",
//   "March",
//   "April",
//   "May",
//   "June",
//   "July",
//   "August",
//   "September",
//   "October",
//   "November",
//   "December",
// ];
// const DAYS = [
//   "Sunday",
//   "Monday",
//   "Tuesday",
//   "Wednesday",
//   "Thursday",
//   "Friday",
//   "Saturday",
// ];
// const S_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// const CATEGORY_COLORS = {
//   "Client Meeting": {
//     bg: "#dbeafe",
//     border: "#93c5fd",
//     text: "#1d4ed8",
//     dot: "#3b82f6",
//   },
//   "Sales Visit": {
//     bg: "#d1fae5",
//     border: "#6ee7b7",
//     text: "#065f46",
//     dot: "#10b981",
//   },
//   Training: {
//     bg: "#fef3c7",
//     border: "#fcd34d",
//     text: "#92400e",
//     dot: "#f59e0b",
//   },
//   Others: { bg: "#ede9fe", border: "#c4b5fd", text: "#5b21b6", dot: "#8b5cf6" },
// };
// const CATEGORIES = Object.keys(CATEGORY_COLORS);

// const AVATAR_BG = [
//   "#3b82f6",
//   "#10b981",
//   "#f59e0b",
//   "#ef4444",
//   "#8b5cf6",
//   "#06b6d4",
//   "#ec4899",
//   "#14b8a6",
// ];
// const BADGE_BG = [
//   "#dbeafe",
//   "#d1fae5",
//   "#fef3c7",
//   "#fce7f3",
//   "#ede9fe",
//   "#cffafe",
//   "#fee2e2",
//   "#d1fae5",
// ];
// const BADGE_TEXT = [
//   "#1d4ed8",
//   "#065f46",
//   "#92400e",
//   "#9d174d",
//   "#5b21b6",
//   "#155e75",
//   "#991b1b",
//   "#065f46",
// ];

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// const getInitials = (f, l) => `${f?.[0] || ""}${l?.[0] || ""}`.toUpperCase();
// const getCat = (c) => CATEGORY_COLORS[c] || CATEGORY_COLORS["Others"];

// function formatDateISO(y, m, d) {
//   return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
// }
// function parseISODate(str) {
//   if (!str) return null;
//   const [y, m, d] = str.split("-").map(Number);
//   return new Date(y, m - 1, d);
// }
// function buildCalendarWeeks(year, month) {
//   const firstDay = new Date(year, month, 1).getDay();
//   const daysInMonth = new Date(year, month + 1, 0).getDate();
//   const prevDays = new Date(year, month, 0).getDate();
//   const weeks = [];
//   let cursor = 1 - firstDay;
//   while (cursor <= daysInMonth) {
//     const week = [];
//     for (let d = 0; d < 7; d++, cursor++) {
//       if (cursor < 1) week.push({ day: prevDays + cursor, overflow: true });
//       else if (cursor > daysInMonth)
//         week.push({ day: cursor - daysInMonth, overflow: true });
//       else week.push({ day: cursor, overflow: false });
//     }
//     weeks.push(week);
//   }
//   return weeks;
// }

// // ─── SVG Icons ────────────────────────────────────────────────────────────────
// const IC = {
//   Briefcase: () => (
//     <svg
//       width="26"
//       height="26"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="1.8"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <rect x="2" y="7" width="20" height="14" rx="2" />
//       <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
//     </svg>
//   ),
//   Calendar: () => (
//     <svg
//       width="26"
//       height="26"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="1.8"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <rect x="3" y="4" width="18" height="18" rx="2" />
//       <line x1="16" y1="2" x2="16" y2="6" />
//       <line x1="8" y1="2" x2="8" y2="6" />
//       <line x1="3" y1="10" x2="21" y2="10" />
//     </svg>
//   ),
//   Plane: () => (
//     <svg
//       width="26"
//       height="26"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="1.8"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19.5 2.5c-1.5-1.5-3.5-1.5-5 0L11 6 2.8 4.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 2.5 1.5L7 20l1-1v-3l3-2 5.2 7.3c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z" />
//     </svg>
//   ),
//   MapPin: () => (
//     <svg
//       width="26"
//       height="26"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="1.8"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
//       <circle cx="12" cy="10" r="3" />
//     </svg>
//   ),
//   ChevL: () => (
//     <svg
//       width="15"
//       height="15"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2.5"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <polyline points="15 18 9 12 15 6" />
//     </svg>
//   ),
//   ChevR: () => (
//     <svg
//       width="15"
//       height="15"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2.5"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <polyline points="9 18 15 12 9 6" />
//     </svg>
//   ),
//   ChevD: () => (
//     <svg
//       width="13"
//       height="13"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2.5"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <polyline points="6 9 12 15 18 9" />
//     </svg>
//   ),
//   Download: () => (
//     <svg
//       width="14"
//       height="14"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
//       <polyline points="7 10 12 15 17 10" />
//       <line x1="12" y1="15" x2="12" y2="3" />
//     </svg>
//   ),
// };

// // ─── Modal ────────────────────────────────────────────────────────────────────
// function Modal({ title, onClose, children }) {
//   return (
//     <div style={S.overlay} onClick={onClose}>
//       <div style={S.modal} onClick={(e) => e.stopPropagation()}>
//         <div style={S.modalHeader}>
//           <span style={S.modalTitle}>{title}</span>
//           <button style={S.closeBtn} onClick={onClose}>
//             ✕
//           </button>
//         </div>
//         <div style={S.modalBody}>{children}</div>
//       </div>
//     </div>
//   );
// }

// function Field({ label, children }) {
//   return (
//     <div style={S.field}>
//       <label style={S.fieldLabel}>{label}</label>
//       {children}
//     </div>
//   );
// }

// // ─── SelectBox ────────────────────────────────────────────────────────────────
// function SelectBox({ value, onChange, children, minWidth = 140 }) {
//   return (
//     <div
//       style={{
//         position: "relative",
//         display: "inline-flex",
//         alignItems: "center",
//       }}
//     >
//       <select
//         value={value}
//         onChange={onChange}
//         style={{ ...S.filterSelect, minWidth }}
//       >
//         {children}
//       </select>
//       <span style={S.selectArrow}>
//         <IC.ChevD />
//       </span>
//     </div>
//   );
// }

// // ─── Main Component ───────────────────────────────────────────────────────────
// export default function Plan() {
//   const dispatch = useDispatch();

//   /* eslint-disable no-unused-vars */
//   const regions = useSelector(selectRegions);

//   // Travel plan Redux
//   const travelPlans = useSelector(selectTravelPlanList);
//   const travelLoading = useSelector(selectTravelPlanLoading);
//   const tpCreateLoading = useSelector(selectTravelPlanCreateLoading);
//   const tpCreateSuccess = useSelector(selectTravelPlanCreateSuccess);
//   const tpUpdateLoading = useSelector(selectTravelPlanUpdateLoading);
//   const tpUpdateSuccess = useSelector(selectTravelPlanUpdateSuccess);
//   const tpDeleteLoading = useSelector(selectTravelPlanDeleteLoading);

//   // Daily plan Redux
//   const dailyPlans = useSelector(selectDailyPlanList);
//   const dpCreateLoading = useSelector(selectDailyPlanCreateLoading);
//   const dpCreateSuccess = useSelector(selectDailyPlanCreateSuccess);
//   const dpUpdateLoading = useSelector(selectDailyPlanUpdateLoading);
//   const dpUpdateSuccess = useSelector(selectDailyPlanUpdateSuccess);
//   const dpDeleteLoading = useSelector(selectDailyPlanDeleteLoading);

//   // Employee Redux
//   const employees = useSelector(selectEmployees);
//   /* eslint-enable no-unused-vars */

//   // ── Calendar / filter state ────────────────────────────────────────────────
//   const [selectedTPId, setSelectedTPId] = useState(null);
//   const [calYear, setCalYear] = useState(new Date().getFullYear());
//   const [calMonth, setCalMonth] = useState(new Date().getMonth());
//   const [viewMode, setViewMode] = useState("calendar"); // "calendar" | "list"
//   const [filterEmployeeId, setFilterEmployeeId] = useState("");
//   const [filterRegion, setFilterRegion] = useState("");

//   // ── Modal state ────────────────────────────────────────────────────────────
//   const [showTPModal, setShowTPModal] = useState(false);
//   const [showDPModal, setShowDPModal] = useState(false);
//   const [editingTP, setEditingTP] = useState(null);
//   const [editingDP, setEditingDP] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [empSearch, setEmpSearch] = useState("");
//   const [showEmpDrop, setShowEmpDrop] = useState(false);

//   const [allTravelPlans, setAllTravelPlans] = useState([]);
//   // ── Forms ──────────────────────────────────────────────────────────────────
//   const [tpForm, setTpForm] = useState({
//     employee_id: "",
//     month: "",
//     start_date: "",
//     end_date: "",
//     region: "",
//     states: "",
//     rm: "",
//     tsm: "",
//   });
//   const [dpForm, setDpForm] = useState({
//     place: "",
//     notes: "",
//     category: "Client Meeting",
//   });

//   // ── Effects ────────────────────────────────────────────────────────────────
//   // useEffect(() => {
//   //   dispatch(getTravelPlans());
//   //   dispatch(getDailyPlans());
//   //   dispatch(getEmployees());
//   // }, [dispatch]);

//   const monthYearChips = useMemo(() => {
//     const set = new Set();
//     const plans = Array.isArray(allTravelPlans) ? allTravelPlans : []; // ← safety
//     plans
//       .filter((tp) => {
//         if (
//           filterEmployeeId &&
//           String(tp.employee_id) !== String(filterEmployeeId)
//         )
//           return false;
//         if (filterRegion && tp.region !== filterRegion) return false;
//         return true;
//       })
//       .forEach((tp) => {
//         if (!tp.start_date) return;
//         const d = parseISODate(tp.start_date);
//         if (!d) return;
//         set.add(`${d.getMonth()}-${d.getFullYear()}`);
//       });
//     return Array.from(set).map((key) => {
//       const [m, y] = key.split("-");
//       return {
//         monthIndex: Number(m),
//         year: Number(y),
//         label: `${MONTHS[m]}-${y}`,
//       };
//     });
//   }, [allTravelPlans, filterEmployeeId, filterRegion]);
//   useEffect(() => {
//     dispatch(getEmployees());
//     dispatch(getDailyPlans());
//   }, [dispatch]);

//   useEffect(() => {
//     dispatch(
//       getTravelPlans({
//         employee_id: filterEmployeeId || "",
//         region: filterRegion || "",
//         month: MONTHS[calMonth],
//         year: calYear,
//       }),
//     );
//   }, [dispatch, filterEmployeeId, filterRegion, calMonth, calYear]);

//   useEffect(() => {
//     if (showTPModal) dispatch(getEmployees());
//   }, [showTPModal]);

//   // Auto-select first plan on initial load
//   useEffect(() => {
//     if (travelPlans.length > 0 && !selectedTPId) {
//       const first = travelPlans[0];
//       setSelectedTPId(first.id);
//       const d = parseISODate(first.start_date);
//       if (d) {
//         setCalYear(d.getFullYear());
//         setCalMonth(d.getMonth());
//       }
//     }
//   }, [travelPlans]); // eslint-disable-line

//   // Auto-select plan when employee filter changes
//   useEffect(() => {
//     if (!filterEmployeeId) return;
//     const match = travelPlans.find((tp) => {
//       if (String(tp.employee_id) !== String(filterEmployeeId)) return false;
//       const s = parseISODate(tp.start_date);
//       return s && s.getFullYear() === calYear && s.getMonth() === calMonth;
//     });
//     if (match) {
//       setSelectedTPId(match.id);
//     } else {
//       const any = travelPlans.find(
//         (tp) => String(tp.employee_id) === String(filterEmployeeId),
//       );
//       if (any) {
//         setSelectedTPId(any.id);
//         const d = parseISODate(any.start_date);
//         if (d) {
//           setCalYear(d.getFullYear());
//           setCalMonth(d.getMonth());
//         }
//       } else {
//         setSelectedTPId(null);
//       }
//     }
//   }, [filterEmployeeId]); // eslint-disable-line

//   // TP modal close on success
//   useEffect(() => {
//     if (tpCreateSuccess || tpUpdateSuccess) {
//       setShowTPModal(false);
//       setEditingTP(null);
//       dispatch(getTravelPlans());
//       dispatch(clearCreateState());
//       dispatch(clearUpdateState());
//     }
//   }, [tpCreateSuccess, tpUpdateSuccess]); // eslint-disable-line

//   // DP modal close on success
//   useEffect(() => {
//     if (dpCreateSuccess || dpUpdateSuccess) {
//       setShowDPModal(false);
//       setEditingDP(null);
//       dispatch(getDailyPlans());
//       dispatch(clearDailyPlanCreateState());
//       dispatch(clearDailyPlanUpdateState());
//     }
//   }, [dpCreateSuccess, dpUpdateSuccess]); // eslint-disable-line
//   useEffect(() => {
//     if (travelPlans.length > 0) {
//       setSelectedTPId(travelPlans[0].id);
//     }
//   }, [travelPlans]);

//   useEffect(() => {
//     dispatch(
//       getTravelPlans({
//         employee_id: filterEmployeeId || "",
//         region: filterRegion || "",
//       }),
//     ).then((res) => {
//       const data = res?.payload;
//       setAllTravelPlans(
//         Array.isArray(data) ? data : data?.results || data?.data || [],
//       );
//     });
//   }, [dispatch, filterEmployeeId, filterRegion]);
//   // ── Derived data ───────────────────────────────────────────────────────────
//   // const filteredTravelPlans = useMemo(
//   //   () =>
//   //     travelPlans.filter((tp) => {
//   //       if (
//   //         filterEmployeeId &&
//   //         String(tp.employee_id) !== String(filterEmployeeId)
//   //       )
//   //         return false;
//   //       if (filterRegion && tp.region !== filterRegion) return false;
//   //       return true;
//   //     }),
//   //   [travelPlans, filterEmployeeId, filterRegion],
//   // );

//   const filteredTravelPlans = travelPlans;
//   const today = useMemo(() => new Date(), []);

//   // Stats: based on current calendar month across ALL plans (not filtered)
//   const currentMonthTPs = useMemo(
//     () =>
//       travelPlans.filter((tp) => {
//         const s = parseISODate(tp.start_date);
//         return s && s.getFullYear() === calYear && s.getMonth() === calMonth;
//       }),
//     [travelPlans, calYear, calMonth],
//   );

//   const stats = useMemo(
//     () => ({
//       totalTrips: currentMonthTPs.length,
//       upcomingTrips: currentMonthTPs.filter((tp) => {
//         const s = parseISODate(tp.start_date);
//         return s && s > today;
//       }).length,
//       completedTrips: currentMonthTPs.filter((tp) => {
//         const e = parseISODate(tp.end_date);
//         return e && e < today;
//       }).length,
//       regionsCovered: new Set(
//         currentMonthTPs.map((tp) => tp.region).filter(Boolean),
//       ).size,
//     }),
//     [currentMonthTPs, today],
//   );

//   // Employee trip counts
//   const empTripCounts = useMemo(() => {
//     const m = {};
//     travelPlans.forEach((tp) => {
//       m[tp.employee_id] = (m[tp.employee_id] || 0) + 1;
//     });
//     return m;
//   }, [travelPlans]);

//   // const employeesWithPlans = useMemo(
//   //   () => employees.filter((e) => empTripCounts[e.id] > 0),
//   //   [employees, empTripCounts],
//   // );

//   const employeesWithPlans = useMemo(
//     () =>
//       employees.filter((e) =>
//         travelPlans.some((tp) => String(tp.employee_id) === String(e.id)),
//       ),
//     [employees, travelPlans],
//   );

//   const uniqueRegions = useMemo(
//     () => [...new Set(travelPlans.map((tp) => tp.region).filter(Boolean))],
//     [travelPlans],
//   );

//   const yearOptions = useMemo(() => {
//     const c = new Date().getFullYear();
//     return [c - 2, c - 1, c, c + 1, c + 2];
//   }, []);

//   const selectedTP = travelPlans.find((tp) => tp.id === selectedTPId) || null;
//   const selectedEmp = employees.find(
//     (e) => String(e.id) === String(selectedTP?.employee_id),
//   );

//   const dailyByDate = useMemo(() => {
//     const m = {};
//     dailyPlans.forEach((dp) => {
//       if (dp.travel_plan === selectedTPId) m[dp.date] = dp;
//     });
//     return m;
//   }, [dailyPlans, selectedTPId]);

//   const weeks = useMemo(
//     () => buildCalendarWeeks(calYear, calMonth),
//     [calYear, calMonth],
//   );

//   const calHeader = `${MONTHS[calMonth]} ${calYear}${selectedEmp ? ` — ${selectedEmp.first_name} ${selectedEmp.last_name}` : ""}`;

//   // ── Travel Plan CRUD ───────────────────────────────────────────────────────
//   function openCreateTP() {
//     setEditingTP(null);
//     setTpForm({
//       employee_id: "",
//       month: "",
//       start_date: "",
//       end_date: "",
//       region: "",
//       states: "",
//       rm: "",
//       tsm: "",
//     });
//     setEmpSearch("");
//     setShowTPModal(true);
//   }
//   function openEditTP(tp) {
//     setEditingTP(tp);
//     setTpForm({
//       employee_id: tp.employee_id,
//       month: tp.month,
//       start_date: tp.start_date,
//       end_date: tp.end_date,
//       region: tp.region,
//       states: tp.states,
//       rm: tp.rm,
//       tsm: tp.tsm,
//     });
//     const emp = employees.find((e) => e.id === tp.employee_id);
//     setEmpSearch(
//       emp ? `${emp.first_name} ${emp.last_name} (${emp.employee_code})` : "",
//     );
//     setShowTPModal(true);
//   }
//   function handleTPSubmit() {
//     const payload = { ...tpForm, employee_id: Number(tpForm.employee_id) };
//     if (editingTP)
//       dispatch(updateTravelPlan({ id: editingTP.id, data: payload }));
//     else dispatch(createTravelPlan(payload));
//   }
//   function handleDeleteTP(id) {
//     if (!window.confirm("Delete this travel plan?")) return;
//     dispatch(deleteTravelPlan(id)).then(() => {
//       if (selectedTPId === id) setSelectedTPId(null);
//       dispatch(getTravelPlans());
//       dispatch(clearDeleteState());
//     });
//   }

//   // ── Employee card click ────────────────────────────────────────────────────
//   // function pickEmployee(emp) {
//   //   const eid = String(emp.id);
//   //   setFilterEmployeeId(eid);
//   //   const match = travelPlans.find((tp) => {
//   //     if (String(tp.employee_id) !== eid) return false;
//   //     const s = parseISODate(tp.start_date);
//   //     return s && s.getFullYear() === calYear && s.getMonth() === calMonth;
//   //   });
//   //   if (match) {
//   //     setSelectedTPId(match.id);
//   //     return;
//   //   }
//   //   const any = travelPlans.find((tp) => String(tp.employee_id) === eid);
//   //   if (any) {
//   //     setSelectedTPId(any.id);
//   //     const d = parseISODate(any.start_date);
//   //     if (d) {
//   //       setCalYear(d.getFullYear());
//   //       setCalMonth(d.getMonth());
//   //     }
//   //   }
//   // }

//   function pickEmployee(emp) {
//     const eid = String(emp.id);
//     setFilterEmployeeId(eid);

//     const match = travelPlans.find((tp) => String(tp.employee_id) === eid);

//     if (match) {
//       setSelectedTPId(match.id);
//     }
//   }
//   // ── Daily Plan CRUD ────────────────────────────────────────────────────────
//   function openCellModal(day) {
//     if (!selectedTPId || !day) return;
//     const ds = formatDateISO(calYear, calMonth, day);
//     setSelectedDate(ds);
//     const ex = dailyByDate[ds];
//     if (ex) {
//       setEditingDP(ex);
//       setDpForm({
//         place: ex.place,
//         notes: ex.notes,
//         category: ex.category || "Client Meeting",
//       });
//     } else {
//       setEditingDP(null);
//       setDpForm({ place: "", notes: "", category: "Client Meeting" });
//     }
//     setShowDPModal(true);
//   }
//   function handleDPSubmit() {
//     const payload = {
//       travel_plan: selectedTPId,
//       date: selectedDate,
//       ...dpForm,
//     };
//     if (editingDP)
//       dispatch(updateDailyPlan({ id: editingDP.id, data: payload }));
//     else dispatch(createDailyPlan(payload));
//   }
//   function handleDeleteDP() {
//     if (!editingDP || !window.confirm("Remove this daily plan entry?")) return;
//     dispatch(deleteDailyPlan(editingDP.id)).then(() => {
//       setShowDPModal(false);
//       setEditingDP(null);
//       dispatch(getDailyPlans());
//       dispatch(clearDailyPlanDeleteState());
//     });
//   }

//   // ── Calendar nav ───────────────────────────────────────────────────────────
//   function prevMonth() {
//     if (calMonth === 0) {
//       setCalYear((y) => y - 1);
//       setCalMonth(11);
//     } else setCalMonth((m) => m - 1);
//   }
//   function nextMonth() {
//     if (calMonth === 11) {
//       setCalYear((y) => y + 1);
//       setCalMonth(0);
//     } else setCalMonth((m) => m + 1);
//   }
//   function goToday() {
//     const n = new Date();
//     setCalYear(n.getFullYear());
//     setCalMonth(n.getMonth());
//   }

//   function isInRange(day) {
//     if (!selectedTP || !day) return true;
//     const date = new Date(calYear, calMonth, day);
//     const start = parseISODate(selectedTP.start_date);
//     const end = parseISODate(selectedTP.end_date);
//     if (start && date < start) return false;
//     if (end && date > end) return false;
//     return true;
//   }

//   // ── Render ─────────────────────────────────────────────────────────────────
//   return (
//     <div style={S.page}>
//       {/* ── Page Header ─────────────────────────────────────────────── */}
//       <div style={S.pageHeader}>
//         <div>
//           <h1 style={S.pageTitle}>Travel Plan Manager</h1>
//           <p style={S.pageSubtitle}>View and manage employee travel plans</p>
//         </div>
//         <button style={S.addBtn} onClick={openCreateTP}>
//           + Add Travel Plan
//         </button>
//       </div>

//       {/* ── Filter Bar ──────────────────────────────────────────────── */}
//       <div style={S.filterCard}>
//         {/* Employee */}
//         <div style={S.fg}>
//           <span style={S.fl}>Employee</span>
//           <SelectBox
//             value={filterEmployeeId}
//             // onChange={(e) => {
//             //   setFilterEmployeeId(e.target.value);
//             //   setSelectedTPId(null);
//             // }}
//             onChange={(e) => {
//               setFilterEmployeeId(e.target.value);
//               setSelectedTPId(null);
//             }}
//             minWidth={160}
//           >
//             <option value="">Select Employee</option>
//             {employees.map((emp) => (
//               <option key={emp.id} value={emp.id}>
//                 {emp.first_name} {emp.last_name}
//               </option>
//             ))}
//           </SelectBox>
//         </div>

//         {/* Year */}
//         <div style={S.fg}>
//           <span style={S.fl}>Year</span>
//           <SelectBox
//             value={calYear}
//             onChange={(e) => setCalYear(Number(e.target.value))}
//             minWidth={90}
//           >
//             {yearOptions.map((y) => (
//               <option key={y} value={y}>
//                 {y}
//               </option>
//             ))}
//           </SelectBox>
//         </div>

//         {/* Month */}
//         <div style={S.fg}>
//           <span style={S.fl}>Month</span>
//           <SelectBox
//             value={calMonth}
//             onChange={(e) => setCalMonth(Number(e.target.value))}
//             minWidth={110}
//           >
//             {MONTHS.map((m, i) => (
//               <option key={m} value={i}>
//                 {m}
//               </option>
//             ))}
//           </SelectBox>
//         </div>

//         {/* Region */}
//         <div style={S.fg}>
//           <span style={S.fl}>Region</span>
//           <SelectBox
//             value={filterRegion}
//             // onChange={(e) => setFilterRegion(e.target.value)}
//             onChange={(e) => {
//               setFilterRegion(e.target.value);
//               setFilterEmployeeId("");
//               setSelectedTPId(null);
//             }}
//             minWidth={100}
//           >
//             <option value="">All</option>
//             {uniqueRegions.map((r) => (
//               <option key={r} value={r}>
//                 {r}
//               </option>
//             ))}
//           </SelectBox>
//         </div>
//       </div>

//       <div style={S.chipContainer}>
//         {monthYearChips.map((chip) => {
//           const isActive =
//             chip.monthIndex === calMonth && chip.year === calYear;
//           return (
//             <div
//               key={`${chip.monthIndex}-${chip.year}`}
//               style={{ ...S.chip, ...(isActive ? S.chipActive : {}) }}
//               onClick={() => {
//                 setCalMonth(chip.monthIndex);
//                 setCalYear(chip.year);
//                 const match = allTravelPlans.find((tp) => {
//                   if (
//                     filterEmployeeId &&
//                     String(tp.employee_id) !== String(filterEmployeeId)
//                   )
//                     return false;
//                   if (filterRegion && tp.region !== filterRegion) return false;
//                   const d = parseISODate(tp.start_date);
//                   return (
//                     d &&
//                     d.getMonth() === chip.monthIndex &&
//                     d.getFullYear() === chip.year
//                   );
//                 });
//                 setSelectedTPId(match ? match.id : null);
//               }}
//             >
//               {chip.label}{" "}
//               {/* ← THIS must be chip.label not chip.name or anything else */}
//             </div>
//           );
//         })}
//       </div>

//       {/* ── Employee Travel Plans ────────────────────────────────────── */}
//       {employeesWithPlans.length > 0 && (
//         <div style={S.chipContainer}>
//           <div
//             style={{
//               ...S.chip,
//               ...(filterEmployeeId === "" ? S.chipActive : {}),
//             }}
//             onClick={() => {
//               setFilterEmployeeId("");
//               setSelectedTPId(null);
//             }}
//           >
//             All
//           </div>
//           {employeesWithPlans.map((emp) => {
//             const isSelected = String(emp.id) === String(filterEmployeeId);
//             const trips = empTripCounts[emp.id] || 0;
//             return (
//               <div
//                 key={emp.id}
//                 style={{ ...S.chip, ...(isSelected ? S.chipActive : {}) }}
//                 onClick={() => pickEmployee(emp)}
//               >
//                 {emp.first_name} {emp.last_name}
//                 <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.75 }}>
//                   ({trips})
//                 </span>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Month-Year chips BELOW employee chips */}
//       <div style={S.chipContainer}>
//         {monthYearChips.map((chip) => {
//           const isActive =
//             chip.monthIndex === calMonth && chip.year === calYear;
//           return (
//             <div
//               key={`${chip.monthIndex}-${chip.year}`}
//               style={{ ...S.chip, ...(isActive ? S.chipActive : {}) }}
//               onClick={() => {
//                 setCalMonth(chip.monthIndex);
//                 setCalYear(chip.year);
//                 const match = allTravelPlans.find((tp) => {
//                   if (
//                     filterEmployeeId &&
//                     String(tp.employee_id) !== String(filterEmployeeId)
//                   )
//                     return false;
//                   if (filterRegion && tp.region !== filterRegion) return false;
//                   const d = parseISODate(tp.start_date);
//                   return (
//                     d &&
//                     d.getMonth() === chip.monthIndex &&
//                     d.getFullYear() === chip.year
//                   );
//                 });
//                 setSelectedTPId(match ? match.id : null);
//               }}
//             >
//               {chip.label}
//             </div>
//           );
//         })}
//       </div>

//       {/* ── Calendar View ────────────────────────────────────────────── */}
//       {viewMode === "calendar" && (
//         <div style={S.calCard}>
//           {/* Cal Header */}
//           <div style={S.calHead}>
//             <span style={S.calTitle}>{calHeader}</span>
//             <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
//               <button style={S.navBtn} onClick={prevMonth}>
//                 <IC.ChevL />
//               </button>
//               <button style={S.todayBtn} onClick={goToday}>
//                 Today
//               </button>
//               <button style={S.navBtn} onClick={nextMonth}>
//                 <IC.ChevR />
//               </button>
//             </div>
//           </div>

//           {/* Day Labels */}
//           <div style={S.calGrid}>
//             {DAYS.map((d, i) => (
//               <div
//                 key={d}
//                 style={{ ...S.dayHdr, ...(i === 0 ? S.sunHdr : {}) }}
//               >
//                 <span className="plan-day-full">{d}</span>
//                 <span className="plan-day-short">{S_DAYS[i]}</span>
//               </div>
//             ))}

//             {/* Cells */}
//             {weeks.map((week, wi) =>
//               week.map(({ day, overflow }, di) => {
//                 const dateStr = !overflow
//                   ? formatDateISO(calYear, calMonth, day)
//                   : null;
//                 const dpEntry = dateStr ? dailyByDate[dateStr] : null;
//                 const inRange = !overflow && isInRange(day);
//                 const isSun = di === 0;
//                 const isToday =
//                   !overflow &&
//                   today.getFullYear() === calYear &&
//                   today.getMonth() === calMonth &&
//                   today.getDate() === day;
//                 const catColor = dpEntry ? getCat(dpEntry.category) : null;

//                 return (
//                   <div
//                     key={`${wi}-${di}`}
//                     className="plan-cell"
//                     style={{
//                       ...S.cell,
//                       ...(overflow ? S.cellOverflow : {}),
//                       ...(!inRange && !overflow ? S.cellNoRange : {}),
//                       ...(!overflow && inRange ? { cursor: "pointer" } : {}),
//                     }}
//                     onClick={() => inRange && !overflow && openCellModal(day)}
//                   >
//                     {/* Date number */}
//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "flex-end",
//                         marginBottom: 4,
//                       }}
//                     >
//                       <span
//                         style={{
//                           fontSize: 13,
//                           fontWeight: isToday ? 700 : 500,
//                           color: overflow
//                             ? "#d1d5db"
//                             : isToday
//                               ? "#fff"
//                               : isSun
//                                 ? "#ef4444"
//                                 : "#374151",
//                           background: isToday ? NAVY : "transparent",
//                           borderRadius: isToday ? "50%" : 0,
//                           width: isToday ? 24 : "auto",
//                           height: isToday ? 24 : "auto",
//                           display: "inline-flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           lineHeight: 1,
//                         }}
//                       >
//                         {day}
//                       </span>
//                     </div>

//                     {/* Entry pill */}
//                     {!overflow && dpEntry && catColor && (
//                       <div
//                         style={{
//                           background: catColor.bg,
//                           borderLeft: `3px solid ${catColor.dot}`,
//                           borderRadius: 4,
//                           padding: "4px 7px",
//                           marginBottom: 3,
//                         }}
//                       >
//                         <span
//                           style={{
//                             fontSize: 12,
//                             fontWeight: 600,
//                             color: catColor.text,
//                             display: "block",
//                             overflow: "hidden",
//                             textOverflow: "ellipsis",
//                             whiteSpace: "nowrap",
//                           }}
//                         >
//                           {dpEntry.place}
//                         </span>
//                         {(dpEntry.category || dpEntry.notes) && (
//                           <span
//                             style={{
//                               fontSize: 11,
//                               color: catColor.text,
//                               opacity: 0.8,
//                               display: "block",
//                               overflow: "hidden",
//                               textOverflow: "ellipsis",
//                               whiteSpace: "nowrap",
//                             }}
//                           >
//                             {dpEntry.category || dpEntry.notes}
//                           </span>
//                         )}
//                       </div>
//                     )}

//                     {/* Add hint */}
//                     {!overflow && inRange && !dpEntry && (
//                       <span className="plan-add-hint" style={S.addHint}>
//                         + Add
//                       </span>
//                     )}
//                   </div>
//                 );
//               }),
//             )}
//           </div>

//           {/* Legend */}
//           <div style={S.legend}>
//             {CATEGORIES.map((cat) => (
//               <div
//                 key={cat}
//                 style={{ display: "flex", alignItems: "center", gap: 6 }}
//               >
//                 <span
//                   style={{
//                     width: 10,
//                     height: 10,
//                     borderRadius: "50%",
//                     background: CATEGORY_COLORS[cat].dot,
//                     flexShrink: 0,
//                   }}
//                 />
//                 <span style={{ fontSize: 12, color: "#6b7280" }}>{cat}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* ── List View ────────────────────────────────────────────────── */}
//       {viewMode === "list" && (
//         <div style={S.listCard}>
//           {travelLoading ? (
//             <div style={{ textAlign: "center", padding: 40, color: "#999" }}>
//               Loading…
//             </div>
//           ) : (
//             <table style={{ width: "100%", borderCollapse: "collapse" }}>
//               <thead>
//                 <tr>
//                   {[
//                     "Employee",
//                     "Month",
//                     "Start Date",
//                     "End Date",
//                     "Region",
//                     "State",
//                     "RM",
//                     "TSM",
//                     "",
//                   ].map((h) => (
//                     <th key={h} style={S.th}>
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredTravelPlans.length === 0 ? (
//                   <tr>
//                     <td
//                       colSpan={9}
//                       style={{
//                         textAlign: "center",
//                         padding: 40,
//                         color: "#999",
//                       }}
//                     >
//                       No travel plans found.
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredTravelPlans.map((tp, i) => {
//                     const emp = employees.find(
//                       (e) => String(e.id) === String(tp.employee_id),
//                     );
//                     return (
//                       <tr
//                         key={tp.id}
//                         style={{ background: i % 2 === 0 ? "#fff" : "#f9fafb" }}
//                       >
//                         <td style={S.td}>
//                           {emp
//                             ? `${emp.first_name} ${emp.last_name}`
//                             : tp.employee_id}
//                         </td>
//                         <td style={S.td}>{tp.month}</td>
//                         <td style={S.td}>{tp.start_date}</td>
//                         <td style={S.td}>{tp.end_date}</td>
//                         <td style={S.td}>{tp.region}</td>
//                         <td style={S.td}>{tp.states}</td>
//                         <td style={S.td}>{tp.rm}</td>
//                         <td style={S.td}>{tp.tsm}</td>
//                         <td style={S.td}>
//                           <div style={{ display: "flex", gap: 6 }}>
//                             <button
//                               style={S.tblEditBtn}
//                               onClick={() => {
//                                 setSelectedTPId(tp.id);
//                                 setViewMode("calendar");
//                                 const d = parseISODate(tp.start_date);
//                                 if (d) {
//                                   setCalYear(d.getFullYear());
//                                   setCalMonth(d.getMonth());
//                                 }
//                               }}
//                             >
//                               View
//                             </button>
//                             <button
//                               style={S.tblEditBtn}
//                               onClick={() => openEditTP(tp)}
//                             >
//                               Edit
//                             </button>
//                             <button
//                               style={S.tblDelBtn}
//                               onClick={() => handleDeleteTP(tp.id)}
//                             >
//                               Del
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           )}
//         </div>
//       )}

//       {/* ── Travel Plan Modal ────────────────────────────────────────── */}
//       {showTPModal && (
//         <Modal
//           title={editingTP ? "Edit Travel Plan" : "New Travel Plan"}
//           onClose={() => setShowTPModal(false)}
//         >
//           <Field label="Employee">
//             <div style={{ position: "relative" }}>
//               <input
//                 style={S.input}
//                 type="text"
//                 placeholder="Search employee…"
//                 value={empSearch}
//                 onChange={(e) => {
//                   setEmpSearch(e.target.value);
//                   setShowEmpDrop(true);
//                   setTpForm((f) => ({ ...f, employee_id: "" }));
//                 }}
//                 onFocus={() => {
//                   setEmpSearch("");
//                   setShowEmpDrop(true);
//                   setTpForm((f) => ({ ...f, employee_id: "" }));
//                 }}
//                 onBlur={() =>
//                   setTimeout(() => {
//                     setShowEmpDrop(false);
//                     if (!tpForm.employee_id) {
//                       const emp = employees.find(
//                         (e) => e.id === editingTP?.employee_id,
//                       );
//                       if (emp) {
//                         setEmpSearch(
//                           `${emp.first_name} ${emp.last_name} (${emp.employee_code})`,
//                         );
//                         setTpForm((f) => ({
//                           ...f,
//                           employee_id: editingTP.employee_id,
//                         }));
//                       }
//                     }
//                   }, 150)
//                 }
//               />
//               {showEmpDrop && (
//                 <ul style={S.empDrop}>
//                   {employees
//                     .filter((emp) => {
//                       const q = empSearch.toLowerCase();
//                       return (
//                         emp.first_name.toLowerCase().includes(q) ||
//                         emp.last_name.toLowerCase().includes(q) ||
//                         emp.employee_code.toLowerCase().includes(q)
//                       );
//                     })
//                     .map((emp) => (
//                       <li
//                         key={emp.id}
//                         style={S.empDropItem}
//                         onMouseDown={() => {
//                           setTpForm((f) => ({ ...f, employee_id: emp.id }));
//                           setEmpSearch(
//                             `${emp.first_name} ${emp.last_name} (${emp.employee_code})`,
//                           );
//                           setShowEmpDrop(false);
//                         }}
//                         onMouseEnter={(e) =>
//                           (e.currentTarget.style.background = "#f5f5f5")
//                         }
//                         onMouseLeave={(e) =>
//                           (e.currentTarget.style.background = "#fff")
//                         }
//                       >
//                         <strong>
//                           {emp.first_name} {emp.last_name}
//                         </strong>
//                         &nbsp;
//                         <span style={{ color: "#888", fontSize: 12 }}>
//                           {emp.employee_code}
//                         </span>
//                       </li>
//                     ))}
//                   {employees.filter((emp) => {
//                     const q = empSearch.toLowerCase();
//                     return (
//                       emp.first_name.toLowerCase().includes(q) ||
//                       emp.last_name.toLowerCase().includes(q) ||
//                       emp.employee_code.toLowerCase().includes(q)
//                     );
//                   }).length === 0 && (
//                     <li
//                       style={{
//                         padding: "10px 12px",
//                         color: "#aaa",
//                         fontSize: 13,
//                       }}
//                     >
//                       No employees found
//                     </li>
//                   )}
//                 </ul>
//               )}
//             </div>
//           </Field>

//           <Field label="Month">
//             <select
//               style={S.input}
//               value={tpForm.month}
//               onChange={(e) =>
//                 setTpForm((f) => ({ ...f, month: e.target.value }))
//               }
//             >
//               <option value="">Select month</option>
//               {MONTHS.map((m) => (
//                 <option key={m} value={m}>
//                   {m}
//                 </option>
//               ))}
//             </select>
//           </Field>

//           <div style={S.row2}>
//             <Field label="Start Date">
//               <input
//                 style={S.input}
//                 type="date"
//                 value={tpForm.start_date}
//                 onChange={(e) =>
//                   setTpForm((f) => ({ ...f, start_date: e.target.value }))
//                 }
//               />
//             </Field>
//             <Field label="End Date">
//               <input
//                 style={S.input}
//                 type="date"
//                 value={tpForm.end_date}
//                 onChange={(e) =>
//                   setTpForm((f) => ({ ...f, end_date: e.target.value }))
//                 }
//               />
//             </Field>
//           </div>

//           <Field label="Region">
//             <input
//               style={S.input}
//               value={tpForm.region}
//               onChange={(e) =>
//                 setTpForm((f) => ({ ...f, region: e.target.value }))
//               }
//             />
//           </Field>

//           <Field label="States (comma-separated)">
//             <input
//               style={S.input}
//               value={tpForm.states}
//               onChange={(e) =>
//                 setTpForm((f) => ({ ...f, states: e.target.value }))
//               }
//               placeholder="Gujarat, Maharashtra, Goa…"
//             />
//           </Field>

//           <div style={S.row2}>
//             <Field label="RM">
//               <input
//                 style={S.input}
//                 value={tpForm.rm}
//                 onChange={(e) =>
//                   setTpForm((f) => ({ ...f, rm: e.target.value }))
//                 }
//               />
//             </Field>
//             <Field label="TSM">
//               <input
//                 style={S.input}
//                 value={tpForm.tsm}
//                 onChange={(e) =>
//                   setTpForm((f) => ({ ...f, tsm: e.target.value }))
//                 }
//               />
//             </Field>
//           </div>

//           <div style={S.modalFoot}>
//             {editingTP && (
//               <button
//                 style={S.deleteBtn}
//                 onClick={() => {
//                   handleDeleteTP(editingTP.id);
//                   setShowTPModal(false);
//                 }}
//                 disabled={tpDeleteLoading}
//               >
//                 🗑 Delete
//               </button>
//             )}
//             <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
//               <button style={S.ghostBtn} onClick={() => setShowTPModal(false)}>
//                 Cancel
//               </button>
//               <button
//                 style={S.primaryBtn}
//                 onClick={handleTPSubmit}
//                 disabled={tpCreateLoading || tpUpdateLoading}
//               >
//                 {tpCreateLoading || tpUpdateLoading
//                   ? "Saving…"
//                   : editingTP
//                     ? "Update"
//                     : "Create"}
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}

//       {/* ── Daily Plan Modal ─────────────────────────────────────────── */}
//       {showDPModal && (
//         <Modal
//           title={
//             editingDP ? `Edit — ${selectedDate}` : `Add Plan — ${selectedDate}`
//           }
//           onClose={() => setShowDPModal(false)}
//         >
//           <Field label="Place / City">
//             <input
//               style={S.input}
//               value={dpForm.place}
//               onChange={(e) =>
//                 setDpForm((f) => ({ ...f, place: e.target.value }))
//               }
//               placeholder="e.g. Surat"
//             />
//           </Field>

//           <Field label="Activity Type">
//             <select
//               style={S.input}
//               value={dpForm.category}
//               onChange={(e) =>
//                 setDpForm((f) => ({ ...f, category: e.target.value }))
//               }
//             >
//               {CATEGORIES.map((c) => (
//                 <option key={c} value={c}>
//                   {c}
//                 </option>
//               ))}
//             </select>
//           </Field>

//           <Field label="Notes">
//             <textarea
//               style={{ ...S.input, minHeight: 80, resize: "vertical" }}
//               value={dpForm.notes}
//               onChange={(e) =>
//                 setDpForm((f) => ({ ...f, notes: e.target.value }))
//               }
//               placeholder="Meeting details, activities…"
//             />
//           </Field>

//           <div style={S.modalFoot}>
//             {editingDP && (
//               <button
//                 style={S.deleteBtn}
//                 onClick={handleDeleteDP}
//                 disabled={dpDeleteLoading}
//               >
//                 🗑 Delete
//               </button>
//             )}
//             <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
//               <button style={S.ghostBtn} onClick={() => setShowDPModal(false)}>
//                 Cancel
//               </button>
//               <button
//                 style={S.primaryBtn}
//                 onClick={handleDPSubmit}
//                 disabled={dpCreateLoading || dpUpdateLoading}
//               >
//                 {dpCreateLoading || dpUpdateLoading
//                   ? "Saving…"
//                   : editingDP
//                     ? "Update"
//                     : "Add"}
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// }

// // ─── Styles ────────────────────────────────────────────────────────────────────
// const NAVY = "#0d1a5e";
// const BORDER = "#e5e7eb";
// const BG = "#f9fafb";

// const S = {
//   // ── Page ──────────────────────────────────────────────────────────────────
//   page: {
//     fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
//     margin: "0 auto",
//     padding: "24px 28px 60px",
//     background: BG,
//     minHeight: "100vh",
//   },
//   pageHeader: {
//     display: "flex",
//     alignItems: "flex-start",
//     justifyContent: "space-between",
//     marginBottom: 24,
//     gap: 12,
//   },
//   pageTitle: {
//     margin: 0,
//     fontSize: 24,
//     fontWeight: 700,
//     color: "#111827",
//     letterSpacing: -0.3,
//   },
//   pageSubtitle: { margin: "4px 0 0", fontSize: 13, color: "#6b7280" },
//   addBtn: {
//     background: NAVY,
//     color: "#fff",
//     border: "none",
//     borderRadius: 8,
//     padding: "10px 20px",
//     fontSize: 14,
//     fontWeight: 600,
//     cursor: "pointer",
//     whiteSpace: "nowrap",
//     flexShrink: 0,
//   },

//   // ── Filter Bar ────────────────────────────────────────────────────────────
//   filterCard: {
//     background: "#fff",
//     border: `1px solid ${BORDER}`,
//     borderRadius: 12,
//     padding: "16px 20px",
//     display: "flex",
//     alignItems: "flex-end",
//     gap: 14,
//     marginBottom: 20,
//     flexWrap: "wrap",
//   },
//   fg: { display: "flex", flexDirection: "column", gap: 5 },
//   fl: { fontSize: 12, fontWeight: 600, color: "#374151", letterSpacing: 0.2 },
//   filterSelect: {
//     appearance: "none",
//     WebkitAppearance: "none",
//     border: `1px solid ${BORDER}`,
//     borderRadius: 8,
//     padding: "8px 34px 8px 12px",
//     fontSize: 13,
//     color: "#374151",
//     background: "#fff",
//     cursor: "pointer",
//     outline: "none",
//     fontFamily: "inherit",
//   },
//   selectArrow: {
//     position: "absolute",
//     right: 10,
//     pointerEvents: "none",
//     color: "#9ca3af",
//     display: "flex",
//     alignItems: "center",
//   },
//   viewToggle: {
//     display: "flex",
//     border: `1px solid ${BORDER}`,
//     borderRadius: 8,
//     overflow: "hidden",
//   },
//   toggleBtn: {
//     padding: "8px 16px",
//     border: "none",
//     background: "#fff",
//     fontSize: 13,
//     cursor: "pointer",
//     color: "#374151",
//     fontFamily: "inherit",
//     fontWeight: 500,
//   },
//   toggleActive: { background: NAVY, color: "#fff" },
//   exportBtn: {
//     display: "flex",
//     alignItems: "center",
//     gap: 5,
//     border: `1px solid ${BORDER}`,
//     borderRadius: 8,
//     padding: "8px 16px",
//     fontSize: 13,
//     background: "#fff",
//     cursor: "pointer",
//     color: "#374151",
//     fontWeight: 500,
//     fontFamily: "inherit",
//   },

//   // ── Stats ─────────────────────────────────────────────────────────────────
//   statsGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(4, 1fr)",
//     gap: 16,
//     marginBottom: 20,
//   },
//   statCard: {
//     background: "#fff",
//     border: `1px solid ${BORDER}`,
//     borderRadius: 12,
//     padding: "20px 22px",
//     display: "flex",
//     alignItems: "center",
//     gap: 16,
//   },
//   statIcon: {
//     width: 56,
//     height: 56,
//     borderRadius: 12,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     flexShrink: 0,
//   },
//   statInfo: { display: "flex", flexDirection: "column" },
//   statLabel: {
//     fontSize: 12,
//     color: "#6b7280",
//     fontWeight: 500,
//     marginBottom: 2,
//   },
//   statValue: {
//     fontSize: 30,
//     fontWeight: 700,
//     color: "#111827",
//     lineHeight: 1.1,
//   },
//   statSub: { fontSize: 11, color: "#9ca3af", marginTop: 3 },

//   // ── Employee Section ──────────────────────────────────────────────────────
//   empSection: {
//     background: "#fff",
//     border: `1px solid ${BORDER}`,
//     borderRadius: 12,
//     padding: "20px",
//     marginBottom: 20,
//   },
//   empSecHead: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 16,
//   },
//   empSecTitle: { fontSize: 16, fontWeight: 700, color: "#111827" },
//   viewAllBtn: {
//     background: "none",
//     border: "none",
//     color: "#3b82f6",
//     fontSize: 13,
//     cursor: "pointer",
//     fontWeight: 500,
//     padding: 0,
//   },
//   empCards: { display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4 },
//   empCard: {
//     display: "flex",
//     alignItems: "center",
//     gap: 12,
//     padding: "14px 18px",
//     border: `1px solid ${BORDER}`,
//     borderRadius: 10,
//     cursor: "pointer",
//     background: "#fff",
//     flexShrink: 0,
//     transition: "all 0.15s",
//     minWidth: 190,
//   },
//   empCardSel: { border: `2px solid ${NAVY}`, background: "#f0f3ff" },
//   empAvatar: {
//     width: 46,
//     height: 46,
//     borderRadius: "50%",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     color: "#fff",
//     fontWeight: 700,
//     fontSize: 15,
//     flexShrink: 0,
//   },
//   empInfo: { display: "flex", flexDirection: "column", gap: 2 },
//   empName: { fontSize: 13, fontWeight: 600, color: "#111827" },
//   empDesig: { fontSize: 11, color: "#6b7280" },
//   tripBadge: {
//     display: "inline-block",
//     padding: "2px 9px",
//     borderRadius: 20,
//     fontSize: 11,
//     fontWeight: 600,
//     marginTop: 5,
//     alignSelf: "flex-start",
//   },

//   // ── Calendar ──────────────────────────────────────────────────────────────
//   calCard: {
//     background: "#fff",
//     border: `1px solid ${BORDER}`,
//     borderRadius: 12,
//     overflow: "hidden",
//   },
//   calHead: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "16px 20px",
//     borderBottom: `1px solid ${BORDER}`,
//   },
//   calTitle: { fontSize: 16, fontWeight: 700, color: "#111827" },
//   navBtn: {
//     width: 32,
//     height: 32,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     border: `1px solid ${BORDER}`,
//     borderRadius: 7,
//     background: "#fff",
//     cursor: "pointer",
//     color: "#374151",
//   },
//   todayBtn: {
//     padding: "6px 14px",
//     border: `1px solid ${BORDER}`,
//     borderRadius: 7,
//     background: "#fff",
//     cursor: "pointer",
//     fontSize: 13,
//     color: "#374151",
//     fontFamily: "inherit",
//     fontWeight: 500,
//   },
//   calGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(7, 1fr)",
//   },
//   dayHdr: {
//     padding: "10px 8px",
//     textAlign: "center",
//     fontWeight: 600,
//     fontSize: 13,
//     color: "#6b7280",
//     borderBottom: `1px solid ${BORDER}`,
//     borderRight: `1px solid ${BORDER}`,
//     background: "#f9fafb",
//   },
//   sunHdr: { color: "#ef4444" },
//   cell: {
//     minHeight: 100,
//     borderRight: `1px solid ${BORDER}`,
//     borderBottom: `1px solid ${BORDER}`,
//     padding: "6px 8px",
//     position: "relative",
//     background: "#fff",
//     transition: "background 0.1s",
//     verticalAlign: "top",
//   },
//   cellOverflow: { background: "#f9fafb" },
//   cellNoRange: { background: "#f3f4f6" },
//   addHint: {
//     fontSize: 11,
//     color: "#d1d5db",
//     position: "absolute",
//     bottom: 6,
//     left: 8,
//     pointerEvents: "none",
//   },
//   legend: {
//     display: "flex",
//     gap: 24,
//     padding: "12px 20px",
//     borderTop: `1px solid ${BORDER}`,
//     flexWrap: "wrap",
//   },

//   // ── List View ─────────────────────────────────────────────────────────────
//   listCard: {
//     background: "#fff",
//     border: `1px solid ${BORDER}`,
//     borderRadius: 12,
//     overflow: "hidden",
//   },
//   th: {
//     padding: "12px 14px",
//     textAlign: "left",
//     fontSize: 12,
//     fontWeight: 600,
//     color: "#6b7280",
//     background: "#f9fafb",
//     borderBottom: `1px solid ${BORDER}`,
//     whiteSpace: "nowrap",
//   },
//   td: {
//     padding: "12px 14px",
//     fontSize: 13,
//     color: "#374151",
//     borderBottom: `1px solid ${BORDER}`,
//   },
//   tblEditBtn: {
//     padding: "4px 10px",
//     fontSize: 12,
//     border: `1px solid ${BORDER}`,
//     borderRadius: 5,
//     background: "#fff",
//     cursor: "pointer",
//     color: "#374151",
//   },
//   tblDelBtn: {
//     padding: "4px 10px",
//     fontSize: 12,
//     border: "none",
//     borderRadius: 5,
//     background: "#fee2e2",
//     cursor: "pointer",
//     color: "#dc2626",
//   },

//   // ── Modal ─────────────────────────────────────────────────────────────────
//   overlay: {
//     position: "fixed",
//     inset: 0,
//     background: "rgba(0,0,0,0.45)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     zIndex: 1000,
//     padding: 16,
//   },
//   modal: {
//     background: "#fff",
//     borderRadius: 12,
//     width: "100%",
//     maxWidth: 520,
//     boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
//     maxHeight: "90vh",
//     display: "flex",
//     flexDirection: "column",
//   },
//   modalHeader: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "16px 20px",
//     borderBottom: `1px solid ${BORDER}`,
//     background: NAVY,
//     borderRadius: "12px 12px 0 0",
//   },
//   modalTitle: { fontWeight: 700, fontSize: 15, color: "#fff" },
//   closeBtn: {
//     background: "transparent",
//     border: "none",
//     color: "#fff",
//     fontSize: 18,
//     cursor: "pointer",
//     lineHeight: 1,
//     padding: 0,
//   },
//   modalBody: { padding: "20px", overflowY: "auto", flex: 1 },
//   modalFoot: {
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     paddingTop: 16,
//     marginTop: 4,
//     borderTop: `1px solid ${BORDER}`,
//   },

//   // ── Form ──────────────────────────────────────────────────────────────────
//   field: { marginBottom: 14 },
//   fieldLabel: {
//     display: "block",
//     fontSize: 12,
//     fontWeight: 600,
//     color: "#374151",
//     marginBottom: 5,
//     textTransform: "uppercase",
//     letterSpacing: 0.5,
//   },
//   input: {
//     width: "100%",
//     padding: "9px 12px",
//     border: `1px solid ${BORDER}`,
//     borderRadius: 8,
//     fontSize: 13,
//     color: "#111827",
//     background: "#fff",
//     boxSizing: "border-box",
//     outline: "none",
//     fontFamily: "inherit",
//   },
//   row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
//   empDrop: {
//     position: "absolute",
//     top: "100%",
//     left: 0,
//     right: 0,
//     background: "#fff",
//     border: `1px solid ${BORDER}`,
//     borderRadius: 8,
//     maxHeight: 200,
//     overflowY: "auto",
//     zIndex: 1000,
//     margin: "4px 0 0",
//     padding: 0,
//     listStyle: "none",
//     boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
//   },
//   empDropItem: {
//     padding: "9px 12px",
//     cursor: "pointer",
//     borderBottom: `1px solid #f0f0f0`,
//     fontSize: 13,
//   },

//   // ── Buttons ───────────────────────────────────────────────────────────────
//   primaryBtn: {
//     background: NAVY,
//     color: "#fff",
//     border: "none",
//     borderRadius: 8,
//     padding: "9px 20px",
//     fontSize: 13,
//     fontWeight: 600,
//     cursor: "pointer",
//     fontFamily: "inherit",
//   },
//   ghostBtn: {
//     background: "#fff",
//     color: "#374151",
//     border: `1px solid ${BORDER}`,
//     borderRadius: 8,
//     padding: "9px 20px",
//     fontSize: 13,
//     cursor: "pointer",
//     fontFamily: "inherit",
//   },
//   deleteBtn: {
//     background: "#fee2e2",
//     color: "#dc2626",
//     border: "none",
//     borderRadius: 8,
//     padding: "9px 16px",
//     fontSize: 13,
//     cursor: "pointer",
//     fontFamily: "inherit",
//     fontWeight: 500,
//   },
//   chipContainer: {
//     display: "flex",
//     gap: 8,
//     flexWrap: "wrap",
//     marginBottom: 16,
//   },

//   chip: {
//     padding: "6px 12px",
//     borderRadius: 20,
//     border: "1px solid #e5e7eb",
//     background: "#fff",
//     fontSize: 12,
//     cursor: "pointer",
//     color: "#374151",
//     fontWeight: 500,
//   },

//   chipActive: {
//     background: "#0d1a5e",
//     color: "#fff",
//     border: "1px solid #0d1a5e",
//   },
// };

// // ─── Responsive CSS injection ─────────────────────────────────────────────────
// if (
//   typeof document !== "undefined" &&
//   !document.getElementById("plan-styles")
// ) {
//   const tag = document.createElement("style");
//   tag.id = "plan-styles";
//   tag.textContent = `
//     #plan-stats-grid { grid-template-columns: repeat(4,1fr); }
//     @media (max-width: 1024px) {
//       #plan-stats-grid { grid-template-columns: repeat(2,1fr) !important; }
//     }
//     @media (max-width: 640px) {
//       #plan-stats-grid { grid-template-columns: 1fr 1fr !important; }
//       .plan-day-full  { display: none !important; }
//       .plan-day-short { display: inline !important; }
//       .plan-cell      { min-height: 60px !important; }
//       .plan-add-hint  { display: none !important; }
//       #plan-emp-cards { flex-wrap: wrap !important; }
//     }
//     .plan-day-short { display: none; }
//     #plan-emp-cards::-webkit-scrollbar { height: 4px; }
//     #plan-emp-cards::-webkit-scrollbar-track { background: #f1f1f1; }
//     #plan-emp-cards::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
//   `;
//   document.head.appendChild(tag);
// }

import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  selectTravelPlanList,
  selectTravelPlanLoading,
  selectTravelPlanCreateLoading,
  selectTravelPlanCreateSuccess,
  selectTravelPlanUpdateLoading,
  selectTravelPlanUpdateSuccess,
  selectTravelPlanDeleteLoading,
} from "../../feature/tavelPlans/travelPlanSelectors";
import {
  getTravelPlans,
  createTravelPlan,
  updateTravelPlan,
  deleteTravelPlan,
} from "../../feature/tavelPlans/travelPlanThunks";
import {
  clearCreateState,
  clearUpdateState,
  clearDeleteState,
} from "../../feature/tavelPlans/travelPlanSlice";

import {
  selectDailyPlanList,
  selectDailyPlanCreateLoading,
  selectDailyPlanCreateSuccess,
  selectDailyPlanUpdateLoading,
  selectDailyPlanUpdateSuccess,
  selectDailyPlanDeleteLoading,
} from "../../feature/dailyPlans/dailyPlanSelectors";
import {
  getDailyPlans,
  createDailyPlan,
  updateDailyPlan,
  deleteDailyPlan,
} from "../../feature/dailyPlans/dailyPlanThunks";
import {
  clearDailyPlanCreateState,
  clearDailyPlanUpdateState,
  clearDailyPlanDeleteState,
} from "../../feature/dailyPlans/dailyPlanSlice";

import { getEmployees } from "../../feature/employee/employeeThunks";
import { selectEmployees } from "../../feature/employee/employeeSelector";

// ── Constants ─────────────────────────────────────────────────────────────────
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
const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const S_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CAT_COLORS = {
  "Client Meeting": { bg: "#dbeafe", dot: "#3b82f6", text: "#1d4ed8" },
  "Sales Visit": { bg: "#d1fae5", dot: "#10b981", text: "#065f46" },
  Training: { bg: "#fef3c7", dot: "#f59e0b", text: "#92400e" },
  Others: { bg: "#ede9fe", dot: "#8b5cf6", text: "#5b21b6" },
};
const CATS = Object.keys(CAT_COLORS);
const getCat = (c) => CAT_COLORS[c] || CAT_COLORS["Others"];

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (y, m, d) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
const parseDate = (s) => {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const initials = (f, l) => `${f?.[0] || ""}${l?.[0] || ""}`.toUpperCase();

function buildWeeks(year, month) {
  const first = new Date(year, month, 1).getDay();
  const dim = new Date(year, month + 1, 0).getDate();
  const prev = new Date(year, month, 0).getDate();
  const weeks = [];
  let c = 1 - first;
  while (c <= dim) {
    const w = [];
    for (let d = 0; d < 7; d++, c++) {
      if (c < 1) w.push({ day: prev + c, ov: true });
      else if (c > dim) w.push({ day: c - dim, ov: true });
      else w.push({ day: c, ov: false });
    }
    weeks.push(w);
  }
  return weeks;
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const ChevL = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevR = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const ChevD = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ── Small components ──────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={(e) => e.stopPropagation()}>
        <div style={S.mHead}>
          <span style={S.mTitle}>{title}</span>
          <button style={S.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>
        <div style={S.mBody}>{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={S.label}>{label}</label>
      {children}
    </div>
  );
}

function Select({ value, onChange, children, w = 140 }) {
  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      <select
        value={value}
        onChange={onChange}
        style={{ ...S.sel, minWidth: w }}
      >
        {children}
      </select>
      <span style={S.arrow}>
        <ChevD />
      </span>
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <div style={{ ...S.chip, ...(active ? S.chipOn : {}) }} onClick={onClick}>
      {children}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Plan() {
  const dispatch = useDispatch();

  const travelPlans = useSelector(selectTravelPlanList);
  const travelLoading = useSelector(selectTravelPlanLoading);
  const tpCreateLoading = useSelector(selectTravelPlanCreateLoading);
  const tpCreateSuccess = useSelector(selectTravelPlanCreateSuccess);
  const tpUpdateLoading = useSelector(selectTravelPlanUpdateLoading);
  const tpUpdateSuccess = useSelector(selectTravelPlanUpdateSuccess);
  const tpDeleteLoading = useSelector(selectTravelPlanDeleteLoading);
  const dailyPlans = useSelector(selectDailyPlanList);
  const dpCreateLoading = useSelector(selectDailyPlanCreateLoading);
  const dpCreateSuccess = useSelector(selectDailyPlanCreateSuccess);
  const dpUpdateLoading = useSelector(selectDailyPlanUpdateLoading);
  const dpUpdateSuccess = useSelector(selectDailyPlanUpdateSuccess);
  const dpDeleteLoading = useSelector(selectDailyPlanDeleteLoading);
  const employees = useSelector(selectEmployees);

  // ── State ─────────────────────────────────────────────────────────────────
  const today = useMemo(() => new Date(), []);
  const [selectedTPId, setSelectedTPId] = useState(null);
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [viewMode, setViewMode] = useState("calendar");
  const [filterEmp, setFilterEmp] = useState("");
  const [filterRegion, setFilterRegion] = useState("");
  const [allPlans, setAllPlans] = useState([]);

  const [showTPModal, setShowTPModal] = useState(false);
  const [showDPModal, setShowDPModal] = useState(false);
  const [editingTP, setEditingTP] = useState(null);
  const [editingDP, setEditingDP] = useState(null);
  const [selDate, setSelDate] = useState(null);
  const [empSearch, setEmpSearch] = useState("");
  const [showEmpDrop, setShowEmpDrop] = useState(false);

  const [tpForm, setTpForm] = useState({
    employee_id: "",
    month: "",
    start_date: "",
    end_date: "",
    region: "",
    states: "",
    rm: "",
    tsm: "",
  });
  const [dpForm, setDpForm] = useState({
    place: "",
    notes: "",
    category: "Client Meeting",
  });

  // ── Effects ───────────────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(getEmployees());
    dispatch(getDailyPlans());
  }, [dispatch]);

  // Main calendar data — filtered by month/year
  useEffect(() => {
    dispatch(
      getTravelPlans({
        employee_id: filterEmp || "",
        region: filterRegion || "",
        month: MONTHS[calMonth],
        year: calYear,
      }),
    );
  }, [dispatch, filterEmp, filterRegion, calMonth, calYear]);

  // All plans (no month/year) — for chips only
  useEffect(() => {
    dispatch(
      getTravelPlans({
        employee_id: filterEmp || "",
        region: filterRegion || "",
      }),
    ).then((res) => {
      const d = res?.payload;
      setAllPlans(Array.isArray(d) ? d : d?.results || d?.data || []);
    });
  }, [dispatch, filterEmp, filterRegion]);

  useEffect(() => {
    if (showTPModal) dispatch(getEmployees());
  }, [showTPModal]);

  // Auto-select first plan
  useEffect(() => {
    if (travelPlans.length > 0) setSelectedTPId(travelPlans[0].id);
  }, [travelPlans]);

  // Auto-select plan on employee filter change
  useEffect(() => {
    if (!filterEmp) return;
    const match = travelPlans.find(
      (tp) => String(tp.employee_id) === String(filterEmp),
    );
    if (match) setSelectedTPId(match.id);
    else setSelectedTPId(null);
  }, [filterEmp]); // eslint-disable-line

  // TP modal success
  useEffect(() => {
    if (tpCreateSuccess || tpUpdateSuccess) {
      setShowTPModal(false);
      setEditingTP(null);
      dispatch(getTravelPlans());
      dispatch(clearCreateState());
      dispatch(clearUpdateState());
    }
  }, [tpCreateSuccess, tpUpdateSuccess]); // eslint-disable-line

  // DP modal success
  useEffect(() => {
    if (dpCreateSuccess || dpUpdateSuccess) {
      setShowDPModal(false);
      setEditingDP(null);
      dispatch(getDailyPlans());
      dispatch(clearDailyPlanCreateState());
      dispatch(clearDailyPlanUpdateState());
    }
  }, [dpCreateSuccess, dpUpdateSuccess]); // eslint-disable-line

  // ── Derived ───────────────────────────────────────────────────────────────
  // Month-year chips from allPlans (no month/year filter)
  const monthChips = useMemo(() => {
    const set = new Set();
    (Array.isArray(allPlans) ? allPlans : [])
      .filter((tp) => {
        if (filterEmp && String(tp.employee_id) !== String(filterEmp))
          return false;
        if (filterRegion && tp.region !== filterRegion) return false;
        return true;
      })
      .forEach((tp) => {
        const d = parseDate(tp.start_date);
        if (d) set.add(`${d.getMonth()}-${d.getFullYear()}`);
      });
    return Array.from(set)
      .map((key) => {
        const [m, y] = key.split("-");
        return {
          monthIndex: Number(m),
          year: Number(y),
          label: `${MONTHS[Number(m)]}-${y}`,
        };
      })
      .sort((a, b) =>
        a.year !== b.year ? a.year - b.year : a.monthIndex - b.monthIndex,
      );
  }, [allPlans, filterEmp, filterRegion]);

  useEffect(() => {
    if (monthChips.length === 0) return;
    const hasActive = monthChips.some(
      (c) => c.monthIndex === calMonth && c.year === calYear,
    );
    if (!hasActive) {
      const first = monthChips[0];
      setCalMonth(first.monthIndex);
      setCalYear(first.year);
      const match = allPlans.find((tp) => {
        if (filterEmp && String(tp.employee_id) !== String(filterEmp))
          return false;
        if (filterRegion && tp.region !== filterRegion) return false;
        const d = parseDate(tp.start_date);
        return (
          d &&
          d.getMonth() === first.monthIndex &&
          d.getFullYear() === first.year
        );
      });
      setSelectedTPId(match ? match.id : null);
    }
  }, [monthChips]); // eslint-disable-line
  const employeesWithPlans = useMemo(
    () =>
      employees.filter((e) =>
        travelPlans.some((tp) => String(tp.employee_id) === String(e.id)),
      ),
    [employees, travelPlans],
  );

  const empTripCounts = useMemo(() => {
    const m = {};
    travelPlans.forEach((tp) => {
      m[tp.employee_id] = (m[tp.employee_id] || 0) + 1;
    });
    return m;
  }, [travelPlans]);

  const uniqueRegions = useMemo(
    () => [...new Set(travelPlans.map((tp) => tp.region).filter(Boolean))],
    [travelPlans],
  );

  const yearOptions = useMemo(() => {
    const c = today.getFullYear();
    return [c - 2, c - 1, c, c + 1, c + 2];
  }, [today]);

  const selectedTP = travelPlans.find((tp) => tp.id === selectedTPId) || null;
  const selectedEmp = employees.find(
    (e) => String(e.id) === String(selectedTP?.employee_id),
  );

  const dailyByDate = useMemo(() => {
    const m = {};
    dailyPlans.forEach((dp) => {
      if (dp.travel_plan === selectedTPId) m[dp.date] = dp;
    });
    return m;
  }, [dailyPlans, selectedTPId]);

  const weeks = useMemo(
    () => buildWeeks(calYear, calMonth),
    [calYear, calMonth],
  );
  const calHeader = `${MONTHS[calMonth]} ${calYear}${selectedEmp ? ` — ${selectedEmp.first_name} ${selectedEmp.last_name}` : ""}`;

  // ── Travel Plan CRUD ──────────────────────────────────────────────────────
  function openCreateTP() {
    setEditingTP(null);
    setTpForm({
      employee_id: "",
      month: "",
      start_date: "",
      end_date: "",
      region: "",
      states: "",
      rm: "",
      tsm: "",
    });
    setEmpSearch("");
    setShowTPModal(true);
  }
  function openEditTP(tp) {
    setEditingTP(tp);
    setTpForm({
      employee_id: tp.employee_id,
      month: tp.month,
      start_date: tp.start_date,
      end_date: tp.end_date,
      region: tp.region,
      states: tp.states,
      rm: tp.rm,
      tsm: tp.tsm,
    });
    const emp = employees.find((e) => e.id === tp.employee_id);
    setEmpSearch(
      emp ? `${emp.first_name} ${emp.last_name} (${emp.employee_code})` : "",
    );
    setShowTPModal(true);
  }
  function handleTPSubmit() {
    const payload = { ...tpForm, employee_id: Number(tpForm.employee_id) };
    if (editingTP)
      dispatch(updateTravelPlan({ id: editingTP.id, data: payload }));
    else dispatch(createTravelPlan(payload));
  }
  function handleDeleteTP(id) {
    if (!window.confirm("Delete this travel plan?")) return;
    dispatch(deleteTravelPlan(id)).then(() => {
      if (selectedTPId === id) setSelectedTPId(null);
      dispatch(getTravelPlans());
      dispatch(clearDeleteState());
    });
  }

  // ── Daily Plan CRUD ───────────────────────────────────────────────────────
  function openCell(day) {
    if (!selectedTPId || !day) return;
    const ds = fmt(calYear, calMonth, day);
    setSelDate(ds);
    const ex = dailyByDate[ds];
    if (ex) {
      setEditingDP(ex);
      setDpForm({
        place: ex.place,
        notes: ex.notes,
        category: ex.category || "Client Meeting",
      });
    } else {
      setEditingDP(null);
      setDpForm({ place: "", notes: "", category: "Client Meeting" });
    }
    setShowDPModal(true);
  }
  function handleDPSubmit() {
    const payload = { travel_plan: selectedTPId, date: selDate, ...dpForm };
    if (editingDP)
      dispatch(updateDailyPlan({ id: editingDP.id, data: payload }));
    else dispatch(createDailyPlan(payload));
  }
  function handleDeleteDP() {
    if (!editingDP || !window.confirm("Remove this entry?")) return;
    dispatch(deleteDailyPlan(editingDP.id)).then(() => {
      setShowDPModal(false);
      setEditingDP(null);
      dispatch(getDailyPlans());
      dispatch(clearDailyPlanDeleteState());
    });
  }

  // ── Calendar nav ──────────────────────────────────────────────────────────
  function prevMonth() {
    if (calMonth === 0) {
      setCalYear((y) => y - 1);
      setCalMonth(11);
    } else setCalMonth((m) => m - 1);
  }
  function nextMonth() {
    if (calMonth === 11) {
      setCalYear((y) => y + 1);
      setCalMonth(0);
    } else setCalMonth((m) => m + 1);
  }
  function goToday() {
    setCalYear(today.getFullYear());
    setCalMonth(today.getMonth());
  }

  function isInRange(day) {
    if (!selectedTP) return true;
    const d = new Date(calYear, calMonth, day);
    const s = parseDate(selectedTP.start_date);
    const e = parseDate(selectedTP.end_date);
    if (s && d < s) return false;
    if (e && d > e) return false;
    return true;
  }

  function pickChipPlan(chip) {
    setCalMonth(chip.monthIndex);
    setCalYear(chip.year);
    const match = allPlans.find((tp) => {
      if (filterEmp && String(tp.employee_id) !== String(filterEmp))
        return false;
      if (filterRegion && tp.region !== filterRegion) return false;
      const d = parseDate(tp.start_date);
      return (
        d && d.getMonth() === chip.monthIndex && d.getFullYear() === chip.year
      );
    });
    setSelectedTPId(match ? match.id : null);
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.pageHead}>
        <div>
          <h1 style={S.title}>Travel Plan Manager</h1>
          <p style={S.sub}>View and manage employee travel plans</p>
        </div>
        <button style={S.addBtn} onClick={openCreateTP}>
          + New Travel Plan
        </button>
      </div>

      {/* Filter bar */}
      <div style={S.filterBar}>
        <div style={S.fg}>
          <span style={S.fl}>Employee</span>
          <Select
            value={filterEmp}
            onChange={(e) => {
              setFilterEmp(e.target.value);
              setSelectedTPId(null);
            }}
            w={160}
          >
            <option value="">All Employees</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.first_name} {e.last_name}
              </option>
            ))}
          </Select>
        </div>
        <div style={S.fg}>
          <span style={S.fl}>Year</span>
          <Select
            value={calYear}
            onChange={(e) => setCalYear(Number(e.target.value))}
            w={90}
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </Select>
        </div>
        <div style={S.fg}>
          <span style={S.fl}>Month</span>
          <Select
            value={calMonth}
            onChange={(e) => setCalMonth(Number(e.target.value))}
            w={110}
          >
            {MONTHS.map((m, i) => (
              <option key={m} value={i}>
                {m}
              </option>
            ))}
          </Select>
        </div>
        <div style={S.fg}>
          <span style={S.fl}>Region</span>
          <Select
            value={filterRegion}
            onChange={(e) => {
              setFilterRegion(e.target.value);
              setFilterEmp("");
              setSelectedTPId(null);
            }}
            w={110}
          >
            <option value="">All Regions</option>
            {uniqueRegions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
        </div>
        <div style={S.fg}>
          <span style={S.fl}>View</span>
          <div style={S.toggle}>
            <button
              style={{ ...S.tBtn, ...(viewMode === "calendar" ? S.tOn : {}) }}
              onClick={() => setViewMode("calendar")}
            >
              Calendar
            </button>
            <button
              style={{ ...S.tBtn, ...(viewMode === "list" ? S.tOn : {}) }}
              onClick={() => setViewMode("list")}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Month-Year chips */}
      {monthChips.length > 0 && (
        <div style={S.chipRow}>
          {monthChips.map((chip) => (
            <Chip
              key={`${chip.monthIndex}-${chip.year}`}
              active={chip.monthIndex === calMonth && chip.year === calYear}
              onClick={() => pickChipPlan(chip)}
            >
              {chip.label}
            </Chip>
          ))}
        </div>
      )}

      {/* Employee chips */}
      {employeesWithPlans.length > 0 && (
        <div style={S.chipRow}>
          <Chip
            active={filterEmp === ""}
            onClick={() => {
              setFilterEmp("");
              setSelectedTPId(null);
            }}
          >
            All
          </Chip>
          {employeesWithPlans.map((emp) => (
            <Chip
              key={emp.id}
              active={String(emp.id) === String(filterEmp)}
              onClick={() => {
                setFilterEmp(String(emp.id));
                const m = travelPlans.find(
                  (tp) => String(tp.employee_id) === String(emp.id),
                );
                if (m) setSelectedTPId(m.id);
              }}
            >
              {emp.first_name} {emp.last_name}
              <span style={{ marginLeft: 5, fontSize: 11, opacity: 0.7 }}>
                ({empTripCounts[emp.id] || 0})
              </span>
            </Chip>
          ))}
        </div>
      )}

      {/* Calendar View */}
      {viewMode === "calendar" && (
        <div style={S.calCard}>
          <div style={S.calHead}>
            <span style={S.calTitle}>{calHeader}</span>
            <div style={{ display: "flex", gap: 4 }}>
              <button style={S.navBtn} onClick={prevMonth}>
                <ChevL />
              </button>
              <button style={S.todayBtn} onClick={goToday}>
                Today
              </button>
              <button style={S.navBtn} onClick={nextMonth}>
                <ChevR />
              </button>
            </div>
          </div>

          <div style={S.grid7}>
            {DAYS.map((d, i) => (
              <div
                key={d}
                style={{
                  ...S.dayHdr,
                  ...(i === 0 ? { color: "#ef4444" } : {}),
                }}
              >
                <span className="pf">{d}</span>
                <span className="ps">{S_DAYS[i]}</span>
              </div>
            ))}

            {weeks.map((week, wi) =>
              week.map(({ day, ov }, di) => {
                const ds = !ov ? fmt(calYear, calMonth, day) : null;
                const entry = ds ? dailyByDate[ds] : null;
                const inRng = !ov && isInRange(day);
                const isToday =
                  !ov &&
                  today.getFullYear() === calYear &&
                  today.getMonth() === calMonth &&
                  today.getDate() === day;
                const cat = entry ? getCat(entry.category) : null;
                return (
                  <div
                    key={`${wi}-${di}`}
                    className="pcell"
                    style={{
                      ...S.cell,
                      ...(ov ? S.cellOv : {}),
                      ...(!inRng && !ov ? S.cellOut : {}),
                      ...(!ov && inRng ? { cursor: "pointer" } : {}),
                    }}
                    onClick={() => inRng && !ov && openCell(day)}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginBottom: 3,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: isToday ? 700 : 500,
                          color: ov
                            ? "#d1d5db"
                            : isToday
                              ? "#fff"
                              : di === 0
                                ? "#ef4444"
                                : "#374151",
                          background: isToday ? NAVY : "transparent",
                          borderRadius: isToday ? "50%" : 0,
                          width: isToday ? 22 : "auto",
                          height: isToday ? 22 : "auto",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {day}
                      </span>
                    </div>
                    {!ov && entry && cat && (
                      <div
                        style={{
                          background: cat.bg,
                          borderLeft: `3px solid ${cat.dot}`,
                          borderRadius: 3,
                          padding: "3px 6px",
                          marginBottom: 2,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: cat.text,
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {entry.place}
                        </span>
                        <span
                          style={{
                            fontSize: 10,
                            color: cat.text,
                            opacity: 0.8,
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {entry.category}
                        </span>
                      </div>
                    )}
                    {!ov && inRng && !entry && (
                      <span className="phint" style={S.hint}>
                        + Add
                      </span>
                    )}
                  </div>
                );
              }),
            )}
          </div>

          <div style={S.legend}>
            {CATS.map((cat) => (
              <div
                key={cat}
                style={{ display: "flex", alignItems: "center", gap: 5 }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: CAT_COLORS[cat].dot,
                  }}
                />
                <span style={{ fontSize: 11, color: "#6b7280" }}>{cat}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div style={S.listCard}>
          {travelLoading ? (
            <div style={{ textAlign: "center", padding: 40, color: "#999" }}>
              Loading…
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {[
                    "Employee",
                    "Month",
                    "Start",
                    "End",
                    "Region",
                    "States",
                    "RM",
                    "TSM",
                    "",
                  ].map((h) => (
                    <th key={h} style={S.th}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {travelPlans.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      style={{
                        textAlign: "center",
                        padding: 40,
                        color: "#999",
                      }}
                    >
                      No travel plans found.
                    </td>
                  </tr>
                ) : (
                  travelPlans.map((tp, i) => {
                    const emp = employees.find(
                      (e) => String(e.id) === String(tp.employee_id),
                    );
                    return (
                      <tr
                        key={tp.id}
                        style={{ background: i % 2 === 0 ? "#fff" : "#f9fafb" }}
                      >
                        <td style={S.td}>
                          {emp
                            ? `${emp.first_name} ${emp.last_name}`
                            : tp.employee_id}
                        </td>
                        <td style={S.td}>{tp.month}</td>
                        <td style={S.td}>{tp.start_date}</td>
                        <td style={S.td}>{tp.end_date}</td>
                        <td style={S.td}>{tp.region}</td>
                        <td style={S.td}>{tp.states}</td>
                        <td style={S.td}>{tp.rm}</td>
                        <td style={S.td}>{tp.tsm}</td>
                        <td style={S.td}>
                          <div style={{ display: "flex", gap: 5 }}>
                            <button
                              style={S.tblBtn}
                              onClick={() => {
                                setSelectedTPId(tp.id);
                                setViewMode("calendar");
                                const d = parseDate(tp.start_date);
                                if (d) {
                                  setCalYear(d.getFullYear());
                                  setCalMonth(d.getMonth());
                                }
                              }}
                            >
                              View
                            </button>
                            <button
                              style={S.tblBtn}
                              onClick={() => openEditTP(tp)}
                            >
                              Edit
                            </button>
                            <button
                              style={S.tblDel}
                              onClick={() => handleDeleteTP(tp.id)}
                            >
                              Del
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Travel Plan Modal */}
      {showTPModal && (
        <Modal
          title={editingTP ? "Edit Travel Plan" : "New Travel Plan"}
          onClose={() => setShowTPModal(false)}
        >
          <Field label="Employee">
            <div style={{ position: "relative" }}>
              <input
                style={S.inp}
                type="text"
                placeholder="Search employee…"
                value={empSearch}
                onChange={(e) => {
                  setEmpSearch(e.target.value);
                  setShowEmpDrop(true);
                  setTpForm((f) => ({ ...f, employee_id: "" }));
                }}
                onFocus={() => {
                  setEmpSearch("");
                  setShowEmpDrop(true);
                  setTpForm((f) => ({ ...f, employee_id: "" }));
                }}
                onBlur={() =>
                  setTimeout(() => {
                    setShowEmpDrop(false);
                    if (!tpForm.employee_id) {
                      const emp = employees.find(
                        (e) => e.id === editingTP?.employee_id,
                      );
                      if (emp) {
                        setEmpSearch(
                          `${emp.first_name} ${emp.last_name} (${emp.employee_code})`,
                        );
                        setTpForm((f) => ({
                          ...f,
                          employee_id: editingTP.employee_id,
                        }));
                      }
                    }
                  }, 150)
                }
              />
              {showEmpDrop && (
                <ul style={S.drop}>
                  {employees
                    .filter((e) => {
                      const q = empSearch.toLowerCase();
                      return (
                        e.first_name.toLowerCase().includes(q) ||
                        e.last_name.toLowerCase().includes(q) ||
                        e.employee_code.toLowerCase().includes(q)
                      );
                    })
                    .map((emp) => (
                      <li
                        key={emp.id}
                        style={S.dropItem}
                        onMouseDown={() => {
                          setTpForm((f) => ({ ...f, employee_id: emp.id }));
                          setEmpSearch(
                            `${emp.first_name} ${emp.last_name} (${emp.employee_code})`,
                          );
                          setShowEmpDrop(false);
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#f5f5f5")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "#fff")
                        }
                      >
                        <strong>
                          {emp.first_name} {emp.last_name}
                        </strong>{" "}
                        <span style={{ color: "#888", fontSize: 12 }}>
                          {emp.employee_code}
                        </span>
                      </li>
                    ))}
                  {employees.filter((e) => {
                    const q = empSearch.toLowerCase();
                    return (
                      e.first_name.toLowerCase().includes(q) ||
                      e.last_name.toLowerCase().includes(q) ||
                      e.employee_code.toLowerCase().includes(q)
                    );
                  }).length === 0 && (
                    <li
                      style={{
                        padding: "10px 12px",
                        color: "#aaa",
                        fontSize: 13,
                      }}
                    >
                      No employees found
                    </li>
                  )}
                </ul>
              )}
            </div>
          </Field>
          <Field label="Month">
            <select
              style={S.inp}
              value={tpForm.month}
              onChange={(e) =>
                setTpForm((f) => ({ ...f, month: e.target.value }))
              }
            >
              <option value="">Select month</option>
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </Field>
          <div style={S.row2}>
            <Field label="Start Date">
              <input
                style={S.inp}
                type="date"
                value={tpForm.start_date}
                onChange={(e) =>
                  setTpForm((f) => ({ ...f, start_date: e.target.value }))
                }
              />
            </Field>
            <Field label="End Date">
              <input
                style={S.inp}
                type="date"
                value={tpForm.end_date}
                onChange={(e) =>
                  setTpForm((f) => ({ ...f, end_date: e.target.value }))
                }
              />
            </Field>
          </div>
          <Field label="Region">
            <input
              style={S.inp}
              value={tpForm.region}
              onChange={(e) =>
                setTpForm((f) => ({ ...f, region: e.target.value }))
              }
            />
          </Field>
          <Field label="States (comma-separated)">
            <input
              style={S.inp}
              value={tpForm.states}
              onChange={(e) =>
                setTpForm((f) => ({ ...f, states: e.target.value }))
              }
              placeholder="Gujarat, Maharashtra…"
            />
          </Field>
          <div style={S.row2}>
            <Field label="RM">
              <input
                style={S.inp}
                value={tpForm.rm}
                onChange={(e) =>
                  setTpForm((f) => ({ ...f, rm: e.target.value }))
                }
              />
            </Field>
            <Field label="TSM">
              <input
                style={S.inp}
                value={tpForm.tsm}
                onChange={(e) =>
                  setTpForm((f) => ({ ...f, tsm: e.target.value }))
                }
              />
            </Field>
          </div>
          <div style={S.mFoot}>
            {editingTP && (
              <button
                style={S.delBtn}
                onClick={() => {
                  handleDeleteTP(editingTP.id);
                  setShowTPModal(false);
                }}
                disabled={tpDeleteLoading}
              >
                🗑 Delete
              </button>
            )}
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <button style={S.ghostBtn} onClick={() => setShowTPModal(false)}>
                Cancel
              </button>
              <button
                style={S.primBtn}
                onClick={handleTPSubmit}
                disabled={tpCreateLoading || tpUpdateLoading}
              >
                {tpCreateLoading || tpUpdateLoading
                  ? "Saving…"
                  : editingTP
                    ? "Update"
                    : "Create"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Daily Plan Modal */}
      {showDPModal && (
        <Modal
          title={editingDP ? `Edit — ${selDate}` : `Add Plan — ${selDate}`}
          onClose={() => setShowDPModal(false)}
        >
          <Field label="Place / City">
            <input
              style={S.inp}
              value={dpForm.place}
              onChange={(e) =>
                setDpForm((f) => ({ ...f, place: e.target.value }))
              }
              placeholder="e.g. Surat"
            />
          </Field>
          <Field label="Activity Type">
            <select
              style={S.inp}
              value={dpForm.category}
              onChange={(e) =>
                setDpForm((f) => ({ ...f, category: e.target.value }))
              }
            >
              {CATS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Notes">
            <textarea
              style={{ ...S.inp, minHeight: 80, resize: "vertical" }}
              value={dpForm.notes}
              onChange={(e) =>
                setDpForm((f) => ({ ...f, notes: e.target.value }))
              }
              placeholder="Meeting details…"
            />
          </Field>
          <div style={S.mFoot}>
            {editingDP && (
              <button
                style={S.delBtn}
                onClick={handleDeleteDP}
                disabled={dpDeleteLoading}
              >
                🗑 Delete
              </button>
            )}
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <button style={S.ghostBtn} onClick={() => setShowDPModal(false)}>
                Cancel
              </button>
              <button
                style={S.primBtn}
                onClick={handleDPSubmit}
                disabled={dpCreateLoading || dpUpdateLoading}
              >
                {dpCreateLoading || dpUpdateLoading
                  ? "Saving…"
                  : editingDP
                    ? "Update"
                    : "Add"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const NAVY = "#0d1a5e";
const BORDER = "#e5e7eb";

const S = {
  page: {
    fontFamily: "'Segoe UI',system-ui,sans-serif",
    padding: "24px 28px 60px",
    background: "#f9fafb",
    minHeight: "100vh",
  },
  pageHead: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 12,
  },
  title: { margin: 0, fontSize: 22, fontWeight: 700, color: "#111827" },
  sub: { margin: "3px 0 0", fontSize: 13, color: "#6b7280" },
  addBtn: {
    background: NAVY,
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "9px 18px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  filterBar: {
    background: "#fff",
    border: `1px solid ${BORDER}`,
    borderRadius: 10,
    padding: "14px 18px",
    display: "flex",
    alignItems: "flex-end",
    gap: 12,
    marginBottom: 14,
    flexWrap: "wrap",
  },
  fg: { display: "flex", flexDirection: "column", gap: 4 },
  fl: { fontSize: 11, fontWeight: 600, color: "#6b7280", letterSpacing: 0.3 },
  sel: {
    appearance: "none",
    WebkitAppearance: "none",
    border: `1px solid ${BORDER}`,
    borderRadius: 7,
    padding: "7px 30px 7px 10px",
    fontSize: 13,
    color: "#374151",
    background: "#fff",
    cursor: "pointer",
    outline: "none",
    fontFamily: "inherit",
  },
  arrow: {
    position: "absolute",
    right: 9,
    pointerEvents: "none",
    color: "#9ca3af",
    display: "flex",
    alignItems: "center",
  },
  toggle: {
    display: "flex",
    border: `1px solid ${BORDER}`,
    borderRadius: 7,
    overflow: "hidden",
  },
  tBtn: {
    padding: "7px 14px",
    border: "none",
    background: "#fff",
    fontSize: 13,
    cursor: "pointer",
    color: "#374151",
    fontFamily: "inherit",
    fontWeight: 500,
  },
  tOn: { background: NAVY, color: "#fff" },

  chipRow: { display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 12 },
  chip: {
    padding: "5px 12px",
    borderRadius: 20,
    border: `1px solid ${BORDER}`,
    background: "#fff",
    fontSize: 12,
    cursor: "pointer",
    color: "#374151",
    fontWeight: 500,
    userSelect: "none",
  },
  chipOn: { background: NAVY, color: "#fff", border: `1px solid ${NAVY}` },

  calCard: {
    background: "#fff",
    border: `1px solid ${BORDER}`,
    borderRadius: 10,
    overflow: "hidden",
  },
  calHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 18px",
    borderBottom: `1px solid ${BORDER}`,
  },
  calTitle: { fontSize: 15, fontWeight: 700, color: "#111827" },
  navBtn: {
    width: 30,
    height: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: `1px solid ${BORDER}`,
    borderRadius: 6,
    background: "#fff",
    cursor: "pointer",
    color: "#374151",
  },
  todayBtn: {
    padding: "5px 12px",
    border: `1px solid ${BORDER}`,
    borderRadius: 6,
    background: "#fff",
    cursor: "pointer",
    fontSize: 12,
    color: "#374151",
    fontFamily: "inherit",
    fontWeight: 500,
  },
  grid7: { display: "grid", gridTemplateColumns: "repeat(7,1fr)" },
  dayHdr: {
    padding: "8px 6px",
    textAlign: "center",
    fontWeight: 600,
    fontSize: 12,
    color: "#6b7280",
    borderBottom: `1px solid ${BORDER}`,
    borderRight: `1px solid ${BORDER}`,
    background: "#f9fafb",
  },
  cell: {
    minHeight: 90,
    borderRight: `1px solid ${BORDER}`,
    borderBottom: `1px solid ${BORDER}`,
    padding: "5px 7px",
    position: "relative",
    background: "#fff",
  },
  cellOv: { background: "#f9fafb" },
  cellOut: { background: "#f3f4f6" },
  hint: {
    fontSize: 10,
    color: "#d1d5db",
    position: "absolute",
    bottom: 5,
    left: 7,
    pointerEvents: "none",
  },
  legend: {
    display: "flex",
    gap: 20,
    padding: "10px 18px",
    borderTop: `1px solid ${BORDER}`,
    flexWrap: "wrap",
  },

  listCard: {
    background: "#fff",
    border: `1px solid ${BORDER}`,
    borderRadius: 10,
    overflow: "hidden",
  },
  th: {
    padding: "11px 13px",
    textAlign: "left",
    fontSize: 12,
    fontWeight: 600,
    color: "#6b7280",
    background: "#f9fafb",
    borderBottom: `1px solid ${BORDER}`,
    whiteSpace: "nowrap",
  },
  td: {
    padding: "11px 13px",
    fontSize: 13,
    color: "#374151",
    borderBottom: `1px solid ${BORDER}`,
  },
  tblBtn: {
    padding: "3px 9px",
    fontSize: 12,
    border: `1px solid ${BORDER}`,
    borderRadius: 5,
    background: "#fff",
    cursor: "pointer",
    color: "#374151",
  },
  tblDel: {
    padding: "3px 9px",
    fontSize: 12,
    border: "none",
    borderRadius: 5,
    background: "#fee2e2",
    cursor: "pointer",
    color: "#dc2626",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: 16,
  },
  modal: {
    background: "#fff",
    borderRadius: 10,
    width: "100%",
    maxWidth: 500,
    boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
  },
  mHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 18px",
    borderBottom: `1px solid ${BORDER}`,
    background: NAVY,
    borderRadius: "10px 10px 0 0",
  },
  mTitle: { fontWeight: 700, fontSize: 14, color: "#fff" },
  closeBtn: {
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: 17,
    cursor: "pointer",
    lineHeight: 1,
    padding: 0,
  },
  mBody: { padding: "18px", overflowY: "auto", flex: 1 },
  mFoot: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    paddingTop: 14,
    marginTop: 4,
    borderTop: `1px solid ${BORDER}`,
  },
  label: {
    display: "block",
    fontSize: 11,
    fontWeight: 600,
    color: "#374151",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  inp: {
    width: "100%",
    padding: "8px 11px",
    border: `1px solid ${BORDER}`,
    borderRadius: 7,
    fontSize: 13,
    color: "#111827",
    background: "#fff",
    boxSizing: "border-box",
    outline: "none",
    fontFamily: "inherit",
  },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11 },
  drop: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    background: "#fff",
    border: `1px solid ${BORDER}`,
    borderRadius: 7,
    maxHeight: 180,
    overflowY: "auto",
    zIndex: 1000,
    margin: "3px 0 0",
    padding: 0,
    listStyle: "none",
    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
  },
  dropItem: {
    padding: "8px 11px",
    cursor: "pointer",
    borderBottom: `1px solid #f0f0f0`,
    fontSize: 13,
  },
  primBtn: {
    background: NAVY,
    color: "#fff",
    border: "none",
    borderRadius: 7,
    padding: "8px 18px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  ghostBtn: {
    background: "#fff",
    color: "#374151",
    border: `1px solid ${BORDER}`,
    borderRadius: 7,
    padding: "8px 18px",
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  delBtn: {
    background: "#fee2e2",
    color: "#dc2626",
    border: "none",
    borderRadius: 7,
    padding: "8px 14px",
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "inherit",
    fontWeight: 500,
  },
};

// ── CSS injection ─────────────────────────────────────────────────────────────
if (typeof document !== "undefined" && !document.getElementById("plan-css")) {
  const t = document.createElement("style");
  t.id = "plan-css";
  t.textContent = `
    .pf { display:inline; } .ps { display:none; }
    @media(max-width:640px){ .pf{display:none!important} .ps{display:inline!important} .pcell{min-height:60px!important} .phint{display:none!important} }
    .pcell:hover { background:#f9fafb; }
  `;
  document.head.appendChild(t);
}
