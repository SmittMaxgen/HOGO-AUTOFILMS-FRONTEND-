// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getBanners, createBanner } from "../../feature/banner/bannerThunks";
// import {
//   selectBannerList,
//   selectBannerLoading,
// } from "../../feature/banner/bannerSelector";
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
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   FormControlLabel,
//   Checkbox,
// } from "@mui/material";

// import VisibilityIcon from "@mui/icons-material/Visibility";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";

// const Banner = () => {
//   const dispatch = useDispatch();
//   const banners = useSelector(selectBannerList);
//   const loading = useSelector(selectBannerLoading);

//   const [page, setPage] = useState(1);
//   const rowsPerPage = 5;

//   const [open, setOpen] = useState(false);

//   // Form state
//   const [form, setForm] = useState({
//     title: "",
//     image: null, // file
//     CTA_text: "",
//     CTA_link: "",
//     order: 1,
//     status: true,
//   });

//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     dispatch(getBanners());
//   }, [dispatch]);

//   const handleOpen = () => setOpen(true);
//   const handleClose = () => {
//     setOpen(false);
//     setForm({
//       title: "",
//       image: null,
//       CTA_text: "",
//       CTA_link: "",
//       order: 1,
//       status: true,
//     });
//     setErrors({});
//   };

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
//     if (!form.title) temp.title = "Required";
//     if (!form.image) temp.image = "Image file required";
//     setErrors(temp);
//     return Object.keys(temp).length === 0;
//   };

//   const handleSubmit = () => {
//     if (!validate()) return;

//     const data = new FormData();
//     data.append("title", form.title);
//     data.append("image", form.image); // file
//     data.append("CTA_text", form.CTA_text);
//     data.append("CTA_link", form.CTA_link);
//     data.append("order", form.order);
//     data.append("status", form.status);

//     // Dispatch createBanner and then refresh the banner list
//     dispatch(createBanner(data))
//       .unwrap() // important: unwrap returns a real promise and catches errors
//       .then(() => {
//         handleClose(); // close the dialog
//         dispatch(getBanners()); // refresh the table
//       })
//       .catch((err) => {
//         console.error("Failed to create banner:", err);
//       });
//   };

//   const paginatedData = banners.slice(
//     (page - 1) * rowsPerPage,
//     page * rowsPerPage,
//   );

//   return (
//     <Box>
//       <Stack
//         direction="row"
//         justifyContent="space-between"
//         alignItems="center"
//         mb={3}
//       >
//         <Typography variant="h4">Banners</Typography>
//         <Button variant="contained" color="primary" onClick={handleOpen}>
//           Create Banner
//         </Button>
//       </Stack>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Sr.No</TableCell>
//               <TableCell>Image</TableCell>
//               <TableCell>Title</TableCell>
//               <TableCell>CTA Text</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell align="center">Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {paginatedData.map((item, index) => (
//               <TableRow key={item.id}>
//                 <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
//                 <TableCell>
//                   <Avatar
//                     src={item.image}
//                     variant="rounded"
//                     sx={{ width: 80, height: 45 }}
//                   />
//                 </TableCell>
//                 <TableCell>{item.title}</TableCell>
//                 <TableCell>{item.CTA_text}</TableCell>
//                 <TableCell>
//                   <Chip
//                     label={item.status ? "Active" : "Inactive"}
//                     color={item.status ? "success" : "default"}
//                     size="small"
//                   />
//                 </TableCell>
//                 <TableCell align="center">
//                   <IconButton color="primary">
//                     <VisibilityIcon />
//                   </IconButton>
//                   <IconButton color="warning">
//                     <EditIcon />
//                   </IconButton>
//                   <IconButton color="error">
//                     <DeleteIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//             {banners.length === 0 && (
//               <TableRow>
//                 <TableCell colSpan={6} align="center">
//                   No banners found
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Stack alignItems="flex-end" mt={3}>
//         <Pagination
//           count={Math.ceil(banners.length / rowsPerPage)}
//           page={page}
//           onChange={(_, value) => setPage(value)}
//           color="primary"
//         />
//       </Stack>

//       {/* Create Banner Dialog */}
//       <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
//         <DialogTitle>Create Banner</DialogTitle>
//         <DialogContent>
//           <Stack spacing={2} mt={1}>
//             <TextField
//               label="Title"
//               name="title"
//               value={form.title}
//               onChange={handleChange}
//               error={!!errors.title}
//               helperText={errors.title}
//               fullWidth
//             />
//             <Button variant="outlined" component="label">
//               Upload Image
//               <input
//                 type="file"
//                 name="image"
//                 accept="image/*"
//                 hidden
//                 onChange={handleChange}
//               />
//             </Button>
//             {errors.image && (
//               <Typography color="error">{errors.image}</Typography>
//             )}
//             {form.image && <Typography>Selected: {form.image.name}</Typography>}

//             <TextField
//               label="CTA Text"
//               name="CTA_text"
//               value={form.CTA_text}
//               onChange={handleChange}
//               fullWidth
//             />
//             <TextField
//               label="CTA Link"
//               name="CTA_link"
//               value={form.CTA_link}
//               onChange={handleChange}
//               fullWidth
//             />
//             <TextField
//               label="Order"
//               type="number"
//               name="order"
//               value={form.order}
//               onChange={handleChange}
//               fullWidth
//             />
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={form.status}
//                   name="status"
//                   onChange={handleChange}
//                 />
//               }
//               label="Active"
//             />
//           </Stack>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose}>Cancel</Button>
//           <Button onClick={handleSubmit} variant="contained">
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default Banner;
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from "../../feature/banner/bannerThunks";
import {
  selectBannerList,
  selectBannerLoading,
} from "../../feature/banner/bannerSelector";

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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Banner = () => {
  const dispatch = useDispatch();
  const banners = useSelector(selectBannerList);
  const loading = useSelector(selectBannerLoading);

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null); // track which banner is being edited

  // Form state
  const [form, setForm] = useState({
    title: "",
    image: null, // file
    CTA_text: "",
    CTA_link: "",
    order: 1,
    status: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getBanners());
  }, [dispatch]);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setEditId(null); // reset edit id
    setForm({
      title: "",
      image: null,
      CTA_text: "",
      CTA_link: "",
      order: 1,
      status: true,
    });
    setErrors({});
  };

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
    if (!form.title) temp.title = "Required";
    if (!form.image && !editId) temp.image = "Image file required"; // image required only if creating
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const data = new FormData();
    data.append("title", form.title);
    if (form.image) data.append("image", form.image); // only append if new file is selected
    data.append("CTA_text", form.CTA_text);
    data.append("CTA_link", form.CTA_link);
    data.append("order", form.order);
    data.append("status", form.status);

    if (editId) {
      // Update existing banner
      dispatch(updateBanner({ id: editId, data }))
        .unwrap()
        .then(() => {
          handleClose();
          dispatch(getBanners());
        })
        .catch((err) => console.error("Failed to update banner:", err));
    } else {
      // Create new banner
      dispatch(createBanner(data))
        .unwrap()
        .then(() => {
          handleClose();
          dispatch(getBanners());
        })
        .catch((err) => console.error("Failed to create banner:", err));
    }
  };

  const handleEdit = (banner) => {
    setEditId(banner.id);
    setForm({
      title: banner.title || "",
      image: null, // leave null unless user selects a new image
      CTA_text: banner.CTA_text || "",
      CTA_link: banner.CTA_link || "",
      order: banner.order || 1,
      status: banner.status || true,
    });
    setErrors({});
    setOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      dispatch(deleteBanner(id))
        .unwrap()
        .then(() => {
          dispatch(getBanners()); // refresh table
        })
        .catch((err) => console.error("Failed to delete banner:", err));
    }
  };

  const paginatedData = banners.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  if (loading) return <Typography>Loading banners...</Typography>;

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Banners</Typography>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Create Banner
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr.No</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>CTA Text</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                <TableCell>
                  <Avatar
                    src={item.image}
                    variant="rounded"
                    sx={{ width: 80, height: 45 }}
                  />
                </TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.CTA_text}</TableCell>
                <TableCell>
                  <Chip
                    label={item.status ? "Active" : "Inactive"}
                    color={item.status ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton color="primary">
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton color="warning" onClick={() => handleEdit(item)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(item.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {banners.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No banners found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack alignItems="flex-end" mt={3}>
        <Pagination
          count={Math.ceil(banners.length / rowsPerPage)}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Stack>

      {/* Create / Edit Banner Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? "Edit Banner" : "Create Banner"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
              fullWidth
            />
            <Button variant="outlined" component="label">
              {editId ? "Change Image" : "Upload Image"}
              <input
                type="file"
                name="image"
                accept="image/*"
                hidden
                onChange={handleChange}
              />
            </Button>
            {errors.image && (
              <Typography color="error">{errors.image}</Typography>
            )}
            {form.image && <Typography>Selected: {form.image.name}</Typography>}

            <TextField
              label="CTA Text"
              name="CTA_text"
              value={form.CTA_text}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="CTA Link"
              name="CTA_link"
              value={form.CTA_link}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Order"
              type="number"
              name="order"
              value={form.order}
              onChange={handleChange}
              fullWidth
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.status}
                  name="status"
                  onChange={handleChange}
                />
              }
              label="Active"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Banner;
