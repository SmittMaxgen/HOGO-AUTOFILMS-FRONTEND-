import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getShipmentProducts,
  createShipmentProduct,
  updateShipmentProduct,
  deleteShipmentProduct,
} from "../../feature/shipmentProducts/shipmentProductThunks";

import {
  selectShipmentProducts,
  selectShipmentProductLoading,
  selectCreateShipmentProductLoading,
  selectCreateShipmentProductSuccess,
  selectUpdateShipmentProductLoading,
  selectUpdateShipmentProductSuccess,
  selectDeleteShipmentProductLoading,
} from "../../feature/shipmentProducts/shipmentProductSelector";

import { getShipments } from "../../feature/shipments/shipmentThunks";
import { getProducts } from "../../feature/products/productThunks";

import { selectShipments } from "../../feature/shipments/shipmentSelector";
import { selectProducts } from "../../feature/products/productSelector";

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
  Pagination,
  Autocomplete,
  CircularProgress,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import Loader from "../../components/commonComponents/Loader";
import CommonButton from "../../components/commonComponents/CommonButton";
import CommonLabel from "../../components/commonComponents/CommonLabel";
import CommonToast from "../../components/commonComponents/Toster";

const ShipmentProducts = () => {
  const dispatch = useDispatch();

  const shipmentProducts = useSelector(selectShipmentProducts);
  const shipments = useSelector(selectShipments);
  const products = useSelector(selectProducts);

  const loading = useSelector(selectShipmentProductLoading);
  const createLoading = useSelector(selectCreateShipmentProductLoading);
  const createSuccess = useSelector(selectCreateShipmentProductSuccess);
  const updateLoading = useSelector(selectUpdateShipmentProductLoading);
  const updateSuccess = useSelector(selectUpdateShipmentProductSuccess);
  const deleteLoading = useSelector(selectDeleteShipmentProductLoading);

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [isViewing, setIsViewing] = useState(false);
  const [viewData, setViewData] = useState(null);

  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    shipment_id: null,
    product_id: null,
    batch_data: "",
    quantity: "",
    allocation_basis: "",
    landed_cost_allocated: "",
    per_unit_cost_inr: "",
    per_unit_cost_usd: "",
  });

  useEffect(() => {
    dispatch(getShipmentProducts());
    dispatch(getShipments());
    dispatch(getProducts());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    let tempErrors = {};

    if (!form.shipment_id) tempErrors.shipment_id = "Shipment is required!";
    if (!form.product_id) tempErrors.product_id = "Product is required!";
    if (!form.batch_data) tempErrors.batch_data = "Batch Data is required!";
    if (!form.quantity || form.quantity <= 0)
      tempErrors.quantity = "Quantity must be greater than 0!";
    if (!form.per_unit_cost_inr || form.per_unit_cost_inr <= 0)
      tempErrors.per_unit_cost_inr = "Cost (INR) is required!";

    setErrors(tempErrors);

    if (Object.keys(tempErrors).length > 0) return;

    const payload = {
      ...form,
      shipment_id: form.shipment_id?.id,
      product_id: form.product_id?.id,
    };

    const action =
      isEditing && editId
        ? updateShipmentProduct({ id: editId, data: payload })
        : createShipmentProduct(payload);

    dispatch(action)
      .unwrap()
      .then(() => {
        dispatch(getShipmentProducts());
        handleReset();
        CommonToast(
          isEditing
            ? "Shipment Product updated successfully!"
            : "Shipment Product added successfully!",
          "success",
        );
      })
      .catch(() => {
        CommonToast(
          isEditing
            ? "Failed to update Shipment Product!"
            : "Failed to add Shipment Product!",
          "error",
        );
      });
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditId(item.id);

    setForm({
      shipment_id: shipments.find((s) => s.id === item.shipment_id) || null,
      product_id: products.find((p) => p.id === item.product_id) || null,
      batch_data: item.batch_data,
      quantity: item.quantity,
      allocation_basis: item.allocation_basis,
      landed_cost_allocated: item.landed_cost_allocated,
      per_unit_cost_inr: item.per_unit_cost_inr,
      per_unit_cost_usd: item.per_unit_cost_usd,
    });
  };

  const handleView = (item) => {
    setViewData(item);
    setIsViewing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      dispatch(deleteShipmentProduct(id))
        .unwrap()
        .then(() => {
          dispatch(getShipmentProducts());
          CommonToast("Shipment Product deleted successfully!", "success");
        })
        .catch(() => {
          CommonToast("Failed to delete Shipment Product!", "error");
        });
    }
  };

  const handleReset = () => {
    setForm({
      shipment_id: null,
      product_id: null,
      batch_data: "",
      quantity: "",
      allocation_basis: "",
      landed_cost_allocated: "",
      per_unit_cost_inr: "",
      per_unit_cost_usd: "",
    });
    setEditId(null);
    setIsEditing(false);
    setIsViewing(false);
    setViewData(null);
  };

  const paginatedData = shipmentProducts?.slice(
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
            <CommonLabel>
              {editId ? "Edit Shipment Product" : "Add Shipment Product"}
            </CommonLabel>
          </Stack>

          <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Autocomplete
                options={shipments}
                getOptionLabel={(o) => `#${o.id} - ${o.supplier_invoice_no}`}
                value={form.shipment_id}
                onChange={(_, v) => {
                  setForm((p) => ({ ...p, shipment_id: v }));
                  setErrors((prev) => ({ ...prev, shipment_id: "" }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Shipment"
                    error={!!errors.shipment_id}
                    helperText={errors.shipment_id}
                  />
                )}
              />

              <Autocomplete
                options={products}
                getOptionLabel={(o) => o.product_name}
                value={form.product_id}
                onChange={(_, v) => {
                  setForm((p) => ({ ...p, product_id: v }));
                  setErrors((prev) => ({ ...prev, product_id: "" }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Product"
                    error={!!errors.product_id}
                    helperText={errors.product_id}
                  />
                )}
              />

              <TextField
                label="Batch Data"
                name="batch_data"
                value={form.batch_data}
                onChange={(e) => {
                  handleChange(e);
                  setErrors((prev) => ({ ...prev, batch_data: "" }));
                }}
                error={!!errors.batch_data}
                helperText={errors.batch_data}
              />

              <TextField
                label="Quantity"
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={(e) => {
                  handleChange(e);
                  setErrors((prev) => ({ ...prev, quantity: "" }));
                }}
                error={!!errors.quantity}
                helperText={errors.quantity}
              />

              <TextField
                label="Allocation Basis"
                name="allocation_basis"
                value={form.allocation_basis}
                onChange={(e) => {
                  handleChange(e);
                  setErrors((prev) => ({ ...prev, allocation_basis: "" }));
                }}
                error={!!errors.allocation_basis}
                helperText={errors.allocation_basis}
              />

              <TextField
                label="Landed Cost Allocated"
                type="number"
                name="landed_cost_allocated"
                value={form.landed_cost_allocated}
                onChange={(e) => {
                  handleChange(e);
                  setErrors((prev) => ({ ...prev, landed_cost_allocated: "" }));
                }}
                error={!!errors.landed_cost_allocated}
                helperText={errors.landed_cost_allocated}
              />

              <TextField
                label="Per Unit Cost (INR)"
                type="number"
                name="per_unit_cost_inr"
                value={form.per_unit_cost_inr}
                onChange={(e) => {
                  handleChange(e);
                  setErrors((prev) => ({ ...prev, per_unit_cost_inr: "" }));
                }}
                error={!!errors.per_unit_cost_inr}
                helperText={errors.per_unit_cost_inr}
              />

              <TextField
                label="Per Unit Cost (USD)"
                type="number"
                name="per_unit_cost_usd"
                value={form.per_unit_cost_usd}
                onChange={(e) => {
                  handleChange(e);
                  setErrors((prev) => ({ ...prev, per_unit_cost_usd: "" }));
                }}
                error={!!errors.per_unit_cost_usd}
                helperText={errors.per_unit_cost_usd}
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
      </Box>
    );
  }

  // if (loading) return <Loader text="Loading shipment products..." fullScreen />;

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight={700} sx={{ color: "#7E7E7E" }}>
          Shipment Products
        </Typography>
        <CommonButton
          startIcon={<AddIcon />}
          onClick={() => setIsEditing(true)}
        >
          Add Shipment Product
        </CommonButton>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {[
                "Sr",
                "Shipment",
                "Product",
                "Qty",
                "Cost (INR)",
                "Actions",
              ].map((h) => (
                <TableCell key={h} sx={{ fontWeight: 700 }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={28} />
                  <Typography variant="body2" mt={1}>
                    Loading shipments products...
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              paginatedData?.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.shipment_id}</TableCell>
                  <TableCell>{item.product_id}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.per_unit_cost_inr}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleView(item)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleEdit(item)}
                      color="warning"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(item.id)}
                      color="error"
                      disabled={deleteLoading}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            {shipmentProducts?.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No shipments products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack alignItems="flex-end" mt={3}>
        <Pagination
          count={Math.ceil((shipmentProducts?.length || 0) / rowsPerPage)}
          page={page}
          onChange={(_, v) => setPage(v)}
        />
      </Stack>
    </Box>
  );
};

export default ShipmentProducts;
