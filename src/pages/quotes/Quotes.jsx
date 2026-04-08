import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getQuotes } from "../../feature/quotes/quotesThunks";
import {
  selectQuotes,
  selectQuotesLoading,
  selectQuoteError,
} from "../../feature/quotes/quotesSelectors";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Tooltip,
  Grid,
  TextField,
  MenuItem,
  InputAdornment,
} from "@mui/material";

import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import BuildIcon from "@mui/icons-material/Build";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";

// ─── Theme ───────────────────────────────────────────────────────
const THEME = {
  gradient: "linear-gradient(90deg, #D20000 0%, #8B0000 100%)",
  shadow: "0 4px 12px rgba(210,0,0,0.25)",
  primary: "#D20000",
  dark: "#8B0000",
  light: "#fff5f5",
  white: "#fff",
};

const SERVICE_COLORS = {
  "SUNROOF PROTECTION FILM": { bg: "#fff3e0", color: "#e65100" },
  "PAINT PROTECTION FILM": { bg: "#e8f5e9", color: "#2e7d32" },
  "WINDOW FILM": { bg: "#e3f2fd", color: "#1565c0" },
  "WINDSCREEN PROTECTION FILM": { bg: "#fce4ec", color: "#c62828" },
};

const SERVICE_OPTIONS = [
  "SUNROOF PROTECTION FILM",
  "PAINT PROTECTION FILM",
  "WINDOW FILM",
  "WINDSCREEN PROTECTION FILM",
];

// ─── Helpers ──────────────────────────────────────────────────────
const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const filterFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    fontSize: 13,
    width: 250,
    "&:hover fieldset": { borderColor: THEME.primary },
    "&.Mui-focused fieldset": { borderColor: THEME.primary },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: THEME.primary },
};

// ─── Stat Card ────────────────────────────────────────────────────
const StatCard = ({ label, value, icon }) => (
  <Card
    elevation={0}
    sx={{
      flex: 1,
      minWidth: 140,
      borderRadius: 3,
      border: "1px solid #f0e0e0",
      background: THEME.white,
      transition: "box-shadow 0.2s",
      "&:hover": { boxShadow: THEME.shadow },
    }}
  >
    <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: 2.5 }}>
      <Box
        sx={{
          width: 46,
          height: 46,
          borderRadius: 2,
          background: THEME.gradient,
          boxShadow: THEME.shadow,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: THEME.white,
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="h5" fontWeight={700} color={THEME.primary}>
          {value}
        </Typography>
        <Typography variant="caption" color="text.secondary" fontWeight={500}>
          {label}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

// ─── Detail Row ───────────────────────────────────────────────────
const DetailRow = ({ icon, label, value }) => (
  <Box display="flex" alignItems="flex-start" gap={1.5} py={0.8}>
    <Box
      sx={{
        width: 30,
        height: 30,
        borderRadius: 1.5,
        background: THEME.gradient,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: THEME.white,
        flexShrink: 0,
        mt: 0.2,
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography
        variant="caption"
        color="text.disabled"
        fontWeight={600}
        textTransform="uppercase"
        letterSpacing={0.5}
      >
        {label}
      </Typography>
      <Typography variant="body2" color="text.primary" fontWeight={500}>
        {value || "—"}
      </Typography>
    </Box>
  </Box>
);

// ─── Main Component ───────────────────────────────────────────────
const Quotes = () => {
  const dispatch = useDispatch();
  const quotes = useSelector(selectQuotes);
  const loading = useSelector(selectQuotesLoading);
  const error = useSelector(selectQuoteError);

  // ── Dialog ──
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);

  // ── Filters ──
  const emptyFilters = {
    full_name: "",
    email: "",
    contact: "",
    service: "",
    brand_id: "",
    model_id: "",
  };
  const [filters, setFilters] = useState(emptyFilters);

  // ── Pagination ──
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ── Debounce ref ──
  const debounceRef = useRef(null);

  // ── Initial load ──
  useEffect(() => {
    dispatch(getQuotes());
  }, [dispatch]);

  // ── Live filter: debounce 500ms on every filter change ──
  const handleFilterChange = useCallback(
    (field) => (e) => {
      const newFilters = { ...filters, [field]: e.target.value };
      setFilters(newFilters);
      setPage(0); // reset to page 1 on new filter
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const active = Object.fromEntries(
          Object.entries(newFilters).filter(([, v]) => v !== ""),
        );
        dispatch(getQuotes(active));
      }, 1000);
    },
    [filters, dispatch, debounceRef],
  );

  const handleClear = () => {
    setFilters(emptyFilters);
    setPage(0);
    dispatch(getQuotes());
  };

  const hasActiveFilter = Object.values(filters).some((v) => v !== "");

  // ── Pagination slice ──
  const paginatedQuotes =
    quotes?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) ?? [];

  const handleOpenDetail = (q) => {
    setSelectedQuote(q);
    setDialogOpen(true);
  };
  const handleCloseDetail = () => {
    setDialogOpen(false);
    setSelectedQuote(null);
  };

  const countByService = (s) =>
    quotes?.filter((q) => q.service === s).length ?? 0;

  return (
    <Box>
      {/* ── Page Header ── */}
      {/* <Box
        sx={{
          background: THEME.gradient,
          boxShadow: THEME.shadow,
          borderRadius: 3,
          p: { xs: 2.5, sm: 3 },
          mb: 3,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            bgcolor: "rgba(255,255,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FormatQuoteIcon sx={{ color: THEME.white, fontSize: 26 }} />
        </Box>
        <Box>
          <Typography
            variant="h5"
            fontWeight={700}
            color={THEME.white}
            lineHeight={1.2}
          >
            Get Quotes
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "rgba(255,255,255,0.75)", mt: 0.3 }}
          >
            All incoming quote requests from customers
          </Typography>
        </Box>
      </Box> */}

      <Box display="flex" alignItems="center" gap={1.5} mb={3}>
        <Box
          sx={{ width: 5, height: 32, bgcolor: "#D20000", borderRadius: 1 }}
        />
        <Typography variant="h5" fontWeight={800} color="#1a1a1a">
          Get Quotes
        </Typography>
      </Box>
      {/* ── Stat Cards ── */}
      {/* <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        mb={3}
        flexWrap="wrap"
      >
        <StatCard
          label="Total Quotes"
          value={quotes?.length ?? 0}
          icon={<FormatQuoteIcon fontSize="small" />}
        />
        <StatCard
          label="Sunroof Film"
          value={countByService("SUNROOF PROTECTION FILM")}
          icon={<DirectionsCarIcon fontSize="small" />}
        />
        <StatCard
          label="Paint Protection"
          value={countByService("PAINT PROTECTION FILM")}
          icon={<BuildIcon fontSize="small" />}
        />
        <StatCard
          label="Window Film"
          value={countByService("WINDOW FILM")}
          icon={<BuildIcon fontSize="small" />}
        />
        <StatCard
          label="Windscreen Film"
          value={countByService("WINDSCREEN PROTECTION FILM")}
          icon={<BuildIcon fontSize="small" />}
        />
      </Stack> */}

      {/* ── Filter Bar ── */}
      {/* <Card
        elevation={0}
        sx={{ borderRadius: 3, border: "1px solid #f0e0e0", mb: 3 }}
      >
        <Box
          sx={{
            px: 3,
            py: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <FilterListIcon sx={{ color: THEME.primary, fontSize: 18 }} />
            <Typography
              variant="subtitle2"
              fontWeight={700}
              color={THEME.primary}
            >
              Filter Quotes
            </Typography>
            {hasActiveFilter && (
              <Chip
                label="Active"
                size="small"
                sx={{
                  background: THEME.gradient,
                  color: THEME.white,
                  fontWeight: 600,
                  fontSize: 10,
                }}
              />
            )}
          </Box>
          {hasActiveFilter && (
            <Tooltip title="Clear all filters" arrow>
              <IconButton
                size="small"
                onClick={handleClear}
                sx={{ color: THEME.primary }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <Divider sx={{ borderColor: "#f0e0e0" }} />
      </Card> */}

      {/* ── Table Card ── */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid #f0e0e0",
          overflow: "hidden",
        }}
      >
        {/* <Box
          sx={{
            px: 3,
            py: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={700}
            color={THEME.primary}
          >
            All Quote Requests
          </Typography>
          <Chip
            label={`${quotes?.length ?? 0} records`}
            size="small"
            sx={{
              background: THEME.gradient,
              boxShadow: THEME.shadow,
              color: THEME.white,
              fontWeight: 600,
              fontSize: 11,
            }}
          />
        </Box> */}
        <Divider sx={{ borderColor: "#f0e0e0" }} />

        {/* ── Loading ── */}
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            py={8}
          >
            <CircularProgress sx={{ color: THEME.primary }} />
          </Box>
        ) : error ? (
          /* ── Error ── */
          <Box p={3}>
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {typeof error === "string"
                ? error
                : "Something went wrong. Please try again."}
            </Alert>
          </Box>
        ) : !quotes || quotes.length === 0 ? (
          /* ── Empty ── */
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            py={8}
          >
            <Box textAlign="center">
              <FormatQuoteIcon sx={{ fontSize: 48, color: "#e0b0b0", mb: 1 }} />
              <Typography color="text.secondary" variant="body2">
                No quote requests found.
              </Typography>
            </Box>
          </Box>
        ) : (
          <>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={7} sx={{ p: 0, border: 0 }}>
                      <Box
                        // sx={{ p: 2.5 }}
                        sx={{
                          p: 2.5,
                          width: "100%",
                          display: "flex",
                          // gap: 1,
                          flexDirection: "row",
                          // justifyContent: "space-between",
                        }}
                      >
                        {/* <Grid container spacing={2}> */}
                        {/* <Grid  xs={12} sm={6} md={4}> */}
                        <TextField
                          label="Full Name"
                          size="small"
                          fullWidth
                          value={filters.full_name}
                          onChange={handleFilterChange("full_name")}
                          sx={filterFieldSx}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonIcon
                                  sx={{ fontSize: 16, color: THEME.primary }}
                                />
                              </InputAdornment>
                            ),
                          }}
                        />
                        {/* </Grid> */}

                        {/* <Grid item xs={12} sm={6} md={4}> */}
                        <TextField
                          label="Email"
                          size="small"
                          fullWidth
                          value={filters.email}
                          onChange={handleFilterChange("email")}
                          sx={filterFieldSx}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailIcon
                                  sx={{ fontSize: 16, color: THEME.primary }}
                                />
                              </InputAdornment>
                            ),
                          }}
                        />
                        {/* </Grid> */}

                        {/* <Grid item xs={12} sm={6} md={4}> */}
                        <TextField
                          label="Contact"
                          size="small"
                          fullWidth
                          value={filters.contact}
                          onChange={handleFilterChange("contact")}
                          sx={filterFieldSx}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PhoneIcon
                                  sx={{ fontSize: 16, color: THEME.primary }}
                                />
                              </InputAdornment>
                            ),
                          }}
                        />
                        {/* </Grid> */}

                        {/* <Grid item xs={12} sm={6} md={4}> */}
                        <TextField
                          select
                          label="Service"
                          size="small"
                          fullWidth
                          value={filters.service}
                          onChange={handleFilterChange("service")}
                          sx={filterFieldSx}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <BuildIcon
                                  sx={{ fontSize: 16, color: THEME.primary }}
                                />
                              </InputAdornment>
                            ),
                          }}
                        >
                          <MenuItem value="">
                            <em>All Services</em>
                          </MenuItem>
                          {SERVICE_OPTIONS.map((s) => (
                            <MenuItem key={s} value={s}>
                              <Box display="flex" alignItems="center" gap={1}>
                                <Box
                                  sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    bgcolor: SERVICE_COLORS[s]?.color,
                                  }}
                                />
                                <Typography variant="body2" fontSize={12}>
                                  {s}
                                </Typography>
                              </Box>
                            </MenuItem>
                          ))}
                        </TextField>
                        {/* </Grid> */}

                        {/* <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Brand ID"
                size="small"
                fullWidth
                type="number"
                value={filters.brand_id}
                onChange={handleFilterChange("brand_id")}
                sx={filterFieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DirectionsCarIcon
                        sx={{ fontSize: 16, color: THEME.primary }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Model ID"
                size="small"
                fullWidth
                type="number"
                value={filters.model_id}
                onChange={handleFilterChange("model_id")}
                sx={filterFieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DirectionsCarIcon
                        sx={{ fontSize: 16, color: THEME.primary }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid> */}
                        {/* </Grid> */}
                      </Box>
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ bgcolor: "#fff5f5" }}>
                    {[
                      "Sr",
                      "Customer",
                      "Contact",
                      "Vehicle",
                      "Service",
                      "Date",
                      "Details",
                    ].map((h) => (
                      <TableCell
                        key={h}
                        sx={{
                          color: THEME.primary,
                          fontWeight: 700,
                          fontSize: 12,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                          borderBottom: "2px solid #f0e0e0",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginatedQuotes.map((quote, index) => {
                    const serviceStyle = SERVICE_COLORS[quote.service] || {
                      bg: "#f5f5f5",
                      color: "#555",
                    };
                    const srNo = page * rowsPerPage + index + 1;
                    return (
                      <TableRow
                        key={quote.id}
                        sx={{
                          "&:hover": { bgcolor: "#fff5f5" },
                          transition: "background 0.15s",
                          "&:last-child td": { border: 0 },
                        }}
                      >
                        <TableCell>
                          <Typography
                            variant="body2"
                            color="text.disabled"
                            fontWeight={600}
                          >
                            {String(srNo).padStart(2, "0")}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1.5}>
                            <Avatar
                              sx={{
                                width: 36,
                                height: 36,
                                fontSize: 13,
                                fontWeight: 700,
                                background: THEME.gradient,
                                boxShadow: THEME.shadow,
                                color: THEME.white,
                                flexShrink: 0,
                              }}
                            >
                              {getInitials(quote.full_name)}
                            </Avatar>
                            <Box>
                              <Typography
                                variant="body2"
                                fontWeight={600}
                                color="text.primary"
                                noWrap
                              >
                                {quote.full_name}
                              </Typography>
                              <Box display="flex" alignItems="center" gap={0.5}>
                                <EmailIcon
                                  sx={{ fontSize: 11, color: THEME.primary }}
                                />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  noWrap
                                >
                                  {quote.email}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Box display="flex" alignItems="center" gap={0.8}>
                            <PhoneIcon
                              sx={{ fontSize: 14, color: THEME.primary }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {quote.contact}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Box display="flex" alignItems="center" gap={0.8}>
                            <DirectionsCarIcon
                              sx={{ fontSize: 14, color: THEME.primary }}
                            />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              noWrap
                            >
                              {quote.brand_name} {quote.model_name}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={quote.service}
                            size="small"
                            sx={{
                              bgcolor: serviceStyle.bg,
                              color: serviceStyle.color,
                              fontWeight: 600,
                              fontSize: 10,
                              height: 22,
                              maxWidth: 200,
                              "& .MuiChip-label": { px: 1 },
                            }}
                          />
                        </TableCell>

                        <TableCell>
                          <Box display="flex" alignItems="center" gap={0.8}>
                            <CalendarTodayIcon
                              sx={{ fontSize: 13, color: THEME.primary }}
                            />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              noWrap
                            >
                              {formatDate(quote.created_at)}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Tooltip title="View Full Details" arrow>
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDetail(quote)}
                              sx={{
                                background: THEME.gradient,
                                boxShadow: THEME.shadow,
                                color: THEME.white,
                                width: 32,
                                height: 32,
                                "&:hover": {
                                  background: THEME.gradient,
                                  opacity: 0.85,
                                },
                              }}
                            >
                              <InfoOutlinedIcon sx={{ fontSize: 15 }} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {/* ── Pagination ── */}
            <TablePagination
              component="div"
              count={quotes.length}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25, 50]}
              sx={{
                borderTop: "1px solid #f0e0e0",
                "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                  { color: "text.secondary", fontSize: 13 },
                "& .MuiTablePagination-select": {
                  color: THEME.primary,
                  fontWeight: 600,
                },
                "& .MuiIconButton-root": {
                  color: THEME.primary,
                  "&.Mui-disabled": { color: "#ccc" },
                },
              }}
            />
          </>
        )}
      </Card>

      {/* ── Detail Dialog ── */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDetail}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}
      >
        <DialogTitle
          sx={{
            background: THEME.gradient,
            boxShadow: THEME.shadow,
            color: THEME.white,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            py: 2,
            px: 3,
          }}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              fontSize: 14,
              fontWeight: 700,
              bgcolor: "rgba(255,255,255,0.2)",
              color: THEME.white,
            }}
          >
            {getInitials(selectedQuote?.full_name)}
          </Avatar>
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              color={THEME.white}
            >
              {selectedQuote?.full_name}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "rgba(255,255,255,0.75)" }}
            >
              Quote #{selectedQuote?.id} ·{" "}
              {formatDate(selectedQuote?.created_at)}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ px: 3, pt: 2.5, pb: 1 }}>
          {selectedQuote?.service && (
            <Box mb={2}>
              <Chip
                label={selectedQuote.service}
                sx={{
                  bgcolor:
                    SERVICE_COLORS[selectedQuote.service]?.bg || "#f5f5f5",
                  color: SERVICE_COLORS[selectedQuote.service]?.color || "#555",
                  fontWeight: 700,
                  fontSize: 11,
                }}
              />
            </Box>
          )}
          <Divider sx={{ borderColor: "#f0e0e0", mb: 1.5 }} />
          <Grid container spacing={0}>
            <Grid item xs={12} sm={6}>
              <DetailRow
                icon={<PersonIcon sx={{ fontSize: 14 }} />}
                label="Full Name"
                value={selectedQuote?.full_name}
              />
              <DetailRow
                icon={<EmailIcon sx={{ fontSize: 14 }} />}
                label="Email"
                value={selectedQuote?.email}
              />
              <DetailRow
                icon={<PhoneIcon sx={{ fontSize: 14 }} />}
                label="Contact"
                value={selectedQuote?.contact}
              />
              <DetailRow
                icon={<LocationOnIcon sx={{ fontSize: 14 }} />}
                label="Address"
                value={selectedQuote?.Address}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailRow
                icon={<DirectionsCarIcon sx={{ fontSize: 14 }} />}
                label="Brand"
                value={selectedQuote?.brand_name}
              />
              <DetailRow
                icon={<DirectionsCarIcon sx={{ fontSize: 14 }} />}
                label="Model"
                value={selectedQuote?.model_name}
              />
              <DetailRow
                icon={<BuildIcon sx={{ fontSize: 14 }} />}
                label="Service"
                value={selectedQuote?.service}
              />
              <DetailRow
                icon={<CalendarTodayIcon sx={{ fontSize: 14 }} />}
                label="Requested On"
                value={formatDate(selectedQuote?.created_at)}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
          <Button
            onClick={handleCloseDetail}
            variant="contained"
            size="small"
            sx={{
              background: THEME.gradient,
              boxShadow: THEME.shadow,
              color: THEME.white,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              "&:hover": { background: THEME.gradient, opacity: 0.88 },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Quotes;
