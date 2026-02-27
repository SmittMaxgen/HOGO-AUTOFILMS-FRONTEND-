// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import {
//   getLeads,
//   createLead,
//   updateLead,
//   deleteLead,
// } from "../../feature/leads/leadThunks";

// import {
//   selectLeads,
//   selectLeadsLoading,
//   selectCreateLeadLoading,
//   selectCreateLeadSuccess,
//   selectUpdateLeadLoading,
//   selectUpdateLeadSuccess,
//   selectDeleteLeadLoading,
// } from "../../feature/leads/leadSelector";
// import { selectVisitList } from "../../feature/visit/visitSelector";

// import { selectEmployees } from "../../feature/employee/employeeSelector";

// import { getEmployees } from "../../feature/employee/employeeThunks";
// import { getVisits } from "../../feature/visit/visitThunks";

// import TrendingUpIcon from "@mui/icons-material/TrendingUp";

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
//   Select,
//   MenuItem,
// } from "@mui/material";

// import Autocomplete from "@mui/material/Autocomplete";

// import AddIcon from "@mui/icons-material/Add";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import VisibilityIcon from "@mui/icons-material/Visibility";

// import CommonButton from "../../components/commonComponents/CommonButton";
// import CommonLabel from "../../components/commonComponents/CommonLabel";
// import CommonToast from "../../components/commonComponents/Toster";
// import CommonSearchField from "../../components/commonComponents/CommonSearchField";

// const LEAD_TYPE_OPTIONS = ["Distributor", "Retailer", "Direct"];
// const INTEREST_LEVEL_OPTIONS = ["Low", "Medium", "High"];
// const LEAD_STATUS_OPTIONS = ["Lead", "Prospect", "Converted", "Lost"];

// const Lead = () => {
//   const dispatch = useDispatch();

//   const leads = useSelector(selectLeads);
//   const visits = useSelector(selectVisitList);
//   console.log("visits:::>>>", visits);
//   const loading = useSelector(selectLeadsLoading);

//   const createLoading = useSelector(selectCreateLeadLoading);
//   const createSuccess = useSelector(selectCreateLeadSuccess);

//   const updateLoading = useSelector(selectUpdateLeadLoading);
//   const updateSuccess = useSelector(selectUpdateLeadSuccess);

//   const deleteLoading = useSelector(selectDeleteLeadLoading);

//   const [page, setPage] = useState(1);
//   const rowsPerPage = 5;

//   const employees = useSelector(selectEmployees);
//   console.log("employees::::", employees);

//   const [isEditing, setIsEditing] = useState(false);
//   const [editId, setEditId] = useState(null);

//   const [isViewing, setIsViewing] = useState(false);
//   const [viewLead, setViewLead] = useState(null);

//   const [searchQuery, setSearchQuery] = useState("");

//   const [form, setForm] = useState({
//     lead_type: "",
//     business_name: "",
//     contact_person: "",
//     phone: "",
//     email: "",
//     address: "",
//     city: "",
//     state: "",
//     interest_level: "",
//     lead_status: "Lead",
//     remarks: "",
//     created_by: null,
//   });

//   const [errors, setErrors] = useState({});
//   console.log("errors:::", errors);

//   useEffect(() => {
//     dispatch(getLeads());
//     setPage(1);
//   }, [dispatch]);

//   useEffect(() => {
//     if (createSuccess || updateSuccess) {
//       dispatch(getLeads());
//       handleReset();
//     }
//   }, [createSuccess, updateSuccess, dispatch]);

//   const validate = () => {
//     const temp = {};
//     [
//       "lead_type",
//       "business_name",
//       "contact_person",
//       "phone",
//       "email",
//       "address",
//       "city",
//       "state",
//       "interest_level",
//       "lead_status",
//       "created_by",
//     ].forEach((field) => {
//       if (!form[field]) temp[field] = "Required";
//     });
//     setErrors(temp);
//     return Object.keys(temp).length === 0;
//   };

//   // Add this helper function near the top of your component
//   const handleInlineUpdate = (leadId, field, value) => {
//     const leadToUpdate = leads.find((l) => l.id === leadId);
//     if (!leadToUpdate) return;

//     const updatedData = {
//       ...leadToUpdate,
//       [field]: value,
//     };

//     dispatch(updateLead({ id: leadId, data: updatedData }))
//       .unwrap()
//       .then(() => CommonToast(`${field} updated successfully`, "success"))
//       .catch(() => CommonToast(`Failed to update ${field}`, "error"));
//   };

//   const handleSubmit = () => {
//     if (!validate()) return;

//     if (isEditing && editId) {
//       dispatch(updateLead({ id: editId, data: form }))
//         .unwrap()
//         .then(() => CommonToast("Lead updated successfully", "success"))
//         .catch(() => CommonToast("Failed to update lead", "error"));
//     } else {
//       dispatch(createLead(form))
//         .unwrap()
//         .then(() => CommonToast("Lead created successfully", "success"))
//         .catch(() => CommonToast("Failed to create lead", "error"));
//     }
//   };

//   const handleView = (lead) => {
//     setViewLead(lead);
//     setIsViewing(true);
//   };

//   const handleEdit = (lead) => {
//     setIsEditing(true);
//     setEditId(lead.id);
//     setForm({
//       lead_type: lead.lead_type,
//       business_name: lead.business_name,
//       contact_person: lead.contact_person,
//       phone: lead.phone,
//       email: lead.email,
//       address: lead.address,
//       city: lead.city,
//       state: lead.state,
//       interest_level: lead.interest_level,
//       lead_status: lead.lead_status,
//       remarks: lead.remarks || "",
//       created_by: lead.created_by,
//     });
//   };

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this lead?")) {
//       dispatch(deleteLead(id))
//         .unwrap()
//         .then(() => CommonToast("Lead deleted successfully", "success"))
//         .catch(() => CommonToast("Failed to delete lead", "error"));
//     }
//   };

//   const handleVisitsByLead = (id) => {
//     console.log("id:::>>>", id);
//     if (id) {
//       const payload = {
//         lead_id: id,
//       };
//       dispatch(getVisits(payload));
//     } else {
//       console.log("ID not found !");
//     }
//   };

//   const handleAddLeads = () => {
//     setIsEditing(true);
//     dispatch(getEmployees());
//   };
//   const handleReset = () => {
//     setIsEditing(false);
//     setEditId(null);
//     setIsViewing(false);
//     setViewLead(null);
//     setForm({
//       lead_type: "",
//       business_name: "",
//       contact_person: "",
//       phone: "",
//       email: "",
//       address: "",
//       city: "",
//       state: "",
//       interest_level: "",
//       lead_status: "Lead",
//       remarks: "",
//       created_by: null,
//     });
//     setErrors({});
//   };

//   const filteredLeads = leads?.filter((l) =>
//     l.business_name?.toLowerCase().includes(searchQuery.toLowerCase()),
//   );

//   const paginatedData = filteredLeads?.slice(
//     (page - 1) * rowsPerPage,
//     page * rowsPerPage,
//   );

//   /* ================= CREATE / EDIT ================= */
//   if (isEditing) {
//     return (
//       <Box mt={4}>
//         <Stack direction="row" alignItems="center" spacing={1} mb={3}>
//           <IconButton onClick={handleReset}>
//             <ArrowBackIcon />
//           </IconButton>
//           <CommonLabel>{editId ? "Edit Lead" : "Create Lead"}</CommonLabel>
//         </Stack>

//         <Paper sx={{ p: 3 }}>
//           <Stack spacing={2}>
//             <Autocomplete
//               options={LEAD_TYPE_OPTIONS}
//               value={form.lead_type}
//               onChange={(_, v) => setForm({ ...form, lead_type: v || "" })}
//               renderInput={(params) => (
//                 <TextField {...params} label="Lead Type" />
//               )}
//             />

//             <TextField
//               label="Business Name"
//               value={form.business_name}
//               onChange={(e) =>
//                 setForm({ ...form, business_name: e.target.value })
//               }
//             />

//             <TextField
//               label="Contact Person"
//               value={form.contact_person}
//               onChange={(e) =>
//                 setForm({ ...form, contact_person: e.target.value })
//               }
//             />

//             <TextField
//               label="Phone"
//               value={form.phone}
//               onChange={(e) => setForm({ ...form, phone: e.target.value })}
//             />

//             <TextField
//               label="Email"
//               value={form.email}
//               onChange={(e) => setForm({ ...form, email: e.target.value })}
//             />

//             <TextField
//               label="Address"
//               value={form.address}
//               onChange={(e) => setForm({ ...form, address: e.target.value })}
//             />

//             <TextField
//               label="City"
//               value={form.city}
//               onChange={(e) => setForm({ ...form, city: e.target.value })}
//             />

//             <TextField
//               label="State"
//               value={form.state}
//               onChange={(e) => setForm({ ...form, state: e.target.value })}
//             />

//             <Autocomplete
//               options={INTEREST_LEVEL_OPTIONS}
//               value={form.interest_level}
//               onChange={(_, v) => setForm({ ...form, interest_level: v || "" })}
//               renderInput={(params) => (
//                 <TextField {...params} label="Interest Level" />
//               )}
//             />

//             <Autocomplete
//               options={LEAD_STATUS_OPTIONS}
//               value={form.lead_status}
//               onChange={(_, v) => setForm({ ...form, lead_status: v || "" })}
//               renderInput={(params) => (
//                 <TextField {...params} label="Lead Status" />
//               )}
//             />

//             {/* <TextField
//               label="Created By"
//               value={form.created_by}
//               onChange={(e) => setForm({ ...form, created_by: e.target.value })}
//             /> */}
//             <Autocomplete
//               options={employees || []}
//               getOptionLabel={(option) =>
//                 `${option.first_name || "User"} ${option.last_name || ""}` || ""
//               }
//               value={
//                 employees?.find((emp) => emp.id === form.created_by) || null
//               }
//               onChange={(event, newValue) =>
//                 setForm({
//                   ...form,
//                   created_by: newValue ? newValue.id : "",
//                 })
//               }
//               renderInput={(params) => (
//                 <TextField {...params} label="Created By" />
//               )}
//             />
//             <TextField
//               label="Remarks"
//               value={form.remarks}
//               multiline
//               rows={3}
//               onChange={(e) => setForm({ ...form, remarks: e.target.value })}
//             />

//             <Stack direction="row" justifyContent="flex-end" spacing={2}>
//               <CommonButton variant="outlined" onClick={handleReset}>
//                 Cancel
//               </CommonButton>
//               <CommonButton variant="contained" onClick={handleSubmit}>
//                 Save
//               </CommonButton>
//             </Stack>
//           </Stack>
//         </Paper>
//       </Box>
//     );
//   }

//   /* ================= VIEW ================= */
//   if (isViewing && viewLead) {
//     return (
//       <Box mt={4}>
//         <Stack direction="row" alignItems="center" spacing={1} mb={3}>
//           <IconButton onClick={handleReset}>
//             <ArrowBackIcon />
//           </IconButton>
//           <CommonLabel>View Lead</CommonLabel>
//         </Stack>

//         <Paper sx={{ p: 3 }}>
//           <Stack spacing={2}>
//             {Object.entries(viewLead).map(([k, v]) => (
//               <TextField
//                 key={k}
//                 label={k}
//                 value={v ?? "-"}
//                 InputProps={{ readOnly: true }}
//               />
//             ))}
//           </Stack>
//         </Paper>
//       </Box>
//     );
//   }

//   /* ================= LIST ================= */
//   return (
//     <Box>
//       <Stack direction="row" justifyContent="space-between" mb={3}>
//         {/* <Typography variant="h4">Leads</Typography> */}
//         <Stack
//           direction="row"
//           justifyContent=""
//           alignItems="center"
//           spacing={1}
//           mb={3}
//         >
//           <Typography
//             variant="h4"
//             fontWeight={700}
//             sx={{ display: "flex", alignItems: "center", color: "#7E7E7E" }}
//           >
//             <IconButton onClick={() => setShowViewDialog(false)}>
//               {/* {showViewDialog && (
//                 <ArrowBackIcon sx={{ color: "grey", marginRight: "5px" }} />
//               )} */}
//             </IconButton>
//             Leads
//           </Typography>
//         </Stack>
//         <CommonButton startIcon={<AddIcon />} onClick={() => handleAddLeads()}>
//           Add Lead
//         </CommonButton>
//       </Stack>

//       <TableContainer component={Paper}>
//         <CommonSearchField
//           value={searchQuery}
//           onChange={(v) => setSearchQuery(v)}
//         />

//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Sr</TableCell>
//               <TableCell>Business</TableCell>
//               <TableCell>Lead Type</TableCell>
//               <TableCell>Interest</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {!loading &&
//               paginatedData?.map((lead, index) => (
//                 <TableRow key={lead.id}>
//                   <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
//                   <TableCell>{lead.business_name}</TableCell>
//                   {/* <TableCell>{lead.lead_type}</TableCell>
//                   <TableCell>
//                     <Chip label={lead.interest_level} size="small" />
//                   </TableCell>
//                   <TableCell>{lead.lead_status}</TableCell> */}
//                   {/* Lead Type - Chip Dropdown */}
//                   <TableCell>
//                     <Select
//                       size="small"
//                       value={lead.lead_type}
//                       onChange={(e) =>
//                         handleInlineUpdate(lead.id, "lead_type", e.target.value)
//                       }
//                       sx={{
//                         minWidth: 100,
//                         height: 25,
//                         borderRadius: "999px",
//                         fontWeight: 500,
//                         color: "white",
//                         bgcolor:
//                           lead.lead_type === "Distributor"
//                             ? "primary.main"
//                             : lead.lead_type === "Retailer"
//                               ? "info.main"
//                               : "secondary.main",
//                         "& .MuiSelect-select": {
//                           py: 0.5,
//                           pl: 2,
//                           display: "flex",
//                           alignItems: "center",
//                         },
//                         "& fieldset": {
//                           border: "none",
//                         },
//                         "& svg": {
//                           color: "white",
//                         },
//                       }}
//                     >
//                       {LEAD_TYPE_OPTIONS.map((option) => (
//                         <MenuItem key={option} value={option}>
//                           {option}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </TableCell>

//                   {/* Interest Level - Pill Style */}
//                   <TableCell>
//                     <Select
//                       size="small"
//                       value={lead.interest_level}
//                       onChange={(e) =>
//                         handleInlineUpdate(
//                           lead.id,
//                           "interest_level",
//                           e.target.value,
//                         )
//                       }
//                       sx={{
//                         minWidth: 90,
//                         height: 25,
//                         borderRadius: "999px",
//                         fontWeight: 500,
//                         color: "white",
//                         bgcolor:
//                           lead.interest_level === "High"
//                             ? "success.main"
//                             : lead.interest_level === "Medium"
//                               ? "warning.main"
//                               : "error.main",
//                         "& .MuiSelect-select": {
//                           py: 0.5,
//                           pl: 2,
//                           display: "flex",
//                           alignItems: "center",
//                         },
//                         "& fieldset": {
//                           border: "none",
//                         },
//                         "& svg": {
//                           color: "white",
//                         },
//                       }}
//                     >
//                       {INTEREST_LEVEL_OPTIONS.map((option) => (
//                         <MenuItem key={option} value={option}>
//                           {option}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </TableCell>

//                   {/* Lead Status - Pill Style */}
//                   <TableCell>
//                     <Select
//                       size="small"
//                       value={lead.lead_status}
//                       onChange={(e) =>
//                         handleInlineUpdate(
//                           lead.id,
//                           "lead_status",
//                           e.target.value,
//                         )
//                       }
//                       sx={{
//                         minWidth: 100,
//                         height: 25,
//                         borderRadius: "999px",
//                         fontWeight: 500,
//                         color: "white",
//                         bgcolor:
//                           lead.lead_status === "Converted"
//                             ? "success.main"
//                             : lead.lead_status === "Prospect"
//                               ? "info.main"
//                               : lead.lead_status === "Lost"
//                                 ? "error.main"
//                                 : "warning.main",
//                         "& .MuiSelect-select": {
//                           py: 0.5,
//                           pl: 2,
//                           display: "flex",
//                           alignItems: "center",
//                         },
//                         "& fieldset": {
//                           border: "none",
//                         },
//                         "& svg": {
//                           color: "white",
//                         },
//                       }}
//                     >
//                       {LEAD_STATUS_OPTIONS.map((option) => (
//                         <MenuItem key={option} value={option}>
//                           {option}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </TableCell>

//                   <TableCell>
//                     <IconButton onClick={() => handleView(lead)}>
//                       <VisibilityIcon />
//                     </IconButton>
//                     <IconButton onClick={() => handleEdit(lead)}>
//                       <EditIcon />
//                     </IconButton>
//                     <IconButton onClick={() => handleDelete(lead.id)}>
//                       <DeleteIcon />
//                     </IconButton>
//                     <IconButton onClick={() => handleVisitsByLead(lead.id)}>
//                       <TrendingUpIcon />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <Stack alignItems="flex-end" mt={3}>
//         <Pagination
//           count={Math.ceil((filteredLeads?.length || 0) / rowsPerPage)}
//           page={page}
//           onChange={(_, v) => setPage(v)}
//         />
//       </Stack>
//     </Box>
//   );
// };

// export default Lead;
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
} from "../../feature/leads/leadThunks";

import {
  selectLeads,
  selectLeadsLoading,
  selectCreateLeadLoading,
  selectCreateLeadSuccess,
  selectUpdateLeadLoading,
  selectUpdateLeadSuccess,
  selectDeleteLeadLoading,
} from "../../feature/leads/leadSelector";
import { selectVisitList } from "../../feature/visit/visitSelector";
import { selectEmployees } from "../../feature/employee/employeeSelector";
import { getEmployees } from "../../feature/employee/employeeThunks";
import { getVisits } from "../../feature/visit/visitThunks";

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
  Select,
  MenuItem,
  Divider,
  Grid,
  InputAdornment,
} from "@mui/material";

import Autocomplete from "@mui/material/Autocomplete";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ApartmentIcon from "@mui/icons-material/Apartment";

import CommonButton from "../../components/commonComponents/CommonButton";
import CommonToast from "../../components/commonComponents/Toster";
import CommonSearchField from "../../components/commonComponents/CommonSearchField";

// ─── Constants ────────────────────────────────────────────────────────────────

const LEAD_TYPE_OPTIONS = ["Distributor", "Retailer", "Direct"];
const INTEREST_LEVEL_OPTIONS = ["Low", "Medium", "High"];
const LEAD_STATUS_OPTIONS = ["Lead", "Prospect", "Converted", "Lost"];

const LEAD_TYPE_COLORS = {
  Distributor: { bg: "#e3f2fd", color: "#1565c0", border: "#90caf9" },
  Retailer: { bg: "#e8f5e9", color: "#2e7d32", border: "#a5d6a7" },
  Direct: { bg: "#f3e5f5", color: "#6a1b9a", border: "#ce93d8" },
};

const INTEREST_COLORS = {
  High: { bg: "#e8f5e9", color: "#2e7d32", border: "#a5d6a7" },
  Medium: { bg: "#fff8e1", color: "#f57c00", border: "#ffe082" },
  Low: { bg: "#fce4ec", color: "#c62828", border: "#ef9a9a" },
};

const STATUS_COLORS = {
  Converted: { bg: "#e8f5e9", color: "#2e7d32", border: "#a5d6a7" },
  Prospect: { bg: "#e3f2fd", color: "#1565c0", border: "#90caf9" },
  Lost: { bg: "#fce4ec", color: "#c62828", border: "#ef9a9a" },
  Lead: { bg: "#fff8e1", color: "#f57c00", border: "#ffe082" },
};

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

const ColoredSelect = ({ value, options, colors, onChange }) => {
  const c = colors[value] || {
    bg: "#f5f5f5",
    color: "#757575",
    border: "#e0e0e0",
  };
  return (
    <Select
      size="small"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={{
        minWidth: 100,
        height: 26,
        borderRadius: "999px",
        fontWeight: 700,
        fontSize: 11,
        color: c.color,
        bgcolor: c.bg,
        border: `1px solid ${c.border}`,
        "& .MuiSelect-select": {
          py: 0.5,
          pl: 1.5,
          display: "flex",
          alignItems: "center",
        },
        "& fieldset": { border: "none" },
        "& svg": { color: c.color },
      }}
    >
      {options.map((opt) => (
        <MenuItem key={opt} value={opt} sx={{ fontSize: 13 }}>
          {opt}
        </MenuItem>
      ))}
    </Select>
  );
};

// shared field focus style
const fieldSx = {
  "& .MuiOutlinedInput-root.Mui-focused fieldset": { borderColor: "#D20000" },
  "& label.Mui-focused": { color: "#D20000" },
};

// ─── Main Component ────────────────────────────────────────────────────────────

const Lead = () => {
  const dispatch = useDispatch();

  const leads = useSelector(selectLeads);
  const visits = useSelector(selectVisitList);
  const loading = useSelector(selectLeadsLoading);
  const createLoading = useSelector(selectCreateLeadLoading);
  const createSuccess = useSelector(selectCreateLeadSuccess);
  const updateLoading = useSelector(selectUpdateLeadLoading);
  const updateSuccess = useSelector(selectUpdateLeadSuccess);
  const deleteLoading = useSelector(selectDeleteLeadLoading);
  const employees = useSelector(selectEmployees);

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isViewing, setIsViewing] = useState(false);
  const [viewLead, setViewLead] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [form, setForm] = useState({
    lead_type: "",
    business_name: "",
    contact_person: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    interest_level: "",
    lead_status: "Lead",
    remarks: "",
    created_by: null,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getLeads());
    setPage(1);
  }, [dispatch]);

  useEffect(() => {
    if (createSuccess || updateSuccess) {
      dispatch(getLeads());
      handleReset();
    }
  }, [createSuccess, updateSuccess, dispatch]);

  const validate = () => {
    const temp = {};
    [
      "lead_type",
      "business_name",
      "contact_person",
      "phone",
      "email",
      "address",
      "city",
      "state",
      "interest_level",
      "lead_status",
      "created_by",
    ].forEach((f) => {
      if (!form[f]) temp[f] = "Required";
    });
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleInlineUpdate = (leadId, field, value) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;
    dispatch(updateLead({ id: leadId, data: { ...lead, [field]: value } }))
      .unwrap()
      .then(() => CommonToast(`${field} updated successfully`, "success"))
      .catch(() => CommonToast(`Failed to update ${field}`, "error"));
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (isEditing && editId) {
      dispatch(updateLead({ id: editId, data: form }))
        .unwrap()
        .then(() => CommonToast("Lead updated successfully", "success"))
        .catch(() => CommonToast("Failed to update lead", "error"));
    } else {
      dispatch(createLead(form))
        .unwrap()
        .then(() => CommonToast("Lead created successfully", "success"))
        .catch(() => CommonToast("Failed to create lead", "error"));
    }
  };

  const handleView = (lead) => {
    setViewLead(lead);
    setIsViewing(true);
  };

  const handleEdit = (lead) => {
    setIsEditing(true);
    setEditId(lead.id);
    setForm({
      lead_type: lead.lead_type,
      business_name: lead.business_name,
      contact_person: lead.contact_person,
      phone: lead.phone,
      email: lead.email,
      address: lead.address,
      city: lead.city,
      state: lead.state,
      interest_level: lead.interest_level,
      lead_status: lead.lead_status,
      remarks: lead.remarks || "",
      created_by: lead.created_by,
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      dispatch(deleteLead(id))
        .unwrap()
        .then(() => CommonToast("Lead deleted successfully", "success"))
        .catch(() => CommonToast("Failed to delete lead", "error"));
    }
  };

  const handleVisitsByLead = (id) => {
    if (id) dispatch(getVisits({ lead_id: id }));
  };

  const handleAddLeads = () => {
    setIsEditing(true);
    dispatch(getEmployees());
  };

  const handleReset = () => {
    setIsEditing(false);
    setEditId(null);
    setIsViewing(false);
    setViewLead(null);
    setForm({
      lead_type: "",
      business_name: "",
      contact_person: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      state: "",
      interest_level: "",
      lead_status: "Lead",
      remarks: "",
      created_by: null,
    });
    setErrors({});
  };

  const filteredLeads = leads?.filter((l) =>
    l.business_name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const paginatedData = filteredLeads?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  // ── Create / Edit View ───────────────────────────────────────────────────────
  if (isEditing) {
    return (
      <Box mt={4}>
        <PageHeader
          title={editId ? "Edit Lead" : "Create Lead"}
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
          {/* Section 1: Business Info */}
          <Box
            sx={{
              px: 3,
              py: 2,
              bgcolor: "#fafafa",
              borderBottom: "1px solid #ebebeb",
            }}
          >
            <SectionHeading title="Business Information" />
          </Box>
          <Box px={4} py={3}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={LEAD_TYPE_OPTIONS}
                  value={form.lead_type}
                  onChange={(_, v) => setForm({ ...form, lead_type: v || "" })}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Lead Type"
                      error={!!errors.lead_type}
                      helperText={errors.lead_type}
                      sx={fieldSx}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Business Name"
                  value={form.business_name}
                  fullWidth
                  sx={fieldSx}
                  error={!!errors.business_name}
                  helperText={errors.business_name}
                  onChange={(e) =>
                    setForm({ ...form, business_name: e.target.value })
                  }
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
                  label="Contact Person"
                  value={form.contact_person}
                  fullWidth
                  sx={fieldSx}
                  error={!!errors.contact_person}
                  helperText={errors.contact_person}
                  onChange={(e) =>
                    setForm({ ...form, contact_person: e.target.value })
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: "#D20000" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone"
                  value={form.phone}
                  fullWidth
                  sx={fieldSx}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon sx={{ color: "#D20000" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  value={form.email}
                  fullWidth
                  sx={fieldSx}
                  error={!!errors.email}
                  helperText={errors.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: "#D20000" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Address"
                  value={form.address}
                  fullWidth
                  sx={fieldSx}
                  error={!!errors.address}
                  helperText={errors.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon sx={{ color: "#D20000" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="City"
                  value={form.city}
                  fullWidth
                  sx={fieldSx}
                  error={!!errors.city}
                  helperText={errors.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ApartmentIcon sx={{ color: "#D20000" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="State"
                  value={form.state}
                  fullWidth
                  sx={fieldSx}
                  error={!!errors.state}
                  helperText={errors.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Section 2: Lead Classification */}
          <Box
            sx={{
              px: 3,
              py: 2,
              bgcolor: "#fafafa",
              borderTop: "1px solid #ebebeb",
              borderBottom: "1px solid #ebebeb",
            }}
          >
            <SectionHeading title="Lead Classification" />
          </Box>
          <Box px={4} py={3}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  options={INTEREST_LEVEL_OPTIONS}
                  value={form.interest_level}
                  onChange={(_, v) =>
                    setForm({ ...form, interest_level: v || "" })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Interest Level"
                      error={!!errors.interest_level}
                      helperText={errors.interest_level}
                      sx={fieldSx}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  options={LEAD_STATUS_OPTIONS}
                  value={form.lead_status}
                  onChange={(_, v) =>
                    setForm({ ...form, lead_status: v || "" })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Lead Status"
                      error={!!errors.lead_status}
                      helperText={errors.lead_status}
                      sx={fieldSx}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  options={employees || []}
                  getOptionLabel={(o) =>
                    `${o.first_name || "User"} ${o.last_name || ""}`.trim()
                  }
                  value={
                    employees?.find((e) => e.id === form.created_by) || null
                  }
                  onChange={(_, v) =>
                    setForm({ ...form, created_by: v ? v.id : "" })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Created By"
                      error={!!errors.created_by}
                      helperText={errors.created_by}
                      sx={fieldSx}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <InputAdornment position="start">
                              <PersonIcon sx={{ color: "#D20000" }} />
                            </InputAdornment>
                            {params.InputProps.startAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Remarks"
                  value={form.remarks}
                  multiline
                  rows={3}
                  fullWidth
                  sx={fieldSx}
                  onChange={(e) =>
                    setForm({ ...form, remarks: e.target.value })
                  }
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
                    ? "Update Lead"
                    : "Save Lead"}
              </CommonButton>
            </Stack>
          </Box>
        </Paper>
      </Box>
    );
  }

  // ── View Detail ──────────────────────────────────────────────────────────────
  if (isViewing && viewLead) {
    const ltc = LEAD_TYPE_COLORS[viewLead.lead_type] || {};
    const ic = INTEREST_COLORS[viewLead.interest_level] || {};
    const sc = STATUS_COLORS[viewLead.lead_status] || {};

    return (
      <Box mt={4}>
        <PageHeader title="Lead Details" onBack={handleReset} />

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
              <BusinessIcon sx={{ fontSize: 32, color: "#D20000" }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700} color="#1a1a1a">
                {viewLead.business_name}
              </Typography>
              <Box display="flex" gap={1} mt={0.8} flexWrap="wrap">
                {viewLead.lead_type && (
                  <Chip
                    label={viewLead.lead_type}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      borderRadius: 1,
                      fontSize: 11,
                      bgcolor: ltc.bg,
                      color: ltc.color,
                      border: `1px solid ${ltc.border}`,
                    }}
                  />
                )}
                {viewLead.interest_level && (
                  <Chip
                    label={viewLead.interest_level}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      borderRadius: 1,
                      fontSize: 11,
                      bgcolor: ic.bg,
                      color: ic.color,
                      border: `1px solid ${ic.border}`,
                    }}
                  />
                )}
                {viewLead.lead_status && (
                  <Chip
                    label={viewLead.lead_status}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      borderRadius: 1,
                      fontSize: 11,
                      bgcolor: sc.bg,
                      color: sc.color,
                      border: `1px solid ${sc.border}`,
                    }}
                  />
                )}
              </Box>
            </Box>
          </Box>

          <Box px={4} py={3}>
            <SectionHeading title="Contact Information" />
            <Grid container spacing={2} mb={3}>
              {[
                {
                  label: "Contact Person",
                  value: viewLead.contact_person,
                  icon: <PersonIcon fontSize="small" />,
                },
                {
                  label: "Phone",
                  value: viewLead.phone,
                  icon: <PhoneIcon fontSize="small" />,
                },
                {
                  label: "Email",
                  value: viewLead.email,
                  icon: <EmailIcon fontSize="small" />,
                },
                {
                  label: "Address",
                  value: viewLead.address,
                  icon: <LocationOnIcon fontSize="small" />,
                },
                {
                  label: "City",
                  value: viewLead.city,
                  icon: <ApartmentIcon fontSize="small" />,
                },
                { label: "State", value: viewLead.state },
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
            <SectionHeading title="Classification" />
            <Grid container spacing={2} mb={3}>
              {[
                { label: "Lead Type", value: viewLead.lead_type },
                { label: "Interest Level", value: viewLead.interest_level },
                { label: "Lead Status", value: viewLead.lead_status },
                { label: "Created By", value: viewLead.created_by },
              ].map((item) => (
                <Grid item xs={12} sm={6} md={3} key={item.label}>
                  <DetailCard label={item.label} value={item.value} />
                </Grid>
              ))}
            </Grid>

            {viewLead.remarks && (
              <>
                <Divider sx={{ my: 2 }} />
                <SectionHeading title="Remarks" />
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "#fafafa",
                    border: "1px solid #ebebeb",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2" color="#1a1a1a" fontWeight={500}>
                    {viewLead.remarks}
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </Paper>
      </Box>
    );
  }

  // ── List View ────────────────────────────────────────────────────────────────
  return (
    <Box>
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
            Leads
          </Typography>
        </Box>
        <CommonButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddLeads}
          sx={{
            bgcolor: "#D20000",
            "&:hover": { bgcolor: "#a80000" },
            fontWeight: 700,
            borderRadius: 1.5,
            px: 2.5,
            boxShadow: "0 4px 12px rgba(210,0,0,0.3)",
          }}
        >
          Add Lead
        </CommonButton>
      </Stack>

      <Paper
        elevation={2}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid #f0f0f0",
        }}
      >
        {/* Search */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            bgcolor: "#fafafa",
            borderBottom: "1px solid #ebebeb",
          }}
        >
          <CommonSearchField
            value={searchQuery}
            placeholder="Search by business name..."
            onChange={(v) => setSearchQuery(v)}
          />
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
                  "Business",
                  "Lead Type",
                  "Interest",
                  "Status",
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
                  <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      gap={1}
                    >
                      <CircularProgress size={28} sx={{ color: "#D20000" }} />
                      <Typography variant="body2" color="text.secondary">
                        Loading leads...
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                paginatedData?.map((lead, index) => (
                  <TableRow
                    key={lead.id}
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

                    {/* Business */}
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
                          <BusinessIcon
                            sx={{ fontSize: 15, color: "#D20000" }}
                          />
                        </Box>
                        <Box>
                          <Typography
                            fontWeight={600}
                            fontSize={13}
                            color="#1a1a1a"
                          >
                            {lead.business_name}
                          </Typography>
                          <Typography fontSize={11} color="text.secondary">
                            {lead.city}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Lead Type - inline select */}
                    <TableCell>
                      <ColoredSelect
                        value={lead.lead_type}
                        options={LEAD_TYPE_OPTIONS}
                        colors={LEAD_TYPE_COLORS}
                        onChange={(v) =>
                          handleInlineUpdate(lead.id, "lead_type", v)
                        }
                      />
                    </TableCell>

                    {/* Interest - inline select */}
                    <TableCell>
                      <ColoredSelect
                        value={lead.interest_level}
                        options={INTEREST_LEVEL_OPTIONS}
                        colors={INTEREST_COLORS}
                        onChange={(v) =>
                          handleInlineUpdate(lead.id, "interest_level", v)
                        }
                      />
                    </TableCell>

                    {/* Status - inline select */}
                    <TableCell>
                      <ColoredSelect
                        value={lead.lead_status}
                        options={LEAD_STATUS_OPTIONS}
                        colors={STATUS_COLORS}
                        onChange={(v) =>
                          handleInlineUpdate(lead.id, "lead_status", v)
                        }
                      />
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <Box display="flex" gap={0.5}>
                        <IconButton
                          size="small"
                          onClick={() => handleView(lead)}
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
                          onClick={() => handleEdit(lead)}
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
                          onClick={() => handleDelete(lead.id)}
                          sx={{
                            bgcolor: "#fce4ec",
                            color: "#c62828",
                            "&:hover": { bgcolor: "#ef9a9a" },
                            borderRadius: 1,
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleVisitsByLead(lead.id)}
                          sx={{
                            bgcolor: "#f3e5f5",
                            color: "#6a1b9a",
                            "&:hover": { bgcolor: "#e1bee7" },
                            borderRadius: 1,
                          }}
                        >
                          <TrendingUpIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}

              {!loading && filteredLeads?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      gap={1}
                    >
                      <BusinessIcon sx={{ fontSize: 40, color: "#e0e0e0" }} />
                      <Typography color="text.secondary" fontWeight={500}>
                        No leads found
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
            count={Math.ceil((filteredLeads?.length || 0) / rowsPerPage)}
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

export default Lead;
