// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getMaterials,
//   createMaterials,
//   updateMaterials,
//   deleteMaterials,
// } from "../../feature/material/materialThunks";
// import {
//   selectMaterials,
//   selectMaterialLoading,
//   selectCreateMaterialLoading,
//   selectCreateMaterialSuccess,
//   selectUpdateMaterialLoading,
// } from "../../feature/material/materialSelector";

// import {
//   Box,
//   Paper,
//   Stack,
//   Typography,
//   Button,
//   IconButton,
//   TextField,
//   FormControlLabel,
//   Checkbox,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   Pagination,
//   Switch,
//   CircularProgress,
// } from "@mui/material";

// import AddIcon from "@mui/icons-material/Add";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import VisibilityIcon from "@mui/icons-material/Visibility";

// import Loader from "../../components/commonComponents/Loader";
// import CommonButton from "../../components/commonComponents/CommonButton";
// import CommonLabel from "../../components/commonComponents/CommonLabel";
// import CommonToast from "../../components/commonComponents/Toster";
// import CommonSearchField from "../../components/commonComponents/CommonSearchField";
// const Material = () => {
//   const dispatch = useDispatch();

//   const materials = useSelector(selectMaterials);
//   const loading = useSelector(selectMaterialLoading);
//   const createLoading = useSelector(selectCreateMaterialLoading);
//   const updateLoading = useSelector(selectUpdateMaterialLoading);
//   const createSuccess = useSelector(selectCreateMaterialSuccess);

//   const [page, setPage] = useState(1);
//   const rowsPerPage = 5;

//   const [isEditing, setIsEditing] = useState(false);
//   const [editId, setEditId] = useState(null);

//   const [isViewing, setIsViewing] = useState(false);
//   const [viewMaterial, setViewMaterial] = useState(null);

//   const [form, setForm] = useState({ title: "", status: true });
//   const [errors, setErrors] = useState({});

//   const [searchQuery, setSearchQuery] = useState("");

//   // useEffect(() => {
//   //   dispatch(getMaterials());
//   // }, [dispatch]);
//   useEffect(() => {
//     const payload = {};

//     if (searchQuery) {
//       payload.title = searchQuery;
//     }

//     dispatch(getMaterials(payload));
//   }, [dispatch, searchQuery]);

//   useEffect(() => {
//     if (createSuccess) {
//       dispatch(getMaterials());
//       handleReset();
//     }
//   }, [createSuccess, dispatch]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const validate = () => {
//     const temp = {};
//     if (!form.title) temp.title = "Material name is required";
//     setErrors(temp);
//     return Object.keys(temp).length === 0;
//   };

//   const handleStatusToggle = (item) => {
//     const data = new FormData();
//     data.append("status", !item.status);

//     dispatch(updateMaterials({ id: item.id, data }))
//       .unwrap()
//       .then(() => {
//         dispatch(getMaterials());
//         CommonToast(
//           `Material ${!item.status ? "activated" : "deactivated"} successfully`,
//           "success",
//         );
//       })
//       .catch(() => CommonToast("Failed to update status", "error"));
//   };

//   const handleSubmit = () => {
//     if (!validate()) return;

//     if (isEditing && editId) {
//       dispatch(updateMaterials({ id: editId, data: form }))
//         .unwrap()
//         .then(() => {
//           dispatch(getMaterials());
//           CommonToast("Material updated successfully", "success");
//           handleReset();
//         })
//         .catch(() => CommonToast("Failed to update material", "error"));
//     } else {
//       dispatch(createMaterials(form))
//         .unwrap()
//         .then(() => {
//           dispatch(getMaterials());
//           CommonToast("Material created successfully", "success");
//           handleReset();
//         })
//         .catch(() => CommonToast("Failed to create material", "error"));
//     }
//   };

//   const handleView = (material) => {
//     setViewMaterial(material);
//     setIsViewing(true);
//   };

//   const handleEdit = (item) => {
//     setIsEditing(true);
//     setEditId(item.id);
//     setForm({ title: item.title, status: item.status });
//   };

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this material?")) {
//       dispatch(deleteMaterials(id))
//         .unwrap()
//         .then(() => {
//           dispatch(getMaterials());
//           CommonToast("Material deleted successfully", "success");
//         })
//         .catch(() => CommonToast("Failed to delete material", "error"));
//     }
//   };

//   const handleReset = () => {
//     setForm({ title: "", status: true });
//     setErrors({});
//     setEditId(null);
//     setIsEditing(false);
//   };

//   const handleAddMaterial = () => {
//     handleReset();
//     setIsEditing(true);
//   };

//   const paginatedData = materials?.slice(
//     (page - 1) * rowsPerPage,
//     page * rowsPerPage,
//   );

//   // if (loading) return <Loader text="Loading materials..." fullScreen={true} />;

//   if (isEditing) {
//     return (
//       <Box display="flex" justifyContent="center" mt={4}>
//         <Box width="100%">
//           <Stack direction="row" alignItems="center" spacing={1} mb={3}>
//             <IconButton onClick={handleReset}>
//               <ArrowBackIcon />
//             </IconButton>
//             <CommonLabel>
//               {editId ? "Edit Material" : "Create Material"}
//             </CommonLabel>
//           </Stack>

//           <Paper sx={{ p: 3 }}>
//             <Stack spacing={2}>
//               <TextField
//                 label="Material Name"
//                 name="title"
//                 value={form.title}
//                 onChange={handleChange}
//                 error={!!errors.title}
//                 helperText={errors.title}
//                 fullWidth
//               />

//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={form.status}
//                     name="status"
//                     onChange={handleChange}
//                   />
//                 }
//                 label="Active"
//               />

//               {/* <Stack direction="row" justifyContent="flex-end" spacing={2}>
//                 <Button onClick={handleReset}>Cancel</Button>
//                 <Button
//                   variant="contained"
//                   onClick={handleSubmit}
//                   disabled={createLoading || updateLoading}
//                 >
//                   {createLoading || updateLoading
//                     ? "Saving..."
//                     : editId
//                       ? "Update"
//                       : "Save"}
//                 </Button>
//               </Stack> */}
//               <Stack direction="row" justifyContent="flex-end" spacing={2}>
//                 <CommonButton variant="outlined" onClick={handleReset}>
//                   Cancel
//                 </CommonButton>
//                 <CommonButton
//                   variant="contained"
//                   onClick={handleSubmit}
//                   disabled={updateLoading || updateLoading}
//                 >
//                   {updateLoading || updateLoading ? "Saving..." : "Save"}
//                 </CommonButton>
//               </Stack>
//             </Stack>
//           </Paper>
//         </Box>
//       </Box>
//     );
//   }
//   if (isViewing && viewMaterial) {
//     return (
//       <Box display="flex" justifyContent="center" mt={4}>
//         <Box width="100%">
//           {/* Header */}
//           <Stack direction="row" alignItems="center" spacing={1} mb={3}>
//             <IconButton
//               onClick={() => {
//                 setIsViewing(false);
//                 setViewMaterial(null);
//               }}
//             >
//               <ArrowBackIcon />
//             </IconButton>
//             <CommonLabel>View Material</CommonLabel>
//           </Stack>

//           {/* Read-only form */}
//           <Paper sx={{ p: 3 }}>
//             <Stack spacing={2}>
//               <TextField
//                 label="Material Name"
//                 value={viewMaterial.title}
//                 fullWidth
//                 InputProps={{ readOnly: true }}
//               />

//               <FormControlLabel
//                 control={<Checkbox checked={viewMaterial.status} disabled />}
//                 label="Active"
//               />
//             </Stack>
//           </Paper>
//         </Box>
//       </Box>
//     );
//   }

//   return (
//     <Box>
//       <Stack
//         direction="row"
//         justifyContent="space-between"
//         alignItems="center"
//         mb={3}
//       >
//         <Typography
//           variant="h4"
//           fontWeight={700}
//           sx={{ color: "#7E7E7E", mb: 2 }}
//         >
//           Materials
//         </Typography>
//         <CommonButton
//           variant="contained"
//           startIcon={<AddIcon />}
//           onClick={() => handleAddMaterial()}
//         >
//           Add Materials
//         </CommonButton>
//       </Stack>

//       <TableContainer component={Paper}>
//         <Box sx={{ display: "flex" }}>
//           <CommonSearchField
//             value={searchQuery}
//             placeholder="Search by material name.."
//             onChange={(value) => setSearchQuery(value)}
//           />
//         </Box>
//         <Table>
//           <TableHead>
//             <TableRow>
//               {["Sr", "Material Name", "Status", "Actions"].map((h) => (
//                 <TableCell key={h} sx={{ fontWeight: 700 }}>
//                   {h}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {loading && (
//               <TableRow>
//                 <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
//                   <CircularProgress size={28} />
//                   <Typography variant="body2" mt={1}>
//                     Loading materials...
//                   </Typography>
//                 </TableCell>
//               </TableRow>
//             )}

//             {!loading &&
//               paginatedData?.map((item, index) => (
//                 <TableRow key={item.id} hover>
//                   <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
//                   <TableCell>
//                     <Typography>{item.title}</Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Box display="flex" alignItems="center" gap={1}>
//                       <Switch
//                         checked={item.status} // true = Active, false = Inactive
//                         onChange={() => handleStatusToggle(item)}
//                         color="success"
//                         size="small"
//                         sx={{
//                           "& .MuiSwitch-switchBase.Mui-checked": {
//                             color: "success.main",
//                           },
//                           "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
//                             {
//                               backgroundColor: "success.light",
//                             },
//                         }}
//                       />
//                       <Typography
//                         variant="body2"
//                         color={item.status ? "success.main" : "text.secondary"}
//                       >
//                         {item.status ? "Active" : "Inactive"}
//                       </Typography>
//                     </Box>
//                   </TableCell>
//                   <TableCell>
//                     <IconButton
//                       color="primary"
//                       onClick={() => handleView(item)}
//                     >
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

//             {materials?.length === 0 && (
//               <TableRow>
//                 <TableCell colSpan={4} align="center">
//                   No materials found
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Stack alignItems="flex-end" mt={3}>
//         <Pagination
//           count={Math.ceil((materials?.length || 0) / rowsPerPage)}
//           page={page}
//           onChange={(_, v) => setPage(v)}
//           color="primary"
//         />
//       </Stack>
//     </Box>
//   );
// };

// export default Material;
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getMaterials,
  createMaterials,
  updateMaterials,
  deleteMaterials,
} from "../../feature/material/materialThunks";
import {
  selectMaterials,
  selectMaterialLoading,
  selectCreateMaterialLoading,
  selectCreateMaterialSuccess,
  selectUpdateMaterialLoading,
} from "../../feature/material/materialSelector";

import {
  Box,
  Paper,
  Stack,
  Typography,
  IconButton,
  TextField,
  FormControlLabel,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Pagination,
  Switch,
  CircularProgress,
  Divider,
  InputAdornment,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LayersIcon from "@mui/icons-material/Layers";

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

// ─── Main Component ────────────────────────────────────────────────────────────

const Material = () => {
  const dispatch = useDispatch();

  const materials = useSelector(selectMaterials);
  const loading = useSelector(selectMaterialLoading);
  const createLoading = useSelector(selectCreateMaterialLoading);
  const updateLoading = useSelector(selectUpdateMaterialLoading);
  const createSuccess = useSelector(selectCreateMaterialSuccess);

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [isViewing, setIsViewing] = useState(false);
  const [viewMaterial, setViewMaterial] = useState(null);

  const [form, setForm] = useState({ title: "", status: true });
  const [errors, setErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const payload = {};
    if (searchQuery) payload.title = searchQuery;
    dispatch(getMaterials(payload));
  }, [dispatch, searchQuery]);

  useEffect(() => {
    if (createSuccess) {
      dispatch(getMaterials());
      handleReset();
    }
  }, [createSuccess, dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    const temp = {};
    if (!form.title) temp.title = "Material name is required";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleStatusToggle = (item) => {
    const data = new FormData();
    data.append("status", !item.status);
    dispatch(updateMaterials({ id: item.id, data }))
      .unwrap()
      .then(() => {
        dispatch(getMaterials());
        CommonToast(
          `Material ${!item.status ? "activated" : "deactivated"} successfully`,
          "success",
        );
      })
      .catch(() => CommonToast("Failed to update status", "error"));
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (isEditing && editId) {
      dispatch(updateMaterials({ id: editId, data: form }))
        .unwrap()
        .then(() => {
          dispatch(getMaterials());
          CommonToast("Material updated successfully", "success");
          handleReset();
        })
        .catch(() => CommonToast("Failed to update material", "error"));
    } else {
      dispatch(createMaterials(form))
        .unwrap()
        .then(() => {
          dispatch(getMaterials());
          CommonToast("Material created successfully", "success");
          handleReset();
        })
        .catch(() => CommonToast("Failed to create material", "error"));
    }
  };

  const handleView = (material) => {
    setViewMaterial(material);
    setIsViewing(true);
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditId(item.id);
    setForm({ title: item.title, status: item.status });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this material?")) {
      dispatch(deleteMaterials(id))
        .unwrap()
        .then(() => {
          dispatch(getMaterials());
          CommonToast("Material deleted successfully", "success");
        })
        .catch(() => CommonToast("Failed to delete material", "error"));
    }
  };

  const handleReset = () => {
    setForm({ title: "", status: true });
    setErrors({});
    setEditId(null);
    setIsEditing(false);
  };

  const handleAddMaterial = () => {
    handleReset();
    setIsEditing(true);
  };

  const paginatedData = materials?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  // ── Create / Edit View ───────────────────────────────────────────────────────
  if (isEditing) {
    return (
      <Box mt={4}>
        <PageHeader
          title={editId ? "Edit Material" : "Create Material"}
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
            <SectionHeading title="Material Information" />
          </Box>

          <Box px={4} py={4}>
            <Stack spacing={3}>
              <TextField
                label="Material Name"
                name="title"
                value={form.title}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LayersIcon sx={{ color: "#D20000" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                    borderColor: "#D20000",
                  },
                  "& label.Mui-focused": { color: "#D20000" },
                }}
              />

              {/* Status */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  px: 2,
                  py: 1.5,
                  bgcolor: "#fafafa",
                  border: "1px solid #ebebeb",
                  borderRadius: 2,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form.status}
                      name="status"
                      onChange={handleChange}
                      sx={{
                        color: "#D20000",
                        "&.Mui-checked": { color: "#D20000" },
                      }}
                    />
                  }
                  label={
                    <Typography fontWeight={600} variant="body2">
                      Mark as Active
                    </Typography>
                  }
                />
                <Chip
                  label={form.status ? "Active" : "Inactive"}
                  color={form.status ? "success" : "default"}
                  size="small"
                  sx={{ fontWeight: 700, borderRadius: 1 }}
                />
              </Box>

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
                    "&:hover": { bgcolor: "#a80000" },
                    fontWeight: 700,
                  }}
                >
                  {createLoading || updateLoading
                    ? "Saving..."
                    : editId
                      ? "Update Material"
                      : "Save Material"}
                </CommonButton>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Box>
    );
  }

  // ── View Detail ──────────────────────────────────────────────────────────────
  if (isViewing && viewMaterial) {
    return (
      <Box mt={4}>
        <PageHeader
          title="Material Details"
          onBack={() => {
            setIsViewing(false);
            setViewMaterial(null);
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
              <LayersIcon sx={{ fontSize: 32, color: "#D20000" }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700} color="#1a1a1a">
                {viewMaterial.title}
              </Typography>
              <Box mt={1}>
                <Chip
                  label={viewMaterial.status ? "Active" : "Inactive"}
                  color={viewMaterial.status ? "success" : "default"}
                  size="small"
                  sx={{ fontWeight: 700, borderRadius: 1 }}
                />
              </Box>
            </Box>
          </Box>

          <Box px={4} py={3}>
            <SectionHeading title="Material Information" />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
              {[
                { label: "Material Name", value: viewMaterial.title },
                {
                  label: "Status",
                  value: viewMaterial.status ? "Active" : "Inactive",
                },
              ].map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    p: 2,
                    bgcolor: "#fafafa",
                    border: "1px solid #ebebeb",
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={700}
                    display="block"
                    mb={0.5}
                  >
                    {item.label}
                  </Typography>
                  <Typography variant="body1" fontWeight={600} color="#1a1a1a">
                    {item.value || "N/A"}
                  </Typography>
                </Box>
              ))}
            </Box>
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
            Materials
          </Typography>
        </Box>

        <CommonButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddMaterial}
          sx={{
            bgcolor: "#D20000",
            "&:hover": { bgcolor: "#a80000" },
            fontWeight: 700,
            borderRadius: 1.5,
            px: 2.5,
            boxShadow: "0 4px 12px rgba(210,0,0,0.3)",
          }}
        >
          Add Material
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
        {/* Search bar */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            bgcolor: "#fafafa",
            borderBottom: "1px solid #ebebeb",
            display: "flex",
            alignItems: "center",
          }}
        >
          <CommonSearchField
            value={searchQuery}
            placeholder="Search by material name..."
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
                {["Sr", "Material Name", "Status", "Actions"].map((h) => (
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
                  <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      gap={1}
                    >
                      <CircularProgress size={28} sx={{ color: "#D20000" }} />
                      <Typography variant="body2" color="text.secondary">
                        Loading materials...
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
                      sx={{ fontWeight: 700, color: "#D20000", width: 60 }}
                    >
                      {(page - 1) * rowsPerPage + index + 1}
                    </TableCell>

                    {/* Material Name */}
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1.5}>
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
                          }}
                        >
                          <LayersIcon sx={{ fontSize: 16, color: "#D20000" }} />
                        </Box>
                        <Typography
                          fontWeight={600}
                          color="#1a1a1a"
                          fontSize={14}
                        >
                          {item.title}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Switch
                          checked={item.status}
                          onChange={() => handleStatusToggle(item)}
                          color="success"
                          size="small"
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: "success.main",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                              {
                                backgroundColor: "success.light",
                              },
                          }}
                        />
                        <Chip
                          label={item.status ? "Active" : "Inactive"}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            borderRadius: 1,
                            fontSize: 11,
                            bgcolor: item.status ? "#e8f5e9" : "#f5f5f5",
                            color: item.status ? "#2e7d32" : "#757575",
                            border: `1px solid ${item.status ? "#c8e6c9" : "#e0e0e0"}`,
                          }}
                        />
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

              {!loading && materials?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      gap={1}
                    >
                      <LayersIcon sx={{ fontSize: 40, color: "#e0e0e0" }} />
                      <Typography color="text.secondary" fontWeight={500}>
                        No materials found
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
            count={Math.ceil((materials?.length || 0) / rowsPerPage)}
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
    </Box>
  );
};

export default Material;
