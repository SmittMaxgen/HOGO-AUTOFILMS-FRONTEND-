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
  Switch,
  Divider,
  Grid,
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
import CommonToast from "../../components/commonComponents/Toster";

import CommonSearchField from "../../components/commonComponents/CommonSearchField";

const Product = () => {
  const dispatch = useDispatch();
  const { list, loading, createLoading } = useSelector(
    (state) => state.product,
  );

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const [isViewing, setIsViewing] = useState(false);
  const [viewItem, setViewItem] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const BASE_URL = "https://hogofilm.pythonanywhere.com";

  // Helper function to get image URL
  const getImageUrl = (imageValue) => {
    if (imageValue instanceof File) {
      return URL.createObjectURL(imageValue);
    } else if (imageValue && typeof imageValue === "string") {
      return `${BASE_URL}${imageValue}`;
    }
    return null;
  };

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
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    installation_video_url: "",
    status: true,
    adhesive: "",
    anti_yellowing: "",
    scratch_resistant: "",
    uv_resistance: false,
    // New fields added
    tempeerature_resistance: "",
    peel_adhesion: "",
    anti_rockclip: "",
    elongation_rate_tpu: "",
    elongation_rate_hard: "",
  });
  const [errors, setErrors] = useState({});
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
    const { name } = e.target;
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: file,
    }));
  };

  useEffect(() => {
    dispatch(getColors());
  }, [dispatch]);

  useEffect(() => {
    const delay = setTimeout(() => {
      dispatch(getProducts({ search: searchQuery }));
    }, 400); // debounce

    return () => clearTimeout(delay);
  }, [dispatch, searchQuery]);

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

    if (!form.mrp) {
      temp.mrp = "Required";
    } else if (isNaN(form.mrp)) {
      temp.mrp = "MRP must be a number";
    } else if (Number(form.mrp) <= 0) {
      temp.mrp = "MRP must be greater than 0";
    }

    if (!isEditing && !form.thumbnail_image) temp.thumbnail_image = "Required";

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
    formData.append("installation_video_url", form.installation_video_url);

    // New fields
    formData.append("tempeerature_resistance", form.tempeerature_resistance);
    formData.append("peel_adhesion", form.peel_adhesion);
    formData.append("anti_rockclip", form.anti_rockclip);
    formData.append("elongation_rate_tpu", form.elongation_rate_tpu);
    formData.append("elongation_rate_hard", form.elongation_rate_hard);

    // Handle images
    if (form.thumbnail_image instanceof File) {
      formData.append("thumbnail_image", form.thumbnail_image);
    }
    if (form.image1 instanceof File) {
      formData.append("image1", form.image1);
    }
    if (form.image2 instanceof File) {
      formData.append("image2", form.image2);
    }
    if (form.image3 instanceof File) {
      formData.append("image3", form.image3);
    }
    if (form.image4 instanceof File) {
      formData.append("image4", form.image4);
    }

    if (isEditing && editId) {
      dispatch(updateProducts({ id: editId, data: formData }))
        .unwrap()
        .then(() => dispatch(getProducts()).unwrap())
        .then(() => CommonToast("Product updated successfully", "success"))
        .catch(() => CommonToast("Failed to update product", "error"));
    } else {
      dispatch(createProducts(formData))
        .unwrap()
        .then(() => dispatch(getProducts()).unwrap())
        .then(() => CommonToast("Product created successfully", "success"))
        .catch(() => CommonToast("Failed to create product", "error"));
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
      uv_resistance: item.uv_resistance || false,
      // New fields
      tempeerature_resistance: item.tempeerature_resistance || "",
      peel_adhesion: item.peel_adhesion || "",
      anti_rockclip: item.anti_rockclip || "",
      elongation_rate_tpu: item.elongation_rate_tpu || "",
      elongation_rate_hard: item.elongation_rate_hard || "",
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProducts(id))
        .unwrap()
        .then(() => CommonToast("Product deleted successfully", "success"))
        .then(() => dispatch(getProducts()))
        .catch(() => CommonToast("Failed to delete Product", "error"));
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
      image1: null,
      image2: null,
      image3: null,
      image4: null,
      installation_video_url: "",
      status: true,
      adhesive: "",
      anti_yellowing: "",
      scratch_resistant: "",
      uv_resistance: false,
      tempeerature_resistance: "",
      peel_adhesion: "",
      anti_rockclip: "",
      elongation_rate_tpu: "",
      elongation_rate_hard: "",
    });
    setErrors({});
    setEditId(null);
    setIsEditing(false);
  };

  const paginatedData = list.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  if (isEditing) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Box width="100%">
          <Stack direction="row" alignItems="center" spacing={1} mb={3}>
            <IconButton onClick={handleReset}>
              <ArrowBackIcon />
            </IconButton>
            <CommonLabel>{editId ? "Edit Product" : "Add Product"}</CommonLabel>
          </Stack>

          <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
              {/* Basic Information */}
              <Typography variant="h6" color="primary" gutterBottom>
                Basic Information
              </Typography>

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
                getOptionLabel={(option) => option.title || ""}
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
                getOptionLabel={(option) => option.colour_name || ""}
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
                    error={!!errors.colour_id}
                    helperText={errors.colour_id}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: <CategoryIcon sx={{ mr: 1 }} />,
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

              <Divider sx={{ my: 2 }} />

              {/* Product Specifications */}
              <Typography variant="h6" color="primary" gutterBottom>
                Product Specifications
              </Typography>

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
                label="MRP"
                name="mrp"
                fullWidth
                value={form.mrp}
                onChange={handleChange}
                error={!!errors.mrp}
                helperText={errors.mrp}
                InputProps={{
                  startAdornment: <CurrencyRupeeIcon sx={{ mr: 1 }} />,
                }}
              />

              <Divider sx={{ my: 2 }} />

              {/* Product Properties */}
              <Typography variant="h6" color="primary" gutterBottom>
                Product Properties
              </Typography>

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

              <Divider sx={{ my: 2 }} />

              {/* New Fields Section */}
              <Typography variant="h6" color="primary" gutterBottom>
                Additional Technical Properties
              </Typography>

              <TextField
                label="Temperature Resistance"
                name="tempeerature_resistance"
                fullWidth
                value={form.tempeerature_resistance}
                onChange={handleChange}
              />

              <TextField
                label="Peel Adhesion"
                name="peel_adhesion"
                fullWidth
                value={form.peel_adhesion}
                onChange={handleChange}
                placeholder="e.g., <30.0"
              />

              <TextField
                label="Anti Rockclip"
                name="anti_rockclip"
                fullWidth
                value={form.anti_rockclip}
                onChange={handleChange}
                placeholder="e.g., pass"
              />

              <TextField
                label="Elongation Rate TPU"
                name="elongation_rate_tpu"
                fullWidth
                value={form.elongation_rate_tpu}
                onChange={handleChange}
                placeholder="e.g., 200%"
              />

              <TextField
                label="Elongation Rate Hard"
                name="elongation_rate_hard"
                fullWidth
                value={form.elongation_rate_hard}
                onChange={handleChange}
                placeholder="e.g., 250%"
              />

              {/* <Divider sx={{ my: 2 }} /> */}

              {/* Images Section */}
              {/* <Typography variant="h6" color="primary" gutterBottom>
                Product Images
              </Typography>

              <TextField
                label="Thumbnail Image"
                fullWidth
                value={
                  form.thumbnail_image instanceof File
                    ? form.thumbnail_image.name
                    : form.thumbnail_image
                    ? "Current image uploaded"
                    : ""
                }
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
                        name="thumbnail_image"
                        hidden
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </Button>
                  ),
                }}
                placeholder="Select thumbnail image"
                error={!!errors.thumbnail_image}
                helperText={errors.thumbnail_image}
              />

              <TextField
                label="Gallery Image 1"
                fullWidth
                value={
                  form.image1 instanceof File
                    ? form.image1.name
                    : form.image1
                    ? "Current image uploaded"
                    : ""
                }
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
                        name="image1"
                        hidden
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </Button>
                  ),
                }}
                placeholder="Select gallery image 1"
              />

              <TextField
                label="Gallery Image 2"
                fullWidth
                value={
                  form.image2 instanceof File
                    ? form.image2.name
                    : form.image2
                    ? "Current image uploaded"
                    : ""
                }
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
                        name="image2"
                        hidden
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </Button>
                  ),
                }}
                placeholder="Select gallery image 2"
              />

              <TextField
                label="Gallery Image 3"
                fullWidth
                value={
                  form.image3 instanceof File
                    ? form.image3.name
                    : form.image3
                    ? "Current image uploaded"
                    : ""
                }
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
                        name="image3"
                        hidden
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </Button>
                  ),
                }}
                placeholder="Select gallery image 3"
              />

              <TextField
                label="Gallery Image 4"
                fullWidth
                value={
                  form.image4 instanceof File
                    ? form.image4.name
                    : form.image4
                    ? "Current image uploaded"
                    : ""
                }
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
                        name="image4"
                        hidden
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </Button>
                  ),
                }}
                placeholder="Select gallery image 4"
              />

              <TextField
                label="Installation Video URL"
                name="installation_video_url"
                fullWidth
                value={form.installation_video_url}
                onChange={handleChange}
                placeholder="https://youtu.be/..."
              /> */}
              <Divider sx={{ my: 3 }} />

              {/* Images Section */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h6"
                  color="primary"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <ImageIcon /> Product Images
                </Typography>

                {/* Thumbnail Image - Full Width */}
                <Box
                  sx={{
                    mb: 3,
                    p: 2,
                    border: "1px solid #E0E0E0",
                    borderRadius: 2,
                    bgcolor: "#FAFAFA",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 2, fontWeight: 600, color: "#424242" }}
                  >
                    Thumbnail Image *
                  </Typography>

                  {getImageUrl(form.thumbnail_image) && (
                    <Box
                      sx={{
                        mb: 2,
                        textAlign: "center",
                        p: 2,
                        bgcolor: "#FFF",
                        borderRadius: 1,
                      }}
                    >
                      <img
                        src={getImageUrl(form.thumbnail_image)}
                        alt="Thumbnail preview"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "300px",
                          objectFit: "contain",
                          borderRadius: "8px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      />
                    </Box>
                  )}

                  <TextField
                    fullWidth
                    value={
                      form.thumbnail_image instanceof File
                        ? form.thumbnail_image.name
                        : form.thumbnail_image
                          ? "Current image uploaded"
                          : ""
                    }
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
                            name="thumbnail_image"
                            hidden
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </Button>
                      ),
                    }}
                    placeholder="Select thumbnail image"
                    error={!!errors.thumbnail_image}
                    helperText={errors.thumbnail_image}
                  />
                </Box>

                {/* Gallery Images - Grid Layout */}
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 2, fontWeight: 600, color: "#424242" }}
                >
                  Gallery Images
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "4fr", md: "repeat(4, 1fr)" },
                    gap: 3,
                  }}
                >
                  {/* Gallery Image 1 */}
                  <Box
                    sx={{
                      p: 2,
                      border: "1px solid #E0E0E0",
                      borderRadius: 2,
                      bgcolor: "#FAFAFA",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        mb: 2,
                        fontWeight: 600,
                        color: "#616161",
                        display: "block",
                      }}
                    >
                      Gallery Image 1
                    </Typography>

                    {getImageUrl(form.image1) && (
                      <Box
                        sx={{
                          mb: 2,
                          textAlign: "center",
                          p: 2,
                          bgcolor: "#FFF",
                          borderRadius: 1,
                        }}
                      >
                        <img
                          src={getImageUrl(form.image1)}
                          alt="Gallery 1 preview"
                          style={{
                            width: "100%",
                            height: "180px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          }}
                        />
                      </Box>
                    )}

                    <TextField
                      fullWidth
                      size="small"
                      value={
                        form.image1 instanceof File
                          ? form.image1.name
                          : form.image1
                            ? "Current image "
                            : ""
                      }
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <ImageIcon
                            sx={{ mr: 1, color: "#7E7E7E", fontSize: 18 }}
                          />
                        ),
                        endAdornment: (
                          <Button
                            component="label"
                            size="small"
                            sx={{
                              bgcolor: "#D20000",
                              color: "#FAFAFA",
                              textTransform: "none",
                              "&:hover": { bgcolor: "#ED3434" },
                              fontSize: "0.75rem",
                              px: 1.5,
                            }}
                          >
                            Browse
                            <input
                              type="file"
                              name="image1"
                              hidden
                              accept="image/*"
                              onChange={handleFileChange}
                            />
                          </Button>
                        ),
                      }}
                      placeholder="Select gallery image 1"
                    />
                  </Box>

                  {/* Gallery Image 2 */}
                  <Box
                    sx={{
                      p: 2,
                      border: "1px solid #E0E0E0",
                      borderRadius: 2,
                      bgcolor: "#FAFAFA",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        mb: 2,
                        fontWeight: 600,
                        color: "#616161",
                        display: "block",
                      }}
                    >
                      Gallery Image 2
                    </Typography>

                    {getImageUrl(form.image2) && (
                      <Box
                        sx={{
                          mb: 2,
                          textAlign: "center",
                          p: 2,
                          bgcolor: "#FFF",
                          borderRadius: 1,
                        }}
                      >
                        <img
                          src={getImageUrl(form.image2)}
                          alt="Gallery 2 preview"
                          style={{
                            width: "100%",
                            height: "180px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          }}
                        />
                      </Box>
                    )}

                    <TextField
                      fullWidth
                      size="small"
                      value={
                        form.image2 instanceof File
                          ? form.image2.name
                          : form.image2
                            ? "Current image "
                            : ""
                      }
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <ImageIcon
                            sx={{ mr: 1, color: "#7E7E7E", fontSize: 18 }}
                          />
                        ),
                        endAdornment: (
                          <Button
                            component="label"
                            size="small"
                            sx={{
                              bgcolor: "#D20000",
                              color: "#FAFAFA",
                              textTransform: "none",
                              "&:hover": { bgcolor: "#ED3434" },
                              fontSize: "0.75rem",
                              px: 1.5,
                            }}
                          >
                            Browse
                            <input
                              type="file"
                              name="image2"
                              hidden
                              accept="image/*"
                              onChange={handleFileChange}
                            />
                          </Button>
                        ),
                      }}
                      placeholder="Select gallery image 2"
                    />
                  </Box>

                  {/* Gallery Image 3 */}
                  <Box
                    sx={{
                      p: 2,
                      border: "1px solid #E0E0E0",
                      borderRadius: 2,
                      bgcolor: "#FAFAFA",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        mb: 2,
                        fontWeight: 600,
                        color: "#616161",
                        display: "block",
                      }}
                    >
                      Gallery Image 3
                    </Typography>

                    {getImageUrl(form.image3) && (
                      <Box
                        sx={{
                          mb: 2,
                          textAlign: "center",
                          p: 2,
                          bgcolor: "#FFF",
                          borderRadius: 1,
                        }}
                      >
                        <img
                          src={getImageUrl(form.image3)}
                          alt="Gallery 3 preview"
                          style={{
                            width: "100%",
                            height: "180px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          }}
                        />
                      </Box>
                    )}

                    <TextField
                      fullWidth
                      size="small"
                      value={
                        form.image3 instanceof File
                          ? form.image3.name
                          : form.image3
                            ? "Current image "
                            : ""
                      }
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <ImageIcon
                            sx={{ mr: 1, color: "#7E7E7E", fontSize: 18 }}
                          />
                        ),
                        endAdornment: (
                          <Button
                            component="label"
                            size="small"
                            sx={{
                              bgcolor: "#D20000",
                              color: "#FAFAFA",
                              textTransform: "none",
                              "&:hover": { bgcolor: "#ED3434" },
                              fontSize: "0.75rem",
                              px: 1.5,
                            }}
                          >
                            Browse
                            <input
                              type="file"
                              name="image3"
                              hidden
                              accept="image/*"
                              onChange={handleFileChange}
                            />
                          </Button>
                        ),
                      }}
                      placeholder="Select gallery image 3"
                    />
                  </Box>

                  {/* Gallery Image 4 */}
                  <Box
                    sx={{
                      p: 2,
                      border: "1px solid #E0E0E0",
                      borderRadius: 2,
                      bgcolor: "#FAFAFA",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        mb: 2,
                        fontWeight: 600,
                        color: "#616161",
                        display: "block",
                      }}
                    >
                      Gallery Image 4
                    </Typography>

                    {getImageUrl(form.image4) && (
                      <Box
                        sx={{
                          mb: 2,
                          textAlign: "center",
                          p: 2,
                          bgcolor: "#FFF",
                          borderRadius: 1,
                        }}
                      >
                        <img
                          src={getImageUrl(form.image4)}
                          alt="Gallery 4 preview"
                          style={{
                            width: "100%",
                            height: "180px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          }}
                        />
                      </Box>
                    )}

                    <TextField
                      fullWidth
                      size="small"
                      value={
                        form.image4 instanceof File
                          ? form.image4.name
                          : form.image4
                            ? "Current image "
                            : ""
                      }
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <ImageIcon
                            sx={{ mr: 1, color: "#7E7E7E", fontSize: 18 }}
                          />
                        ),
                        endAdornment: (
                          <Button
                            component="label"
                            size="small"
                            sx={{
                              bgcolor: "#D20000",
                              color: "#FAFAFA",
                              textTransform: "none",
                              "&:hover": { bgcolor: "#ED3434" },
                              fontSize: "0.75rem",
                              px: 1.5,
                            }}
                          >
                            Browse
                            <input
                              type="file"
                              name="image4"
                              hidden
                              accept="image/*"
                              onChange={handleFileChange}
                            />
                          </Button>
                        ),
                      }}
                      placeholder="Select gallery image 4"
                    />
                  </Box>
                </Box>
              </Box>

              {/* Installation Video URL */}
              <Box
                sx={{
                  p: 2,
                  border: "1px solid #E0E0E0",
                  borderRadius: 2,
                  bgcolor: "#FAFAFA",
                  mb: 3,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 2, fontWeight: 600, color: "#424242" }}
                >
                  Installation Video
                </Typography>

                <TextField
                  label="Video URL"
                  name="installation_video_url"
                  fullWidth
                  value={form.installation_video_url}
                  onChange={handleChange}
                  placeholder="https://youtu.be/..."
                  InputProps={{
                    endAdornment: form.installation_video_url && (
                      <Button
                        size="small"
                        onClick={() =>
                          window.open(form.installation_video_url, "_blank")
                        }
                        sx={{
                          width: "150px",
                          bgcolor: "#D20000",
                          color: "#FAFAFA",
                          textTransform: "none",
                          "&:hover": { bgcolor: "#ED3434" },
                          ml: 1,
                        }}
                      >
                        Open Video
                      </Button>
                    ),
                  }}
                />
              </Box>
              <Divider sx={{ my: 2 }} />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.status}
                    name="status"
                    onChange={handleChange}
                  />
                }
                label="Active Status"
              />

              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <CommonButton variant="outlined" onClick={handleReset}>
                  Cancel
                </CommonButton>
                <CommonButton
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={createLoading || loading}
                >
                  {createLoading || loading
                    ? "Saving..."
                    : editId
                      ? "Update"
                      : "Save"}
                </CommonButton>
              </Stack>
            </Stack>
          </Paper>
        </Box>
      </Box>
    );
  }

  if (isViewing && viewItem) {
    return (
      <Box mt={4}>
        <Box width="100%">
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

          <Paper sx={{ p: 3 }}>
            <Stack spacing={2} alignItems="center">
              {/* Image */}
              {viewItem.thumbnail_image && (
                <Avatar
                  src={`https://hogofilm.pythonanywhere.com/${viewItem.thumbnail_image}`}
                  variant="rounded"
                  sx={{ width: 160, height: 160 }}
                />
              )}

              {/* Name & basic info */}
              <Typography variant="h6" fontWeight={600}>
                {viewItem.product_name}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                SKU: {viewItem.sku} | {viewItem.category_name} |{" "}
                {viewItem.material_name} | {viewItem.colour_name}
              </Typography>

              <Divider sx={{ width: "100%", my: 1 }} />

              {/* Basic Details */}
              <Grid container spacing={2} textAlign="center">
                <Grid item xs={6} sm={4} md={3}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    MRP
                  </Typography>
                  <Typography>₹ {viewItem.mrp}</Typography>
                </Grid>
                <Grid item xs={6} sm={4} md={3}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Application Area
                  </Typography>
                  <Typography>{viewItem.application_area}</Typography>
                </Grid>
                <Grid item xs={6} sm={4} md={3}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Film Type
                  </Typography>
                  <Typography>{viewItem.film_type}</Typography>
                </Grid>
                <Grid item xs={6} sm={4} md={3}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Finish
                  </Typography>
                  <Typography>{viewItem.finish}</Typography>
                </Grid>
                <Grid item xs={6} sm={4} md={3}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Specification
                  </Typography>
                  <Typography>{viewItem.specification}</Typography>
                </Grid>
                <Grid item xs={6} sm={4} md={3}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Thickness
                  </Typography>
                  <Typography>{viewItem.thickness}</Typography>
                </Grid>
                <Grid item xs={6} sm={4} md={3}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Warranty
                  </Typography>
                  <Typography>{viewItem.warranty}</Typography>
                </Grid>
                <Grid item xs={6} sm={4} md={3}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Status
                  </Typography>
                  <Chip
                    label={viewItem.status ? "Active" : "Inactive"}
                    color={viewItem.status ? "success" : "default"}
                    size="small"
                  />
                </Grid>
              </Grid>

              <Divider sx={{ width: "100%", my: 2 }} />

              {/* Properties */}
              <Typography variant="h6" fontWeight={600} alignSelf="flex-start">
                Properties
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Hydrophobic
                  </Typography>
                  <Typography>{viewItem.hydrophobic}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Stain Resistant
                  </Typography>
                  <Typography>{viewItem.stain_resistant}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Elongation
                  </Typography>
                  <Typography>{viewItem.elongation}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Tear Strength
                  </Typography>
                  <Typography>{viewItem.tear_strength}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Adhesive
                  </Typography>
                  <Typography>{viewItem.adhesive || "N/A"}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Anti Yellowing
                  </Typography>
                  <Typography>{viewItem.anti_yellowing || "N/A"}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Scratch Resistant
                  </Typography>
                  <Typography>{viewItem.scratch_resistant || "N/A"}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    UV Resistance
                  </Typography>
                  <Typography>
                    {viewItem.uv_resistance ? "Yes" : "No"}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ width: "100%", my: 2 }} />

              {/* New Technical Properties */}
              <Typography variant="h6" fontWeight={600} alignSelf="flex-start">
                Technical Properties
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Temperature Resistance
                  </Typography>
                  <Typography>
                    {viewItem.tempeerature_resistance || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Peel Adhesion
                  </Typography>
                  <Typography>{viewItem.peel_adhesion || "N/A"}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Anti Rockclip
                  </Typography>
                  <Typography>{viewItem.anti_rockclip || "N/A"}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Elongation Rate TPU
                  </Typography>
                  <Typography>
                    {viewItem.elongation_rate_tpu || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Elongation Rate Hard
                  </Typography>
                  <Typography>
                    {viewItem.elongation_rate_hard || "N/A"}
                  </Typography>
                </Grid>
              </Grid>

              {/* Gallery Images */}
              {viewItem.product_images &&
                viewItem.product_images.length > 0 && (
                  <>
                    <Divider sx={{ width: "100%", my: 2 }} />
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      alignSelf="flex-start"
                    >
                      Gallery Images
                    </Typography>
                    <Grid container spacing={2}>
                      {viewItem.product_images.map((img, idx) => (
                        <Grid item xs={6} sm={6} md={6} key={idx}>
                          <Avatar
                            src={`https://hogofilm.pythonanywhere.com${img}`}
                            variant="rounded"
                            sx={{ width: "100%", height: 120 }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </>
                )}

              {/* Installation Video */}
              {viewItem.installation_video_url && (
                <>
                  <Divider sx={{ width: "100%", my: 2 }} />
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    alignSelf="flex-start"
                  >
                    Installation Video
                  </Typography>
                  <Typography>
                    <a
                      href={viewItem.installation_video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#D20000" }}
                    >
                      {viewItem.installation_video_url}
                    </a>
                  </Typography>
                </>
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
        <Box sx={{ display: "flex" }}>
          <CommonSearchField
            value={searchQuery}
            placeholder="Search by product name.."
            onChange={(value) => setSearchQuery(value)}
          />
        </Box>
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
                "In Stocks",
                "Reserved Product",
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={28} />
                  <Typography variant="body2" mt={1}>
                    Loading products...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((p, i) => (
                <TableRow key={p.id} hover>
                  <TableCell>{(page - 1) * rowsPerPage + i + 1}</TableCell>
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
                  <TableCell>{p.stock_available}</TableCell>
                  <TableCell>{p.reserved_product}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Switch
                        checked={p.status}
                        onChange={() => handleStatusToggle(p)}
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
                      <Typography
                        variant="body2"
                        color={p.status ? "success.main" : "text.secondary"}
                      >
                        {p.status ? "Active" : "Inactive"}
                      </Typography>
                    </Box>
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
              ))
            )}
            {list.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={9} align="center">
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
