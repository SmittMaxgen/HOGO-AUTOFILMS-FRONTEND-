// import { useEffect, useState, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import {
//   getShipments,
//   createShipment,
//   updateShipment,
//   deleteShipment,
// } from "../../feature/shipments/shipmentThunks";

// import {
//   selectShipments,
//   selectShipmentLoading,
// } from "../../feature/shipments/shipmentSelector";

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
//   CircularProgress,
// } from "@mui/material";

// import AddIcon from "@mui/icons-material/Add";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import VisibilityIcon from "@mui/icons-material/Visibility";

// import Loader from "../../components/commonComponents/Loader";
// import CommonButton from "../../components/commonComponents/CommonButton";
// import CommonLabel from "../../components/commonComponents/CommonLabel";
// import CommonToast from "../../components/commonComponents/Toster";
// import CommonSearchField from "../../components/commonComponents/CommonSearchField";

// const Shipment = () => {
//   const dispatch = useDispatch();

//   const shipments = useSelector(selectShipments);
//   const loading = useSelector(selectShipmentLoading);

//   const [page, setPage] = useState(1);
//   const rowsPerPage = 5;

//   const [isEditing, setIsEditing] = useState(false);
//   const [editId, setEditId] = useState(null);

//   const [isViewing, setIsViewing] = useState(false);
//   const [viewShipment, setViewShipment] = useState(null);

//   const [form, setForm] = useState({
//     supplier_name: "",
//     supplier_invoice_no: "",
//     invoice_currency: "",
//     invoice_value_foreign: "",
//     exchange_rate: "",
//     invoice_value_inr: "",
//     bl_awb_no: "",
//     arrival_date: "",
//   });

//   const [errors, setErrors] = useState({});

//   // ✅ FIX: Separate state for individual search fields
//   const [supplierName, setSupplierName] = useState("");
//   const [invoiceNo, setInvoiceNo] = useState("");
//   const [currency, setCurrency] = useState("");
//   const [arrivalDate, setArrivalDate] = useState("");

//   // ✅ FIX: Create search object only when values change
//   const searchParams = useMemo(() => ({
//     supplier_name: supplierName,
//     supplier_invoice_no: invoiceNo,
//     invoice_currency: currency,
//     arrival_date: arrivalDate,
//   }), [supplierName, invoiceNo, currency, arrivalDate]);

//   // ✅ FIX: Fetch shipments on mount and when search params change
//   useEffect(() => {
//     dispatch(getShipments(searchParams));
//     setPage(1);
//   }, [dispatch, searchParams]);

//   // Handle form input change
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Simple validation
//   const validate = () => {
//     const temp = {};
//     if (!form.supplier_name) temp.supplier_name = "Supplier name is required";
//     if (!form.supplier_invoice_no)
//       temp.supplier_invoice_no = "Invoice number is required";
//     if (!form.invoice_currency) temp.invoice_currency = "Currency is required";
//     if (!form.invoice_value_foreign)
//       temp.invoice_value_foreign = "Invoice value is required";
//     if (!form.exchange_rate) temp.exchange_rate = "Exchange rate is required";
//     if (!form.arrival_date) temp.arrival_date = "Arrival date is required";

//     setErrors(temp);
//     return Object.keys(temp).length === 0;
//   };

//   const handleSubmit = () => {
//     if (!validate()) return;

//     const action = editId
//       ? updateShipment({ id: editId, data: form })
//       : createShipment(form);

//     dispatch(action)
//       .unwrap()
//       .then(() => {
//         dispatch(getShipments(searchParams));
//         handleReset();
//         CommonToast(
//           editId
//             ? "Shipment updated successfully"
//             : "Shipment created successfully",
//           "success",
//         );
//       })
//       .catch((err) =>
//         CommonToast(err.message || "Failed to save shipment", "error"),
//       );
//   };

//   const handleView = (shipment) => {
//     setViewShipment(shipment);
//     setIsViewing(true);
//   };

//   const handleEdit = (shipment) => {
//     setIsEditing(true);
//     setEditId(shipment.id);
//     setForm({
//       supplier_name: shipment.supplier_name,
//       supplier_invoice_no: shipment.supplier_invoice_no,
//       invoice_currency: shipment.invoice_currency,
//       invoice_value_foreign: shipment.invoice_value_foreign,
//       exchange_rate: shipment.exchange_rate,
//       invoice_value_inr: shipment.invoice_value_inr,
//       bl_awb_no: shipment.bl_awb_no,
//       arrival_date: shipment.arrival_date?.split("T")[0],
//     });
//   };

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this shipment?")) {
//       dispatch(deleteShipment(id))
//         .unwrap()
//         .then(() => {
//           dispatch(getShipments(searchParams));
//           CommonToast("Shipment deleted successfully", "success");
//         })
//         .catch((err) =>
//           CommonToast(err.message || "Failed to delete shipment", "error"),
//         );
//     }
//   };

//   const handleReset = () => {
//     setForm({
//       supplier_name: "",
//       supplier_invoice_no: "",
//       invoice_currency: "",
//       invoice_value_foreign: "",
//       exchange_rate: "",
//       invoice_value_inr: "",
//       bl_awb_no: "",
//       arrival_date: "",
//     });
//     setErrors({});
//     setEditId(null);
//     setIsEditing(false);
//   };

//   const handleAdd = () => {
//     handleReset();
//     setIsEditing(true);
//   };

//   // Paginate shipments
//   const paginatedData = useMemo(() => {
//     return shipments?.slice((page - 1) * rowsPerPage, page * rowsPerPage);
//   }, [shipments, page]);

//   if (isEditing) {
//     return (
//       <Box display="flex" justifyContent="center" mt={4}>
//         <Box width="100%">
//           <Stack direction="row" alignItems="center" spacing={1} mb={3}>
//             <IconButton onClick={handleReset}>
//               <ArrowBackIcon />
//             </IconButton>
//             <CommonLabel>
//               {editId ? "Edit Shipment" : "Create Shipment"}
//             </CommonLabel>
//           </Stack>

//           <Paper sx={{ p: 3 }}>
//             <Stack spacing={2}>
//               <TextField
//                 label="Supplier Name"
//                 name="supplier_name"
//                 value={form.supplier_name}
//                 onChange={handleChange}
//                 error={!!errors.supplier_name}
//                 helperText={errors.supplier_name}
//                 fullWidth
//               />

//               <TextField
//                 label="Supplier Invoice No"
//                 name="supplier_invoice_no"
//                 value={form.supplier_invoice_no}
//                 onChange={handleChange}
//                 error={!!errors.supplier_invoice_no}
//                 helperText={errors.supplier_invoice_no}
//                 fullWidth
//               />

//               <TextField
//                 label="Invoice Currency"
//                 name="invoice_currency"
//                 value={form.invoice_currency}
//                 onChange={handleChange}
//                 error={!!errors.invoice_currency}
//                 helperText={errors.invoice_currency}
//                 fullWidth
//               />

//               <TextField
//                 label="Invoice Value (Foreign)"
//                 name="invoice_value_foreign"
//                 value={form.invoice_value_foreign}
//                 onChange={handleChange}
//                 error={!!errors.invoice_value_foreign}
//                 helperText={errors.invoice_value_foreign}
//                 fullWidth
//               />

//               <TextField
//                 label="Exchange Rate"
//                 name="exchange_rate"
//                 value={form.exchange_rate}
//                 onChange={handleChange}
//                 error={!!errors.exchange_rate}
//                 helperText={errors.exchange_rate}
//                 fullWidth
//               />

//               <TextField
//                 label="Invoice Value (INR)"
//                 name="invoice_value_inr"
//                 value={form.invoice_value_inr}
//                 onChange={handleChange}
//                 fullWidth
//               />

//               <TextField
//                 label="BL / AWB No"
//                 name="bl_awb_no"
//                 value={form.bl_awb_no}
//                 onChange={handleChange}
//                 fullWidth
//               />

//               <TextField
//                 type="date"
//                 label="Arrival Date"
//                 name="arrival_date"
//                 value={form.arrival_date}
//                 onChange={handleChange}
//                 error={!!errors.arrival_date}
//                 helperText={errors.arrival_date}
//                 InputLabelProps={{ shrink: true }}
//                 fullWidth
//               />

//               <Stack direction="row" justifyContent="flex-end" spacing={2}>
//                 <CommonButton variant="outlined" onClick={handleReset}>
//                   Cancel
//                 </CommonButton>
//                 <CommonButton
//                   variant="contained"
//                   onClick={handleSubmit}
//                   disabled={loading}
//                 >
//                   {loading ? "Saving..." : "Save"}
//                 </CommonButton>
//               </Stack>
//             </Stack>
//           </Paper>
//         </Box>
//       </Box>
//     );
//   }

//   if (isViewing && viewShipment) {
//     return (
//       <Box display="flex" justifyContent="center" mt={4}>
//         <Box width="100%">
//           <Stack direction="row" alignItems="center" spacing={1} mb={3}>
//             <IconButton
//               onClick={() => {
//                 setIsViewing(false);
//                 setViewShipment(null);
//               }}
//             >
//               <ArrowBackIcon />
//             </IconButton>
//             <CommonLabel>View Shipment</CommonLabel>
//           </Stack>

//           <Paper sx={{ p: 3 }}>
//             <Stack spacing={2}>
//               {[
//                 ["Supplier Name", viewShipment.supplier_name],
//                 ["Invoice No", viewShipment.supplier_invoice_no],
//                 ["Currency", viewShipment.invoice_currency],
//                 ["Invoice Value (Foreign)", viewShipment.invoice_value_foreign],
//                 ["Exchange Rate", viewShipment.exchange_rate],
//                 ["Invoice Value (INR)", viewShipment.invoice_value_inr],
//                 ["BL / AWB No", viewShipment.bl_awb_no],
//                 ["Arrival Date", viewShipment.arrival_date?.split("T")[0]],
//               ].map(([label, value]) => (
//                 <TextField
//                   key={label}
//                   label={label}
//                   value={value || "-"}
//                   fullWidth
//                   InputProps={{ readOnly: true }}
//                 />
//               ))}
//             </Stack>
//           </Paper>
//         </Box>
//       </Box>
//     );
//   }

//   return (
//     <Box>
//       <Stack
//         direction="row"
//         justifyContent="space-between"
//         alignItems="center"
//         mb={3}
//       >
//         <Typography variant="h4" fontWeight={700} sx={{ color: "#7E7E7E" }}>
//           Shipments
//         </Typography>

//         <CommonButton
//           variant="contained"
//           startIcon={<AddIcon />}
//           onClick={handleAdd}
//         >
//           Add Shipment
//         </CommonButton>
//       </Stack>

//       {/* ===== Search Fields ===== */}
//       <Stack direction="row" spacing={1} mb={2}>
//         <CommonSearchField
//           value={supplierName}
//           placeholder="Search by supplier name..."
//           onChange={setSupplierName}
//         />
//         <CommonSearchField
//           value={invoiceNo}
//           placeholder="Search by invoice no..."
//           onChange={setInvoiceNo}
//         />
//         <CommonSearchField
//           value={currency}
//           placeholder="Search by currency..."
//           onChange={setCurrency}
//         />
//         <CommonSearchField
//           type="date"
//           value={arrivalDate}
//           placeholder="Arrival Date"
//           onChange={setArrivalDate}
//         />
//       </Stack>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               {[
//                 "Sr",
//                 "Supplier",
//                 "Invoice No",
//                 "Currency",
//                 "Invoice INR",
//                 "Arrival Date",
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
//                     Loading shipments...
//                   </Typography>
//                 </TableCell>
//               </TableRow>
//             )}
//             {!loading && paginatedData && paginatedData.length > 0 ? (
//               paginatedData.map((item, index) => (
//                 <TableRow key={item.id} hover>
//                   <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
//                   <TableCell>{item.supplier_name}</TableCell>
//                   <TableCell>{item.supplier_invoice_no}</TableCell>
//                   <TableCell>{item.invoice_currency}</TableCell>
//                   <TableCell>{item.invoice_value_inr}</TableCell>
//                   <TableCell>{item.arrival_date?.split("T")[0]}</TableCell>
//                   <TableCell>
//                     <IconButton
//                       onClick={() => handleView(item)}
//                       color="primary"
//                     >
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
//                     >
//                       <DeleteIcon />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={7} align="center">
//                   No shipments found
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Stack alignItems="flex-end" mt={3}>
//         <Pagination
//           count={Math.ceil((shipments?.length || 0) / rowsPerPage)}
//           page={page}
//           onChange={(_, v) => setPage(v)}
//           color="primary"
//         />
//       </Stack>
//     </Box>
//   );
// };

// export default Shipment;

import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getShipments,
  createShipment,
  updateShipment,
  deleteShipment,
} from "../../feature/shipments/shipmentThunks";

import {
  selectShipments,
  selectShipmentLoading,
} from "../../feature/shipments/shipmentSelector";

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
  CircularProgress,
  Divider,
  Grid,
  InputAdornment,
  Chip,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import BusinessIcon from "@mui/icons-material/Business";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import SearchIcon from "@mui/icons-material/Search";

import CommonButton from "../../components/commonComponents/CommonButton";
import CommonToast from "../../components/commonComponents/Toster";
import CommonSearchField from "../../components/commonComponents/CommonSearchField";

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
      {value || "N/A"}
    </Typography>
  </Box>
);

// ─── Main Component ────────────────────────────────────────────────────────────

const Shipment = () => {
  const dispatch = useDispatch();

  const shipments = useSelector(selectShipments);
  const loading = useSelector(selectShipmentLoading);

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [isViewing, setIsViewing] = useState(false);
  const [viewShipment, setViewShipment] = useState(null);

  const [form, setForm] = useState({
    supplier_name: "",
    supplier_invoice_no: "",
    invoice_currency: "",
    invoice_value_foreign: "",
    exchange_rate: "",
    invoice_value_inr: "",
    bl_awb_no: "",
    arrival_date: "",
  });

  const [errors, setErrors] = useState({});

  const [supplierName, setSupplierName] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [currency, setCurrency] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");

  const searchParams = useMemo(
    () => ({
      supplier_name: supplierName,
      supplier_invoice_no: invoiceNo,
      invoice_currency: currency,
      arrival_date: arrivalDate,
    }),
    [supplierName, invoiceNo, currency, arrivalDate],
  );

  useEffect(() => {
    dispatch(getShipments(searchParams));
    setPage(1);
  }, [dispatch, searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const temp = {};
    if (!form.supplier_name) temp.supplier_name = "Supplier name is required";
    if (!form.supplier_invoice_no)
      temp.supplier_invoice_no = "Invoice number is required";
    if (!form.invoice_currency) temp.invoice_currency = "Currency is required";
    if (!form.invoice_value_foreign)
      temp.invoice_value_foreign = "Invoice value is required";
    if (!form.exchange_rate) temp.exchange_rate = "Exchange rate is required";
    if (!form.arrival_date) temp.arrival_date = "Arrival date is required";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const action = editId
      ? updateShipment({ id: editId, data: form })
      : createShipment(form);
    dispatch(action)
      .unwrap()
      .then(() => {
        dispatch(getShipments(searchParams));
        handleReset();
        CommonToast(
          editId
            ? "Shipment updated successfully"
            : "Shipment created successfully",
          "success",
        );
      })
      .catch((err) =>
        CommonToast(err.message || "Failed to save shipment", "error"),
      );
  };

  const handleView = (shipment) => {
    setViewShipment(shipment);
    setIsViewing(true);
  };

  const handleEdit = (shipment) => {
    setIsEditing(true);
    setEditId(shipment.id);
    setForm({
      supplier_name: shipment.supplier_name,
      supplier_invoice_no: shipment.supplier_invoice_no,
      invoice_currency: shipment.invoice_currency,
      invoice_value_foreign: shipment.invoice_value_foreign,
      exchange_rate: shipment.exchange_rate,
      invoice_value_inr: shipment.invoice_value_inr,
      bl_awb_no: shipment.bl_awb_no,
      arrival_date: shipment.arrival_date?.split("T")[0],
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this shipment?")) {
      dispatch(deleteShipment(id))
        .unwrap()
        .then(() => {
          dispatch(getShipments(searchParams));
          CommonToast("Shipment deleted successfully", "success");
        })
        .catch((err) =>
          CommonToast(err.message || "Failed to delete shipment", "error"),
        );
    }
  };

  const handleReset = () => {
    setForm({
      supplier_name: "",
      supplier_invoice_no: "",
      invoice_currency: "",
      invoice_value_foreign: "",
      exchange_rate: "",
      invoice_value_inr: "",
      bl_awb_no: "",
      arrival_date: "",
    });
    setErrors({});
    setEditId(null);
    setIsEditing(false);
  };

  const handleAdd = () => {
    handleReset();
    setIsEditing(true);
  };

  const paginatedData = useMemo(
    () => shipments?.slice((page - 1) * rowsPerPage, page * rowsPerPage),
    [shipments, page],
  );

  // shared TextField sx
  const fieldSx = {
    "& .MuiOutlinedInput-root.Mui-focused fieldset": { borderColor: "#D20000" },
    "& label.Mui-focused": { color: "#D20000" },
  };

  // ── Create / Edit View ───────────────────────────────────────────────────────
  if (isEditing) {
    return (
      <Box mt={4}>
        <PageHeader
          title={editId ? "Edit Shipment" : "Create Shipment"}
          onBack={handleReset}
        />

        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid #f0f0f0",
          }}
        >
          <Box
            sx={{
              px: 3,
              py: 2,
              bgcolor: "#fafafa",
              borderBottom: "1px solid #ebebeb",
            }}
          >
            <SectionHeading title="Supplier & Invoice Details" />
          </Box>

          <Box px={4} py={4}>
            <Grid container spacing={2.5}>
              {/* Row 1 */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Supplier Name"
                  name="supplier_name"
                  value={form.supplier_name}
                  onChange={handleChange}
                  error={!!errors.supplier_name}
                  helperText={errors.supplier_name}
                  fullWidth
                  sx={fieldSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon sx={{ color: "#D20000" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Supplier Invoice No"
                  name="supplier_invoice_no"
                  value={form.supplier_invoice_no}
                  onChange={handleChange}
                  error={!!errors.supplier_invoice_no}
                  helperText={errors.supplier_invoice_no}
                  fullWidth
                  sx={fieldSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ReceiptIcon sx={{ color: "#D20000" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Row 2 */}
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Invoice Currency"
                  name="invoice_currency"
                  value={form.invoice_currency}
                  onChange={handleChange}
                  error={!!errors.invoice_currency}
                  helperText={errors.invoice_currency}
                  fullWidth
                  sx={fieldSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CurrencyExchangeIcon sx={{ color: "#D20000" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Invoice Value (Foreign)"
                  name="invoice_value_foreign"
                  value={form.invoice_value_foreign}
                  onChange={handleChange}
                  error={!!errors.invoice_value_foreign}
                  helperText={errors.invoice_value_foreign}
                  fullWidth
                  sx={fieldSx}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Exchange Rate"
                  name="exchange_rate"
                  value={form.exchange_rate}
                  onChange={handleChange}
                  error={!!errors.exchange_rate}
                  helperText={errors.exchange_rate}
                  fullWidth
                  sx={fieldSx}
                />
              </Grid>

              {/* Row 3 */}
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Invoice Value (INR)"
                  name="invoice_value_inr"
                  value={form.invoice_value_inr}
                  onChange={handleChange}
                  fullWidth
                  sx={fieldSx}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="BL / AWB No"
                  name="bl_awb_no"
                  value={form.bl_awb_no}
                  onChange={handleChange}
                  fullWidth
                  sx={fieldSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FlightLandIcon sx={{ color: "#D20000" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  type="date"
                  label="Arrival Date"
                  name="arrival_date"
                  value={form.arrival_date}
                  onChange={handleChange}
                  error={!!errors.arrival_date}
                  helperText={errors.arrival_date}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  sx={fieldSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayIcon sx={{ color: "#D20000" }} />
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
                disabled={loading}
                sx={{
                  bgcolor: "#D20000",
                  "&:hover": { bgcolor: "#a80000" },
                  fontWeight: 700,
                }}
              >
                {loading
                  ? "Saving..."
                  : editId
                    ? "Update Shipment"
                    : "Save Shipment"}
              </CommonButton>
            </Stack>
          </Box>
        </Paper>
      </Box>
    );
  }

  // ── View Detail ──────────────────────────────────────────────────────────────
  if (isViewing && viewShipment) {
    return (
      <Box mt={4}>
        <PageHeader
          title="Shipment Details"
          onBack={() => {
            setIsViewing(false);
            setViewShipment(null);
          }}
        />

        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid #f0f0f0",
          }}
        >
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
              <LocalShippingIcon sx={{ fontSize: 32, color: "#D20000" }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700} color="#1a1a1a">
                {viewShipment.supplier_name}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={0.5}>
                Invoice: {viewShipment.supplier_invoice_no} &nbsp;|&nbsp;
                Arrival: {viewShipment.arrival_date?.split("T")[0]}
              </Typography>
            </Box>
          </Box>

          <Box px={4} py={3}>
            <SectionHeading title="Invoice Details" />
            <Grid container spacing={2} mb={3}>
              {[
                {
                  label: "Supplier Name",
                  value: viewShipment.supplier_name,
                  icon: <BusinessIcon fontSize="small" />,
                },
                {
                  label: "Invoice No",
                  value: viewShipment.supplier_invoice_no,
                  icon: <ReceiptIcon fontSize="small" />,
                },
                {
                  label: "Currency",
                  value: viewShipment.invoice_currency,
                  icon: <CurrencyExchangeIcon fontSize="small" />,
                },
                {
                  label: "Invoice Value (Foreign)",
                  value: viewShipment.invoice_value_foreign,
                },
                { label: "Exchange Rate", value: viewShipment.exchange_rate },
                {
                  label: "Invoice Value (INR)",
                  value: viewShipment.invoice_value_inr,
                },
              ].map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.label}>
                  <DetailCard
                    label={item.label}
                    value={item.value}
                    icon={item.icon}
                  />
                </Grid>
              ))}
            </Grid>

            <Divider sx={{ my: 2 }} />
            <SectionHeading title="Logistics Details" />
            <Grid container spacing={2}>
              {[
                {
                  label: "BL / AWB No",
                  value: viewShipment.bl_awb_no,
                  icon: <FlightLandIcon fontSize="small" />,
                },
                {
                  label: "Arrival Date",
                  value: viewShipment.arrival_date?.split("T")[0],
                  icon: <CalendarTodayIcon fontSize="small" />,
                },
              ].map((item) => (
                <Grid item xs={12} sm={6} key={item.label}>
                  <DetailCard
                    label={item.label}
                    value={item.value}
                    icon={item.icon}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
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
            Shipments
          </Typography>
        </Box>

        <CommonButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{
            bgcolor: "#D20000",
            "&:hover": { bgcolor: "#a80000" },
            fontWeight: 700,
            borderRadius: 1.5,
            px: 2.5,
            boxShadow: "0 4px 12px rgba(210,0,0,0.3)",
          }}
        >
          Add Shipment
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
        {/* Search Filters */}
        <Box
          sx={{
            px: 2,
            py: 2,
            bgcolor: "#fafafa",
            borderBottom: "1px solid #ebebeb",
          }}
        >
          <Box display="flex" alignItems="center" gap={1} mb={1.5}>
            <SearchIcon sx={{ color: "#D20000", fontSize: 18 }} />
            <Typography
              variant="caption"
              fontWeight={700}
              color="text.secondary"
              letterSpacing={0.5}
            >
              FILTER SHIPMENTS
            </Typography>
          </Box>
          <Grid container spacing={1.5}>
            <Grid item xs={12} sm={6} md={3}>
              <CommonSearchField
                value={supplierName}
                placeholder="Supplier name..."
                onChange={setSupplierName}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CommonSearchField
                value={invoiceNo}
                placeholder="Invoice no..."
                onChange={setInvoiceNo}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CommonSearchField
                value={currency}
                placeholder="Currency..."
                onChange={setCurrency}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CommonSearchField
                type="date"
                value={arrivalDate}
                placeholder="Arrival date..."
                onChange={setArrivalDate}
              />
            </Grid>
          </Grid>
        </Box>

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
                  "Supplier",
                  "Invoice No",
                  "Currency",
                  "Invoice INR",
                  "Arrival Date",
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
                  <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      gap={1}
                    >
                      <CircularProgress size={28} sx={{ color: "#D20000" }} />
                      <Typography variant="body2" color="text.secondary">
                        Loading shipments...
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}

              {!loading && paginatedData && paginatedData.length > 0
                ? paginatedData.map((item, index) => (
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
                      <TableCell
                        sx={{ fontWeight: 700, color: "#D20000", width: 50 }}
                      >
                        {(page - 1) * rowsPerPage + index + 1}
                      </TableCell>
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
                            <LocalShippingIcon
                              sx={{ fontSize: 15, color: "#D20000" }}
                            />
                          </Box>
                          <Typography
                            fontWeight={600}
                            fontSize={13}
                            color="#1a1a1a"
                          >
                            {item.supplier_name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography
                          fontSize={13}
                          color="text.secondary"
                          fontWeight={500}
                        >
                          {item.supplier_invoice_no}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.invoice_currency}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: 11,
                            bgcolor: "#fff8e1",
                            color: "#f57c00",
                            border: "1px solid #ffe082",
                            borderRadius: 1,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          fontWeight={700}
                          fontSize={13}
                          color="#1a1a1a"
                        >
                          ₹ {item.invoice_value_inr}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={0.6}>
                          <CalendarTodayIcon
                            sx={{ fontSize: 13, color: "#D20000" }}
                          />
                          <Typography fontSize={13} color="text.secondary">
                            {item.arrival_date?.split("T")[0]}
                          </Typography>
                        </Box>
                      </TableCell>
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
                  ))
                : !loading && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                          gap={1}
                        >
                          <LocalShippingIcon
                            sx={{ fontSize: 40, color: "#e0e0e0" }}
                          />
                          <Typography color="text.secondary" fontWeight={500}>
                            No shipments found
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
            count={Math.ceil((shipments?.length || 0) / rowsPerPage)}
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

export default Shipment;
