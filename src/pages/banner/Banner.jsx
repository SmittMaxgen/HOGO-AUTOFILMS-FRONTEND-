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
  TextField,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams } from "react-router-dom";
import Loader from "../../components/commonComponents/Loader";
import CommonButton from "../../components/commonComponents/CommonButton";
import CommonLabel from "../../components/commonComponents/CommonLabel";

const Banner = () => {
  const dispatch = useDispatch();
  const banners = useSelector(selectBannerList);
  const loading = useSelector(selectBannerLoading);

  const { id } = useParams();

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const [imageLoaded, setImageLoaded] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [isViewing, setIsViewing] = useState(false);
  const [viewBanner, setViewBanner] = useState(null);

  const [form, setForm] = useState({
    title: "",
    image: null,
    CTA_text: "",
    CTA_link: "",
    order: 1,
    status: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getBanners());
  }, [dispatch]);

  /* ================= HANDLERS ================= */

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
    if (!form.title) temp.title = "Title is required";
    if (!form.image && !editId) temp.image = "Image is required";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const resetForm = () => {
    setForm({
      title: "",
      image: null,
      CTA_text: "",
      CTA_link: "",
      order: 1,
      status: true,
    });
    setErrors({});
    setEditId(null);
    setIsEditing(false);
  };
  const handleStatusToggle = (item) => {
    const data = new FormData();
    data.append("status", !item.status);

    dispatch(
      updateBanner({
        id: item.id,
        data,
      }),
    )
      .unwrap()
      .then(() => {
        dispatch(getBanners());
      })
      .catch(console.error);
  };
  const handleView = (banner) => {
    setViewBanner(banner);
    setIsViewing(true);
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const data = new FormData();
    data.append("title", form.title);
    if (form.image) data.append("image", form.image);
    data.append("CTA_text", form.CTA_text);
    data.append("CTA_link", form.CTA_link);
    data.append("order", form.order);
    data.append("status", form.status);

    const action = editId
      ? updateBanner({ id: editId, data })
      : createBanner(data);

    dispatch(action)
      .unwrap()
      .then(() => {
        resetForm();
        dispatch(getBanners());
      })
      .catch(console.error);
  };

  const handleEdit = (banner) => {
    setEditId(banner.id);
    setForm({
      title: banner.title || "",
      image: null,
      CTA_text: banner.CTA_text || "",
      CTA_link: banner.CTA_link || "",
      order: banner.order || 1,
      status: banner.status ?? true,
    });
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;

    dispatch(deleteBanner(id))
      .unwrap()
      .then(() => dispatch(getBanners()))
      .catch(console.error);
  };
  const handleAddBanner = () => {
    resetForm();
    setIsEditing(true);
  };
  const paginatedData = banners.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  if (loading) return <Loader text="Loading banners..." fullScreen={true} />;

  if (isEditing) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Box width="100%" maxWidth={700}>
          {/* Header */}
          <Stack direction="row" alignItems="center" spacing={1} mb={3}>
            <IconButton onClick={resetForm}>
              <ArrowBackIcon />
            </IconButton>
            <CommonLabel>
              {editId ? "Edit Banner" : "Create Banner"}
            </CommonLabel>
          </Stack>

          {/* Form */}
          <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
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
                <CommonLabel>
                  {editId ? "Change Image" : "Upload Image"}
                </CommonLabel>
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

              {form.image && (
                <Typography variant="body2">
                  Selected: {form.image.name}
                </Typography>
              )}

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

              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Button onClick={resetForm}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit}>
                  Save
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Box>
      </Box>
    );
  }
  if (isViewing && viewBanner) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Box width="100%" maxWidth={700}>
          <Stack direction="row" alignItems="center" spacing={1} mb={3}>
            <IconButton
              onClick={() => {
                setIsViewing(false);
                setViewBanner(null);
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <CommonLabel>View Banner</CommonLabel>
          </Stack>

          <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
              <TextField
                label="Title"
                value={viewBanner.title}
                fullWidth
                InputProps={{ readOnly: true }}
              />

              {viewBanner.image && (
                <Box>
                  <Typography variant="subtitle2">Banner Image</Typography>
                  <Avatar
                    src={`https://hogofilm.pythonanywhere.com/${viewBanner.image}`}
                    variant="rounded"
                    sx={{ width: 200, height: 100, mt: 1 }}
                  />
                </Box>
              )}

              <TextField
                label="CTA Text"
                value={viewBanner.CTA_text}
                fullWidth
                InputProps={{ readOnly: true }}
              />

              <TextField
                label="CTA Link"
                value={viewBanner.CTA_link}
                fullWidth
                InputProps={{ readOnly: true }}
              />

              <TextField
                label="Order"
                value={viewBanner.order}
                fullWidth
                InputProps={{ readOnly: true }}
              />

              <FormControlLabel
                control={<Checkbox checked={viewBanner.status} disabled />}
                label="Active"
              />
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
          Banners
        </Typography>
        <CommonButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleAddBanner()}
        >
          Add Banner
        </CommonButton>
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
                {/* <TableCell>
                  <Avatar
                    // src={item.image}

                    src={`https://hogofilm.pythonanywhere.com/${item?.image}`}
                    variant="rounded"
                    sx={{ width: 80, height: 45 }}
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
                      src={`https://hogofilm.pythonanywhere.com/${item?.image}`}
                      variant="rounded"
                      sx={{ width: 48, height: 48 }}
                      imgProps={{
                        onLoad: () => setImageLoaded(true),
                        onError: () => setImageLoaded(true),
                      }}
                    />
                  </Box>
                </TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.CTA_text}</TableCell>
                <TableCell>
                  <Chip
                    label={item.status ? "Active" : "Inactive"}
                    size="small"
                    color={item.status ? "success" : "default"}
                    clickable
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleStatusToggle(item)}
                  />
                </TableCell>
                <TableCell align="center">
                  {/* <IconButton color="primary">
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
                  </IconButton> */}
                  <IconButton color="primary" onClick={() => handleView(item)}>
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
        />
      </Stack>
    </Box>
  );
};

export default Banner;
