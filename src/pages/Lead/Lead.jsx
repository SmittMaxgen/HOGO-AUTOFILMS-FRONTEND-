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
  selectLeadError,
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
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";

import CommonButton from "../../components/commonComponents/CommonButton";
import CommonToast from "../../components/commonComponents/Toster";
import CommonSearchField from "../../components/commonComponents/CommonSearchField";

import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { getTripByVisit } from "../../feature/trip/tripThunks";
import DemoTripMap from "../OSM/DemoTripMap";

// ─── Constants ────────────────────────────────────────────────────────────────

const LEAD_TYPE_OPTIONS = ["Distributor", "Retailer", "Direct"];
const INTEREST_LEVEL_OPTIONS = ["Warm", "Hot", "Cold"];
const LEAD_STATUS_OPTIONS = ["Lead", "Prospect", "Converted", "Lost"];
const LEAD_SOURCE_OPTIONS = [
  "WHATSAPP",
  "FACEBOOK",
  "INSTAGRAM",
  "REFERENCE",
  "COLD_CALL",
  "WEBSITE",
  "OTHER",
];
const LEAD_TYPE_COLORS = {
  Distributor: { bg: "#e3f2fd", color: "#1565c0", border: "#90caf9" },
  Retailer: { bg: "#e8f5e9", color: "#2e7d32", border: "#a5d6a7" },
  Direct: { bg: "#f3e5f5", color: "#6a1b9a", border: "#ce93d8" },
};

const INTEREST_COLORS = {
  Warm: { bg: "#e8f5e9", color: "#2e7d32", border: "#a5d6a7" },
  Cold: { bg: "#fff8e1", color: "#f57c00", border: "#ffe082" },
  Hot: { bg: "#fce4ec", color: "#c62828", border: "#ef9a9a" },
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

  const leadsData = useSelector(selectLeads);
  const leads = leadsData?.data || [];
  const totalPages = leadsData?.total_pages || 1;
  const currentPage = leadsData?.current_page || 1;

  const visits = useSelector(selectVisitList);
  const loading = useSelector(selectLeadsLoading);
  const createLoading = useSelector(selectCreateLeadLoading);
  const createSuccess = useSelector(selectCreateLeadSuccess);
  const updateLoading = useSelector(selectUpdateLeadLoading);
  const updateSuccess = useSelector(selectUpdateLeadSuccess);
  const deleteLoading = useSelector(selectDeleteLeadLoading);
  const leadError = useSelector(selectLeadError);
  const employees = useSelector(selectEmployees);

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [filters, setFilters] = useState({
    lead_type: "",
    interest_level: "",
    lead_status: "",
    created_by: "",
    assigned_to: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isViewing, setIsViewing] = useState(false);
  const [viewLead, setViewLead] = useState(null);

  const [selectedLeadVisits, setSelectedLeadVisits] = useState([]);
  const [isViewingVisits, setIsViewingVisits] = useState(false);
  const [selectedLeadForVisits, setSelectedLeadForVisits] = useState(null);

  // ── Trip states (declared ONCE) ──────────────────────────────────────────────
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isViewingTrip, setIsViewingTrip] = useState(false);

  const [form, setForm] = useState({
    lead_type: "",
    week: "",
    month: "",
    business_name: "",
    contact_person: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    location: "",
    interest_level: "",
    lead_status: "Lead",
    lead_source: "",
    remarks: "",
    created_by: null,
    assigned_to: null,
    brand_dealing: "",
    outlet_age: "",
    past_distributor_name: "",
    cars_per_month: "",
    dealer_landing_cost: "",
    demo: false,
    ppf_installers: false,
    price_feedback: "",
    quality_feedback: "",
    date: "",
  });

  const [errors, setErrors] = useState({});

  const fetchLeads = () => {
    dispatch(
      getLeads({
        page,
        search: searchQuery,
        ...filters,
      }),
    );
  };

  useEffect(() => {
    fetchLeads();
  }, [dispatch, page, searchQuery, filters]);

  useEffect(() => {
    dispatch(getEmployees());
  }, [dispatch]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, filters]);

  useEffect(() => {
    if (createSuccess || updateSuccess) {
      dispatch(getLeads());
      handleReset();
    }
  }, [createSuccess, updateSuccess, dispatch]);

  useEffect(() => {
    if (isViewingVisits && selectedLeadForVisits) {
      const relevantVisits = visits.filter(
        (v) => v.lead_id === selectedLeadForVisits.id,
      );
      setSelectedLeadVisits(relevantVisits);
    }
  }, [visits, isViewingVisits, selectedLeadForVisits]);

  const [visitPage, setVisitPage] = useState(1);
  const visitsPerPage = 10;

  useEffect(() => {
    setVisitPage(1);
  }, [selectedLeadForVisits?.id]);

  useEffect(() => {
    if (!isViewingVisits) {
      setVisitPage(1);
    }
  }, [isViewingVisits]);

  const validate = () => {
    const temp = {};
    [
      "lead_type",
      "cars_per_month",
      "dealer_landing_cost",
      "date",
      "month",
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

    if (form.phone && !/^\d{10}$/.test(form.phone)) {
      temp.phone = "Phone must be exactly 10 digits";
    }

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
        .catch(() =>
          CommonToast(leadError || "Failed to create lead", "error"),
        );
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
      lead_type: lead.lead_type || "",
      business_name: lead.business_name || "",
      contact_person: lead.contact_person || "",
      phone: lead.phone || "",
      email: lead.email || "",
      address: lead.address || "",
      city: lead.city || "",
      state: lead.state || "",
      location: lead.location || "",
      interest_level: lead.interest_level || "",
      lead_status: lead.lead_status || "Lead",
      lead_source: lead.lead_source || "",
      remarks: lead.remarks || "",
      created_by: lead.created_by || null,
      assigned_to: lead.assigned_to || null,
      brand_dealing: lead.brand_dealing || "",
      outlet_age: lead.outlet_age || "",
      past_distributor_name: lead.past_distributor_name || "",
      cars_per_month: lead.cars_per_month || "",
      dealer_landing_cost: lead.dealer_landing_cost || "",
      demo: lead.demo || false,
      ppf_installers: lead.ppf_installers || false,
      price_feedback: lead.price_feedback || "",
      quality_feedback: lead.quality_feedback || "",
      date: lead.date || "",
      week: lead.week || "",
      month: lead.month || "",
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

  const handleShowVisits = (lead) => {
    setSelectedLeadForVisits(lead);
    setSelectedLeadVisits([]);
    setIsViewingVisits(true);

    dispatch(getVisits({ lead_id: lead.id }))
      .unwrap()
      .catch(() => {
        CommonToast("Failed to load visits", "error");
      });
  };

  // ── handleShowTrip (declared ONCE) — receives a visit object ─────────────────
  const handleShowTrip = (visit) => {
    if (!visit?.id) {
      CommonToast("Invalid visit", "error");
      return;
    }

    dispatch(getTripByVisit(visit.id))
      .unwrap()
      .then((res) => {
        if (res?.data?.length > 0) {
          setSelectedTrip(res.data[0]);
          setIsViewingTrip(true);
        } else {
          CommonToast("No trip found for this visit", "info");
        }
      })
      .catch(() => CommonToast("Failed to load trip data", "error"));
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
      location: "",
      interest_level: "",
      lead_status: "Lead",
      lead_source: "",
      remarks: "",
      created_by: null,
      assigned_to: null,
      brand_dealing: "",
      outlet_age: "",
      past_distributor_name: "",
      cars_per_month: "",
      dealer_landing_cost: "",
      demo: false,
      ppf_installers: false,
      price_feedback: "",
      quality_feedback: "",
      date: "",
    });
    setErrors({});
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      lead_type: "",
      interest_level: "",
      lead_status: "",
      created_by: "",
      assigned_to: "",
    });
    setSearchQuery("");
    setPage(1);
  };

  // ── Trip Map View ────────────────────────────────────────────────────────────
  if (isViewingTrip && selectedTrip) {
    return (
      <DemoTripMap
        trip={selectedTrip}
        onBack={() => {
          setIsViewingTrip(false);
          setSelectedTrip(null);
        }}
      />
    );
  }

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
                  sx={{ width: "250px" }}
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
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Location / Area"
                  value={form.location}
                  fullWidth
                  sx={fieldSx}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
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
                  sx={{ width: "250px" }}
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
                  sx={{ width: "250px" }}
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
                  sx={{ width: "250px" }}
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
          </Box>

          {/* Section 3: Business Details */}
          <Box
            sx={{
              px: 3,
              py: 2,
              bgcolor: "#fafafa",
              borderTop: "1px solid #ebebeb",
              borderBottom: "1px solid #ebebeb",
            }}
          >
            <SectionHeading title="Business Details" />
          </Box>
          <Box px={4} py={3}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Week"
                  value={form.week}
                  fullWidth
                  sx={fieldSx}
                  error={!!errors.week}
                  helperText={errors.week}
                  onChange={(e) => setForm({ ...form, week: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Month"
                  value={form.month}
                  fullWidth
                  sx={fieldSx}
                  error={!!errors.month}
                  helperText={errors.month}
                  onChange={(e) => setForm({ ...form, month: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Brand Dealing"
                  value={form.brand_dealing}
                  fullWidth
                  sx={fieldSx}
                  onChange={(e) =>
                    setForm({ ...form, brand_dealing: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Outlet Age"
                  value={form.outlet_age}
                  fullWidth
                  sx={fieldSx}
                  onChange={(e) =>
                    setForm({ ...form, outlet_age: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Past Distributor Name"
                  value={form.past_distributor_name}
                  fullWidth
                  sx={fieldSx}
                  onChange={(e) =>
                    setForm({ ...form, past_distributor_name: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Cars Per Month"
                  value={form.cars_per_month}
                  type="number"
                  fullWidth
                  sx={fieldSx}
                  error={!!errors.cars_per_month}
                  helperText={errors.cars_per_month}
                  onChange={(e) =>
                    setForm({ ...form, cars_per_month: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Dealer Landing Cost"
                  value={form.dealer_landing_cost}
                  type="number"
                  fullWidth
                  sx={fieldSx}
                  error={!!errors.dealer_landing_cost}
                  helperText={errors.dealer_landing_cost}
                  onChange={(e) =>
                    setForm({ ...form, dealer_landing_cost: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  sx={{ width: "250px" }}
                  options={LEAD_SOURCE_OPTIONS}
                  value={form.lead_source}
                  onChange={(_, v) =>
                    setForm({ ...form, lead_source: v || "" })
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Lead Source" sx={fieldSx} />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date"
                  value={form.date}
                  type="date"
                  fullWidth
                  error={!!errors.date}
                  helperText={errors.date}
                  sx={fieldSx}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  sx={{ width: "250px" }}
                  options={employees || []}
                  getOptionLabel={(o) =>
                    `${o.first_name || "User"} ${o.last_name || ""}`.trim()
                  }
                  value={
                    employees?.find((e) => e.id === form.assigned_to) || null
                  }
                  onChange={(_, v) =>
                    setForm({ ...form, assigned_to: v ? v.id : null })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Assigned To"
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
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Price Feedback"
                  value={form.price_feedback}
                  fullWidth
                  sx={fieldSx}
                  onChange={(e) =>
                    setForm({ ...form, price_feedback: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Quality Feedback"
                  value={form.quality_feedback}
                  fullWidth
                  sx={fieldSx}
                  onChange={(e) =>
                    setForm({ ...form, quality_feedback: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form.demo}
                      onChange={(e) =>
                        setForm({ ...form, demo: e.target.checked })
                      }
                      sx={{
                        color: "#D20000",
                        "&.Mui-checked": { color: "#D20000" },
                      }}
                    />
                  }
                  label="Demo"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form.ppf_installers}
                      onChange={(e) =>
                        setForm({ ...form, ppf_installers: e.target.checked })
                      }
                      sx={{
                        color: "#D20000",
                        "&.Mui-checked": { color: "#D20000" },
                      }}
                    />
                  }
                  label="PPF Installers"
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
                { label: "Lead Source", value: viewLead.lead_source },
                {
                  label: "Created By",
                  value: viewLead.created_by_name || viewLead.created_by,
                },
                {
                  label: "Assigned To",
                  value: viewLead.assigned_to_name || viewLead.assigned_to,
                },
                { label: "Date", value: viewLead.date },
              ].map((item) => (
                <Grid item xs={12} sm={6} md={3} key={item.label}>
                  <DetailCard label={item.label} value={item.value} />
                </Grid>
              ))}
            </Grid>

            <Divider sx={{ my: 2 }} />
            <SectionHeading title="Business Details" />
            <Grid container spacing={2} mb={3}>
              {[
                { label: "Week", value: viewLead.week },
                { label: "Month", value: viewLead.month },
                { label: "Brand Dealing", value: viewLead.brand_dealing },
                { label: "Outlet Age", value: viewLead.outlet_age },
                {
                  label: "Past Distributor",
                  value: viewLead.past_distributor_name,
                },
                { label: "Cars Per Month", value: viewLead.cars_per_month },
                {
                  label: "Dealer Landing Cost",
                  value: viewLead.dealer_landing_cost
                    ? `₹${viewLead.dealer_landing_cost}`
                    : null,
                },
                { label: "Location / Area", value: viewLead.location },
                { label: "Price Feedback", value: viewLead.price_feedback },
                { label: "Quality Feedback", value: viewLead.quality_feedback },
                { label: "Demo", value: viewLead.demo ? "Yes" : "No" },
                {
                  label: "PPF Installers",
                  value: viewLead.ppf_installers ? "Yes" : "No",
                },
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

  // ── Visits List View ────────────────────────────────────────────────────────
  if (isViewingVisits && selectedLeadForVisits) {
    const totalVisitCount = selectedLeadVisits.length;
    const totalVisitPages = Math.ceil(totalVisitCount / visitsPerPage);
    const startIndex = (visitPage - 1) * visitsPerPage;
    const paginatedVisits = selectedLeadVisits.slice(
      startIndex,
      startIndex + visitsPerPage,
    );

    return (
      <Box mt={4}>
        <PageHeader
          title={`Visits for ${selectedLeadForVisits.business_name}`}
          onBack={() => {
            setIsViewingVisits(false);
            setSelectedLeadForVisits(null);
            setSelectedLeadVisits([]);
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
          <Box
            sx={{
              px: 4,
              py: 2.5,
              bgcolor: "#f8f8f8",
              borderBottom: "2px solid #D20000",
            }}
          >
            <BusinessIcon sx={{ fontSize: 32, color: "#D20000", mr: 2 }} />
            <Typography variant="h6" fontWeight={700} display="inline">
              {selectedLeadForVisits.business_name}
            </Typography>
          </Box>

          <Box p={3}>
            {totalVisitCount === 0 ? (
              <Box textAlign="center" py={6}>
                <Typography color="text.secondary">
                  No visits recorded yet.
                </Typography>
              </Box>
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#f0f0f0" }}>
                        {[
                          "Date",
                          "Employee",
                          "Purpose",
                          "Status",
                          "Check-in",
                          "Check-out",
                          "Duration",
                          "Notes",
                          "Actions",
                        ].map((h) => (
                          <TableCell key={h} sx={{ fontWeight: 700 }}>
                            {h}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {paginatedVisits.map((visit) => (
                        <TableRow key={visit.id} hover>
                          <TableCell>
                            {visit.visit_date
                              ? new Date(visit.visit_date).toLocaleDateString()
                              : "—"}
                          </TableCell>
                          <TableCell>{visit.employee_name || "—"}</TableCell>
                          <TableCell>{visit.visit_purpose || "—"}</TableCell>
                          <TableCell>
                            <Chip
                              label={visit.status_display || visit.status}
                              size="small"
                              color="default"
                            />
                          </TableCell>
                          <TableCell>
                            {visit.check_in_time
                              ? new Date(
                                  visit.check_in_time,
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "—"}
                          </TableCell>
                          <TableCell>
                            {visit.checkout_time
                              ? new Date(
                                  visit.checkout_time,
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "—"}
                          </TableCell>
                          <TableCell>{visit.total_hr || "—"}</TableCell>
                          <TableCell>
                            {visit.notes?.substring(0, 60) || "—"}
                          </TableCell>
                          <TableCell>
                            <CommonButton
                              size="small"
                              variant="contained"
                              startIcon={<TrendingUpIcon />}
                              onClick={() => handleShowTrip(visit)}
                              sx={{
                                bgcolor: "#2e7d32",
                                "&:hover": { bgcolor: "#1b5e20" },
                              }}
                            >
                              View Trip
                            </CommonButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {totalVisitPages > 1 && (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 3 }}
                  >
                    <Pagination
                      count={totalVisitPages}
                      page={visitPage}
                      onChange={(_, v) => setVisitPage(v)}
                    />
                  </Box>
                )}
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
        {/* Search & Filters */}
        <Box
          sx={{
            px: 2,
            py: 2,
            bgcolor: "#fafafa",
            borderBottom: "1px solid #ebebeb",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            gap={2}
            flexWrap="wrap"
            alignItems="center"
          >
            <CommonSearchField
              value={searchQuery}
              placeholder="Search by business name..."
              onChange={setSearchQuery}
            />

            <Autocomplete
              size="small"
              options={LEAD_TYPE_OPTIONS}
              value={filters.lead_type}
              onChange={(_, v) => handleFilterChange("lead_type", v || "")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Lead Type"
                  sx={{ minWidth: 150 }}
                />
              )}
            />

            <Autocomplete
              size="small"
              options={INTEREST_LEVEL_OPTIONS}
              value={filters.interest_level}
              onChange={(_, v) => handleFilterChange("interest_level", v || "")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Interest"
                  sx={{ minWidth: 130 }}
                />
              )}
            />

            <Autocomplete
              size="small"
              options={LEAD_STATUS_OPTIONS}
              value={filters.lead_status}
              onChange={(_, v) => handleFilterChange("lead_status", v || "")}
              renderInput={(params) => (
                <TextField {...params} label="Status" sx={{ minWidth: 130 }} />
              )}
            />

            <Autocomplete
              size="small"
              options={employees || []}
              getOptionLabel={(o) =>
                `${o.first_name || ""} ${o.last_name || ""}`.trim()
              }
              value={
                employees?.find((e) => e.id === filters.created_by) || null
              }
              onChange={(_, v) => handleFilterChange("created_by", v?.id || "")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Created By"
                  sx={{ minWidth: 160 }}
                />
              )}
            />

            <Autocomplete
              size="small"
              options={employees || []}
              getOptionLabel={(o) =>
                `${o.first_name || ""} ${o.last_name || ""}`.trim()
              }
              value={
                employees?.find((e) => e.id === filters.assigned_to) || null
              }
              onChange={(_, v) =>
                handleFilterChange("assigned_to", v?.id || "")
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Assigned To"
                  sx={{ minWidth: 160 }}
                />
              )}
            />

            <CommonButton
              variant="outlined"
              color="secondary"
              onClick={clearFilters}
            >
              Clear Filters
            </CommonButton>
          </Stack>
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
                  "Assign To",
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
                        Loading leads...
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                leads?.map((lead, index) => (
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
                    <TableCell>{(currentPage - 1) * 10 + index + 1}</TableCell>

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
                          <SupportAgentOutlinedIcon
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

                    <TableCell>
                      <Typography
                        fontWeight={600}
                        fontSize={13}
                        color="#1a1a1a"
                      >
                        {lead?.assigned_to_name || "N/A"}
                      </Typography>
                    </TableCell>

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
                          onClick={() => handleShowVisits(lead)}
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

              {!loading && leads?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
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
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default Lead;
