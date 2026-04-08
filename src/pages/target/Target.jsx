import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

// ── Thunks ────────────────────────────────────────────────────
import {
  getDistributorTargets,
  createDistributorTarget,
  updateDistributorTarget,
  deleteDistributorTarget,
  getProductTargets,
  createProductTarget,
  updateProductTarget,
  deleteProductTarget,
  getCategoryTargets,
  createCategoryTarget,
  updateCategoryTarget,
  deleteCategoryTarget,
  getRegionTargets,
  createRegionTarget,
  updateRegionTarget,
  deleteRegionTarget,
} from "../../feature/target/targetThunks";

// ── Selectors ─────────────────────────────────────────────────
import {
  selectDistributorTargets,
  selectDistributorTargetLoading,
  selectCreateDistributorLoading,
  selectUpdateDistributorLoading,
  selectDeleteDistributorLoading,
  selectProductTargets,
  selectProductTargetLoading,
  selectCreateProductLoading,
  selectUpdateProductLoading,
  selectDeleteProductLoading,
  selectCategoryTargets,
  selectCategoryTargetLoading,
  selectCreateCategoryLoading,
  selectUpdateCategoryLoading,
  selectDeleteCategoryLoading,
  selectRegionTargets,
  selectRegionTargetLoading,
  selectCreateRegionLoading,
  selectUpdateRegionLoading,
  selectDeleteRegionLoading,
} from "../../feature/target/targetSelectors";

import { getProducts } from "../../feature/products/productThunks";
import { getRegions } from "../../feature/region/regionThunks";
import { getCategory } from "../../feature/category/categoryThunks";
import { getDistributors } from "../../feature/distributors/distributorThunks";
import { Box, Typography } from "@mui/material";

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

// ── Safely extract array from ANY response shape ──────────────
// Handles: [], {data:[]}, {results:[]}, {success,count,data:[]}
const extractList = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw?.results)) return raw.results;
  return [];
};

// ── Per-tab Redux wiring ──────────────────────────────────────
const TAB_CONFIG = {
  distributor: {
    entityKey: "distributor",
    getThunk: getDistributorTargets,
    createThunk: createDistributorTarget,
    updateThunk: updateDistributorTarget,
    deleteThunk: deleteDistributorTarget,
    listSelector: selectDistributorTargets,
    loadSel: selectDistributorTargetLoading,
    createSel: selectCreateDistributorLoading,
    updateSel: selectUpdateDistributorLoading,
    deleteSel: selectDeleteDistributorLoading,
    entityListSelector: (state) => extractList(state.distributor?.list),
    entityName: "Distributor",
  },
  product: {
    entityKey: "product",
    getThunk: getProductTargets,
    createThunk: createProductTarget,
    updateThunk: updateProductTarget,
    deleteThunk: deleteProductTarget,
    listSelector: selectProductTargets,
    loadSel: selectProductTargetLoading,
    createSel: selectCreateProductLoading,
    updateSel: selectUpdateProductLoading,
    deleteSel: selectDeleteProductLoading,
    entityListSelector: (state) => extractList(state.product?.list),
    entityName: "Product",
  },
  category: {
    entityKey: "category",
    getThunk: getCategoryTargets,
    createThunk: createCategoryTarget,
    updateThunk: updateCategoryTarget,
    deleteThunk: deleteCategoryTarget,
    listSelector: selectCategoryTargets,
    loadSel: selectCategoryTargetLoading,
    createSel: selectCreateCategoryLoading,
    updateSel: selectUpdateCategoryLoading,
    deleteSel: selectDeleteCategoryLoading,
    entityListSelector: (state) => extractList(state.category?.list),
    entityName: "Category",
  },
  region: {
    entityKey: "region",
    getThunk: getRegionTargets,
    createThunk: createRegionTarget,
    updateThunk: updateRegionTarget,
    deleteThunk: deleteRegionTarget,
    listSelector: selectRegionTargets,
    loadSel: selectRegionTargetLoading,
    createSel: selectCreateRegionLoading,
    updateSel: selectUpdateRegionLoading,
    deleteSel: selectDeleteRegionLoading,
    entityListSelector: (state) => extractList(state.region?.list),
    entityName: "Region",
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

const buildMonthGrid = (year, targetList) =>
  Array.from({ length: 12 }, (_, i) => {
    const apiMonth = toApiMonth(year, i);
    const record =
      (Array.isArray(targetList) ? targetList : []).find(
        (t) => t.month === apiMonth,
      ) || null;
    return {
      sNo: i + 1,
      monthIdx: i,
      apiMonth,
      displayMonth: toDisplayMonth(year, i),
      record,
      targetValue: record?.target ?? "",
    };
  });

// ─────────────────────────────────────────────────────────────
// EditCell
// ─────────────────────────────────────────────────────────────
const EditCell = ({ row, onSave, onDelete, isBusy }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(row.targetValue);

  useEffect(() => {
    setValue(row.targetValue);
  }, [row.targetValue]);

  const commit = () => {
    if (value.trim() === row.targetValue) {
      setEditing(false);
      return;
    }
    onSave(row, value.trim());
    setEditing(false);
  };

  const onKey = (e) => {
    if (e.key === "Enter") commit();
    if (e.key === "Escape") {
      setValue(row.targetValue);
      setEditing(false);
    }
  };

  if (editing) {
    return (
      <div style={s.editWrap}>
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={commit}
          onKeyDown={onKey}
          style={s.editInput}
          placeholder="Enter target…"
        />
        <button
          style={{ ...s.iconBtn, background: "#dcfce7", color: "#16a34a" }}
          onClick={commit}
        >
          ✓
        </button>
      </div>
    );
  }

  const isEmpty = !row.record;
  return (
    <div className="cell-row" style={s.cellWrap}>
      <span
        style={{
          ...s.targetText,
          color: isEmpty ? "#e74c3c" : "#1e40af",
          fontWeight: isEmpty ? 500 : 700,
        }}
        onClick={() => !isBusy && setEditing(true)}
        title={isEmpty ? "Click to add target" : "Click to edit"}
      >
        {isEmpty ? "Manual Feed" : row.targetValue || "—"}
      </span>
      <div className="row-actions" style={s.actionBtns}>
        <button
          style={{ ...s.iconBtn, background: "#e0eaff", color: "#2563eb" }}
          onClick={() => !isBusy && setEditing(true)}
          disabled={isBusy}
          title="Edit"
        >
          ✎
        </button>
        {row.record && (
          <button
            style={{ ...s.iconBtn, background: "#fee2e2", color: "#dc2626" }}
            onClick={() => onDelete(row)}
            disabled={isBusy}
            title="Delete"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────
const Target = () => {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("distributor");
  const [selectedEntityId, setSelectedEntityId] = useState("");
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());

  const cfg = TAB_CONFIG[activeTab];

  const targetList = useSelector(cfg.listSelector);
  const loading = useSelector(cfg.loadSel);
  const createLoading = useSelector(cfg.createSel);
  const updateLoading = useSelector(cfg.updateSel);
  const deleteLoading = useSelector(cfg.deleteSel);
  const entityList = useSelector(cfg.entityListSelector); // always an array via extractList

  const isBusy = createLoading || updateLoading || deleteLoading;

  // ── Load all entity lists on mount ──────────────────────
  useEffect(() => {
    dispatch(getProducts());
    dispatch(getDistributors());
    dispatch(getCategory());
    dispatch(getRegions());
  }, [dispatch]);

  // ── Auto-select FIRST entity when list loads or tab changes ─
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

  // ── Fetch targets when entity or year changes ────────────
  //   useEffect(() => {
  //     if (!selectedEntityId) return;
  //     dispatch(cfg.getThunk({ [cfg.entityKey]: selectedEntityId }));
  //   }, [activeTab, selectedEntityId, year, dispatch]); // eslint-disable-line
  useEffect(() => {
    if (!selectedEntityId) return;

    dispatch(cfg.getThunk({ [cfg.entityKey]: selectedEntityId }));
  }, [selectedEntityId, year, dispatch]);

  // ── Grid & totals ────────────────────────────────────────
  const monthGrid = buildMonthGrid(year, targetList);
  const total = monthGrid.reduce((acc, r) => {
    const n = parseFloat(r.targetValue);
    return isNaN(n) ? acc : acc + n;
  }, 0);
  const hasNumeric = monthGrid.some((r) => !isNaN(parseFloat(r.targetValue)));

  // ── CRUD ─────────────────────────────────────────────────
  const handleSave = useCallback(
    (row, val) => {
      if (!selectedEntityId) return;
      if (row.record) {
        dispatch(cfg.updateThunk({ id: row.record.id, data: { target: val } }));
      } else {
        dispatch(
          cfg.createThunk({
            [cfg.entityKey]: Number(selectedEntityId),
            month: row.apiMonth,
            target: val,
          }),
        );
      }
    },
    [selectedEntityId, cfg, dispatch],
  );

  const handleDelete = useCallback(
    (row) => {
      if (!row.record) return;
      if (!window.confirm(`Delete target for ${row.displayMonth}?`)) return;
      dispatch(cfg.deleteThunk(row.record.id));
    },
    [cfg, dispatch],
  );

  const selectEntity = (e) => {
    setSelectedEntityId(String(e.id));
    setSelectedEntity(e);
  };

  // ─────────────────────────────────────────────────────────
  return (
    <div style={s.page}>
      {/* ── Header ── */}
      <div style={s.pageHeader}>
        {/* <div>
          <h1 style={s.pageTitle}>Target Management</h1>
          <p style={s.pageSubtitle}>
            Set and manage monthly targets by category
          </p>
        </div> */}
        <Box display="flex" alignItems="center" gap={1.5} mb={3}>
          <Box
            sx={{ width: 5, height: 32, bgcolor: "#D20000", borderRadius: 1 }}
          />
          <Typography variant="h5" fontWeight={800} color="#1a1a1a">
            Target
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
        {/* {selectedEntity && (
          <div style={s.badgeRow}>
            <span style={s.entityBadge}>
              {cfg.entityName}:{" "}
              <strong>{getEntityLabel(selectedEntity, cfg.entityName)}</strong>
            </span>
            <span style={s.yearBadge}>{year}</span>
          </div>
        )} */}

        {loading && (
          <div style={s.loadingBar}>
            <div style={s.loadingInner} />
          </div>
        )}

        <table style={s.table}>
          <thead
            style={{
              ...s.th,
              padding: "12px 16px",
            }}
          >
            {/* <tr>
              <th colSpan={2} style={s.thGroup} />
              <th style={{ ...s.thGroup, ...s.thHighlight }}>Target</th>
            </tr> */}
            <tr>
              <th style={{ width: 70, padding: "12px 16px" }}>S No</th>
              <th style={{ width: 160, padding: "12px 16px" }}>Month</th>
              <th
                style={{
                  padding: "12px 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>Target Value</Box>
                <>
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
                    <option value=""> {cfg.entityName}</option>
                    {entityList.map((e) => (
                      <option key={e.id} value={e.id}>
                        {getEntityLabel(e, cfg.entityName)}
                      </option>
                    ))}
                  </select>
                </>
              </th>
            </tr>
          </thead>
          <tbody>
            {monthGrid.map((row, idx) => (
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
                <td style={s.td}>
                  <EditCell
                    row={row}
                    onSave={handleSave}
                    onDelete={handleDelete}
                    isBusy={isBusy}
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={s.totalRow}>
              <td colSpan={2} style={s.totalLabel}>
                Total
              </td>
              <td style={s.totalValue}>
                {hasNumeric ? total.toLocaleString() : "—"}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* ── Legend ── */}
      <div style={s.legend}>
        <span style={s.li}>
          <span style={{ ...s.dot, background: "#e74c3c" }} />
          Manual Feed — click to add
        </span>
        <span style={s.li}>
          <span style={{ ...s.dot, background: "#2563eb" }} />
          Saved — click to edit
        </span>
        <span style={s.li}>
          <span
            style={{
              ...s.dot,
              background: "#f5e642",
              border: "1px solid #ccc",
            }}
          />
          Total = numeric values only
        </span>
      </div>
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
    // background: "#f0f4f8",
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
  pageTitle: {
    margin: 0,
    fontSize: 26,
    fontWeight: 700,
    color: "#0f172a",
    letterSpacing: "-0.3px",
  },
  pageSubtitle: { margin: "4px 0 0", fontSize: 14, color: "#64748b" },

  yearPicker: {
    display: "flex",
    alignItems: "center",
    background: "#fff",
    border: "1.5px solid #cbd5e1",
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
    // width: "fit-content",
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

  selectorCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    background: "#fff",
    borderRadius: 10,
    padding: "13px 18px",
    marginBottom: 16,
    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
  },
  selectorLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
    whiteSpace: "nowrap",
  },
  select: {
    padding: "9px 14px",
    borderRadius: 8,
    border: "1.5px solid #fca5a5",
    fontSize: 14,
    color: "#1a1a2e",
    background: "#fff",
    minWidth: 240,
    outline: "none",
    cursor: "pointer",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },

  tableCard: {
    background: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    position: "relative",
  },

  badgeRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 18px",
    background: "#fff5f5",
    // borderBottom: "1px solid #fecaca",
  },
  entityBadge: { fontSize: 13, color: "#8B0000" },
  yearBadge: {
    background: "linear-gradient(90deg, #D20000 0%, #8B0000 100%)",
    color: "#fff",
    fontSize: 12,
    fontWeight: 700,
    padding: "3px 12px",
    borderRadius: 12,
    letterSpacing: "0.5px",
  },

  loadingBar: {
    height: 3,
    background: "#e2e8f0",
    overflow: "hidden",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  loadingInner: {
    height: "100%",
    width: "40%",
    background: "linear-gradient(90deg, #D20000 0%, #8B0000 100%)",
    animation: "shimmer 1.2s ease-in-out infinite",
    borderRadius: 3,
  },

  table: { width: "100%", borderCollapse: "collapse" },
  thGroup: {
    padding: "10px 16px",
    background: "linear-gradient(90deg, #D20000 0%, #8B0000 100%)",
    color: "#fff",
    fontSize: 12,
    fontWeight: 600,
    textAlign: "left",
    letterSpacing: "0.4px",
    // borderBottom: "2px solid #8B0000",
  },
  thHighlight: {
    background: "#fecaca",
    color: "white",
    fontWeight: 700,
    fontSize: 13,
    textAlign: "center",
  },
  th: {
    // padding: "12px 16px",
    background: "linear-gradient(90deg, #D20000 0%, #8B0000 100%)",
    color: "white",
    fontSize: 13,
    fontWeight: 700,
    textAlign: "left",
    // borderBottom: "2px solid #fca5a5",
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
  },

  cellWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  targetText: { flex: 1, cursor: "pointer", padding: "3px 0" },
  actionBtns: {
    display: "flex",
    gap: 4,
    opacity: 0,
    transition: "opacity 0.15s",
  },
  iconBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontSize: 13,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s",
  },
  editWrap: { display: "flex", alignItems: "center", gap: 6 },
  editInput: {
    flex: 1,
    padding: "6px 10px",
    border: "2px solid #D20000",
    borderRadius: 6,
    fontSize: 14,
    outline: "none",
    color: "#1a1a2e",
    background: "#fff5f5",
    minWidth: 0,
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
    fontWeight: 500,
    fontSize: 15,
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
};

// ── CSS: hover reveal + shimmer ───────────────────────────────
if (typeof document !== "undefined") {
  const id = "__target_styles__";
  if (!document.getElementById(id)) {
    const tag = document.createElement("style");
    tag.id = id;
    tag.textContent = `
      @keyframes shimmer { 0%{transform:translateX(-150%)} 100%{transform:translateX(400%)} }
      .data-row:hover td { background-color: #fff5f5 !important; }
      .cell-row:hover .row-actions { opacity: 1 !important; }
    `;
    document.head.appendChild(tag);
  }
}

export default Target;
