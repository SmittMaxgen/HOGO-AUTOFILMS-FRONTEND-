import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  CircularProgress,
  Grid,
  Button,
  Stack,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import DescriptionIcon from "@mui/icons-material/Description";

import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../feature/department/departmentThunks";
import {
  selectDepartmentList,
  selectDepartmentLoading,
} from "../../feature/department/departmentSelector";
import CommonButton from "../../components/commonComponents/CommonButton";
import CommonToast from "../../components/commonComponents/Toster";

// ─── Design tokens ────────────────────────────────────────────────────────────
const fieldSx = {
  "& .MuiOutlinedInput-root.Mui-focused fieldset": { borderColor: "#D20000" },
  "& label.Mui-focused": { color: "#D20000" },
};

const STATUS_STYLE = {
  Active: { bgcolor: "#e8f5e9", color: "#2e7d32", border: "1px solid #c8e6c9" },
  Inactive: {
    bgcolor: "#f5f5f5",
    color: "#757575",
    border: "1px solid #e0e0e0",
  },
};

// ─── Initial state ────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  name: "",
  description: "",
  head_of_department: "",
  status: "Active",
};

const REQUIRED = new Set(["name"]);

// ─── Module-level components (prevents remount / focus-loss bug) ──────────────

const SectionHeading = ({ title }) => (
  <Box display="flex" alignItems="center" gap={1.5} mb={2.5}>
    <Box sx={{ width: 4, height: 22, bgcolor: "#D20000", borderRadius: 1 }} />
    <Typography
      variant="subtitle1"
      fontWeight={700}
      color="#1a1a1a"
      letterSpacing={0.4}
    >
      {title}
    </Typography>
  </Box>
);

const Field = ({
  label,
  field,
  type = "text",
  options = {},
  formData,
  formErrors,
  isEditable,
  setFormData,
  setFormErrors,
}) => {
  const required = REQUIRED.has(field);
  const { children: selectChildren, ...rest } = options;
  const props = {
    fullWidth: true,
    label: required && isEditable ? `${label} *` : label,
    type,
    value: formData[field] ?? "",
    sx: fieldSx,
    InputProps: { readOnly: !isEditable },
    error: isEditable && !!formErrors[field],
    helperText: isEditable ? formErrors[field] : undefined,
    onChange: isEditable
      ? (e) => {
          setFormData((p) => ({ ...p, [field]: e.target.value }));
          if (formErrors[field])
            setFormErrors((p) => ({ ...p, [field]: undefined }));
        }
      : undefined,
    ...rest,
  };
  if (rest.select && selectChildren)
    return <TextField {...props}>{selectChildren}</TextField>;
  return <TextField {...props} />;
};

const DetailCard = ({ icon, label, value }) => (
  <Box
    sx={{
      bgcolor: "#fafafa",
      borderRadius: 2,
      p: 2,
      border: "1px solid #f0f0f0",
      display: "flex",
      gap: 1.5,
      alignItems: "flex-start",
    }}
  >
    <Box sx={{ color: "#D20000", mt: 0.2, flexShrink: 0 }}>{icon}</Box>
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight={600}
        display="block"
      >
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} color="#1a1a1a" mt={0.3}>
        {value || "—"}
      </Typography>
    </Box>
  </Box>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const Department = () => {
  const dispatch = useDispatch();

  const departments = useSelector(selectDepartmentList);
  const loading = useSelector(selectDepartmentLoading);

  // ── State ──────────────────────────────────────────────────────────────────
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState("view");
  const [deleteDialogOpen, setDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});

  const isEditable = mode === "edit" || mode === "create";
  const fieldProps = {
    formData,
    formErrors,
    isEditable,
    setFormData,
    setFormErrors,
  };

  // ── Lifecycle ──────────────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(getDepartments());
  }, [dispatch]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const loadForm = (dept) =>
    setFormData({
      name: dept.name || "",
      description: dept.description || "",
      head_of_department: dept.head_of_department || "",
      status: dept.status || "Active",
    });

  const validate = () => {
    const errors = {};
    if (!formData.name?.trim()) errors.name = "Department name is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleView = (dept) => {
    setSelected(dept);
    loadForm(dept);
    setMode("view");
    setFormErrors({});
  };

  const handleEdit = (dept) => {
    setSelected(dept);
    loadForm(dept);
    setMode("edit");
    setFormErrors({});
  };

  const handleAdd = () => {
    setSelected(null);
    setFormData(EMPTY_FORM);
    setFormErrors({});
    setMode("create");
  };

  const handleBack = () => {
    setSelected(null);
    setMode("view");
    setFormErrors({});
  };

  const handleCreate = async () => {
    if (!validate()) return;
    const result = await dispatch(createDepartment(formData));
    if (result.type.includes("fulfilled")) {
      CommonToast("Department created successfully", "success");
      handleBack();
    } else {
      CommonToast("Failed to create department", "error");
    }
  };

  const handleSave = async () => {
    if (!validate()) return;
    const result = await dispatch(
      updateDepartment({ id: selected.id, data: formData }),
    );
    if (result.type.includes("fulfilled")) {
      CommonToast("Department updated successfully", "success");
      const updated = { ...selected, ...formData };
      setSelected(updated);
      loadForm(updated);
      setMode("view");
    } else {
      CommonToast("Failed to update department", "error");
    }
  };

  const handleDeleteConfirm = async () => {
    const result = await dispatch(deleteDepartment(deleteTarget.id));
    if (result.type.includes("fulfilled")) {
      CommonToast("Department deleted successfully", "success");
      if (selected?.id === deleteTarget.id) handleBack();
    } else {
      CommonToast("Failed to delete department", "error");
    }
    setDeleteDialog(false);
    setDeleteTarget(null);
  };

  // ── LIST VIEW ──────────────────────────────────────────────────────────────
  if (!selected && mode !== "create") {
    return (
      <Box>
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Box>
            <Box display="flex" alignItems="center" gap={1.5} mb={0.5}>
              <Box
                sx={{
                  width: 5,
                  height: 32,
                  bgcolor: "#D20000",
                  borderRadius: 1,
                }}
              />
              <Typography variant="h5" fontWeight={800} color="#1a1a1a">
                Departments
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" ml={2.5}>
              Manage organisation departments
            </Typography>
          </Box>
          <CommonButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{
              bgcolor: "#D20000",
              "&:hover": { bgcolor: "#a80000" },
              fontWeight: 700,
              borderRadius: 1.5,
              px: 2.5,
              boxShadow: "0 4px 12px rgba(210,0,0,0.3)",
            }}
          >
            Add Department
          </CommonButton>
        </Stack>

        {/* Table */}
        <Paper
          elevation={2}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid #f0f0f0",
          }}
        >
          {loading ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              py={8}
              gap={1}
            >
              <CircularProgress size={32} sx={{ color: "#D20000" }} />
              <Typography variant="body2" color="text.secondary">
                Loading departments...
              </Typography>
            </Box>
          ) : (
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
                      "Department",
                      "Head",
                      "Description",
                      "Status",
                      "Actions",
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
                  {departments?.map((dept, i) => (
                    <TableRow
                      key={dept.id}
                      hover
                      sx={{
                        "&:hover": { bgcolor: "#fff5f5" },
                        "&:last-child td": { border: 0 },
                        borderBottom: "1px solid #f5f5f5",
                        transition: "background 0.15s",
                      }}
                    >
                      {/* Sr */}
                      <TableCell
                        sx={{ fontWeight: 700, color: "#D20000", width: 45 }}
                      >
                        {i + 1}
                      </TableCell>

                      {/* Department name */}
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1.2}>
                          <Box
                            sx={{
                              width: 28,
                              height: 28,
                              borderRadius: 1,
                              bgcolor: "#fff0f0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              border: "1px solid #ffd0d0",
                              flexShrink: 0,
                            }}
                          >
                            <BusinessIcon
                              sx={{ fontSize: 15, color: "#D20000" }}
                            />
                          </Box>
                          <Typography
                            fontWeight={600}
                            fontSize={13}
                            color="#1a1a1a"
                          >
                            {dept.name}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Head */}
                      <TableCell>
                        <Typography fontSize={13} color="text.secondary">
                          {dept.head_of_department || "—"}
                        </Typography>
                      </TableCell>

                      {/* Description */}
                      <TableCell>
                        <Typography
                          fontSize={12}
                          color="text.secondary"
                          sx={{
                            maxWidth: 260,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {dept.description || "—"}
                        </Typography>
                      </TableCell>

                      {/* Status */}
                      {/* <TableCell>
                        <Chip
                          label={dept.status || "Active"}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            borderRadius: 1,
                            fontSize: 11,
                            ...(STATUS_STYLE[dept.status] ||
                              STATUS_STYLE.Active),
                          }}
                        />
                      </TableCell> */}

                      {/* Status */}
                      <TableCell>
                        <Select
                          size="small"
                          value={dept.status || "Active"}
                          onChange={async (e) => {
                            const result = await dispatch(
                              updateDepartment({
                                id: dept.id,
                                data: { status: e.target.value },
                              }),
                            );
                            if (result.type.includes("fulfilled")) {
                              CommonToast("Status updated", "success");
                              dispatch(getDepartments());
                            }
                          }}
                          sx={{
                            minWidth: 100,
                            height: 26,
                            borderRadius: "999px",
                            fontWeight: 700,
                            fontSize: 11,
                            color:
                              STATUS_STYLE[dept.status]?.color ||
                              STATUS_STYLE.Active.color,
                            bgcolor:
                              STATUS_STYLE[dept.status]?.bgcolor ||
                              STATUS_STYLE.Active.bgcolor,
                            border:
                              STATUS_STYLE[dept.status]?.border ||
                              STATUS_STYLE.Active.border,
                            "& .MuiSelect-select": {
                              py: 0.5,
                              pl: 1.5,
                              display: "flex",
                              alignItems: "center",
                            },
                            "& fieldset": { border: "none" },
                            "& svg": {
                              color:
                                STATUS_STYLE[dept.status]?.color ||
                                STATUS_STYLE.Active.color,
                            },
                          }}
                        >
                          <MenuItem value="Active" sx={{ fontSize: 13 }}>
                            Active
                          </MenuItem>
                          <MenuItem value="Inactive" sx={{ fontSize: 13 }}>
                            Inactive
                          </MenuItem>
                        </Select>
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <Stack direction="row" spacing={0.8}>
                          <IconButton
                            size="small"
                            onClick={() => handleView(dept)}
                            sx={{
                              bgcolor: "#f0f4ff",
                              color: "#1565c0",
                              "&:hover": { bgcolor: "#d0deff" },
                              borderRadius: 1,
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(dept)}
                            sx={{
                              bgcolor: "#fff8e1",
                              color: "#f57c00",
                              "&:hover": { bgcolor: "#ffe082" },
                              borderRadius: 1,
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setDeleteTarget(dept);
                              setDeleteDialog(true);
                            }}
                            sx={{
                              bgcolor: "#fce4ec",
                              color: "#c62828",
                              "&:hover": { bgcolor: "#ef9a9a" },
                              borderRadius: 1,
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}

                  {!loading && (!departments || departments.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                          gap={1}
                        >
                          <BusinessIcon
                            sx={{ fontSize: 40, color: "#e0e0e0" }}
                          />
                          <Typography color="text.secondary" fontWeight={500}>
                            No departments found
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Delete Dialog */}
        <DeleteDialog
          open={deleteDialogOpen}
          name={deleteTarget?.name}
          loading={loading}
          onCancel={() => {
            setDeleteDialog(false);
            setDeleteTarget(null);
          }}
          onConfirm={handleDeleteConfirm}
        />
      </Box>
    );
  }

  // ── DETAIL / CREATE / EDIT VIEW ────────────────────────────────────────────
  return (
    <Box sx={{ bgcolor: "#f8f8f8", minHeight: "100vh" }}>
      {/* Red gradient header */}
      <Box
        sx={{
          background: "linear-gradient(90deg, #D20000 0%, #8B0000 100%)",
          px: 3,
          py: 3,
          boxShadow: "0 4px 16px rgba(210,0,0,0.25)",
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          mb={mode === "create" ? 0 : 2.5}
        >
          <IconButton onClick={handleBack} sx={{ color: "#fff", mr: 1.5 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h6"
            fontWeight={700}
            color="#fff"
            letterSpacing={1}
            flex={1}
          >
            {mode === "create"
              ? "Add New Department"
              : mode === "edit"
                ? "Edit Department"
                : "Department Details"}
          </Typography>

          {mode === "edit" && (
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={loading}
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                  fontWeight: 700,
                  borderRadius: 1.5,
                  textTransform: "none",
                }}
              >
                {loading ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => {
                  loadForm(selected);
                  setMode("view");
                  setFormErrors({});
                }}
                sx={{
                  borderColor: "rgba(255,255,255,0.6)",
                  color: "#fff",
                  "&:hover": {
                    borderColor: "#fff",
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                  fontWeight: 700,
                  borderRadius: 1.5,
                  textTransform: "none",
                }}
              >
                Cancel
              </Button>
            </Stack>
          )}
        </Box>

        {/* Identity strip — view mode */}
        {mode === "view" && selected?.name && (
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 2,
                bgcolor: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid rgba(255,255,255,0.3)",
              }}
            >
              <BusinessIcon sx={{ fontSize: 26, color: "#fff" }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700} color="#fff">
                {selected.name}
              </Typography>
              <Box display="flex" gap={1} mt={0.8}>
                <Chip
                  label={selected.status || "Active"}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: 11,
                    borderRadius: 1,
                    ...(STATUS_STYLE[selected.status] || STATUS_STYLE.Active),
                  }}
                />
              </Box>
              {selected.head_of_department && (
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.8)", mt: 0.5 }}
                >
                  Head: {selected.head_of_department}
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        {mode === "view" ? (
          // ── VIEW ────────────────────────────────────────────────────────────
          <Paper
            elevation={2}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              border: "1px solid #f0f0f0",
            }}
          >
            <Box
              sx={{
                px: 3,
                py: 2,
                bgcolor: "#fafafa",
                borderBottom: "1px solid #ebebeb",
              }}
            >
              <SectionHeading title="Department Information" />
            </Box>
            <Box px={4} py={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <DetailCard
                    icon={<BusinessIcon fontSize="small" />}
                    label="Department Name"
                    value={selected.name}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailCard
                    icon={<PersonIcon fontSize="small" />}
                    label="Head of Department"
                    value={selected.head_of_department}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailCard
                    icon={<BusinessIcon fontSize="small" />}
                    label="Status"
                    value={selected.status || "Active"}
                  />
                </Grid>
                <Grid item xs={12}>
                  <DetailCard
                    icon={<DescriptionIcon fontSize="small" />}
                    label="Description"
                    value={selected.description}
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>
        ) : (
          // ── CREATE / EDIT ────────────────────────────────────────────────────
          <Paper
            elevation={2}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              border: "1px solid #f0f0f0",
            }}
          >
            <Box
              sx={{
                px: 3,
                py: 2,
                bgcolor: "#fafafa",
                borderBottom: "1px solid #ebebeb",
              }}
            >
              <SectionHeading title="Department Information" />
            </Box>
            <Box px={4} py={3}>
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <Field {...fieldProps} label="Department Name" field="name" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    {...fieldProps}
                    label="Head of Department"
                    field="head_of_department"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    {...fieldProps}
                    label="Status"
                    field="status"
                    options={{
                      select: true,
                      children: [
                        <MenuItem key="Active" value="Active">
                          Active
                        </MenuItem>,
                        <MenuItem key="Inactive" value="Inactive">
                          Inactive
                        </MenuItem>,
                      ],
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    {...fieldProps}
                    label="Description"
                    field="description"
                    options={{ multiline: true, minRows: 3 }}
                  />
                </Grid>
              </Grid>

              {mode === "create" && (
                <Box mt={3}>
                  <CommonButton
                    variant="contained"
                    size="large"
                    onClick={handleCreate}
                    disabled={loading}
                    sx={{
                      bgcolor: "#D20000",
                      "&:hover": { bgcolor: "#a80000" },
                      fontWeight: 700,
                      borderRadius: 1.5,
                      px: 4,
                      boxShadow: "0 4px 12px rgba(210,0,0,0.3)",
                    }}
                  >
                    {loading ? "Creating..." : "Create Department"}
                  </CommonButton>
                </Box>
              )}
            </Box>
          </Paper>
        )}
      </Box>

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        name={deleteTarget?.name}
        loading={loading}
        onCancel={() => {
          setDeleteDialog(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
};

// ─── Reusable delete dialog (module level) ────────────────────────────────────
const DeleteDialog = ({ open, name, loading, onCancel, onConfirm }) => (
  <Dialog
    open={open}
    onClose={onCancel}
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
        Confirm Delete
      </Typography>
    </Box>
    <DialogContent sx={{ pt: 3 }}>
      <Typography variant="body1" color="text.secondary">
        Are you sure you want to delete{" "}
        <Typography component="span" fontWeight={700} color="#1a1a1a">
          {name}
        </Typography>
        ? This action cannot be undone.
      </Typography>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
      <Button
        onClick={onCancel}
        sx={{ fontWeight: 600, borderRadius: 1.5, textTransform: "none" }}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        onClick={onConfirm}
        disabled={loading}
        sx={{
          bgcolor: "#D20000",
          "&:hover": { bgcolor: "#a80000" },
          fontWeight: 700,
          borderRadius: 1.5,
          textTransform: "none",
          px: 3,
        }}
      >
        {loading ? "Deleting..." : "Delete"}
      </Button>
    </DialogActions>
  </Dialog>
);

export default Department;
