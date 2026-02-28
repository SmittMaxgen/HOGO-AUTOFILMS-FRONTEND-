// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import {
//   getCategory,
//   createCategory,
//   updateCategory,
//   deleteCategory,
// } from "../../feature/category/categoryThunks";

// import {
//   selectCategoryList,
//   selectCategoryLoading,
// } from "../../feature/category/categorySelector";

// import {
//   Box,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Avatar,
//   Chip,
//   IconButton,
//   Typography,
//   Pagination,
//   Stack,
//   Button,
//   TextField,
//   FormControlLabel,
//   Checkbox,
//   Switch,
//   CircularProgress,
// } from "@mui/material";

// import AddIcon from "@mui/icons-material/Add";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import CategoryIcon from "@mui/icons-material/Category";
// import ImageIcon from "@mui/icons-material/Image";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";

// import Loader from "../../components/commonComponents/Loader";
// import CommonButton from "../../components/commonComponents/CommonButton";
// import CommonLabel from "../../components/commonComponents/CommonLabel";
// import CommonToast from "../../components/commonComponents/Toster";
// import CommonSearchField from "../../components/commonComponents/CommonSearchField";
// import { makeStyles } from "@mui/styles";

// const useStyles = makeStyles(() => ({
//   catHeadRight: {
//     display: "flex",
//     justifyContent: "space-between",
//   },
//   CommonSearchBar: {
//     margin: "10px",
//   },
// }));

// const Category = () => {
//   const classes = useStyles();
//   const dispatch = useDispatch();
//   const categories = useSelector(selectCategoryList);
//   const loading = useSelector(selectCategoryLoading);

//   const [page, setPage] = useState(1);
//   const rowsPerPage = 5;

//   const [isViewing, setIsViewing] = useState(false);
//   const [viewItem, setViewItem] = useState(null);

//   const [isEditing, setIsEditing] = useState(false);
//   const [editId, setEditId] = useState(null);

//   const [form, setForm] = useState({
//     name: "",
//     image: null,
//     order: 1,
//     status: true,
//   });

//   const [errors, setErrors] = useState({});

//   const [searchQuery, setSearchQuery] = useState("");
//   useEffect(() => {
//     dispatch(getCategory());
//   }, [dispatch]);

//   useEffect(() => {
//     const handler = setTimeout(() => {
//       if (searchQuery !== "") {
//         dispatch(getCategory(searchQuery));
//       } else {
//         dispatch(getCategory(""));
//       }
//     }, 500);

//     return () => clearTimeout(handler);
//   }, [searchQuery]);

//   const handleChange = (e) => {
//     const { name, value, type, checked, files } = e.target;

//     if (type === "file") {
//       setForm((prev) => ({ ...prev, [name]: files[0] }));
//     } else if (type === "checkbox") {
//       setForm((prev) => ({ ...prev, [name]: checked }));
//     } else {
//       setForm((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const validate = () => {
//     const temp = {};
//     if (!form.name) temp.name = "Category name is required";
//     // if (!form.image && !editId) temp.image = "Image is required";
//     setErrors(temp);
//     return Object.keys(temp).length === 0;
//   };

//   const resetForm = () => {
//     setForm({
//       name: "",
//       image: null,
//       order: 1,
//       status: true,
//     });
//     setErrors({});
//     setEditId(null);
//     setIsEditing(false);
//   };

//   const handleStatusToggle = (item) => {
//     const data = new FormData();
//     data.append("status", !item.status);

//     dispatch(updateCategory({ id: item.id, data }))
//       .unwrap()
//       .then(() => {
//         dispatch(getCategory(searchQuery));
//         CommonToast(
//           `Category ${!item.status ? "activated" : "deactivated"} successfully`,
//           "success",
//         );
//       })
//       .catch(() => CommonToast("Failed to update status", "error"));
//   };

//   const handleSubmit = () => {
//     if (!validate()) return;

//     const data = new FormData();
//     data.append("name", form.name);
//     if (form.image) data.append("image", form.image);
//     // data.append("order", form.order);
//     data.append("status", form.status);

//     const action = editId
//       ? updateCategory({ id: editId, data })
//       : createCategory(data);

//     dispatch(action)
//       .unwrap()
//       .then(() => {
//         dispatch(getCategory(searchQuery));
//         resetForm();
//         CommonToast(
//           editId
//             ? "Category updated successfully"
//             : "Category created successfully",
//           "success",
//         );
//       })
//       .catch(() =>
//         CommonToast(
//           editId ? "Failed to update category" : "Failed to create category",
//           "error",
//         ),
//       );
//   };

//   const handleView = (item) => {
//     setViewItem(item);
//     setIsViewing(true);
//   };

//   const handleEdit = (item) => {
//     setEditId(item.id);
//     setForm({
//       name: item.name || "",
//       image: null,
//       // order: item.order || 1,
//       status: item.status ?? true,
//     });
//     setIsEditing(true);
//   };

//   const handleDelete = (id) => {
//     if (!window.confirm("Are you sure you want to delete this category?"))
//       return;

//     dispatch(deleteCategory(id))
//       .unwrap()
//       .then(() => {
//         dispatch(getCategory(searchQuery));
//         CommonToast("Category deleted successfully", "success");
//       })
//       .catch(() => CommonToast("Failed to delete category", "error"));
//   };

//   const handleAddCategory = () => {
//     resetForm();
//     setIsEditing(true);
//   };
//   const paginatedData = categories?.data?.slice(
//     (page - 1) * rowsPerPage,
//     page * rowsPerPage,
//   );

//   // if (loading) return <Loader text="Loading categories..." fullScreen={true} />;

//   if (isEditing) {
//     return (
//       <Box display="flex" justifyContent="center" mt={4}>
//         <Box width="100%">
//           <Stack direction="row" alignItems="center" spacing={1} mb={3}>
//             <IconButton onClick={resetForm}>
//               <ArrowBackIcon />
//             </IconButton>
//             <CommonLabel>
//               {editId ? "Edit Category" : "Create Category"}
//             </CommonLabel>
//           </Stack>

//           <Paper sx={{ p: 3 }}>
//             <Stack spacing={2}>
//               <TextField
//                 label="Category Name"
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 error={!!errors.name}
//                 helperText={errors.name}
//                 fullWidth
//                 InputProps={{
//                   startAdornment: <CategoryIcon sx={{ mr: 1 }} />,
//                 }}
//               />

//               {errors.image && (
//                 <Typography color="error">{errors.image}</Typography>
//               )}

//               {form.image && (
//                 <Typography variant="body2">
//                   Selected: {form.image.name}
//                 </Typography>
//               )}

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
//               {/*
//               <Stack direction="row" justifyContent="flex-end" spacing={2}>
//                 <Button onClick={resetForm}>Cancel</Button>
//                 <Button variant="contained" onClick={handleSubmit}>
//                   Save
//                 </Button>
//               </Stack> */}
//               <Stack direction="row" justifyContent="flex-end" spacing={2}>
//                 <CommonButton variant="outlined" onClick={resetForm}>
//                   Cancel
//                 </CommonButton>
//                 <CommonButton
//                   variant="contained"
//                   onClick={handleSubmit}
//                   disabled={loading || loading}
//                 >
//                   {loading || loading ? "Saving..." : "Save"}
//                 </CommonButton>
//               </Stack>
//             </Stack>
//           </Paper>
//         </Box>
//       </Box>
//     );
//   }
//   if (isViewing && viewItem) {
//     return (
//       <Box display="flex" justifyContent="center" mt={4}>
//         <Box width="100%">
//           <Stack direction="row" alignItems="center" spacing={1} mb={3}>
//             <IconButton
//               onClick={() => {
//                 setIsViewing(false);
//                 setViewItem(null);
//               }}
//             >
//               <ArrowBackIcon />
//             </IconButton>
//             <CommonLabel>View Category</CommonLabel>
//           </Stack>

//           <Paper sx={{ p: 3 }}>
//             <Stack spacing={2}>
//               <TextField
//                 label="Category Name"
//                 fullWidth
//                 value={viewItem.name}
//                 InputProps={{ readOnly: true }}
//               />
//               {/*
//               <TextField
//                 label="Display Order"
//                 fullWidth
//                 value={viewItem.order}
//                 InputProps={{ readOnly: true }}
//               /> */}

//               <FormControlLabel
//                 control={<Checkbox checked={viewItem.status} disabled />}
//                 label="Active"
//               />

//               {viewItem.image && (
//                 <Box mt={2}>
//                   <Typography variant="subtitle2">Category Image</Typography>
//                   <Avatar
//                     src={`https://hogofilm.pythonanywhere.com/${viewItem.image}`}
//                     variant="rounded"
//                     sx={{ width: 120, height: 120, mt: 1 }}
//                   />
//                 </Box>
//               )}
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
//           Categories
//         </Typography>
//         <Box className={classes.catHeadRight}>
//           <CommonButton
//             variant="contained"
//             startIcon={<AddIcon />}
//             onClick={() => handleAddCategory()}
//           >
//             Add Category
//           </CommonButton>
//         </Box>
//       </Stack>

//       <TableContainer component={Paper}>
//         <Box sx={{ display: "flex" }}>
//           <CommonSearchField
//             className={classes.CommonSearchBar}
//             value={searchQuery}
//             placeholder="Search by name.."
//             onChange={(value) => setSearchQuery(value)}
//           />
//         </Box>
//         <Table>
//           <TableHead>
//             <TableRow>
//               {[
//                 "Sr",
//                 // "Image",
//                 "Name",
//                 "Status",
//                 "Actions",
//               ].map((h) => (
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
//                   <CircularProgress size={30} /> Loading categories...
//                 </TableCell>
//               </TableRow>
//             )}
//             {!loading &&
//               paginatedData?.map((item, index) => (
//                 <TableRow key={item.id} hover>
//                   <TableCell sx={{ fontWeight: 700 }}>
//                     {(page - 1) * rowsPerPage + index + 1}
//                   </TableCell>

//                   {/* <TableCell>
//                   <Avatar
//                     src={`https://hogofilm.pythonanywhere.com/${item?.image}`}
//                     variant="rounded"
//                     sx={{ width: 52, height: 52 }}
//                   />
//                 </TableCell> */}

//                   <TableCell>
//                     <Typography>{item.name}</Typography>
//                   </TableCell>

//                   <TableCell>
//                     <Box display="flex" alignItems="center" gap={1}>
//                       <Switch
//                         checked={item.status} // true = On, false = Off
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
//                     <IconButton size="small" onClick={() => handleView(item)}>
//                       <VisibilityIcon />
//                     </IconButton>
//                     <IconButton
//                       size="small"
//                       color="warning"
//                       onClick={() => handleEdit(item)}
//                     >
//                       <EditIcon />
//                     </IconButton>

//                     <IconButton
//                       size="small"
//                       color="error"
//                       onClick={() => handleDelete(item.id)}
//                     >
//                       <DeleteIcon />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}

//             {categories?.data?.length === 0 && (
//               <TableRow>
//                 <TableCell colSpan={5} align="center">
//                   No categories found
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Stack alignItems="flex-end" mt={3}>
//         <Pagination
//           count={Math.ceil(categories?.data?.length / rowsPerPage)}
//           page={page}
//           onChange={(_, v) => setPage(v)}
//         />
//       </Stack>
//     </Box>
//   );
// };

// export default Category;
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../feature/category/categoryThunks";

import {
  selectCategoryList,
  selectCategoryLoading,
} from "../../feature/category/categorySelector";

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Typography,
  Pagination,
  Stack,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Switch,
  CircularProgress,
  Divider,
  InputAdornment,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CategoryIcon from "@mui/icons-material/Category";
import ImageIcon from "@mui/icons-material/Image";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";

import Loader from "../../components/commonComponents/Loader";
import CommonButton from "../../components/commonComponents/CommonButton";
import CommonLabel from "../../components/commonComponents/CommonLabel";
import CommonToast from "../../components/commonComponents/Toster";
import CommonSearchField from "../../components/commonComponents/CommonSearchField";
import { makeStyles } from "@mui/styles";

// ─── Shared helpers ────────────────────────────────────────────────────────────

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

// ─── Styles ────────────────────────────────────────────────────────────────────

const useStyles = makeStyles(() => ({
  catHeadRight: {
    display: "flex",
    justifyContent: "space-between",
  },
  CommonSearchBar: {
    margin: "10px",
  },
}));

// ─── Main Component ────────────────────────────────────────────────────────────

const Category = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const categories = useSelector(selectCategoryList);
  const loading = useSelector(selectCategoryLoading);

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [isViewing, setIsViewing] = useState(false);
  const [viewItem, setViewItem] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    image: null,
    order: 1,
    status: true,
  });

  const [errors, setErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery !== "") {
        dispatch(getCategory(searchQuery));
      } else {
        dispatch(getCategory(""));
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const temp = {};
    if (!form.name) temp.name = "Category name is required";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const resetForm = () => {
    setForm({ name: "", image: null, order: 1, status: true });
    setErrors({});
    setEditId(null);
    setIsEditing(false);
  };

  const handleStatusToggle = (item) => {
    const data = new FormData();
    data.append("status", !item.status);
    dispatch(updateCategory({ id: item.id, data }))
      .unwrap()
      .then(() => {
        dispatch(getCategory(searchQuery));
        CommonToast(
          `Category ${!item.status ? "activated" : "deactivated"} successfully`,
          "success",
        );
      })
      .catch(() => CommonToast("Failed to update status", "error"));
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const data = new FormData();
    data.append("name", form.name);
    if (form.image) data.append("image", form.image);
    data.append("status", form.status);
    const action = editId
      ? updateCategory({ id: editId, data })
      : createCategory(data);
    dispatch(action)
      .unwrap()
      .then(() => {
        dispatch(getCategory(searchQuery));
        resetForm();
        CommonToast(
          editId
            ? "Category updated successfully"
            : "Category created successfully",
          "success",
        );
      })
      .catch(() =>
        CommonToast(
          editId ? "Failed to update category" : "Failed to create category",
          "error",
        ),
      );
  };

  const handleView = (item) => {
    setViewItem(item);
    setIsViewing(true);
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({
      name: item.name || "",
      image: null,
      status: item.status ?? true,
    });
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    dispatch(deleteCategory(id))
      .unwrap()
      .then(() => {
        dispatch(getCategory(searchQuery));
        CommonToast("Category deleted successfully", "success");
      })
      .catch(() => CommonToast("Failed to delete category", "error"));
  };

  const handleAddCategory = () => {
    resetForm();
    setIsEditing(true);
  };

  const paginatedData = categories?.data?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  // ── Create / Edit View ───────────────────────────────────────────────────────
  if (isEditing) {
    return (
      <Box mt={4}>
        <PageHeader
          title={editId ? "Edit Category" : "Create Category"}
          onBack={resetForm}
        />

        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid #f0f0f0",
          }}
        >
          {/* Form header strip */}
          <Box
            sx={{
              px: 3,
              py: 2,
              bgcolor: "#fafafa",
              borderBottom: "1px solid #ebebeb",
            }}
          >
            <SectionHeading title="Category Information" />
          </Box>

          <Box px={4} py={4}>
            <Stack spacing={3}>
              <TextField
                label="Category Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CategoryIcon sx={{ color: "#D20000" }} />
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

              {/* Image Upload */}
              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  mb={1}
                  color="text.secondary"
                >
                  Category Image (optional)
                </Typography>
                <Box
                  component="label"
                  htmlFor="category-image-upload"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    px: 2,
                    py: 1.5,
                    border: "1.5px dashed #D20000",
                    borderRadius: 2,
                    bgcolor: "#fff5f5",
                    cursor: "pointer",
                    "&:hover": { bgcolor: "#ffe8e8" },
                    transition: "background 0.2s",
                  }}
                >
                  <ImageIcon sx={{ color: "#D20000" }} />
                  <Typography variant="body2" color="#D20000" fontWeight={500}>
                    {form.image ? form.image.name : "Click to upload image"}
                  </Typography>
                  <input
                    id="category-image-upload"
                    type="file"
                    name="image"
                    accept="image/*"
                    hidden
                    onChange={handleChange}
                  />
                </Box>
                {errors.image && (
                  <Typography color="error" variant="caption" mt={0.5}>
                    {errors.image}
                  </Typography>
                )}
              </Box>

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
                <CommonButton variant="outlined" onClick={resetForm}>
                  Cancel
                </CommonButton>
                <CommonButton
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                  sx={{
                    bgcolor: "#D20000",
                    "&:hover": { bgcolor: "#a80000" },
                    fontWeight: 700,
                  }}
                >
                  {loading ? "Saving..." : "Save Category"}
                </CommonButton>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Box>
    );
  }

  // ── View Detail ──────────────────────────────────────────────────────────────
  if (isViewing && viewItem) {
    return (
      <Box mt={4}>
        <PageHeader
          title="Category Details"
          onBack={() => {
            setIsViewing(false);
            setViewItem(null);
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
          {/* Top identity strip */}
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
            {viewItem.image ? (
              <Avatar
                src={`https://hogofilm.pythonanywhere.com/${viewItem.image}`}
                variant="rounded"
                sx={{
                  width: 90,
                  height: 90,
                  border: "3px solid #D20000",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  flexShrink: 0,
                }}
              />
            ) : (
              <Avatar
                variant="rounded"
                sx={{
                  width: 90,
                  height: 90,
                  bgcolor: "#ebebeb",
                  color: "#aaa",
                  fontSize: 12,
                  flexShrink: 0,
                }}
              >
                No Image
              </Avatar>
            )}
            <Box>
              <Typography variant="h5" fontWeight={700} color="#1a1a1a">
                {viewItem.name}
              </Typography>
              <Box mt={1}>
                <Chip
                  label={viewItem.status ? "Active" : "Inactive"}
                  color={viewItem.status ? "success" : "default"}
                  size="small"
                  sx={{ fontWeight: 700, borderRadius: 1 }}
                />
              </Box>
            </Box>
          </Box>

          <Box px={4} py={3}>
            <SectionHeading title="Category Information" />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
              {[
                { label: "Category Name", value: viewItem.name },
                {
                  label: "Status",
                  value: viewItem.status ? "Active" : "Inactive",
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
            Categories
          </Typography>
        </Box>

        <CommonButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddCategory}
          sx={{
            bgcolor: "#D20000",
            "&:hover": { bgcolor: "#a80000" },
            fontWeight: 700,
            borderRadius: 1.5,
            px: 2.5,
            boxShadow: "0 4px 12px rgba(210,0,0,0.3)",
          }}
        >
          Add Category
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
            className={classes.CommonSearchBar}
            value={searchQuery}
            placeholder="Search by name..."
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
                {["Sr", "Name", "Status", "Actions"].map((h) => (
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
                        Loading categories...
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

                    {/* Name */}
                    <TableCell>
                      <Typography
                        fontWeight={600}
                        color="#1a1a1a"
                        fontSize={14}
                      >
                        {item.name}
                      </Typography>
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

              {!loading && categories?.data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      gap={1}
                    >
                      <CategoryIcon sx={{ fontSize: 40, color: "#e0e0e0" }} />
                      <Typography color="text.secondary" fontWeight={500}>
                        No categories found
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
            count={Math.ceil((categories?.data?.length || 0) / rowsPerPage)}
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

export default Category;
