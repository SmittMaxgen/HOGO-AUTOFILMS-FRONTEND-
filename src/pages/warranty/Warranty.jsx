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
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  HourglassEmpty,
  Visibility,
  DirectionsCar,
  Person,
  CalendarToday,
  Download,
  ZoomIn,
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

import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CommonButton from "../../components/commonComponents/CommonButton";
import CommonToast from "../../components/commonComponents/Toster";

const BASE_URL = "http://hogofilm.pythonanywhere.com";

const WarrantyManagement = () => {
  const dispatch = useDispatch();

  const warranties = useSelector(selectWarrantyList);
  const count = useSelector(selectWarrantyCount);
  const loading = useSelector(selectWarrantyLoading);
  const updateLoading = useSelector(selectWarrantyUpdateLoading);
  const updateSuccess = useSelector(selectWarrantyUpdateSuccess);
  const error = useSelector(selectWarrantyError);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedWarranty, setSelectedWarranty] = useState(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleOpenMenu = (event, warranty) => {
    setAnchorEl(event.currentTarget);
    setSelectedWarranty(warranty);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    dispatch(getWarranties());
  }, [dispatch]);

  useEffect(() => {
    if (updateSuccess) {
      CommonToast("Warranty updated successfully", "success");
      setShowViewDialog(false);
      setShowRejectDialog(false);
      setRejectionReason("");
      setSelectedWarranty(null);
      dispatch(getWarranties());
    }
  }, [updateSuccess, dispatch]);

  useEffect(() => {
    if (error) {
      CommonToast(error, "error");
    }
  }, [error, dispatch]);

  const handleView = (warranty) => {
    setSelectedWarranty(warranty);
    setShowViewDialog(true);
  };

  // productStatusConfig.js
  const PRODUCT_STATUS = {
    PENDING: {
      label: "Pending",
      color: "warning",
    },
    ACTIVATED: {
      label: "Activated",
      color: "success",
    },
    REJECTED: {
      label: "Rejected",
      color: "error",
    },
    INVALID: {
      label: "Invalid",
      color: "default",
    },
  };
  const handleWarrantyStatusChange = (status) => {
    if (!selectedWarranty) return;

    dispatch(
      updateWarranty({
        id: selectedWarranty.id,
        data: { product_status: status },
      }),
    );

    handleCloseMenu();
  };

  const handleAccept = () => {
    if (window.confirm("Are you sure you want to accept this warranty?")) {
      dispatch(
        updateWarranty({
          id: selectedWarranty.id,
          data: { product_status: "ACTIVATED" },
        }),
      );
    }
  };

  // const handleWarrantyStatusChange = (status, warranty, reason = "") => {
  //   dispatch(
  //     updateWarranty({
  //       id: warranty.id,
  //       data: {
  //         warranty_status: status,
  //         rejection_reason: status === "REJECT" ? reason : "",
  //       },
  //     }),
  //   );
  // };

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
          warranty_status: "REJECT",
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
      ACTIVE: {
        color: "success",
        icon: <CheckCircle fontSize="small" />,
        label: "Accepted",
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
      EXPIRED: {
        color: "default",
        icon: <HourglassEmpty fontSize="small" />,
        label: "Expired",
      },
      VOID: {
        color: "default",
        icon: <Cancel fontSize="small" />,
        label: "Void",
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

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    return `${BASE_URL}/${imagePath}`;
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

      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        spacing={1}
        mb={3}
      >
        <IconButton
          onClick={() => setShowViewDialog(false)}
          sx={{ visibility: showViewDialog ? "visible" : "hidden" }}
        >
          <ArrowBackIcon sx={{ color: "grey" }} />
        </IconButton>
        <Typography variant="h4" fontWeight={700} sx={{ color: "#7E7E7E" }}>
          Warranty Management
        </Typography>
      </Stack>

      {!showViewDialog && (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
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
                  <strong>Product Status</strong>
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
                      <Typography variant="body2" fontWeight={600}>
                        {warranty.car_brand} {warranty.car_model}
                      </Typography>
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
                    <TableCell align="center">
                      <Chip
                        label={PRODUCT_STATUS[warranty.product_status]?.label}
                        color={PRODUCT_STATUS[warranty.product_status]?.color}
                        onClick={(e) => handleOpenMenu(e, warranty)}
                        clickable
                        size="small"
                      />

                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleCloseMenu}
                      >
                        {Object.keys(PRODUCT_STATUS).map((status) => (
                          <MenuItem
                            key={status}
                            onClick={() => handleWarrantyStatusChange(status)}
                          >
                            {PRODUCT_STATUS[status].label}
                          </MenuItem>
                        ))}
                      </Menu>
                    </TableCell>

                    <TableCell align="center">
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

      {showViewDialog && selectedWarranty && (
        <Box>
          {/* Action Buttons */}
          {selectedWarranty.product_status !== "ACTIVATED" && (
            <Box sx={{ mb: 3 }}>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircle />}
                  onClick={handleAccept}
                  disabled={updateLoading}
                  sx={{
                    px: 3,
                    py: 1,
                    fontWeight: 600,
                    textTransform: "none",
                    borderRadius: 2,
                  }}
                >
                  Accept Warranty
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  startIcon={<Cancel />}
                  onClick={handleRejectClick}
                  disabled={updateLoading}
                  sx={{
                    px: 3,
                    py: 1,
                    fontWeight: 600,
                    textTransform: "none",
                    borderRadius: 2,
                  }}
                >
                  Reject Warranty
                </Button>
              </Stack>
            </Box>
          )}

          <Divider sx={{ mb: 4 }} />

          {/* Car Images Gallery */}
          {selectedWarranty.car_images &&
            selectedWarranty.car_images.length > 0 && (
              <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  gutterBottom
                  sx={{ mb: 3, color: "#333" }}
                >
                  Car Images
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  {selectedWarranty.car_images.map((image, index) => (
                    <Card
                      key={index}
                      sx={{
                        width: {
                          xs: "100%",
                          sm: "calc(50% - 8px)",
                          md: "calc(33.333% - 11px)",
                        },
                        borderRadius: 2,
                        overflow: "hidden",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                          transform: "translateY(-4px)",
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={getImageUrl(image)}
                        alt={`Car ${index + 1}`}
                        sx={{
                          height: 220,
                          objectFit: "cover",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          window.open(getImageUrl(image), "_blank")
                        }
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/400x300?text=No+Image";
                        }}
                      />
                      <CardActions
                        sx={{
                          justifyContent: "center",
                          backgroundColor: "#f9f9f9",
                          py: 1,
                        }}
                      >
                        <Button
                          size="small"
                          startIcon={<ZoomIn />}
                          onClick={() =>
                            window.open(getImageUrl(image), "_blank")
                          }
                          sx={{ textTransform: "none" }}
                        >
                          View Full Size
                        </Button>
                      </CardActions>
                    </Card>
                  ))}
                </Box>
              </Paper>
            )}

          {/* Warranty Details */}
          <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Typography
              variant="h6"
              fontWeight={600}
              gutterBottom
              sx={{ mb: 3, color: "#333" }}
            >
              Warranty Details
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 4,
              }}
            >
              {/* Left Column */}
              <Box sx={{ flex: 1 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ textTransform: "uppercase", fontWeight: 600 }}
                  >
                    Serial ID
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 0.5 }}>
                    {selectedWarranty.serial_number}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ textTransform: "uppercase", fontWeight: 600 }}
                  >
                    Car Details
                  </Typography>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ mt: 0.5 }}
                  >
                    <DirectionsCar color="action" />
                    <Typography variant="body1" fontWeight={600}>
                      {selectedWarranty.car_brand} {selectedWarranty.car_model}
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 4 }}
                  >
                    Registration: {selectedWarranty.car_registration_number}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ textTransform: "uppercase", fontWeight: 600 }}
                  >
                    Detailer Information
                  </Typography>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ mt: 0.5 }}
                  >
                    <Person color="action" />
                    <Typography variant="body1">
                      {selectedWarranty.detailer_name}
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 4 }}
                  >
                    Mobile: {selectedWarranty.detailer_mobile}
                  </Typography>
                </Box>
              </Box>

              {/* Right Column */}
              <Box sx={{ flex: 1 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ textTransform: "uppercase", fontWeight: 600 }}
                  >
                    Installation Date
                  </Typography>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ mt: 0.5 }}
                  >
                    <CalendarToday color="action" fontSize="small" />
                    <Typography variant="body1">
                      {formatDate(selectedWarranty.installation_date)}
                    </Typography>
                  </Stack>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ textTransform: "uppercase", fontWeight: 600 }}
                  >
                    Warranty Period
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 0.5 }}>
                    {selectedWarranty.warranty_period} Months
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(selectedWarranty.warranty_start_date)} -{" "}
                    {formatDate(selectedWarranty.warranty_end_date)}
                  </Typography>
                </Box>

                {/* <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      textTransform: "uppercase",
                      fontWeight: 600,
                      mb: 1,
                      display: "block",
                    }}
                  >
                    Status
                  </Typography>
                  {getStatusChip(selectedWarranty.warranty_status)}
                </Box> */}

                {selectedWarranty.registered_by && (
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ textTransform: "uppercase", fontWeight: 600 }}
                    >
                      Registered By
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {selectedWarranty.registered_by}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Paper>

          {/* Rejection Reason */}
          {selectedWarranty.warranty_status === "REJECT" &&
            selectedWarranty.rejection_reason && (
              <Alert severity="error" sx={{ mb: 4 }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Rejection Reason
                </Typography>
                <Typography variant="body2">
                  {selectedWarranty.rejection_reason}
                </Typography>
              </Alert>
            )}

          {/* Documents Section */}
          {((selectedWarranty.installation_images &&
            selectedWarranty.installation_images.length > 0) ||
            selectedWarranty.invoice_image) && (
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography
                variant="h6"
                fontWeight={600}
                gutterBottom
                sx={{ mb: 3, color: "#333" }}
              >
                Documents
              </Typography>

              {/* Installation Images */}
              {selectedWarranty.installation_images &&
                selectedWarranty.installation_images.length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      gutterBottom
                      sx={{ mb: 2 }}
                    >
                      Installation Images
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                      }}
                    >
                      {selectedWarranty.installation_images.map(
                        (image, index) => (
                          <Card
                            key={index}
                            sx={{
                              width: {
                                xs: "100%",
                                sm: "calc(50% - 8px)",
                                md: "calc(33.333% - 11px)",
                              },
                              borderRadius: 2,
                              overflow: "hidden",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                                transform: "translateY(-4px)",
                              },
                            }}
                          >
                            <CardMedia
                              component="img"
                              image={getImageUrl(image)}
                              alt={`Installation ${index + 1}`}
                              sx={{
                                height: 200,
                                objectFit: "cover",
                                backgroundColor: "#f5f5f5",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                window.open(getImageUrl(image), "_blank")
                              }
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://via.placeholder.com/400x200?text=No+Image";
                              }}
                            />
                            <CardActions
                              sx={{
                                justifyContent: "space-between",
                                backgroundColor: "#f9f9f9",
                                px: 2,
                                py: 1,
                              }}
                            >
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Image {index + 1}
                              </Typography>
                              <Button
                                size="small"
                                startIcon={<Visibility />}
                                onClick={() =>
                                  window.open(getImageUrl(image), "_blank")
                                }
                                sx={{ textTransform: "none" }}
                              >
                                View
                              </Button>
                            </CardActions>
                          </Card>
                        ),
                      )}
                    </Box>
                  </Box>
                )}

              {/* Invoice Image */}
              {selectedWarranty.invoice_image && (
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    gutterBottom
                    sx={{ mb: 2 }}
                  >
                    Invoice
                  </Typography>
                  <Card
                    sx={{
                      width: {
                        xs: "100%",
                        sm: "50%",
                        md: "33.333%",
                      },
                      borderRadius: 2,
                      overflow: "hidden",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                        transform: "translateY(-4px)",
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={getImageUrl(selectedWarranty.invoice_image)}
                      alt="Invoice"
                      sx={{
                        height: 250,
                        objectFit: "cover",
                        backgroundColor: "#f5f5f5",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        window.open(
                          getImageUrl(selectedWarranty.invoice_image),
                          "_blank",
                        )
                      }
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/400x200?text=No+Image";
                      }}
                    />
                    <CardActions
                      sx={{
                        justifyContent: "space-between",
                        backgroundColor: "#f9f9f9",
                        px: 2,
                        py: 1.5,
                      }}
                    >
                      <Typography variant="body2" fontWeight={600}>
                        Invoice Document
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Visibility />}
                          onClick={() =>
                            window.open(
                              getImageUrl(selectedWarranty.invoice_image),
                              "_blank",
                            )
                          }
                          sx={{ textTransform: "none" }}
                        >
                          View
                        </Button>
                      </Stack>
                    </CardActions>
                  </Card>
                </Box>
              )}
            </Paper>
          )}

          {/* No Documents Message */}
          {!selectedWarranty.installation_images?.length &&
            !selectedWarranty.invoice_image && (
              <Paper
                elevation={1}
                sx={{
                  p: 4,
                  borderRadius: 2,
                  textAlign: "center",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  No documents uploaded
                </Typography>
              </Paper>
            )}
        </Box>
      )}

      {/* Rejection Dialog */}
      <Dialog
        open={showRejectDialog}
        onClose={() => setShowRejectDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: "1.25rem" }}>
          Reject Warranty
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
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
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              setShowRejectDialog(false);
              setRejectionReason("");
              setShowViewDialog(true);
            }}
            disabled={updateLoading}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmReject}
            variant="contained"
            color="error"
            disabled={updateLoading || !rejectionReason.trim()}
            sx={{
              textTransform: "none",
              px: 3,
              borderRadius: 2,
            }}
          >
            {updateLoading ? "Rejecting..." : "Confirm Reject"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog
        open={Boolean(imagePreview)}
        onClose={() => setImagePreview(null)}
        maxWidth="lg"
        fullWidth
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
          <Button onClick={() => setImagePreview(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WarrantyManagement;
