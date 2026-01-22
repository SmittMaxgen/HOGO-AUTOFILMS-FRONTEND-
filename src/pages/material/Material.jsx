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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  IconButton,
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

import Loader from "../../components/commonComponents/Loader";
const Material = () => {
  const dispatch = useDispatch();
  const materials = useSelector(selectMaterials);
  const loading = useSelector(selectMaterialLoading);
  const createLoading = useSelector(selectCreateMaterialLoading);
  const updateLoading = useSelector(selectUpdateMaterialLoading);
  const createSuccess = useSelector(selectCreateMaterialSuccess);

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  // Dialog open
  const [open, setOpen] = useState(false);

  // Form state
  const [form, setForm] = useState({
    title: "",
    status: true,
  });

  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null); // store id for editing

  useEffect(() => {
    dispatch(getMaterials());
  }, [dispatch]);

  // Refresh list on successful creation
  useEffect(() => {
    if (createSuccess) {
      dispatch(getMaterials());
      handleClose();
    }
  }, [createSuccess, dispatch]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setForm({ title: "", status: true });
    setErrors({});
    setEditId(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const temp = {};
    if (!form.title) temp.title = "Material name is required";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // Handle create or update submit
  const handleSubmit = () => {
    if (!validate()) return;

    if (editId) {
      // Update material
      const payload = { id: editId, data: form };
      dispatch(updateMaterials(payload))
        .unwrap()
        .then(() => {
          dispatch(getMaterials());
          handleClose();
        })
        .catch((err) => console.error(err));
    } else {
      // Create material
      dispatch(createMaterials(form));
    }
  };

  const handleEdit = (item) => {
    setForm({ title: item.title, status: item.status });
    setEditId(item.id);
    handleOpen();
  };
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this material?")) {
      dispatch(deleteMaterials(id))
        .unwrap()
        .then(() => {
          dispatch(getMaterials()); // refresh list after deletion
        })
        .catch((err) => console.error(err));
    }
  };
  const paginatedData = materials.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  if (loading)
    return (
      <Typography>
        <Loader text="Materials Loading ..." />
      </Typography>
    );

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Materials</Typography>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          {editId ? "Edit Material" : "Create Material"}
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr.No</TableCell>
              <TableCell>Material Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                <TableCell>
                  <Typography fontWeight={600}>{item.title}</Typography>
                </TableCell>
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

            {materials.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No materials found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Stack alignItems="flex-end" mt={3}>
        <Pagination
          count={Math.ceil(materials.length / rowsPerPage)}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Stack>

      {/* Create / Edit Material Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editId ? "Edit Material" : "Create Material"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Material Name"
              name="title"
              value={form.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
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
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={createLoading || updateLoading}
          >
            {createLoading || updateLoading
              ? editId
                ? "Updating..."
                : "Saving..."
              : editId
                ? "Update"
                : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Material;
