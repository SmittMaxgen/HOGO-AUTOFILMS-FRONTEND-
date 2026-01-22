// // import { useEffect } from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import { getProducts } from "../../feature/products/productThunks";

// // const Product = () => {
// //   const dispatch = useDispatch();
// //   const { list, loading } = useSelector((state) => state.product);

// //   useEffect(() => {
// //     dispatch(getProducts());
// //   }, [dispatch]);

// //   if (loading) return <p>Loading products...</p>;

// //   return (
// //     <div>
// //       <h2>Products</h2>

// //       {list.map((p) => (
// //         <div key={p.id} style={{ marginBottom: 16 }}>
// //           <h4>{p.product_name}</h4>
// //           <img src={p.thumbnail_image} width="120" />
// //           <p>MRP: ₹{p.mrp}</p>
// //           <p>Category: {p.category_name}</p>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // };

// // export default Product;
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getProducts } from "../../feature/products/productThunks";

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
// } from "@mui/material";

// import VisibilityIcon from "@mui/icons-material/Visibility";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";

// const Product = () => {
//   const dispatch = useDispatch();
//   const { list, loading } = useSelector((state) => state.product);

//   // frontend pagination
//   const [page, setPage] = useState(1);
//   const rowsPerPage = 5;

//   useEffect(() => {
//     dispatch(getProducts());
//   }, [dispatch]);

//   if (loading) {
//     return <Typography>Loading products...</Typography>;
//   }

//   const paginatedData = list.slice(
//     (page - 1) * rowsPerPage,
//     page * rowsPerPage,
//   );

//   return (
//     <Box>
//       <Typography variant="h4" mb={3}>
//         Products
//       </Typography>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Sr.No</TableCell>
//               <TableCell>Image</TableCell>
//               <TableCell>Product Name</TableCell>
//               <TableCell>Category</TableCell>
//               <TableCell>Brand</TableCell>
//               <TableCell>MOQ</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell align="center">Actions</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {paginatedData.map((p, index) => (
//               <TableRow key={p.id}>
//                 <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
//                 {console.log("p====>>>", p)}
//                 <TableCell>
//                   <Avatar
//                     src={`https://hogofilm.pythonanywhere.com/${p.thumbnail_image}`}
//                     variant="rounded"
//                     sx={{ width: 50, height: 50 }}
//                   />
//                 </TableCell>

//                 <TableCell>
//                   <Typography fontWeight={600}>{p.product_name}</Typography>
//                 </TableCell>

//                 <TableCell>{p.category_name}</TableCell>
//                 <TableCell>{p.brand || "-"}</TableCell>
//                 <TableCell>{p.moq || 1}</TableCell>

//                 <TableCell>
//                   <Chip
//                     label={p.status ? "Active" : "Inactive"}
//                     color={p.status ? "success" : "default"}
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

//             {list.length === 0 && (
//               <TableRow>
//                 <TableCell colSpan={8} align="center">
//                   No products found
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Pagination */}
//       <Stack alignItems="flex-end" mt={3}>
//         <Pagination
//           count={Math.ceil(list.length / rowsPerPage)}
//           page={page}
//           onChange={(_, value) => setPage(value)}
//           color="primary"
//         />
//       </Stack>
//     </Box>
//   );
// };

// export default Product;
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProducts,
  createProducts,
} from "../../feature/products/productThunks";
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
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Product = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.product);
  const createLoading = useSelector((state) => state.product.createLoading);

  // Pagination
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  // Dialog state
  const [open, setOpen] = useState(false);

  // Form state
  const [form, setForm] = useState({
    product_name: "",
    product_codes: "",
    sku: "",
    category_id: "",
    category_name: "",
    film_type: "",
    finish: "",
    application_area: "",
    thickness: "",
    specification: "",
    warranty: "",
    adhesive: false,
    anti_yellowing: false,
    scratch_resistant: false,
    uv_resistance: false,
    hydrophobic: "",
    stain_resistant: "",
    elongation: "",
    tear_strength: "",
    mrp: "",
    thumbnail_image: "",
    gallery_images: "",
    installation_video_url: "",
    status: true,
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  if (loading) return <Typography>Loading products...</Typography>;

  const paginatedData = list.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  // Form handlers
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setForm({
      product_name: "",
      product_codes: "",
      sku: "",
      category_id: "",
      category_name: "",
      film_type: "",
      finish: "",
      application_area: "",
      thickness: "",
      specification: "",
      warranty: "",
      adhesive: false,
      anti_yellowing: false,
      scratch_resistant: false,
      uv_resistance: false,
      hydrophobic: "",
      stain_resistant: "",
      elongation: "",
      tear_strength: "",
      mrp: "",
      thumbnail_image: "",
      gallery_images: "",
      installation_video_url: "",
      status: true,
    });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    const temp = {};
    if (!form.product_name) temp.product_name = "Required";
    if (!form.category_name) temp.category_name = "Required";
    if (!form.mrp || isNaN(form.mrp)) temp.mrp = "Valid MRP required";
    if (!form.thumbnail_image) temp.thumbnail_image = "Thumbnail URL required";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    dispatch(createProducts(form)).then(() => {
      handleClose();
    });
  };

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Products</Typography>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Product
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr.No</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>MOQ</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((p, index) => (
              <TableRow key={p.id}>
                <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                <TableCell>
                  <Avatar
                    src={`https://hogofilm.pythonanywhere.com/${p.thumbnail_image}`}
                    variant="rounded"
                    sx={{ width: 50, height: 50 }}
                  />
                </TableCell>
                <TableCell>{p.product_name}</TableCell>
                <TableCell>{p.category_name}</TableCell>
                <TableCell>{p.brand || "-"}</TableCell>
                <TableCell>{p.moq || 1}</TableCell>
                <TableCell>
                  <Chip
                    label={p.status ? "Active" : "Inactive"}
                    color={p.status ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton color="primary">
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton color="warning">
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {list.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack alignItems="flex-end" mt={3}>
        <Pagination
          count={Math.ceil(list.length / rowsPerPage)}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Stack>

      {/* Add Product Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Add Product</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Product Name"
              name="product_name"
              value={form.product_name}
              onChange={handleChange}
              error={!!errors.product_name}
              helperText={errors.product_name}
              fullWidth
            />
            <TextField
              label="Product Codes"
              name="product_codes"
              value={form.product_codes}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="SKU"
              name="sku"
              value={form.sku}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Category Name"
              name="category_name"
              value={form.category_name}
              onChange={handleChange}
              error={!!errors.category_name}
              helperText={errors.category_name}
              fullWidth
            />
            <TextField
              label="MRP"
              name="mrp"
              value={form.mrp}
              onChange={handleChange}
              error={!!errors.mrp}
              helperText={errors.mrp}
              fullWidth
            />
            <TextField
              label="Thumbnail URL"
              name="thumbnail_image"
              value={form.thumbnail_image}
              onChange={handleChange}
              error={!!errors.thumbnail_image}
              helperText={errors.thumbnail_image}
              fullWidth
            />
            <TextField
              label="Gallery Images URL"
              name="gallery_images"
              value={form.gallery_images}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Installation Video URL"
              name="installation_video_url"
              value={form.installation_video_url}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Film Type"
              name="film_type"
              value={form.film_type}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Finish"
              name="finish"
              value={form.finish}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Application Area"
              name="application_area"
              value={form.application_area}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Thickness"
              name="thickness"
              value={form.thickness}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Specification"
              name="specification"
              value={form.specification}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Warranty"
              name="warranty"
              value={form.warranty}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Hydrophobic"
              name="hydrophobic"
              value={form.hydrophobic}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Stain Resistant"
              name="stain_resistant"
              value={form.stain_resistant}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Elongation"
              name="elongation"
              value={form.elongation}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Tear Strength"
              name="tear_strength"
              value={form.tear_strength}
              onChange={handleChange}
              fullWidth
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.adhesive}
                  name="adhesive"
                  onChange={handleChange}
                />
              }
              label="Adhesive"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.anti_yellowing}
                  name="anti_yellowing"
                  onChange={handleChange}
                />
              }
              label="Anti Yellowing"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.scratch_resistant}
                  name="scratch_resistant"
                  onChange={handleChange}
                />
              }
              label="Scratch Resistant"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.uv_resistance}
                  name="uv_resistance"
                  onChange={handleChange}
                />
              }
              label="UV Resistance"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={createLoading}
          >
            {createLoading ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Product;
