// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import {
//   getCost,
//   createCost,
//   updateCost,
//   deleteCost,
// } from "../../feature/cost/costThunks";

// import {
//   selectCostList,
//   selectCostLoading,
//   selectCostError,
// } from "../../feature/cost/costSelector";

// import {
//   Box,
//   Paper,
//   Stack,
//   Typography,
//   Button,
//   IconButton,
//   TextField,
//   FormControlLabel,
//   Checkbox,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   Pagination,
//   Autocomplete,
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
// import { getShipments } from "../../feature/shipments/shipmentThunks";

// const Cost = () => {
//   const dispatch = useDispatch();

//   const costs = useSelector(selectCostList);
//   const loading = useSelector(selectCostLoading);
//   const error = useSelector(selectCostError);

//   const [page, setPage] = useState(1);
//   const rowsPerPage = 5;

//   const [isEditing, setIsEditing] = useState(false);
//   const [editId, setEditId] = useState(null);

//   const [isViewing, setIsViewing] = useState(false);
//   const [viewCost, setViewCost] = useState(null);

//   const [shipmentOptions, setShipmentOptions] = useState([]);
//   const [form, setForm] = useState({
//     shipment_id: "",
//     cost_amount_inr: "",
//     capitalized: true,
//     reference_doc: "",
//     cost_type_cha: "",
//     cost_type_trasnport: "",
//     cost_type_duty: "",
//     cost_type_freight: "",
//     cost_type_igst: "",
//     cost_type_insurance: "",
//     cost_type_others: "",
//     cost_type_port: "",
//     cost_type_transport: "",
//   });

//   const [errors, setErrors] = useState({});
//   useEffect(() => {
//     dispatch(getCost());
//     dispatch(getShipments())
//       .unwrap()
//       .then((res) => setShipmentOptions(res))
//       .catch(() => CommonToast("Failed to load shipments", "error"));
//   }, [dispatch]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const validate = () => {
//     const temp = {};

//     if (!form.shipment_id) temp.shipment_id = "Shipment ID is required";
//     if (!form.cost_amount_inr) temp.cost_amount_inr = "Cost amount is required";
//     if (!form.cost_type_cha) temp.cost_type_cha = "CHA is required";
//     if (!form.cost_type_trasnport)
//       temp.cost_type_trasnport = "Transport is required";
//     if (!form.cost_type_duty) temp.cost_type_duty = "Duty is required";
//     if (!form.cost_type_freight) temp.cost_type_freight = "Freight is required";
//     if (!form.cost_type_igst) temp.cost_type_igst = "IGST is required";
//     if (!form.cost_type_insurance)
//       temp.cost_type_insurance = "Insurance is required";
//     if (!form.cost_type_others) temp.cost_type_others = "Others is required";
//     if (!form.cost_type_port) temp.cost_type_port = "Port is required";
//     // if (!form.cost_type_transport)
//     //   temp.cost_type_transport = "Transport is required";

//     setErrors(temp);

//     // Show first error in toast
//     const firstError = Object.values(temp)[0];
//     if (firstError) CommonToast(firstError, "error");

//     return Object.keys(temp).length === 0;
//   };
//   const handleSubmit = () => {
//     if (!validate()) return;

//     if (isEditing && editId) {
//       dispatch(updateCost({ id: editId, data: form }))
//         .unwrap()
//         .then(() => {
//           dispatch(getCost());
//           CommonToast("Cost updated successfully", "success");
//           handleReset();
//         })
//         .catch(() => CommonToast("Failed to update cost", "error"));
//     } else {
//       dispatch(createCost(form))
//         .unwrap()
//         .then(() => {
//           dispatch(getCost());
//           CommonToast("Cost created successfully", "success");
//           handleReset();
//         })
//         .catch(() => CommonToast("Failed to create cost", "error"));
//     }
//   };

//   const handleView = (cost) => {
//     setViewCost(cost);
//     setIsViewing(true);
//   };

//   const handleEdit = (cost) => {
//     setIsEditing(true);
//     setEditId(cost.id);
//     setForm({
//       shipment_id: cost.shipment_id,
//       cost_amount_inr: cost.cost_amount_inr,
//       capitalized: cost.capitalized,
//       reference_doc: cost.reference_doc,
//       cost_type_cha: cost.cost_type_cha || "",
//       cost_type_trasnport: cost.cost_type_trasnport || "",
//       cost_type_duty: cost.cost_type_duty || "",
//       cost_type_freight: cost.cost_type_freight || "",
//       cost_type_igst: cost.cost_type_igst || "",
//       cost_type_insurance: cost.cost_type_insurance || "",
//       cost_type_others: cost.cost_type_others || "",
//       cost_type_port: cost.cost_type_port || "",
//       //   cost_type_transport: cost.cost_type_transport || "",
//     });
//   };

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this cost?")) {
//       dispatch(deleteCost(id))
//         .unwrap()
//         .then(() => dispatch(getCost()));
//     }
//   };

//   const handleReset = () => {
//     setForm({
//       shipment_id: "",
//       cost_amount_inr: "",
//       capitalized: true,
//       reference_doc: "",
//       cost_type_cha: "",
//       cost_type_trasnport: "",
//       cost_type_duty: "",
//       cost_type_freight: "",
//       cost_type_igst: "",
//       cost_type_insurance: "",
//       cost_type_others: "",
//       cost_type_port: "",
//       cost_type_transport: "",
//     });

//     setErrors({});
//     setEditId(null);
//     setIsEditing(false);
//   };

//   const handleAdd = () => {
//     handleReset();
//     setIsEditing(true);
//   };

//   const paginatedData = costs?.slice(
//     (page - 1) * rowsPerPage,
//     page * rowsPerPage,
//   );

//   if (isEditing) {
//     return (
//       <Box display="flex" justifyContent="center" mt={4}>
//         <Box width="100%">
//           <Stack direction="row" alignItems="center" spacing={1} mb={3}>
//             <IconButton onClick={handleReset}>
//               <ArrowBackIcon />
//             </IconButton>
//             <CommonLabel>{editId ? "Edit Cost" : "Create Cost"}</CommonLabel>
//           </Stack>

//           <Paper sx={{ p: 3 }}>
//             <Stack spacing={2}>
//               <Autocomplete
//                 options={shipmentOptions?.data || []}
//                 getOptionLabel={(option) =>
//                   `${option.id} - ${option.supplier_name}`
//                 }
//                 value={
//                   shipmentOptions?.data.find(
//                     (s) => s.id === form.shipment_id,
//                   ) || null
//                 }
//                 onChange={(_, newValue) => {
//                   setForm((prev) => ({
//                     ...prev,
//                     shipment_id: newValue ? newValue.id : "",
//                   }));
//                 }}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label="Select Shipment"
//                     error={!!errors.shipment_id}
//                     helperText={errors.shipment_id}
//                     fullWidth
//                   />
//                 )}
//               />

//               <TextField
//                 label="Cost Amount (INR)"
//                 name="cost_amount_inr"
//                 value={form.cost_amount_inr}
//                 onChange={handleChange}
//                 error={!!errors.cost_amount_inr}
//                 helperText={errors.cost_amount_inr}
//                 fullWidth
//               />

//               <TextField
//                 label="Reference Document"
//                 name="reference_doc"
//                 error={!!errors.reference_doc}
//                 value={form.reference_doc}
//                 onChange={handleChange}
//                 fullWidth
//               />
//               <TextField
//                 label="CHA"
//                 name="cost_type_cha"
//                 error={!!errors.cost_type_cha}
//                 value={form.cost_type_cha}
//                 onChange={handleChange}
//                 fullWidth
//               />

//               <TextField
//                 label="Transport"
//                 name="cost_type_trasnport"
//                 error={!!errors.cost_type_trasnport}
//                 value={form.cost_type_trasnport}
//                 onChange={handleChange}
//                 fullWidth
//               />
//               <TextField
//                 label="Duty"
//                 name="cost_type_duty"
//                 error={!!errors.cost_type_duty}
//                 value={form.cost_type_duty}
//                 onChange={handleChange}
//                 fullWidth
//               />
//               <TextField
//                 label="Freight"
//                 name="cost_type_freight"
//                 error={!!errors.cost_type_freight}
//                 value={form.cost_type_freight}
//                 onChange={handleChange}
//                 fullWidth
//               />
//               <TextField
//                 label="IGST"
//                 name="cost_type_igst"
//                 error={!!errors.cost_type_igst}
//                 value={form.cost_type_igst}
//                 onChange={handleChange}
//                 fullWidth
//               />
//               <TextField
//                 label="Insurance"
//                 name="cost_type_insurance"
//                 error={!!errors.cost_type_insurance}
//                 value={form.cost_type_insurance}
//                 onChange={handleChange}
//                 fullWidth
//               />
//               <TextField
//                 label="Others"
//                 name="cost_type_others"
//                 error={!!errors.cost_type_others}
//                 value={form.cost_type_others}
//                 onChange={handleChange}
//                 fullWidth
//               />
//               <TextField
//                 label="Port"
//                 name="cost_type_port"
//                 error={!!errors.cost_type_port}
//                 value={form.cost_type_port}
//                 onChange={handleChange}
//                 fullWidth
//               />

//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={form.capitalized}
//                     name="capitalized"
//                     onChange={handleChange}
//                   />
//                 }
//                 label="Capitalized"
//               />

//               {/* <Stack direction="row" justifyContent="flex-end" spacing={2}>
//                 <Button onClick={handleReset}>Cancel</Button>
//                 <Button variant="contained" onClick={handleSubmit}>
//                   {editId ? "Update" : "Save"}
//                 </Button>
//               </Stack> */}
//               <Stack direction="row" justifyContent="flex-end" spacing={2}>
//                 <CommonButton variant="outlined" onClick={handleReset}>
//                   Cancel
//                 </CommonButton>
//                 <CommonButton
//                   variant="contained"
//                   onClick={handleSubmit}
//                   disabled={loading || loading}
//                 >
//                   {loading || loading ? "Saving..." : "Save"}
//                 </CommonButton>
//               </Stack>
//             </Stack>
//           </Paper>
//         </Box>
//       </Box>
//     );
//   }

//   if (isViewing && viewCost) {
//     return (
//       <Box display="flex" justifyContent="center" mt={4}>
//         <Box width="100%">
//           <Stack direction="row" alignItems="center" spacing={1} mb={3}>
//             <IconButton
//               onClick={() => {
//                 setIsViewing(false);
//                 setViewCost(null);
//               }}
//             >
//               <ArrowBackIcon />
//             </IconButton>
//             <CommonLabel>View Cost</CommonLabel>
//           </Stack>

//           <Paper sx={{ p: 3 }}>
//             <Stack spacing={2}>
//               {/* <TextField
//                 label="Shipment ID"
//                 value={viewCost.shipment_id}
//                 fullWidth
//                 InputProps={{ readOnly: true }}
//               /> */}
//               <TextField
//                 label="Shipment"
//                 value={viewCost.shipment_name}
//                 fullWidth
//                 InputProps={{ readOnly: true }}
//               />

//               <TextField
//                 label="Cost Amount (INR)"
//                 value={viewCost.cost_amount_inr}
//                 fullWidth
//                 InputProps={{ readOnly: true }}
//               />

//               <TextField
//                 label="Reference Document"
//                 value={viewCost.reference_doc}
//                 fullWidth
//                 InputProps={{ readOnly: true }}
//               />

//               <TextField
//                 label="CHA"
//                 value={viewCost.cost_type_cha}
//                 fullWidth
//                 InputProps={{ readOnly: true }}
//               />
//               <TextField
//                 label="Transport"
//                 value={viewCost.cost_type_trasnport}
//                 fullWidth
//                 InputProps={{ readOnly: true }}
//               />
//               <TextField
//                 label="Duty"
//                 value={viewCost.cost_type_duty}
//                 fullWidth
//                 InputProps={{ readOnly: true }}
//               />
//               <TextField
//                 label="Freight"
//                 value={viewCost.cost_type_freight}
//                 fullWidth
//                 InputProps={{ readOnly: true }}
//               />
//               <TextField
//                 label="IGST"
//                 value={viewCost.cost_type_igst}
//                 fullWidth
//                 InputProps={{ readOnly: true }}
//               />
//               <TextField
//                 label="Insurance"
//                 value={viewCost.cost_type_insurance}
//                 fullWidth
//                 InputProps={{ readOnly: true }}
//               />
//               <TextField
//                 label="Others"
//                 value={viewCost.cost_type_others}
//                 fullWidth
//                 InputProps={{ readOnly: true }}
//               />
//               <TextField
//                 label="Port"
//                 value={viewCost.cost_type_port}
//                 fullWidth
//                 InputProps={{ readOnly: true }}
//               />

//               <FormControlLabel
//                 control={<Checkbox checked={viewCost.capitalized} disabled />}
//                 label="Capitalized"
//               />
//             </Stack>
//           </Paper>
//         </Box>
//       </Box>
//     );
//   }

//   // if (loading) return <Loader text="Loading costs..." fullScreen />;

//   return (
//     <Box>
//       <Stack
//         direction="row"
//         justifyContent="space-between"
//         alignItems="center"
//         mb={3}
//       >
//         <Typography variant="h4" fontWeight={700} sx={{ color: "#7E7E7E" }}>
//           Costs
//         </Typography>
//         <CommonButton
//           variant="contained"
//           startIcon={<AddIcon />}
//           onClick={handleAdd}
//         >
//           Add Cost
//         </CommonButton>
//       </Stack>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               {[
//                 "Sr",
//                 "Shipment ID",
//                 "Amount (INR)",
//                 "Capitalized",
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
//                 <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
//                   <CircularProgress size={28} />
//                   <Typography variant="body2" mt={1}>
//                     Loading costs...
//                   </Typography>
//                 </TableCell>
//               </TableRow>
//             )}
//             {!loading &&
//               paginatedData?.map((item, index) => (
//                 <TableRow key={item.id} hover>
//                   <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
//                   <TableCell>{item.shipment_id}</TableCell>
//                   <TableCell>{item.cost_amount_inr}</TableCell>
//                   <TableCell>
//                     <Chip
//                       label={item.capitalized ? "Yes" : "No"}
//                       size="small"
//                       clickable
//                       sx={{
//                         fontWeight: 600,
//                         borderRadius: "12px",
//                         paddingX: 1.5,
//                         paddingY: 0.5,
//                         color: item.capitalized
//                           ? "success.main"
//                           : "text.secondary",
//                         backgroundColor: item.capitalized
//                           ? "success.lighter"
//                           : "grey.100",
//                         border: item.capitalized ? "1px solid" : "1px solid",
//                         borderColor: item.capitalized
//                           ? "success.main"
//                           : "grey.300",
//                         textTransform: "capitalize",
//                         cursor: "pointer",
//                         "&:hover": {
//                           backgroundColor: item.capitalized
//                             ? "success.light"
//                             : "grey.200",
//                         },
//                       }}
//                     />
//                   </TableCell>
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
//               ))}

//             {costs?.length === 0 && (
//               <TableRow>
//                 <TableCell colSpan={5} align="center">
//                   No costs found
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Stack alignItems="flex-end" mt={3}>
//         <Pagination
//           count={Math.ceil((costs?.length || 0) / rowsPerPage)}
//           page={page}
//           onChange={(_, v) => setPage(v)}
//           color="primary"
//         />
//       </Stack>
//     </Box>
//   );
// };

// export default Cost;
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getCost,
  createCost,
  updateCost,
  deleteCost,
} from "../../feature/cost/costThunks";

import {
  selectCostList,
  selectCostLoading,
  selectCostError,
} from "../../feature/cost/costSelector";

import {
  Box,
  Paper,
  Stack,
  Typography,
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
  Autocomplete,
  CircularProgress,
  Divider,
  Grid,
  InputAdornment,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import AssuredWorkloadIcon from "@mui/icons-material/AssuredWorkload";

import CommonButton from "../../components/commonComponents/CommonButton";
import CommonToast from "../../components/commonComponents/Toster";
import { getShipments } from "../../feature/shipments/shipmentThunks";

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

// cost type fields config — keeps form DRY
const COST_TYPE_FIELDS = [
  { label: "CHA", name: "cost_type_cha" },
  { label: "Transport", name: "cost_type_trasnport" },
  { label: "Duty", name: "cost_type_duty" },
  { label: "Freight", name: "cost_type_freight" },
  { label: "IGST", name: "cost_type_igst" },
  { label: "Insurance", name: "cost_type_insurance" },
  { label: "Others", name: "cost_type_others" },
  { label: "Port", name: "cost_type_port" },
];

// ─── Main Component ────────────────────────────────────────────────────────────

const Cost = () => {
  const dispatch = useDispatch();

  const costs = useSelector(selectCostList);
  const loading = useSelector(selectCostLoading);
  const error = useSelector(selectCostError);

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [isViewing, setIsViewing] = useState(false);
  const [viewCost, setViewCost] = useState(null);

  const [shipmentOptions, setShipmentOptions] = useState([]);

  const [form, setForm] = useState({
    shipment_id: "",
    cost_amount_inr: "",
    capitalized: true,
    reference_doc: "",
    cost_type_cha: "",
    cost_type_trasnport: "",
    cost_type_duty: "",
    cost_type_freight: "",
    cost_type_igst: "",
    cost_type_insurance: "",
    cost_type_others: "",
    cost_type_port: "",
    cost_type_transport: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getCost());
    dispatch(getShipments())
      .unwrap()
      .then((res) => setShipmentOptions(res))
      .catch(() => CommonToast("Failed to load shipments", "error"));
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    const temp = {};
    if (!form.shipment_id) temp.shipment_id = "Shipment ID is required";
    if (!form.cost_amount_inr) temp.cost_amount_inr = "Cost amount is required";
    if (!form.cost_type_cha) temp.cost_type_cha = "CHA is required";
    if (!form.cost_type_trasnport)
      temp.cost_type_trasnport = "Transport is required";
    if (!form.cost_type_duty) temp.cost_type_duty = "Duty is required";
    if (!form.cost_type_freight) temp.cost_type_freight = "Freight is required";
    if (!form.cost_type_igst) temp.cost_type_igst = "IGST is required";
    if (!form.cost_type_insurance)
      temp.cost_type_insurance = "Insurance is required";
    if (!form.cost_type_others) temp.cost_type_others = "Others is required";
    if (!form.cost_type_port) temp.cost_type_port = "Port is required";
    setErrors(temp);
    const firstError = Object.values(temp)[0];
    if (firstError) CommonToast(firstError, "error");
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (isEditing && editId) {
      dispatch(updateCost({ id: editId, data: form }))
        .unwrap()
        .then(() => {
          dispatch(getCost());
          CommonToast("Cost updated successfully", "success");
          handleReset();
        })
        .catch(() => CommonToast("Failed to update cost", "error"));
    } else {
      dispatch(createCost(form))
        .unwrap()
        .then(() => {
          dispatch(getCost());
          CommonToast("Cost created successfully", "success");
          handleReset();
        })
        .catch(() => CommonToast("Failed to create cost", "error"));
    }
  };

  const handleView = (cost) => {
    setViewCost(cost);
    setIsViewing(true);
  };

  const handleEdit = (cost) => {
    setIsEditing(true);
    setEditId(cost.id);
    setForm({
      shipment_id: cost.shipment_id,
      cost_amount_inr: cost.cost_amount_inr,
      capitalized: cost.capitalized,
      reference_doc: cost.reference_doc,
      cost_type_cha: cost.cost_type_cha || "",
      cost_type_trasnport: cost.cost_type_trasnport || "",
      cost_type_duty: cost.cost_type_duty || "",
      cost_type_freight: cost.cost_type_freight || "",
      cost_type_igst: cost.cost_type_igst || "",
      cost_type_insurance: cost.cost_type_insurance || "",
      cost_type_others: cost.cost_type_others || "",
      cost_type_port: cost.cost_type_port || "",
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this cost?")) {
      dispatch(deleteCost(id))
        .unwrap()
        .then(() => dispatch(getCost()));
    }
  };

  const handleReset = () => {
    setForm({
      shipment_id: "",
      cost_amount_inr: "",
      capitalized: true,
      reference_doc: "",
      cost_type_cha: "",
      cost_type_trasnport: "",
      cost_type_duty: "",
      cost_type_freight: "",
      cost_type_igst: "",
      cost_type_insurance: "",
      cost_type_others: "",
      cost_type_port: "",
      cost_type_transport: "",
    });
    setErrors({});
    setEditId(null);
    setIsEditing(false);
  };

  const handleAdd = () => {
    handleReset();
    setIsEditing(true);
  };

  const paginatedData = costs?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  // ── Create / Edit View ───────────────────────────────────────────────────────
  if (isEditing) {
    return (
      <Box mt={4}>
        <PageHeader
          title={editId ? "Edit Cost" : "Create Cost"}
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
          {/* Section 1: Shipment & Summary */}
          <Box
            sx={{
              px: 3,
              py: 2,
              bgcolor: "#fafafa",
              borderBottom: "1px solid #ebebeb",
            }}
          >
            <SectionHeading title="Shipment & Summary" />
          </Box>

          <Box px={4} py={3}>
            <Grid container spacing={2.5}>
              {/* Shipment Autocomplete */}
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={shipmentOptions?.data || []}
                  getOptionLabel={(option) =>
                    `${option.id} - ${option.supplier_name}`
                  }
                  value={
                    shipmentOptions?.data?.find(
                      (s) => s.id === form.shipment_id,
                    ) || null
                  }
                  onChange={(_, newValue) => {
                    setForm((prev) => ({
                      ...prev,
                      shipment_id: newValue ? newValue.id : "",
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Shipment"
                      error={!!errors.shipment_id}
                      helperText={errors.shipment_id}
                      fullWidth
                      sx={fieldSx}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <InputAdornment position="start">
                              <LocalShippingIcon sx={{ color: "#D20000" }} />
                            </InputAdornment>
                            {params.InputProps.startAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Cost Amount */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Cost Amount (INR)"
                  name="cost_amount_inr"
                  value={form.cost_amount_inr}
                  onChange={handleChange}
                  error={!!errors.cost_amount_inr}
                  helperText={errors.cost_amount_inr}
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

              {/* Reference Doc */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Reference Document"
                  name="reference_doc"
                  value={form.reference_doc}
                  onChange={handleChange}
                  error={!!errors.reference_doc}
                  fullWidth
                  sx={fieldSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ReceiptLongIcon sx={{ color: "#D20000" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Capitalized checkbox */}
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    px: 2,
                    py: 1.5,
                    bgcolor: "#fafafa",
                    border: "1px solid #ebebeb",
                    borderRadius: 2,
                    height: "100%",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={form.capitalized}
                        name="capitalized"
                        onChange={handleChange}
                        sx={{
                          color: "#D20000",
                          "&.Mui-checked": { color: "#D20000" },
                        }}
                      />
                    }
                    label={
                      <Typography fontWeight={600} variant="body2">
                        Capitalized
                      </Typography>
                    }
                  />
                  <Chip
                    label={form.capitalized ? "Yes" : "No"}
                    size="small"
                    color={form.capitalized ? "success" : "default"}
                    sx={{ fontWeight: 700, borderRadius: 1 }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Section 2: Cost Breakdown */}
          <Box
            sx={{
              px: 3,
              py: 2,
              bgcolor: "#fafafa",
              borderTop: "1px solid #ebebeb",
              borderBottom: "1px solid #ebebeb",
            }}
          >
            <SectionHeading title="Cost Breakdown" />
          </Box>

          <Box px={4} py={3}>
            <Grid container spacing={2.5}>
              {COST_TYPE_FIELDS.map((field) => (
                <Grid item xs={12} sm={6} md={3} key={field.name}>
                  <TextField
                    label={field.label}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    error={!!errors[field.name]}
                    helperText={errors[field.name]}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CurrencyRupeeIcon
                            sx={{ color: "#D20000", fontSize: 16 }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              ))}
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
                {loading ? "Saving..." : editId ? "Update Cost" : "Save Cost"}
              </CommonButton>
            </Stack>
          </Box>
        </Paper>
      </Box>
    );
  }

  // ── View Detail ──────────────────────────────────────────────────────────────
  if (isViewing && viewCost) {
    return (
      <Box mt={4}>
        <PageHeader
          title="Cost Details"
          onBack={() => {
            setIsViewing(false);
            setViewCost(null);
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
              <AccountBalanceWalletIcon
                sx={{ fontSize: 32, color: "#D20000" }}
              />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700} color="#1a1a1a">
                ₹ {viewCost.cost_amount_inr}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={0.4}>
                Shipment: {viewCost.shipment_name || viewCost.shipment_id}
                &nbsp;|&nbsp; Capitalized:{" "}
                <Chip
                  label={viewCost.capitalized ? "Yes" : "No"}
                  size="small"
                  color={viewCost.capitalized ? "success" : "default"}
                  sx={{ fontWeight: 700, borderRadius: 1, ml: 0.5 }}
                />
              </Typography>
            </Box>
          </Box>

          <Box px={4} py={3}>
            {/* Summary */}
            <SectionHeading title="Summary" />
            <Grid container spacing={2} mb={3}>
              {[
                {
                  label: "Shipment",
                  value: viewCost.shipment_name || viewCost.shipment_id,
                  icon: <LocalShippingIcon fontSize="small" />,
                },
                {
                  label: "Cost Amount (INR)",
                  value: `₹ ${viewCost.cost_amount_inr}`,
                  icon: <CurrencyRupeeIcon fontSize="small" />,
                },
                {
                  label: "Reference Document",
                  value: viewCost.reference_doc,
                  icon: <ReceiptLongIcon fontSize="small" />,
                },
                {
                  label: "Capitalized",
                  value: viewCost.capitalized ? "Yes" : "No",
                  icon: <AssuredWorkloadIcon fontSize="small" />,
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

            {/* Cost Breakdown */}
            <SectionHeading title="Cost Breakdown" />
            <Grid container spacing={2}>
              {[
                { label: "CHA", value: viewCost.cost_type_cha },
                { label: "Transport", value: viewCost.cost_type_trasnport },
                { label: "Duty", value: viewCost.cost_type_duty },
                { label: "Freight", value: viewCost.cost_type_freight },
                { label: "IGST", value: viewCost.cost_type_igst },
                { label: "Insurance", value: viewCost.cost_type_insurance },
                { label: "Others", value: viewCost.cost_type_others },
                { label: "Port", value: viewCost.cost_type_port },
              ].map((item) => (
                <Grid item xs={6} sm={4} md={3} key={item.label}>
                  <DetailCard
                    label={item.label}
                    value={item.value ? `₹ ${item.value}` : null}
                    icon={<CurrencyRupeeIcon fontSize="small" />}
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
            Costs
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
          Add Cost
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
                  "Shipment ID",
                  "Amount (INR)",
                  "Capitalized",
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
                  <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      gap={1}
                    >
                      <CircularProgress size={28} sx={{ color: "#D20000" }} />
                      <Typography variant="body2" color="text.secondary">
                        Loading costs...
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

                    {/* Shipment ID */}
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
                          #{item.shipment_id}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Amount */}
                    <TableCell>
                      <Typography
                        fontWeight={700}
                        fontSize={14}
                        color="#1a1a1a"
                      >
                        ₹ {item.cost_amount_inr}
                      </Typography>
                    </TableCell>

                    {/* Capitalized */}
                    <TableCell>
                      <Chip
                        label={item.capitalized ? "Yes" : "No"}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          borderRadius: 1,
                          fontSize: 11,
                          bgcolor: item.capitalized ? "#e8f5e9" : "#f5f5f5",
                          color: item.capitalized ? "#2e7d32" : "#757575",
                          border: `1px solid ${item.capitalized ? "#c8e6c9" : "#e0e0e0"}`,
                        }}
                      />
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

              {!loading && costs?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      gap={1}
                    >
                      <AccountBalanceWalletIcon
                        sx={{ fontSize: 40, color: "#e0e0e0" }}
                      />
                      <Typography color="text.secondary" fontWeight={500}>
                        No costs found
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
            count={Math.ceil((costs?.length || 0) / rowsPerPage)}
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

export default Cost;
