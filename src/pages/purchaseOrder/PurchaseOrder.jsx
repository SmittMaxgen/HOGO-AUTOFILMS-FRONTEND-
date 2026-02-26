// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import {
//   getPurchaseOrders,
//   createPurchaseOrder,
//   updatePurchaseOrder,
//   deletePurchaseOrder,
// } from "../../feature/purchaseOrder/purchaseOrderThunks";

// import {
//   selectPurchaseOrders,
//   selectPurchaseOrderLoading,
//   selectCreatePurchaseOrderLoading,
//   selectCreatePurchaseOrderSuccess,
//   selectUpdatePurchaseOrderLoading,
//   selectUpdatePurchaseOrderSuccess,
//   selectPurchaseOrderError,
//   selectDeletePurchaseOrderLoading,
// } from "../../feature/purchaseOrder/purchaseOrderSelector";

// // TODO: Import your product and distributor selectors
// // import { selectProducts } from "../../feature/product/productSelector";
// // import { selectDistributors } from "../../feature/distributor/distributorSelector";
// // import { getProducts } from "../../feature/product/productThunks";
// // import { getDistributors } from "../../feature/distributor/distributorThunks";

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
//   Chip,
//   Pagination,
//   CircularProgress,
//   Grid,
//   Divider,
//   Card,
//   CardContent,
//   InputAdornment,
//   Button,
//   Alert,
//   Autocomplete,
//   Select,
//   MenuItem,
// } from "@mui/material";

// import AddIcon from "@mui/icons-material/Add";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

// import CommonButton from "../../components/commonComponents/CommonButton";
// import CommonLabel from "../../components/commonComponents/CommonLabel";
// import CommonToast from "../../components/commonComponents/Toster";
// import CommonSearchField from "../../components/commonComponents/CommonSearchField";

// import DownloadIcon from "@mui/icons-material/Download";

// const PurchaseOrder = () => {
//   const dispatch = useDispatch();

//   const purchaseOrders = useSelector(selectPurchaseOrders);
//   const loading = useSelector(selectPurchaseOrderLoading);
//   const createLoading = useSelector(selectCreatePurchaseOrderLoading);
//   const createSuccess = useSelector(selectCreatePurchaseOrderSuccess);
//   const updateLoading = useSelector(selectUpdatePurchaseOrderLoading);
//   const updateSuccess = useSelector(selectUpdatePurchaseOrderSuccess);
//   const updateError = useSelector(selectPurchaseOrderError);
//   const deleteLoading = useSelector(selectDeletePurchaseOrderLoading);

//   // TODO: Replace these with your actual Redux selectors
//   // const products = useSelector(selectProducts);
//   // const distributors = useSelector(selectDistributors);

//   // MOCK DATA - Replace with actual API data
//   const [products, setProducts] = useState([
//     {
//       product_id: 1,
//       product_name: "Bike",
//       unit_distributor_price: 50,
//       mrp: 50,
//     },
//     {
//       product_id: 2,
//       product_name: "Cycle",
//       unit_distributor_price: 30,
//       mrp: 35,
//     },
//     {
//       product_id: 3,
//       product_name: "Helmet",
//       unit_distributor_price: 20,
//       mrp: 25,
//     },
//     {
//       product_id: 4,
//       product_name: "Lock",
//       unit_distributor_price: 15,
//       mrp: 18,
//     },
//   ]);

//   const [distributors, setDistributors] = useState([
//     { distributor_id: 1, distributor_name: "ABC Distributors" },
//     { distributor_id: 2, distributor_name: "XYZ Suppliers" },
//     { distributor_id: 3, distributor_name: "Global Trading Co." },
//   ]);

//   const [page, setPage] = useState(1);
//   const rowsPerPage = 5;

//   const [isEditing, setIsEditing] = useState(false);
//   const [editId, setEditId] = useState(null);

//   const [isViewing, setIsViewing] = useState(false);
//   const [viewPO, setViewPO] = useState(null);

//   const [searchQuery, setSearchQuery] = useState("");

//   const [form, setForm] = useState({
//     po_number: "",
//     distributor_id: "",
//     product_items: [],
//     remarks: "",
//   });
//   const [poStatus, setPoStatus] = useState("");

//   // Product line item form with selected product object
//   const [productForm, setProductForm] = useState({
//     product_id: "",
//     product_name: "",
//     quantity: 1,
//     unit_distributor_price: 0,
//     mrp: 0,
//   });

//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [selectedDistributor, setSelectedDistributor] = useState(null);

//   const [errors, setErrors] = useState({});

//   // ================= FETCH DATA =================
//   useEffect(() => {
//     // TODO: Fetch products and distributors
//     // dispatch(getProducts());
//     // dispatch(getDistributors());

//     const delay = setTimeout(() => {
//       dispatch(getPurchaseOrders());
//       setPage(1);
//     }, 300);

//     return () => clearTimeout(delay);
//   }, [dispatch, searchQuery]);

//   useEffect(() => {
//     if (updateError && updateError[0]) {
//       const message = updateError[0];
//       CommonToast(message, "info");
//     }
//   }, [updateError]);

//   useEffect(() => {
//     if (createSuccess || updateSuccess) {
//       dispatch(getPurchaseOrders());
//       handleReset();
//     }
//   }, [createSuccess, updateSuccess, dispatch]);

//   // ================= PRODUCT CALCULATIONS =================
//   const calculateProductTotals = (item) => {
//     const quantity = Number(item.quantity) || 0;
//     const unitDistPrice = Number(item.unit_distributor_price) || 0;
//     const unitMRP = Number(item.mrp) || 0;

//     return {
//       ...item,
//       quantity,
//       unit_distributor_price: unitDistPrice,
//       mrp: unitMRP,
//       total_distributor_price: quantity * unitDistPrice,
//       total_mrp_price: quantity * unitMRP,
//     };
//   };

//   const calculateGrandTotals = () => {
//     const totals = form.product_items.reduce(
//       (acc, item) => {
//         const calculated = calculateProductTotals(item);
//         return {
//           totalQty: acc.totalQty + calculated.quantity,
//           totalDistPrice:
//             acc.totalDistPrice + calculated.total_distributor_price,
//           totalMRPPrice: acc.totalMRPPrice + calculated.total_mrp_price,
//           totalItems: acc.totalItems + 1,
//         };
//       },
//       { totalQty: 0, totalDistPrice: 0, totalMRPPrice: 0, totalItems: 0 },
//     );
//     return totals;
//   };

//   // ================= PRODUCT HANDLERS =================
//   const handleProductSelect = (event, value) => {
//     setSelectedProduct(value);
//     if (value) {
//       setProductForm({
//         product_id: value.product_id,
//         product_name: value.product_name,
//         quantity: 1,
//         unit_distributor_price: value.unit_distributor_price || 0,
//         mrp: value.mrp || 0,
//       });
//     } else {
//       setProductForm({
//         product_id: "",
//         product_name: "",
//         quantity: 1,
//         unit_distributor_price: 0,
//         mrp: 0,
//       });
//     }
//   };

//   const handleDistributorSelect = (event, value) => {
//     setSelectedDistributor(value);
//     if (value) {
//       setForm({ ...form, distributor_id: value.distributor_id });
//       setErrors({ ...errors, distributor_id: "" });
//     } else {
//       setForm({ ...form, distributor_id: "" });
//     }
//   };

//   const handleAddProduct = () => {
//     if (!productForm.product_id || !productForm.product_name) {
//       CommonToast("Please select a product", "error");
//       return;
//     }
//     if (productForm.quantity <= 0) {
//       CommonToast("Quantity must be greater than 0", "error");
//       return;
//     }

//     const newProduct = calculateProductTotals(productForm);
//     setForm({
//       ...form,
//       product_items: [...form.product_items, newProduct],
//     });

//     // Reset product form
//     setSelectedProduct(null);
//     setProductForm({
//       product_id: "",
//       product_name: "",
//       quantity: 1,
//       unit_distributor_price: 0,
//       mrp: 0,
//     });

//     CommonToast("Product added successfully", "success");
//   };

//   const handleRemoveProduct = (index) => {
//     const updated = form.product_items.filter((_, i) => i !== index);
//     setForm({ ...form, product_items: updated });
//     CommonToast("Product removed", "info");
//   };

//   const handleUpdateProductItem = (index, field, value) => {
//     const updated = form.product_items.map((item, i) => {
//       if (i === index) {
//         const updatedItem = { ...item, [field]: value };
//         return calculateProductTotals(updatedItem);
//       }
//       return item;
//     });
//     setForm({ ...form, product_items: updated });
//   };

//   const PO_STATUS_OPTIONS = [
//     "DRAFT",
//     "SUBMITTED",
//     "APPROVED",
//     "REJECTED",
//     "CANCELLED",
//     "PICKED",
//     "PACKED",
//     "DELIVERED",
//   ];

//   const getAvailableStatusOptions = (currentStatus) => {
//     switch (currentStatus) {
//       case "APPROVED":
//         return ["APPROVED", "PICKED", "PACKED", "DELIVERED"];
//       case "PARTIALLY_APPROVED":
//         return ["PARTIALLY_APPROVED", "PICKED", "PACKED", "DELIVERED"];
//       case "PICKED":
//         return ["PICKED", "PACKED", "DELIVERED"];
//       case "PACKED":
//         return ["PACKED", "DELIVERED"];
//       case "DELIVERED":
//         return ["DELIVERED"]; // locked, no forward options
//       default:
//         return [
//           "DRAFT",
//           "SUBMITTED",
//           "APPROVED",
//           "REJECTED",
//           "PARTIALLY_APPROVED",
//           "CANCELLED",
//         ];
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "DRAFT":
//         return "grey.500";

//       case "APPROVED":
//         return "success.main";

//       case "SUBMITTED":
//         return "warning.main";

//       case "REJECTED":
//         return "error.main";

//       case "PARTIALLY_APPROVED":
//         return "info.main";

//       case "CANCELLED":
//         return "grey.600";

//       case "PICKED":
//         return "orange";

//       case "PACKED":
//         return "primary.main";

//       case "DELIVERED":
//         return "#7c3aed";

//       default:
//         return "grey.400"; // fallback (important)
//     }
//   };

//   const handleStatusChange = (id, value) => {
//     dispatch(
//       updatePurchaseOrder({
//         id,
//         data: { status: value },
//       }),
//     );
//   };

//   // ================= FORM HELPERS =================
//   // ================= FORM HELPERS =================
//   const validate = () => {
//     const temp = {};
//     if (!form.po_number) temp.po_number = "PO number is required";
//     if (!form.distributor_id) temp.distributor_id = "Distributor is required";
//     if (!form.product_items.length)
//       temp.product_items = "At least one product required";

//     setErrors(temp);
//     return Object.keys(temp).length === 0;
//   };

//   const handleSubmit = () => {
//     if (!validate()) {
//       CommonToast("Please fill all required fields", "error");
//       return;
//     }

//     // Prepare the data exactly as your API expects
//     const submitData = {
//       po_number: form.po_number,
//       distributor_id: Number(form.distributor_id), // Ensure it's a number
//       product_items: form.product_items.map((item) => ({
//         product_id: Number(item.product_id),
//         product_name: item.product_name,
//         quantity: Number(item.quantity),
//         mrp: Number(item.mrp),
//         unit_distributor_price: Number(item.unit_distributor_price),
//         total_distributor_price:
//           Number(item.quantity) * Number(item.unit_distributor_price),
//         total_mrp_price: Number(item.quantity) * Number(item.mrp),
//         short_pick: Number(item.short_pick),
//         hsn_code: Number(item.hsn_code),
//         cartons: Number(item.cartons),
//         qty_picked: Number(item.qty_picked),
//         gross_weight: Number(item.gross_weight),
//         net_weight: Number(item.net_weight),
//         remarks: item.remarks || "",
//       })),
//       remarks: form.remarks || "",
//     };

//     if (isEditing && editId) {
//       dispatch(updatePurchaseOrder({ id: editId, data: submitData }))
//         .unwrap()
//         .then((response) => {
//           CommonToast("Purchase order updated successfully", "success");
//         })
//         .catch((error) => {
//           console.error("Update Error:", error); // DEBUG
//           CommonToast(
//             error?.message || "Failed to update purchase order",
//             "error",
//           );
//         });
//     } else {
//       dispatch(createPurchaseOrder(submitData))
//         .unwrap()
//         .then((response) => {
//           CommonToast("Purchase order created successfully", "success");
//         })
//         .catch((error) => {
//           console.error("Create Error:", error); // DEBUG
//           CommonToast(
//             error?.message || "Failed to create purchase order",
//             "error",
//           );
//         });
//     }
//   };

//   const handleView = (po) => {
//     setViewPO(po);
//     setIsViewing(true);
//   };

//   const handleEdit = (po) => {
//     setPoStatus(po?.status);
//     setIsEditing(true);
//     setEditId(po.id);
//     setForm({
//       po_number: po.po_number,
//       distributor_id: po.distributor_id,
//       product_items: po.product_items || [],
//       remarks: po.remarks || "",
//     });

//     // Set selected distributor for edit mode
//     const dist = distributors.find(
//       (d) => d.distributor_id === po.distributor_id,
//     );
//     setSelectedDistributor(dist || null);
//   };

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this PO?")) {
//       dispatch(deletePurchaseOrder(id))
//         .unwrap()
//         .then(() =>
//           CommonToast("Purchase order deleted successfully", "success"),
//         )
//         .catch(() => CommonToast("Failed to delete purchase order", "error"));
//     }
//   };

//   const handleReset = () => {
//     setIsEditing(false);
//     setEditId(null);
//     setIsViewing(false);
//     setViewPO(null);
//     setForm({
//       po_number: "",
//       distributor_id: "",
//       product_items: [],
//       remarks: "",
//     });
//     setProductForm({
//       product_id: "",
//       product_name: "",
//       quantity: 1,
//       unit_distributor_price: 0,
//       mrp: 0,
//     });
//     setSelectedProduct(null);
//     setSelectedDistributor(null);
//     setErrors({});
//   };

//   const paginatedData = purchaseOrders?.slice(
//     (page - 1) * rowsPerPage,
//     page * rowsPerPage,
//   );

//   const grandTotals = calculateGrandTotals();

//   // ================= CREATE / EDIT VIEW =================
//   if (isEditing) {
//     return (
//       <Box mt={4}>
//         <Stack direction="row" alignItems="center" spacing={1} mb={3}>
//           <IconButton onClick={handleReset}>
//             <ArrowBackIcon />
//           </IconButton>
//           <CommonLabel>
//             {editId ? "Edit Purchase Order" : "Create Purchase Order"}
//           </CommonLabel>
//         </Stack>

//         <Grid container spacing={3}>
//           {/* Left Side - PO Details */}
//           <Grid item xs={12} md={4}>
//             <Paper sx={{ p: 3, height: "100%", width: "100%" }}>
//               <Typography variant="h6" gutterBottom>
//                 PO Details
//               </Typography>
//               <Divider sx={{ mb: 2 }} />

//               <Stack spacing={2}>
//                 <TextField
//                   label="PO Number"
//                   value={form.po_number}
//                   onChange={(e) =>
//                     setForm({ ...form, po_number: e.target.value })
//                   }
//                   error={!!errors.po_number}
//                   helperText={errors.po_number}
//                   fullWidth
//                   size="small"
//                 />

//                 {/* Distributor Autocomplete */}
//                 <Autocomplete
//                   options={distributors}
//                   getOptionLabel={(option) =>
//                     `${option.distributor_name} (ID: ${option.distributor_id})`
//                   }
//                   value={selectedDistributor}
//                   onChange={handleDistributorSelect}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label="Select Distributor"
//                       error={!!errors.distributor_id}
//                       helperText={errors.distributor_id}
//                       size="small"
//                     />
//                   )}
//                   renderOption={(props, option) => (
//                     <li {...props} key={option.distributor_id}>
//                       <Box>
//                         <Typography variant="body2" fontWeight={600}>
//                           {option.distributor_name}
//                         </Typography>
//                         {/* <Typography variant="caption" color="text.secondary">
//                           ID: {option.distributor_id}
//                         </Typography> */}
//                       </Box>
//                     </li>
//                   )}
//                   isOptionEqualToValue={(option, value) =>
//                     option.distributor_id === value.distributor_id
//                   }
//                   fullWidth
//                 />

//                 <TextField
//                   label="Remarks"
//                   value={form.remarks}
//                   onChange={(e) =>
//                     setForm({ ...form, remarks: e.target.value })
//                   }
//                   fullWidth
//                   multiline
//                   rows={4}
//                   size="small"
//                 />

//                 {/* Grand Total Summary */}
//                 <Card sx={{ bgcolor: "primary.50", mt: 2 }}>
//                   <CardContent>
//                     <Typography
//                       variant="subtitle2"
//                       color="primary"
//                       gutterBottom
//                     >
//                       Order Summary
//                     </Typography>
//                     <Stack spacing={1}>
//                       <Stack direction="row" justifyContent="space-between">
//                         <Typography variant="body2">Total Items:</Typography>
//                         <Typography variant="body2" fontWeight={600}>
//                           {grandTotals.totalItems}
//                         </Typography>
//                       </Stack>
//                       <Stack direction="row" justifyContent="space-between">
//                         <Typography variant="body2">Total Quantity:</Typography>
//                         <Typography variant="body2" fontWeight={600}>
//                           {grandTotals.totalQty}
//                         </Typography>
//                       </Stack>
//                       <Divider />
//                       <Stack direction="row" justifyContent="space-between">
//                         <Typography variant="body2">
//                           Distributor Total:
//                         </Typography>
//                         <Typography
//                           variant="body2"
//                           fontWeight={700}
//                           color="primary"
//                         >
//                           ₹ {grandTotals.totalDistPrice.toFixed(2)}
//                         </Typography>
//                       </Stack>
//                       <Stack direction="row" justifyContent="space-between">
//                         <Typography variant="body2">MRP Total:</Typography>
//                         <Typography variant="body2" fontWeight={700}>
//                           ₹ {grandTotals.totalMRPPrice.toFixed(2)}
//                         </Typography>
//                       </Stack>
//                     </Stack>
//                   </CardContent>
//                 </Card>

//                 {errors.product_items && (
//                   <Alert severity="error">{errors.product_items}</Alert>
//                 )}

//                 <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
//                   <CommonButton
//                     variant="outlined"
//                     onClick={handleReset}
//                     fullWidth
//                   >
//                     Cancel
//                   </CommonButton>
//                   <CommonButton
//                     variant="contained"
//                     onClick={handleSubmit}
//                     disabled={createLoading || updateLoading}
//                     fullWidth
//                   >
//                     {createLoading || updateLoading ? "Saving..." : "Save PO"}
//                   </CommonButton>
//                 </Stack>
//               </Stack>
//             </Paper>
//           </Grid>

//           {/* Right Side - Products */}
//           <Grid item xs={12} md={8}>
//             <Paper sx={{ p: 3 }}>
//               <Typography variant="h6" gutterBottom>
//                 <ShoppingCartIcon sx={{ verticalAlign: "middle", mr: 1 }} />
//                 Product Items
//               </Typography>
//               <Divider sx={{ mb: 2 }} />

//               {/* Add Product Form */}

//               {/* Products List */}
//               {form.product_items.length === 0 ? (
//                 <Alert severity="info">
//                   No products added yet. Add products using the form above.
//                 </Alert>
//               ) : (
//                 <TableContainer>
//                   <Table size="small">
//                     <TableHead>
//                       <TableRow sx={{ bgcolor: "grey.100" }}>
//                         <TableCell sx={{ fontWeight: 700 }}>Sr</TableCell>
//                         <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
//                         <TableCell sx={{ fontWeight: 700 }} align="center">
//                           Qty
//                         </TableCell>
//                         <TableCell sx={{ fontWeight: 700 }} align="center">
//                           Dist. Price
//                         </TableCell>
//                         <TableCell sx={{ fontWeight: 700 }} align="center">
//                           MRP
//                         </TableCell>
//                         <TableCell sx={{ fontWeight: 700 }} align="center">
//                           Total Dist.
//                         </TableCell>
//                         <TableCell sx={{ fontWeight: 700 }} align="center">
//                           Total MRP
//                         </TableCell>
//                         {(poStatus === "PICKED" ||
//                           poStatus === "PACKED" ||
//                           poStatus === "APPROVED" ||
//                           poStatus === "DELIVERED") && (
//                           <>
//                             <TableCell sx={{ fontWeight: 700 }} align="center">
//                               Qty Picked
//                             </TableCell>
//                             <TableCell sx={{ fontWeight: 700 }} align="center">
//                               Short Pick
//                             </TableCell>
//                           </>
//                         )}

//                         {(poStatus === "PACKED" ||
//                           poStatus === "DELIVERED") && (
//                           <>
//                             {" "}
//                             <TableCell sx={{ fontWeight: 700 }} align="center">
//                               HSN Code
//                             </TableCell>
//                             <TableCell sx={{ fontWeight: 700 }} align="center">
//                               No. of Cartons / Boxes
//                             </TableCell>
//                             <TableCell sx={{ fontWeight: 700 }} align="center">
//                               Gross Weight (KG)
//                             </TableCell>
//                             <TableCell sx={{ fontWeight: 700 }} align="center">
//                               Net Weight (KG)
//                             </TableCell>
//                             <TableCell sx={{ fontWeight: 700 }} align="center">
//                               Remarks
//                             </TableCell>
//                           </>
//                         )}

//                         <TableCell sx={{ fontWeight: 700 }} align="center">
//                           Action
//                         </TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {form.product_items.map((item, index) => {
//                         const calculated = calculateProductTotals(item);
//                         return (
//                           <TableRow key={index} hover>
//                             <TableCell>{index + 1}</TableCell>
//                             <TableCell>
//                               <Typography variant="body2" fontWeight={600}>
//                                 {item.product_name}
//                               </Typography>
//                               <Typography
//                                 variant="caption"
//                                 color="text.secondary"
//                               >
//                                 ID: {item.product_id}
//                               </Typography>
//                             </TableCell>
//                             <TableCell align="center">
//                               <TextField
//                                 value={item.quantity}
//                                 onChange={(e) =>
//                                   handleUpdateProductItem(
//                                     index,
//                                     "quantity",
//                                     Number(e.target.value),
//                                   )
//                                 }
//                                 size="small"
//                                 type="number"
//                                 inputProps={{
//                                   min: 1,
//                                   style: { textAlign: "center" },
//                                 }}
//                                 sx={{ width: 70 }}
//                               />
//                             </TableCell>
//                             <TableCell align="right">
//                               <TextField
//                                 value={item.unit_distributor_price}
//                                 onChange={(e) =>
//                                   handleUpdateProductItem(
//                                     index,
//                                     "unit_distributor_price",
//                                     Number(e.target.value),
//                                   )
//                                 }
//                                 size="small"
//                                 type="number"
//                                 InputProps={{
//                                   startAdornment: (
//                                     <InputAdornment position="start">
//                                       ₹
//                                     </InputAdornment>
//                                   ),
//                                 }}
//                                 sx={{ width: 100 }}
//                               />
//                             </TableCell>
//                             <TableCell align="right">
//                               <TextField
//                                 disabled={true}
//                                 value={item.mrp}
//                                 onChange={(e) =>
//                                   handleUpdateProductItem(
//                                     index,
//                                     "mrp",
//                                     Number(e.target.value),
//                                   )
//                                 }
//                                 size="small"
//                                 type="number"
//                                 InputProps={{
//                                   startAdornment: (
//                                     <InputAdornment position="start">
//                                       ₹
//                                     </InputAdornment>
//                                   ),
//                                 }}
//                                 sx={{ width: 100 }}
//                               />
//                             </TableCell>
//                             <TableCell align="right">
//                               <Typography variant="body2" fontWeight={600}>
//                                 ₹{" "}
//                                 {calculated.total_distributor_price.toFixed(2)}
//                               </Typography>
//                             </TableCell>
//                             <TableCell align="right">
//                               <Typography variant="body2">
//                                 ₹ {calculated.total_mrp_price.toFixed(2)}
//                               </Typography>
//                             </TableCell>
//                             {(poStatus === "PICKED" ||
//                               poStatus === "APPROVED" ||
//                               poStatus === "DELIVERED" ||
//                               poStatus === "PACKED") && (
//                               <>
//                                 <TableCell align="center">
//                                   <TextField
//                                     disabled={poStatus !== "APPROVED"}
//                                     value={item.qty_picked || ""}
//                                     onChange={(e) =>
//                                       handleUpdateProductItem(
//                                         index,
//                                         "qty_picked",
//                                         Number(e.target.value),
//                                       )
//                                     }
//                                     size="small"
//                                     type="number"
//                                     inputProps={{
//                                       min: 1,
//                                       style: { textAlign: "center" },
//                                     }}
//                                     sx={{ width: 70 }}
//                                   />
//                                 </TableCell>

//                                 <TableCell align="center">
//                                   <TextField
//                                     disabled={poStatus !== "APPROVED"}
//                                     value={item.short_pick || ""}
//                                     onChange={(e) =>
//                                       handleUpdateProductItem(
//                                         index,
//                                         "short_pick",
//                                         Number(e.target.value),
//                                       )
//                                     }
//                                     size="small"
//                                     type="number"
//                                     inputProps={{
//                                       min: 0,
//                                       style: { textAlign: "center" },
//                                     }}
//                                     sx={{ width: 70 }}
//                                   />
//                                 </TableCell>
//                                 {(poStatus === "PACKED" ||
//                                   poStatus === "DELIVERED") && (
//                                   <>
//                                     <TableCell align="center">
//                                       <TextField
//                                         disabled={poStatus !== "PACKED"}
//                                         value={item.hsn_code || ""}
//                                         onChange={(e) =>
//                                           handleUpdateProductItem(
//                                             index,
//                                             "hsn_code",
//                                             Number(e.target.value),
//                                           )
//                                         }
//                                         size="small"
//                                         type="number"
//                                         inputProps={{
//                                           min: 0,
//                                           style: { textAlign: "center" },
//                                         }}
//                                         sx={{ width: 70 }}
//                                       />
//                                     </TableCell>

//                                     <TableCell align="center">
//                                       <TextField
//                                         disabled={poStatus !== "PACKED"}
//                                         value={item.cartons || ""}
//                                         onChange={(e) =>
//                                           handleUpdateProductItem(
//                                             index,
//                                             "cartons",
//                                             Number(e.target.value),
//                                           )
//                                         }
//                                         size="small"
//                                         type="number"
//                                         inputProps={{
//                                           min: 0,
//                                           style: { textAlign: "center" },
//                                         }}
//                                         sx={{ width: 70 }}
//                                       />
//                                     </TableCell>

//                                     <TableCell align="center">
//                                       <TextField
//                                         disabled={poStatus !== "PACKED"}
//                                         value={item.gross_weight || ""}
//                                         onChange={(e) =>
//                                           handleUpdateProductItem(
//                                             index,
//                                             "gross_weight",
//                                             Number(e.target.value),
//                                           )
//                                         }
//                                         size="small"
//                                         type="number"
//                                         inputProps={{
//                                           min: 0,
//                                           style: { textAlign: "center" },
//                                         }}
//                                         sx={{ width: 70 }}
//                                       />
//                                     </TableCell>

//                                     <TableCell align="center">
//                                       <TextField
//                                         disabled={poStatus !== "PACKED"}
//                                         value={item.net_weight || ""}
//                                         onChange={(e) =>
//                                           handleUpdateProductItem(
//                                             index,
//                                             "net_weight",
//                                             Number(e.target.value),
//                                           )
//                                         }
//                                         size="small"
//                                         type="number"
//                                         inputProps={{
//                                           min: 0,
//                                           style: { textAlign: "center" },
//                                         }}
//                                         sx={{ width: 70 }}
//                                       />
//                                     </TableCell>
//                                     <TableCell align="center">
//                                       <TextField
//                                         // disabled={poStatus !== "APPROVED"}
//                                         value={item.remarks || ""}
//                                         onChange={(e) =>
//                                           handleUpdateProductItem(
//                                             index,
//                                             "remarks",
//                                             e.target.value,
//                                           )
//                                         }
//                                         size="small"
//                                         type="text"
//                                         inputProps={{
//                                           style: { textAlign: "center" },
//                                         }}
//                                         sx={{ width: 120 }}
//                                       />
//                                     </TableCell>
//                                   </>
//                                 )}
//                               </>
//                             )}

//                             <TableCell align="center">
//                               <IconButton
//                                 size="small"
//                                 color="error"
//                                 onClick={() => handleRemoveProduct(index)}
//                               >
//                                 <RemoveCircleOutlineIcon fontSize="small" />
//                               </IconButton>
//                             </TableCell>
//                           </TableRow>
//                         );
//                       })}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               )}
//             </Paper>
//           </Grid>
//         </Grid>
//       </Box>
//     );
//   }

//   // ================= VIEW MODE =================
//   if (isViewing && viewPO) {
//     const viewTotals = viewPO.product_items?.reduce(
//       (acc, item) => ({
//         totalDistPrice:
//           acc.totalDistPrice + (item.total_distributor_price || 0),
//         totalMRPPrice: acc.totalMRPPrice + (item.total_mrp_price || 0),
//       }),
//       { totalDistPrice: 0, totalMRPPrice: 0 },
//     );

//     // Find distributor name for view
//     const distributorInfo = distributors.find(
//       (d) => d.distributor_id === viewPO.distributor_id,
//     );

//     return (
//       <Box mt={4}>
//         <Stack direction="row" alignItems="center" spacing={1} mb={3}>
//           <IconButton onClick={handleReset}>
//             <ArrowBackIcon />
//           </IconButton>
//           <CommonLabel>View Purchase Order</CommonLabel>
//         </Stack>

//         <Grid container spacing={3}>
//           {/* PO Details */}
//           <Grid item xs={12} md={4}>
//             <Paper sx={{ p: 3 }}>
//               <Typography variant="h6" gutterBottom>
//                 Order Details
//               </Typography>
//               <Divider sx={{ mb: 2 }} />

//               <Stack spacing={2}>
//                 <Box>
//                   <Typography variant="caption" color="text.secondary">
//                     PO Number
//                   </Typography>
//                   <Typography variant="body1" fontWeight={600}>
//                     {viewPO.po_number}
//                   </Typography>
//                 </Box>

//                 <Box>
//                   <Typography variant="caption" color="text.secondary">
//                     Distributor
//                   </Typography>
//                   <Typography variant="body1" fontWeight={600}>
//                     {distributorInfo?.distributor_name || "N/A"}
//                   </Typography>
//                   <Typography variant="caption" color="text.secondary">
//                     ID: {viewPO.distributor_id}
//                   </Typography>
//                 </Box>

//                 <Box>
//                   <Typography variant="caption" color="text.secondary">
//                     Status
//                   </Typography>
//                   <Box mt={0.5}>
//                     <Chip
//                       label={viewPO.status}
//                       color={
//                         viewPO.status === "APPROVED"
//                           ? "success"
//                           : viewPO.status === "SUBMITTED"
//                             ? "warning"
//                             : "default"
//                       }
//                       size="small"
//                     />
//                   </Box>
//                 </Box>

//                 <Box>
//                   <Typography variant="caption" color="text.secondary">
//                     PO Date
//                   </Typography>
//                   <Typography variant="body2">
//                     {new Date(viewPO.po_date).toLocaleString()}
//                   </Typography>
//                 </Box>

//                 <Box>
//                   <Typography variant="caption" color="text.secondary">
//                     Remarks
//                   </Typography>
//                   <Typography variant="body2">
//                     {viewPO.remarks || "-"}
//                   </Typography>
//                 </Box>

//                 {/* Summary Card */}
//                 <Card sx={{ bgcolor: "success.50", mt: 2 }}>
//                   <CardContent>
//                     <Typography
//                       variant="subtitle2"
//                       color="success.dark"
//                       gutterBottom
//                     >
//                       Order Summary
//                     </Typography>
//                     <Stack spacing={1}>
//                       <Stack direction="row" justifyContent="space-between">
//                         <Typography variant="body2">Total Items:</Typography>
//                         <Typography variant="body2" fontWeight={600}>
//                           {viewPO.total_items || 0}
//                         </Typography>
//                       </Stack>
//                       <Stack direction="row" justifyContent="space-between">
//                         <Typography variant="body2">Total Quantity:</Typography>
//                         <Typography variant="body2" fontWeight={600}>
//                           {viewPO.total_quantity || 0}
//                         </Typography>
//                       </Stack>
//                       <Divider />
//                       <Stack direction="row" justifyContent="space-between">
//                         <Typography variant="body2">
//                           Distributor Total:
//                         </Typography>
//                         <Typography
//                           variant="body2"
//                           fontWeight={700}
//                           color="success.dark"
//                         >
//                           ₹ {viewTotals?.totalDistPrice.toFixed(2) || "0.00"}
//                         </Typography>
//                       </Stack>
//                       <Stack direction="row" justifyContent="space-between">
//                         <Typography variant="body2">MRP Total:</Typography>
//                         <Typography variant="body2" fontWeight={700}>
//                           ₹ {viewTotals?.totalMRPPrice.toFixed(2) || "0.00"}
//                         </Typography>
//                       </Stack>
//                     </Stack>
//                   </CardContent>
//                 </Card>
//               </Stack>
//             </Paper>
//           </Grid>

//           {/* Product Items */}
//           <Grid item xs={12} md={8}>
//             <Paper sx={{ p: 3 }}>
//               <Typography variant="h6" gutterBottom>
//                 <ShoppingCartIcon sx={{ verticalAlign: "middle", mr: 1 }} />
//                 Product Items
//               </Typography>
//               <Divider sx={{ mb: 2 }} />

//               <TableContainer>
//                 <Table size="small">
//                   <TableHead>
//                     <TableRow sx={{ bgcolor: "grey.100" }}>
//                       <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
//                       <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
//                       <TableCell sx={{ fontWeight: 700 }} align="center">
//                         Quantity
//                       </TableCell>
//                       <TableCell sx={{ fontWeight: 700 }} align="right">
//                         Dist. Price
//                       </TableCell>
//                       <TableCell sx={{ fontWeight: 700 }} align="right">
//                         MRP
//                       </TableCell>
//                       <TableCell sx={{ fontWeight: 700 }} align="right">
//                         Total Dist.
//                       </TableCell>
//                       <TableCell sx={{ fontWeight: 700 }} align="right">
//                         Total MRP
//                       </TableCell>
//                     </TableRow>
//                   </TableHead>

//                   <TableBody>
//                     {viewPO.product_items?.map((item, index) => (
//                       <TableRow key={index} hover>
//                         <TableCell>{index + 1}</TableCell>
//                         <TableCell>
//                           <Typography variant="body2" fontWeight={600}>
//                             {item?.product_name}
//                           </Typography>
//                           {/* <Typography variant="caption" color="text.secondary">
//                             ID: {item?.product_id}
//                           </Typography> */}
//                         </TableCell>
//                         <TableCell align="center">
//                           <Chip
//                             label={item?.quantity && item?.quantity}
//                             size="small"
//                           />
//                         </TableCell>
//                         <TableCell align="right">
//                           ₹{" "}
//                           {item?.unit_distributor_price &&
//                             item?.unit_distributor_price}
//                         </TableCell>
//                         <TableCell align="right">
//                           ₹ {item?.mrp && item?.mrp}
//                         </TableCell>
//                         <TableCell align="right">
//                           <Typography variant="body2" fontWeight={600}>
//                             ₹{" "}
//                             {item?.total_distributor_price &&
//                               item?.total_distributor_price?.toFixed(2)}
//                           </Typography>
//                         </TableCell>
//                         <TableCell align="right">
//                           <Typography variant="body2">
//                             ₹{" "}
//                             {item?.total_mrp_price &&
//                               item?.total_mrp_price?.toFixed(2)}
//                           </Typography>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </Paper>
//           </Grid>
//         </Grid>
//       </Box>
//     );
//   }

//   // ================= LIST VIEW =================
//   return (
//     <Box>
//       <Stack
//         direction="row"
//         justifyContent="space-between"
//         alignItems="center"
//         mb={3}
//       >
//         <Typography variant="h4" fontWeight={700}>
//           Purchase Orders
//         </Typography>
//         {/* <CommonButton
//           variant="contained"
//           startIcon={<AddIcon />}
//           onClick={() => setIsEditing(true)}
//         >
//           Add PO
//         </CommonButton> */}
//       </Stack>

//       <TableContainer component={Paper}>
//         <Box sx={{ p: 2 }}>
//           <CommonSearchField
//             value={searchQuery}
//             placeholder="Search PO number..."
//             onChange={(value) => setSearchQuery(value)}
//           />
//         </Box>

//         <Table>
//           <TableHead>
//             <TableRow sx={{ bgcolor: "grey.100" }}>
//               {[
//                 "Sr",
//                 "PO Number",
//                 "Distributor",
//                 "PO Date",
//                 "Status",
//                 "Total Items",
//                 "Total Qty",
//                 "Actions",
//                 "Picked Pdf",
//                 "Packed Pdf",
//               ].map((h) => (
//                 <TableCell align="center" key={h} sx={{ fontWeight: 700 }}>
//                   {h}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {loading && (
//               <TableRow>
//                 <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
//                   <CircularProgress size={28} />
//                 </TableCell>
//               </TableRow>
//             )}

//             {!loading &&
//               paginatedData?.map((po, index) => {
//                 const distributorInfo = distributors.find(
//                   (d) => d.distributor_id === po.distributor_id,
//                 );
//                 return (
//                   <TableRow key={po.id} hover>
//                     <TableCell align="center">
//                       {(page - 1) * rowsPerPage + index + 1}
//                     </TableCell>
//                     <TableCell align="center">
//                       <Typography variant="body2" fontWeight={600}>
//                         {po.po_number}
//                       </Typography>
//                     </TableCell>
//                     <TableCell align="center">
//                       <Typography variant="body2">
//                         {distributorInfo?.distributor_name || "N/A"}
//                       </Typography>
//                       <Typography variant="caption" color="text.secondary">
//                         ID: {po?.distributor_id}
//                       </Typography>
//                     </TableCell>
//                     <TableCell align="center">
//                       <Typography variant="body2">
//                         {new Date(po?.po_date).toLocaleDateString()}
//                       </Typography>
//                     </TableCell>
//                     <TableCell align="center">
//                       {/* <Select
//                         size="small"
//                         value={po?.status}
//                         onChange={(e) =>
//                           handleStatusChange(po.id, e.target.value)
//                         }
//                         sx={{
//                           minWidth: 140,
//                           height: 26,
//                           borderRadius: "999px",
//                           fontWeight: 500,
//                           color: "white",
//                           bgcolor: getStatusColor(po.status),
//                           "& .MuiSelect-select": {
//                             py: 0.5,
//                             pl: 2,
//                             display: "flex",
//                             alignItems: "center",
//                           },
//                           "& fieldset": { border: "none" },
//                           "& svg": { color: "white" },
//                         }}
//                       >
//                         {PO_STATUS_OPTIONS.map((option) => (
//                           <MenuItem key={option} value={option}>
//                             {option}
//                           </MenuItem>
//                         ))}
//                       </Select> */}
//                       <Select
//                         size="small"
//                         value={po?.status}
//                         onChange={(e) =>
//                           handleStatusChange(po.id, e.target.value)
//                         }
//                         // disable if DELIVERED (no further options)
//                         disabled={po?.status === "DELIVERED"}
//                         sx={{
//                           minWidth: 140,
//                           height: 26,
//                           borderRadius: "999px",
//                           fontWeight: 500,
//                           color: "white",
//                           bgcolor: getStatusColor(po.status),
//                           "& .MuiSelect-select": {
//                             py: 0.5,
//                             pl: 2,
//                             display: "flex",
//                             alignItems: "center",
//                           },
//                           "& fieldset": { border: "none" },
//                           "& svg": {
//                             color:
//                               po?.status === "DELIVERED"
//                                 ? "transparent"
//                                 : "white",
//                           }, // hide arrow when locked
//                         }}
//                       >
//                         {getAvailableStatusOptions(po?.status).map((option) => (
//                           <MenuItem key={option} value={option}>
//                             {option}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </TableCell>

//                     <TableCell>{po.total_items || 0}</TableCell>
//                     <TableCell>
//                       <Chip
//                         label={po.total_quantity}
//                         size="small"
//                         variant="outlined"
//                       />
//                     </TableCell>
//                     <TableCell align="center">
//                       <IconButton size="small" onClick={() => handleView(po)}>
//                         <VisibilityIcon fontSize="small" />
//                       </IconButton>
//                       <IconButton size="small" onClick={() => handleEdit(po)}>
//                         <EditIcon fontSize="small" />
//                       </IconButton>
//                       <IconButton
//                         size="small"
//                         color="error"
//                         disabled={deleteLoading}
//                         onClick={() => handleDelete(po.id)}
//                       >
//                         <DeleteIcon fontSize="small" />
//                       </IconButton>
//                     </TableCell>
//                     <TableCell align="center">
//                       {po?.status === "PICKED" && (
//                         <>
//                           <IconButton
//                             size="small"
//                             color="warning"
//                             onClick={async () => {
//                               const response = await fetch(
//                                 `https://hogofilm.pythonanywhere.com/purchase-orders/${po?.id}/picked-pdf/`,
//                               );
//                               const blob = await response.blob();
//                               const url = window.URL.createObjectURL(blob);
//                               const a = document.createElement("a");
//                               a.href = url;
//                               a.download = `PO-${editId}.pdf`;
//                               a.click();
//                               window.URL.revokeObjectURL(url);
//                             }}
//                           >
//                             <DownloadIcon fontSize="small" />
//                           </IconButton>
//                         </>
//                       )}
//                     </TableCell>
//                     <TableCell align="center">
//                       {po?.status === "PACKED" && (
//                         <>
//                           <IconButton
//                             size="small"
//                             color="warning"
//                             onClick={async () => {
//                               const response = await fetch(
//                                 `https://hogofilm.pythonanywhere.com/purchase-orders/${po?.id}/packing-pdf/`,
//                               );
//                               const blob = await response.blob();
//                               const url = window.URL.createObjectURL(blob);
//                               const a = document.createElement("a");
//                               a.href = url;
//                               a.download = `PO-${editId}.pdf`;
//                               a.click();
//                               window.URL.revokeObjectURL(url);
//                             }}
//                           >
//                             <DownloadIcon fontSize="small" />
//                           </IconButton>
//                         </>
//                       )}
//                     </TableCell>
//                   </TableRow>
//                 );
//               })}

//             {!loading && purchaseOrders?.length === 0 && (
//               <TableRow>
//                 <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
//                   <Typography variant="body2" color="text.secondary">
//                     No purchase orders found
//                   </Typography>
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Stack alignItems="flex-end" mt={3}>
//         <Pagination
//           count={Math.ceil((purchaseOrders?.length || 0) / rowsPerPage)}
//           page={page}
//           onChange={(_, v) => setPage(v)}
//         />
//       </Stack>
//     </Box>
//   );
// };

// export default PurchaseOrder;
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
  Tooltip,
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

// ─── Shared style tokens ────────────────────────────────────────────────────
const CARD_RADIUS = 3;
const SHADOW = "0 2px 12px 0 rgba(30,41,59,.08)";
const HEADER_BG = "linear-gradient(135deg,#1e3a5f 0%,#2563eb 100%)";

const tableHeadSx = {
  "& .MuiTableCell-head": {
    bgcolor: "#f1f5f9",
    color: "#334155",
    fontWeight: 700,
    fontSize: "0.78rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderBottom: "2px solid #e2e8f0",
    py: 1.5,
  },
};

const tableRowHoverSx = {
  transition: "background 0.15s",
  "&:hover": { bgcolor: "#f8faff" },
  "& .MuiTableCell-root": {
    borderBottom: "1px solid #f1f5f9",
    py: 1.25,
  },
};

const sectionPaper = {
  borderRadius: CARD_RADIUS,
  boxShadow: SHADOW,
  border: "1px solid #e2e8f0",
  overflow: "hidden",
};

// ─── Status colour map ──────────────────────────────────────────────────────
const STATUS_PALETTE = {
  DRAFT: { bg: "#64748b", light: "#f1f5f9", text: "#475569" },
  SUBMITTED: { bg: "#f59e0b", light: "#fffbeb", text: "#92400e" },
  APPROVED: { bg: "#10b981", light: "#ecfdf5", text: "#065f46" },
  REJECTED: { bg: "#ef4444", light: "#fef2f2", text: "#991b1b" },
  PARTIALLY_APPROVED: { bg: "#06b6d4", light: "#ecfeff", text: "#164e63" },
  CANCELLED: { bg: "#94a3b8", light: "#f8fafc", text: "#475569" },
  PICKED: { bg: "#f97316", light: "#fff7ed", text: "#9a3412" },
  PACKED: { bg: "#3b82f6", light: "#eff6ff", text: "#1e40af" },
  DELIVERED: { bg: "#7c3aed", light: "#f5f3ff", text: "#4c1d95" },
};

const StatusBadge = ({ status }) => {
  const p = STATUS_PALETTE[status] || STATUS_PALETTE.DRAFT;
  return (
    <Box
      component="span"
      sx={{
        display: "inline-block",
        px: 1.5,
        py: 0.4,
        borderRadius: "999px",
        bgcolor: p.light,
        color: p.text,
        fontWeight: 700,
        fontSize: "0.72rem",
        letterSpacing: "0.04em",
        border: `1.5px solid ${p.bg}33`,
      }}
    >
      {status}
    </Box>
  );
};

// ────────────────────────────────────────────────────────────────────────────

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
    setForm({ ...form, product_items: [...form.product_items, newProduct] });
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
        return ["DELIVERED"];
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
    return STATUS_PALETTE[status]?.bg || "#94a3b8";
  };

  const handleStatusChange = (id, value) => {
    dispatch(updatePurchaseOrder({ id, data: { status: value } }));
  };

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
    const submitData = {
      po_number: form.po_number,
      distributor_id: Number(form.distributor_id),
      product_items: form.product_items.map((item) => ({
        product_id: Number(item.product_id),
        product_name: item.product_name,
        quantity: Number(item.quantity),
        mrp: Number(item.mrp),
        unit_distributor_price: Number(item.unit_distributor_price),
        total_distributor_price:
          Number(item.quantity) * Number(item.unit_distributor_price),
        total_mrp_price: Number(item.quantity) * Number(item.mrp),
        short_pick: Number(item.short_pick),
        hsn_code: Number(item.hsn_code),
        cartons: Number(item.cartons),
        qty_picked: Number(item.qty_picked),
        gross_weight: Number(item.gross_weight),
        net_weight: Number(item.net_weight),
        remarks: item.remarks || "",
      })),
      remarks: form.remarks || "",
    };

    if (isEditing && editId) {
      dispatch(updatePurchaseOrder({ id: editId, data: submitData }))
        .unwrap()
        .then(() =>
          CommonToast("Purchase order updated successfully", "success"),
        )
        .catch((error) => {
          console.error("Update Error:", error);
          CommonToast(
            error?.message || "Failed to update purchase order",
            "error",
          );
        });
    } else {
      dispatch(createPurchaseOrder(submitData))
        .unwrap()
        .then(() =>
          CommonToast("Purchase order created successfully", "success"),
        )
        .catch((error) => {
          console.error("Create Error:", error);
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
      <Box mt={3}>
        {/* ── Page header ── */}
        <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
          <IconButton
            onClick={handleReset}
            sx={{
              bgcolor: "#f1f5f9",
              border: "1px solid #e2e8f0",
              "&:hover": { bgcolor: "#e2e8f0" },
            }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Box>
            <Typography
              variant="h5"
              fontWeight={700}
              color="#1e293b"
              lineHeight={1}
            >
              {editId ? "Edit Purchase Order" : "Create Purchase Order"}
            </Typography>
            {editId && (
              <Typography variant="caption" color="text.secondary">
                ID: {editId}
              </Typography>
            )}
          </Box>
          {poStatus && <StatusBadge status={poStatus} />}
        </Stack>

        <Grid container spacing={3}>
          {/* ── LEFT: PO Details ── */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ ...sectionPaper, p: 0 }}>
              {/* Card header */}
              <Box
                sx={{
                  background: HEADER_BG,
                  px: 3,
                  py: 2,
                  borderRadius: "12px 12px 0 0",
                }}
              >
                <Typography variant="subtitle1" fontWeight={700} color="white">
                  PO Details
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "rgba(255,255,255,0.7)" }}
                >
                  Fill in the order information
                </Typography>
              </Box>

              <Box sx={{ p: 3 }}>
                <Stack spacing={2.5}>
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
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />

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
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option.distributor_id}>
                        <Box sx={{ py: 0.5 }}>
                          <Typography variant="body2" fontWeight={600}>
                            {option.distributor_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {option.distributor_id}
                          </Typography>
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
                    rows={3}
                    size="small"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />

                  {/* Order Summary card */}
                  <Box
                    sx={{
                      borderRadius: 2.5,
                      border: "1.5px solid #2563eb22",
                      bgcolor: "#f0f7ff",
                      overflow: "hidden",
                    }}
                  >
                    <Box sx={{ bgcolor: "#2563eb", px: 2, py: 1 }}>
                      <Typography
                        variant="caption"
                        fontWeight={700}
                        color="white"
                        letterSpacing="0.05em"
                      >
                        ORDER SUMMARY
                      </Typography>
                    </Box>
                    <Stack spacing={1} sx={{ p: 2 }}>
                      {[
                        { label: "Total Items", value: grandTotals.totalItems },
                        {
                          label: "Total Quantity",
                          value: grandTotals.totalQty,
                        },
                      ].map((r) => (
                        <Stack
                          key={r.label}
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="body2" color="#64748b">
                            {r.label}
                          </Typography>
                          <Chip
                            label={r.value}
                            size="small"
                            sx={{
                              fontWeight: 700,
                              bgcolor: "#dbeafe",
                              color: "#1e40af",
                              height: 22,
                            }}
                          />
                        </Stack>
                      ))}
                      <Divider sx={{ my: 0.5 }} />
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="#64748b">
                          Distributor Total
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight={700}
                          color="#1d4ed8"
                        >
                          ₹ {grandTotals.totalDistPrice.toFixed(2)}
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="#64748b">
                          MRP Total
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight={700}
                          color="#1e293b"
                        >
                          ₹ {grandTotals.totalMRPPrice.toFixed(2)}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>

                  {errors.product_items && (
                    <Alert
                      severity="error"
                      sx={{ borderRadius: 2, fontSize: "0.82rem" }}
                    >
                      {errors.product_items}
                    </Alert>
                  )}

                  <Stack direction="row" spacing={1.5} pt={1}>
                    <Button
                      variant="outlined"
                      onClick={handleReset}
                      fullWidth
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleSubmit}
                      disabled={createLoading || updateLoading}
                      fullWidth
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 700,
                        background: HEADER_BG,
                        boxShadow: "0 4px 14px 0 rgba(37,99,235,0.35)",
                      }}
                    >
                      {createLoading || updateLoading ? (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CircularProgress size={14} sx={{ color: "white" }} />
                          <span>Saving…</span>
                        </Stack>
                      ) : (
                        "Save PO"
                      )}
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </Paper>
          </Grid>

          {/* ── RIGHT: Products ── */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ ...sectionPaper, p: 0 }}>
              {/* Card header */}
              <Box
                sx={{
                  background: HEADER_BG,
                  px: 3,
                  py: 2,
                  borderRadius: "12px 12px 0 0",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <ShoppingCartIcon sx={{ color: "white", fontSize: 20 }} />
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    color="white"
                  >
                    Product Items
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    {form.product_items.length} product
                    {form.product_items.length !== 1 ? "s" : ""} added
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ p: 3 }}>
                {/* ── Add Product Form ── */}
                <Box
                  sx={{
                    bgcolor: "#f8fafc",
                    border: "1.5px dashed #cbd5e1",
                    borderRadius: 2.5,
                    p: 2.5,
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    color="#64748b"
                    letterSpacing="0.06em"
                    display="block"
                    mb={1.5}
                  >
                    ADD PRODUCT
                  </Typography>
                  <Grid container spacing={2} alignItems="flex-end">
                    <Grid item xs={12} sm={4}>
                      <Autocomplete
                        options={products}
                        getOptionLabel={(option) => option.product_name}
                        value={selectedProduct}
                        onChange={handleProductSelect}
                        size="small"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select Product"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                bgcolor: "white",
                              },
                            }}
                          />
                        )}
                        isOptionEqualToValue={(option, value) =>
                          option.product_id === value.product_id
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6} sm={2}>
                      <TextField
                        label="Qty"
                        value={productForm.quantity}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            quantity: Number(e.target.value),
                          })
                        }
                        size="small"
                        type="number"
                        inputProps={{ min: 1 }}
                        fullWidth
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            bgcolor: "white",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={6} sm={2}>
                      <TextField
                        label="Dist. Price"
                        value={productForm.unit_distributor_price}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            unit_distributor_price: Number(e.target.value),
                          })
                        }
                        size="small"
                        type="number"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">₹</InputAdornment>
                          ),
                        }}
                        fullWidth
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            bgcolor: "white",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={6} sm={2}>
                      <TextField
                        label="MRP"
                        value={productForm.mrp}
                        disabled
                        size="small"
                        type="number"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">₹</InputAdornment>
                          ),
                        }}
                        fullWidth
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            bgcolor: "#f1f5f9",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={6} sm={2}>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddProduct}
                        fullWidth
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 700,
                          height: 40,
                          background: "linear-gradient(135deg,#10b981,#059669)",
                          boxShadow: "0 4px 12px rgba(16,185,129,0.3)",
                        }}
                      >
                        Add
                      </Button>
                    </Grid>
                  </Grid>
                </Box>

                {/* ── Product Table ── */}
                {form.product_items.length === 0 ? (
                  <Box
                    sx={{
                      textAlign: "center",
                      py: 6,
                      px: 3,
                      bgcolor: "#f8fafc",
                      borderRadius: 2,
                      border: "1px dashed #cbd5e1",
                    }}
                  >
                    <ShoppingCartIcon
                      sx={{ fontSize: 40, color: "#cbd5e1", mb: 1 }}
                    />
                    <Typography color="text.secondary" fontSize="0.9rem">
                      No products added yet. Use the form above to add products.
                    </Typography>
                  </Box>
                ) : (
                  <TableContainer
                    sx={{ borderRadius: 2, border: "1px solid #e2e8f0" }}
                  >
                    <Table size="small">
                      <TableHead sx={tableHeadSx}>
                        <TableRow>
                          {[
                            "Sr",
                            "Product",
                            "Qty",
                            "Dist. Price",
                            "MRP",
                            "Total Dist.",
                            "Total MRP",
                          ].map((h) => (
                            <TableCell
                              key={h}
                              align={
                                ["Sr", "Product"].includes(h)
                                  ? "left"
                                  : "center"
                              }
                            >
                              {h}
                            </TableCell>
                          ))}
                          {(poStatus === "PICKED" ||
                            poStatus === "PACKED" ||
                            poStatus === "APPROVED" ||
                            poStatus === "DELIVERED") && (
                            <>
                              <TableCell align="center">Qty Picked</TableCell>
                              <TableCell align="center">Short Pick</TableCell>
                            </>
                          )}
                          {(poStatus === "PACKED" ||
                            poStatus === "DELIVERED") && (
                            <>
                              <TableCell align="center">HSN Code</TableCell>
                              <TableCell align="center">
                                Cartons/Boxes
                              </TableCell>
                              <TableCell align="center">
                                Gross Wt (KG)
                              </TableCell>
                              <TableCell align="center">Net Wt (KG)</TableCell>
                              <TableCell align="center">Remarks</TableCell>
                            </>
                          )}
                          <TableCell align="center">Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {form.product_items.map((item, index) => {
                          const calculated = calculateProductTotals(item);
                          return (
                            <TableRow key={index} sx={tableRowHoverSx}>
                              <TableCell>
                                <Chip
                                  label={index + 1}
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: "0.7rem",
                                    bgcolor: "#f1f5f9",
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <Typography
                                  variant="body2"
                                  fontWeight={600}
                                  color="#1e293b"
                                >
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
                                  sx={{
                                    width: 70,
                                    "& .MuiOutlinedInput-root": {
                                      borderRadius: 1.5,
                                    },
                                  }}
                                />
                              </TableCell>
                              <TableCell align="center">
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
                                  sx={{
                                    width: 100,
                                    "& .MuiOutlinedInput-root": {
                                      borderRadius: 1.5,
                                    },
                                  }}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <TextField
                                  disabled
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
                                  sx={{
                                    width: 100,
                                    "& .MuiOutlinedInput-root": {
                                      borderRadius: 1.5,
                                      bgcolor: "#f8fafc",
                                    },
                                  }}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Typography
                                  variant="body2"
                                  fontWeight={700}
                                  color="#1d4ed8"
                                >
                                  ₹{" "}
                                  {calculated.total_distributor_price.toFixed(
                                    2,
                                  )}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Typography variant="body2" color="#475569">
                                  ₹ {calculated.total_mrp_price.toFixed(2)}
                                </Typography>
                              </TableCell>

                              {(poStatus === "PICKED" ||
                                poStatus === "APPROVED" ||
                                poStatus === "DELIVERED" ||
                                poStatus === "PACKED") && (
                                <>
                                  <TableCell align="center">
                                    <TextField
                                      disabled={poStatus !== "APPROVED"}
                                      value={item.qty_picked || ""}
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
                                      sx={{
                                        width: 70,
                                        "& .MuiOutlinedInput-root": {
                                          borderRadius: 1.5,
                                        },
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <TextField
                                      disabled={poStatus !== "APPROVED"}
                                      value={item.short_pick || ""}
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
                                        min: 0,
                                        style: { textAlign: "center" },
                                      }}
                                      sx={{
                                        width: 70,
                                        "& .MuiOutlinedInput-root": {
                                          borderRadius: 1.5,
                                        },
                                      }}
                                    />
                                  </TableCell>
                                  {(poStatus === "PACKED" ||
                                    poStatus === "DELIVERED") && (
                                    <>
                                      <TableCell align="center">
                                        <TextField
                                          disabled={poStatus !== "PACKED"}
                                          value={item.hsn_code || ""}
                                          onChange={(e) =>
                                            handleUpdateProductItem(
                                              index,
                                              "hsn_code",
                                              Number(e.target.value),
                                            )
                                          }
                                          size="small"
                                          type="number"
                                          inputProps={{
                                            min: 0,
                                            style: { textAlign: "center" },
                                          }}
                                          sx={{
                                            width: 70,
                                            "& .MuiOutlinedInput-root": {
                                              borderRadius: 1.5,
                                            },
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell align="center">
                                        <TextField
                                          disabled={poStatus !== "PACKED"}
                                          value={item.cartons || ""}
                                          onChange={(e) =>
                                            handleUpdateProductItem(
                                              index,
                                              "cartons",
                                              Number(e.target.value),
                                            )
                                          }
                                          size="small"
                                          type="number"
                                          inputProps={{
                                            min: 0,
                                            style: { textAlign: "center" },
                                          }}
                                          sx={{
                                            width: 70,
                                            "& .MuiOutlinedInput-root": {
                                              borderRadius: 1.5,
                                            },
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell align="center">
                                        <TextField
                                          disabled={poStatus !== "PACKED"}
                                          value={item.gross_weight || ""}
                                          onChange={(e) =>
                                            handleUpdateProductItem(
                                              index,
                                              "gross_weight",
                                              Number(e.target.value),
                                            )
                                          }
                                          size="small"
                                          type="number"
                                          inputProps={{
                                            min: 0,
                                            style: { textAlign: "center" },
                                          }}
                                          sx={{
                                            width: 70,
                                            "& .MuiOutlinedInput-root": {
                                              borderRadius: 1.5,
                                            },
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell align="center">
                                        <TextField
                                          disabled={poStatus !== "PACKED"}
                                          value={item.net_weight || ""}
                                          onChange={(e) =>
                                            handleUpdateProductItem(
                                              index,
                                              "net_weight",
                                              Number(e.target.value),
                                            )
                                          }
                                          size="small"
                                          type="number"
                                          inputProps={{
                                            min: 0,
                                            style: { textAlign: "center" },
                                          }}
                                          sx={{
                                            width: 70,
                                            "& .MuiOutlinedInput-root": {
                                              borderRadius: 1.5,
                                            },
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell align="center">
                                        <TextField
                                          value={item.remarks || ""}
                                          onChange={(e) =>
                                            handleUpdateProductItem(
                                              index,
                                              "remarks",
                                              e.target.value,
                                            )
                                          }
                                          size="small"
                                          type="text"
                                          inputProps={{
                                            style: { textAlign: "center" },
                                          }}
                                          sx={{
                                            width: 120,
                                            "& .MuiOutlinedInput-root": {
                                              borderRadius: 1.5,
                                            },
                                          }}
                                        />
                                      </TableCell>
                                    </>
                                  )}
                                </>
                              )}

                              <TableCell align="center">
                                <Tooltip title="Remove">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleRemoveProduct(index)}
                                    sx={{
                                      color: "#ef4444",
                                      "&:hover": { bgcolor: "#fef2f2" },
                                    }}
                                  >
                                    <RemoveCircleOutlineIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
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

    const distributorInfo = distributors.find(
      (d) => d.distributor_id === viewPO.distributor_id,
    );

    return (
      <Box mt={3}>
        {/* ── Page header ── */}
        <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
          <IconButton
            onClick={handleReset}
            sx={{
              bgcolor: "#f1f5f9",
              border: "1px solid #e2e8f0",
              "&:hover": { bgcolor: "#e2e8f0" },
            }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Box>
            <Typography variant="h5" fontWeight={700} color="#1e293b">
              View Purchase Order
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {viewPO.po_number}
            </Typography>
          </Box>
          <StatusBadge status={viewPO.status} />
        </Stack>

        <Grid container spacing={3}>
          {/* ── LEFT: Order Details ── */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ ...sectionPaper, p: 0 }}>
              <Box
                sx={{
                  background: HEADER_BG,
                  px: 3,
                  py: 2,
                  borderRadius: "12px 12px 0 0",
                }}
              >
                <Typography variant="subtitle1" fontWeight={700} color="white">
                  Order Details
                </Typography>
              </Box>

              <Box sx={{ p: 3 }}>
                <Stack spacing={2.5}>
                  {/* PO Number */}
                  <Box sx={{ bgcolor: "#f8fafc", borderRadius: 2, p: 1.5 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                      letterSpacing="0.06em"
                    >
                      PO NUMBER
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight={700}
                      color="#1e293b"
                      mt={0.3}
                    >
                      {viewPO.po_number}
                    </Typography>
                  </Box>

                  {/* Distributor */}
                  <Box sx={{ bgcolor: "#f8fafc", borderRadius: 2, p: 1.5 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                      letterSpacing="0.06em"
                    >
                      DISTRIBUTOR
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight={700}
                      color="#1e293b"
                      mt={0.3}
                    >
                      {distributorInfo?.distributor_name || "N/A"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {viewPO.distributor_id}
                    </Typography>
                  </Box>

                  {/* PO Date */}
                  <Box sx={{ bgcolor: "#f8fafc", borderRadius: 2, p: 1.5 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                      letterSpacing="0.06em"
                    >
                      PO DATE
                    </Typography>
                    <Typography variant="body2" color="#1e293b" mt={0.3}>
                      {new Date(viewPO.po_date).toLocaleString()}
                    </Typography>
                  </Box>

                  {/* Remarks */}
                  {viewPO.remarks && (
                    <Box sx={{ bgcolor: "#f8fafc", borderRadius: 2, p: 1.5 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={600}
                        letterSpacing="0.06em"
                      >
                        REMARKS
                      </Typography>
                      <Typography variant="body2" color="#475569" mt={0.3}>
                        {viewPO.remarks}
                      </Typography>
                    </Box>
                  )}

                  {/* Summary */}
                  <Box
                    sx={{
                      borderRadius: 2.5,
                      border: "1.5px solid #10b98122",
                      bgcolor: "#f0fdf4",
                      overflow: "hidden",
                    }}
                  >
                    <Box sx={{ bgcolor: "#10b981", px: 2, py: 1 }}>
                      <Typography
                        variant="caption"
                        fontWeight={700}
                        color="white"
                        letterSpacing="0.05em"
                      >
                        ORDER SUMMARY
                      </Typography>
                    </Box>
                    <Stack spacing={1} sx={{ p: 2 }}>
                      {[
                        {
                          label: "Total Items",
                          value: viewPO.total_items || 0,
                        },
                        {
                          label: "Total Quantity",
                          value: viewPO.total_quantity || 0,
                        },
                      ].map((r) => (
                        <Stack
                          key={r.label}
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="body2" color="#64748b">
                            {r.label}
                          </Typography>
                          <Chip
                            label={r.value}
                            size="small"
                            sx={{
                              height: 22,
                              fontWeight: 700,
                              bgcolor: "#dcfce7",
                              color: "#166534",
                            }}
                          />
                        </Stack>
                      ))}
                      <Divider sx={{ my: 0.5 }} />
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="#64748b">
                          Distributor Total
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight={700}
                          color="#065f46"
                        >
                          ₹ {viewTotals?.totalDistPrice.toFixed(2) || "0.00"}
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="#64748b">
                          MRP Total
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight={700}
                          color="#1e293b"
                        >
                          ₹ {viewTotals?.totalMRPPrice.toFixed(2) || "0.00"}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            </Paper>
          </Grid>

          {/* ── RIGHT: Product Items ── */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ ...sectionPaper, p: 0 }}>
              <Box
                sx={{
                  background: HEADER_BG,
                  px: 3,
                  py: 2,
                  borderRadius: "12px 12px 0 0",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <ShoppingCartIcon sx={{ color: "white", fontSize: 20 }} />
                <Typography variant="subtitle1" fontWeight={700} color="white">
                  Product Items
                </Typography>
                <Chip
                  label={viewPO.product_items?.length || 0}
                  size="small"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white",
                    fontWeight: 700,
                    height: 22,
                  }}
                />
              </Box>

              <Box sx={{ p: 3 }}>
                <TableContainer
                  sx={{ borderRadius: 2, border: "1px solid #e2e8f0" }}
                >
                  <Table size="small">
                    <TableHead sx={tableHeadSx}>
                      <TableRow>
                        {[
                          "#",
                          "Product",
                          "Quantity",
                          "Dist. Price",
                          "MRP",
                          "Total Dist.",
                          "Total MRP",
                        ].map((h) => (
                          <TableCell
                            key={h}
                            align={
                              ["#", "Product"].includes(h) ? "left" : "center"
                            }
                          >
                            {h}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {viewPO.product_items?.map((item, index) => (
                        <TableRow key={index} sx={tableRowHoverSx}>
                          <TableCell>
                            <Chip
                              label={index + 1}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: "0.7rem",
                                bgcolor: "#f1f5f9",
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              color="#1e293b"
                            >
                              {item?.product_name}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={item?.quantity}
                              size="small"
                              sx={{
                                fontWeight: 700,
                                bgcolor: "#eff6ff",
                                color: "#1e40af",
                                height: 22,
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" color="#475569">
                              ₹ {item?.unit_distributor_price}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" color="#475569">
                              ₹ {item?.mrp}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography
                              variant="body2"
                              fontWeight={700}
                              color="#1d4ed8"
                            >
                              ₹ {item?.total_distributor_price?.toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" color="#475569">
                              ₹ {item?.total_mrp_price?.toFixed(2)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  }

  // ================= LIST VIEW =================
  return (
    <Box>
      {/* ── Page Header ── */}
      <Box
        sx={{
          background: HEADER_BG,
          borderRadius: 3,
          px: 3.5,
          py: 2.5,
          mb: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 4px 20px rgba(37,99,235,0.25)",
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={800} color="white">
            Purchase Orders
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
            Manage and track all purchase orders
          </Typography>
        </Box>
        <Chip
          label={purchaseOrders?.length || 0}
          sx={{
            bgcolor: "rgba(255,255,255,0.2)",
            color: "white",
            fontWeight: 700,
            fontSize: "1rem",
            height: 36,
            px: 1,
          }}
        />
      </Box>

      {/* ── Table Card ── */}
      <Paper sx={{ ...sectionPaper }}>
        {/* Search bar */}
        <Box
          sx={{
            px: 2.5,
            py: 2,
            borderBottom: "1px solid #f1f5f9",
            bgcolor: "#fafbfc",
          }}
        >
          <CommonSearchField
            value={searchQuery}
            placeholder="Search PO number…"
            onChange={(value) => setSearchQuery(value)}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={tableHeadSx}>
              <TableRow>
                {[
                  "Sr",
                  "PO Number",
                  "Distributor",
                  "PO Date",
                  "Status",
                  "Total Items",
                  "Total Qty",
                  "Actions",
                  "Picked PDF",
                  "Packed PDF",
                ].map((h) => (
                  <TableCell align="center" key={h}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                    <Stack alignItems="center" spacing={1.5}>
                      <CircularProgress size={32} thickness={4} />
                      <Typography variant="body2" color="text.secondary">
                        Loading purchase orders…
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                paginatedData?.map((po, index) => {
                  const distributorInfo = distributors.find(
                    (d) => d.distributor_id === po.distributor_id,
                  );
                  const p = STATUS_PALETTE[po.status] || STATUS_PALETTE.DRAFT;
                  return (
                    <TableRow key={po.id} sx={tableRowHoverSx}>
                      <TableCell align="center">
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight={600}
                        >
                          {(page - 1) * rowsPerPage + index + 1}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        <Typography
                          variant="body2"
                          fontWeight={700}
                          color="#1d4ed8"
                          sx={{ letterSpacing: "0.02em" }}
                        >
                          {po.po_number}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color="#1e293b"
                        >
                          {distributorInfo?.distributor_name || "N/A"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {po?.distributor_id}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        <Typography variant="body2" color="#475569">
                          {new Date(po?.po_date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        <Select
                          size="small"
                          value={po?.status}
                          onChange={(e) =>
                            handleStatusChange(po.id, e.target.value)
                          }
                          disabled={po?.status === "DELIVERED"}
                          sx={{
                            minWidth: 148,
                            height: 28,
                            borderRadius: "999px",
                            fontWeight: 700,
                            fontSize: "0.72rem",
                            letterSpacing: "0.04em",
                            color: "white",
                            bgcolor: p.bg,
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
                                  : "rgba(255,255,255,0.8)",
                            },
                            boxShadow: `0 2px 8px ${p.bg}55`,
                          }}
                        >
                          {getAvailableStatusOptions(po?.status).map(
                            (option) => (
                              <MenuItem
                                key={option}
                                value={option}
                                sx={{ fontSize: "0.82rem", fontWeight: 600 }}
                              >
                                {option}
                              </MenuItem>
                            ),
                          )}
                        </Select>
                      </TableCell>

                      <TableCell align="center">
                        <Chip
                          label={po.total_items || 0}
                          size="small"
                          sx={{
                            bgcolor: "#f1f5f9",
                            fontWeight: 700,
                            height: 22,
                          }}
                        />
                      </TableCell>

                      <TableCell align="center">
                        <Chip
                          label={po.total_quantity}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontWeight: 700,
                            borderColor: "#cbd5e1",
                            height: 22,
                          }}
                        />
                      </TableCell>

                      <TableCell align="center">
                        <Stack
                          direction="row"
                          spacing={0.5}
                          justifyContent="center"
                        >
                          <Tooltip title="View">
                            <IconButton
                              size="small"
                              onClick={() => handleView(po)}
                              sx={{
                                bgcolor: "#eff6ff",
                                color: "#2563eb",
                                "&:hover": { bgcolor: "#dbeafe" },
                              }}
                            >
                              <VisibilityIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(po)}
                              sx={{
                                bgcolor: "#fefce8",
                                color: "#ca8a04",
                                "&:hover": { bgcolor: "#fef9c3" },
                              }}
                            >
                              <EditIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              disabled={deleteLoading}
                              onClick={() => handleDelete(po.id)}
                              sx={{
                                bgcolor: "#fef2f2",
                                "&:hover": { bgcolor: "#fee2e2" },
                              }}
                            >
                              <DeleteIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>

                      {/* Picked PDF */}
                      <TableCell align="center">
                        {po?.status === "PICKED" && (
                          <Tooltip title="Download Picked PDF">
                            <IconButton
                              size="small"
                              sx={{
                                bgcolor: "#fff7ed",
                                color: "#f97316",
                                "&:hover": { bgcolor: "#fed7aa" },
                              }}
                              onClick={async () => {
                                const response = await fetch(
                                  `https://hogofilm.pythonanywhere.com/purchase-orders/${po?.id}/picked-pdf/`,
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
                              <DownloadIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>

                      {/* Packed PDF */}
                      <TableCell align="center">
                        {po?.status === "PACKED" && (
                          <Tooltip title="Download Packed PDF">
                            <IconButton
                              size="small"
                              sx={{
                                bgcolor: "#eff6ff",
                                color: "#3b82f6",
                                "&:hover": { bgcolor: "#dbeafe" },
                              }}
                              onClick={async () => {
                                const response = await fetch(
                                  `https://hogofilm.pythonanywhere.com/purchase-orders/${po?.id}/packing-pdf/`,
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
                              <DownloadIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}

              {!loading && purchaseOrders?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                    <ShoppingCartIcon
                      sx={{
                        fontSize: 40,
                        color: "#cbd5e1",
                        mb: 1,
                        display: "block",
                        mx: "auto",
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      No purchase orders found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box
          sx={{
            px: 2.5,
            py: 2,
            borderTop: "1px solid #f1f5f9",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Pagination
            count={Math.ceil((purchaseOrders?.length || 0) / rowsPerPage)}
            page={page}
            onChange={(_, v) => setPage(v)}
            shape="rounded"
            color="primary"
            size="small"
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default PurchaseOrder;
