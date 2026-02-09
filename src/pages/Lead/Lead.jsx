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

import { selectEmployees } from "../../feature/employee/employeeSelector";

import { getEmployees } from "../../feature/employee/employeeThunks";

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
} from "@mui/material";

import Autocomplete from "@mui/material/Autocomplete";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";

import CommonButton from "../../components/commonComponents/CommonButton";
import CommonLabel from "../../components/commonComponents/CommonLabel";
import CommonToast from "../../components/commonComponents/Toster";
import CommonSearchField from "../../components/commonComponents/CommonSearchField";

const LEAD_TYPE_OPTIONS = ["Distributor", "Retailer", "Direct"];
const INTEREST_LEVEL_OPTIONS = ["Low", "Medium", "High"];
const LEAD_STATUS_OPTIONS = ["Lead", "Prospect", "Converted", "Lost"];

const Lead = () => {
  const dispatch = useDispatch();

  const leads = useSelector(selectLeads);
  const loading = useSelector(selectLeadsLoading);

  const createLoading = useSelector(selectCreateLeadLoading);
  const createSuccess = useSelector(selectCreateLeadSuccess);

  const updateLoading = useSelector(selectUpdateLeadLoading);
  const updateSuccess = useSelector(selectUpdateLeadSuccess);

  const deleteLoading = useSelector(selectDeleteLeadLoading);

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const employees = useSelector(selectEmployees);
  console.log("employees::::", employees);

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
  console.log("errors:::", errors);

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
    ].forEach((field) => {
      if (!form[field]) temp[field] = "Required";
    });
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // Add this helper function near the top of your component
  const handleInlineUpdate = (leadId, field, value) => {
    const leadToUpdate = leads.find((l) => l.id === leadId);
    if (!leadToUpdate) return;

    const updatedData = {
      ...leadToUpdate,
      [field]: value,
    };

    dispatch(updateLead({ id: leadId, data: updatedData }))
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

  /* ================= CREATE / EDIT ================= */
  if (isEditing) {
    return (
      <Box mt={4}>
        <Stack direction="row" alignItems="center" spacing={1} mb={3}>
          <IconButton onClick={handleReset}>
            <ArrowBackIcon />
          </IconButton>
          <CommonLabel>{editId ? "Edit Lead" : "Create Lead"}</CommonLabel>
        </Stack>

        <Paper sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Autocomplete
              options={LEAD_TYPE_OPTIONS}
              value={form.lead_type}
              onChange={(_, v) => setForm({ ...form, lead_type: v || "" })}
              renderInput={(params) => (
                <TextField {...params} label="Lead Type" />
              )}
            />

            <TextField
              label="Business Name"
              value={form.business_name}
              onChange={(e) =>
                setForm({ ...form, business_name: e.target.value })
              }
            />

            <TextField
              label="Contact Person"
              value={form.contact_person}
              onChange={(e) =>
                setForm({ ...form, contact_person: e.target.value })
              }
            />

            <TextField
              label="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <TextField
              label="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <TextField
              label="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />

            <TextField
              label="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />

            <TextField
              label="State"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
            />

            <Autocomplete
              options={INTEREST_LEVEL_OPTIONS}
              value={form.interest_level}
              onChange={(_, v) => setForm({ ...form, interest_level: v || "" })}
              renderInput={(params) => (
                <TextField {...params} label="Interest Level" />
              )}
            />

            <Autocomplete
              options={LEAD_STATUS_OPTIONS}
              value={form.lead_status}
              onChange={(_, v) => setForm({ ...form, lead_status: v || "" })}
              renderInput={(params) => (
                <TextField {...params} label="Lead Status" />
              )}
            />

            {/* <TextField
              label="Created By"
              value={form.created_by}
              onChange={(e) => setForm({ ...form, created_by: e.target.value })}
            /> */}
            <Autocomplete
              options={employees || []}
              getOptionLabel={(option) =>
                `${option.first_name || "User"} ${option.last_name || ""}` || ""
              }
              value={
                employees?.find((emp) => emp.id === form.created_by) || null
              }
              onChange={(event, newValue) =>
                setForm({
                  ...form,
                  created_by: newValue ? newValue.id : "",
                })
              }
              renderInput={(params) => (
                <TextField {...params} label="Created By" />
              )}
            />
            <TextField
              label="Remarks"
              value={form.remarks}
              multiline
              rows={3}
              onChange={(e) => setForm({ ...form, remarks: e.target.value })}
            />

            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <CommonButton variant="outlined" onClick={handleReset}>
                Cancel
              </CommonButton>
              <CommonButton variant="contained" onClick={handleSubmit}>
                Save
              </CommonButton>
            </Stack>
          </Stack>
        </Paper>
      </Box>
    );
  }

  /* ================= VIEW ================= */
  if (isViewing && viewLead) {
    return (
      <Box mt={4}>
        <Stack direction="row" alignItems="center" spacing={1} mb={3}>
          <IconButton onClick={handleReset}>
            <ArrowBackIcon />
          </IconButton>
          <CommonLabel>View Lead</CommonLabel>
        </Stack>

        <Paper sx={{ p: 3 }}>
          <Stack spacing={2}>
            {Object.entries(viewLead).map(([k, v]) => (
              <TextField
                key={k}
                label={k}
                value={v ?? "-"}
                InputProps={{ readOnly: true }}
              />
            ))}
          </Stack>
        </Paper>
      </Box>
    );
  }

  /* ================= LIST ================= */
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        {/* <Typography variant="h4">Leads</Typography> */}
        <Stack
          direction="row"
          justifyContent=""
          alignItems="center"
          spacing={1}
          mb={3}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ display: "flex", alignItems: "center", color: "#7E7E7E" }}
          >
            <IconButton onClick={() => setShowViewDialog(false)}>
              {/* {showViewDialog && (
                <ArrowBackIcon sx={{ color: "grey", marginRight: "5px" }} />
              )} */}
            </IconButton>
            Leads
          </Typography>
        </Stack>
        <CommonButton startIcon={<AddIcon />} onClick={() => handleAddLeads()}>
          Add Lead
        </CommonButton>
      </Stack>

      <TableContainer component={Paper}>
        <CommonSearchField
          value={searchQuery}
          onChange={(v) => setSearchQuery(v)}
        />

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr</TableCell>
              <TableCell>Business</TableCell>
              <TableCell>Lead Type</TableCell>
              <TableCell>Interest</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {!loading &&
              paginatedData?.map((lead, index) => (
                <TableRow key={lead.id}>
                  <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{lead.business_name}</TableCell>
                  {/* <TableCell>{lead.lead_type}</TableCell>
                  <TableCell>
                    <Chip label={lead.interest_level} size="small" />
                  </TableCell>
                  <TableCell>{lead.lead_status}</TableCell> */}
                  {/* Lead Type - Chip Dropdown */}
                  <TableCell>
                    <Select
                      size="small"
                      value={lead.lead_type}
                      onChange={(e) =>
                        handleInlineUpdate(lead.id, "lead_type", e.target.value)
                      }
                      sx={{
                        minWidth: 100,
                        height: 25,
                        borderRadius: "999px",
                        fontWeight: 500,
                        color: "white",
                        bgcolor:
                          lead.lead_type === "Distributor"
                            ? "primary.main"
                            : lead.lead_type === "Retailer"
                              ? "info.main"
                              : "secondary.main",
                        "& .MuiSelect-select": {
                          py: 0.5,
                          pl: 2,
                          display: "flex",
                          alignItems: "center",
                        },
                        "& fieldset": {
                          border: "none",
                        },
                        "& svg": {
                          color: "white",
                        },
                      }}
                    >
                      {LEAD_TYPE_OPTIONS.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>

                  {/* Interest Level - Pill Style */}
                  <TableCell>
                    <Select
                      size="small"
                      value={lead.interest_level}
                      onChange={(e) =>
                        handleInlineUpdate(
                          lead.id,
                          "interest_level",
                          e.target.value,
                        )
                      }
                      sx={{
                        minWidth: 90,
                        height: 25,
                        borderRadius: "999px",
                        fontWeight: 500,
                        color: "white",
                        bgcolor:
                          lead.interest_level === "High"
                            ? "success.main"
                            : lead.interest_level === "Medium"
                              ? "warning.main"
                              : "error.main",
                        "& .MuiSelect-select": {
                          py: 0.5,
                          pl: 2,
                          display: "flex",
                          alignItems: "center",
                        },
                        "& fieldset": {
                          border: "none",
                        },
                        "& svg": {
                          color: "white",
                        },
                      }}
                    >
                      {INTEREST_LEVEL_OPTIONS.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>

                  {/* Lead Status - Pill Style */}
                  <TableCell>
                    <Select
                      size="small"
                      value={lead.lead_status}
                      onChange={(e) =>
                        handleInlineUpdate(
                          lead.id,
                          "lead_status",
                          e.target.value,
                        )
                      }
                      sx={{
                        minWidth: 100,
                        height: 25,
                        borderRadius: "999px",
                        fontWeight: 500,
                        color: "white",
                        bgcolor:
                          lead.lead_status === "Converted"
                            ? "success.main"
                            : lead.lead_status === "Prospect"
                              ? "info.main"
                              : lead.lead_status === "Lost"
                                ? "error.main"
                                : "warning.main",
                        "& .MuiSelect-select": {
                          py: 0.5,
                          pl: 2,
                          display: "flex",
                          alignItems: "center",
                        },
                        "& fieldset": {
                          border: "none",
                        },
                        "& svg": {
                          color: "white",
                        },
                      }}
                    >
                      {LEAD_STATUS_OPTIONS.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>

                  <TableCell>
                    <IconButton onClick={() => handleView(lead)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEdit(lead)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(lead.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack alignItems="flex-end" mt={3}>
        <Pagination
          count={Math.ceil((filteredLeads?.length || 0) / rowsPerPage)}
          page={page}
          onChange={(_, v) => setPage(v)}
        />
      </Stack>
    </Box>
  );
};

export default Lead;
