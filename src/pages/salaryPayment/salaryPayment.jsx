import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getSalaryPayments } from "../../feature/salaryPayment/salaryPaymentThunks";

import {
  selectSalaryPayments,
  selectSalaryPaymentsLoading,
} from "../../feature/salaryPayment/salaryPaymentSelectors";

import { selectEmployees } from "../../feature/employee/employeeSelector";
import { getEmployees } from "../../feature/employee/employeeThunks";

import {
  Box,
  Paper,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  CircularProgress,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";

import CommonSearchField from "../../components/commonComponents/CommonSearchField";

// ─── Constants ─────────────────────────────────────────────
const MONTHS = [
  { label: "Jan", value: 1 },
  { label: "Feb", value: 2 },
  { label: "Mar", value: 3 },
  { label: "Apr", value: 4 },
  { label: "May", value: 5 },
  { label: "Jun", value: 6 },
  { label: "Jul", value: 7 },
  { label: "Aug", value: 8 },
  { label: "Sep", value: 9 },
  { label: "Oct", value: 10 },
  { label: "Nov", value: 11 },
  { label: "Dec", value: 12 },
];

// ─── Main Component ────────────────────────────────────────

const FilterSelect = ({ value, onChange, placeholder, options }) => {
  return (
    <Box sx={{ minWidth: 140 }}>
      <Select
        value={value || ""}
        onChange={onChange}
        displayEmpty
        size="small"
        renderValue={(selected) => {
          if (!selected) return <em>{placeholder}</em>;
          const found = options.find((o) => o.value === selected);
          return found ? found.label : selected;
        }}
        sx={{
          height: 39,
          borderRadius: "10px",
          fontSize: 13,
          color: "#616161",
          backgroundColor: "#f5f5f5",
          "&:hover fieldset": { borderColor: "#D20000" },
          "&.Mui-focused fieldset": { borderColor: "#D20000" },
        }}
      >
        <MenuItem value="">
          <em>All</em>
        </MenuItem>

        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

const SalaryPayment = () => {
  const dispatch = useDispatch();

  const salaryPayments = useSelector(selectSalaryPayments);
  const loading = useSelector(selectSalaryPaymentsLoading);
  const employees = useSelector(selectEmployees);

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    employee: "",
    month: "",
    year: "",
  });

  // ─── Initial Load ───────────────────────────────────────
  useEffect(() => {
    dispatch(getEmployees());
    dispatch(getSalaryPayments());
  }, [dispatch]);

  // ─── Filter Change ──────────────────────────────────────
  useEffect(() => {
    const params = {};

    if (filters.employee) params.employee = filters.employee;
    if (filters.month) params.month = filters.month;
    if (filters.year) params.year = filters.year;

    dispatch(getSalaryPayments(params));
    setPage(1);
  }, [filters, dispatch]);

  // ─── Helpers ────────────────────────────────────────────
  const getEmployeeName = (id) => {
    const emp = employees?.find((e) => String(e.id) === String(id));
    return emp ? `${emp.first_name || ""} ${emp.last_name || ""}` : "N/A";
  };

  const filteredData = salaryPayments?.filter((s) => {
    const empName = getEmployeeName(s.employee).toLowerCase();
    return empName.includes(search.toLowerCase());
  });

  const paginatedData = filteredData?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  // ─── UI ────────────────────────────────────────────────
  return (
    <Box>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight={800}>
          Salary Payments
        </Typography>
      </Stack>

      <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
        {/* Filters */}
        <Box p={2} sx={{ borderBottom: "1px solid #eee" }}>
          <Grid container spacing={2}>
            {/* Employee */}
            <Grid item xs={12} md={3}>
              <FilterSelect
                value={filters.employee}
                onChange={(e) =>
                  setFilters({ ...filters, employee: e.target.value })
                }
                placeholder="Filter by Employee"
                options={
                  employees?.map((e) => ({
                    value: e.id,
                    label: `${e.first_name || ""} ${e.last_name || ""}`,
                  })) || []
                }
              />
            </Grid>

            {/* Month */}
            <Grid item xs={12} md={3}>
              <FilterSelect
                value={filters.month}
                onChange={(e) =>
                  setFilters({ ...filters, month: e.target.value })
                }
                placeholder="Filter by Month"
                options={MONTHS.map((m) => ({
                  value: m.value,
                  label: m.label,
                }))}
              />
            </Grid>

            {/* Year */}
            <Grid item xs={12} md={3}>
              <FilterSelect
                value={filters.year}
                onChange={(e) =>
                  setFilters({ ...filters, year: e.target.value })
                }
                placeholder="Filter by Year"
                options={[2024, 2025, 2026, 2027].map((y) => ({
                  value: y,
                  label: y,
                }))}
              />
            </Grid>

            {/* Search (KEEP SAME) */}
            <Grid item xs={12} md={3}>
              <CommonSearchField
                value={search}
                placeholder="Search employee..."
                onChange={(v) => setSearch(v)}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#D20000" }}>
                {[
                  "Sr",
                  "Employee",
                  "Month",
                  "Year",
                  "Present",
                  "Absent",
                  "Gross",
                  "Deduction",
                  "Net",
                ].map((h) => (
                  <TableCell key={h} sx={{ color: "#fff", fontWeight: 700 }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                paginatedData?.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      {(page - 1) * rowsPerPage + index + 1}
                    </TableCell>

                    <TableCell>{getEmployeeName(row.employee)}</TableCell>

                    <TableCell>
                      {MONTHS.find((m) => m.value === row.month)?.label}
                    </TableCell>

                    <TableCell>{row.year}</TableCell>

                    <TableCell>{row.present_days}</TableCell>

                    <TableCell>{row.absent_days}</TableCell>

                    <TableCell>₹{row.gross_salary}</TableCell>

                    <TableCell>₹{row.deductions}</TableCell>

                    <TableCell>
                      <b>₹{row.net_salary}</b>
                    </TableCell>
                  </TableRow>
                ))}

              {!loading && filteredData?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No Data Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box p={2} display="flex" justifyContent="flex-end">
          <Pagination
            count={Math.ceil((filteredData?.length || 0) / rowsPerPage)}
            page={page}
            sx={{
              "& .MuiPaginationItem-root.Mui-selected": {
                bgcolor: "#D20000",
                color: "#fff",
                "&:hover": { bgcolor: "#a80000" },
              },
            }}
            onChange={(_, v) => setPage(v)}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default SalaryPayment;
