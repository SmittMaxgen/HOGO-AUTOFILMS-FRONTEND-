// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import {
//   getWarehouses,
//   createWarehouse,
//   updateWarehouse,
//   deleteWarehouse,
// } from "../../feature/warehouse/warehouseThunks";

// import {
//   selectWarehouses,
//   selectWarehouseLoading,
//   selectCreateWarehouseLoading,
//   selectUpdateWarehouseLoading,
//   selectWarehouseSuccess,
// } from "../../feature/warehouse/warehouseSelector";

// import {
//   Box,
//   Paper,
//   Stack,
//   Typography,
//   IconButton,
//   TextField,
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

// const Warehouse = () => {
//   const dispatch = useDispatch();

//   const warehouses = useSelector(selectWarehouses);
//   const loading = useSelector(selectWarehouseLoading);
//   const createLoading = useSelector(selectCreateWarehouseLoading);
//   const updateLoading = useSelector(selectUpdateWarehouseLoading);
//   const createSuccess = useSelector(selectWarehouseSuccess);

//   const [page, setPage] = useState(1);
//   const rowsPerPage = 10;

//   const [isEditing, setIsEditing] = useState(false);
//   const [editId, setEditId] = useState(null);

//   const [isViewing, setIsViewing] = useState(false);
//   const [viewData, setViewData] = useState(null);

//   const [form, setForm] = useState({
//     name: "",
//     address: "",
//     code: "",
//     status: "active",
//   });

//   const [errors, setErrors] = useState({});
//   const [searchQuery, setSearchQuery] = useState("");

//   // ===============================
//   // FETCH
//   // ===============================
//   useEffect(() => {
//     const payload = {};
//     if (searchQuery) payload.name = searchQuery;

//     dispatch(getWarehouses(payload));
//   }, [dispatch, searchQuery]);

//   useEffect(() => {
//     if (createSuccess) {
//       dispatch(getWarehouses());
//       handleReset();
//     }
//   }, [createSuccess, dispatch]);

//   // ===============================
//   // HANDLERS
//   // ===============================
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const validate = () => {
//     const temp = {};
//     if (!form.name) temp.name = "Warehouse name is required";
//     if (!form.code) temp.code = "Warehouse code is required";
//     if (!form.address) temp.address = "Address is required";
//     setErrors(temp);
//     return Object.keys(temp).length === 0;
//   };

//   const handleSubmit = () => {
//     if (!validate()) return;

//     if (isEditing && editId) {
//       dispatch(updateWarehouse({ id: editId, data: form }))
//         .unwrap()
//         .then(() => {
//           dispatch(getWarehouses());
//           CommonToast("Warehouse updated successfully", "success");
//           handleReset();
//         })
//         .catch(() => CommonToast("Failed to update warehouse", "error"));
//     } else {
//       dispatch(createWarehouse(form))
//         .unwrap()
//         .then(() => {
//           dispatch(getWarehouses());
//           CommonToast("Warehouse created successfully", "success");
//           handleReset();
//         })
//         .catch(() => CommonToast("Failed to create warehouse", "error"));
//     }
//   };

//   const handleStatusToggle = (item) => {
//     const updatedStatus = item.status === "active" ? "deactive" : "active";

//     dispatch(
//       updateWarehouse({
//         id: item.id,
//         data: { ...item, status: updatedStatus },
//       }),
//     )
//       .unwrap()
//       .then(() => {
//         dispatch(getWarehouses());
//         CommonToast(
//           `Warehouse ${
//             updatedStatus === "active" ? "activated" : "deactivated"
//           } successfully`,
//           "success",
//         );
//       })
//       .catch(() => CommonToast("Failed to update status", "error"));
//   };

//   const handleEdit = (item) => {
//     setIsEditing(true);
//     setEditId(item.id);
//     setForm({
//       name: item.name,
//       address: item.address,
//       code: item.code,
//       status: item.status,
//     });
//   };

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this warehouse?")) {
//       dispatch(deleteWarehouse(id))
//         .unwrap()
//         .then(() => {
//           dispatch(getWarehouses());
//           CommonToast("Warehouse deleted successfully", "success");
//         })
//         .catch(() => CommonToast("Failed to delete warehouse", "error"));
//     }
//   };

//   const handleView = (item) => {
//     setViewData(item);
//     setIsViewing(true);
//   };

//   const handleReset = () => {
//     setForm({
//       name: "",
//       address: "",
//       code: "",
//       status: "active",
//     });
//     setErrors({});
//     setEditId(null);
//     setIsEditing(false);
//   };

//   const paginatedData = warehouses?.slice(
//     (page - 1) * rowsPerPage,
//     page * rowsPerPage,
//   );

//   // ===============================
//   // EDIT / CREATE FORM
//   // ===============================
//   if (isEditing) {
//     return (
//       <Box mt={4}>
//         <Stack direction="row" alignItems="center" spacing={1} mb={3}>
//           <IconButton onClick={handleReset}>
//             <ArrowBackIcon />
//           </IconButton>
//           <CommonLabel>
//             {editId ? "Edit Warehouse" : "Create Warehouse"}
//           </CommonLabel>
//         </Stack>

//         <Paper sx={{ p: 3 }}>
//           <Stack spacing={2}>
//             <TextField
//               label="Warehouse Name"
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//               error={!!errors.name}
//               helperText={errors.name}
//               fullWidth
//             />

//             <TextField
//               label="Warehouse Code"
//               name="code"
//               value={form.code}
//               onChange={handleChange}
//               error={!!errors.code}
//               helperText={errors.code}
//               fullWidth
//             />

//             <TextField
//               label="Address"
//               name="address"
//               value={form.address}
//               onChange={handleChange}
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
//               <CommonButton
//                 variant="contained"
//                 onClick={handleSubmit}
//                 disabled={createLoading || updateLoading}
//               >
//                 {createLoading || updateLoading ? "Saving..." : "Save"}
//               </CommonButton>
//             </Stack>
//           </Stack>
//         </Paper>
//       </Box>
//     );
//   }

//   // ===============================
//   // VIEW
//   // ===============================
//   if (isViewing && viewData) {
//     return (
//       <Box mt={4}>
//         <Stack direction="row" alignItems="center" spacing={1} mb={3}>
//           <IconButton
//             onClick={() => {
//               setIsViewing(false);
//               setViewData(null);
//             }}
//           >
//             <ArrowBackIcon />
//           </IconButton>
//           <CommonLabel>View Warehouse</CommonLabel>
//         </Stack>

//         <Paper sx={{ p: 3 }}>
//           <Stack spacing={2}>
//             <TextField
//               label="Name"
//               value={viewData.name}
//               fullWidth
//               InputProps={{ readOnly: true }}
//             />
//             <TextField
//               label="Code"
//               value={viewData.code}
//               fullWidth
//               InputProps={{ readOnly: true }}
//             />
//             <TextField
//               label="Address"
//               value={viewData.address}
//               fullWidth
//               multiline
//               rows={3}
//               InputProps={{ readOnly: true }}
//             />
//             <TextField
//               label="Status"
//               value={viewData.status}
//               fullWidth
//               InputProps={{ readOnly: true }}
//             />
//           </Stack>
//         </Paper>
//       </Box>
//     );
//   }

//   // ===============================
//   // LIST VIEW
//   // ===============================
//   return (
//     <Box>
//       <Stack direction="row" justifyContent="space-between" mb={3}>
//         <Typography variant="h4" fontWeight={700} sx={{ color: "#7E7E7E" }}>
//           Warehouses
//         </Typography>
//         <CommonButton
//           variant="contained"
//           startIcon={<AddIcon />}
//           onClick={() => {
//             handleReset();
//             setIsEditing(true);
//           }}
//         >
//           Add Warehouse
//         </CommonButton>
//       </Stack>

//       <TableContainer component={Paper}>
//         <Box sx={{ display: "flex" }}>
//           <CommonSearchField
//             value={searchQuery}
//             placeholder="Search by warehouse name..."
//             onChange={(value) => setSearchQuery(value)}
//           />
//         </Box>

//         <Table>
//           <TableHead>
//             <TableRow>
//               {["Sr", "Name", "Code", "Status", "Actions"].map((h) => (
//                 <TableCell key={h} sx={{ fontWeight: 700 }}>
//                   {h}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {loading && (
//               <TableRow>
//                 <TableCell colSpan={5} align="center">
//                   <CircularProgress size={28} />
//                   <Typography mt={1}>Loading warehouses...</Typography>
//                 </TableCell>
//               </TableRow>
//             )}

//             {!loading &&
//               paginatedData?.map((item, index) => (
//                 <TableRow key={item.id} hover>
//                   <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
//                   <TableCell>{item.name}</TableCell>
//                   <TableCell>{item.code}</TableCell>
//                   <TableCell>
//                     <Stack direction="row" alignItems="center" spacing={1}>
//                       <Switch
//                         checked={item.status === "active"}
//                         onChange={() => handleStatusToggle(item)}
//                         color="success"
//                         size="small"
//                       />
//                       <Typography
//                         color={
//                           item.status === "active"
//                             ? "success.main"
//                             : "text.secondary"
//                         }
//                       >
//                         {item.status}
//                       </Typography>
//                     </Stack>
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
//               ))}

//             {!loading && warehouses?.length === 0 && (
//               <TableRow>
//                 <TableCell colSpan={5} align="center">
//                   No warehouses found
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Stack alignItems="flex-end" mt={3}>
//         <Pagination
//           count={Math.ceil((warehouses?.length || 0) / rowsPerPage)}
//           page={page}
//           onChange={(_, value) => setPage(value)}
//           color="primary"
//         />
//       </Stack>
//     </Box>
//   );
// };

// export default Warehouse;
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from "../../feature/warehouse/warehouseThunks";

import {
  selectWarehouses,
  selectWarehouseLoading,
  selectCreateWarehouseLoading,
  selectUpdateWarehouseLoading,
  selectWarehouseSuccess,
} from "../../feature/warehouse/warehouseSelector";

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
import WarehouseIcon from "@mui/icons-material/Warehouse";
import QrCodeIcon from "@mui/icons-material/QrCode";
import LocationOnIcon from "@mui/icons-material/LocationOn";

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

const Warehouse = () => {
  const dispatch = useDispatch();

  const warehouses = useSelector(selectWarehouses);
  const loading = useSelector(selectWarehouseLoading);
  const createLoading = useSelector(selectCreateWarehouseLoading);
  const updateLoading = useSelector(selectUpdateWarehouseLoading);
  const createSuccess = useSelector(selectWarehouseSuccess);

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isViewing, setIsViewing] = useState(false);
  const [viewData, setViewData] = useState(null);

  const [form, setForm] = useState({
    name: "",
    address: "",
    code: "",
    status: "active",
  });
  const [errors, setErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const payload = {};
    if (searchQuery) payload.name = searchQuery;
    dispatch(getWarehouses(payload));
  }, [dispatch, searchQuery]);

  useEffect(() => {
    if (createSuccess) {
      dispatch(getWarehouses());
      handleReset();
    }
  }, [createSuccess, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const temp = {};
    if (!form.name) temp.name = "Warehouse name is required";
    if (!form.code) temp.code = "Warehouse code is required";
    if (!form.address) temp.address = "Address is required";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (isEditing && editId) {
      dispatch(updateWarehouse({ id: editId, data: form }))
        .unwrap()
        .then(() => {
          dispatch(getWarehouses());
          CommonToast("Warehouse updated successfully", "success");
          handleReset();
        })
        .catch(() => CommonToast("Failed to update warehouse", "error"));
    } else {
      dispatch(createWarehouse(form))
        .unwrap()
        .then(() => {
          dispatch(getWarehouses());
          CommonToast("Warehouse created successfully", "success");
          handleReset();
        })
        .catch(() => CommonToast("Failed to create warehouse", "error"));
    }
  };

  const handleStatusToggle = (item) => {
    const updatedStatus = item.status === "active" ? "deactive" : "active";
    dispatch(
      updateWarehouse({
        id: item.id,
        data: { ...item, status: updatedStatus },
      }),
    )
      .unwrap()
      .then(() => {
        dispatch(getWarehouses());
        CommonToast(
          `Warehouse ${updatedStatus === "active" ? "activated" : "deactivated"} successfully`,
          "success",
        );
      })
      .catch(() => CommonToast("Failed to update status", "error"));
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditId(item.id);
    setForm({
      name: item.name,
      address: item.address,
      code: item.code,
      status: item.status,
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this warehouse?")) {
      dispatch(deleteWarehouse(id))
        .unwrap()
        .then(() => {
          dispatch(getWarehouses());
          CommonToast("Warehouse deleted successfully", "success");
        })
        .catch(() => CommonToast("Failed to delete warehouse", "error"));
    }
  };

  const handleView = (item) => {
    setViewData(item);
    setIsViewing(true);
  };

  const handleReset = () => {
    setForm({ name: "", address: "", code: "", status: "active" });
    setErrors({});
    setEditId(null);
    setIsEditing(false);
  };

  const paginatedData = warehouses?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  // ── Create / Edit View ───────────────────────────────────────────────────────
  if (isEditing) {
    return (
      <Box mt={4}>
        <PageHeader
          title={editId ? "Edit Warehouse" : "Create Warehouse"}
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
            <SectionHeading title="Warehouse Information" />
          </Box>

          <Box px={4} py={4}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Warehouse Name"
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
                        <WarehouseIcon sx={{ color: "#D20000" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Warehouse Code"
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
                  : editId
                    ? "Update Warehouse"
                    : "Save Warehouse"}
              </CommonButton>
            </Stack>
          </Box>
        </Paper>
      </Box>
    );
  }

  // ── View Detail ──────────────────────────────────────────────────────────────
  if (isViewing && viewData) {
    return (
      <Box mt={4}>
        <PageHeader
          title="Warehouse Details"
          onBack={() => {
            setIsViewing(false);
            setViewData(null);
          }}
        />

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
              <WarehouseIcon sx={{ fontSize: 32, color: "#D20000" }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700} color="#1a1a1a">
                {viewData.name}
              </Typography>
              <Box display="flex" gap={1} mt={0.8}>
                <Chip
                  label={viewData.code}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 700, borderRadius: 1, fontSize: 11 }}
                />
                <StatusChip status={viewData.status} />
              </Box>
            </Box>
          </Box>

          <Box px={4} py={3}>
            <SectionHeading title="Warehouse Information" />
            <Grid container spacing={2}>
              {[
                {
                  label: "Warehouse Name",
                  value: viewData.name,
                  icon: <WarehouseIcon fontSize="small" />,
                },
                {
                  label: "Warehouse Code",
                  value: viewData.code,
                  icon: <QrCodeIcon fontSize="small" />,
                },
                {
                  label: "Status",
                  value: viewData.status === "active" ? "Active" : "Deactive",
                },
              ].map((item) => (
                <Grid item xs={12} sm={4} key={item.label}>
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
                    {viewData.address || "N/A"}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
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
            Warehouses
          </Typography>
        </Box>

        <CommonButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            handleReset();
            setIsEditing(true);
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
          Add Warehouse
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
            placeholder="Search by warehouse name..."
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
                {["Sr", "Name", "Code", "Status", "Actions"].map((h) => (
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
                  <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      gap={1}
                    >
                      <CircularProgress size={28} sx={{ color: "#D20000" }} />
                      <Typography variant="body2" color="text.secondary">
                        Loading warehouses...
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
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
                          <WarehouseIcon
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
                          color="success"
                          size="small"
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
                ))}

              {!loading && warehouses?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      gap={1}
                    >
                      <WarehouseIcon sx={{ fontSize: 40, color: "#e0e0e0" }} />
                      <Typography color="text.secondary" fontWeight={500}>
                        No warehouses found
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
            count={Math.ceil((warehouses?.length || 0) / rowsPerPage)}
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

export default Warehouse;
