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
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Loader from "../../components/commonComponents/Loader";

const Color = () => {
  const dispatch = useDispatch();
  const colors = useSelector(selectColors);
  const loading = useSelector(selectColorLoading);
  const createLoading = useSelector(selectCreateColorLoading);
  const createSuccess = useSelector(selectCreateColorSuccess);
  const updateLoading = useSelector(selectUpdateColorLoading);
  const updateSuccess = useSelector(selectUpdateColorSuccess);
  const deleteLoading = useSelector(selectDeleteColorLoading);

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({ colour_name: "", status: true });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getColors());
  }, [dispatch]);

  useEffect(() => {
    if (createSuccess || updateSuccess) {
      dispatch(getColors());
      handleReset();
    }
  }, [createSuccess, updateSuccess, dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    const temp = {};
    if (!form.colour_name) temp.colour_name = "Color name is required";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleStatusToggle = (item) => {
    const data = new FormData();
    data.append("status", !item.status);

    dispatch(
      updateColor({
        id: item.id,
        data,
      }),
    )
      .unwrap()
      .then(() => {
        dispatch(getColors());
      })
      .catch(console.error);
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (isEditing && editId) {
      dispatch(updateColor({ id: editId, data: form }));
    } else {
      dispatch(createColor(form));
    }
  };

  const handleEdit = (color) => {
    setIsEditing(true);
    setEditId(color.id);
    setForm({ colour_name: color.colour_name, status: color.status });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this color?")) {
      dispatch(deleteColor(id))
        .unwrap()
        .then(() => dispatch(getColors()))
        .catch(console.error);
    }
  };

  const handleReset = () => {
    setForm({ colour_name: "", status: true });
    setErrors({});
    setEditId(null);
    setIsEditing(false);
  };

  const paginatedData = colors?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  if (isEditing) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Box width="100%" maxWidth={600}>
          {/* Header */}
          <Stack direction="row" alignItems="center" spacing={1} mb={3}>
            <IconButton onClick={handleReset}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" fontWeight={600}>
              {editId ? "Edit Color" : "Create Color"}
            </Typography>
          </Stack>

          {/* Form */}
          <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
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

              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Button onClick={handleReset}>Cancel</Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={createLoading || updateLoading}
                >
                  {createLoading || updateLoading
                    ? "Saving..."
                    : isEditing
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
  if (loading) return <Loader text="Loading colors..." fullScreen={true} />;

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
          Colors
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsEditing(true)}
        >
          Create Color
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {["Sr", "Color Name", "Status", "Actions"].map((h) => (
                <TableCell key={h} sx={{ fontWeight: 700 }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData?.map((item, index) => (
              <TableRow key={item.id} hover>
                <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                <TableCell>
                  <Typography fontWeight={600}>{item.colour_name}</Typography>
                </TableCell>
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
                <TableCell>
                  <IconButton color="primary">
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton color="warning" onClick={() => handleEdit(item)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    disabled={deleteLoading}
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
          count={Math.ceil((colors?.length || 0) / rowsPerPage)}
          page={page}
          onChange={(_, v) => setPage(v)}
          color="primary"
        />
      </Stack>
    </Box>
  );
};

export default Color;
