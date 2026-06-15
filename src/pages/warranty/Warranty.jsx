import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Divider,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Grid,
  Select,
  Pagination,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  HourglassEmpty,
  Visibility,
  DirectionsCar,
  Person,
  CalendarToday,
  ZoomIn,
  InfoOutlined,
} from "@mui/icons-material";
import {
  getWarranties,
  updateWarranty,
} from "../../feature/Warranty/warrantyThunks";
import {
  selectWarrantyList,
  selectWarrantyCount,
  selectWarrantyLoading,
  selectWarrantyUpdateLoading,
  selectWarrantyUpdateSuccess,
  selectWarrantyError,
} from "../../feature/Warranty/warrantySelector";

import { selectAdminList } from "../../feature/Admin/adminSelector";

import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GppGoodIcon from "@mui/icons-material/GppGood";
import SearchIcon from "@mui/icons-material/Search";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import CommonButton from "../../components/commonComponents/CommonButton";
import CommonToast from "../../components/commonComponents/Toster";
import CommonSearchField from "../../components/commonComponents/CommonSearchField";

import { UpdateAdminUser, AdminUser } from "../../feature/Admin/adminThunks";

const BASE_URL = "https://apidata.hogonnindia.com";

// ─── Shared Helpers ────────────────────────────────────────────────────────────

const SectionHeading = ({ title }) => (
  <Box display="flex" alignItems="center" gap={1.5} mb={2}>
    <Box sx={{ width: 4, height: 22, bgcolor: "#D20000", borderRadius: 1 }} />
    <Typography
      variant="subtitle1"
      fontWeight={700}
      color="#1a1a1a"
      letterSpacing={0.5}
    >
      {title}
    </Typography>
  </Box>
);

const PageHeader = ({ title, onBack }) => (
  <Box
    display="flex"
    alignItems="center"
    mb={3}
    px={2}
    py={1.5}
    sx={{
      background: "linear-gradient(90deg, #D20000 0%, #8B0000 100%)",
      borderRadius: 2,
      boxShadow: "0 4px 12px rgba(210,0,0,0.25)",
    }}
  >
    {onBack && (
      <IconButton onClick={onBack} sx={{ color: "#fff", mr: 1.5 }}>
        <ArrowBackIcon />
      </IconButton>
    )}
    <Typography variant="h6" fontWeight={700} color="#fff" letterSpacing={1}>
      {title}
    </Typography>
  </Box>
);

const DetailCard = ({ label, value, icon }) => (
  <Box
    sx={{
      p: 2,
      bgcolor: "#fafafa",
      border: "1px solid #ebebeb",
      borderRadius: 2,
      height: "100%",
    }}
  >
    <Box display="flex" alignItems="center" gap={0.8} mb={0.5}>
      {icon && <Box sx={{ color: "#D20000", display: "flex" }}>{icon}</Box>}
      <Typography variant="caption" color="text.secondary" fontWeight={700}>
        {label}
      </Typography>
    </Box>
    <Typography variant="body2" fontWeight={600} color="#1a1a1a">
      {value ?? "N/A"}
    </Typography>
  </Box>
);

// ─── Constants ────────────────────────────────────────────────────────────────

const WARRANTY_STATUS = {
  PENDING: { label: "Pending", color: "warning" },
  ACTIVE: { label: "Approved", color: "success" },
  HOLD: { label: "Hold", color: "info" },
  EXPIRED: { label: "Expired", color: "error" },
};

const STATUS_CHIP_CONFIG = {
  PENDING: {
    color: "warning",
    icon: <HourglassEmpty fontSize="small" />,
    label: "Pending",
  },
  ACTIVE: {
    color: "success",
    icon: <CheckCircle fontSize="small" />,
    label: "Approved",
  },
  HOLD: {
    color: "info",
    icon: <HourglassEmpty fontSize="small" />,
    label: "Hold",
  },
  // ACCEPT: {
  //   color: "success",
  //   icon: <CheckCircle fontSize="small" />,
  //   label: "Accepted",
  // },
  REJECTED: {
    color: "error",
    icon: <Cancel fontSize="small" />,
    label: "Rejected",
  },
  EXPIRED: {
    color: "default",
    icon: <HourglassEmpty fontSize="small" />,
    label: "Expired",
  },
  // VOID: { color: "default", icon: <Cancel fontSize="small" />, label: "Void" },
};

// ─── Main Component ────────────────────────────────────────────────────────────

const WarrantyManagement = () => {
  const dispatch = useDispatch();

  const warranties = useSelector(selectWarrantyList);
  const count = useSelector(selectWarrantyCount);
  const loading = useSelector(selectWarrantyLoading);
  const updateLoading = useSelector(selectWarrantyUpdateLoading);
  const updateSuccess = useSelector(selectWarrantyUpdateSuccess);
  const error = useSelector(selectWarrantyError);

  const adminList = useSelector(selectAdminList);
  console.log("adminList:::>>>>", adminList);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedWarranty, setSelectedWarranty] = useState(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showHoldDialog, setShowHoldDialog] = useState(false);
  const [showHoldReasonDialog, setShowHoldReasonDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [holdReason, setHoldReason] = useState("");
  const [holdReasonPreview, setHoldReasonPreview] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [searchQuery, setSearchQuery] = useState({
    serial_id: "",
    detailer_mobile: "",
    installation_date: "",
    warranty_status: "",
    product_status: "",
  });

  // useEffect(() => {
  //   dispatch(getWarranties());
  // }, [dispatch]);

  useEffect(() => {
    setPage(1);
    dispatch(
      getWarranties({
        serial_id: searchQuery.serial_id,
        warranty_status: searchQuery.warranty_status,
        product_status: searchQuery.product_status,
        installation_date: searchQuery.installation_date,
        detailer_mobile: searchQuery.installation_datdetailer_mobile,
      }),
    );
  }, [
    dispatch,
    searchQuery.serial_id,
    searchQuery.warranty_status,
    searchQuery.product_status,
    searchQuery.detailer_mobile,
    searchQuery.installation_date,
  ]);

  useEffect(() => {
    dispatch(AdminUser());
  }, [dispatch]);

  useEffect(() => {
    if (updateSuccess) {
      CommonToast("Warranty updated successfully", "success");
      setShowViewDialog(false);
      setShowRejectDialog(false);
      setShowHoldDialog(false);
      setRejectionReason("");
      setHoldReason("");
      setSelectedWarranty(null);
      dispatch(getWarranties());
    }
  }, [updateSuccess, dispatch]);

  useEffect(() => {
    if (error) CommonToast(error, "error");
  }, [error, dispatch]);

  const handleOpenMenu = (e, w) => {
    setAnchorEl(e.currentTarget);
    setSelectedWarranty(w);
  };
  const handleCloseMenu = () => setAnchorEl(null);
  const handleView = (w) => {
    setSelectedWarranty(w);
    setShowViewDialog(true);
  };

  const handleWarrantyStatusChange = (status) => {
    if (!selectedWarranty) return;
    handleCloseMenu();
    if (status === "HOLD") {
      setHoldReason(selectedWarranty.hold_reason || "");
      setShowHoldDialog(true);
      return;
    }
    dispatch(
      updateWarranty({
        id: selectedWarranty.id,
        data: {
          warranty_status: status,
          approved_by: (adminList && adminList?.id) || null,
        },
      }),
    );
  };

  const handleAccept = () => {
    if (window.confirm("Are you sure you want to accept this warranty?")) {
      dispatch(
        updateWarranty({
          id: selectedWarranty.id,

          data: {
            warranty_status: "ACTIVE",
            approved_by: (adminList && adminList?.id) || null,
          },
        }),
      );
    }
  };

  const handleRejectClick = () => {
    setShowViewDialog(false);
    setShowRejectDialog(true);
  };

  const confirmReject = () => {
    if (!rejectionReason.trim()) {
      CommonToast("Please provide a rejection reason", "error");
      return;
    }
    dispatch(
      updateWarranty({
        id: selectedWarranty.id,
        data: {
          warranty_status: "EXPIRED",
          rejection_reason: rejectionReason,
          approved_by: (adminList && adminList?.id) || null,
        },
      }),
    );
  };

  const confirmHold = () => {
    dispatch(
      updateWarranty({
        id: selectedWarranty.id,
        data: {
          warranty_status: "HOLD",
          ...(holdReason.trim() ? { hold_reason: holdReason.trim() } : {}),
          approved_by: (adminList && adminList?.id) || null,
        },
      }),
    );
  };

  const handleShowHoldReason = (reason) => {
    setHoldReasonPreview(reason || "No hold reason provided");
    setShowHoldReasonDialog(true);
  };

  const getStatusChip = (status) => {
    const c = STATUS_CHIP_CONFIG[status] || STATUS_CHIP_CONFIG.PENDING;
    return (
      <Chip
        icon={c.icon}
        label={c.label}
        color={c.color}
        size="small"
        sx={{ fontWeight: 700, borderRadius: 1 }}
      />
    );
  };

  const formatDate = (d) => {
    if (!d) return "N/A";
    return new Date(d).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getImageUrl = (path) => (path ? `${BASE_URL}/${path}` : "");

  // ── Loading ──────────────────────────────────────────────────────────────────
  // const filteredWarranties = warranties.filter((w) => {
  //   const mobileMatch = w.detailer_mobile
  //     ?.toString()
  //     .toLowerCase()
  //     .includes(searchQuery.detailer_mobile.toLowerCase());

  //   const dateMatch = searchQuery.installation_date
  //     ? w.installation_date?.startsWith(searchQuery.installation_date)
  //     : true;

  //   return mobileMatch && dateMatch;
  // });

  const filteredWarranties = warranties.filter((w) => {
    const mobileMatch = w.detailer_mobile
      ?.toString()
      .toLowerCase()
      .includes(searchQuery.detailer_mobile.toLowerCase());

    const dateMatch = searchQuery.installation_date
      ? w.installation_date?.startsWith(searchQuery.installation_date)
      : true;

    return mobileMatch && dateMatch;
  });

  const paginatedWarranties = filteredWarranties.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );
  // if (loading) {
  //   return (
  //     <Box
  //       display="flex"
  //       flexDirection="column"
  //       alignItems="center"
  //       justifyContent="center"
  //       minHeight="60vh"
  //       gap={2}
  //     >
  //       <CircularProgress size={40} sx={{ color: "#D20000" }} />
  //       <Typography variant="body2" color="text.secondary">
  //         Loading warranties...
  //       </Typography>
  //     </Box>
  //   );
  // }

  // ── View Detail ──────────────────────────────────────────────────────────────
  if (showViewDialog && selectedWarranty) {
    return (
      <Box>
        <PageHeader
          title="Warranty Details"
          onBack={() => {
            setShowViewDialog(false);
            setSelectedWarranty(null);
          }}
        />

        {/* Accept / Reject Actions */}
        {/* {selectedWarranty.product_status !== "ACTIVE" && (
          <Paper
            elevation={0}
            sx={{
              mb: 3,
              px: 3,
              py: 2,
              border: "1px solid #f0f0f0",
              borderRadius: 2,
              bgcolor: "#fafafa",
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight={600}
              sx={{ flexGrow: 1 }}
            >
              Take action on this warranty request:
            </Typography>
            <Button
              variant="contained"
              startIcon={<CheckCircle />}
              onClick={handleAccept}
              disabled={updateLoading}
              sx={{
                bgcolor: "#2e7d32",
                "&:hover": { bgcolor: "#1b5e20" },
                fontWeight: 700,
                textTransform: "none",
                borderRadius: 1.5,
                px: 3,
                boxShadow: "0 4px 10px rgba(46,125,50,0.3)",
              }}
            >
              Accept Warranty
            </Button>
            <Button
              variant="contained"
              startIcon={<Cancel />}
              onClick={handleRejectClick}
              disabled={updateLoading}
              sx={{
                bgcolor: "#D20000",
                "&:hover": { bgcolor: "#a80000" },
                fontWeight: 700,
                textTransform: "none",
                borderRadius: 1.5,
                px: 3,
                boxShadow: "0 4px 10px rgba(210,0,0,0.3)",
              }}
            >
              Reject Warranty
            </Button>
          </Paper>
        )} */}

        {/* Rejection Reason Alert */}
        {selectedWarranty.warranty_status === "EXPIRED" &&
          selectedWarranty.rejection_reason && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                Rejection Reason
              </Typography>
              <Typography variant="body2">
                {selectedWarranty.rejection_reason}
              </Typography>
            </Alert>
          )}

        {selectedWarranty.warranty_status === "HOLD" &&
          selectedWarranty.hold_reason && (
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                Hold Reason
              </Typography>
              <Typography variant="body2">
                {selectedWarranty.hold_reason}
              </Typography>
            </Alert>
          )}
        <Paper
          elevation={2}
          sx={{ p: 0, mb: 3, borderRadius: 3, border: "1px solid #f0f0f0" }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              px: 4,
              py: 3,
              bgcolor: "#fafafa",
              borderBottom: "2px solid #D20000",
            }}
          >
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: 2,
                bgcolor: "#ebebeb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "3px solid #D20000",
                flexShrink: 0,
              }}
            >
              <VerifiedUserIcon sx={{ fontSize: 32, color: "#D20000" }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700} color="#1a1a1a">
                {selectedWarranty.serial_number}
              </Typography>
              <Box display="flex" gap={1} mt={0.8} flexWrap="wrap">
                {/* <Chip
                  label={selectedWarranty.car_registration_number}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 700, borderRadius: 1, fontSize: 11 }}
                /> */}
                <Chip
                  label={
                    WARRANTY_STATUS[selectedWarranty.warranty_status]?.label ||
                    selectedWarranty.warranty_status
                  }
                  color={
                    WARRANTY_STATUS[selectedWarranty.warranty_status]?.color ||
                    "default"
                  }
                  size="small"
                  sx={{ fontWeight: 700, borderRadius: 1, fontSize: 11 }}
                />
              </Box>
            </Box>
          </Box>

          {/* Details Grid */}
          {/* <Box px={4} py={3}>
            <SectionHeading title="Warranty Information" />
            <Grid container spacing={2} mb={3}>
              {[
                {
                  label: "Serial ID",
                  value: selectedWarranty.serial_number,
                  icon: <GppGoodIcon fontSize="small" />,
                },
                {
                  label: "Color",
                  value: selectedWarranty.color,
                  // icon: <GppGoodIcon fontSize="small" />,
                },
                {
                  label: "Owner Name",
                  value: selectedWarranty.Owner_name,
                  // icon: <GppGoodIcon fontSize="small" />,
                },
                {
                  label: "Owner Email",
                  value: selectedWarranty.owner_email,
                  // icon: <GppGoodIcon fontSize="small" />,
                },
                {
                  label: "Owner Mobile",
                  value: selectedWarranty.owner_mobile,
                  // icon: <GppGoodIcon fontSize="small" />,
                },
                {
                  label: "Detailer Name",
                  value: selectedWarranty.detailer_name,
                  icon: <Person fontSize="small" />,
                },
                {
                  label: "Detailer Mobile",
                  value: selectedWarranty.detailer_mobile,
                },
                {
                  label: "License Plate Number",
                  value: selectedWarranty.license_plate_no,
                },

                {
                  label: "Registered By",
                  value: selectedWarranty.registered_by,
                },
                {
                  label: "Installation Date",
                  value: formatDate(selectedWarranty.installation_date),
                  icon: <CalendarToday fontSize="small" />,
                },
                {
                  label: "Warranty Period",
                  value: `${selectedWarranty.warranty_period} year`,
                },
                {
                  label: "Warranty Start",
                  value: formatDate(selectedWarranty.warranty_start_date),
                },
                {
                  label: "Warranty End",
                  value: formatDate(selectedWarranty.warranty_end_date),
                },
                {
                  label: "Address",
                  value: selectedWarranty.address,
                },
              ].map((item) => (
                <Grid item xs={12} sm={6} md={3} key={item.label}>
                  <DetailCard
                    label={item.label}
                    value={item.value}
                    icon={item.icon}
                  />
                </Grid>
              ))}
            </Grid>
          </Box> */}
          {/* Details Section */}
          <Box px={4} py={3}>
            {/* Car Information */}
            <SectionHeading title="Car Information" />
            <Grid container spacing={2} mb={4}>
              <Grid item xs={12} sm={6} md={4}>
                <DetailCard
                  label="Car Model"
                  value={`${selectedWarranty.car_brand} ${selectedWarranty.car_model}`}
                  icon={<DirectionsCar fontSize="small" />}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <DetailCard
                  label="Registration Number"
                  value={selectedWarranty.car_registration_number}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <DetailCard label="Color" value={selectedWarranty.color} />
              </Grid>
              {/* <Grid item xs={12} sm={6} md={4}>
                <DetailCard
                  label="License Plate Number"
                  value={selectedWarranty.license_plate_no}
                />
              </Grid> */}
            </Grid>

            {/* Car Owner Information */}
            <SectionHeading title="Car Owner" />
            <Grid container spacing={2} mb={4}>
              <Grid item xs={12} sm={6} md={4}>
                <DetailCard
                  label="Owner Name"
                  value={selectedWarranty.owner_name}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <DetailCard
                  label="Owner Email"
                  value={selectedWarranty.owner_email}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <DetailCard
                  label="Owner Mobile"
                  value={selectedWarranty.owner_mobile}
                />
              </Grid>
              <Grid item xs={12}>
                <DetailCard label="Address" value={selectedWarranty.address} />
              </Grid>
            </Grid>

            {/* Detailer Information */}
            <SectionHeading title="Detailer Information" />
            <Grid container spacing={2} mb={4}>
              <Grid item xs={12} sm={6} md={4}>
                <DetailCard
                  label="Detailer Name"
                  value={selectedWarranty.detailer_name}
                  icon={<Person fontSize="small" />}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <DetailCard
                  label="Detailer Mobile"
                  value={selectedWarranty.detailer_mobile}
                />
              </Grid>
              {selectedWarranty.email && (
                <Grid item xs={12} sm={6} md={4}>
                  <DetailCard
                    label="Detailer Email"
                    value={selectedWarranty.email}
                  />
                </Grid>
              )}
            </Grid>

            {/* Warranty Information */}
            <SectionHeading title="Warranty Information" />
            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} sm={6} md={4}>
                <DetailCard
                  label="Serial ID"
                  value={selectedWarranty.serial_number}
                  icon={<GppGoodIcon fontSize="small" />}
                />
              </Grid>
              {/* <Grid item xs={12} sm={6} md={4}>
                <DetailCard
                  label="Registered By"
                  value={selectedWarranty.registered_by || "N/A"}
                />
              </Grid> */}
              <Grid item xs={12} sm={6} md={4}>
                <DetailCard
                  label="Installation Date"
                  value={formatDate(selectedWarranty.installation_date)}
                  icon={<CalendarToday fontSize="small" />}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <DetailCard
                  label="Warranty Period"
                  value={`${selectedWarranty.warranty_period} year`}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <DetailCard
                  label="Warranty Start"
                  value={formatDate(selectedWarranty.warranty_start_date)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <DetailCard
                  label="Warranty End"
                  value={formatDate(selectedWarranty.warranty_end_date)}
                />
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Car Images */}
        {selectedWarranty.car_images?.length > 0 && (
          <Paper
            elevation={2}
            sx={{ p: 3, mb: 3, borderRadius: 3, border: "1px solid #f0f0f0" }}
          >
            <SectionHeading title="Car Images" />
            <Grid container spacing={2}>
              {selectedWarranty.car_images.map((img, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <ImageCard
                    image={img}
                    label={`Car Image ${idx + 1}`}
                    getImageUrl={getImageUrl}
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}

        {/* Documents */}
        {(selectedWarranty.installation_images?.length > 0 ||
          selectedWarranty.invoice_image) && (
          <Paper
            elevation={2}
            sx={{ p: 3, mb: 3, borderRadius: 3, border: "1px solid #f0f0f0" }}
          >
            <SectionHeading title="Documents" />

            {selectedWarranty.installation_images?.length > 0 && (
              <>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  color="text.secondary"
                  mb={1.5}
                >
                  Installation Images
                </Typography>
                <Grid container spacing={2} mb={3}>
                  {selectedWarranty.installation_images.map((img, idx) => (
                    <Grid item xs={12} sm={6} md={4} key={idx}>
                      <ImageCard
                        image={img}
                        label={`Image ${idx + 1}`}
                        getImageUrl={getImageUrl}
                      />
                    </Grid>
                  ))}
                </Grid>
              </>
            )}

            {selectedWarranty.invoice_image && (
              <>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  color="text.secondary"
                  mb={1.5}
                >
                  Invoice
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <ImageCard
                      image={selectedWarranty.invoice_image}
                      label="Invoice Document"
                      getImageUrl={getImageUrl}
                    />
                  </Grid>
                </Grid>
              </>
            )}
          </Paper>
        )}

        {/* No documents */}
        {!selectedWarranty.installation_images?.length &&
          !selectedWarranty.invoice_image && (
            <Paper
              sx={{
                p: 4,
                borderRadius: 3,
                textAlign: "center",
                bgcolor: "#fafafa",
                border: "1px dashed #e0e0e0",
              }}
            >
              <Typography color="text.secondary" fontWeight={500}>
                No documents uploaded
              </Typography>
            </Paper>
          )}
      </Box>
    );
  }

  // ── List View ────────────────────────────────────────────────────────────────
  return (
    <Box>
      {/* Page Title */}
      <Box display="flex" alignItems="center" gap={1.5} mb={3}>
        <Box
          sx={{ width: 5, height: 32, bgcolor: "#D20000", borderRadius: 1 }}
        />
        <Typography variant="h5" fontWeight={800} color="#1a1a1a">
          Warranty Management
        </Typography>
      </Box>

      <Paper
        elevation={2}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid #f0f0f0",
        }}
      >
        {/* Search Filters */}
        <Box
          sx={{
            px: 2,
            py: 2,
            mb: 2,
            bgcolor: "#fafafa",
            border: "1px solid #ebebeb",
            borderRadius: 2,
          }}
        >
          <Box display="flex" alignItems="center" gap={1} mb={1.5}>
            <SearchIcon sx={{ color: "#D20000", fontSize: 18 }} />
            <Typography
              variant="caption"
              fontWeight={700}
              color="text.secondary"
              letterSpacing={0.5}
            >
              FILTER WARRANTIES
            </Typography>
          </Box>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            flexWrap="wrap"
          >
            <CommonSearchField
              value={searchQuery.serial_id}
              placeholder="Search by Serial ID..."
              onChange={(value) =>
                setSearchQuery((prev) => ({ ...prev, serial_id: value }))
              }
            />
            <CommonSearchField
              value={searchQuery.detailer_mobile}
              placeholder="Search by Mobile..."
              onChange={(value) =>
                setSearchQuery((prev) => ({ ...prev, detailer_mobile: value }))
              }
            />
            <CommonSearchField
              type="date"
              value={searchQuery.installation_date}
              onChange={(value) =>
                setSearchQuery((prev) => ({
                  ...prev,
                  installation_date: value,
                }))
              }
            />
            <Box>
              <Select
                value={searchQuery.warranty_status}
                onChange={(e) =>
                  setSearchQuery((prev) => ({
                    ...prev,
                    warranty_status: e.target.value,
                  }))
                }
                displayEmpty
                size="small"
                renderValue={(s) =>
                  !s ? <em>Warranty Status</em> : WARRANTY_STATUS[s]?.label || s
                }
                sx={{
                  height: 39,
                  borderRadius: "10px",
                  fontSize: 13,
                  color: "grey",
                  backgroundColor: "#f5f5f5",
                  "&:hover fieldset": { borderColor: "#D20000" },
                  "&.Mui-focused fieldset": { borderColor: "#D20000" },
                }}
              >
                <MenuItem value="">
                  <em>All Statuses</em>
                </MenuItem>
                {Object.entries(WARRANTY_STATUS).map(([key, val]) => (
                  <MenuItem key={key} value={key}>
                    {val.label}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            {/* <Box sx={{ minWidth: 160 }}>
              <Select
                value={searchQuery.warranty_status}
                onChange={(e) =>
                  setSearchQuery((prev) => ({
                    ...prev,
                    warranty_status: e.target.value,
                  }))
                }
                displayEmpty
                size="small"
                renderValue={(s) =>
                  !s ? (
                    <em>Warranty Status</em>
                  ) : (
                    WARRANTY_STATUS[s]?.label || s
                  )
                }
                sx={{
                  height: 39,
                  borderRadius: "10px",
                  fontSize: 13,
                  color: "grey",
                  backgroundColor: "#f5f5f5",
                  "&:hover fieldset": { borderColor: "#D20000" },
                  "&.Mui-focused fieldset": { borderColor: "#D20000" },
                }}
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                {Object.entries(WARRANTY_STATUS).map(([key, val]) => (
                  <MenuItem key={key} value={key}>
                    {val.label}
                  </MenuItem>
                ))}
              </Select>
            </Box> */}
          </Stack>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background:
                    "linear-gradient(90deg, #D20000 0%, #8B0000 100%)",
                }}
              >
                {[
                  "Serial Number",
                  "Car Details",
                  "Detailer",
                  "Mobile",
                  "Install Date",
                  "Warranty",
                  "Warranty Status",
                  "Hold Reason",
                  "Action",
                ].map((h) => (
                  <TableCell
                    key={h}
                    sx={{
                      fontWeight: 700,
                      color: "#fff",
                      fontSize: 13,
                      letterSpacing: 0.5,
                      border: "none",
                      py: 1.5,
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 5 }}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      gap={1}
                    >
                      <CircularProgress size={28} sx={{ color: "#D20000" }} />
                      <Typography variant="body2" color="text.secondary">
                        Loading Warranties...
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
              {!loading && filteredWarranties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      gap={1}
                    >
                      <GppGoodIcon sx={{ fontSize: 40, color: "#e0e0e0" }} />
                      <Typography color="text.secondary" fontWeight={500}>
                        No warranties found
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                !loading &&
                paginatedWarranties.map((warranty) => (
                  <TableRow
                    key={warranty.id}
                    hover
                    sx={{
                      "&:hover": { bgcolor: "#fff5f5" },
                      "&:last-child td": { border: 0 },
                      borderBottom: "1px solid #f5f5f5",
                      transition: "background 0.15s",
                    }}
                  >
                    {/* Serial Number */}
                    <TableCell>
                      <Typography
                        fontWeight={700}
                        fontSize={13}
                        color="#D20000"
                      >
                        {warranty.serial_number}
                      </Typography>
                    </TableCell>

                    {/* Car Details */}
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: 1,
                            bgcolor: "#f0f0f0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid #e0e0e0",
                            flexShrink: 0,
                          }}
                        >
                          <DirectionsCar
                            sx={{ fontSize: 15, color: "#D20000" }}
                          />
                        </Box>
                        <Box>
                          <Typography
                            fontWeight={600}
                            fontSize={13}
                            color="#1a1a1a"
                          >
                            {warranty.car_brand} {warranty.car_model}
                          </Typography>
                          <Typography fontSize={11} color="text.secondary">
                            {warranty.car_registration_number}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Detailer */}
                    <TableCell>
                      <Typography fontSize={13} fontWeight={500}>
                        {warranty.detailer_name}
                      </Typography>
                    </TableCell>

                    {/* Mobile */}
                    <TableCell>
                      <Typography fontSize={13} color="text.secondary">
                        {warranty.detailer_mobile}
                      </Typography>
                    </TableCell>

                    {/* Install Date */}
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <CalendarToday
                          sx={{ fontSize: 13, color: "#D20000" }}
                        />
                        <Typography fontSize={13} color="text.secondary">
                          {formatDate(warranty.installation_date)}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Warranty Period */}
                    <TableCell>
                      <Chip
                        label={`${warranty.warranty_period} year`}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: 11,
                          borderRadius: 1,
                          bgcolor: "#f0f4ff",
                          color: "#1565c0",
                          border: "1px solid #d0deff",
                        }}
                      />
                    </TableCell>

                    {/* Warranty Status */}
                    <TableCell>
                      <Chip
                        label={
                          WARRANTY_STATUS[warranty.warranty_status]?.label ||
                          warranty.warranty_status
                        }
                        color={
                          WARRANTY_STATUS[warranty.warranty_status]?.color ||
                          "default"
                        }
                        onClick={(e) => handleOpenMenu(e, warranty)}
                        clickable
                        size="small"
                        sx={{
                          fontWeight: 700,
                          borderRadius: 1,
                          fontSize: 11,
                          cursor: "pointer",
                        }}
                      />
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleCloseMenu}
                        PaperProps={{
                          sx: {
                            borderRadius: 2,
                            mt: 0.5,
                            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                          },
                        }}
                      >
                        {Object.keys(WARRANTY_STATUS).map((status) => (
                          <MenuItem
                            key={status}
                            onClick={() => handleWarrantyStatusChange(status)}
                            sx={{ fontSize: 13, fontWeight: 500 }}
                          >
                            {WARRANTY_STATUS[status].label}
                          </MenuItem>
                        ))}
                      </Menu>
                    </TableCell>

                    {/* Hold Reason */}
                    <TableCell>
                      {warranty.hold_reason ? (
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleShowHoldReason(warranty.hold_reason)
                          }
                          sx={{
                            color: "#1565c0",
                            bgcolor: "#e3f2fd",
                            borderRadius: 1,
                            p: 0.8,
                          }}
                        >
                          <InfoOutlined fontSize="small" />
                        </IconButton>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          -
                        </Typography>
                      )}
                    </TableCell>

                    {/* Action */}
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleView(warranty)}
                        sx={{
                          bgcolor: "#f0f4ff",
                          color: "#1565c0",
                          "&:hover": { bgcolor: "#d0deff" },
                          borderRadius: 1,
                        }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
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
            count={Math.ceil((filteredWarranties?.length || 0) / rowsPerPage)}
            page={page}
            onChange={(_, v) => setPage(v)}
            sx={{
              "& .MuiPaginationItem-root.Mui-selected": {
                bgcolor: "#D20000",
                color: "#fff",
                "&:hover": { bgcolor: "#a80000" },
              },
            }}
          />
        </Box>
      </Paper>

      {/* Reject Dialog */}
      <Dialog
        open={showHoldDialog}
        onClose={() => setShowHoldDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}
      >
        <Box
          sx={{
            background: "linear-gradient(90deg, #D20000 0%, #8B0000 100%)",
            px: 3,
            py: 2,
          }}
        >
          <Typography variant="h6" fontWeight={700} color="#fff">
            Hold Warranty
          </Typography>
        </Box>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Enter a reason for placing this warranty on hold. This field is
            optional.
          </Typography>
          <TextField
            autoFocus
            multiline
            rows={4}
            fullWidth
            placeholder="Enter hold reason..."
            value={holdReason}
            onChange={(e) => setHoldReason(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                borderColor: "#D20000",
              },
              "& label.Mui-focused": { color: "#D20000" },
              "& .MuiOutlinedInput-root": { borderRadius: 2 },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={() => {
              setShowHoldDialog(false);
              setHoldReason("");
            }}
            disabled={updateLoading}
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: 1.5 }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmHold}
            variant="contained"
            disabled={updateLoading}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 1.5,
              px: 3,
              bgcolor: "#D20000",
              "&:hover": { bgcolor: "#a80000" },
            }}
          >
            {updateLoading ? "Saving..." : "Confirm Hold"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showRejectDialog}
        onClose={() => setShowRejectDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}
      >
        <Box
          sx={{
            background: "linear-gradient(90deg, #D20000 0%, #8B0000 100%)",
            px: 3,
            py: 2,
          }}
        >
          <Typography variant="h6" fontWeight={700} color="#fff">
            Reject Warranty
          </Typography>
        </Box>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Please provide a detailed reason for rejecting this warranty:
          </Typography>
          <TextField
            autoFocus
            multiline
            rows={4}
            fullWidth
            placeholder="Enter rejection reason..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                borderColor: "#D20000",
              },
              "& label.Mui-focused": { color: "#D20000" },
              "& .MuiOutlinedInput-root": { borderRadius: 2 },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={() => {
              setShowRejectDialog(false);
              setRejectionReason("");
              setShowViewDialog(true);
            }}
            disabled={updateLoading}
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: 1.5 }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmReject}
            variant="contained"
            disabled={updateLoading || !rejectionReason.trim()}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 1.5,
              px: 3,
              bgcolor: "#D20000",
              "&:hover": { bgcolor: "#a80000" },
            }}
          >
            {updateLoading ? "Rejecting..." : "Confirm Reject"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showHoldReasonDialog}
        onClose={() => setShowHoldReasonDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}
      >
        <Box
          sx={{
            background: "linear-gradient(90deg, #D20000 0%, #8B0000 100%)",
            px: 3,
            py: 2,
          }}
        >
          <Typography variant="h6" fontWeight={700} color="#fff">
            Hold Reason
          </Typography>
        </Box>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            {holdReasonPreview}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={() => setShowHoldReasonDialog(false)}
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: 1.5 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog
        open={Boolean(imagePreview)}
        onClose={() => setImagePreview(null)}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogContent sx={{ p: 0 }}>
          {imagePreview && (
            <Box
              component="img"
              src={imagePreview}
              alt="Preview"
              sx={{
                width: "100%",
                height: "auto",
                maxHeight: "90vh",
                objectFit: "contain",
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setImagePreview(null)}
            sx={{ fontWeight: 700, textTransform: "none" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// ─── Image Card sub-component ─────────────────────────────────────────────────

const ImageCard = ({ image, label, getImageUrl }) => (
  <Card
    sx={{
      borderRadius: 2,
      overflow: "hidden",
      border: "1px solid #ebebeb",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      transition: "all 0.25s ease",
      "&:hover": {
        boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
        transform: "translateY(-3px)",
      },
    }}
  >
    <CardMedia
      component="img"
      image={getImageUrl(image)}
      alt={label}
      sx={{
        height: 200,
        objectFit: "cover",
        cursor: "pointer",
        bgcolor: "#f5f5f5",
      }}
      onClick={() => window.open(getImageUrl(image), "_blank")}
      onError={(e) => {
        e.currentTarget.src =
          "https://via.placeholder.com/400x200?text=No+Image";
      }}
    />
    <CardActions
      sx={{
        justifyContent: "space-between",
        bgcolor: "#fafafa",
        px: 2,
        py: 1,
        borderTop: "1px solid #f0f0f0",
      }}
    >
      <Typography variant="caption" color="text.secondary" fontWeight={600}>
        {label}
      </Typography>
      <Button
        size="small"
        startIcon={<ZoomIn sx={{ fontSize: 14 }} />}
        onClick={() => window.open(getImageUrl(image), "_blank")}
        sx={{
          textTransform: "none",
          fontWeight: 600,
          fontSize: 11,
          color: "#D20000",
          "&:hover": { bgcolor: "#fff5f5" },
        }}
      >
        View
      </Button>
    </CardActions>
  </Card>
);

export default WarrantyManagement;
