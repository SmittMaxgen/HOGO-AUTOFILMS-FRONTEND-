import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProducts,
  createProducts,
  updateProducts,
  deleteProducts,
} from "../../feature/products/productThunks";
import { getCategory } from "../../feature/category/categoryThunks";
import { getMaterials } from "../../feature/material/materialThunks";
import { getColors } from "../../feature/color/colorThunks";

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
  Autocomplete,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CategoryIcon from "@mui/icons-material/Category";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import ImageIcon from "@mui/icons-material/Image";
import BrushIcon from "@mui/icons-material/Brush";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import SecurityIcon from "@mui/icons-material/Security";

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

  const [isViewing, setIsViewing] = useState(false);
  const [viewItem, setViewItem] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [imageLoaded, setImageLoaded] = useState(false);

  const [form, setForm] = useState({
    product_name: "",
    product_codes: "",
    sku: "",
    category_name: "",
    category_id: null,
    material_id: null,
    colour_id: null,
    application_area: "",
    film_type: "",
    finish: "",
    specification: "",
    thickness: "",
    warranty: "",
    hydrophobic: "",
    stain_resistant: "",
    elongation: "",
    tear_strength: "",
    mrp: "",
    thumbnail_image: null,
    status: true,
    adhesive: "",
    anti_yellowing: "",
    scratch_resistant: "",
    uv_resistance: false,
  });
  const [errors, setErrors] = useState({});
  console.log("errors", errors);
  const { list: categoryList, loading: categoryLoading } = useSelector(
    (state) => state.category,
  );
  const { list: materialList, loading: materialLoading } = useSelector(
    (state) => state.material,
  );

  const { colors: colorList, loading: colorLoading } = useSelector(
    (state) => state.color,
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    setForm((prev) => ({
      ...prev,
      thumbnail_image: file,
    }));
  };

  useEffect(() => {
    dispatch(getColors());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getMaterials());
  }, [dispatch]);

  const validate = () => {
    const temp = {};
    if (!form.product_name) temp.product_name = "Required";
    if (!form.product_codes) temp.product_codes = "Required";
    if (!form.sku) temp.sku = "Required";
    if (!form.category_id) temp.category_id = "Required";
    if (!form.material_id) temp.material_id = "Required";
    if (!form.colour_id) temp.colour_id = "Required";
    if (!form.application_area) temp.application_area = "Required";
    if (!form.film_type) temp.film_type = "Required";
    if (!form.finish) temp.finish = "Required";
    if (!form.specification) temp.specification = "Required";
    if (!form.thickness) temp.thickness = "Required";
    if (!form.warranty) temp.warranty = "Required";
    if (!form.hydrophobic) temp.hydrophobic = "Required";
    if (!form.stain_resistant) temp.stain_resistant = "Required";
    if (!form.elongation) temp.elongation = "Required";
    if (!form.tear_strength) temp.tear_strength = "Required";
    if (!form.mrp) temp.mrp = "Required";
    if (!form.thumbnail_image) temp.thumbnail_image = "Required";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleStatusToggle = (item) => {
    const data = new FormData();
    data.append("status", !item.status);

    dispatch(
      updateProducts({
        id: item.id,
        data,
      }),
    )
      .unwrap()
      .then(() => {
        dispatch(getProducts());
      })
      .catch(console.error);
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const formData = new FormData();

    formData.append("product_name", form.product_name);
    formData.append("product_codes", form.product_codes);
    formData.append("sku", form.sku);
    formData.append("category_id", form.category_id);
    formData.append("material_id", form.material_id);
    formData.append("colour_id", form.colour_id);
    formData.append("application_area", form.application_area);
    formData.append("film_type", form.film_type);
    formData.append("finish", form.finish);
    formData.append("specification", form.specification);
    formData.append("thickness", form.thickness);
    formData.append("warranty", form.warranty);
    formData.append("hydrophobic", form.hydrophobic);
    formData.append("stain_resistant", form.stain_resistant);
    formData.append("elongation", form.elongation);
    formData.append("tear_strength", form.tear_strength);
    formData.append("mrp", form.mrp);
    formData.append("status", form.status);
    formData.append("adhesive", form.adhesive);
    formData.append("anti_yellowing", form.anti_yellowing);
    formData.append("scratch_resistant", form.scratch_resistant);
    formData.append("uv_resistance", form.uv_resistance);

    // ✅ Add file if exists
    if (form.thumbnail_image instanceof File) {
      formData.append("thumbnail_image", form.thumbnail_image);
    }

    if (isEditing && editId) {
      dispatch(updateProducts({ id: editId, data: formData }))
        .unwrap()
        .then(() => dispatch(getProducts()));
    } else {
      dispatch(createProducts(formData))
        .unwrap()
        .then(() => dispatch(getProducts()));
    }

    handleReset();
  };
  const handleView = (item) => {
    setViewItem(item);
    setIsViewing(true);
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditId(item.id);
    setForm({
      product_name: item.product_name || "",
      product_codes: item.product_codes || "",
      sku: item.sku || "",
      category_id: item.category_id || "",
      material_id: item.material_id || "",
      colour_id: item.colour_id || "",
      film_type: item.film_type || "",
      finish: item.finish || "",
      application_area: item.application_area || "",
      thickness: item.thickness || "",
      specification: item.specification || "",
      warranty: item.warranty || "",
      hydrophobic: item.hydrophobic || "",
      stain_resistant: item.stain_resistant || "",
      elongation: item.elongation || "",
      tear_strength: item.tear_strength || "",
      mrp: item.mrp || "",
      thumbnail_image: item.thumbnail_image || null,
      image1: item.image1 || null,
      image2: item.image2 || null,
      image3: item.image3 || null,
      image4: item.image4 || null,
      installation_video_url: item.installation_video_url || "",
      status: item.status ?? true,
      adhesive: item.adhesive || "",
      anti_yellowing: item.anti_yellowing || "",
      scratch_resistant: item.scratch_resistant || "",
      uv_resistance: item.uv_resistance || "",
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
      product_codes: "",
      sku: "",
      category_name: "",
      category_id: null,
      material_id: null,
      colour_id: null,
      application_area: "",
      film_type: "",
      finish: "",
      specification: "",
      thickness: "",
      warranty: "",
      hydrophobic: "",
      stain_resistant: "",
      elongation: "",
      tear_strength: "",
      mrp: "",
      thumbnail_image: null,
      status: true,
      adhesive: "",
      anti_yellowing: "",
      scratch_resistant: "",
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

          <Paper sx={{ p: 3, maxHeight: 500, overflow: "auto" }}>
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
                label="Product Codes"
                name="product_codes"
                fullWidth
                value={form.product_codes}
                onChange={handleChange}
                error={!!errors.product_codes}
                helperText={errors.product_codes}
              />
              <TextField
                label="SKU"
                name="sku"
                fullWidth
                value={form.sku}
                onChange={handleChange}
                error={!!errors.sku}
                helperText={errors.sku}
              />
              <TextField
                label="Application Area"
                name="application_area"
                fullWidth
                value={form.application_area}
                onChange={handleChange}
                error={!!errors.application_area}
                helperText={errors.application_area}
              />
              <TextField
                label="Film Type"
                name="film_type"
                fullWidth
                value={form.film_type}
                onChange={handleChange}
                error={!!errors.film_type}
                helperText={errors.film_type}
              />
              <TextField
                label="Finish"
                name="finish"
                fullWidth
                value={form.finish}
                onChange={handleChange}
                error={!!errors.finish}
                helperText={errors.finish}
              />
              <TextField
                label="Specification"
                name="specification"
                fullWidth
                value={form.specification}
                onChange={handleChange}
                error={!!errors.specification}
                helperText={errors.specification}
              />
              <TextField
                label="Thickness"
                name="thickness"
                fullWidth
                value={form.thickness}
                onChange={handleChange}
                error={!!errors.thickness}
                helperText={errors.thickness}
              />
              <TextField
                label="Warranty"
                name="warranty"
                fullWidth
                value={form.warranty}
                onChange={handleChange}
                error={!!errors.warranty}
                helperText={errors.warranty}
              />
              <TextField
                label="Hydrophobic"
                name="hydrophobic"
                fullWidth
                value={form.hydrophobic}
                onChange={handleChange}
                error={!!errors.hydrophobic}
                helperText={errors.hydrophobic}
              />

              <TextField
                label="Stain Resistant"
                name="stain_resistant"
                fullWidth
                value={form.stain_resistant}
                onChange={handleChange}
                error={!!errors.stain_resistant}
                helperText={errors.stain_resistant}
              />

              <TextField
                label="Elongation"
                name="elongation"
                fullWidth
                value={form.elongation}
                onChange={handleChange}
                error={!!errors.elongation}
                helperText={errors.elongation}
              />

              <TextField
                label="Tear Strength"
                name="tear_strength"
                fullWidth
                value={form.tear_strength}
                onChange={handleChange}
                error={!!errors.tear_strength}
                helperText={errors.tear_strength}
              />
              <Autocomplete
                options={categoryList?.data || []}
                loading={categoryLoading}
                getOptionLabel={(option) => option?.name || ""}
                value={
                  categoryList?.data?.find((c) => c.id === form.category_id) ||
                  null
                }
                onChange={(_, newValue) => {
                  setForm((prev) => ({
                    ...prev,
                    category_id: newValue ? newValue.id : null,
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Category"
                    placeholder="Select a category"
                    error={!!errors.category_id}
                    helperText={errors.category_id}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: <CategoryIcon sx={{ mr: 1 }} />,
                      endAdornment: (
                        <>
                          {categoryLoading ? (
                            <CircularProgress size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
              <Autocomplete
                options={materialList || []}
                loading={materialLoading}
                getOptionLabel={(option) => option.title || ""} // ✅ use title
                value={
                  materialList?.find((m) => m.id === form.material_id) || null
                }
                onChange={(_, newValue) => {
                  setForm((prev) => ({
                    ...prev,
                    material_id: newValue ? newValue.id : null,
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Material"
                    placeholder="Select a material"
                    error={!!errors.material_id}
                    helperText={errors.material_id}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: <CategoryIcon sx={{ mr: 1 }} />,
                      endAdornment: (
                        <>
                          {materialLoading ? (
                            <CircularProgress size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
              <Autocomplete
                options={colorList || []}
                loading={colorLoading}
                getOptionLabel={(option) => option.colour_name || ""} // use "name" for colors
                value={colorList?.find((c) => c.id === form.colour_id) || null}
                onChange={(_, newValue) => {
                  setForm((prev) => ({
                    ...prev,
                    colour_id: newValue ? newValue.id : null,
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Color"
                    placeholder="Select a color"
                    error={!!errors.color_id}
                    helperText={errors.color_id}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: <CategoryIcon sx={{ mr: 1 }} />, // you can change icon
                      endAdornment: (
                        <>
                          {colorLoading ? <CircularProgress size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
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
                label="Adhesive"
                name="adhesive"
                fullWidth
                value={form.adhesive}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <BrushIcon sx={{ mr: 1 }} />,
                }}
              />

              <TextField
                label="Anti Yellowing"
                name="anti_yellowing"
                fullWidth
                value={form.anti_yellowing}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <WbSunnyIcon sx={{ mr: 1 }} />,
                }}
              />

              <TextField
                label="Scratch Resistant"
                name="scratch_resistant"
                fullWidth
                value={form.scratch_resistant}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <SecurityIcon sx={{ mr: 1 }} />,
                }}
              />
              <TextField
                label="Thumbnail Image"
                fullWidth
                value={form.thumbnail_image?.name || ""}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <ImageIcon sx={{ mr: 1, color: "#7E7E7E" }} />
                  ),
                  endAdornment: (
                    <Button
                      component="label"
                      sx={{
                        bgcolor: "#D20000",
                        color: "#FAFAFA",
                        textTransform: "none",
                        "&:hover": { bgcolor: "#ED3434" },
                      }}
                    >
                      Browse
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </Button>
                  ),
                }}
                placeholder="Select thumbnail image"
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
  if (isViewing && viewItem) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Box width="100%" maxWidth={800}>
          <Stack direction="row" alignItems="center" spacing={1} mb={3}>
            <IconButton
              onClick={() => {
                setIsViewing(false);
                setViewItem(null);
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <CommonLabel>View Product</CommonLabel>
          </Stack>

          <Paper sx={{ p: 3, maxHeight: 500, overflow: "auto" }}>
            <Stack spacing={2}>
              <TextField
                label="Product Name"
                fullWidth
                value={viewItem.product_name}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Product Codes"
                fullWidth
                value={viewItem.product_codes}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="SKU"
                fullWidth
                value={viewItem.sku}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Category"
                fullWidth
                value={viewItem.category_name}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Material"
                fullWidth
                value={viewItem.material_name} // you may need to map material name
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Color"
                fullWidth
                value={viewItem.colour_name} // map color name
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="MRP"
                fullWidth
                value={`₹ ${viewItem.mrp}`}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Application Area"
                fullWidth
                value={viewItem.application_area}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Film Type"
                fullWidth
                value={viewItem.film_type}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Finish"
                fullWidth
                value={viewItem.finish}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Specification"
                fullWidth
                value={viewItem.specification}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Thickness"
                fullWidth
                value={viewItem.thickness}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Warranty"
                fullWidth
                value={viewItem.warranty}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Hydrophobic"
                name="hydrophobic"
                fullWidth
                value={form.hydrophobic}
                onChange={handleChange}
              />

              <TextField
                label="Stain Resistant"
                name="stain_resistant"
                fullWidth
                value={form.stain_resistant}
                onChange={handleChange}
              />

              <TextField
                label="Elongation"
                name="elongation"
                fullWidth
                value={form.elongation}
                onChange={handleChange}
              />

              <TextField
                label="Tear Strength"
                name="tear_strength"
                fullWidth
                value={form.tear_strength}
                onChange={handleChange}
              />
              <Stack direction="row" spacing={2}>
                <FormControlLabel
                  control={<Checkbox checked={viewItem.status} disabled />}
                  label="Active"
                />
                <FormControlLabel
                  control={<Checkbox checked={viewItem.adhesive} disabled />}
                  label="Adhesive"
                />
                <FormControlLabel
                  control={
                    <Checkbox checked={viewItem.anti_yellowing} disabled />
                  }
                  label="Anti Yellowing"
                />
                <FormControlLabel
                  control={
                    <Checkbox checked={viewItem.scratch_resistant} disabled />
                  }
                  label="Scratch Resistant"
                />
              </Stack>

              {viewItem.thumbnail_image && (
                <Box mt={2}>
                  <Typography variant="subtitle2">Thumbnail</Typography>
                  <Avatar
                    src={`https://hogofilm.pythonanywhere.com/${viewItem.thumbnail_image}`}
                    variant="rounded"
                    sx={{ width: 120, height: 120, mt: 1 }}
                  />
                </Box>
              )}
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
                "Product Code",
                "Category",
                "Material",
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
                <TableCell>{p?.product_name}</TableCell>
                <TableCell>{p?.product_codes}</TableCell>
                <TableCell>{p?.category_name}</TableCell>
                <TableCell>{p?.material_name}</TableCell>
                <TableCell>₹ {p.mrp}</TableCell>
                <TableCell>
                  <Chip
                    label={p.status ? "Active" : "Inactive"}
                    size="small"
                    color={p.status ? "success" : "default"}
                    clickable
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleStatusToggle(p)}
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleView(p)}>
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
