import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProducts,
  createProducts,
  updateProducts,
  deleteProducts,
} from "../../feature/products/productThunks";

import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
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
  Avatar,
  CircularProgress,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CategoryIcon from "@mui/icons-material/Category";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import ImageIcon from "@mui/icons-material/Image";
import Loader from "../../components/commonComponents/Loader";
import CommonButton from "../../components/commonComponents/CommonButton";
import CommonLabel from "../../components/commonComponents/CommonLabel";

const Product = () => {
  const dispatch = useDispatch();
  const { list, loading, createLoading, updateLoading } = useSelector(
    (state) => state.product,
  );

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [imageLoaded, setImageLoaded] = useState(false);

  const [form, setForm] = useState({
    product_name: "",
    category_name: "",
    mrp: "",
    thumbnail_image: "",
    status: true,
    adhesive: false,
    anti_yellowing: false,
    scratch_resistant: false,
    uv_resistance: false,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

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
    if (!form.mrp) temp.mrp = "Required";
    if (!form.thumbnail_image) temp.thumbnail_image = "Required";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (isEditing && editId) {
      dispatch(updateProducts({ id: editId, data: form }))
        .unwrap()
        .then(() => dispatch(getProducts()))
        .catch(console.error);
    } else {
      dispatch(createProducts(form))
        .unwrap()
        .then(() => dispatch(getProducts()));
    }

    handleReset();
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditId(item.id);
    setForm({
      product_name: item.product_name,
      category_name: item.category_name,
      mrp: item.mrp,
      thumbnail_image: item.thumbnail_image,
      status: item.status,
      adhesive: item.adhesive,
      anti_yellowing: item.anti_yellowing,
      scratch_resistant: item.scratch_resistant,
      uv_resistance: item.uv_resistance,
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProducts(id))
        .unwrap()
        .then(() => dispatch(getProducts()))
        .catch(console.error);
    }
  };

  const handleReset = () => {
    setForm({
      product_name: "",
      category_name: "",
      mrp: "",
      thumbnail_image: "",
      status: true,
      adhesive: false,
      anti_yellowing: false,
      scratch_resistant: false,
      uv_resistance: false,
    });
    setErrors({});
    setEditId(null);
    setIsEditing(false);
  };

  const paginatedData = list.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  if (loading) return <Loader text="Loading products..." fullScreen={true} />;

  if (isEditing) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Box width="100%" maxWidth={800}>
          <Stack direction="row" alignItems="center" spacing={1} mb={3}>
            <IconButton onClick={handleReset}>
              <ArrowBackIcon />
            </IconButton>
            <CommonLabel>{editId ? "Edit Product" : "Add Product"}</CommonLabel>
          </Stack>

          <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
              <TextField
                label="Product Name"
                name="product_name"
                fullWidth
                value={form.product_name}
                onChange={handleChange}
                error={!!errors.product_name}
                helperText={errors.product_name}
                InputProps={{ startAdornment: <CategoryIcon sx={{ mr: 1 }} /> }}
              />
              <TextField
                label="Category"
                name="category_name"
                fullWidth
                value={form.category_name}
                onChange={handleChange}
                error={!!errors.category_name}
              />
              <TextField
                label="MRP"
                name="mrp"
                fullWidth
                value={form.mrp}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <CurrencyRupeeIcon sx={{ mr: 1 }} />,
                }}
              />
              <TextField
                label="Thumbnail URL"
                name="thumbnail_image"
                fullWidth
                value={form.thumbnail_image}
                onChange={handleChange}
                InputProps={{ startAdornment: <ImageIcon sx={{ mr: 1 }} /> }}
              />

              <Stack direction="row" spacing={2}>
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
              </Stack>

              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Button onClick={handleReset}>Cancel</Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={createLoading || updateLoading}
                >
                  {createLoading || updateLoading
                    ? "Saving..."
                    : editId
                      ? "Update"
                      : "Save"}
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{ color: "#7E7E7E", mb: 2 }}
        >
          Products
        </Typography>
        <CommonButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsEditing(true)}
        >
          Add Product
        </CommonButton>
      </Stack>

      <TableContainer
        component={Paper}
        sx={{ borderRadius: 3, boxShadow: "0 6px 20px rgba(0,0,0,0.08)" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {[
                "Sr",
                "Image",
                "Product",
                "Category",
                "MRP",
                "Status",
                "Actions",
              ].map((h) => (
                <TableCell key={h} sx={{ fontWeight: 700 }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((p, i) => (
              <TableRow key={p.id} hover>
                <TableCell>{(page - 1) * rowsPerPage + i + 1}</TableCell>
                {/* <TableCell>
                  <Avatar
                    src={`https://hogofilm.pythonanywhere.com/${p.thumbnail_image}`}
                    variant="rounded"
                    sx={{ width: 48, height: 48 }}
                  />
                </TableCell> */}
                <TableCell>
                  <Box sx={{ position: "relative", width: 48, height: 48 }}>
                    {!imageLoaded && (
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 1,
                        }}
                      >
                        <CircularProgress size={20} />
                      </Box>
                    )}

                    <Avatar
                      src={`https://hogofilm.pythonanywhere.com/${p.thumbnail_image}`}
                      variant="rounded"
                      sx={{ width: 48, height: 48 }}
                      imgProps={{
                        onLoad: () => setImageLoaded(true),
                        onError: () => setImageLoaded(true),
                      }}
                    />
                  </Box>
                </TableCell>
                <TableCell>{p.product_name}</TableCell>
                <TableCell>{p.category_name}</TableCell>
                <TableCell>₹ {p.mrp}</TableCell>
                <TableCell>
                  <Chip
                    label={p.status ? "Active" : "Inactive"}
                    size="small"
                    color={p.status ? "success" : "default"}
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small">
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="warning"
                    onClick={() => handleEdit(p)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(p.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {list.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
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
          onChange={(_, v) => setPage(v)}
        />
      </Stack>
    </Box>
  );
};

export default Product;
