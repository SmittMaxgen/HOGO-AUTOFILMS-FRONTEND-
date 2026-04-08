import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";

// ── Salary Thunks & Selectors ─────────────────────────────────
import {
  getEmployeeSalaries,
  createEmployeeSalary,
  updateEmployeeSalary,
  deleteEmployeeSalary,
} from "../../feature/employeeSalary/employeeSalaryThunks";

import { clearEmployeeSalaryState } from "../../feature/employeeSalary/employeeSalarySlice";

import {
  selectCreateEmployeeSalaryLoading,
  selectDeleteEmployeeSalaryLoading,
  selectEmployeeSalaries,
  selectEmployeeSalaryLoading,
  selectEmployeeSalarySuccess,
  selectUpdateEmployeeSalaryLoading,
} from "../../feature/employeeSalary/employeeSalarySelector";
// ── Employee Thunks & Selectors ───────────────────────────────
import { getEmployees } from "../../feature/employee/employeeThunks";
import { selectEmployees } from "../../feature/employee/employeeSelector";
import { selectEmployeeLoading } from "../../feature/employee/employeeSelector";

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
const fmt = (val) => {
  const n = parseFloat(val);
  if (isNaN(n)) return "—";
  return n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const EMPTY_FORM = {
  employee_id: "",
  basic_salary: "",
  alloances: "", // matches API field (typo in API kept intentionally)
  deductions: "",
  gross_salary: "",
  effective_from: "",
  status: false,
};

// Auto-compute gross = basic + allowances - deductions
const computeGross = (basic, allowances, deductions) => {
  const b = parseFloat(basic) || 0;
  const a = parseFloat(allowances) || 0;
  const d = parseFloat(deductions) || 0;
  return (b + a - d).toFixed(2);
};

// Get employee display name from list
const getEmployeeName = (employees, employeeId) => {
  console.log("employees::::??????", employees);
  if (!Array.isArray(employees)) {
    return `Emp #${employeeId}`;
  }

  const emp = employees.find((e) => String(e.id) === String(employeeId));

  return emp
    ? `${emp.first_name || ""} ${emp.last_name || ""}` ||
        emp.name ||
        emp.full_name ||
        emp.employee_name ||
        `Emp #${emp.id}`
    : `Emp #${employeeId}`;
};

// ─────────────────────────────────────────────────────────────
// SalaryFormModal — Add / Edit
// ─────────────────────────────────────────────────────────────
const SalaryFormModal = ({
  mode, // "add" | "edit"
  initial, // existing record for edit
  employees,
  onClose,
  onSubmit,
  loading,
}) => {
  const [form, setForm] = useState(
    mode === "edit" && initial
      ? {
          employee_id: String(initial.employee_id || ""),
          basic_salary: String(initial.basic_salary || ""),
          alloances: String(initial.alloances || ""),
          deductions: String(initial.deductions || ""),
          gross_salary: String(initial.gross_salary || ""),
          effective_from: initial.effective_from || "",
          status: initial.status ?? false,
        }
      : { ...EMPTY_FORM },
  );

  const [errors, setErrors] = useState({});

  // Auto-recalculate gross whenever basic/allowances/deductions change
  const handleNumericChange = (field, value) => {
    const next = { ...form, [field]: value };
    next.gross_salary = computeGross(
      next.basic_salary,
      next.alloances,
      next.deductions,
    );
    setForm(next);
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.employee_id) e.employee_id = "Employee is required";
    if (!form.basic_salary) e.basic_salary = "Basic salary is required";
    if (!form.effective_from) e.effective_from = "Effective date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const payload = {
      employee_id: Number(form.employee_id),
      basic_salary: parseFloat(form.basic_salary) || 0,
      alloances: parseFloat(form.alloances) || 0,
      deductions: parseFloat(form.deductions) || 0,
      gross_salary: parseFloat(form.gross_salary) || 0,
      effective_from: form.effective_from,
      status: form.status,
    };
    onSubmit(payload);
  };

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={s.modalHeader}>
          <div style={s.modalTitle}>
            {mode === "add"
              ? "➕  Add Employee Salary"
              : "✎  Edit Employee Salary"}
          </div>
          <button style={s.closeBtn} onClick={onClose} disabled={loading}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={s.modalBody}>
          {/* Employee */}
          <div style={s.formRow}>
            <label style={s.label}>
              Employee <span style={s.req}>*</span>
            </label>
            <select
              style={{ ...s.input, ...(errors.employee_id ? s.inputErr : {}) }}
              value={form.employee_id}
              onChange={(e) => {
                setForm((f) => ({ ...f, employee_id: e.target.value }));
                if (errors.employee_id)
                  setErrors((p) => ({ ...p, employee_id: "" }));
              }}
              disabled={mode === "edit"} // lock employee on edit
            >
              <option value="">— Select Employee —</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name ||
                    emp.full_name ||
                    emp.employee_name ||
                    `Employee #${emp.id}`}
                </option>
              ))}
            </select>
            {errors.employee_id && (
              <span style={s.errMsg}>{errors.employee_id}</span>
            )}
          </div>

          {/* Effective From */}
          <div style={s.formRow}>
            <label style={s.label}>
              Effective From <span style={s.req}>*</span>
            </label>
            <input
              type="date"
              style={{
                ...s.input,
                ...(errors.effective_from ? s.inputErr : {}),
              }}
              value={form.effective_from}
              onChange={(e) => {
                setForm((f) => ({ ...f, effective_from: e.target.value }));
                if (errors.effective_from)
                  setErrors((p) => ({ ...p, effective_from: "" }));
              }}
            />
            {errors.effective_from && (
              <span style={s.errMsg}>{errors.effective_from}</span>
            )}
          </div>

          {/* Numeric grid */}
          <div style={s.numGrid}>
            {/* Basic Salary */}
            <div style={s.formRow}>
              <label style={s.label}>
                Basic Salary <span style={s.req}>*</span>
              </label>
              <input
                type="number"
                min="0"
                style={{
                  ...s.input,
                  ...(errors.basic_salary ? s.inputErr : {}),
                }}
                value={form.basic_salary}
                placeholder="0.00"
                onChange={(e) =>
                  handleNumericChange("basic_salary", e.target.value)
                }
              />
              {errors.basic_salary && (
                <span style={s.errMsg}>{errors.basic_salary}</span>
              )}
            </div>

            {/* Allowances */}
            <div style={s.formRow}>
              <label style={s.label}>Allowances</label>
              <input
                type="number"
                min="0"
                style={s.input}
                value={form.alloances}
                placeholder="0.00"
                onChange={(e) =>
                  handleNumericChange("alloances", e.target.value)
                }
              />
            </div>

            {/* Deductions */}
            <div style={s.formRow}>
              <label style={s.label}>Deductions</label>
              <input
                type="number"
                min="0"
                style={s.input}
                value={form.deductions}
                placeholder="0.00"
                onChange={(e) =>
                  handleNumericChange("deductions", e.target.value)
                }
              />
            </div>

            {/* Gross Salary (read-only, auto-computed) */}
            <div style={s.formRow}>
              <label style={s.label}>Gross Salary</label>
              <input
                type="number"
                style={{
                  ...s.input,
                  background: "#f0fdf4",
                  color: "#15803d",
                  fontWeight: 700,
                }}
                value={form.gross_salary}
                readOnly
              />
              <span style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>
                Auto: Basic + Allowances − Deductions
              </span>
            </div>
          </div>

          {/* Status */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginTop: 8,
            }}
          >
            <label style={s.label}>Status</label>
            <label style={s.toggle}>
              <input
                type="checkbox"
                checked={form.status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.checked }))
                }
                style={{ display: "none" }}
              />
              <span
                style={{
                  ...s.toggleTrack,
                  background: form.status ? "#16a34a" : "#cbd5e1",
                }}
              >
                <span
                  style={{
                    ...s.toggleThumb,
                    transform: form.status
                      ? "translateX(20px)"
                      : "translateX(0)",
                  }}
                />
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: form.status ? "#16a34a" : "#94a3b8",
                  fontWeight: 600,
                }}
              >
                {form.status ? "Active" : "Inactive"}
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div style={s.modalFooter}>
          <button style={s.cancelBtn} onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button style={s.submitBtn} onClick={handleSubmit} disabled={loading}>
            {loading
              ? "Saving…"
              : mode === "add"
                ? "Add Salary"
                : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Main EmployeeSalary Component
// ─────────────────────────────────────────────────────────────
// const EmployeeSalary = () => {
const EmployeeSalary = ({ employee_id = "", disabled = false }) => {
  const dispatch = useDispatch();

  // ── State ──────────────────────────────────────────────────
  // const [filterEmployeeId, setFilterEmployeeId] = useState("");
  const [filterEmployeeId, setFilterEmployeeId] = useState(employee_id);

  const [modalMode, setModalMode] = useState(null); // "add" | "edit" | null
  const [editRecord, setEditRecord] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // ── Selectors ──────────────────────────────────────────────
  const salaries = useSelector(selectEmployeeSalaries);
  const loading = useSelector(selectEmployeeSalaryLoading);
  const createLoading = useSelector(selectCreateEmployeeSalaryLoading);
  const updateLoading = useSelector(selectUpdateEmployeeSalaryLoading);
  const deleteLoading = useSelector(selectDeleteEmployeeSalaryLoading);
  const success = useSelector(selectEmployeeSalarySuccess);
  const employees = useSelector(selectEmployees);

  const isBusy = createLoading || updateLoading || deleteLoading;

  // ── Load employees on mount ────────────────────────────────
  useEffect(() => {
    dispatch(getEmployees());
    dispatch(getEmployeeSalaries());
  }, [dispatch]);

  // ── Close modal on success ─────────────────────────────────
  useEffect(() => {
    if (success && (createLoading === false || updateLoading === false)) {
      setModalMode(null);
      setEditRecord(null);
    }
  }, [success]); // eslint-disable-line

  // ── Filter by employee ─────────────────────────────────────
  useEffect(() => {
    dispatch(
      getEmployeeSalaries(
        filterEmployeeId ? { employee_id: filterEmployeeId } : {},
      ),
    );
  }, [filterEmployeeId, dispatch]);

  // ── CRUD handlers ──────────────────────────────────────────
  const handleCreate = useCallback(
    (payload) => {
      dispatch(createEmployeeSalary(payload));
    },
    [dispatch],
  );

  const handleUpdate = useCallback(
    (payload) => {
      dispatch(updateEmployeeSalary({ id: editRecord.id, data: payload }));
    },
    [dispatch, editRecord],
  );

  const handleDelete = useCallback(
    (record) => {
      if (
        !window.confirm(
          `Delete salary record for ${getEmployeeName(employees, record.employee_id)}?`,
        )
      )
        return;
      setDeletingId(record.id);
      dispatch(deleteEmployeeSalary(record.id)).finally(() =>
        setDeletingId(null),
      );
    },
    [dispatch, employees],
  );

  const openEdit = (record) => {
    setEditRecord(record);
    setModalMode("edit");
    dispatch(clearEmployeeSalaryState());
  };

  const openAdd = () => {
    setEditRecord(null);
    setModalMode("add");
    dispatch(clearEmployeeSalaryState());
  };

  // ── Filtered list ──────────────────────────────────────────
  // Also apply client-side filter for instant feedback
  const displayed = filterEmployeeId
    ? salaries.filter((s) => String(s.employee_id) === String(filterEmployeeId))
    : salaries;

  // ── Summary stats ──────────────────────────────────────────
  const totalGross = displayed.reduce(
    (a, s) => a + (parseFloat(s.gross_salary) || 0),
    0,
  );
  const activeCount = displayed.filter((s) => s.status).length;

  // ─────────────────────────────────────────────────────────
  return (
    <div style={s.page}>
      {/* ── Page Header ── */}
      {disabled === false && (
        <div style={s.pageHeader}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Box
              sx={{ width: 5, height: 32, bgcolor: "#D20000", borderRadius: 1 }}
            />
            <Typography variant="h5" fontWeight={800} color="#1a1a1a">
              Employee Salary
            </Typography>
          </Box>

          <button style={s.addBtn} onClick={openAdd}>
            + Add Salary
          </button>
        </div>
      )}

      {/* ── Stats Cards ── */}
      {disabled === false && (
        <div style={s.statsRow}>
          <div style={s.statCard}>
            <div style={s.statLabel}>Total Records</div>
            <div style={s.statValue}>{displayed.length}</div>
          </div>
          <div style={{ ...s.statCard, borderTop: "3px solid #16a34a" }}>
            <div style={s.statLabel}>Active Salaries</div>
            <div style={{ ...s.statValue, color: "#16a34a" }}>
              {activeCount}
            </div>
          </div>
          <div style={{ ...s.statCard, borderTop: "3px solid #f59e0b" }}>
            <div style={s.statLabel}>Inactive</div>
            <div style={{ ...s.statValue, color: "#d97706" }}>
              {displayed.length - activeCount}
            </div>
          </div>
          <div style={{ ...s.statCard, borderTop: "3px solid #2563eb" }}>
            <div style={s.statLabel}>Total Gross (filtered)</div>
            <div style={{ ...s.statValue, color: "#1e40af" }}>
              ₹{fmt(totalGross)}
            </div>
          </div>
        </div>
      )}

      {/* ── Filter Bar ── */}
      {disabled === false && (
        <>
          <div style={s.filterBar}>
            <span style={s.filterLabel}>Filter by Employee</span>
            <select
              style={s.filterSelect}
              value={filterEmployeeId}
              onChange={(e) => setFilterEmployeeId(e.target.value)}
            >
              <option value="">All Employees</option>
              {employees &&
                employees?.length > 0 &&
                employees?.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {`${emp.first_name || ""} ${emp.last_name || ""}` ||
                      emp.name ||
                      emp.full_name ||
                      emp.employee_name ||
                      `Employee #${emp.id}`}
                  </option>
                ))}
            </select>
            {filterEmployeeId && (
              <button
                style={s.clearFilterBtn}
                onClick={() => setFilterEmployeeId("")}
              >
                ✕ Clear
              </button>
            )}
          </div>
        </>
      )}

      {/* ── Table ── */}
      <div style={s.tableCard}>
        {loading && (
          <div style={s.loadingBar}>
            <div style={s.loadingInner} />
          </div>
        )}

        <div style={{ overflowX: "auto" }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={{ ...s.th, width: 55 }}>S No</th>
                <th style={s.th}>Employee</th>
                <th style={{ ...s.th, textAlign: "right" }}>Basic Salary</th>
                <th style={{ ...s.th, textAlign: "right" }}>Allowances</th>
                <th style={{ ...s.th, textAlign: "right" }}>Deductions</th>
                <th style={{ ...s.th, textAlign: "right" }}>Gross Salary</th>
                <th style={s.th}>Effective From</th>
                <th style={{ ...s.th, textAlign: "center" }}>Status</th>
                <th style={{ ...s.th, textAlign: "center", width: 110 }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {!loading && displayed.length === 0 && (
                <tr>
                  <td colSpan={9} style={s.emptyState}>
                    No salary records found
                    {filterEmployeeId && " for this employee"}
                  </td>
                </tr>
              )}
              {displayed &&
                displayed?.length > 0 &&
                displayed?.map((record, idx) => (
                  <tr
                    key={record.id}
                    className="sal-row"
                    style={{
                      ...s.tr,
                      backgroundColor: idx % 2 === 0 ? "#fff" : "#f7f9fc",
                      opacity: deletingId === record.id ? 0.4 : 1,
                    }}
                  >
                    <td style={s.tdC}>{idx + 1}</td>

                    {/* Employee */}
                    <td style={s.td}>
                      <div style={s.empCell}>
                        <div style={s.empAvatar}>
                          {getEmployeeName(employees, record.employee_id)
                            ?.charAt(0)
                            ?.toUpperCase()}
                        </div>
                        <div>
                          <div
                            style={{
                              fontWeight: 600,
                              color: "#1a1a2e",
                              fontSize: 13,
                            }}
                          >
                            {getEmployeeName(employees, record.employee_id)}
                          </div>
                          {/* <div style={{ fontSize: 11, color: "#94a3b8" }}>
                            ID #{record.employee_id}
                          </div> */}
                        </div>
                      </div>
                    </td>

                    {/* Numeric cols */}
                    <td
                      style={{ ...s.td, textAlign: "right", fontWeight: 500 }}
                    >
                      ₹{fmt(record.basic_salary)}
                    </td>
                    <td
                      style={{ ...s.td, textAlign: "right", color: "#16a34a" }}
                    >
                      +₹{fmt(record.alloances)}
                    </td>
                    <td
                      style={{ ...s.td, textAlign: "right", color: "#dc2626" }}
                    >
                      −₹{fmt(record.deductions)}
                    </td>
                    <td style={{ ...s.td, textAlign: "right" }}>
                      <span style={s.grossBadge}>
                        ₹{fmt(record.gross_salary)}
                      </span>
                    </td>

                    {/* Date */}
                    <td style={s.td}>{record.effective_from}</td>

                    {/* Status */}
                    <td style={{ ...s.tdC }}>
                      <span
                        style={{
                          ...s.statusBadge,
                          background: record.status ? "#dcfce7" : "#fee2e2",
                          color: record.status ? "#16a34a" : "#dc2626",
                        }}
                      >
                        {record.status ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ ...s.tdC }}>
                      <div className="row-actions" style={s.actions}>
                        <button
                          style={{
                            ...s.iconBtn,
                            background: "#e0eaff",
                            color: "#2563eb",
                          }}
                          onClick={() => openEdit(record)}
                          disabled={isBusy}
                          title="Edit"
                        >
                          ✎
                        </button>
                        <button
                          style={{
                            ...s.iconBtn,
                            background: "#fee2e2",
                            color: "#dc2626",
                          }}
                          onClick={() => handleDelete(record)}
                          disabled={isBusy || deletingId === record.id}
                          title="Delete"
                        >
                          {deletingId === record.id ? "…" : "✕"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>

            {displayed.length > 0 && (
              <tfoot>
                <tr style={s.totalRow}>
                  <td colSpan={5} style={s.totalLabel}>
                    Total Gross Salary
                  </td>
                  <td style={{ ...s.totalValue, textAlign: "right" }}>
                    ₹{fmt(totalGross)}
                  </td>
                  <td colSpan={3} style={s.totalLabel} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* ── Legend ── */}
      {disabled === false && (
        <div style={s.legend}>
          <span style={s.li}>
            <span style={{ ...s.dot, background: "#16a34a" }} />
            Active salary
          </span>
          <span style={s.li}>
            <span style={{ ...s.dot, background: "#dc2626" }} />
            Inactive salary
          </span>
          <span style={s.li}>
            <span style={{ ...s.dot, background: "#16a34a", opacity: 0.4 }} />
            Allowances added to gross
          </span>
          <span style={s.li}>
            <span style={{ ...s.dot, background: "#dc2626", opacity: 0.4 }} />
            Deductions subtracted from gross
          </span>
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      {modalMode && (
        <SalaryFormModal
          mode={modalMode}
          initial={editRecord}
          employees={employees}
          onClose={() => {
            setModalMode(null);
            setEditRecord(null);
          }}
          onSubmit={modalMode === "add" ? handleCreate : handleUpdate}
          loading={createLoading || updateLoading}
        />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────
const s = {
  page: {
    fontFamily: "'Segoe UI','Inter',sans-serif",
    // padding: "28px 32px",
    minHeight: "100vh",
  },

  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    flexWrap: "wrap",
    gap: 12,
  },

  addBtn: {
    padding: "10px 22px",
    background: "linear-gradient(90deg, #D20000 0%, #8B0000 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 9,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(210,0,0,0.30)",
    letterSpacing: "0.3px",
  },

  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 14,
    marginBottom: 18,
  },
  statCard: {
    background: "#fff",
    borderRadius: 10,
    padding: "14px 18px",
    borderTop: "3px solid #D20000",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
  },
  statLabel: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: 6,
  },
  statValue: { fontSize: 22, fontWeight: 800, color: "#1a1a2e" },

  filterBar: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
    background: "#fff",
    padding: "12px 16px",
    borderRadius: 10,
    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
    flexWrap: "wrap",
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: 700,
    color: "#475569",
    whiteSpace: "nowrap",
  },
  filterSelect: {
    padding: "8px 14px",
    borderRadius: 8,
    border: "1.5px solid #fca5a5",
    fontSize: 14,
    color: "#1a1a2e",
    background: "#fff",
    minWidth: 220,
    outline: "none",
    cursor: "pointer",
  },
  clearFilterBtn: {
    padding: "7px 14px",
    background: "#fee2e2",
    color: "#dc2626",
    border: "none",
    borderRadius: 7,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },

  tableCard: {
    background: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    position: "relative",
  },
  loadingBar: {
    height: 3,
    background: "#e2e8f0",
    overflow: "hidden",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  loadingInner: {
    height: "100%",
    width: "40%",
    background: "linear-gradient(90deg, #D20000 0%, #8B0000 100%)",
    animation: "shimmer 1.2s ease-in-out infinite",
    borderRadius: 3,
  },

  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    padding: "12px 14px",
    background: "#fee2e2",
    color: "white",
    fontSize: 13,
    fontWeight: 700,
    textAlign: "left",
    userSelect: "none",
    whiteSpace: "nowrap",
  },
  tr: { transition: "background 0.12s", borderBottom: "1px solid #e9edf2" },
  td: {
    padding: "11px 14px",
    fontSize: 13,
    color: "#334155",
    verticalAlign: "middle",
  },
  tdC: {
    padding: "11px 14px",
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    verticalAlign: "middle",
  },

  empCell: { display: "flex", alignItems: "center", gap: 10 },
  empAvatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #D20000 0%, #8B0000 100%)",
    color: "#fff",
    fontSize: 13,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  grossBadge: {
    display: "inline-block",
    background: "#dbeafe",
    color: "#1e40af",
    fontWeight: 700,
    fontSize: 13,
    padding: "3px 10px",
    borderRadius: 6,
  },
  statusBadge: {
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.3px",
  },

  actions: { display: "flex", gap: 6, justifyContent: "center" },
  iconBtn: {
    width: 30,
    height: 30,
    borderRadius: 7,
    border: "none",
    cursor: "pointer",
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s",
  },

  emptyState: {
    padding: "48px 20px",
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 14,
  },

  totalRow: { background: "linear-gradient(90deg, #D20000 0%, #8B0000 100%)" },
  totalLabel: {
    padding: "12px 14px",
    color: "#fff",
    fontWeight: 700,
    fontSize: 14,
  },
  totalValue: {
    padding: "12px 14px",
    background: "#f5e642",
    color: "#1a1a2e",
    fontWeight: 800,
    fontSize: 14,
  },

  legend: { display: "flex", gap: 20, marginTop: 14, flexWrap: "wrap" },
  li: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    color: "#64748b",
  },
  dot: { width: 8, height: 8, borderRadius: "50%", display: "inline-block" },

  // ── Modal ──
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modal: {
    background: "#fff",
    borderRadius: 14,
    boxShadow: "0 8px 40px rgba(0,0,0,0.22)",
    width: "100%",
    maxWidth: 560,
    maxHeight: "90vh",
    overflow: "auto",
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 22px",
    background: "linear-gradient(90deg, #D20000 0%, #8B0000 100%)",
    borderRadius: "14px 14px 0 0",
  },
  modalTitle: { fontSize: 16, fontWeight: 700, color: "#fff" },
  closeBtn: {
    background: "rgba(255,255,255,0.15)",
    border: "none",
    borderRadius: 8,
    width: 32,
    height: 32,
    cursor: "pointer",
    fontSize: 14,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBody: {
    padding: "20px 22px",
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    padding: "14px 22px",
    borderTop: "1px solid #f1f5f9",
  },

  numGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
  },

  formRow: { display: "flex", flexDirection: "column", gap: 4 },
  label: {
    fontSize: 12,
    fontWeight: 700,
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
  },
  req: { color: "#D20000" },
  input: {
    padding: "9px 12px",
    border: "1.5px solid #e2e8f0",
    borderRadius: 8,
    fontSize: 14,
    color: "#1a1a2e",
    outline: "none",
    background: "#fff",
    transition: "border-color 0.15s",
  },
  inputErr: { borderColor: "#fca5a5", background: "#fff5f5" },
  errMsg: { fontSize: 11, color: "#dc2626", marginTop: 2 },

  toggle: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer" },
  toggleTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    position: "relative",
    display: "inline-block",
    transition: "background 0.2s",
    flexShrink: 0,
  },
  toggleThumb: {
    position: "absolute",
    top: 2,
    left: 2,
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: "#fff",
    transition: "transform 0.2s",
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
  },

  cancelBtn: {
    padding: "9px 20px",
    background: "#f1f5f9",
    color: "#475569",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  submitBtn: {
    padding: "9px 22px",
    background: "linear-gradient(90deg, #D20000 0%, #8B0000 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(210,0,0,0.25)",
  },
};

// ── CSS: hover effects + shimmer ──────────────────────────────
if (typeof document !== "undefined") {
  const id = "__emp_salary_styles__";
  if (!document.getElementById(id)) {
    const tag = document.createElement("style");
    tag.id = id;
    tag.textContent = `
      @keyframes shimmer { 0%{transform:translateX(-150%)} 100%{transform:translateX(400%)} }
      .sal-row:hover td { background-color: #fff5f5 !important; }
    `;
    document.head.appendChild(tag);
  }
}

export default EmployeeSalary;
