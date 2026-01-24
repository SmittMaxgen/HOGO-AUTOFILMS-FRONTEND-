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
import CommonButton from "../../components/commonComponents/CommonButton";
import CommonLabel from "../../components/commonComponents/CommonLabel";
import CommonToast from "../../components/commonComponents/Toster";
const Material = () => {
  const dispatch = useDispatch();

  const materials = useSelector(selectMaterials);
  const loading = useSelector(selectMaterialLoading);
  const createLoading = useSelector(selectCreateMaterialLoading);
  const updateLoading = useSelector(selectUpdateMaterialLoading);
  const createSuccess = useSelector(selectCreateMaterialSuccess);

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [isViewing, setIsViewing] = useState(false);
  const [viewMaterial, setViewMaterial] = useState(null);

  const [form, setForm] = useState({ title: "", status: true });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getMaterials());
  }, [dispatch]);

  useEffect(() => {
    if (createSuccess) {
      dispatch(getMaterials());
      handleReset();
    }
  }, [createSuccess, dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    const temp = {};
    if (!form.title) temp.title = "Material name is required";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleStatusToggle = (item) => {
    const data = new FormData();
    data.append("status", !item.status);

    dispatch(updateMaterials({ id: item.id, data }))
      .unwrap()
      .then(() => {
        dispatch(getMaterials());
        CommonToast(
          `Material ${!item.status ? "activated" : "deactivated"} successfully`,
          "success",
        );
      })
      .catch(() => CommonToast("Failed to update status", "error"));
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (isEditing && editId) {
      dispatch(updateMaterials({ id: editId, data: form }))
        .unwrap()
        .then(() => {
          dispatch(getMaterials());
          CommonToast("Material updated successfully", "success");
          handleReset();
        })
        .catch(() => CommonToast("Failed to update material", "error"));
    } else {
      dispatch(createMaterials(form))
        .unwrap()
        .then(() => {
          dispatch(getMaterials());
          CommonToast("Material created successfully", "success");
          handleReset();
        })
        .catch(() => CommonToast("Failed to create material", "error"));
    }
  };

  const handleView = (material) => {
    setViewMaterial(material);
    setIsViewing(true);
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditId(item.id);
    setForm({ title: item.title, status: item.status });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this material?")) {
      dispatch(deleteMaterials(id))
        .unwrap()
        .then(() => {
          dispatch(getMaterials());
          CommonToast("Material deleted successfully", "success");
        })
        .catch(() => CommonToast("Failed to delete material", "error"));
    }
  };

  const handleReset = () => {
    setForm({ title: "", status: true });
    setErrors({});
    setEditId(null);
    setIsEditing(false);
  };

  const handleAddMaterial = () => {
    handleReset();
    setIsEditing(true);
  };

  const paginatedData = materials?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  if (loading) return <Loader text="Loading materials..." fullScreen={true} />;

  if (isEditing) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Box width="100%" maxWidth={600}>
          <Stack direction="row" alignItems="center" spacing={1} mb={3}>
            <IconButton onClick={handleReset}>
              <ArrowBackIcon />
            </IconButton>
            <CommonLabel>
              {editId ? "Edit Material" : "Create Material"}
            </CommonLabel>
          </Stack>

          <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
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
  if (isViewing && viewMaterial) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Box width="100%" maxWidth={600}>
          {/* Header */}
          <Stack direction="row" alignItems="center" spacing={1} mb={3}>
            <IconButton
              onClick={() => {
                setIsViewing(false);
                setViewMaterial(null);
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <CommonLabel>View Material</CommonLabel>
          </Stack>

          {/* Read-only form */}
          <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
              <TextField
                label="Material Name"
                value={viewMaterial.title}
                fullWidth
                InputProps={{ readOnly: true }}
              />

              <FormControlLabel
                control={<Checkbox checked={viewMaterial.status} disabled />}
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
          Materials
        </Typography>
        <CommonButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleAddMaterial()}
        >
          Add Materials
        </CommonButton>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {["Sr", "Material Name", "Status", "Actions"].map((h) => (
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
                  <Typography fontWeight={600}>{item.title}</Typography>
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

            {materials?.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No materials found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack alignItems="flex-end" mt={3}>
        <Pagination
          count={Math.ceil((materials?.length || 0) / rowsPerPage)}
          page={page}
          onChange={(_, v) => setPage(v)}
          color="primary"
        />
      </Stack>
    </Box>
  );
};

export default Material;
