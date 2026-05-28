import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getReplacements,
  createReplacement,
  updateReplacement,
  deleteReplacement,
} from "../../feature/replacement/replacementThunks";

import {
  selectReplacementList,
  selectReplacementLoading,
  selectReplacementCreateLoading,
  selectReplacementUpdateLoading,
  selectReplacementDeleteLoading,
} from "../../feature/replacement/replacementSelectors";

import {
  Box,
  Paper,
  Stack,
  Typography,
  IconButton,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  CircularProgress,
  Divider,
  Chip,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AutorenewIcon from "@mui/icons-material/Autorenew";

import CommonButton from "../../components/commonComponents/CommonButton";
import CommonToast from "../../components/commonComponents/Toster";
import CommonSearchField from "../../components/commonComponents/CommonSearchField";

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

const SectionHeading = ({ title }) => (
  <Box display="flex" alignItems="center" gap={1.5} mb={2}>
    <Box sx={{ width: 4, height: 22, bgcolor: "#D20000", borderRadius: 1 }} />
    <Typography variant="subtitle1" fontWeight={700}>
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
    }}
  >
    {onBack && (
      <IconButton onClick={onBack} sx={{ color: "#fff", mr: 1 }}>
        <ArrowBackIcon />
      </IconButton>
    )}

    <Typography variant="h6" fontWeight={700} color="#fff">
      {title}
    </Typography>
  </Box>
);

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

const Replacement = () => {
  const dispatch = useDispatch();

  const replacements = useSelector(selectReplacementList);
  const loading = useSelector(selectReplacementLoading);

  const createLoading = useSelector(selectReplacementCreateLoading);
  const updateLoading = useSelector(selectReplacementUpdateLoading);
  const deleteLoading = useSelector(selectReplacementDeleteLoading);

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [isViewing, setIsViewing] = useState(false);
  const [viewData, setViewData] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [form, setForm] = useState({
    old_serial_number: "",
    reason: "",
  });

  const [errors, setErrors] = useState({});

  // ───────────────────────────────────────────────────────────

  useEffect(() => {
    dispatch(getReplacements());
  }, [dispatch]);

  // ───────────────────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ───────────────────────────────────────────────────────────

  const validate = () => {
    const temp = {};

    if (!form.old_serial_number)
      temp.old_serial_number = "Old serial number is required";

    if (!form.reason) temp.reason = "Reason is required";

    setErrors(temp);

    return Object.keys(temp).length === 0;
  };

  // ───────────────────────────────────────────────────────────

  const getErrorMessage = (error, fallback) => {
    if (typeof error === "string") return error;

    const firstErrorKey = Object.keys(error || {})[0];

    if (firstErrorKey) {
      const value = error[firstErrorKey];

      return Array.isArray(value) ? value[0] : value;
    }

    return fallback;
  };
  const handleSubmit = () => {
    if (!validate()) return;

    if (isEditing && editId) {
      dispatch(
        updateReplacement({
          id: editId,
          data: form,
        }),
      )
        .unwrap()
        .then(() => {
          dispatch(getReplacements());
          CommonToast("Warranty claim updated successfully", "success");
          handleReset();
        })
        .catch(() => {
          CommonToast("Failed to update warranty claim", "error");
        });
    } else {
      dispatch(createReplacement(form))
        .unwrap()
        .then(() => {
          dispatch(getReplacements());

          CommonToast("Warranty claim created successfully", "success");

          handleReset();
        })
        .catch((error) => {
          CommonToast(
            getErrorMessage(error, "Failed to create warranty claim"),
            "error",
          );
        });
    }
  };

  // ───────────────────────────────────────────────────────────

  const handleDelete = (id) => {
    if (
      window.confirm("Are you sure you want to delete this warranty claim?")
    ) {
      dispatch(deleteReplacement(id))
        .unwrap()
        .then(() => {
          dispatch(getReplacements());

          CommonToast("Warranty claim deleted successfully", "success");
        })
        .catch(() => {
          CommonToast("Failed to delete warranty claim", "error");
        });
    }
  };

  // ───────────────────────────────────────────────────────────

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditId(item.id);

    setForm({
      old_serial_number: item?.old_serial?.serial_number || "",
      reason: item.reason || "",
    });
  };

  // ───────────────────────────────────────────────────────────

  const handleView = (item) => {
    setViewData(item);
    setIsViewing(true);
  };

  // ───────────────────────────────────────────────────────────

  const handleReset = () => {
    setForm({
      old_serial_number: "",
      reason: "",
    });

    setErrors({});

    setEditId(null);
    setIsEditing(false);
  };

  // ───────────────────────────────────────────────────────────

  const filteredData = replacements?.filter((item) =>
    item?.old_serial?.serial_number
      ?.toLowerCase()
      ?.includes(searchQuery.toLowerCase()),
  );

  const paginatedData = filteredData?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  // ───────────────────────────────────────────────────────────
  // Create / Edit
  // ───────────────────────────────────────────────────────────

  if (isEditing) {
    return (
      <Box mt={4}>
        <PageHeader
          title={editId ? "Edit Warranty Claim" : "Create Warranty Claim"}
          onBack={handleReset}
        />

        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <SectionHeading title="Warranty Claim Information" />

          <Stack spacing={3}>
            <TextField
              label="Old Serial Number"
              name="old_serial_number"
              value={form.old_serial_number}
              onChange={handleChange}
              error={!!errors.old_serial_number}
              helperText={errors.old_serial_number}
              fullWidth
            />

            <TextField
              label="Reason"
              name="reason"
              value={form.reason}
              onChange={handleChange}
              error={!!errors.reason}
              helperText={errors.reason}
              multiline
              rows={4}
              fullWidth
            />

            <Divider />

            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <CommonButton variant="outlined" onClick={handleReset}>
                Cancel
              </CommonButton>

              <CommonButton
                variant="contained"
                onClick={handleSubmit}
                disabled={createLoading || updateLoading}
                sx={{
                  bgcolor: "#D20000",
                  "&:hover": {
                    bgcolor: "#a80000",
                  },
                }}
              >
                {createLoading || updateLoading
                  ? "Saving..."
                  : editId
                    ? "Update Warranty Claim"
                    : "Save Warranty Claim"}
              </CommonButton>
            </Stack>
          </Stack>
        </Paper>
      </Box>
    );
  }

  // ───────────────────────────────────────────────────────────
  // View
  // ───────────────────────────────────────────────────────────
  if (isViewing && viewData) {
    return (
      <Box mt={4}>
        <PageHeader
          title="Warranty Claim Details"
          onBack={() => {
            setIsViewing(false);
            setViewData(null);
          }}
        />

        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <SectionHeading title="Warranty Claim Information" />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
              },
              gap: 2,
            }}
          >
            {[
              {
                label: "Old Serial",
                value: viewData?.old_serial?.serial_number,
                icon: "📦",
              },
              {
                label: "New Serial",
                value: viewData?.new_serial?.serial_number,
                icon: "📦",
              },
              {
                label: "Product Name",
                value: viewData?.product_detail?.product_name,
                icon: "🏷️",
              },
              { label: "Reason", value: viewData?.reason, icon: "❓" },
              { label: "Status", value: viewData?.status, icon: "🚦" },
              {
                label: "Requested At",
                value: viewData?.requested_at
                  ? new Date(viewData.requested_at).toLocaleDateString("en-IN")
                  : "N/A",
                icon: "📅",
              },
              {
                label: "Approved At",
                value: viewData?.approved_at
                  ? new Date(viewData.approved_at).toLocaleDateString("en-IN")
                  : "N/A",
                icon: "✅",
              },
              {
                label: "Completed At",
                value: viewData?.completed_at
                  ? new Date(viewData.completed_at).toLocaleDateString("en-IN")
                  : "N/A",
                icon: "🏁",
              },
              {
                label: "Remarks",
                value: viewData?.remarks || "N/A",
                icon: "📝",
              },

              // Distributor Info
              {
                label: "Distributor",
                value:
                  viewData?.distributor_detail?.name ||
                  viewData?.distributor_detail?.company_name ||
                  "N/A",
                icon: "🏢",
              },
              {
                label: "Region",
                value: viewData?.distributor_detail?.region,
                icon: "📍",
              },

              // New Distributor (Fixed - Safe conditional spread)
              ...(viewData?.new_distributor_detail
                ? [
                    {
                      label: "New Distributor",
                      value:
                        viewData?.new_distributor_detail?.name ||
                        viewData?.new_distributor_detail?.company_name ||
                        "N/A",
                      icon: "🏢",
                    },
                  ]
                : []),
            ].map((item) => (
              <Box
                key={item.label}
                sx={{
                  p: 2,
                  border: "1px solid #eee",
                  borderRadius: 2,
                  bgcolor: "#fafafa",
                }}
              >
                <Typography variant="caption" fontWeight={700}>
                  {item.icon} {item.label}
                </Typography>
                <Typography mt={0.5}>{item.value || "N/A"}</Typography>
              </Box>
            ))}
          </Box>

          {/* Images Section */}
          {viewData?.image && viewData.image.length > 0 && (
            <>
              <SectionHeading title="Claim Images" />
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                {viewData.image.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Claim ${index + 1}`}
                    style={{
                      maxWidth: "220px",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                    }}
                  />
                ))}
              </Box>
            </>
          )}

          {/* Warranty Details */}
          {viewData?.warranty_details?.[0] && (
            <>
              <SectionHeading title="Warranty Details" />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 2,
                }}
              >
                {[
                  {
                    label: "Detailer Name",
                    value: viewData.warranty_details[0].detailer_name,
                  },
                  {
                    label: "Detailer Mobile",
                    value: viewData.warranty_details[0].detailer_mobile,
                  },
                  {
                    label: "Car Registration Number",
                    value: viewData.warranty_details[0].car_registration_number,
                  },
                  {
                    label: "Car Brand",
                    value: viewData.warranty_details[0].car_brand,
                  },
                  {
                    label: "Car Model",
                    value: viewData.warranty_details[0].car_model,
                  },
                  { label: "Color", value: viewData.warranty_details[0].color },
                  {
                    label: "Owner Name",
                    value: viewData.warranty_details[0].owner_name,
                  },
                  {
                    label: "Owner Mobile",
                    value: viewData.warranty_details[0].owner_mobile,
                  },
                  {
                    label: "Owner Email",
                    value: viewData.warranty_details[0].owner_email,
                  },
                  {
                    label: "Installation Date",
                    value: viewData.warranty_details[0].installation_date,
                  },
                  {
                    label: "Warranty Period",
                    value: `${viewData.warranty_details[0].warranty_period} Years`,
                  },
                  {
                    label: "Warranty Start",
                    value: viewData.warranty_details[0].warranty_start_date,
                  },
                  {
                    label: "Warranty End",
                    value: viewData.warranty_details[0].warranty_end_date,
                  },
                ].map((item) => (
                  <Box
                    key={item.label}
                    sx={{
                      p: 2,
                      border: "1px solid #eee",
                      borderRadius: 2,
                      bgcolor: "#fafafa",
                    }}
                  >
                    <Typography variant="caption" fontWeight={700}>
                      {item.label}
                    </Typography>
                    <Typography mt={0.5}>{item.value || "N/A"}</Typography>
                  </Box>
                ))}
              </Box>
            </>
          )}
        </Paper>
      </Box>
    );
  }

  // ───────────────────────────────────────────────────────────
  // List
  // ───────────────────────────────────────────────────────────

  return (
    <Box>
      {/* Header */}

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 5,
              height: 30,
              bgcolor: "#D20000",
              borderRadius: 1,
            }}
          />

          <Typography variant="h5" fontWeight={800}>
            Warranty Claim Requests
          </Typography>
        </Box>

        <CommonButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsEditing(true)}
          sx={{
            bgcolor: "#D20000",
            "&:hover": {
              bgcolor: "#a80000",
            },
          }}
        >
          Add Warranty Claim
        </CommonButton>
      </Stack>

      {/* Table */}

      <Paper
        elevation={2}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        {/* Search */}

        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid #eee",
          }}
        >
          <CommonSearchField
            value={searchQuery}
            placeholder="Search by serial number..."
            onChange={(value) => setSearchQuery(value)}
          />
        </Box>

        {/* Table */}

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
                  "Sr",
                  "Old Serial",
                  "New Serial",
                  "Reason",
                  "Status",
                  "Requested At",
                  "Actions",
                ].map((h) => (
                  <TableCell
                    key={h}
                    sx={{
                      color: "#fff",
                      fontWeight: 700,
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
                  <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                    <CircularProgress sx={{ color: "#D20000" }} />
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                paginatedData?.map((item, index) => (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      {(page - 1) * rowsPerPage + index + 1}
                    </TableCell>

                    <TableCell>
                      {item?.old_serial?.serial_number || "N/A"}
                    </TableCell>

                    <TableCell>
                      {item?.new_serial?.serial_number || "N/A"}
                    </TableCell>

                    <TableCell>{item.reason}</TableCell>
                    <TableCell>
                      <TextField
                        select
                        size="small"
                        value={item.status || "PENDING"}
                        onChange={(e) => {
                          const newStatus = e.target.value;

                          // Optional: Prevent unnecessary call if same status
                          if (newStatus === item.status) return;

                          dispatch(
                            updateReplacement({
                              id: item.id,
                              data: {
                                status: newStatus,
                                // Add other required fields if your backend needs them
                                // reason: item.reason,
                                // old_serial_number: item.old_serial?.serial_number,
                              },
                            }),
                          )
                            .unwrap()
                            .then(() => {
                              dispatch(getReplacements()); // Refresh list
                              CommonToast(
                                "Status updated successfully",
                                "success",
                              );
                            })
                            .catch((error) => {
                              console.error("Status update error:", error); // ← Add this for debugging
                              CommonToast(
                                getErrorMessage(
                                  error,
                                  "Failed to update warranty claim status",
                                ),
                                "error",
                              );
                            });
                        }}
                        SelectProps={{
                          native: true,
                        }}
                        sx={{
                          minWidth: 140,

                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            fontWeight: 600,
                          },

                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor:
                              item.status === "APPROVED"
                                ? "#4caf50"
                                : item.status === "REJECTED"
                                  ? "#f44336"
                                  : item.status === "COMPLETED"
                                    ? "#2196f3"
                                    : "#ff9800",
                          },
                        }}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="APPROVED">APPROVED</option>
                        <option value="REJECTED">REJECTED</option>
                        <option value="COMPLETED">COMPLETED</option>
                      </TextField>
                    </TableCell>
                    <TableCell>
                      {item?.requested_at
                        ? new Date(item.requested_at).toLocaleDateString(
                            "en-IN",
                          )
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <IconButton
                          onClick={() => handleView(item)}
                          sx={{
                            bgcolor: "#e3f2fd",
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>

                        <IconButton
                          onClick={() => handleEdit(item)}
                          sx={{
                            bgcolor: "#fff3e0",
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>

                        <IconButton
                          disabled={deleteLoading}
                          onClick={() => handleDelete(item.id)}
                          sx={{
                            bgcolor: "#ffebee",
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}

              {!loading && filteredData?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <AutorenewIcon
                      sx={{
                        fontSize: 40,
                        color: "#ccc",
                      }}
                    />

                    <Typography mt={1}>
                      No replacement requests found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}

        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "flex-end",
            borderTop: "1px solid #eee",
          }}
        >
          <Pagination
            page={page}
            onChange={(_, value) => setPage(value)}
            count={Math.ceil((filteredData?.length || 0) / rowsPerPage)}
            sx={{
              "& .Mui-selected": {
                bgcolor: "#D20000 !important",
                color: "#fff",
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default Replacement;
