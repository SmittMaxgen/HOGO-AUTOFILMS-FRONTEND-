import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

// ─── Travel Plan Selectors ───────────────────────────────────────────────────
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
// import {
//   clearTravelPlanCreateState,
//   clearTravelPlanUpdateState,
//   clearTravelPlanDeleteState,
// } from "../../feature/tavelPlans/travelPlanSlice";

import {
  clearCreateState,
  clearUpdateState,
  clearDeleteState,
} from "../../feature/tavelPlans/travelPlanSlice";
// ─── Daily Plan Selectors ────────────────────────────────────────────────────
import {
  selectDailyPlanList,
  selectDailyPlanLoading,
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

// ─── Helpers ─────────────────────────────────────────────────────────────────
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
const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function monthYearLabel(year, month) {
  const m = MONTHS[month].slice(0, 3);
  return `${m}-${String(year).slice(2)}`;
}

function formatDateISO(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parseISODate(str) {
  if (!str) return null;
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function buildCalendarWeeks(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weeks = [];
  let day = 1 - firstDay;
  while (day <= daysInMonth) {
    const week = [];
    for (let d = 0; d < 7; d++, day++) {
      if (day < 1 || day > daysInMonth) week.push(null);
      else week.push(day);
    }
    weeks.push(week);
  }
  return weeks;
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <span style={styles.modalTitle}>{title}</span>
          <button style={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>
        <div style={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div style={styles.field}>
      <label style={styles.fieldLabel}>{label}</label>
      {children}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Plan() {
  const dispatch = useDispatch();

  // Travel Plan state
  const travelPlans = useSelector(selectTravelPlanList);
  const travelLoading = useSelector(selectTravelPlanLoading);
  const tpCreateLoading = useSelector(selectTravelPlanCreateLoading);
  const tpCreateSuccess = useSelector(selectTravelPlanCreateSuccess);
  const tpUpdateLoading = useSelector(selectTravelPlanUpdateLoading);
  const tpUpdateSuccess = useSelector(selectTravelPlanUpdateSuccess);
  const tpDeleteLoading = useSelector(selectTravelPlanDeleteLoading);

  // Daily Plan state
  const dailyPlans = useSelector(selectDailyPlanList);
  const dpCreateLoading = useSelector(selectDailyPlanCreateLoading);
  const dpCreateSuccess = useSelector(selectDailyPlanCreateSuccess);
  const dpUpdateLoading = useSelector(selectDailyPlanUpdateLoading);
  const dpUpdateSuccess = useSelector(selectDailyPlanUpdateSuccess);
  const dpDeleteLoading = useSelector(selectDailyPlanDeleteLoading);

  //Employee state
  const employees = useSelector(selectEmployees);

  // Selected travel plan & calendar month
  const [selectedTPId, setSelectedTPId] = useState(null);
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());

  // Modals
  const [showTPModal, setShowTPModal] = useState(false);
  const [showDPModal, setShowDPModal] = useState(false);
  const [editingTP, setEditingTP] = useState(null);
  const [editingDP, setEditingDP] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const [employeeSearch, setEmployeeSearch] = useState("");
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);

  // Travel plan form
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

  // Daily plan form
  const [dpForm, setDpForm] = useState({ place: "", notes: "" });

  // ── Fetch on mount ──────────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(getTravelPlans());
    dispatch(getDailyPlans());
  }, [dispatch]);

  useEffect(() => {
    if (showTPModal && !editingTP) {
      dispatch(getEmployees());
    }
  }, [showTPModal]);

  // Auto-select first travel plan
  useEffect(() => {
    if (travelPlans.length > 0 && !selectedTPId) {
      const first = travelPlans[0];
      setSelectedTPId(first.id);
      const d = parseISODate(first.start_date);
      if (d) {
        setCalYear(d.getFullYear());
        setCalMonth(d.getMonth());
      }
    }
  }, [travelPlans]);

  // Close TP modal on success
  useEffect(() => {
    if (tpCreateSuccess || tpUpdateSuccess) {
      setShowTPModal(false);
      setEditingTP(null);
      dispatch(getTravelPlans());
      dispatch(clearCreateState());
      dispatch(clearUpdateState());
    }
  }, [tpCreateSuccess, tpUpdateSuccess]);

  // Close DP modal on success
  useEffect(() => {
    if (dpCreateSuccess || dpUpdateSuccess) {
      setShowDPModal(false);
      setEditingDP(null);
      dispatch(getDailyPlans());
      dispatch(clearDailyPlanCreateState());
      dispatch(clearDailyPlanUpdateState());
    }
  }, [dpCreateSuccess, dpUpdateSuccess]);

  // ── Derived data ─────────────────────────────────────────────────────────────
  const selectedTP = travelPlans.find((tp) => tp.id === selectedTPId) || null;

  const dailyByDate = useMemo(() => {
    const map = {};
    dailyPlans.forEach((dp) => {
      if (dp.travel_plan === selectedTPId) {
        map[dp.date] = dp;
      }
    });
    return map;
  }, [dailyPlans, selectedTPId]);

  const weeks = useMemo(
    () => buildCalendarWeeks(calYear, calMonth),
    [calYear, calMonth],
  );

  // ── Travel Plan CRUD ─────────────────────────────────────────────────────────
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
    if (emp) {
      setEmployeeSearch(
        `${emp.first_name} ${emp.last_name} (${emp.employee_code})`,
      );
    } else {
      setEmployeeSearch("");
    }
    setShowTPModal(true);
  }

  function handleTPSubmit() {
    const payload = { ...tpForm, employee_id: Number(tpForm.employee_id) };
    if (editingTP)
      dispatch(updateTravelPlan({ id: editingTP.id, data: payload }));
    else dispatch(createTravelPlan(payload));
  }

  function handleDeleteTP(id) {
    if (window.confirm("Delete this travel plan?")) {
      dispatch(deleteTravelPlan(id)).then(() => {
        if (selectedTPId === id) setSelectedTPId(null);
        dispatch(getTravelPlans());
        dispatch(clearDeleteState());
      });
    }
  }

  // ── Daily Plan CRUD ──────────────────────────────────────────────────────────
  function openCellModal(day) {
    if (!selectedTPId || !day) return;
    const dateStr = formatDateISO(calYear, calMonth, day);
    setSelectedDate(dateStr);
    const existing = dailyByDate[dateStr];
    if (existing) {
      setEditingDP(existing);
      setDpForm({ place: existing.place, notes: existing.notes });
    } else {
      setEditingDP(null);
      setDpForm({ place: "", notes: "" });
    }
    setShowDPModal(true);
  }

  function handleDPSubmit() {
    const payload = {
      travel_plan: selectedTPId,
      date: selectedDate,
      ...dpForm,
    };
    if (editingDP)
      dispatch(updateDailyPlan({ id: editingDP.id, data: payload }));
    else dispatch(createDailyPlan(payload));
  }

  function handleDeleteDP() {
    if (!editingDP) return;
    if (window.confirm("Remove this daily plan entry?")) {
      dispatch(deleteDailyPlan(editingDP.id)).then(() => {
        setShowDPModal(false);
        setEditingDP(null);
        dispatch(getDailyPlans());
        dispatch(clearDailyPlanDeleteState());
      });
    }
  }

  // ── Calendar navigation ──────────────────────────────────────────────────────
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

  // Is day within travel plan range?
  function isInRange(day) {
    if (!selectedTP || !day) return true;
    const date = new Date(calYear, calMonth, day);
    const start = parseISODate(selectedTP.start_date);
    const end = parseISODate(selectedTP.end_date);
    if (start && date < start) return false;
    if (end && date > end) return false;
    return true;
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      {/* ── Top Bar ─────────────────────────────────────────────────── */}
      <div style={styles.topBar}>
        <span style={styles.pageTitle}>Travel Plan Manager</span>
        <button style={styles.primaryBtn} onClick={openCreateTP}>
          + New Travel Plan
        </button>
      </div>

      {/* ── Travel Plan Tabs ─────────────────────────────────────────── */}
      {travelLoading ? (
        <div style={styles.loading}>Loading travel plans…</div>
      ) : (
        <div style={styles.tabRow}>
          {travelPlans.map((tp) => (
            <button
              key={tp.id}
              style={{
                ...styles.tab,
                ...(tp.id === selectedTPId ? styles.tabActive : {}),
              }}
              onClick={() => {
                setSelectedTPId(tp.id);
                const d = parseISODate(tp.start_date);
                if (d) {
                  setCalYear(d.getFullYear());
                  setCalMonth(d.getMonth());
                }
              }}
            >
              {tp.month} — {tp.region}
            </button>
          ))}
        </div>
      )}

      {selectedTP && (
        <>
          {/* ── Blue Info Table ──────────────────────────────────────── */}
          <div style={styles.infoCard}>
            <table style={styles.infoTable}>
              <tbody>
                {[
                  ["REPORT", "Travel Plan"],
                  ["MONTH", selectedTP.month],
                  [
                    "DATE",
                    `${selectedTP.start_date} to ${selectedTP.end_date}`,
                  ],
                  ["REGION", selectedTP.region],
                  ["STATE", selectedTP.states],
                  ["RM", selectedTP.rm],
                  ["TSM", selectedTP.tsm],
                ].map(([label, value]) => (
                  <tr key={label}>
                    <td style={styles.infoLabel}>{label}</td>
                    <td style={styles.infoValue}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={styles.infoActions}>
              <button
                style={styles.editBtn}
                onClick={() => openEditTP(selectedTP)}
              >
                Edit
              </button>
              <button
                style={styles.deleteBtn}
                onClick={() => handleDeleteTP(selectedTP.id)}
                disabled={tpDeleteLoading}
              >
                Delete
              </button>
            </div>
          </div>

          {/* ── Calendar ─────────────────────────────────────────────── */}
          <div style={styles.calendarCard}>
            {/* Yellow Header */}
            <div style={styles.calHeader}>
              <button style={styles.navBtn} onClick={prevMonth}>
                ‹
              </button>
              <span style={styles.calTitle}>
                {monthYearLabel(calYear, calMonth)}
              </span>
              <button style={styles.navBtn} onClick={nextMonth}>
                ›
              </button>
            </div>

            {/* Day headers */}
            <div style={styles.calGrid}>
              {DAYS.map((d, i) => (
                <div
                  key={d}
                  style={{
                    ...styles.dayHeader,
                    ...(i === 0 ? styles.sunday : {}),
                  }}
                >
                  <span style={styles.dayFull}>{d}</span>
                  <span style={styles.dayShort}>{SHORT_DAYS[i]}</span>
                </div>
              ))}

              {/* Calendar cells */}
              {weeks.map((week, wi) =>
                week.map((day, di) => {
                  const dateStr = day
                    ? formatDateISO(calYear, calMonth, day)
                    : null;
                  const dpEntry = dateStr ? dailyByDate[dateStr] : null;
                  const inRange = isInRange(day);
                  const isEmpty = !day;
                  const isSunday = di === 0;

                  return (
                    <div
                      key={`${wi}-${di}`}
                      style={{
                        ...styles.cell,
                        ...(isEmpty ? styles.cellEmpty : {}),
                        ...(!inRange && !isEmpty ? styles.cellOutOfRange : {}),
                        ...(isSunday && !isEmpty ? styles.cellSunday : {}),
                        ...(!isEmpty && inRange ? styles.cellClickable : {}),
                      }}
                      onClick={() => inRange && !isEmpty && openCellModal(day)}
                    >
                      {day && (
                        <>
                          <span
                            style={{
                              ...styles.dateNum,
                              ...(isSunday ? styles.sundayNum : {}),
                            }}
                          >
                            {day}
                          </span>
                          {dpEntry && (
                            <div style={styles.dpEntry}>
                              <span style={styles.dpPlace}>
                                📍 {dpEntry.place}
                              </span>
                              {dpEntry.notes && (
                                <span style={styles.dpNotes}>
                                  {dpEntry.notes}
                                </span>
                              )}
                            </div>
                          )}
                          {inRange && !dpEntry && (
                            <span style={styles.addHint}>+ Add</span>
                          )}
                        </>
                      )}
                    </div>
                  );
                }),
              )}
            </div>
          </div>
        </>
      )}

      {!selectedTP && !travelLoading && (
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>No travel plan selected.</p>
          <button style={styles.primaryBtn} onClick={openCreateTP}>
            Create your first plan
          </button>
        </div>
      )}

      {/* ── Travel Plan Modal ─────────────────────────────────────────── */}
      {showTPModal && (
        <Modal
          title={editingTP ? "Edit Travel Plan" : "New Travel Plan"}
          onClose={() => setShowTPModal(false)}
        >
          {/* <Field label="Employee ID">
            <input
              style={styles.input}
              type="number"
              value={tpForm.employee_id}
              onChange={(e) =>
                setTpForm((f) => ({ ...f, employee_id: e.target.value }))
              }
            />
          </Field> */}
          <Field label="Employee">
            <div style={{ position: "relative" }}>
              <input
                style={styles.input}
                type="text"
                placeholder="Search employee..."
                value={employeeSearch}
                onChange={(e) => {
                  setEmployeeSearch(e.target.value);
                  setShowEmployeeDropdown(true);
                  // Clear selected employee if user edits the text
                  setTpForm((f) => ({ ...f, employee_id: "" }));
                }}
                // onFocus={() => setShowEmployeeDropdown(true)}
                onFocus={() => {
                  setEmployeeSearch("");
                  setShowEmployeeDropdown(true);
                  setTpForm((f) => ({ ...f, employee_id: "" }));
                }}
                // onBlur={() =>
                //   setTimeout(() => setShowEmployeeDropdown(false), 150)
                // }
                onBlur={() => {
                  setTimeout(() => {
                    setShowEmployeeDropdown(false);
                    if (!tpForm.employee_id) {
                      const emp = employees.find(
                        (e) => e.id === editingTP?.employee_id,
                      );
                      if (emp) {
                        setEmployeeSearch(
                          `${emp.first_name} ${emp.last_name} (${emp.employee_code})`,
                        );
                        setTpForm((f) => ({
                          ...f,
                          employee_id: editingTP.employee_id,
                        }));
                      }
                    }
                  }, 150);
                }}
              />

              {showEmployeeDropdown && (
                <ul
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: 4,
                    maxHeight: 200,
                    overflowY: "auto",
                    zIndex: 1000,
                    margin: 0,
                    padding: 0,
                    listStyle: "none",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  {employees
                    .filter((emp) => {
                      const q = employeeSearch.toLowerCase();
                      return (
                        emp.first_name.toLowerCase().includes(q) ||
                        emp.last_name.toLowerCase().includes(q) ||
                        emp.employee_code.toLowerCase().includes(q)
                      );
                    })
                    .map((emp) => (
                      <li
                        key={emp.id}
                        onMouseDown={() => {
                          setTpForm((f) => ({ ...f, employee_id: emp.id }));
                          setEmployeeSearch(
                            `${emp.first_name} ${emp.last_name} (${emp.employee_code})`,
                          );
                          setShowEmployeeDropdown(false);
                        }}
                        style={{
                          padding: "8px 12px",
                          cursor: "pointer",
                          borderBottom: "1px solid #f0f0f0",
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
                        &nbsp;
                        <span style={{ color: "#888", fontSize: 12 }}>
                          {emp.employee_code}
                        </span>
                      </li>
                    ))}

                  {employees &&
                    employees?.length > 0 &&
                    employees?.filter((emp) => {
                      const q = employeeSearch.toLowerCase();
                      return (
                        emp.first_name.toLowerCase().includes(q) ||
                        emp.last_name.toLowerCase().includes(q) ||
                        emp.employee_code.toLowerCase().includes(q)
                      );
                    }).length === 0 && (
                      <li style={{ padding: "8px 12px", color: "#aaa" }}>
                        No employees found
                      </li>
                    )}
                </ul>
              )}
            </div>
          </Field>
          <Field label="Month">
            <select
              style={styles.input}
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
          <div style={styles.row2}>
            <Field label="Start Date">
              <input
                style={styles.input}
                type="date"
                value={tpForm.start_date}
                onChange={(e) =>
                  setTpForm((f) => ({ ...f, start_date: e.target.value }))
                }
              />
            </Field>
            <Field label="End Date">
              <input
                style={styles.input}
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
              style={styles.input}
              value={tpForm.region}
              onChange={(e) =>
                setTpForm((f) => ({ ...f, region: e.target.value }))
              }
            />
          </Field>
          <Field label="States (comma-separated)">
            <input
              style={styles.input}
              value={tpForm.states}
              onChange={(e) =>
                setTpForm((f) => ({ ...f, states: e.target.value }))
              }
              placeholder="Gujarat, Maharashtra, Goa…"
            />
          </Field>
          <div style={styles.row2}>
            <Field label="RM">
              <input
                style={styles.input}
                value={tpForm.rm}
                onChange={(e) =>
                  setTpForm((f) => ({ ...f, rm: e.target.value }))
                }
              />
            </Field>
            <Field label="TSM">
              <input
                style={styles.input}
                value={tpForm.tsm}
                onChange={(e) =>
                  setTpForm((f) => ({ ...f, tsm: e.target.value }))
                }
              />
            </Field>
          </div>
          <div style={styles.modalFooter}>
            <button
              style={styles.ghostBtn}
              onClick={() => setShowTPModal(false)}
            >
              Cancel
            </button>
            <button
              style={styles.primaryBtn}
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
        </Modal>
      )}

      {/* ── Daily Plan Modal ──────────────────────────────────────────── */}
      {showDPModal && (
        <Modal
          title={
            editingDP ? `Edit — ${selectedDate}` : `Add Plan — ${selectedDate}`
          }
          onClose={() => setShowDPModal(false)}
        >
          <Field label="Place / City">
            <input
              style={styles.input}
              value={dpForm.place}
              onChange={(e) =>
                setDpForm((f) => ({ ...f, place: e.target.value }))
              }
              placeholder="e.g. Surat"
            />
          </Field>
          <Field label="Notes">
            <textarea
              style={{ ...styles.input, minHeight: 90, resize: "vertical" }}
              value={dpForm.notes}
              onChange={(e) =>
                setDpForm((f) => ({ ...f, notes: e.target.value }))
              }
              placeholder="Meeting details, activities…"
            />
          </Field>
          <div style={styles.modalFooter}>
            {editingDP && (
              <button
                style={styles.deleteBtn}
                onClick={handleDeleteDP}
                disabled={dpDeleteLoading}
              >
                🗑 Delete
              </button>
            )}
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <button
                style={styles.ghostBtn}
                onClick={() => setShowDPModal(false)}
              >
                Cancel
              </button>
              <button
                style={styles.primaryBtn}
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

// ─── Styles ────────────────────────────────────────────────────────────────────
const NAVY = "#0d1a5e";
const YELLOW = "#f5f07a";
const BORDER = "#c8c8c8";

const styles = {
  page: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: 1100,
    margin: "0 auto",
    padding: "16px 12px 40px",
    background: "#f4f6fb",
    minHeight: "100vh",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    flexWrap: "wrap",
    gap: 8,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: NAVY,
    letterSpacing: 0.5,
  },
  tabRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    padding: "6px 16px",
    borderRadius: 4,
    border: `1px solid ${BORDER}`,
    background: "#fff",
    cursor: "pointer",
    fontSize: 13,
    color: "#444",
    fontWeight: 500,
  },
  tabActive: {
    background: NAVY,
    color: "#fff",
    borderColor: NAVY,
  },
  loading: { textAlign: "center", padding: 32, color: "#666" },

  // ── Info Card ──────────────────────────────────────────────────────────────
  infoCard: {
    background: "#fff",
    border: `1px solid ${BORDER}`,
    borderRadius: 4,
    marginBottom: 20,
    overflow: "hidden",
  },
  infoTable: {
    width: "100%",
    borderCollapse: "collapse",
  },
  infoLabel: {
    background: NAVY,
    color: "#fff",
    fontWeight: 700,
    fontSize: 12,
    letterSpacing: 1,
    padding: "9px 14px",
    border: `1px solid #1a2b7a`,
    width: 130,
    whiteSpace: "nowrap",
  },
  infoValue: {
    padding: "9px 14px",
    fontSize: 13,
    color: "#222",
    border: `1px solid ${BORDER}`,
    background: "#fff",
  },
  infoActions: {
    display: "flex",
    gap: 8,
    padding: "10px 14px",
    borderTop: `1px solid ${BORDER}`,
    background: "#fafafa",
  },

  // ── Calendar Card ──────────────────────────────────────────────────────────
  calendarCard: {
    background: "#fff",
    border: `1px solid ${BORDER}`,
    borderRadius: 4,
    overflow: "hidden",
  },
  calHeader: {
    background: YELLOW,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 16px",
    gap: 24,
    borderBottom: `1px solid ${BORDER}`,
  },
  calTitle: {
    fontWeight: 700,
    fontSize: 18,
    color: "#222",
    minWidth: 90,
    textAlign: "center",
    letterSpacing: 1,
  },
  navBtn: {
    background: "transparent",
    border: "none",
    fontSize: 22,
    cursor: "pointer",
    color: "#444",
    lineHeight: 1,
    padding: "0 4px",
  },
  calGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    borderLeft: `1px solid ${BORDER}`,
    borderTop: `1px solid ${BORDER}`,
  },
  dayHeader: {
    padding: "10px 6px",
    textAlign: "center",
    fontWeight: 600,
    fontSize: 13,
    color: "#333",
    borderRight: `1px solid ${BORDER}`,
    borderBottom: `1px solid ${BORDER}`,
    background: "#fafafa",
    userSelect: "none",
  },
  dayFull: { display: "inline" },
  dayShort: { display: "none" },
  sunday: { color: "#c0392b" },
  cell: {
    minHeight: 90,
    borderRight: `1px solid ${BORDER}`,
    borderBottom: `1px solid ${BORDER}`,
    padding: "4px 6px",
    verticalAlign: "top",
    position: "relative",
    background: "#fff",
    transition: "background 0.15s",
  },
  cellEmpty: { background: "#fafafa" },
  cellOutOfRange: { background: "#ebebeb" },
  cellSunday: { background: "#fff8f8" },
  cellClickable: { cursor: "pointer" },
  dateNum: {
    display: "block",
    textAlign: "right",
    fontSize: 12,
    color: "#555",
    fontWeight: 600,
    marginBottom: 4,
  },
  sundayNum: { color: "#c0392b" },
  dpEntry: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    marginTop: 2,
  },
  dpPlace: {
    fontSize: 11,
    fontWeight: 600,
    color: NAVY,
    background: "#e8ecff",
    borderRadius: 3,
    padding: "2px 5px",
    display: "block",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  dpNotes: {
    fontSize: 10,
    color: "#666",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    display: "block",
  },
  addHint: {
    fontSize: 10,
    color: "#bbb",
    position: "absolute",
    bottom: 4,
    left: 6,
    pointerEvents: "none",
  },

  // ── Empty State ────────────────────────────────────────────────────────────
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    background: "#fff",
    borderRadius: 8,
    border: `1px dashed ${BORDER}`,
  },
  emptyText: { color: "#888", marginBottom: 16, fontSize: 15 },

  // ── Buttons ────────────────────────────────────────────────────────────────
  primaryBtn: {
    background: NAVY,
    color: "#fff",
    border: "none",
    borderRadius: 4,
    padding: "8px 18px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  editBtn: {
    background: "#2980b9",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    padding: "6px 14px",
    fontSize: 12,
    cursor: "pointer",
  },
  deleteBtn: {
    background: "#c0392b",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    padding: "6px 14px",
    fontSize: 12,
    cursor: "pointer",
  },
  ghostBtn: {
    background: "#fff",
    color: "#333",
    border: `1px solid ${BORDER}`,
    borderRadius: 4,
    padding: "8px 18px",
    fontSize: 13,
    cursor: "pointer",
  },

  // ── Overlay / Modal ────────────────────────────────────────────────────────
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
    borderRadius: 8,
    width: "100%",
    maxWidth: 520,
    boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 20px",
    borderBottom: `1px solid ${BORDER}`,
    background: NAVY,
    borderRadius: "8px 8px 0 0",
  },
  modalTitle: { fontWeight: 700, fontSize: 15, color: "#fff" },
  closeBtn: {
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: 18,
    cursor: "pointer",
    lineHeight: 1,
  },
  modalBody: {
    padding: "16px 20px",
    overflowY: "auto",
    flex: 1,
  },
  modalFooter: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    paddingTop: 12,
    marginTop: 4,
    borderTop: `1px solid ${BORDER}`,
  },

  // ── Form ──────────────────────────────────────────────────────────────────
  field: { marginBottom: 12 },
  fieldLabel: {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "#555",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    width: "100%",
    padding: "8px 10px",
    border: `1px solid ${BORDER}`,
    borderRadius: 4,
    fontSize: 13,
    color: "#222",
    background: "#fafafa",
    boxSizing: "border-box",
    outline: "none",
    fontFamily: "inherit",
  },
  row2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
};

// ─── Responsive overrides via <style> injection ───────────────────────────────
// Inject once to handle media queries (not possible inline)
if (
  typeof document !== "undefined" &&
  !document.getElementById("plan-responsive")
) {
  const tag = document.createElement("style");
  tag.id = "plan-responsive";
  tag.textContent = `
    @media (max-width: 640px) {
      .plan-day-full { display: none !important; }
      .plan-day-short { display: inline !important; }
      .plan-cell { min-height: 60px !important; }
      .plan-add-hint { display: none !important; }
      .plan-info-label { width: 80px !important; font-size: 11px !important; }
    }
  `;
  document.head.appendChild(tag);
}
