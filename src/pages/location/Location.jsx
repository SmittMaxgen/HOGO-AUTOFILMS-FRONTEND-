import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} from "../../feature/location/locationThunks";

import {
  selectLocations,
  selectLocationLoading,
  selectCreateLocationLoading,
  selectUpdateLocationLoading,
  selectLocationSuccess,
} from "../../feature/location/locationSelector";

import { getWarehouses } from "../../feature/warehouse/warehouseThunks";
import { selectWarehouses } from "../../feature/warehouse/warehouseSelector";

import {
  Box,
  Paper,
  Stack,
  Typography,
  IconButton,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  CircularProgress,
  Pagination,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";

import CommonButton from "../../components/commonComponents/CommonButton";
import CommonLabel from "../../components/commonComponents/CommonLabel";
import CommonToast from "../../components/commonComponents/Toster";
import CommonSearchField from "../../components/commonComponents/CommonSearchField";

const Location = () => {
  const dispatch = useDispatch();

  const locations = useSelector(selectLocations);
  const warehouses = useSelector(selectWarehouses);

  const loading = useSelector(selectLocationLoading);
  const createLoading = useSelector(selectCreateLocationLoading);
  const updateLoading = useSelector(selectUpdateLocationLoading);
  const success = useSelector(selectLocationSuccess);

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [isEditing, setIsEditing] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  console.log("isEditing::::", isEditing);
  const [editId, setEditId] = useState(null);

  const [isViewing, setIsViewing] = useState(false);
  const [viewData, setViewData] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [form, setForm] = useState({
    warehouse_id: "",
    name: "",
    address: "",
    code: "",
    status: "active",
  });
  console.log("form::::", form);

  const [errors, setErrors] = useState({});

  // =========================
  // FETCH
  // =========================
  useEffect(() => {
    dispatch(getWarehouses()); // dropdown
  }, [dispatch]);

  useEffect(() => {
    const payload = {};
    if (searchQuery) payload.name = searchQuery;

    dispatch(getLocations(payload));
  }, [dispatch, searchQuery]);

  useEffect(() => {
    if (success) {
      dispatch(getLocations());
      handleReset();
    }
  }, [success, dispatch]);

  // =========================
  // HANDLERS
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const temp = {};
    if (!form.warehouse_id) temp.warehouse_id = "Warehouse required";
    if (!form.name) temp.name = "Location name required";
    if (!form.code) temp.code = "Code required";
    if (!form.address) temp.address = "Address required";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (isEditing) {
      dispatch(updateLocation({ id: editId, data: form }))
        .unwrap()
        .then(() => {
          CommonToast("Location updated successfully", "success");
          dispatch(getLocations());
          handleReset();
        })
        .catch(() => CommonToast("Failed to update location", "error"));
    } else if (isAdd) {
      dispatch(createLocation(form))
        .unwrap()
        .then(() => {
          CommonToast("Location created successfully", "success");
          isAdd(false);
          dispatch(getLocations());
          handleReset();
        })
        .catch(() => console.log(""));
    }
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditId(item.id);
    setForm({
      warehouse_id: item.warehouse_id,
      name: item.name,
      address: item.address,
      code: item.code,
      status: item.status,
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this location?")) {
      dispatch(deleteLocation(id))
        .unwrap()
        .then(() => {
          CommonToast("Location deleted", "success");
          dispatch(getLocations());
        })
        .catch(() => CommonToast("Failed to delete location", "error"));
    }
  };

  const handleStatusToggle = (item) => {
    const updatedStatus = item.status === "active" ? "deactive" : "active";

    dispatch(
      updateLocation({
        id: item.id,
        data: { ...item, status: updatedStatus },
      }),
    )
      .unwrap()
      .then(() => {
        CommonToast("Status updated", "success");
        dispatch(getLocations());
      })
      .catch(() => CommonToast("Failed to update status", "error"));
  };

  const handleView = (item) => {
    setViewData(item);
    setIsViewing(true);
  };

  const handleReset = () => {
    setForm({
      warehouse_id: "",
      name: "",
      address: "",
      code: "",
      status: "active",
    });
    setEditId(null);
    setIsAdd(false);
    setIsEditing(false);
    setErrors({});
  };

  const paginatedData = locations?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  // =========================
  // FORM VIEW
  // =========================
  if (isEditing || isAdd) {
    return (
      <Box mt={4}>
        <Stack direction="row" alignItems="center" spacing={1} mb={3}>
          <IconButton onClick={handleReset}>
            <ArrowBackIcon />
          </IconButton>
          <CommonLabel>
            {editId ? "Edit Location" : "Create Location"}
          </CommonLabel>
        </Stack>

        <Paper sx={{ p: 3 }}>
          <Stack spacing={2}>
            <TextField
              select
              label="Warehouse"
              name="warehouse_id"
              value={form.warehouse_id}
              onChange={handleChange}
              error={!!errors.warehouse_id}
              helperText={errors.warehouse_id}
              fullWidth
            >
              {warehouses?.map((wh) => (
                <MenuItem key={wh.id} value={wh.id}>
                  {wh.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Location Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
            />

            <TextField
              label="Code"
              name="code"
              value={form.code}
              onChange={handleChange}
              error={!!errors.code}
              helperText={errors.code}
              fullWidth
            />

            <TextField
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              error={!!errors.address}
              helperText={errors.address}
              fullWidth
              multiline
              rows={3}
            />

            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <CommonButton variant="outlined" onClick={handleReset}>
                Cancel
              </CommonButton>
              <CommonButton
                variant="contained"
                onClick={handleSubmit}
                disabled={createLoading || updateLoading}
              >
                {createLoading || updateLoading ? "Saving..." : "Save"}
              </CommonButton>
            </Stack>
          </Stack>
        </Paper>
      </Box>
    );
  }

  // =========================
  // LIST VIEW
  // =========================
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight={700}>
          Locations
        </Typography>

        <CommonButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            handleReset();
            setIsAdd(true);
          }}
        >
          Add Location
        </CommonButton>
      </Stack>

      <TableContainer component={Paper}>
        <Box sx={{ display: "flex" }}>
          <CommonSearchField
            value={searchQuery}
            placeholder="Search by location name..."
            onChange={(value) => setSearchQuery(value)}
          />
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              {["Sr", "Warehouse", "Name", "Code", "Status", "Actions"].map(
                (h) => (
                  <TableCell key={h} sx={{ fontWeight: 700 }}>
                    {h}
                  </TableCell>
                ),
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress size={28} />
                  <Typography mt={1}>Loading locations...</Typography>
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              paginatedData?.map((item, index) => (
                <TableRow key={item.id} hover>
                  <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{item.warehouse_name}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.code}</TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Switch
                        checked={item.status === "active"}
                        onChange={() => handleStatusToggle(item)}
                        size="small"
                        color="success"
                      />
                      <Typography
                        color={
                          item.status === "active"
                            ? "success.main"
                            : "text.secondary"
                        }
                      >
                        {item.status}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleView(item)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      color="warning"
                      onClick={() => handleEdit(item)}
                    >
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

            {!loading && locations?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No locations found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack alignItems="flex-end" mt={3}>
        <Pagination
          count={Math.ceil((locations?.length || 0) / rowsPerPage)}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Stack>
    </Box>
  );
};

export default Location;
