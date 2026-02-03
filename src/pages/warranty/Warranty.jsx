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
  Grid,
  Divider,
  Stack,
  IconButton,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  HourglassEmpty,
  Visibility,
  DirectionsCar,
  Person,
  CalendarToday,
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
  //   clearWarrantyState,
} from "../../feature/Warranty/warrantySelector";

import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const WarrantyManagement = () => {
  const dispatch = useDispatch();

  // Redux selectors
  const warranties = useSelector(selectWarrantyList);
  const count = useSelector(selectWarrantyCount);
  const loading = useSelector(selectWarrantyLoading);
  const updateLoading = useSelector(selectWarrantyUpdateLoading);
  const updateSuccess = useSelector(selectWarrantyUpdateSuccess);
  const error = useSelector(selectWarrantyError);

  // Local state
  const [selectedWarranty, setSelectedWarranty] = useState(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Fetch warranties on component mount
  useEffect(() => {
    dispatch(getWarranties());

    // return () => {
    //   dispatch(clearWarrantyState());
    // };
  }, [dispatch]);

  // Handle update success
  useEffect(() => {
    if (updateSuccess) {
      showAlert("Warranty updated successfully", "success");
      setShowViewDialog(false);
      setShowRejectDialog(false);
      setRejectionReason("");
      setSelectedWarranty(null);

      dispatch(getWarranties());

      //   setTimeout(() => {
      //     dispatch(clearWarrantyState());
      //   }, 1000);
    }
  }, [updateSuccess, dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      showAlert(error, "error");
      //   setTimeout(() => {
      //     dispatch(clearWarrantyState());
      //   }, 3000);
    }
  }, [error, dispatch]);

  const handleView = (warranty) => {
    setSelectedWarranty(warranty);
    setShowViewDialog(true);
  };

  const handleAccept = () => {
    if (window.confirm("Are you sure you want to accept this warranty?")) {
      dispatch(
        updateWarranty({
          id: selectedWarranty.id,
          data: { product_status: "ACCEPT" },
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
      showAlert("Please provide a rejection reason", "error");
      return;
    }

    dispatch(
      updateWarranty({
        id: selectedWarranty.id,
        data: {
          product_status: "REJECT",
          rejection_reason: rejectionReason,
        },
      }),
    );
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(
      () => setAlert({ show: false, message: "", type: "success" }),
      3000,
    );
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      PENDING: {
        color: "warning",
        icon: <HourglassEmpty fontSize="small" />,
        label: "Pending",
      },
      ACCEPT: {
        color: "success",
        icon: <CheckCircle fontSize="small" />,
        label: "Accepted",
      },
      REJECT: {
        color: "error",
        icon: <Cancel fontSize="small" />,
        label: "Rejected",
      },
    };

    const config = statusConfig[status] || statusConfig.PENDING;

    return (
      <Chip
        icon={config.icon}
        label={config.label}
        color={config.color}
        size="small"
      />
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="body1" sx={{ mt: 2 }} color="textSecondary">
          Loading warranties...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Alert */}
      {alert.show && (
        <Alert
          severity={alert.type}
          onClose={() =>
            setAlert({ show: false, message: "", type: "success" })
          }
          sx={{ mb: 3 }}
        >
          {alert.message}
        </Alert>
      )}

      {/* Header */}
      <Stack
        direction="row"
        justifyContent=""
        alignItems="center"
        spacing={1}
        mb={3}
      >
        <Typography variant="h4" fontWeight={700} sx={{ color: "#7E7E7E" }}>
          <IconButton onClick={() => setShowViewDialog(false)}>
            {showViewDialog && <ArrowBackIcon sx={{ marginRight: "5px" }} />}
          </IconButton>
          Warranty
        </Typography>
      </Stack>

      {/* Filter Summary */}
      {/* <Box sx={{ mb: 3, display: "flex", gap: 3 }}>
        <Typography variant="body2" color="textSecondary">
          <strong>Pending:</strong>{" "}
          {warranties.filter((w) => w.product_status === "PENDING").length}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          <strong>Accepted:</strong>{" "}
          {warranties.filter((w) => w.product_status === "ACCEPT").length}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          <strong>Rejected:</strong>{" "}
          {warranties.filter((w) => w.product_status === "REJECT").length}
        </Typography>
      </Box> */}

      {/* Table */}
      {!showViewDialog && (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Serial ID</strong>
                </TableCell>
                <TableCell>
                  <strong>Car Details</strong>
                </TableCell>
                <TableCell>
                  <strong>Detailer Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Mobile</strong>
                </TableCell>
                <TableCell>
                  <strong>Installation Date</strong>
                </TableCell>
                <TableCell>
                  <strong>Warranty Period</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Action</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {warranties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      sx={{ py: 3 }}
                    >
                      No warranties found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                warranties.map((warranty) => (
                  <TableRow
                    key={warranty.id}
                    hover
                    sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
                  >
                    <TableCell>{warranty.serial_id}</TableCell>
                    <TableCell>
                      {warranty.car_brand} {warranty.car_model}
                      <br />
                      <Typography variant="caption" color="textSecondary">
                        {warranty.car_registration_number}
                      </Typography>
                    </TableCell>
                    <TableCell>{warranty.detailer_name}</TableCell>
                    <TableCell>{warranty.detailer_mobile}</TableCell>
                    <TableCell>
                      {formatDate(warranty.installation_date)}
                    </TableCell>
                    <TableCell>{warranty.warranty_period} months</TableCell>
                    <TableCell>
                      {getStatusChip(warranty.product_status)}
                    </TableCell>
                    <TableCell align="center">
                      {/* <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => handleView(warranty)}
                      >
                        View
                      </Button> */}
                      <IconButton
                        color="primary"
                        onClick={() => handleView(warranty)}
                        size="small"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* View Dialog */}
      {showViewDialog && (
        <Box fullWidth>
          <DialogTitle>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Warranty Details</Typography>
              {selectedWarranty &&
                getStatusChip(selectedWarranty.product_status)}
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            {selectedWarranty && (
              <Grid container spacing={3}>
                {/* ================= CAR IMAGE ================= */}
                {Boolean(selectedWarranty.car_image) && (
                  <Grid item xs={12}>
                    <Box
                      component="img"
                      src={selectedWarranty.car_image}
                      alt="Car"
                      sx={{
                        width: "100%",
                        maxHeight: { xs: 220, sm: 280, md: 320 },
                        objectFit: "cover",
                        borderRadius: 2,
                      }}
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/600x300?text=No+Car+Image";
                      }}
                    />
                  </Grid>
                )}

                {/* ================= LEFT COLUMN ================= */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Serial ID
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedWarranty.serial_id}
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                  >
                    Car Details
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <DirectionsCar fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      {selectedWarranty.car_brand} {selectedWarranty.car_model}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Registration: {selectedWarranty.car_registration_number}
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                  >
                    Detailer Information
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <Person fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      {selectedWarranty.detailer_name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Mobile: {selectedWarranty.detailer_mobile}
                  </Typography>
                </Grid>

                {/* ================= RIGHT COLUMN ================= */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Installation Date
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <CalendarToday fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      {formatDate(selectedWarranty.installation_date)}
                    </Typography>
                  </Box>

                  <Typography variant="subtitle2" color="text.secondary">
                    Warranty Period
                  </Typography>
                  <Typography variant="body1">
                    {selectedWarranty.warranty_period} months
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(selectedWarranty.warranty_start_date)} to{" "}
                    {formatDate(selectedWarranty.warranty_end_date)}
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                  >
                    Warranty Status
                  </Typography>
                  <Typography
                    variant="body1"
                    color={
                      selectedWarranty.warranty_status === "ACTIVE"
                        ? "success.main"
                        : "error.main"
                    }
                  >
                    {selectedWarranty.warranty_status}
                  </Typography>

                  {selectedWarranty.registered_by && (
                    <>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        sx={{ mt: 2 }}
                      >
                        Registered By
                      </Typography>
                      <Typography variant="body1">
                        {selectedWarranty.registered_by}
                      </Typography>
                    </>
                  )}
                </Grid>

                {/* ================= REJECTION ================= */}
                {selectedWarranty.product_status === "REJECT" &&
                  selectedWarranty.rejection_reason && (
                    <Grid item xs={12}>
                      <Alert severity="error">
                        <Typography variant="subtitle2" gutterBottom>
                          Rejection Reason
                        </Typography>
                        <Typography variant="body2">
                          {selectedWarranty.rejection_reason}
                        </Typography>
                      </Alert>
                    </Grid>
                  )}

                {/* ================= DOCUMENTS ================= */}
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Documents
                  </Typography>

                  {selectedWarranty.installation_image ||
                  selectedWarranty.invoice_image ? (
                    <Grid container spacing={2}>
                      {/* Installation Image */}
                      {selectedWarranty.installation_image && (
                        <Grid item xs={12} sm={6}>
                          <Box
                            component="img"
                            src={selectedWarranty.installation_image}
                            alt="Installation"
                            sx={{
                              width: "100%",
                              // height: 200,
                              height: "auto",
                              maxHeight: 300,
                              backgroundColor: "#f5f5f5",

                              objectFit: "cover",
                              borderRadius: 2,
                              mb: 1,
                            }}
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://via.placeholder.com/400x200?text=No+Image";
                            }}
                          />
                          <Button
                            fullWidth
                            variant="outlined"
                            size="small"
                            startIcon={<Visibility />}
                            href={selectedWarranty.installation_image}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Installation Image
                          </Button>
                        </Grid>
                      )}

                      {/* Invoice Image */}
                      {selectedWarranty.invoice_image && (
                        <Grid item xs={12} sm={6}>
                          <Box
                            component="img"
                            src={selectedWarranty.invoice_image}
                            alt="Invoice"
                            sx={{
                              width: "100%",
                              // height: 200,
                              height: "auto",
                              maxHeight: 300,
                              backgroundColor: "#f5f5f5",

                              objectFit: "cover",
                              borderRadius: 2,
                              mb: 1,
                            }}
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://via.placeholder.com/400x200?text=No+Image";
                            }}
                          />
                          <Button
                            fullWidth
                            variant="outlined"
                            size="small"
                            startIcon={<Visibility />}
                            href={selectedWarranty.invoice_image}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Invoice Image
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No documents uploaded
                    </Typography>
                  )}
                </Grid>
              </Grid>
            )}
          </DialogContent>

          <DialogActions>
            {selectedWarranty &&
              selectedWarranty.product_status === "PENDING" && (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircle />}
                    onClick={handleAccept}
                    disabled={updateLoading}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Cancel />}
                    onClick={handleRejectClick}
                    disabled={updateLoading}
                  >
                    Reject
                  </Button>
                </>
              )}
            {/* <Button
              onClick={() => setShowViewDialog(false)}
              disabled={updateLoading}
            >
              Close
            </Button> */}
          </DialogActions>
        </Box>
      )}

      {/* Reject Reason Dialog */}
      <Dialog
        open={showRejectDialog}
        onClose={() => setShowRejectDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reject Warranty</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Please provide a reason for rejecting this warranty:
          </Typography>
          <TextField
            autoFocus
            multiline
            rows={4}
            fullWidth
            placeholder="Enter rejection reason..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowRejectDialog(false);
              setRejectionReason("");
              setShowViewDialog(true);
            }}
            disabled={updateLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmReject}
            variant="contained"
            color="error"
            disabled={updateLoading || !rejectionReason.trim()}
          >
            {updateLoading ? "Rejecting..." : "Confirm Reject"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WarrantyManagement;
