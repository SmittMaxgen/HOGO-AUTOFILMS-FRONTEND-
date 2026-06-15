import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../../feature/testimonials/testimonialThunks";

import {
  selectTestimonials,
  selectTestimonialsLoading,
  selectCreateTestimonialLoading,
  selectCreateTestimonialSuccess,
  selectUpdateTestimonialLoading,
  selectUpdateTestimonialSuccess,
  selectDeleteTestimonialLoading,
  selectTestimonialError,
} from "../../feature/testimonials/testimonialSelector"; // or testimonialSelector if separate

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
  Chip,
  Pagination,
  CircularProgress,
  Rating,
  Avatar,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";

import CommonButton from "../../components/commonComponents/CommonButton";
import CommonToast from "../../components/commonComponents/Toster";
import CommonSearchField from "../../components/commonComponents/CommonSearchField";

// Dialogs
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

// ─── Main Component ────────────────────────────────────────────────────────────

const Testimonials = () => {
  const dispatch = useDispatch();

  const testimonialsData = useSelector(selectTestimonials);

  // Robust array extraction
  const testimonials = Array.isArray(testimonialsData?.data)
    ? testimonialsData.data
    : Array.isArray(testimonialsData)
      ? testimonialsData
      : [];

  const totalPages = testimonialsData?.total_pages || 1;
  const currentPage = testimonialsData?.current_page || 1;

  const loading = useSelector(selectTestimonialsLoading);
  const createLoading = useSelector(selectCreateTestimonialLoading);
  const createSuccess = useSelector(selectCreateTestimonialSuccess);
  const updateLoading = useSelector(selectUpdateTestimonialLoading);
  const updateSuccess = useSelector(selectUpdateTestimonialSuccess);
  const deleteLoading = useSelector(selectDeleteTestimonialLoading);
  const error = useSelector(selectTestimonialError);

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isViewing, setIsViewing] = useState(false);
  const [viewTestimonial, setViewTestimonial] = useState(null);

  const [form, setForm] = useState({
    name: "",
    image: null,
    description: "",
    rating: 5,
  });

  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch Testimonials
  const fetchTestimonials = () => {
    dispatch(getTestimonials({ page, search: searchQuery }));
  };

  useEffect(() => {
    fetchTestimonials();
  }, [dispatch, page, searchQuery]);

  useEffect(() => {
    if (createSuccess || updateSuccess) {
      fetchTestimonials();
      handleReset();
    }
  }, [createSuccess, updateSuccess]);

  // Validation
  const validate = () => {
    const temp = {};
    if (!form.name) temp.name = "Name is required";
    if (!form.description) temp.description = "Description is required";
    if (!editId && !form.image) temp.image = "Image is required";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // Handle Submit (Create / Update)
  const handleSubmit = () => {
    if (!validate()) return;

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("rating", form.rating);

    if (form.image) {
      formData.append("image", form.image);
    }

    if (isEditing && editId) {
      dispatch(updateTestimonial({ id: editId, data: formData }))
        .unwrap()
        .then(() => CommonToast("Testimonial updated successfully", "success"))
        .catch(() => CommonToast("Failed to update testimonial", "error"));
    } else {
      dispatch(createTestimonial(formData))
        .unwrap()
        .then(() => CommonToast("Testimonial created successfully", "success"))
        .catch(() =>
          CommonToast(error || "Failed to create testimonial", "error"),
        );
    }
  };

  // Edit
  const handleEdit = (testimonial) => {
    setIsEditing(true);
    setEditId(testimonial.id);
    setForm({
      name: testimonial.name || "",
      description: testimonial.description || "",
      rating: testimonial.rating || 5,
      image: null,
    });
    setPreviewImage(
      testimonial.image
        ? `https://admin.hogonnindia.com${testimonial.image}`
        : null,
    );
  };

  // View
  const handleView = (testimonial) => {
    setViewTestimonial(testimonial);
    setIsViewing(true);
  };

  // Delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      dispatch(deleteTestimonial(id))
        .unwrap()
        .then(() => {
          CommonToast("Testimonial deleted successfully", "success");
          fetchTestimonials(); // Refresh list after delete
        })
        .catch(() => CommonToast("Failed to delete testimonial", "error"));
    }
  };

  // Reset Form
  const handleReset = () => {
    setIsEditing(false);
    setEditId(null);
    setIsViewing(false);
    setViewTestimonial(null);
    setForm({ name: "", image: null, description: "", rating: 5 });
    setPreviewImage(null);
    setErrors({});
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // ── Create / Edit View ───────────────────────────────────────────────────────
  if (isEditing) {
    return (
      <Box mt={4}>
        <PageHeader
          title={editId ? "Edit Testimonial" : "Create Testimonial"}
          onBack={handleReset}
        />

        <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden", p: 4 }}>
          <Stack spacing={3}>
            <TextField
              label="Name"
              fullWidth
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={!!errors.name}
              helperText={errors.name}
            />

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              error={!!errors.description}
              helperText={errors.description}
            />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Rating
              </Typography>
              <Rating
                value={form.rating}
                onChange={(_, newValue) =>
                  setForm({ ...form, rating: newValue })
                }
                size="large"
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Testimonial Image
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ marginBottom: 8 }}
              />
              {previewImage && (
                <Box mt={2}>
                  <img
                    src={previewImage}
                    alt="Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: 200,
                      borderRadius: 8,
                    }}
                  />
                </Box>
              )}
            </Box>

            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <CommonButton variant="outlined" onClick={handleReset}>
                Cancel
              </CommonButton>
              <CommonButton
                variant="contained"
                onClick={handleSubmit}
                disabled={createLoading || updateLoading}
                sx={{ bgcolor: "#D20000", "&:hover": { bgcolor: "#a80000" } }}
              >
                {createLoading || updateLoading
                  ? "Saving..."
                  : editId
                    ? "Update Testimonial"
                    : "Create Testimonial"}
              </CommonButton>
            </Stack>
          </Stack>
        </Paper>
      </Box>
    );
  }

  // ── View Detail ──────────────────────────────────────────────────────────────
  if (isViewing && viewTestimonial) {
    return (
      <Box mt={4}>
        <PageHeader title="Testimonial Details" onBack={handleReset} />

        <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
          <Box p={4} textAlign="center">
            <Avatar
              src={`https://admin.hogonnindia.com${viewTestimonial.image}`}
              sx={{
                width: 120,
                height: 120,
                mx: "auto",
                mb: 3,
                border: "4px solid #D20000",
              }}
            />
            <Typography variant="h5" fontWeight={700} gutterBottom>
              {viewTestimonial.name}
            </Typography>

            <Rating
              value={viewTestimonial.rating}
              readOnly
              size="large"
              sx={{ mb: 2 }}
            />

            <Typography
              variant="body1"
              sx={{ mt: 2, textAlign: "left", maxWidth: 600, mx: "auto" }}
            >
              {viewTestimonial.description}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 3, display: "block" }}
            >
              Created on:{" "}
              {new Date(viewTestimonial.created_at).toLocaleDateString()}
            </Typography>
          </Box>
        </Paper>
      </Box>
    );
  }

  // ── List View ────────────────────────────────────────────────────────────────
  return (
    <Box>
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
            Testimonials
          </Typography>
        </Box>

        <CommonButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsEditing(true)}
          sx={{
            bgcolor: "#D20000",
            "&:hover": { bgcolor: "#a80000" },
            fontWeight: 700,
          }}
        >
          Add Testimonial
        </CommonButton>
      </Stack>

      <Paper elevation={2} sx={{ borderRadius: 3, overflow: "hidden" }}>
        {/* Search */}
        <Box
          sx={{
            px: 2,
            py: 2,
            bgcolor: "#fafafa",
            borderBottom: "1px solid #ebebeb",
          }}
        >
          <CommonSearchField
            value={searchQuery}
            placeholder="Search testimonials..."
            onChange={setSearchQuery}
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
                {[
                  "Sr",
                  "Image",
                  "Name",
                  "Rating",
                  "Description",
                  "Actions",
                ].map((h) => (
                  <TableCell
                    key={h}
                    sx={{ fontWeight: 700, color: "#fff", py: 1.5 }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <CircularProgress sx={{ color: "#D20000" }} />
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                testimonials.length > 0 &&
                Array.isArray(testimonials) &&
                testimonials.map((t, index) => (
                  <TableRow key={t.id} hover>
                    <TableCell>{(currentPage - 1) * 10 + index + 1}</TableCell>
                    <TableCell>
                      <Avatar
                        src={`https://admin.hogonnindia.com${t.image}`}
                        variant="rounded"
                        sx={{ width: 60, height: 60 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={600}>{t.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Rating value={t.rating} readOnly size="small" />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: 300,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {t.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        <IconButton
                          size="small"
                          onClick={() => handleView(t)}
                          sx={{ color: "#1565c0" }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(t)}
                          sx={{ color: "#f57c00" }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(t.id)}
                          sx={{ color: "#c62828" }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}

              {!loading && testimonials.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">
                      No testimonials found
                    </Typography>
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
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      </Paper>
    </Box>
  );
};

// Reusable PageHeader Component
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
    <Typography variant="h6" fontWeight={700} color="#fff">
      {title}
    </Typography>
  </Box>
);

export default Testimonials;
