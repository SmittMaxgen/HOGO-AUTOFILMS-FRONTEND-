import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getColors,
  createColor,
  updateColor,
  deleteColor,
} from "../../feature/color/colorThunks";
import {
  selectColors,
  selectColorLoading,
  selectCreateColorLoading,
  selectCreateColorSuccess,
  selectUpdateColorLoading,
  selectUpdateColorSuccess,
  selectDeleteColorLoading,
} from "../../feature/color/colorSelector";

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

const Color = () => {
  const dispatch = useDispatch();
  const colors = useSelector(selectColors);
  const loading = useSelector(selectColorLoading);
  const createLoading = useSelector(selectCreateColorLoading);
  const createSuccess = useSelector(selectCreateColorSuccess);
  const updateLoading = useSelector(selectUpdateColorLoading);
  const updateSuccess = useSelector(selectUpdateColorSuccess);

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  // Form state
  const [form, setForm] = useState({
    colour_name: "",
    status: true,
  });

  const [errors, setErrors] = useState({});

  // Fetch colors
  useEffect(() => {
    dispatch(getColors());
  }, [dispatch]);

  // Refresh list on successful creation or update
  useEffect(() => {
    if (createSuccess || updateSuccess) {
      dispatch(getColors());
      handleClose();
    }
  }, [createSuccess, updateSuccess, dispatch]);

  const handleOpen = () => {
    setIsEdit(false);
    setEditId(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setForm({ colour_name: "", status: true });
    setErrors({});
    setIsEdit(false);
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
    if (!form.colour_name) temp.colour_name = "Color name is required";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (isEdit && editId) {
      // Update existing color
      dispatch(updateColor({ id: editId, data: form }));
    } else {
      // Create new color
      dispatch(createColor(form));
    }
  };

  const handleEdit = (color) => {
    setIsEdit(true);
    setEditId(color.id);
    setForm({
      colour_name: color.colour_name,
      status: color.status,
    });
    setOpen(true);
  };
  const deleteLoading = useSelector(selectDeleteColorLoading);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this color?")) {
      dispatch(deleteColor(id))
        .unwrap()
        .then(() => {
          dispatch(getColors()); // refresh list after deletion
        })
        .catch((err) => console.error(err));
    }
  };
  const paginatedData = colors?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Colors</Typography>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          {isEdit ? "Edit Color" : "Create Color"}
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr.No</TableCell>
              <TableCell>Color Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData?.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                <TableCell>
                  <Typography fontWeight={600}>{item.colour_name}</Typography>
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
            {colors?.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No colors found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack alignItems="flex-end" mt={3}>
        <Pagination
          count={Math.ceil(colors?.length / rowsPerPage)}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Stack>

      {/* Create/Edit Color Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{isEdit ? "Edit Color" : "Create Color"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Color Name"
              name="colour_name"
              value={form.colour_name}
              onChange={handleChange}
              error={!!errors.colour_name}
              helperText={errors.colour_name}
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
              ? "Saving..."
              : isEdit
                ? "Update"
                : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Color;
