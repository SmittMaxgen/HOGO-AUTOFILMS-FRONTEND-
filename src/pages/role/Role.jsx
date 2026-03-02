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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DescriptionIcon from "@mui/icons-material/Description";
import LockIcon from "@mui/icons-material/Lock";

import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} from "../../feature/role/roleThunks";
import {
  selectRoleList,
  selectRoleLoading,
} from "../../feature/role/roleSelector";
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
  permissions: "",
  status: true,
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

// ─── Main Component ───────────────────────────────────────────────────────────
const Role = () => {
  const dispatch = useDispatch();

  const roles = useSelector(selectRoleList);
  const loading = useSelector(selectRoleLoading);

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
    dispatch(getRoles());
  }, [dispatch]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const loadForm = (role) =>
    setFormData({
      name: role.name || "",
      description: role.description || "",
      permissions: role.permissions || "",
      status: role.status || "Active",
    });

  const validate = () => {
    const errors = {};
    if (!formData.name?.trim()) errors.name = "Role name is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleView = (role) => {
    setSelected(role);
    loadForm(role);
    setMode("view");
    setFormErrors({});
  };

  const handleEdit = (role) => {
    setSelected(role);
    loadForm(role);
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
    const result = await dispatch(createRole(formData));
    if (result.type.includes("fulfilled")) {
      CommonToast("Role created successfully", "success");
      handleBack();
    } else {
      CommonToast("Failed to create role", "error");
    }
  };

  const handleSave = async () => {
    if (!validate()) return;
    const result = await dispatch(
      updateRole({ id: selected.id, data: formData }),
    );
    if (result.type.includes("fulfilled")) {
      CommonToast("Role updated successfully", "success");
      const updated = { ...selected, ...formData };
      setSelected(updated);
      loadForm(updated);
      setMode("view");
    } else {
      CommonToast("Failed to update role", "error");
    }
  };

  const handleDeleteConfirm = async () => {
    const result = await dispatch(deleteRole(deleteTarget.id));
    if (result.type.includes("fulfilled")) {
      CommonToast("Role deleted successfully", "success");
      if (selected?.id === deleteTarget.id) handleBack();
    } else {
      CommonToast("Failed to delete role", "error");
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
                Roles
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" ml={2.5}>
              Manage user roles and permissions
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
            Add Role
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
                Loading roles...
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
                      "Role",
                      "Description",
                      "Permissions",
                      //   "Status",
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
                  {roles?.map((role, i) => (
                    <TableRow
                      key={role.id}
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

                      {/* Role name */}
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
                            <AdminPanelSettingsIcon
                              sx={{ fontSize: 15, color: "#D20000" }}
                            />
                          </Box>
                          <Typography
                            fontWeight={600}
                            fontSize={13}
                            color="#1a1a1a"
                          >
                            {role.name}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Description */}
                      <TableCell>
                        <Typography
                          fontSize={12}
                          color="text.secondary"
                          sx={{
                            maxWidth: 220,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {role.description || "—"}
                        </Typography>
                      </TableCell>

                      {/* Permissions */}
                      <TableCell>
                        <Typography
                          fontSize={12}
                          color="text.secondary"
                          sx={{
                            maxWidth: 200,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {role.permissions || "—"}
                        </Typography>
                      </TableCell>

                      {/* Status */}
                      {/* <TableCell>
                        <Chip
                          label={role.status || "Active"}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            borderRadius: 1,
                            fontSize: 11,
                            ...(STATUS_STYLE[role.status] ||
                              STATUS_STYLE.Active),
                          }}
                        />
                      </TableCell> */}

                      {/* Actions */}
                      <TableCell>
                        <Stack direction="row" spacing={0.8}>
                          <IconButton
                            size="small"
                            onClick={() => handleView(role)}
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
                            onClick={() => handleEdit(role)}
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
                              setDeleteTarget(role);
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

                  {!loading && (!roles || roles.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                          gap={1}
                        >
                          <AdminPanelSettingsIcon
                            sx={{ fontSize: 40, color: "#e0e0e0" }}
                          />
                          <Typography color="text.secondary" fontWeight={500}>
                            No roles found
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
              ? "Add New Role"
              : mode === "edit"
                ? "Edit Role"
                : "Role Details"}
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
              <AdminPanelSettingsIcon sx={{ fontSize: 26, color: "#fff" }} />
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
            </Box>
          </Box>
        )}
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        {mode === "view" ? (
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
              <SectionHeading title="Role Information" />
            </Box>
            <Box px={4} py={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <DetailCard
                    icon={<AdminPanelSettingsIcon fontSize="small" />}
                    label="Role Name"
                    value={selected.name}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailCard
                    icon={<AdminPanelSettingsIcon fontSize="small" />}
                    label="Status"
                    value={selected.status || "Active"}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailCard
                    icon={<LockIcon fontSize="small" />}
                    label="Permissions"
                    value={selected.permissions}
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
              <SectionHeading title="Role Information" />
            </Box>
            <Box px={4} py={3}>
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <Field {...fieldProps} label="Role Name" field="name" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    {...fieldProps}
                    label="Status"
                    field="status"
                    options={{
                      sx: { width: "220px" },
                      select: true,
                      children: [
                        <MenuItem key="Active" value={true}>
                          Active
                        </MenuItem>,
                        <MenuItem key="Inactive" value={false}>
                          Inactive
                        </MenuItem>,
                      ],
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    {...fieldProps}
                    label="Permissions"
                    field="permissions"
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
                    {loading ? "Creating..." : "Create Role"}
                  </CommonButton>
                </Box>
              )}
            </Box>
          </Paper>
        )}
      </Box>

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

export default Role;
