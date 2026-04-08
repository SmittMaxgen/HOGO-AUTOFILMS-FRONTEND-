import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getContacts } from "../../feature/contacts/contactThunks";
import {
  selectContacts,
  selectContactsLoading,
  selectContactError,
} from "../../feature/contacts/contactsSelectors";

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
  TextField,
  InputAdornment,
  Pagination,
  Grid,
} from "@mui/material";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import PersonIcon from "@mui/icons-material/Person";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";

// ─── Theme Colors ────────────────────────────────────────────────
const THEME = {
  gradient: "linear-gradient(90deg, #D20000 0%, #8B0000 100%)",
  shadow: "0 4px 12px rgba(210,0,0,0.25)",
  primary: "#D20000",
  dark: "#8B0000",
  light: "#fff5f5",
  white: "#fff",
};

const filterFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    fontSize: 13,
    "&:hover fieldset": { borderColor: THEME.primary },
    "&.Mui-focused fieldset": { borderColor: THEME.primary },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: THEME.primary },
};

// ─── Helper: Initials from name ──────────────────────────────────
const getInitials = (name = "") =>
  name
    ?.split(" ")
    ?.map((n) => n[0])
    ?.slice(0, 2)
    ?.join("")
    ?.toUpperCase();

// ─── Stat Card ───────────────────────────────────────────────────
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

// ─── Main Component ──────────────────────────────────────────────
const Contacts = () => {
  const dispatch = useDispatch();
  const contacts = useSelector(selectContacts);
  const loading = useSelector(selectContactsLoading);
  const error = useSelector(selectContactError);

  // ── Dialog ──
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  // ── Filters ──
  const emptyFilters = { name: "", email: "", mobile: "" };
  const [filters, setFilters] = useState(emptyFilters);

  // ── Pagination ──
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // ── Debounce ──
  const debounceRef = useRef(null);

  useEffect(() => {
    dispatch(getContacts());
  }, [dispatch]);

  // ── Live filter with 500ms debounce ──
  const handleFilterChange = (field) => (e) => {
    const newFilters = { ...filters, [field]: e.target.value };
    setFilters(newFilters);
    setPage(1);

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const active = Object.fromEntries(
        Object.entries(newFilters).filter(([, v]) => v !== ""),
      );
      dispatch(getContacts(active));
    }, 500);
  };

  const handleClear = () => {
    setFilters(emptyFilters);
    setPage(1);
    dispatch(getContacts());
  };

  const hasActiveFilter = Object.values(filters).some((v) => v !== "");

  // ── Pagination slice ──
  const paginatedContacts =
    contacts?.slice((page - 1) * rowsPerPage, page * rowsPerPage) ?? [];

  const totalPages = Math.ceil((contacts?.length || 0) / rowsPerPage);

  const handleOpenMessage = (c) => {
    setSelectedContact(c);
    setDialogOpen(true);
  };
  const handleCloseMessage = () => {
    setDialogOpen(false);
    setSelectedContact(null);
  };

  return (
    <Box>
      {/* ── Page Header ── */}
      {/* <Box
        sx={{
          width: "100%",
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
          <PeopleAltIcon sx={{ color: THEME.white, fontSize: 26 }} />
        </Box>
        <Box>
          <Typography
            variant="h5"
            fontWeight={700}
            color={THEME.white}
            lineHeight={1.2}
          >
            Contact Us
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "rgba(255,255,255,0.75)", mt: 0.3 }}
          >
            Manage and view all contact submissions
          </Typography>
        </Box>
      </Box> */}
      <Box display="flex" alignItems="center" gap={1.5} mb={3}>
        <Box
          sx={{ width: 5, height: 32, bgcolor: "#D20000", borderRadius: 1 }}
        />
        <Typography variant="h5" fontWeight={800} color="#1a1a1a">
          Contact Us
        </Typography>
      </Box>
      {/* ── Stat Cards ── */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        mb={3}
        flexWrap="wrap"
      >
        <StatCard
          label="Total Contacts"
          value={contacts?.length ?? 0}
          icon={<PeopleAltIcon fontSize="small" />}
        />
        <StatCard
          label="Emails Collected"
          value={contacts?.filter((c) => c.email).length ?? 0}
          icon={<EmailIcon fontSize="small" />}
        />
        <StatCard
          label="With Mobile"
          value={contacts?.filter((c) => c.mobile).length ?? 0}
          icon={<PhoneIcon fontSize="small" />}
        />
        <StatCard
          label="With Message"
          value={contacts?.filter((c) => c.message).length ?? 0}
          icon={<ChatBubbleOutlineIcon fontSize="small" />}
        />
      </Stack>

      {/* ── Filter Bar ── */}
      <Card
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
              Filter Contacts
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
        <Box sx={{ p: 2.5 }}>
          <Grid container spacing={2}>
            {/* Name */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Name"
                size="small"
                fullWidth
                value={filters.name}
                onChange={handleFilterChange("name")}
                sx={filterFieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ fontSize: 16, color: THEME.primary }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} sm={4}>
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
                      <EmailIcon sx={{ fontSize: 16, color: THEME.primary }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Mobile */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Mobile"
                size="small"
                fullWidth
                value={filters.mobile}
                onChange={handleFilterChange("mobile")}
                sx={filterFieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon sx={{ fontSize: 16, color: THEME.primary }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Card>

      {/* ── Table Card ── */}
      <Paper
        elevation={2}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid #f0f0f0",
        }}
      >
        {/* Card Header */}
        <Box
          sx={{
            px: 3,
            py: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
            bgcolor: "#fafafa",
            borderBottom: "1px solid #ebebeb",
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={700}
            color={THEME.primary}
          >
            All Contacts
          </Typography>
          <Chip
            label={`${contacts?.length ?? 0} records`}
            size="small"
            sx={{
              background: THEME.gradient,
              boxShadow: THEME.shadow,
              color: THEME.white,
              fontWeight: 600,
              fontSize: 11,
            }}
          />
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            {/* ── Head ── */}
            <TableHead>
              <TableRow sx={{ background: THEME.gradient }}>
                {["Sr", "Contact", "Email", "Mobile", "Message"].map((h) => (
                  <TableCell
                    key={h}
                    sx={{
                      color: THEME.white,
                      fontWeight: 700,
                      fontSize: 13,
                      letterSpacing: 0.5,
                      border: "none",
                      py: 1.5,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            {/* ── Body ── */}
            <TableBody>
              {/* Loading */}
              {loading && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      gap={1}
                    >
                      <CircularProgress
                        size={28}
                        sx={{ color: THEME.primary }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Loading contacts...
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}

              {/* Error */}
              {!loading && error && (
                <TableRow>
                  <TableCell colSpan={5} sx={{ py: 3, px: 3 }}>
                    <Alert severity="error" sx={{ borderRadius: 2 }}>
                      {typeof error === "string"
                        ? error
                        : "Something went wrong. Please try again."}
                    </Alert>
                  </TableCell>
                </TableRow>
              )}

              {/* Empty */}
              {!loading && !error && (!contacts || contacts.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      gap={1}
                    >
                      <PeopleAltIcon sx={{ fontSize: 40, color: "#e0e0e0" }} />
                      <Typography color="text.secondary" fontWeight={500}>
                        No contacts found
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}

              {/* Rows */}
              {!loading &&
                !error &&
                paginatedContacts.map((contact, index) => (
                  <TableRow
                    key={contact.id}
                    hover
                    sx={{
                      "&:hover": { bgcolor: "#fff5f5" },
                      transition: "background 0.15s",
                      "&:last-child td": { border: 0 },
                      borderBottom: "1px solid #f5f5f5",
                    }}
                  >
                    {/* Sr */}
                    <TableCell
                      sx={{ fontWeight: 700, color: THEME.primary, width: 50 }}
                    >
                      {(page - 1) * rowsPerPage + index + 1}
                    </TableCell>

                    {/* Name + Avatar */}
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
                          {getInitials(contact.name)}
                        </Avatar>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color="text.primary"
                        >
                          {contact.name}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Email */}
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={0.8}>
                        <EmailIcon
                          sx={{ fontSize: 14, color: THEME.primary }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {contact.email}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Mobile */}
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={0.8}>
                        <PhoneIcon
                          sx={{ fontSize: 14, color: THEME.primary }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {contact.mobile}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Message */}
                    <TableCell>
                      {contact.message ? (
                        <Tooltip title="View Message" arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenMessage(contact)}
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
                            <ChatBubbleOutlineIcon sx={{ fontSize: 15 }} />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Typography
                          variant="body2"
                          color="text.disabled"
                          fontStyle="italic"
                        >
                          —
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ── Pagination (Lead.jsx style) ── */}
        {!loading && !error && (
          <Box
            sx={{
              px: 3,
              py: 2,
              borderTop: "1px solid #f0f0f0",
              bgcolor: "#fafafa",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, v) => setPage(v)}
              sx={{
                "& .MuiPaginationItem-root.Mui-selected": {
                  bgcolor: THEME.primary,
                  color: THEME.white,
                  "&:hover": { bgcolor: THEME.dark },
                },
              }}
            />
          </Box>
        )}
      </Paper>

      {/* ── Message Dialog ── */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseMessage}
        maxWidth="xs"
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
          <ChatBubbleOutlineIcon fontSize="small" />
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              color={THEME.white}
            >
              Message
            </Typography>
            {selectedContact && (
              <Typography
                variant="caption"
                sx={{ color: "rgba(255,255,255,0.75)" }}
              >
                From: {selectedContact.name}
              </Typography>
            )}
          </Box>
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 2.5 }}>
          <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
            {selectedContact?.message}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={handleCloseMessage}
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

export default Contacts;
