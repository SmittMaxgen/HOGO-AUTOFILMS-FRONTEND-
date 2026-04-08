import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";

// ── Thunks ────────────────────────────────────────────────────
import {
  getDistributorReport,
  getProductReport,
  getCategoryReport,
  getRegionReport,
} from "../../feature/reports/reportsThunks";

// ── Clear Actions ─────────────────────────────────────────────
import {
  clearDistributorReport,
  clearProductReport,
  clearCategoryReport,
  clearRegionReport,
} from "../../feature/reports/reportsSlice";

// ── Selectors: Report data ────────────────────────────────────
import {
  selectDistributorMonthlyData,
  selectDistributorReportLoading,
  selectProductMonthlyData,
  selectProductReportLoading,
  selectCategoryMonthlyData,
  selectCategoryReportLoading,
  selectRegionMonthlyData,
  selectRegionReportLoading,
} from "../../feature/reports/reportsSelectors";

// ── Entity list thunks (reuse from their own features) ────────
import { getProducts } from "../../feature/products/productThunks";
import { getRegions } from "../../feature/region/regionThunks";
import { getCategory } from "../../feature/category/categoryThunks";
import { getDistributors } from "../../feature/distributors/distributorThunks";

// ── Month Labels ──────────────────────────────────────────────
const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// ── Tab Config ────────────────────────────────────────────────
const TABS = [
  { key: "distributor", label: "Distributor" },
  { key: "product", label: "Product" },
  { key: "category", label: "Category" },
  { key: "region", label: "Region" },
];

// ── Safely extract array from any response shape ──────────────
const extractList = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw?.results)) return raw.results;
  return [];
};

// ── Per-tab Redux wiring ──────────────────────────────────────
// getReportParam(entityId, entity) → the params to pass to the thunk (excluding month)
const TAB_CONFIG = {
  distributor: {
    entityKey: "distributor",
    getThunk: getDistributorReport,
    clearAction: clearDistributorReport,
    monthlyDataSel: selectDistributorMonthlyData,
    loadingSel: selectDistributorReportLoading,
    entityListSel: (state) => extractList(state.distributor?.list),
    entityName: "Distributor",
    getReportParam: (id, _entity) => ({ distributor_id: id }),
    detailKey: "orders", // key inside the monthly response holding detail rows
  },
  product: {
    entityKey: "product",
    getThunk: getProductReport,
    clearAction: clearProductReport,
    monthlyDataSel: selectProductMonthlyData,
    loadingSel: selectProductReportLoading,
    entityListSel: (state) => extractList(state.product?.list),
    entityName: "Product",
    getReportParam: (id, _entity) => ({ product_id: id }),
    detailKey: "orders",
  },
  category: {
    entityKey: "category",
    getThunk: getCategoryReport,
    clearAction: clearCategoryReport,
    monthlyDataSel: selectCategoryMonthlyData,
    loadingSel: selectCategoryReportLoading,
    entityListSel: (state) => extractList(state.category?.list),
    entityName: "Category",
    getReportParam: (id, _entity) => ({ category: id }),
    detailKey: "products", // category API returns products[], not orders[]
  },
  region: {
    entityKey: "region",
    getThunk: getRegionReport,
    clearAction: clearRegionReport,
    monthlyDataSel: selectRegionMonthlyData,
    loadingSel: selectRegionReportLoading,
    entityListSel: (state) => extractList(state.region?.list),
    entityName: "Region",
    // Region API uses name not id: ?region=North
    getReportParam: (_id, entity) => ({
      region: entity?.name || entity?.region_name || entity?.title || null,
    }),
    detailKey: "orders",
  },
};

// ── Helpers ───────────────────────────────────────────────────
const toApiMonth = (year, idx) => `${year}-${String(idx + 1).padStart(2, "0")}`;
const toDisplayMonth = (year, idx) =>
  `${MONTH_LABELS[idx]}-${String(year).slice(-2)}`;

const getEntityLabel = (e, entityName) =>
  e?.name ||
  e?.title ||
  e?.distributor_name ||
  e?.product_name ||
  `${entityName} #${e?.id}`;

const fmt = (val) => {
  const n = parseFloat(val);
  if (isNaN(n)) return "—";
  return n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
};

// ─────────────────────────────────────────────────────────────
// DetailModal — shows orders / products for a single month
// ─────────────────────────────────────────────────────────────
const DetailModal = ({ row, detailKey, entityName, onClose }) => {
  if (!row?.report) return null;

  const items = row.report[detailKey] || [];
  const isCategory = detailKey === "products";

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={s.modalHeader}>
          <div>
            <div style={s.modalTitle}>
              {row.displayMonth} — {entityName} Report
            </div>
            <div style={s.modalSub}>
              Target: <strong>{row.target}</strong>
              &nbsp;|&nbsp; Order Total: <strong>₹{fmt(row.orderTotal)}</strong>
              &nbsp;|&nbsp; Invoice Total:{" "}
              <strong>₹{fmt(row.invoiceTotal)}</strong>
            </div>
          </div>
          <button style={s.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Body */}
        {items.length === 0 ? (
          <div style={s.emptyState}>No detail records for this month</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ ...s.table, minWidth: 540 }}>
              <thead>
                <tr>
                  {isCategory ? (
                    <>
                      <th style={s.mTh}>#</th>
                      <th style={s.mTh}>Product</th>
                      <th style={s.mTh}>Allotted Target</th>
                      <th style={s.mTh}>Order Total</th>
                      <th style={s.mTh}>Invoice Total</th>
                    </>
                  ) : (
                    <>
                      <th style={s.mTh}>#</th>
                      <th style={s.mTh}>PO Number</th>
                      <th style={s.mTh}>PO Date</th>
                      <th style={s.mTh}>Order Total</th>
                      <th style={s.mTh}>Invoice Total</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr
                    key={idx}
                    style={{
                      backgroundColor: idx % 2 === 0 ? "#fff" : "#f7f9fc",
                    }}
                  >
                    {isCategory ? (
                      <>
                        <td style={s.mTd}>{idx + 1}</td>
                        <td style={s.mTd}>{item.product_name}</td>
                        <td
                          style={{
                            ...s.mTd,
                            fontWeight: 600,
                            color: "#1e40af",
                          }}
                        >
                          {fmt(item.allotted_target)}
                        </td>
                        <td style={s.mTd}>
                          ₹{fmt(item.order_total_without_gst)}
                        </td>
                        <td style={s.mTd}>
                          ₹{fmt(item.actual_invoice_total_with_gst)}
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={s.mTd}>{idx + 1}</td>
                        <td
                          style={{
                            ...s.mTd,
                            fontWeight: 600,
                            color: "#1e40af",
                          }}
                        >
                          {item.po_number}
                        </td>
                        <td style={s.mTd}>{item.po_date}</td>
                        <td style={s.mTd}>
                          ₹{fmt(item.total_order_without_gst)}
                        </td>
                        <td style={s.mTd}>
                          ₹{fmt(item.total_invoice_with_gst)}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Main Reports Component
// ─────────────────────────────────────────────────────────────
const Reports = () => {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("distributor");
  const [selectedEntityId, setSelectedEntityId] = useState("");
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [detailRow, setDetailRow] = useState(null); // row shown in modal

  const cfg = TAB_CONFIG[activeTab];

  const monthlyData = useSelector(cfg.monthlyDataSel);
  const loading = useSelector(cfg.loadingSel);
  const entityList = useSelector(cfg.entityListSel);

  // ── Load all entity lists on mount ──────────────────────────
  useEffect(() => {
    dispatch(getProducts());
    dispatch(getDistributors());
    dispatch(getCategory());
    dispatch(getRegions());
  }, [dispatch]);

  // ── Auto-select first entity when list loads or tab changes ─
  useEffect(() => {
    if (entityList.length > 0) {
      const first = entityList[0];
      setSelectedEntityId(String(first.id));
      setSelectedEntity(first);
    } else {
      setSelectedEntityId("");
      setSelectedEntity(null);
    }
  }, [activeTab, entityList.length]); // eslint-disable-line

  // ── Fetch all 12 months when entity or year changes ─────────
  // NOTE: activeTab is intentionally NOT in deps.
  // When the tab changes, the auto-select effect above updates selectedEntityId,
  // which triggers this effect naturally — with the correct cfg already in scope.
  // Adding activeTab here would cause 12 wrong API calls before selectedEntityId updates.
  useEffect(() => {
    if (!selectedEntityId || !selectedEntity) return;

    // Clear old data first
    dispatch(cfg.clearAction());

    // Build base report params for this entity
    const baseParam = cfg.getReportParam(selectedEntityId, selectedEntity);

    // Guard: if any required param resolved to null/undefined (e.g. region name missing),
    // skip the fetch to avoid 404s — check your entity field names in TAB_CONFIG
    const hasInvalidParam = Object.values(baseParam).some(
      (v) => v === null || v === undefined || v === "",
    );
    if (hasInvalidParam) {
      console.warn(
        "[Reports] Skipping fetch — invalid param:",
        baseParam,
        "entity:",
        selectedEntity,
      );
      return;
    }

    // Fire 12 parallel requests — one per month of the selected year
    for (let i = 0; i < 12; i++) {
      const month = toApiMonth(year, i);
      dispatch(cfg.getThunk({ ...baseParam, month }));
    }
  }, [selectedEntityId, year, dispatch]); // eslint-disable-line

  // ── Build month grid from stored monthlyData ─────────────────
  const monthGrid = Array.from({ length: 12 }, (_, i) => {
    const apiMonth = toApiMonth(year, i);
    const report = monthlyData[apiMonth] || null;
    const hasData =
      report?.success &&
      (parseFloat(report?.summary?.total_order_without_gst || 0) > 0 ||
        parseFloat(report?.summary?.total_invoice_with_gst || 0) > 0);
    return {
      sNo: i + 1,
      monthIdx: i,
      apiMonth,
      displayMonth: toDisplayMonth(year, i),
      report,
      target: report?.target ?? null,
      orderTotal: report?.summary?.total_order_without_gst ?? null,
      invoiceTotal: report?.summary?.total_invoice_with_gst ?? null,
      hasData,
    };
  });

  // ── Totals ───────────────────────────────────────────────────
  const totalTarget = monthGrid.reduce(
    (a, r) => a + (parseFloat(r.target) || 0),
    0,
  );
  const totalOrder = monthGrid.reduce(
    (a, r) => a + (parseFloat(r.orderTotal) || 0),
    0,
  );
  const totalInvoice = monthGrid.reduce(
    (a, r) => a + (parseFloat(r.invoiceTotal) || 0),
    0,
  );
  const hasTotals = monthGrid.some((r) => r.report !== null);

  const selectEntity = (e) => {
    setSelectedEntityId(String(e.id));
    setSelectedEntity(e);
  };

  // ─────────────────────────────────────────────────────────────
  return (
    <div style={s.page}>
      {/* ── Header ── */}
      <div style={s.pageHeader}>
        <Box display="flex" alignItems="center" gap={1.5} mb={3}>
          <Box
            sx={{ width: 5, height: 32, bgcolor: "#D20000", borderRadius: 1 }}
          />
          <Typography variant="h5" fontWeight={800} color="#1a1a1a">
            Target Reports
          </Typography>
        </Box>
        <div style={s.yearPicker}>
          <button style={s.yearBtn} onClick={() => setYear((y) => y - 1)}>
            ‹
          </button>
          <span style={s.yearDisplay}>{year}</span>
          <button style={s.yearBtn} onClick={() => setYear((y) => y + 1)}>
            ›
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={s.tabBar}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            style={{ ...s.tab, ...(activeTab === tab.key ? s.tabActive : {}) }}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Table ── */}
      <div style={s.tableCard}>
        {loading && (
          <div style={s.loadingBar}>
            <div style={s.loadingInner} />
          </div>
        )}

        <table style={s.table}>
          <thead>
            {/* Row 1: group headers */}
            <tr>
              <th
                rowSpan={2}
                style={{
                  ...s.th,
                  width: 60,
                  verticalAlign: "middle",
                  borderRight: "1px solid #fca5a5",
                }}
              >
                S No
              </th>
              <th
                rowSpan={2}
                style={{
                  ...s.th,
                  width: 110,
                  verticalAlign: "middle",
                  borderRight: "1px solid #fca5a5",
                }}
              >
                Month
              </th>
              <th
                rowSpan={2}
                style={{
                  ...s.th,
                  width: 120,
                  verticalAlign: "middle",
                  borderRight: "1px solid #fca5a5",
                }}
              >
                Target
              </th>
              {/* Actual group spans 2 cols + has entity selector */}
              <th
                colSpan={3}
                style={{
                  ...s.thGroup,
                  textAlign: "center",
                  paddingTop: 8,
                  paddingBottom: 8,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Actual — {year}</span>
                  <select
                    style={s.select}
                    value={selectedEntityId}
                    onChange={(e) => {
                      const found = entityList.find(
                        (en) => String(en.id) === e.target.value,
                      );
                      if (found) selectEntity(found);
                    }}
                  >
                    <option value="">{cfg.entityName}</option>
                    {entityList.map((e) => (
                      <option key={e.id} value={e.id}>
                        {getEntityLabel(e, cfg.entityName)}
                      </option>
                    ))}
                  </select>
                </div>
              </th>
            </tr>
            {/* Row 2: sub-headers */}
            <tr>
              <th style={{ ...s.th, borderTop: "1px solid #fca5a5" }}>
                Order (excl. GST)
              </th>
              <th style={{ ...s.th, borderTop: "1px solid #fca5a5" }}>
                Invoice (incl. GST)
              </th>
              <th
                style={{
                  ...s.th,
                  borderTop: "1px solid #fca5a5",
                  width: 80,
                  textAlign: "center",
                }}
              >
                Details
              </th>
            </tr>
          </thead>

          <tbody>
            {monthGrid.map((row, idx) => {
              const noTarget = row.target === null;
              const noActual = row.orderTotal === null;
              return (
                <tr
                  key={row.apiMonth}
                  className="data-row"
                  style={{
                    ...s.tr,
                    backgroundColor: idx % 2 === 0 ? "#fff" : "#f7f9fc",
                  }}
                >
                  <td style={s.tdC}>{row.sNo}</td>
                  <td style={s.td}>{row.displayMonth}</td>

                  {/* Target */}
                  <td style={s.td}>
                    <span
                      style={{
                        color: noTarget ? "#e74c3c" : "#1e40af",
                        fontWeight: noTarget ? 500 : 700,
                      }}
                    >
                      {noTarget ? "Manual Feed" : row.target}
                    </span>
                  </td>

                  {/* Order Total */}
                  <td style={s.td}>
                    <span
                      style={{
                        color: noActual ? "#94a3b8" : "#334155",
                        fontStyle: noActual ? "italic" : "normal",
                      }}
                    >
                      {noActual
                        ? "PO placed by the Distributor"
                        : `₹${fmt(row.orderTotal)}`}
                    </span>
                  </td>

                  {/* Invoice Total */}
                  <td style={s.td}>
                    <span
                      style={{
                        color: noActual ? "#94a3b8" : "#334155",
                        fontStyle: noActual ? "italic" : "normal",
                      }}
                    >
                      {noActual
                        ? "Invoice Value without taxes"
                        : `₹${fmt(row.invoiceTotal)}`}
                    </span>
                  </td>

                  {/* View Details btn */}
                  <td style={{ ...s.tdC }}>
                    {row.report ? (
                      <button
                        style={s.viewBtn}
                        onClick={() => setDetailRow(row)}
                        title="View order details"
                      >
                        View
                      </button>
                    ) : (
                      <span style={{ color: "#cbd5e1", fontSize: 12 }}>—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>

          <tfoot>
            <tr style={s.totalRow}>
              <td colSpan={2} style={s.totalLabel}>
                Total
              </td>
              <td style={{ ...s.totalValue, background: "rgb(26, 26, 46)" }}>
                {hasTotals ? totalTarget.toLocaleString() : "—"}
              </td>
              <td style={s.totalValue}>
                {hasTotals ? `₹${fmt(totalOrder)}` : "—"}
              </td>
              <td style={s.totalValue}>
                {hasTotals ? `₹${fmt(totalInvoice)}` : "—"}
              </td>
              <td style={s.totalValue} />
            </tr>
          </tfoot>
        </table>
      </div>

      {/* ── Legend ── */}
      <div style={s.legend}>
        <span style={s.li}>
          <span style={{ ...s.dot, background: "#e74c3c" }} />
          Manual Feed — no target set
        </span>
        <span style={s.li}>
          <span style={{ ...s.dot, background: "#1e40af" }} />
          Saved target value
        </span>
        <span style={s.li}>
          <span style={{ ...s.dot, background: "#94a3b8" }} />
          No actual data for this month
        </span>
        <span style={s.li}>
          <span
            style={{
              ...s.dot,
              background: "#f5e642",
              border: "1px solid #ccc",
            }}
          />
          Total = sum of all months
        </span>
      </div>

      {/* ── Detail Modal ── */}
      {detailRow && (
        <DetailModal
          row={detailRow}
          detailKey={cfg.detailKey}
          entityName={cfg.entityName}
          onClose={() => setDetailRow(null)}
        />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Styles  (mirrored from Target.jsx for visual consistency)
// ─────────────────────────────────────────────────────────────
const s = {
  page: {
    fontFamily: "'Segoe UI','Inter',sans-serif",
    padding: "28px 32px",
    minHeight: "100vh",
  },
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    flexWrap: "wrap",
    gap: 12,
  },

  yearPicker: {
    display: "flex",
    alignItems: "center",
    background: "#fff",
    border: "1.5px solid #020202",
    borderRadius: 10,
    overflow: "hidden",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  },
  yearBtn: {
    padding: "10px 18px",
    border: "none",
    background: "transparent",
    fontSize: 22,
    cursor: "pointer",
    color: "#D20000",
    fontWeight: 700,
    lineHeight: 1,
  },
  yearDisplay: {
    padding: "10px 16px",
    fontWeight: 700,
    fontSize: 16,
    color: "#1a1a2e",
    minWidth: 60,
    textAlign: "center",
    borderLeft: "1px solid #e2e8f0",
    borderRight: "1px solid #e2e8f0",
  },

  tabBar: {
    display: "flex",
    gap: 4,
    marginBottom: 16,
    background: "#1a1a2e",
    padding: "6px 8px",
    borderRadius: 10,
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  },
  tab: {
    padding: "8px 24px",
    border: "none",
    borderRadius: 7,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    color: "#64748b",
    background: "transparent",
    transition: "all 0.18s",
  },
  tabActive: {
    background: "linear-gradient(90deg, #D20000 0%, #8B0000 100%)",
    color: "#fff",
    fontWeight: 600,
    boxShadow: "0 2px 8px rgba(210,0,0,0.30)",
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

  table: {
    width: "100%",
    borderCollapse: "collapse",
    background:
      "linear-gradient(90deg, rgb(210, 0, 0) 0%, rgb(139, 0, 0) 100%)",
  },

  thGroup: {
    padding: "12px 16px",
    // background: "linear-gradient(90deg, #D20000 0%, #8B0000 100%)",
    color: "#fff",
    fontSize: 13,
    fontWeight: 700,
    textAlign: "left",
    letterSpacing: "0.4px",
  },
  th: {
    padding: "12px 16px",
    // background: "#fee2e2",
    color: "white",
    fontSize: 13,
    fontWeight: 700,
    textAlign: "left",
    userSelect: "none",
  },

  tr: { transition: "background 0.12s", borderBottom: "1px solid #e9edf2" },
  td: {
    padding: "10px 16px",
    fontSize: 14,
    color: "#334155",
    verticalAlign: "middle",
  },
  tdC: {
    padding: "10px 16px",
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    fontWeight: 500,
    verticalAlign: "middle",
  },

  totalRow: { background: "linear-gradient(90deg, #D20000 0%, #8B0000 100%)" },
  totalLabel: {
    padding: "13px 16px",
    color: "#fff",
    fontWeight: 700,
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  totalValue: {
    padding: "13px 16px",
    background: "rgb(26, 26, 46)",
    color: "white",
    fontWeight: 800,
    fontSize: 14,
  },

  select: {
    padding: "7px 12px",
    borderRadius: 8,
    border: "1.5px solid rgba(255,255,255,0.5)",
    fontSize: 13,
    color: "#1a1a2e",
    background: "#fff",
    minWidth: 200,
    outline: "none",
    cursor: "pointer",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },

  viewBtn: {
    padding: "5px 14px",
    background: "rgb(26, 26, 46)",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 1px 4px rgba(37,99,235,0.3)",
    transition: "all 0.15s",
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
    background: "rgba(0,0,0,0.45)",
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
    maxWidth: 740,
    maxHeight: "85vh",
    overflow: "auto",
  },
  modalHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    padding: "18px 20px 14px",
    borderBottom: "2px solid #fee2e2",
    background: "linear-gradient(90deg, #D20000 0%, #8B0000 100%)",
    borderRadius: "14px 14px 0 0",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#fff",
    marginBottom: 4,
  },
  modalSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
  },
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
    flexShrink: 0,
  },
  emptyState: {
    padding: "40px 20px",
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 14,
  },
  mTh: {
    padding: "10px 14px",
    // background: "#fee2e2",
    color: "white",
    fontSize: 12,
    fontWeight: 700,
    textAlign: "left",
    whiteSpace: "nowrap",
  },
  mTd: {
    padding: "9px 14px",
    fontSize: 13,
    color: "#334155",
    borderBottom: "1px solid #f1f5f9",
    whiteSpace: "nowrap",
  },
};

// ── CSS: hover effects + shimmer ──────────────────────────────
if (typeof document !== "undefined") {
  const id = "__reports_styles__";
  if (!document.getElementById(id)) {
    const tag = document.createElement("style");
    tag.id = id;
    tag.textContent = `
      @keyframes shimmer { 0%{transform:translateX(-150%)} 100%{transform:translateX(400%)} }
      .data-row:hover td { background-color: #fff5f5 !important; }
    `;
    document.head.appendChild(tag);
  }
}

export default Reports;
