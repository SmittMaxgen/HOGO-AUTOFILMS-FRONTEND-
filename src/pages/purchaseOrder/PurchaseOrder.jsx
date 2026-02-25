import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getPurchaseOrders,
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
} from "../../feature/purchaseOrder/purchaseOrderThunks";

import {
  selectPurchaseOrders,
  selectPurchaseOrderLoading,
  selectCreatePurchaseOrderLoading,
  selectCreatePurchaseOrderSuccess,
  selectUpdatePurchaseOrderLoading,
  selectUpdatePurchaseOrderSuccess,
  selectPurchaseOrderError,
  selectDeletePurchaseOrderLoading,
} from "../../feature/purchaseOrder/purchaseOrderSelector";

// TODO: Import your product and distributor selectors
// import { selectProducts } from "../../feature/product/productSelector";
// import { selectDistributors } from "../../feature/distributor/distributorSelector";
// import { getProducts } from "../../feature/product/productThunks";
// import { getDistributors } from "../../feature/distributor/distributorThunks";

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
  Grid,
  Divider,
  Card,
  CardContent,
  InputAdornment,
  Button,
  Alert,
  Autocomplete,
  Select,
  MenuItem,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import CommonButton from "../../components/commonComponents/CommonButton";
import CommonLabel from "../../components/commonComponents/CommonLabel";
import CommonToast from "../../components/commonComponents/Toster";
import CommonSearchField from "../../components/commonComponents/CommonSearchField";

import DownloadIcon from "@mui/icons-material/Download";

const PurchaseOrder = () => {
  const dispatch = useDispatch();

  const purchaseOrders = useSelector(selectPurchaseOrders);
  const loading = useSelector(selectPurchaseOrderLoading);
  const createLoading = useSelector(selectCreatePurchaseOrderLoading);
  const createSuccess = useSelector(selectCreatePurchaseOrderSuccess);
  const updateLoading = useSelector(selectUpdatePurchaseOrderLoading);
  const updateSuccess = useSelector(selectUpdatePurchaseOrderSuccess);
  const updateError = useSelector(selectPurchaseOrderError);
  const deleteLoading = useSelector(selectDeletePurchaseOrderLoading);

  // TODO: Replace these with your actual Redux selectors
  // const products = useSelector(selectProducts);
  // const distributors = useSelector(selectDistributors);

  // MOCK DATA - Replace with actual API data
  const [products, setProducts] = useState([
    {
      product_id: 1,
      product_name: "Bike",
      unit_distributor_price: 50,
      mrp: 50,
    },
    {
      product_id: 2,
      product_name: "Cycle",
      unit_distributor_price: 30,
      mrp: 35,
    },
    {
      product_id: 3,
      product_name: "Helmet",
      unit_distributor_price: 20,
      mrp: 25,
    },
    {
      product_id: 4,
      product_name: "Lock",
      unit_distributor_price: 15,
      mrp: 18,
    },
  ]);

  const [distributors, setDistributors] = useState([
    { distributor_id: 1, distributor_name: "ABC Distributors" },
    { distributor_id: 2, distributor_name: "XYZ Suppliers" },
    { distributor_id: 3, distributor_name: "Global Trading Co." },
  ]);

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [isViewing, setIsViewing] = useState(false);
  const [viewPO, setViewPO] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [form, setForm] = useState({
    po_number: "",
    distributor_id: "",
    product_items: [],
    remarks: "",
  });
  const [poStatus, setPoStatus] = useState("");

  // Product line item form with selected product object
  const [productForm, setProductForm] = useState({
    product_id: "",
    product_name: "",
    quantity: 1,
    unit_distributor_price: 0,
    mrp: 0,
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedDistributor, setSelectedDistributor] = useState(null);

  const [errors, setErrors] = useState({});

  // ================= FETCH DATA =================
  useEffect(() => {
    // TODO: Fetch products and distributors
    // dispatch(getProducts());
    // dispatch(getDistributors());

    const delay = setTimeout(() => {
      dispatch(getPurchaseOrders());
      setPage(1);
    }, 300);

    return () => clearTimeout(delay);
  }, [dispatch, searchQuery]);

  useEffect(() => {
    if (updateError && updateError[0]) {
      const message = updateError[0];
      CommonToast(message, "info");
    }
  }, [updateError]);

  useEffect(() => {
    if (createSuccess || updateSuccess) {
      dispatch(getPurchaseOrders());
      handleReset();
    }
  }, [createSuccess, updateSuccess, dispatch]);

  // ================= PRODUCT CALCULATIONS =================
  const calculateProductTotals = (item) => {
    const quantity = Number(item.quantity) || 0;
    const unitDistPrice = Number(item.unit_distributor_price) || 0;
    const unitMRP = Number(item.mrp) || 0;

    return {
      ...item,
      quantity,
      unit_distributor_price: unitDistPrice,
      mrp: unitMRP,
      total_distributor_price: quantity * unitDistPrice,
      total_mrp_price: quantity * unitMRP,
    };
  };

  const calculateGrandTotals = () => {
    const totals = form.product_items.reduce(
      (acc, item) => {
        const calculated = calculateProductTotals(item);
        return {
          totalQty: acc.totalQty + calculated.quantity,
          totalDistPrice:
            acc.totalDistPrice + calculated.total_distributor_price,
          totalMRPPrice: acc.totalMRPPrice + calculated.total_mrp_price,
          totalItems: acc.totalItems + 1,
        };
      },
      { totalQty: 0, totalDistPrice: 0, totalMRPPrice: 0, totalItems: 0 },
    );
    return totals;
  };

  // ================= PRODUCT HANDLERS =================
  const handleProductSelect = (event, value) => {
    setSelectedProduct(value);
    if (value) {
      setProductForm({
        product_id: value.product_id,
        product_name: value.product_name,
        quantity: 1,
        unit_distributor_price: value.unit_distributor_price || 0,
        mrp: value.mrp || 0,
      });
    } else {
      setProductForm({
        product_id: "",
        product_name: "",
        quantity: 1,
        unit_distributor_price: 0,
        mrp: 0,
      });
    }
  };

  const handleDistributorSelect = (event, value) => {
    setSelectedDistributor(value);
    if (value) {
      setForm({ ...form, distributor_id: value.distributor_id });
      setErrors({ ...errors, distributor_id: "" });
    } else {
      setForm({ ...form, distributor_id: "" });
    }
  };

  const handleAddProduct = () => {
    if (!productForm.product_id || !productForm.product_name) {
      CommonToast("Please select a product", "error");
      return;
    }
    if (productForm.quantity <= 0) {
      CommonToast("Quantity must be greater than 0", "error");
      return;
    }

    const newProduct = calculateProductTotals(productForm);
    setForm({
      ...form,
      product_items: [...form.product_items, newProduct],
    });

    // Reset product form
    setSelectedProduct(null);
    setProductForm({
      product_id: "",
      product_name: "",
      quantity: 1,
      unit_distributor_price: 0,
      mrp: 0,
    });

    CommonToast("Product added successfully", "success");
  };

  const handleRemoveProduct = (index) => {
    const updated = form.product_items.filter((_, i) => i !== index);
    setForm({ ...form, product_items: updated });
    CommonToast("Product removed", "info");
  };

  const handleUpdateProductItem = (index, field, value) => {
    const updated = form.product_items.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [field]: value };
        return calculateProductTotals(updatedItem);
      }
      return item;
    });
    setForm({ ...form, product_items: updated });
  };

  const PO_STATUS_OPTIONS = [
    "DRAFT",
    "SUBMITTED",
    "APPROVED",
    "REJECTED",
    "CANCELLED",
    "PICKED",
    "PACKED",
    "DELIVERED",
  ];

  const getAvailableStatusOptions = (currentStatus) => {
    switch (currentStatus) {
      case "APPROVED":
        return ["APPROVED", "PICKED", "PACKED", "DELIVERED"];
      case "PARTIALLY_APPROVED":
        return ["PARTIALLY_APPROVED", "PICKED", "PACKED", "DELIVERED"];
      case "PICKED":
        return ["PICKED", "PACKED", "DELIVERED"];
      case "PACKED":
        return ["PACKED", "DELIVERED"];
      case "DELIVERED":
        return ["DELIVERED"]; // locked, no forward options
      default:
        return [
          "DRAFT",
          "SUBMITTED",
          "APPROVED",
          "REJECTED",
          "PARTIALLY_APPROVED",
          "CANCELLED",
        ];
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "DRAFT":
        return "grey.500";

      case "APPROVED":
        return "success.main";

      case "SUBMITTED":
        return "warning.main";

      case "REJECTED":
        return "error.main";

      case "PARTIALLY_APPROVED":
        return "info.main";

      case "CANCELLED":
        return "grey.600";

      case "PICKED":
        return "orange";

      case "PACKED":
        return "primary.main";

      case "DELIVERED":
        return "#7c3aed";

      default:
        return "grey.400"; // fallback (important)
    }
  };

  const handleStatusChange = (id, value) => {
    dispatch(
      updatePurchaseOrder({
        id,
        data: { status: value },
      }),
    );
  };

  // ================= FORM HELPERS =================
  // ================= FORM HELPERS =================
  const validate = () => {
    const temp = {};
    if (!form.po_number) temp.po_number = "PO number is required";
    if (!form.distributor_id) temp.distributor_id = "Distributor is required";
    if (!form.product_items.length)
      temp.product_items = "At least one product required";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      CommonToast("Please fill all required fields", "error");
      return;
    }

    // Prepare the data exactly as your API expects
    const submitData = {
      po_number: form.po_number,
      distributor_id: Number(form.distributor_id), // Ensure it's a number
      product_items: form.product_items.map((item) => ({
        product_id: Number(item.product_id),
        product_name: item.product_name,
        quantity: Number(item.quantity),
        mrp: Number(item.mrp),
        unit_distributor_price: Number(item.unit_distributor_price),
        total_distributor_price:
          Number(item.quantity) * Number(item.unit_distributor_price),
        total_mrp_price: Number(item.quantity) * Number(item.mrp),
      })),
      remarks: form.remarks || "",
    };


    if (isEditing && editId) {
      dispatch(updatePurchaseOrder({ id: editId, data: submitData }))
        .unwrap()
        .then((response) => {
          CommonToast("Purchase order updated successfully", "success");
        })
        .catch((error) => {
          console.error("Update Error:", error); // DEBUG
          CommonToast(
            error?.message || "Failed to update purchase order",
            "error",
          );
        });
    } else {
      dispatch(createPurchaseOrder(submitData))
        .unwrap()
        .then((response) => {
          CommonToast("Purchase order created successfully", "success");
        })
        .catch((error) => {
          console.error("Create Error:", error); // DEBUG
          CommonToast(
            error?.message || "Failed to create purchase order",
            "error",
          );
        });
    }
  };

  const handleView = (po) => {
    setViewPO(po);
    setIsViewing(true);
  };

  const handleEdit = (po) => {
    setPoStatus(po?.status);
    setIsEditing(true);
    setEditId(po.id);
    setForm({
      po_number: po.po_number,
      distributor_id: po.distributor_id,
      product_items: po.product_items || [],
      remarks: po.remarks || "",
    });

    // Set selected distributor for edit mode
    const dist = distributors.find(
      (d) => d.distributor_id === po.distributor_id,
    );
    setSelectedDistributor(dist || null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this PO?")) {
      dispatch(deletePurchaseOrder(id))
        .unwrap()
        .then(() =>
          CommonToast("Purchase order deleted successfully", "success"),
        )
        .catch(() => CommonToast("Failed to delete purchase order", "error"));
    }
  };

  const handleReset = () => {
    setIsEditing(false);
    setEditId(null);
    setIsViewing(false);
    setViewPO(null);
    setForm({
      po_number: "",
      distributor_id: "",
      product_items: [],
      remarks: "",
    });
    setProductForm({
      product_id: "",
      product_name: "",
      quantity: 1,
      unit_distributor_price: 0,
      mrp: 0,
    });
    setSelectedProduct(null);
    setSelectedDistributor(null);
    setErrors({});
  };

  const paginatedData = purchaseOrders?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  const grandTotals = calculateGrandTotals();

  // ================= CREATE / EDIT VIEW =================
  if (isEditing) {
    return (
      <Box mt={4}>
        <Stack direction="row" alignItems="center" spacing={1} mb={3}>
          <IconButton onClick={handleReset}>
            <ArrowBackIcon />
          </IconButton>
          <CommonLabel>
            {editId ? "Edit Purchase Order" : "Create Purchase Order"}
          </CommonLabel>
        </Stack>

        <Grid container spacing={3}>
          {/* Left Side - PO Details */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: "100%", width: "100%" }}>
              <Typography variant="h6" gutterBottom>
                PO Details
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={2}>
                <TextField
                  label="PO Number"
                  value={form.po_number}
                  onChange={(e) =>
                    setForm({ ...form, po_number: e.target.value })
                  }
                  error={!!errors.po_number}
                  helperText={errors.po_number}
                  fullWidth
                  size="small"
                />

                {/* Distributor Autocomplete */}
                <Autocomplete
                  options={distributors}
                  getOptionLabel={(option) =>
                    `${option.distributor_name} (ID: ${option.distributor_id})`
                  }
                  value={selectedDistributor}
                  onChange={handleDistributorSelect}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Distributor"
                      error={!!errors.distributor_id}
                      helperText={errors.distributor_id}
                      size="small"
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props} key={option.distributor_id}>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {option.distributor_name}
                        </Typography>
                        {/* <Typography variant="caption" color="text.secondary">
                          ID: {option.distributor_id}
                        </Typography> */}
                      </Box>
                    </li>
                  )}
                  isOptionEqualToValue={(option, value) =>
                    option.distributor_id === value.distributor_id
                  }
                  fullWidth
                />

                <TextField
                  label="Remarks"
                  value={form.remarks}
                  onChange={(e) =>
                    setForm({ ...form, remarks: e.target.value })
                  }
                  fullWidth
                  multiline
                  rows={4}
                  size="small"
                />

                {/* Grand Total Summary */}
                <Card sx={{ bgcolor: "primary.50", mt: 2 }}>
                  <CardContent>
                    <Typography
                      variant="subtitle2"
                      color="primary"
                      gutterBottom
                    >
                      Order Summary
                    </Typography>
                    <Stack spacing={1}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">Total Items:</Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {grandTotals.totalItems}
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">Total Quantity:</Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {grandTotals.totalQty}
                        </Typography>
                      </Stack>
                      <Divider />
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">
                          Distributor Total:
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight={700}
                          color="primary"
                        >
                          ₹ {grandTotals.totalDistPrice.toFixed(2)}
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">MRP Total:</Typography>
                        <Typography variant="body2" fontWeight={700}>
                          ₹ {grandTotals.totalMRPPrice.toFixed(2)}
                        </Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>

                {errors.product_items && (
                  <Alert severity="error">{errors.product_items}</Alert>
                )}

                <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                  <CommonButton
                    variant="outlined"
                    onClick={handleReset}
                    fullWidth
                  >
                    Cancel
                  </CommonButton>
                  <CommonButton
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={createLoading || updateLoading}
                    fullWidth
                  >
                    {createLoading || updateLoading ? "Saving..." : "Save PO"}
                  </CommonButton>
                </Stack>
              </Stack>
            </Paper>
          </Grid>

          {/* Right Side - Products */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                <ShoppingCartIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                Product Items
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {/* Add Product Form */}

              {/* Products List */}
              {form.product_items.length === 0 ? (
                <Alert severity="info">
                  No products added yet. Add products using the form above.
                </Alert>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: "grey.100" }}>
                        <TableCell sx={{ fontWeight: 700 }}>Sr</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                        <TableCell sx={{ fontWeight: 700 }} align="center">
                          Qty
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }} align="center">
                          Dist. Price
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }} align="center">
                          MRP
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }} align="center">
                          Total Dist.
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }} align="center">
                          Total MRP
                        </TableCell>
                        {poStatus === "PICKED" && (
                          <>
                            <TableCell sx={{ fontWeight: 700 }} align="center">
                              Qty Picked
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }} align="center">
                              Short Pick
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }} align="center">
                              Remarks
                            </TableCell>
                          </>
                        )}

                        <TableCell sx={{ fontWeight: 700 }} align="center">
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {form.product_items.map((item, index) => {
                        const calculated = calculateProductTotals(item);
                        return (
                          <TableRow key={index} hover>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                {item.product_name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                ID: {item.product_id}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <TextField
                                value={item.quantity}
                                onChange={(e) =>
                                  handleUpdateProductItem(
                                    index,
                                    "quantity",
                                    Number(e.target.value),
                                  )
                                }
                                size="small"
                                type="number"
                                inputProps={{
                                  min: 1,
                                  style: { textAlign: "center" },
                                }}
                                sx={{ width: 70 }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <TextField
                                value={item.unit_distributor_price}
                                onChange={(e) =>
                                  handleUpdateProductItem(
                                    index,
                                    "unit_distributor_price",
                                    Number(e.target.value),
                                  )
                                }
                                size="small"
                                type="number"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      ₹
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{ width: 100 }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <TextField
                                disabled={true}
                                value={item.mrp}
                                onChange={(e) =>
                                  handleUpdateProductItem(
                                    index,
                                    "mrp",
                                    Number(e.target.value),
                                  )
                                }
                                size="small"
                                type="number"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      ₹
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{ width: 100 }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" fontWeight={600}>
                                ₹{" "}
                                {calculated.total_distributor_price.toFixed(2)}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2">
                                ₹ {calculated.total_mrp_price.toFixed(2)}
                              </Typography>
                            </TableCell>
                            {poStatus === "PICKED" && (
                              <>
                                <TableCell align="center">
                                  <TextField
                                    value={item.qty_picked}
                                    onChange={(e) =>
                                      handleUpdateProductItem(
                                        index,
                                        "qty_picked",
                                        Number(e.target.value),
                                      )
                                    }
                                    size="small"
                                    type="number"
                                    inputProps={{
                                      min: 1,
                                      style: { textAlign: "center" },
                                    }}
                                    sx={{ width: 70 }}
                                  />
                                </TableCell>

                                <TableCell align="center">
                                  <TextField
                                    value={item.short_pick}
                                    onChange={(e) =>
                                      handleUpdateProductItem(
                                        index,
                                        "short_pick",
                                        Number(e.target.value),
                                      )
                                    }
                                    size="small"
                                    type="number"
                                    inputProps={{
                                      min: 1,
                                      style: { textAlign: "center" },
                                    }}
                                    sx={{ width: 70 }}
                                  />
                                </TableCell>

                                <TableCell align="center">
                                  <TextField
                                    value={item.remarks || ""}
                                    onChange={(e) =>
                                      handleUpdateProductItem(
                                        index,
                                        "remarks",
                                        e.target.value, // ✅ no Number()
                                      )
                                    }
                                    size="small"
                                    type="text"
                                    inputProps={{
                                      style: { textAlign: "center" },
                                    }}
                                    sx={{ width: 120 }}
                                  />
                                </TableCell>
                              </>
                            )}

                            <TableCell align="center">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRemoveProduct(index)}
                              >
                                <RemoveCircleOutlineIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  }

  // ================= VIEW MODE =================
  if (isViewing && viewPO) {
    const viewTotals = viewPO.product_items?.reduce(
      (acc, item) => ({
        totalDistPrice:
          acc.totalDistPrice + (item.total_distributor_price || 0),
        totalMRPPrice: acc.totalMRPPrice + (item.total_mrp_price || 0),
      }),
      { totalDistPrice: 0, totalMRPPrice: 0 },
    );

    // Find distributor name for view
    const distributorInfo = distributors.find(
      (d) => d.distributor_id === viewPO.distributor_id,
    );

    return (
      <Box mt={4}>
        <Stack direction="row" alignItems="center" spacing={1} mb={3}>
          <IconButton onClick={handleReset}>
            <ArrowBackIcon />
          </IconButton>
          <CommonLabel>View Purchase Order</CommonLabel>
        </Stack>

        <Grid container spacing={3}>
          {/* PO Details */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Order Details
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    PO Number
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {viewPO.po_number}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Distributor
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {distributorInfo?.distributor_name || "N/A"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ID: {viewPO.distributor_id}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Status
                  </Typography>
                  <Box mt={0.5}>
                    <Chip
                      label={viewPO.status}
                      color={
                        viewPO.status === "APPROVED"
                          ? "success"
                          : viewPO.status === "SUBMITTED"
                            ? "warning"
                            : "default"
                      }
                      size="small"
                    />
                  </Box>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    PO Date
                  </Typography>
                  <Typography variant="body2">
                    {new Date(viewPO.po_date).toLocaleString()}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Remarks
                  </Typography>
                  <Typography variant="body2">
                    {viewPO.remarks || "-"}
                  </Typography>
                </Box>

                {/* Summary Card */}
                <Card sx={{ bgcolor: "success.50", mt: 2 }}>
                  <CardContent>
                    <Typography
                      variant="subtitle2"
                      color="success.dark"
                      gutterBottom
                    >
                      Order Summary
                    </Typography>
                    <Stack spacing={1}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">Total Items:</Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {viewPO.total_items || 0}
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">Total Quantity:</Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {viewPO.total_quantity || 0}
                        </Typography>
                      </Stack>
                      <Divider />
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">
                          Distributor Total:
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight={700}
                          color="success.dark"
                        >
                          ₹ {viewTotals?.totalDistPrice.toFixed(2) || "0.00"}
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">MRP Total:</Typography>
                        <Typography variant="body2" fontWeight={700}>
                          ₹ {viewTotals?.totalMRPPrice.toFixed(2) || "0.00"}
                        </Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </Paper>
          </Grid>

          {/* Product Items */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                <ShoppingCartIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                Product Items
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "grey.100" }}>
                      <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="center">
                        Quantity
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="right">
                        Dist. Price
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="right">
                        MRP
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="right">
                        Total Dist.
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="right">
                        Total MRP
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {viewPO.product_items?.map((item, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {item?.product_name}
                          </Typography>
                          {/* <Typography variant="caption" color="text.secondary">
                            ID: {item?.product_id}
                          </Typography> */}
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={item?.quantity && item?.quantity}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          ₹{" "}
                          {item?.unit_distributor_price &&
                            item?.unit_distributor_price}
                        </TableCell>
                        <TableCell align="right">
                          ₹ {item?.mrp && item?.mrp}
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600}>
                            ₹{" "}
                            {item?.total_distributor_price &&
                              item?.total_distributor_price?.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            ₹{" "}
                            {item?.total_mrp_price &&
                              item?.total_mrp_price?.toFixed(2)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  }

  // ================= LIST VIEW =================
  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight={700}>
          Purchase Orders
        </Typography>
        {/* <CommonButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsEditing(true)}
        >
          Add PO
        </CommonButton> */}
      </Stack>

      <TableContainer component={Paper}>
        <Box sx={{ p: 2 }}>
          <CommonSearchField
            value={searchQuery}
            placeholder="Search PO number..."
            onChange={(value) => setSearchQuery(value)}
          />
        </Box>

        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.100" }}>
              {[
                "Sr",
                "PO Number",
                "Distributor",
                "PO Date",
                "Status",
                "Total Items",
                "Total Qty",
                "Actions",
                "Pdf",
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
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={28} />
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              paginatedData?.map((po, index) => {
                const distributorInfo = distributors.find(
                  (d) => d.distributor_id === po.distributor_id,
                );
                return (
                  <TableRow key={po.id} hover>
                    <TableCell>
                      {(page - 1) * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {po.po_number}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {distributorInfo?.distributor_name || "N/A"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {po?.distributor_id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(po?.po_date).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {/* <Select
                        size="small"
                        value={po?.status}
                        onChange={(e) =>
                          handleStatusChange(po.id, e.target.value)
                        }
                        sx={{
                          minWidth: 140,
                          height: 26,
                          borderRadius: "999px",
                          fontWeight: 500,
                          color: "white",
                          bgcolor: getStatusColor(po.status),
                          "& .MuiSelect-select": {
                            py: 0.5,
                            pl: 2,
                            display: "flex",
                            alignItems: "center",
                          },
                          "& fieldset": { border: "none" },
                          "& svg": { color: "white" },
                        }}
                      >
                        {PO_STATUS_OPTIONS.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select> */}
                      <Select
                        size="small"
                        value={po?.status}
                        onChange={(e) =>
                          handleStatusChange(po.id, e.target.value)
                        }
                        // disable if DELIVERED (no further options)
                        disabled={po?.status === "DELIVERED"}
                        sx={{
                          minWidth: 140,
                          height: 26,
                          borderRadius: "999px",
                          fontWeight: 500,
                          color: "white",
                          bgcolor: getStatusColor(po.status),
                          "& .MuiSelect-select": {
                            py: 0.5,
                            pl: 2,
                            display: "flex",
                            alignItems: "center",
                          },
                          "& fieldset": { border: "none" },
                          "& svg": {
                            color:
                              po?.status === "DELIVERED"
                                ? "transparent"
                                : "white",
                          }, // hide arrow when locked
                        }}
                      >
                        {getAvailableStatusOptions(po?.status).map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>

                    <TableCell>{po.total_items || 0}</TableCell>
                    <TableCell>
                      <Chip
                        label={po.total_quantity}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleView(po)}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleEdit(po)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        disabled={deleteLoading}
                        onClick={() => handleDelete(po.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      {po?.status === "PICKED" && po?.id && (
                        <>
                          <IconButton
                            size="small"
                            color="warning"
                            onClick={async () => {
                              const response = await fetch(
                                `https://hogofilm.pythonanywhere.com/purchase-orders/${po?.id}/pdf/`,
                              );
                              const blob = await response.blob();
                              const url = window.URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = `PO-${editId}.pdf`;
                              a.click();
                              window.URL.revokeObjectURL(url);
                            }}
                          >
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}

            {!loading && purchaseOrders?.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No purchase orders found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack alignItems="flex-end" mt={3}>
        <Pagination
          count={Math.ceil((purchaseOrders?.length || 0) / rowsPerPage)}
          page={page}
          onChange={(_, v) => setPage(v)}
        />
      </Stack>
    </Box>
  );
};

export default PurchaseOrder;
