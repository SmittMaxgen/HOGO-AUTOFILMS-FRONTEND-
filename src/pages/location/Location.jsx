// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import {
//   getLocations,
//   createLocation,
//   updateLocation,
//   deleteLocation,
// } from "../../feature/location/locationThunks";

// import {
//   selectLocations,
//   selectLocationLoading,
//   selectCreateLocationLoading,
//   selectUpdateLocationLoading,
//   selectLocationSuccess,
// } from "../../feature/location/locationSelector";

// import { getWarehouses } from "../../feature/warehouse/warehouseThunks";
// import { selectWarehouses } from "../../feature/warehouse/warehouseSelector";

// import {
//   Box,
//   Paper,
//   Stack,
//   Typography,
//   IconButton,
//   TextField,
//   MenuItem,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Switch,
//   CircularProgress,
//   Pagination,
// } from "@mui/material";

// import AddIcon from "@mui/icons-material/Add";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import VisibilityIcon from "@mui/icons-material/Visibility";

// import CommonButton from "../../components/commonComponents/CommonButton";
// import CommonLabel from "../../components/commonComponents/CommonLabel";
// import CommonToast from "../../components/commonComponents/Toster";
// import CommonSearchField from "../../components/commonComponents/CommonSearchField";

// const Location = () => {
//   const dispatch = useDispatch();

//   const locations = useSelector(selectLocations);
//   const warehouses = useSelector(selectWarehouses);

//   const loading = useSelector(selectLocationLoading);
//   const createLoading = useSelector(selectCreateLocationLoading);
//   const updateLoading = useSelector(selectUpdateLocationLoading);
//   const success = useSelector(selectLocationSuccess);

//   const [page, setPage] = useState(1);
//   const rowsPerPage = 10;

//   const [isEditing, setIsEditing] = useState(false);
//   const [isAdd, setIsAdd] = useState(false);
//   const [isViewing, setIsViewing] = useState(false);
//   const [editId, setEditId] = useState(null);

//   const [searchQuery, setSearchQuery] = useState("");

//   const [form, setForm] = useState({
//     warehouse_id: "",
//     name: "",
//     address: "",
//     code: "",
//     status: "active",
//   });

//   const [errors, setErrors] = useState({});

//   // ================= FETCH =================
//   useEffect(() => {
//     dispatch(getWarehouses());
//   }, [dispatch]);

//   useEffect(() => {
//     const payload = {};
//     if (searchQuery) payload.name = searchQuery;
//     dispatch(getLocations(payload));
//   }, [dispatch, searchQuery]);

//   useEffect(() => {
//     if (success) {
//       dispatch(getLocations());
//       handleReset();
//     }
//   }, [success, dispatch]);

//   // ================= HANDLERS =================
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const validate = () => {
//     const temp = {};
//     if (!form.warehouse_id) temp.warehouse_id = "Warehouse required";
//     if (!form.name) temp.name = "Location name required";
//     if (!form.code) temp.code = "Code required";
//     if (!form.address) temp.address = "Address required";
//     setErrors(temp);
//     return Object.keys(temp).length === 0;
//   };

//   const handleSubmit = () => {
//     if (!validate()) return;

//     if (editId) {
//       dispatch(updateLocation({ id: editId, data: form }))
//         .unwrap()
//         .then(() => {
//           CommonToast("Location updated successfully", "success");
//           handleReset();
//         })
//         .catch(() => CommonToast("Failed to update location", "error"));
//     } else {
//       dispatch(createLocation(form))
//         .unwrap()
//         .then(() => {
//           CommonToast("Location created successfully", "success");
//           handleReset();
//         })
//         .catch(() => CommonToast("Failed to create location", "error"));
//     }
//   };

//   const handleEdit = (item) => {
//     setIsEditing(true);
//     setIsAdd(false);
//     setIsViewing(false);
//     setEditId(item.id);

//     setForm({
//       warehouse_id: item.warehouse_id,
//       name: item.name,
//       address: item.address,
//       code: item.code,
//       status: item.status,
//     });
//   };

//   const handleView = (item) => {
//     setIsViewing(true);
//     setIsEditing(false);
//     setIsAdd(false);
//     setEditId(item.id);

//     setForm({
//       warehouse_id: item.warehouse_id,
//       name: item.name,
//       address: item.address,
//       code: item.code,
//       status: item.status,
//     });
//   };

//   const handleDelete = (id) => {
//     if (window.confirm("Delete this location?")) {
//       dispatch(deleteLocation(id))
//         .unwrap()
//         .then(() => {
//           CommonToast("Location deleted", "success");
//         })
//         .catch(() => CommonToast("Failed to delete location", "error"));
//     }
//   };

//   const handleStatusToggle = (item) => {
//     const updatedStatus = item.status === "active" ? "deactive" : "active";

//     dispatch(
//       updateLocation({
//         id: item.id,
//         data: { ...item, status: updatedStatus },
//       }),
//     )
//       .unwrap()
//       .then(() => CommonToast("Status updated", "success"))
//       .catch(() => CommonToast("Failed to update status", "error"));
//   };

//   const handleReset = () => {
//     setForm({
//       warehouse_id: "",
//       name: "",
//       address: "",
//       code: "",
//       status: "active",
//     });

//     setEditId(null);
//     setIsAdd(false);
//     setIsEditing(false);
//     setIsViewing(false);
//     setErrors({});
//   };

//   const paginatedData = locations?.slice(
//     (page - 1) * rowsPerPage,
//     page * rowsPerPage,
//   );

//   // ================= FORM VIEW =================
//   if (isEditing || isAdd || isViewing) {
//     return (
//       <Box mt={4}>
//         <Stack direction="row" alignItems="center" spacing={1} mb={3}>
//           <IconButton onClick={handleReset}>
//             <ArrowBackIcon />
//           </IconButton>
//           <CommonLabel>
//             {isViewing
//               ? "View Location"
//               : isEditing
//                 ? "Edit Location"
//                 : "Create Location"}
//           </CommonLabel>
//         </Stack>

//         <Paper sx={{ p: 3 }}>
//           <Stack spacing={2}>
//             <TextField
//               select
//               label="Warehouse"
//               name="warehouse_id"
//               value={form.warehouse_id}
//               onChange={handleChange}
//               disabled={isViewing}
//               error={!!errors.warehouse_id}
//               helperText={errors.warehouse_id}
//               fullWidth
//             >
//               {warehouses?.map((wh) => (
//                 <MenuItem key={wh.id} value={wh.id}>
//                   {wh.name}
//                 </MenuItem>
//               ))}
//             </TextField>

//             <TextField
//               label="Location Name"
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//               disabled={isViewing}
//               error={!!errors.name}
//               helperText={errors.name}
//               fullWidth
//             />

//             <TextField
//               label="Code"
//               name="code"
//               value={form.code}
//               onChange={handleChange}
//               disabled={isViewing}
//               error={!!errors.code}
//               helperText={errors.code}
//               fullWidth
//             />

//             <TextField
//               label="Address"
//               name="address"
//               value={form.address}
//               onChange={handleChange}
//               disabled={isViewing}
//               error={!!errors.address}
//               helperText={errors.address}
//               fullWidth
//               multiline
//               rows={3}
//             />

//             <Stack direction="row" justifyContent="flex-end" spacing={2}>
//               <CommonButton variant="outlined" onClick={handleReset}>
//                 Cancel
//               </CommonButton>

//               {!isViewing && (
//                 <CommonButton
//                   variant="contained"
//                   onClick={handleSubmit}
//                   disabled={createLoading || updateLoading}
//                 >
//                   {createLoading || updateLoading ? "Saving..." : "Save"}
//                 </CommonButton>
//               )}
//             </Stack>
//           </Stack>
//         </Paper>
//       </Box>
//     );
//   }

//   // ================= LIST VIEW =================
//   return (
//     <Box>
//       <Stack direction="row" justifyContent="space-between" mb={3}>
//         <Typography variant="h4" fontWeight={700} sx={{ color: "#7E7E7E" }}>
//           Locations
//         </Typography>
//         <CommonButton
//           variant="contained"
//           startIcon={<AddIcon />}
//           onClick={() => {
//             handleReset();
//             setIsAdd(true);
//           }}
//         >
//           Add Location
//         </CommonButton>
//       </Stack>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               {["Sr", "Warehouse", "Name", "Code", "Status", "Actions"].map(
//                 (h) => (
//                   <TableCell key={h} sx={{ fontWeight: 700 }}>
//                     {h}
//                   </TableCell>
//                 ),
//               )}
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {loading ? (
//               <TableRow>
//                 <TableCell colSpan={6} align="center">
//                   <CircularProgress size={28} />
//                 </TableCell>
//               </TableRow>
//             ) : (
//               paginatedData?.map((item, index) => (
//                 <TableRow key={item.id} hover>
//                   <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
//                   <TableCell>{item.warehouse_name}</TableCell>
//                   <TableCell>{item.name}</TableCell>
//                   <TableCell>{item.code}</TableCell>
//                   <TableCell>
//                     <Switch
//                       checked={item.status === "active"}
//                       onChange={() => handleStatusToggle(item)}
//                       size="small"
//                       color="success"
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <IconButton onClick={() => handleView(item)}>
//                       <VisibilityIcon />
//                     </IconButton>
//                     <IconButton
//                       color="warning"
//                       onClick={() => handleEdit(item)}
//                     >
//                       <EditIcon />
//                     </IconButton>
//                     <IconButton
//                       color="error"
//                       onClick={() => handleDelete(item.id)}
//                     >
//                       <DeleteIcon />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Stack alignItems="flex-end" mt={3}>
//         <Pagination
//           count={Math.ceil((locations?.length || 0) / rowsPerPage)}
//           page={page}
//           onChange={(_, value) => setPage(value)}
//           color="primary"
//         />
//       </Stack>
//     </Box>
//   );
// };

// export default Location;
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} from "../../feature/location/locationThunks";

import {
  selectLocations,
  selectLocationLoading,
  selectCreateLocationLoading,
  selectUpdateLocationLoading,
  selectLocationSuccess,
} from "../../feature/location/locationSelector";

import { getWarehouses } from "../../feature/warehouse/warehouseThunks";
import { selectWarehouses } from "../../feature/warehouse/warehouseSelector";

import {
  Box,
  Paper,
  Stack,
  Typography,
  IconButton,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  CircularProgress,
  Pagination,
  Chip,
  Divider,
  Grid,
  InputAdornment,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import QrCodeIcon from "@mui/icons-material/QrCode";
import FmdGoodIcon from "@mui/icons-material/FmdGood";

import CommonButton from "../../components/commonComponents/CommonButton";
import CommonToast from "../../components/commonComponents/Toster";
import CommonSearchField from "../../components/commonComponents/CommonSearchField";

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

const StatusChip = ({ status }) => {
  const isActive = status === "active";
  return (
    <Chip
      label={isActive ? "Active" : "Deactive"}
      size="small"
      sx={{
        fontWeight: 700,
        borderRadius: 1,
        fontSize: 11,
        bgcolor: isActive ? "#e8f5e9" : "#f5f5f5",
        color: isActive ? "#2e7d32" : "#757575",
        border: `1px solid ${isActive ? "#c8e6c9" : "#e0e0e0"}`,
      }}
    />
  );
};

const fieldSx = {
  "& .MuiOutlinedInput-root.Mui-focused fieldset": { borderColor: "#D20000" },
  "& label.Mui-focused": { color: "#D20000" },
};

// ─── Main Component ────────────────────────────────────────────────────────────

const Location = () => {
  const dispatch = useDispatch();

  const locations = useSelector(selectLocations);
  const warehouses = useSelector(selectWarehouses);
  const loading = useSelector(selectLocationLoading);
  const createLoading = useSelector(selectCreateLocationLoading);
  const updateLoading = useSelector(selectUpdateLocationLoading);
  const success = useSelector(selectLocationSuccess);

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [isEditing, setIsEditing] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [form, setForm] = useState({
    warehouse_id: "",
    name: "",
    address: "",
    code: "",
    status: "active",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getWarehouses());
  }, [dispatch]);

  useEffect(() => {
    const payload = {};
    if (searchQuery) payload.name = searchQuery;
    dispatch(getLocations(payload));
  }, [dispatch, searchQuery]);

  useEffect(() => {
    if (success) {
      dispatch(getLocations());
      handleReset();
    }
  }, [success, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const temp = {};
    if (!form.warehouse_id) temp.warehouse_id = "Warehouse required";
    if (!form.name) temp.name = "Location name required";
    if (!form.code) temp.code = "Code required";
    if (!form.address) temp.address = "Address required";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (editId) {
      dispatch(updateLocation({ id: editId, data: form }))
        .unwrap()
        .then(() => {
          CommonToast("Location updated successfully", "success");
          handleReset();
        })
        .catch(() => CommonToast("Failed to update location", "error"));
    } else {
      dispatch(createLocation(form))
        .unwrap()
        .then(() => {
          CommonToast("Location created successfully", "success");
          handleReset();
        })
        .catch(() => CommonToast("Failed to create location", "error"));
    }
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setIsAdd(false);
    setIsViewing(false);
    setEditId(item.id);
    setForm({
      warehouse_id: item.warehouse_id,
      name: item.name,
      address: item.address,
      code: item.code,
      status: item.status,
    });
  };

  const handleView = (item) => {
    setIsViewing(true);
    setIsEditing(false);
    setIsAdd(false);
    setEditId(item.id);
    setForm({
      warehouse_id: item.warehouse_id,
      name: item.name,
      address: item.address,
      code: item.code,
      status: item.status,
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this location?")) {
      dispatch(deleteLocation(id))
        .unwrap()
        .then(() => CommonToast("Location deleted", "success"))
        .catch(() => CommonToast("Failed to delete location", "error"));
    }
  };

  const handleStatusToggle = (item) => {
    const updatedStatus = item.status === "active" ? "deactive" : "active";
    dispatch(
      updateLocation({ id: item.id, data: { ...item, status: updatedStatus } }),
    )
      .unwrap()
      .then(() => CommonToast("Status updated", "success"))
      .catch(() => CommonToast("Failed to update status", "error"));
  };

  const handleReset = () => {
    setForm({
      warehouse_id: "",
      name: "",
      address: "",
      code: "",
      status: "active",
    });
    setEditId(null);
    setIsAdd(false);
    setIsEditing(false);
    setIsViewing(false);
    setErrors({});
  };

  const paginatedData = locations?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  // helper: get warehouse name by id
  const getWarehouseName = (id) =>
    warehouses?.find((w) => w.id === (id || form.warehouse_id))?.name ||
    id ||
    "N/A";

  // ── View Detail ──────────────────────────────────────────────────────────────
  if (isViewing) {
    return (
      <Box mt={4}>
        <PageHeader title="Location Details" onBack={handleReset} />

        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid #f0f0f0",
          }}
        >
          {/* Identity strip */}
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
              <FmdGoodIcon sx={{ fontSize: 32, color: "#D20000" }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700} color="#1a1a1a">
                {form.name}
              </Typography>
              <Box display="flex" gap={1} mt={0.8} flexWrap="wrap">
                <Chip
                  label={form.code}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 700, borderRadius: 1, fontSize: 11 }}
                />
                <Chip
                  label={getWarehouseName(form.warehouse_id)}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    borderRadius: 1,
                    fontSize: 11,
                    bgcolor: "#f0f4ff",
                    color: "#1565c0",
                    border: "1px solid #d0deff",
                  }}
                />
                <StatusChip status={form.status} />
              </Box>
            </Box>
          </Box>

          <Box px={4} py={3}>
            <SectionHeading title="Location Information" />
            <Grid container spacing={2}>
              {[
                {
                  label: "Location Name",
                  value: form.name,
                  icon: <FmdGoodIcon fontSize="small" />,
                },
                {
                  label: "Code",
                  value: form.code,
                  icon: <QrCodeIcon fontSize="small" />,
                },
                {
                  label: "Warehouse",
                  value: getWarehouseName(form.warehouse_id),
                  icon: <WarehouseIcon fontSize="small" />,
                },
                {
                  label: "Status",
                  value: form.status === "active" ? "Active" : "Deactive",
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

              <Grid item xs={12}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "#fafafa",
                    border: "1px solid #ebebeb",
                    borderRadius: 2,
                  }}
                >
                  <Box display="flex" alignItems="center" gap={0.8} mb={0.5}>
                    <LocationOnIcon sx={{ color: "#D20000", fontSize: 16 }} />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={700}
                    >
                      Address
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={600} color="#1a1a1a">
                    {form.address || "N/A"}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    );
  }

  // ── Create / Edit Form ───────────────────────────────────────────────────────
  if (isEditing || isAdd) {
    return (
      <Box mt={4}>
        <PageHeader
          title={isEditing ? "Edit Location" : "Create Location"}
          onBack={handleReset}
        />

        <Paper
          elevation={3}
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
            <SectionHeading title="Location Information" />
          </Box>

          <Box px={4} py={4}>
            <Grid container spacing={2.5}>
              {/* Warehouse Select */}
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Warehouse"
                  name="warehouse_id"
                  value={form.warehouse_id}
                  onChange={handleChange}
                  error={!!errors.warehouse_id}
                  helperText={errors.warehouse_id}
                  fullWidth
                  sx={fieldSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <WarehouseIcon sx={{ color: "#D20000" }} />
                      </InputAdornment>
                    ),
                  }}
                >
                  {warehouses?.map((wh) => (
                    <MenuItem key={wh.id} value={wh.id}>
                      {wh.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Location Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Location Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  fullWidth
                  sx={fieldSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FmdGoodIcon sx={{ color: "#D20000" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Code */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Code"
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  error={!!errors.code}
                  helperText={errors.code}
                  fullWidth
                  sx={fieldSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <QrCodeIcon sx={{ color: "#D20000" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Address */}
              <Grid item xs={12}>
                <TextField
                  label="Address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  error={!!errors.address}
                  helperText={errors.address}
                  fullWidth
                  multiline
                  rows={3}
                  sx={fieldSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon sx={{ color: "#D20000" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

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
                  "&:hover": { bgcolor: "#a80000" },
                  fontWeight: 700,
                }}
              >
                {createLoading || updateLoading
                  ? "Saving..."
                  : isEditing
                    ? "Update Location"
                    : "Save Location"}
              </CommonButton>
            </Stack>
          </Box>
        </Paper>
      </Box>
    );
  }

  // ── List View ────────────────────────────────────────────────────────────────
  return (
    <Box>
      {/* Page Title Row */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{ width: 5, height: 32, bgcolor: "#D20000", borderRadius: 1 }}
          />
          <Typography variant="h5" fontWeight={800} color="#1a1a1a">
            Locations
          </Typography>
        </Box>

        <CommonButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            handleReset();
            setIsAdd(true);
          }}
          sx={{
            bgcolor: "#D20000",
            "&:hover": { bgcolor: "#a80000" },
            fontWeight: 700,
            borderRadius: 1.5,
            px: 2.5,
            boxShadow: "0 4px 12px rgba(210,0,0,0.3)",
          }}
        >
          Add Location
        </CommonButton>
      </Stack>

      {/* Table Card */}
      <Paper
        elevation={2}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid #f0f0f0",
        }}
      >
        {/* Search */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            bgcolor: "#fafafa",
            borderBottom: "1px solid #ebebeb",
            display: "flex",
          }}
        >
          <CommonSearchField
            value={searchQuery}
            placeholder="Search by location name..."
            onChange={(value) => setSearchQuery(value)}
          />
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
                {["Sr", "Warehouse", "Name", "Code", "Status", "Actions"].map(
                  (h) => (
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
                  ),
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      gap={1}
                    >
                      <CircularProgress size={28} sx={{ color: "#D20000" }} />
                      <Typography variant="body2" color="text.secondary">
                        Loading locations...
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData?.map((item, index) => (
                  <TableRow
                    key={item.id}
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
                      sx={{ fontWeight: 700, color: "#D20000", width: 50 }}
                    >
                      {(page - 1) * rowsPerPage + index + 1}
                    </TableCell>

                    {/* Warehouse */}
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <WarehouseIcon
                          sx={{ fontSize: 15, color: "#D20000" }}
                        />
                        <Typography
                          fontSize={13}
                          fontWeight={500}
                          color="text.secondary"
                        >
                          {item.warehouse_name}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Name */}
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1.2}>
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
                          <FmdGoodIcon
                            sx={{ fontSize: 15, color: "#D20000" }}
                          />
                        </Box>
                        <Typography
                          fontWeight={600}
                          fontSize={13}
                          color="#1a1a1a"
                        >
                          {item.name}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Code */}
                    <TableCell>
                      <Chip
                        label={item.code}
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

                    {/* Status */}
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Switch
                          checked={item.status === "active"}
                          onChange={() => handleStatusToggle(item)}
                          size="small"
                          color="success"
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: "success.main",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                              { backgroundColor: "success.light" },
                          }}
                        />
                        <StatusChip status={item.status} />
                      </Box>
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <Box display="flex" gap={0.5}>
                        <IconButton
                          size="small"
                          onClick={() => handleView(item)}
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
                          onClick={() => handleEdit(item)}
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
                          onClick={() => handleDelete(item.id)}
                          sx={{
                            bgcolor: "#fce4ec",
                            color: "#c62828",
                            "&:hover": { bgcolor: "#ef9a9a" },
                            borderRadius: 1,
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}

              {!loading && locations?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      gap={1}
                    >
                      <FmdGoodIcon sx={{ fontSize: 40, color: "#e0e0e0" }} />
                      <Typography color="text.secondary" fontWeight={500}>
                        No locations found
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
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
            count={Math.ceil((locations?.length || 0) / rowsPerPage)}
            page={page}
            onChange={(_, value) => setPage(value)}
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
    </Box>
  );
};

export default Location;
