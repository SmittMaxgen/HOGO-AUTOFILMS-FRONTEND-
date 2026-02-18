import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from "../../feature/warehouse/warehouseThunks";

import {
  selectWarehouses,
  selectWarehouseLoading,
  selectCreateWarehouseLoading,
  selectUpdateWarehouseLoading,
  selectWarehouseSuccess,
} from "../../feature/warehouse/warehouseSelector";

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

const Warehouse = () => {
  const dispatch = useDispatch();

  const warehouses = useSelector(selectWarehouses);
  const loading = useSelector(selectWarehouseLoading);
  const createLoading = useSelector(selectCreateWarehouseLoading);
  const updateLoading = useSelector(selectUpdateWarehouseLoading);
  const createSuccess = useSelector(selectWarehouseSuccess);

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [isViewing, setIsViewing] = useState(false);
  const [viewData, setViewData] = useState(null);

  const [form, setForm] = useState({
    name: "",
    address: "",
    code: "",
    status: "active",
  });

  const [errors, setErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  // ===============================
  // FETCH
  // ===============================
  useEffect(() => {
    const payload = {};
    if (searchQuery) payload.name = searchQuery;

    dispatch(getWarehouses(payload));
  }, [dispatch, searchQuery]);

  useEffect(() => {
    if (createSuccess) {
      dispatch(getWarehouses());
      handleReset();
    }
  }, [createSuccess, dispatch]);

  // ===============================
  // HANDLERS
  // ===============================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const temp = {};
    if (!form.name) temp.name = "Warehouse name is required";
    if (!form.code) temp.code = "Warehouse code is required";
    if (!form.address) temp.address = "Address is required";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (isEditing && editId) {
      dispatch(updateWarehouse({ id: editId, data: form }))
        .unwrap()
        .then(() => {
          dispatch(getWarehouses());
          CommonToast("Warehouse updated successfully", "success");
          handleReset();
        })
        .catch(() => CommonToast("Failed to update warehouse", "error"));
    } else {
      dispatch(createWarehouse(form))
        .unwrap()
        .then(() => {
          dispatch(getWarehouses());
          CommonToast("Warehouse created successfully", "success");
          handleReset();
        })
        .catch(() => CommonToast("Failed to create warehouse", "error"));
    }
  };

  const handleStatusToggle = (item) => {
    const updatedStatus = item.status === "active" ? "deactive" : "active";

    dispatch(
      updateWarehouse({
        id: item.id,
        data: { ...item, status: updatedStatus },
      }),
    )
      .unwrap()
      .then(() => {
        dispatch(getWarehouses());
        CommonToast(
          `Warehouse ${
            updatedStatus === "active" ? "activated" : "deactivated"
          } successfully`,
          "success",
        );
      })
      .catch(() => CommonToast("Failed to update status", "error"));
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditId(item.id);
    setForm({
      name: item.name,
      address: item.address,
      code: item.code,
      status: item.status,
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this warehouse?")) {
      dispatch(deleteWarehouse(id))
        .unwrap()
        .then(() => {
          dispatch(getWarehouses());
          CommonToast("Warehouse deleted successfully", "success");
        })
        .catch(() => CommonToast("Failed to delete warehouse", "error"));
    }
  };

  const handleView = (item) => {
    setViewData(item);
    setIsViewing(true);
  };

  const handleReset = () => {
    setForm({
      name: "",
      address: "",
      code: "",
      status: "active",
    });
    setErrors({});
    setEditId(null);
    setIsEditing(false);
  };

  const paginatedData = warehouses?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  // ===============================
  // EDIT / CREATE FORM
  // ===============================
  if (isEditing) {
    return (
      <Box mt={4}>
        <Stack direction="row" alignItems="center" spacing={1} mb={3}>
          <IconButton onClick={handleReset}>
            <ArrowBackIcon />
          </IconButton>
          <CommonLabel>
            {editId ? "Edit Warehouse" : "Create Warehouse"}
          </CommonLabel>
        </Stack>

        <Paper sx={{ p: 3 }}>
          <Stack spacing={2}>
            <TextField
              label="Warehouse Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
            />

            <TextField
              label="Warehouse Code"
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

  // ===============================
  // VIEW
  // ===============================
  if (isViewing && viewData) {
    return (
      <Box mt={4}>
        <Stack direction="row" alignItems="center" spacing={1} mb={3}>
          <IconButton
            onClick={() => {
              setIsViewing(false);
              setViewData(null);
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <CommonLabel>View Warehouse</CommonLabel>
        </Stack>

        <Paper sx={{ p: 3 }}>
          <Stack spacing={2}>
            <TextField
              label="Name"
              value={viewData.name}
              fullWidth
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Code"
              value={viewData.code}
              fullWidth
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Address"
              value={viewData.address}
              fullWidth
              multiline
              rows={3}
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Status"
              value={viewData.status}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Stack>
        </Paper>
      </Box>
    );
  }

  // ===============================
  // LIST VIEW
  // ===============================
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight={700}>
          Warehouses
        </Typography>

        <CommonButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            handleReset();
            setIsEditing(true);
          }}
        >
          Add Warehouse
        </CommonButton>
      </Stack>

      <TableContainer component={Paper}>
        <Box sx={{ display: "flex" }}>
          <CommonSearchField
            value={searchQuery}
            placeholder="Search by warehouse name..."
            onChange={(value) => setSearchQuery(value)}
          />
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              {["Sr", "Name", "Code", "Status", "Actions"].map((h) => (
                <TableCell key={h} sx={{ fontWeight: 700 }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress size={28} />
                  <Typography mt={1}>Loading warehouses...</Typography>
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              paginatedData?.map((item, index) => (
                <TableRow key={item.id} hover>
                  <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.code}</TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Switch
                        checked={item.status === "active"}
                        onChange={() => handleStatusToggle(item)}
                        color="success"
                        size="small"
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

            {!loading && warehouses?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No warehouses found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack alignItems="flex-end" mt={3}>
        <Pagination
          count={Math.ceil((warehouses?.length || 0) / rowsPerPage)}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Stack>
    </Box>
  );
};

export default Warehouse;
