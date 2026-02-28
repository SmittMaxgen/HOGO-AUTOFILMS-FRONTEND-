// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import {
//   getShipmentProducts,
//   createShipmentProduct,
//   updateShipmentProduct,
//   deleteShipmentProduct,
// } from "../../feature/shipmentProducts/shipmentProductThunks";

// import {
//   selectShipmentProducts,
//   selectShipmentProductLoading,
//   selectCreateShipmentProductLoading,
//   selectCreateShipmentProductSuccess,
//   selectUpdateShipmentProductLoading,
//   selectUpdateShipmentProductSuccess,
//   selectDeleteShipmentProductLoading,
// } from "../../feature/shipmentProducts/shipmentProductSelector";

// import { getShipments } from "../../feature/shipments/shipmentThunks";
// import { getProducts } from "../../feature/products/productThunks";

// import { selectShipments } from "../../feature/shipments/shipmentSelector";
// import { selectProducts } from "../../feature/products/productSelector";

// import {
//   Box,
//   Paper,
//   Stack,
//   Typography,
//   IconButton,
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Pagination,
//   Autocomplete,
//   CircularProgress,
// } from "@mui/material";

// import AddIcon from "@mui/icons-material/Add";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// import Loader from "../../components/commonComponents/Loader";
// import CommonButton from "../../components/commonComponents/CommonButton";
// import CommonLabel from "../../components/commonComponents/CommonLabel";
// import CommonToast from "../../components/commonComponents/Toster";

// const ShipmentProducts = () => {
//   const dispatch = useDispatch();

//   const shipmentProducts = useSelector(selectShipmentProducts);
//   const shipments = useSelector(selectShipments);
//   const products = useSelector(selectProducts);

//   const loading = useSelector(selectShipmentProductLoading);
//   const createLoading = useSelector(selectCreateShipmentProductLoading);
//   const createSuccess = useSelector(selectCreateShipmentProductSuccess);
//   const updateLoading = useSelector(selectUpdateShipmentProductLoading);
//   const updateSuccess = useSelector(selectUpdateShipmentProductSuccess);
//   const deleteLoading = useSelector(selectDeleteShipmentProductLoading);

//   const [page, setPage] = useState(1);
//   const rowsPerPage = 5;

//   const [isEditing, setIsEditing] = useState(false);
//   const [editId, setEditId] = useState(null);

//   const [isViewing, setIsViewing] = useState(false);
//   const [viewData, setViewData] = useState(null);

//   const [errors, setErrors] = useState({});

//   const [form, setForm] = useState({
//     shipment_id: null,
//     product_id: null,
//     batch_data: "",
//     quantity: "",
//     allocation_basis: "",
//     landed_cost_allocated: "",
//     per_unit_cost_inr: "",
//     per_unit_cost_usd: "",
//   });

//   useEffect(() => {
//     dispatch(getShipmentProducts());
//     dispatch(getShipments());
//     dispatch(getProducts());
//   }, [dispatch]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = () => {
//     let tempErrors = {};

//     if (!form.shipment_id) tempErrors.shipment_id = "Shipment is required!";
//     if (!form.product_id) tempErrors.product_id = "Product is required!";
//     if (!form.batch_data) tempErrors.batch_data = "Batch Data is required!";
//     if (!form.quantity || form.quantity <= 0)
//       tempErrors.quantity = "Quantity must be greater than 0!";
//     if (!form.per_unit_cost_inr || form.per_unit_cost_inr <= 0)
//       tempErrors.per_unit_cost_inr = "Cost (INR) is required!";

//     setErrors(tempErrors);

//     if (Object.keys(tempErrors).length > 0) return;

//     const payload = {
//       ...form,
//       shipment_id: form.shipment_id?.id,
//       product_id: form.product_id?.id,
//     };

//     const action =
//       isEditing && editId
//         ? updateShipmentProduct({ id: editId, data: payload })
//         : createShipmentProduct(payload);

//     dispatch(action)
//       .unwrap()
//       .then(() => {
//         dispatch(getShipmentProducts());
//         handleReset();
//         CommonToast(
//           isEditing
//             ? "Shipment Product updated successfully!"
//             : "Shipment Product added successfully!",
//           "success",
//         );
//       })
//       .catch(() => {
//         CommonToast(
//           isEditing
//             ? "Failed to update Shipment Product!"
//             : "Failed to add Shipment Product!",
//           "error",
//         );
//       });
//   };

//   const handleEdit = (item) => {
//     setIsEditing(true);
//     setEditId(item.id);

//     setForm({
//       shipment_id: shipments.find((s) => s.id === item.shipment_id) || null,
//       product_id: products.find((p) => p.id === item.product_id) || null,
//       batch_data: item.batch_data,
//       quantity: item.quantity,
//       allocation_basis: item.allocation_basis,
//       landed_cost_allocated: item.landed_cost_allocated,
//       per_unit_cost_inr: item.per_unit_cost_inr,
//       per_unit_cost_usd: item.per_unit_cost_usd,
//     });
//   };

//   const handleView = (item) => {
//     setIsEditing(false);
//     setEditId(item.id);

//     setForm({
//       shipment_id: shipments.find((s) => s.id === item.shipment_id) || null,
//       product_id: products.find((p) => p.id === item.product_id) || null,
//       batch_data: item.batch_data,
//       quantity: item.quantity,
//       allocation_basis: item.allocation_basis,
//       landed_cost_allocated: item.landed_cost_allocated,
//       per_unit_cost_inr: item.per_unit_cost_inr,
//       per_unit_cost_usd: item.per_unit_cost_usd,
//     });
//     setViewData(item);
//     setIsViewing(true);
//   };

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this record?")) {
//       dispatch(deleteShipmentProduct(id))
//         .unwrap()
//         .then(() => {
//           dispatch(getShipmentProducts());
//           CommonToast("Shipment Product deleted successfully!", "success");
//         })
//         .catch(() => {
//           CommonToast("Failed to delete Shipment Product!", "error");
//         });
//     }
//   };

//   const handleReset = () => {
//     setForm({
//       shipment_id: null,
//       product_id: null,
//       batch_data: "",
//       quantity: "",
//       allocation_basis: "",
//       landed_cost_allocated: "",
//       per_unit_cost_inr: "",
//       per_unit_cost_usd: "",
//     });
//     setEditId(null);
//     setIsEditing(false);
//     setIsViewing(false);
//     setViewData(null);
//   };

//   const paginatedData = shipmentProducts?.slice(
//     (page - 1) * rowsPerPage,
//     page * rowsPerPage,
//   );

//   if (isEditing || isViewing) {
//     return (
//       <Box display="flex" justifyContent="center" mt={4}>
//         <Box width="100%">
//           <Stack direction="row" alignItems="center" spacing={1} mb={3}>
//             <IconButton onClick={handleReset}>
//               <ArrowBackIcon />
//             </IconButton>
//             <CommonLabel>
//               {editId
//                 ? `${isViewing ? "View" : "Edit"} Shipment Product`
//                 : `${isViewing ? "View" : "Edit"} Shipment Product`}
//             </CommonLabel>
//           </Stack>

//           <Paper sx={{ p: 3 }}>
//             <Stack spacing={2}>
//               <Autocomplete
//                 disabled={isViewing}
//                 options={shipments}
//                 getOptionLabel={(o) => `#${o.id} - ${o.supplier_invoice_no}`}
//                 value={form.shipment_id}
//                 onChange={(_, v) => {
//                   setForm((p) => ({ ...p, shipment_id: v }));
//                   setErrors((prev) => ({ ...prev, shipment_id: "" }));
//                 }}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label="Shipment"
//                     error={!!errors.shipment_id}
//                     helperText={errors.shipment_id}
//                   />
//                 )}
//               />

//               <Autocomplete
//                 disabled={isViewing}
//                 options={products}
//                 getOptionLabel={(o) => o.product_name}
//                 value={form.product_id}
//                 onChange={(_, v) => {
//                   setForm((p) => ({ ...p, product_id: v }));
//                   setErrors((prev) => ({ ...prev, product_id: "" }));
//                 }}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label="Product"
//                     error={!!errors.product_id}
//                     helperText={errors.product_id}
//                   />
//                 )}
//               />

//               <TextField
//                 disabled={isViewing}
//                 label="Batch Data"
//                 name="batch_data"
//                 value={form.batch_data}
//                 onChange={(e) => {
//                   handleChange(e);
//                   setErrors((prev) => ({ ...prev, batch_data: "" }));
//                 }}
//                 error={!!errors.batch_data}
//                 helperText={errors.batch_data}
//               />

//               <TextField
//                 disabled={isViewing}
//                 label="Quantity"
//                 type="number"
//                 name="quantity"
//                 value={form.quantity}
//                 onChange={(e) => {
//                   handleChange(e);
//                   setErrors((prev) => ({ ...prev, quantity: "" }));
//                 }}
//                 error={!!errors.quantity}
//                 helperText={errors.quantity}
//               />

//               <TextField
//                 disabled={isViewing}
//                 label="Allocation Basis"
//                 name="allocation_basis"
//                 value={form.allocation_basis}
//                 onChange={(e) => {
//                   handleChange(e);
//                   setErrors((prev) => ({ ...prev, allocation_basis: "" }));
//                 }}
//                 error={!!errors.allocation_basis}
//                 helperText={errors.allocation_basis}
//               />

//               <TextField
//                 disabled={isViewing}
//                 label="Landed Cost Allocated"
//                 type="number"
//                 name="landed_cost_allocated"
//                 value={form.landed_cost_allocated}
//                 onChange={(e) => {
//                   handleChange(e);
//                   setErrors((prev) => ({ ...prev, landed_cost_allocated: "" }));
//                 }}
//                 error={!!errors.landed_cost_allocated}
//                 helperText={errors.landed_cost_allocated}
//               />

//               <TextField
//                 disabled={isViewing}
//                 label="Per Unit Cost (INR)"
//                 type="number"
//                 name="per_unit_cost_inr"
//                 value={form.per_unit_cost_inr}
//                 onChange={(e) => {
//                   handleChange(e);
//                   setErrors((prev) => ({ ...prev, per_unit_cost_inr: "" }));
//                 }}
//                 error={!!errors.per_unit_cost_inr}
//                 helperText={errors.per_unit_cost_inr}
//               />

//               <TextField
//                 disabled={isViewing}
//                 label="Per Unit Cost (USD)"
//                 type="number"
//                 name="per_unit_cost_usd"
//                 value={form.per_unit_cost_usd}
//                 onChange={(e) => {
//                   handleChange(e);
//                   setErrors((prev) => ({ ...prev, per_unit_cost_usd: "" }));
//                 }}
//                 error={!!errors.per_unit_cost_usd}
//                 helperText={errors.per_unit_cost_usd}
//               />
//               {!isViewing && (
//                 <>
//                   <Stack direction="row" justifyContent="flex-end" spacing={2}>
//                     <CommonButton variant="outlined" onClick={handleReset}>
//                       Cancel
//                     </CommonButton>
//                     <CommonButton
//                       variant="contained"
//                       onClick={handleSubmit}
//                       disabled={createLoading || updateLoading}
//                     >
//                       {createLoading || updateLoading ? "Saving..." : "Save"}
//                     </CommonButton>
//                   </Stack>
//                 </>
//               )}
//             </Stack>
//           </Paper>
//         </Box>
//       </Box>
//     );
//   }

//   // if (loading) return <Loader text="Loading shipment products..." fullScreen />;

//   return (
//     <Box>
//       <Stack direction="row" justifyContent="space-between" mb={3}>
//         <Typography variant="h4" fontWeight={700} sx={{ color: "#7E7E7E" }}>
//           Shipment Products
//         </Typography>
//         <CommonButton
//           startIcon={<AddIcon />}
//           onClick={() => setIsEditing(true)}
//         >
//           Add Shipment Product
//         </CommonButton>
//       </Stack>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               {[
//                 "Sr",
//                 "batch_data",
//                 "Landed cost",
//                 "INR/UNIT",
//                 "USD/UNIT",
//                 "Allocation Basis",
//                 "Product",
//                 "Qty",
//                 "Cost (INR)",
//                 "Actions",
//               ].map((h) => (
//                 <TableCell key={h} sx={{ fontWeight: 700 }}>
//                   {h}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {loading && (
//               <TableRow>
//                 <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
//                   <CircularProgress size={28} />
//                   <Typography variant="body2" mt={1}>
//                     Loading shipments products...
//                   </Typography>
//                 </TableCell>
//               </TableRow>
//             )}
//             {!loading &&
//               paginatedData?.map((item, index) => (
//                 <TableRow key={item.id}>
//                   <TableCell>{index + 1}</TableCell>
//                   <TableCell>{item.batch_data}</TableCell>
//                   <TableCell>{item.landed_cost_allocated}</TableCell>
//                   <TableCell>{item.per_unit_cost_inr}</TableCell>
//                   <TableCell>{item.per_unit_cost_usd}</TableCell>
//                   <TableCell>{item.allocation_basis}</TableCell>
//                   {/* <TableCell>{item.shipment_id}</TableCell> */}
//                   <TableCell>{item.product_id}</TableCell>
//                   <TableCell>{item.quantity}</TableCell>
//                   <TableCell>{item.per_unit_cost_inr}</TableCell>
//                   <TableCell>
//                     <IconButton onClick={() => handleView(item)}>
//                       <VisibilityIcon />
//                     </IconButton>
//                     <IconButton
//                       onClick={() => handleEdit(item)}
//                       color="warning"
//                     >
//                       <EditIcon />
//                     </IconButton>
//                     <IconButton
//                       onClick={() => handleDelete(item.id)}
//                       color="error"
//                       disabled={deleteLoading}
//                     >
//                       <DeleteIcon />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             {shipmentProducts?.length === 0 && (
//               <TableRow>
//                 <TableCell colSpan={7} align="center">
//                   No shipments products found
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Stack alignItems="flex-end" mt={3}>
//         <Pagination
//           count={Math.ceil((shipmentProducts?.length || 0) / rowsPerPage)}
//           page={page}
//           onChange={(_, v) => setPage(v)}
//         />
//       </Stack>
//     </Box>
//   );
// };

// export default ShipmentProducts;
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
  Divider,
  Grid,
  Chip,
  InputAdornment,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ScaleIcon from "@mui/icons-material/Scale";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

import CommonButton from "../../components/commonComponents/CommonButton";
import CommonToast from "../../components/commonComponents/Toster";

// ─── Shared Helpers ────────────────────────────────────────────────────────────

const SectionHeading = ({ title }) => (
  <Box display="flex" alignItems="center" gap={1.5} mb={2}>
    <Box sx={{ width: 4, height: 22, bgcolor: "#D20000", borderRadius: 1 }} />
    <Typography
      variant="subtitle1"
      fontWeight={700}
      color="#1a1a1a"
      letterSpacing={0.5}
    >
      {title}
    </Typography>
  </Box>
);

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
    <Typography variant="h6" fontWeight={700} color="#fff" letterSpacing={1}>
      {title}
    </Typography>
  </Box>
);

const DetailCard = ({ label, value, icon }) => (
  <Box
    sx={{
      p: 2,
      bgcolor: "#fafafa",
      border: "1px solid #ebebeb",
      borderRadius: 2,
      height: "100%",
    }}
  >
    <Box display="flex" alignItems="center" gap={0.8} mb={0.5}>
      {icon && <Box sx={{ color: "#D20000", display: "flex" }}>{icon}</Box>}
      <Typography variant="caption" color="text.secondary" fontWeight={700}>
        {label}
      </Typography>
    </Box>
    <Typography variant="body2" fontWeight={600} color="#1a1a1a">
      {value ?? "N/A"}
    </Typography>
  </Box>
);

// shared field focus style
const fieldSx = {
  "& .MuiOutlinedInput-root.Mui-focused fieldset": { borderColor: "#D20000" },
  "& label.Mui-focused": { color: "#D20000" },
};

// ─── Main Component ────────────────────────────────────────────────────────────

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
  const rowsPerPage = 10;

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
    setIsEditing(false);
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
    setErrors({});
    setEditId(null);
    setIsEditing(false);
    setIsViewing(false);
    setViewData(null);
  };

  const paginatedData = shipmentProducts?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  // ── Create / Edit / View Form ────────────────────────────────────────────────
  if (isEditing || isViewing) {
    const readOnly = isViewing;
    const headerTitle = readOnly
      ? "View Shipment Product"
      : editId
        ? "Edit Shipment Product"
        : "Create Shipment Product";

    return (
      <Box mt={4}>
        <PageHeader title={headerTitle} onBack={handleReset} />

        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid #f0f0f0",
          }}
        >
          {/* ── View mode: card layout ── */}
          {readOnly && viewData ? (
            <>
              {/* Identity strip */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  px: 4,
                  py: 3,
                  bgcolor: "#fafafa",
                  borderBottom: "2px solid #D20000",
                }}
              >
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: 2,
                    bgcolor: "#ebebeb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "3px solid #D20000",
                    flexShrink: 0,
                  }}
                >
                  <Inventory2Icon sx={{ fontSize: 32, color: "#D20000" }} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={700} color="#1a1a1a">
                    Batch: {viewData.batch_data}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={0.4}>
                    Product ID: {viewData.product_id} &nbsp;|&nbsp; Qty:{" "}
                    {viewData.quantity}
                  </Typography>
                </Box>
              </Box>

              <Box px={4} py={3}>
                <SectionHeading title="Shipment & Product" />
                <Grid container spacing={2} mb={3}>
                  {[
                    {
                      label: "Shipment",
                      value: form.shipment_id
                        ? `#${form.shipment_id.id} - ${form.shipment_id.supplier_invoice_no}`
                        : viewData.shipment_id,
                      icon: <LocalShippingIcon fontSize="small" />,
                    },
                    {
                      label: "Product",
                      value:
                        form.product_id?.product_name || viewData.product_id,
                      icon: <ShoppingCartIcon fontSize="small" />,
                    },
                    {
                      label: "Batch Data",
                      value: viewData.batch_data,
                      icon: <Inventory2Icon fontSize="small" />,
                    },
                    {
                      label: "Quantity",
                      value: viewData.quantity,
                      icon: <ScaleIcon fontSize="small" />,
                    },
                  ].map((item) => (
                    <Grid item xs={12} sm={6} md={3} key={item.label}>
                      <DetailCard
                        label={item.label}
                        value={item.value}
                        icon={item.icon}
                      />
                    </Grid>
                  ))}
                </Grid>

                <Divider sx={{ my: 2 }} />
                <SectionHeading title="Cost Details" />
                <Grid container spacing={2}>
                  {[
                    {
                      label: "Allocation Basis",
                      value: viewData.allocation_basis,
                    },
                    {
                      label: "Landed Cost Allocated",
                      value: viewData.landed_cost_allocated,
                      icon: <MonetizationOnIcon fontSize="small" />,
                    },
                    {
                      label: "Per Unit Cost (INR)",
                      value: viewData.per_unit_cost_inr
                        ? `₹ ${viewData.per_unit_cost_inr}`
                        : null,
                      icon: <CurrencyRupeeIcon fontSize="small" />,
                    },
                    {
                      label: "Per Unit Cost (USD)",
                      value: viewData.per_unit_cost_usd
                        ? `$ ${viewData.per_unit_cost_usd}`
                        : null,
                      icon: <MonetizationOnIcon fontSize="small" />,
                    },
                  ].map((item) => (
                    <Grid item xs={12} sm={6} md={3} key={item.label}>
                      <DetailCard
                        label={item.label}
                        value={item.value}
                        icon={item.icon}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </>
          ) : (
            /* ── Edit / Create mode: form layout ── */
            <>
              <Box
                sx={{
                  px: 3,
                  py: 2,
                  bgcolor: "#fafafa",
                  borderBottom: "1px solid #ebebeb",
                }}
              >
                <SectionHeading title="Shipment & Product" />
              </Box>
              <Box px={4} py={4}>
                <Grid container spacing={2.5}>
                  {/* Shipment Autocomplete */}
                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      options={shipments}
                      getOptionLabel={(o) =>
                        `#${o.id} - ${o.supplier_invoice_no}`
                      }
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
                          sx={fieldSx}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <>
                                <InputAdornment position="start">
                                  <LocalShippingIcon
                                    sx={{ color: "#D20000" }}
                                  />
                                </InputAdornment>
                                {params.InputProps.startAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* Product Autocomplete */}
                  <Grid item xs={12} sm={6}>
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
                          sx={fieldSx}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <>
                                <InputAdornment position="start">
                                  <ShoppingCartIcon sx={{ color: "#D20000" }} />
                                </InputAdornment>
                                {params.InputProps.startAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* Batch Data */}
                  <Grid item xs={12} sm={6}>
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
                      fullWidth
                      sx={fieldSx}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Inventory2Icon sx={{ color: "#D20000" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Quantity */}
                  <Grid item xs={12} sm={6}>
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
                      fullWidth
                      sx={fieldSx}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <ScaleIcon sx={{ color: "#D20000" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Divider>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={700}
                        letterSpacing={1}
                      >
                        COST DETAILS
                      </Typography>
                    </Divider>
                  </Grid>

                  {/* Allocation Basis */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Allocation Basis"
                      name="allocation_basis"
                      value={form.allocation_basis}
                      onChange={(e) => {
                        handleChange(e);
                        setErrors((prev) => ({
                          ...prev,
                          allocation_basis: "",
                        }));
                      }}
                      error={!!errors.allocation_basis}
                      helperText={errors.allocation_basis}
                      fullWidth
                      sx={fieldSx}
                    />
                  </Grid>

                  {/* Landed Cost */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Landed Cost Allocated"
                      type="number"
                      name="landed_cost_allocated"
                      value={form.landed_cost_allocated}
                      onChange={(e) => {
                        handleChange(e);
                        setErrors((prev) => ({
                          ...prev,
                          landed_cost_allocated: "",
                        }));
                      }}
                      error={!!errors.landed_cost_allocated}
                      helperText={errors.landed_cost_allocated}
                      fullWidth
                      sx={fieldSx}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MonetizationOnIcon sx={{ color: "#D20000" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Per Unit Cost INR */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Per Unit Cost (INR)"
                      type="number"
                      name="per_unit_cost_inr"
                      value={form.per_unit_cost_inr}
                      onChange={(e) => {
                        handleChange(e);
                        setErrors((prev) => ({
                          ...prev,
                          per_unit_cost_inr: "",
                        }));
                      }}
                      error={!!errors.per_unit_cost_inr}
                      helperText={errors.per_unit_cost_inr}
                      fullWidth
                      sx={fieldSx}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CurrencyRupeeIcon sx={{ color: "#D20000" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Per Unit Cost USD */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Per Unit Cost (USD)"
                      type="number"
                      name="per_unit_cost_usd"
                      value={form.per_unit_cost_usd}
                      onChange={(e) => {
                        handleChange(e);
                        setErrors((prev) => ({
                          ...prev,
                          per_unit_cost_usd: "",
                        }));
                      }}
                      error={!!errors.per_unit_cost_usd}
                      helperText={errors.per_unit_cost_usd}
                      fullWidth
                      sx={fieldSx}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MonetizationOnIcon sx={{ color: "#D20000" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                  <CommonButton variant="outlined" onClick={handleReset}>
                    Cancel
                  </CommonButton>
                  <CommonButton
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={createLoading || updateLoading}
                    sx={{
                      bgcolor: "#D20000",
                      "&:hover": { bgcolor: "#a80000" },
                      fontWeight: 700,
                    }}
                  >
                    {createLoading || updateLoading
                      ? "Saving..."
                      : editId
                        ? "Update Product"
                        : "Save Product"}
                  </CommonButton>
                </Stack>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    );
  }

  // ── List View ────────────────────────────────────────────────────────────────
  return (
    <Box>
      {/* Page Title Row */}
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
            Shipment Products
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
            borderRadius: 1.5,
            px: 2.5,
            boxShadow: "0 4px 12px rgba(210,0,0,0.3)",
          }}
        >
          Add Shipment Product
        </CommonButton>
      </Stack>

      {/* Table Card */}
      <Paper
        elevation={2}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid #f0f0f0",
        }}
      >
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
                  "Batch",
                  "Landed Cost",
                  "INR / Unit",
                  "USD / Unit",
                  "Allocation Basis",
                  "Product",
                  "Qty",
                  "Actions",
                ].map((h) => (
                  <TableCell
                    key={h}
                    sx={{
                      fontWeight: 700,
                      color: "#fff",
                      fontSize: 13,
                      letterSpacing: 0.5,
                      border: "none",
                      py: 1.5,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 5 }}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      gap={1}
                    >
                      <CircularProgress size={28} sx={{ color: "#D20000" }} />
                      <Typography variant="body2" color="text.secondary">
                        Loading shipment products...
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                paginatedData?.map((item, index) => (
                  <TableRow
                    key={item.id}
                    hover
                    sx={{
                      "&:hover": { bgcolor: "#fff5f5" },
                      "&:last-child td": { border: 0 },
                      borderBottom: "1px solid #f5f5f5",
                      transition: "background 0.15s",
                    }}
                  >
                    {/* Sr */}
                    <TableCell
                      sx={{ fontWeight: 700, color: "#D20000", width: 50 }}
                    >
                      {(page - 1) * rowsPerPage + index + 1}
                    </TableCell>

                    {/* Batch */}
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1.2}>
                        <Box
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: 1,
                            bgcolor: "#f0f0f0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid #e0e0e0",
                            flexShrink: 0,
                          }}
                        >
                          <Inventory2Icon
                            sx={{ fontSize: 15, color: "#D20000" }}
                          />
                        </Box>
                        <Typography
                          fontWeight={600}
                          fontSize={13}
                          color="#1a1a1a"
                        >
                          {item.batch_data}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Landed Cost */}
                    <TableCell>
                      <Typography
                        fontSize={13}
                        fontWeight={500}
                        color="text.secondary"
                      >
                        {item.landed_cost_allocated ?? "—"}
                      </Typography>
                    </TableCell>

                    {/* INR/Unit */}
                    <TableCell>
                      <Chip
                        label={`₹ ${item.per_unit_cost_inr}`}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: 11,
                          bgcolor: "#fce4ec",
                          color: "#c62828",
                          border: "1px solid #ef9a9a",
                          borderRadius: 1,
                        }}
                      />
                    </TableCell>

                    {/* USD/Unit */}
                    <TableCell>
                      <Chip
                        label={`$ ${item.per_unit_cost_usd}`}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: 11,
                          bgcolor: "#e8f5e9",
                          color: "#2e7d32",
                          border: "1px solid #c8e6c9",
                          borderRadius: 1,
                        }}
                      />
                    </TableCell>

                    {/* Allocation Basis */}
                    <TableCell>
                      <Typography fontSize={13} color="text.secondary">
                        {item.allocation_basis ?? "—"}
                      </Typography>
                    </TableCell>

                    {/* Product */}
                    <TableCell>
                      <Typography
                        fontSize={13}
                        fontWeight={500}
                        color="#1a1a1a"
                      >
                        {item.product_id}
                      </Typography>
                    </TableCell>

                    {/* Qty */}
                    <TableCell>
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minWidth: 32,
                          px: 1,
                          py: 0.3,
                          bgcolor: "#f0f4ff",
                          color: "#1565c0",
                          border: "1px solid #d0deff",
                          borderRadius: 1,
                          fontWeight: 700,
                          fontSize: 13,
                        }}
                      >
                        {item.quantity}
                      </Box>
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <Box display="flex" gap={0.5}>
                        <IconButton
                          size="small"
                          onClick={() => handleView(item)}
                          sx={{
                            bgcolor: "#f0f4ff",
                            color: "#1565c0",
                            "&:hover": { bgcolor: "#d0deff" },
                            borderRadius: 1,
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(item)}
                          sx={{
                            bgcolor: "#fff8e1",
                            color: "#f57c00",
                            "&:hover": { bgcolor: "#ffe082" },
                            borderRadius: 1,
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          disabled={deleteLoading}
                          onClick={() => handleDelete(item.id)}
                          sx={{
                            bgcolor: "#fce4ec",
                            color: "#c62828",
                            "&:hover": { bgcolor: "#ef9a9a" },
                            borderRadius: 1,
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}

              {!loading && shipmentProducts?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      gap={1}
                    >
                      <Inventory2Icon sx={{ fontSize: 40, color: "#e0e0e0" }} />
                      <Typography color="text.secondary" fontWeight={500}>
                        No shipment products found
                      </Typography>
                    </Box>
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
            count={Math.ceil((shipmentProducts?.length || 0) / rowsPerPage)}
            page={page}
            onChange={(_, v) => setPage(v)}
            sx={{
              "& .MuiPaginationItem-root.Mui-selected": {
                bgcolor: "#D20000",
                color: "#fff",
                "&:hover": { bgcolor: "#a80000" },
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default ShipmentProducts;
