import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getGalleries,
  createGallery,
  updateGallery,
  deleteGallery,
} from "../../feature/gallery/galleryThunks";

import {
  selectGalleries,
  selectGalleryLoading,
  selectCreateGalleryLoading,
  selectUpdateGalleryLoading,
  selectDeleteGalleryLoading,
  selectGallerySuccess,
  selectGalleryError,
} from "../../feature/gallery/gallerySelectors";

import {
  Box,
  Typography,
  Stack,
  Grid,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Tooltip,
  Chip,
  Paper,
  InputAdornment,
  Skeleton,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import SearchIcon from "@mui/icons-material/Search";
import CollectionsIcon from "@mui/icons-material/Collections";
import SortIcon from "@mui/icons-material/Sort";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import CommonToast from "../../components/commonComponents/Toster";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const DARK_BG = "#0d0e36";
const HEADER_BG = "linear-gradient(90deg, #D20000 0%, #8B0000 100%)";
const SHADOW_SM = "0 2px 12px rgba(13,14,54,0.08)";
const SHADOW_MD = "0 8px 32px rgba(13,14,54,0.14)";
const SHADOW_LG = "0 20px 60px rgba(13,14,54,0.22)";

const CARD_RADIUS = "16px";
const DIALOG_RADIUS = "20px";

// ─── Shared field style ───────────────────────────────────────────────────────
const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    height: 46,
    fontSize: "0.875rem",
    bgcolor: "#f8fafc",
    "& fieldset": { borderColor: "#e2e8f0" },
    "&:hover fieldset": { borderColor: "#94a3b8" },
    "&.Mui-focused fieldset": { borderColor: "#D20000", borderWidth: 2 },
  },
  "& .MuiInputLabel-root": { fontSize: "0.875rem" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#D20000" },
};

// ─── Skeleton Card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <Box
    sx={{
      borderRadius: CARD_RADIUS,
      overflow: "hidden",
      bgcolor: "#fff",
      boxShadow: SHADOW_SM,
    }}
  >
    <Skeleton variant="rectangular" height={200} />
    <Box sx={{ p: 2 }}>
      <Skeleton width="60%" height={20} />
      <Skeleton width="40%" height={16} sx={{ mt: 0.5 }} />
    </Box>
  </Box>
);

// ─── Gallery Card ─────────────────────────────────────────────────────────────
const GalleryCard = ({ item, onEdit, onDelete, deleteLoading, deletingId }) => {
  const [hovered, setHovered] = useState(false);
  const isDeleting = deleteLoading && deletingId === item.id;

  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        borderRadius: CARD_RADIUS,
        overflow: "hidden",
        bgcolor: "#fff",
        boxShadow: hovered ? SHADOW_MD : SHADOW_SM,
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        position: "relative",
        border: "1px solid #f1f5f9",
      }}
    >
      {/* ── Image ── */}
      <Box sx={{ position: "relative", height: 200, overflow: "hidden" }}>
        <Box
          component="img"
          src={item.image}
          alt={item.name}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.4s ease",
            transform: hovered ? "scale(1.06)" : "scale(1)",
          }}
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
        {/* fallback */}
        <Box
          sx={{
            display: "none",
            width: "100%",
            height: "100%",
            bgcolor: "#f1f5f9",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 1,
            position: "absolute",
            top: 0,
          }}
        >
          <ImageIcon sx={{ fontSize: 40, color: "#cbd5e1" }} />
          <Typography variant="caption" color="text.secondary">
            No image
          </Typography>
        </Box>

        {/* Sequence badge */}
        <Box
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            bgcolor: DARK_BG,
            color: "#fff",
            borderRadius: "8px",
            px: 1.2,
            py: 0.3,
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.04em",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          {item.gallery_sequence}
        </Box>

        {/* Hover overlay with actions */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(13,14,54,0.82) 0%, transparent 55%)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.25s ease",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "flex-end",
            p: 1.5,
            gap: 1,
          }}
        >
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => onEdit(item)}
              sx={{
                bgcolor: "#fff",
                color: DARK_BG,
                width: 34,
                height: 34,
                "&:hover": { bgcolor: "#fef9c3", transform: "scale(1.1)" },
                transition: "all 0.15s",
              }}
            >
              <EditIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => onDelete(item.id)}
              disabled={isDeleting}
              sx={{
                bgcolor: "#fff",
                color: "#D20000",
                width: 34,
                height: 34,
                "&:hover": { bgcolor: "#fef2f2", transform: "scale(1.1)" },
                transition: "all 0.15s",
              }}
            >
              {isDeleting ? (
                <CircularProgress size={14} sx={{ color: "#D20000" }} />
              ) : (
                <DeleteIcon sx={{ fontSize: 16 }} />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* ── Info ── */}
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography
          variant="body2"
          fontWeight={700}
          color={DARK_BG}
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {item.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Sequence · {item.gallery_sequence}
        </Typography>
      </Box>
    </Box>
  );
};

// ─── Upload Zone ──────────────────────────────────────────────────────────────
const UploadZone = ({ preview, existingUrl, onFileChange, fileInputRef }) => {
  const [dragging, setDragging] = useState(false);
  const activeSrc = preview || existingUrl || null;

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) onFileChange(file);
  };

  return (
    <Box
      onClick={() => fileInputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      sx={{
        height: 200,
        borderRadius: "14px",
        border: `2px dashed ${dragging ? "#D20000" : activeSrc ? "#D20000" : "#cbd5e1"}`,
        overflow: "hidden",
        cursor: "pointer",
        bgcolor: dragging ? "#fff5f5" : "#f8fafc",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        transition: "all 0.2s",
        "&:hover": { borderColor: "#D20000", bgcolor: "#fff5f5" },
      }}
    >
      {activeSrc ? (
        <>
          <Box
            component="img"
            src={activeSrc}
            alt="preview"
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          {/* hover overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              bgcolor: "rgba(210,0,0,0.55)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0,
              transition: "opacity 0.2s",
              "&:hover": { opacity: 1 },
            }}
          >
            <CloudUploadIcon sx={{ color: "#fff", fontSize: 32, mb: 0.5 }} />
            <Typography variant="caption" fontWeight={700} color="#fff">
              Click or drag to replace
            </Typography>
          </Box>
        </>
      ) : (
        <>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: "14px",
              bgcolor: dragging ? "#fef2f2" : "#f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1.5,
              transition: "all 0.2s",
            }}
          >
            <CloudUploadIcon
              sx={{ fontSize: 26, color: dragging ? "#D20000" : "#94a3b8" }}
            />
          </Box>
          <Typography
            variant="body2"
            fontWeight={600}
            color={dragging ? "#D20000" : "#475569"}
          >
            {dragging ? "Drop image here" : "Click or drag image"}
          </Typography>
          <Typography variant="caption" color="#94a3b8" mt={0.4}>
            PNG, JPG, WEBP supported
          </Typography>
        </>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => onFileChange(e.target.files?.[0] || null)}
      />
    </Box>
  );
};

// ─── Form Dialog ──────────────────────────────────────────────────────────────
const GalleryFormDialog = ({
  open,
  onClose,
  editItem,
  dispatch,
  createLoading,
  updateLoading,
  onSuccess,
}) => {
  const fileInputRef = useRef(null);

  const emptyForm = { name: "", gallery_sequence: "", image: null };
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const isEdit = !!editItem;
  const isLoading = isEdit ? updateLoading : createLoading;

  // populate on edit
  useEffect(() => {
    if (open) {
      if (editItem) {
        setForm({
          name: editItem.name || "",
          gallery_sequence: editItem.gallery_sequence ?? "",
          image: null,
        });
      } else {
        setForm(emptyForm);
      }
      setPreview(null);
      setErrors({});
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [open, editItem]);

  // cleanup blob preview
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFileChange = (file) => {
    if (preview) URL.revokeObjectURL(preview);
    if (file) {
      setPreview(URL.createObjectURL(file));
      handleChange("image", file);
    } else {
      setPreview(null);
      handleChange("image", null);
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (form.gallery_sequence === "" || form.gallery_sequence === null)
      errs.gallery_sequence = "Sequence is required";
    if (!isEdit && !form.image) errs.image = "Image is required";
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    const fd = new FormData();
    fd.append("name", form.name.trim());
    fd.append("gallery_sequence", form.gallery_sequence);
    if (form.image) fd.append("image", form.image);

    const action = isEdit
      ? dispatch(updateGallery({ id: editItem.id, data: fd }))
      : dispatch(createGallery(fd));

    action
      .unwrap()
      .then(() => {
        CommonToast(
          isEdit
            ? "Gallery updated successfully"
            : "Gallery created successfully",
          "success",
        );
        onSuccess();
        onClose();
      })
      .catch(() =>
        CommonToast(
          isEdit ? "Failed to update gallery" : "Failed to create gallery",
          "error",
        ),
      );
  };

  const existingUrl = isEdit ? editItem?.image : null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: DIALOG_RADIUS,
          overflow: "hidden",
          boxShadow: SHADOW_LG,
        },
      }}
    >
      {/* ── Header ── */}
      <Box
        sx={{
          background: HEADER_BG,
          px: 3,
          py: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "10px",
              bgcolor: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CollectionsIcon sx={{ color: "#fff", fontSize: 20 }} />
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              color="#fff"
              lineHeight={1.2}
            >
              {isEdit ? "Edit Gallery Item" : "Add Gallery Item"}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "rgba(255,255,255,0.65)" }}
            >
              {isEdit
                ? `Editing: ${editItem?.name}`
                : "Upload a new image to gallery"}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: "rgba(255,255,255,0.7)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.15)", color: "#fff" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 3, bgcolor: "#f8fafc" }}>
        <Stack spacing={2.5}>
          {/* Upload zone */}
          <Box>
            <Typography
              variant="caption"
              fontWeight={700}
              color="#64748b"
              letterSpacing="0.08em"
              display="block"
              mb={1}
              sx={{ textTransform: "uppercase", fontSize: "0.68rem" }}
            >
              Gallery Image{" "}
              {!isEdit && <span style={{ color: "#D20000" }}>*</span>}
            </Typography>
            <UploadZone
              preview={preview}
              existingUrl={existingUrl}
              onFileChange={handleFileChange}
              fileInputRef={fileInputRef}
            />
            {errors.image && (
              <Typography
                variant="caption"
                color="error"
                mt={0.5}
                display="block"
              >
                {errors.image}
              </Typography>
            )}
            {form.image && (
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                mt={1}
              >
                <Typography variant="caption" color="#10b981" fontWeight={600}>
                  ✓ {form.image.name}
                </Typography>
                <Button
                  size="small"
                  color="error"
                  onClick={() => {
                    handleFileChange(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  sx={{
                    fontSize: "0.72rem",
                    textTransform: "none",
                    minWidth: 0,
                    px: 1,
                  }}
                >
                  Remove
                </Button>
              </Stack>
            )}
            {isEdit && !form.image && existingUrl && (
              <Typography
                variant="caption"
                color="#94a3b8"
                mt={0.5}
                display="block"
              >
                Leave empty to keep current image
              </Typography>
            )}
          </Box>

          {/* Name & Sequence row */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={7}>
              <TextField
                label="Gallery Name *"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                fullWidth
                size="small"
                error={!!errors.name}
                helperText={errors.name}
                sx={fieldSx}
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                label="Sequence *"
                value={form.gallery_sequence}
                onChange={(e) =>
                  handleChange("gallery_sequence", e.target.value)
                }
                fullWidth
                size="small"
                type="number"
                inputProps={{ min: 1 }}
                error={!!errors.gallery_sequence}
                helperText={errors.gallery_sequence}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SortIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                }}
                sx={fieldSx}
              />
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>

      {/* ── Footer ── */}
      <Box
        sx={{
          px: 3,
          py: 2,
          bgcolor: "#fff",
          borderTop: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "flex-end",
          gap: 1.5,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            height: 42,
            borderColor: "#e2e8f0",
            color: "#64748b",
            "&:hover": { borderColor: "#94a3b8", bgcolor: "#f8fafc" },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading}
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 700,
            px: 3.5,
            height: 42,
            background: HEADER_BG,
            boxShadow: "0 4px 14px rgba(210,0,0,0.28)",
            "&:hover": { boxShadow: "0 6px 20px rgba(210,0,0,0.4)" },
            "&.Mui-disabled": { opacity: 0.6 },
          }}
        >
          {isLoading ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={14} sx={{ color: "#fff" }} />
              <span>{isEdit ? "Updating…" : "Creating…"}</span>
            </Stack>
          ) : isEdit ? (
            "Update"
          ) : (
            "Add to Gallery"
          )}
        </Button>
      </Box>
    </Dialog>
  );
};

// ─── Delete Confirm Dialog ─────────────────────────────────────────────────────
const DeleteConfirmDialog = ({ open, onClose, onConfirm, loading }) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="xs"
    fullWidth
    PaperProps={{ sx: { borderRadius: "16px", overflow: "hidden" } }}
  >
    <Box sx={{ background: HEADER_BG, px: 3, py: 2 }}>
      <Typography variant="subtitle1" fontWeight={700} color="#fff">
        Delete Gallery Item
      </Typography>
    </Box>
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: "14px",
          bgcolor: "#fef2f2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
        }}
      >
        <DeleteIcon sx={{ fontSize: 28, color: "#D20000" }} />
      </Box>
      <Typography variant="body1" fontWeight={700} color={DARK_BG} mb={0.5}>
        Are you sure?
      </Typography>
      <Typography variant="body2" color="#64748b">
        This gallery item will be permanently deleted and cannot be recovered.
      </Typography>
    </Box>
    <Box
      sx={{
        px: 3,
        pb: 3,
        display: "flex",
        justifyContent: "flex-end",
        gap: 1.5,
      }}
    >
      <Button
        onClick={onClose}
        variant="outlined"
        sx={{
          borderRadius: "10px",
          textTransform: "none",
          fontWeight: 600,
          borderColor: "#e2e8f0",
          color: "#64748b",
          "&:hover": { borderColor: "#94a3b8" },
        }}
      >
        Cancel
      </Button>
      <Button
        onClick={onConfirm}
        variant="contained"
        disabled={loading}
        sx={{
          borderRadius: "10px",
          textTransform: "none",
          fontWeight: 700,
          background: HEADER_BG,
          boxShadow: "0 4px 14px rgba(210,0,0,0.28)",
        }}
      >
        {loading ? (
          <Stack direction="row" spacing={1} alignItems="center">
            <CircularProgress size={14} sx={{ color: "#fff" }} />
            <span>Deleting…</span>
          </Stack>
        ) : (
          "Yes, Delete"
        )}
      </Button>
    </Box>
  </Dialog>
);

// ─── Main Gallery Page ────────────────────────────────────────────────────────
const Gallery = () => {
  const dispatch = useDispatch();

  const galleries = useSelector(selectGalleries);
  const loading = useSelector(selectGalleryLoading);
  const createLoading = useSelector(selectCreateGalleryLoading);
  const updateLoading = useSelector(selectUpdateGalleryLoading);
  const deleteLoading = useSelector(selectDeleteGalleryLoading);
  const success = useSelector(selectGallerySuccess);

  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // fetch on mount
  useEffect(() => {
    dispatch(getGalleries());
  }, [dispatch]);

  // refresh after create/update
  useEffect(() => {
    if (success) dispatch(getGalleries());
  }, [success, dispatch]);

  const handleOpenCreate = () => {
    setEditItem(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditItem(item);
    setFormOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setDeleteDialog({ open: true, id });
  };

  const handleDeleteConfirm = () => {
    dispatch(deleteGallery(deleteDialog.id))
      .unwrap()
      .then(() => {
        CommonToast("Gallery item deleted", "success");
        setDeleteDialog({ open: false, id: null });
        setDeletingId(null);
        dispatch(getGalleries());
      })
      .catch(() => {
        CommonToast("Failed to delete gallery item", "error");
        setDeleteDialog({ open: false, id: null });
        setDeletingId(null);
      });
  };

  const filteredGalleries = galleries.filter((g) =>
    g.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Box>
      {/* ── Page Header ── */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
        flexWrap="wrap"
        gap={2}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{ width: 5, height: 32, bgcolor: "#D20000", borderRadius: 1 }}
          />
          <Box>
            <Typography
              variant="h5"
              fontWeight={800}
              color={DARK_BG}
              lineHeight={1.1}
            >
              Gallery
            </Typography>
            {/* <Typography variant="caption" color="#94a3b8">
              {galleries.length} item{galleries.length !== 1 ? "s" : ""} total
            </Typography> */}
          </Box>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={{
            background: HEADER_BG,
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 700,
            px: 2.5,
            height: 42,
            boxShadow: "0 4px 14px rgba(210,0,0,0.28)",
            "&:hover": { boxShadow: "0 6px 20px rgba(210,0,0,0.4)" },
          }}
        >
          Add Image
        </Button>
      </Stack>

      {/* ── Toolbar ── */}
      <Paper
        sx={{
          borderRadius: "14px",
          boxShadow: SHADOW_SM,
          border: "1px solid #e2e8f0",
          p: 2,
          mb: 3,
          bgcolor: "#fff",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          flexWrap="wrap"
          gap={1}
        >
          <TextField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search gallery…"
            size="small"
            sx={{
              flex: 1,
              minWidth: 220,
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                height: 40,
                fontSize: "0.875rem",
                bgcolor: "#f8fafc",
                "& fieldset": { borderColor: "#e2e8f0" },
                "&:hover fieldset": { borderColor: "#94a3b8" },
                "&.Mui-focused fieldset": { borderColor: "#D20000" },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Stats chips */}
          <Chip
            icon={<CollectionsIcon sx={{ fontSize: "14px !important" }} />}
            label={`${filteredGalleries.length} shown`}
            size="small"
            sx={{
              bgcolor: "#f1f5f9",
              color: DARK_BG,
              fontWeight: 700,
              fontSize: "0.72rem",
              height: 28,
            }}
          />
        </Stack>
      </Paper>

      {/* ── Grid ── */}
      {loading ? (
        <Grid container spacing={2.5}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <SkeletonCard />
            </Grid>
          ))}
        </Grid>
      ) : filteredGalleries.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 10,
            px: 3,
            bgcolor: "#fff",
            borderRadius: "16px",
            border: "1px dashed #cbd5e1",
            boxShadow: SHADOW_SM,
          }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: "18px",
              bgcolor: "#f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
            }}
          >
            <CollectionsIcon sx={{ fontSize: 36, color: "#cbd5e1" }} />
          </Box>
          <Typography variant="h6" fontWeight={700} color={DARK_BG} mb={0.5}>
            {search ? "No results found" : "No gallery items yet"}
          </Typography>
          <Typography variant="body2" color="#94a3b8" mb={3}>
            {search
              ? `No items match "${search}"`
              : "Start building your gallery by adding your first image."}
          </Typography>
          {!search && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreate}
              sx={{
                background: HEADER_BG,
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 700,
                px: 3,
                height: 42,
                boxShadow: "0 4px 14px rgba(210,0,0,0.28)",
              }}
            >
              Add First Image
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={2.5}>
          {filteredGalleries.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <GalleryCard
                item={item}
                onEdit={handleOpenEdit}
                onDelete={handleDeleteClick}
                deleteLoading={deleteLoading}
                deletingId={deletingId}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* ── Form Dialog ── */}
      <GalleryFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        editItem={editItem}
        dispatch={dispatch}
        createLoading={createLoading}
        updateLoading={updateLoading}
        onSuccess={() => dispatch(getGalleries())}
      />

      {/* ── Delete Confirm ── */}
      <DeleteConfirmDialog
        open={deleteDialog.open}
        onClose={() => {
          setDeleteDialog({ open: false, id: null });
          setDeletingId(null);
        }}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </Box>
  );
};

export default Gallery;
