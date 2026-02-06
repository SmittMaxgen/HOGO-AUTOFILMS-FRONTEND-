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
  MenuItem,
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
    remarks: "",
    created_by: "",
  });

  const [errors, setErrors] = useState({});

  // ================= FETCH =================
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

  // ================= HELPERS =================
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
      "created_by",
    ].forEach((field) => {
      if (!form[field]) temp[field] = "Required";
    });

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (isEditing && editId) {
      dispatch(updateLead({ id: editId, data: form }))
        .unwrap()
        .then(() => {
          CommonToast("Lead updated successfully", "success");
        })
        .catch((err) => {
          CommonToast(
            err?.errors
              ? Object.values(err.errors)[0][0]
              : "Failed to update lead",
            "error",
          );
        });
    } else {
      dispatch(createLead(form))
        .unwrap()
        .then(() => {
          CommonToast("Lead created successfully", "success");
        })
        .catch((err) => {
          CommonToast(
            err?.errors
              ? Object.values(err.errors)[0][0]
              : "Failed to create lead",
            "error",
          );
        });
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
      remarks: "",
      created_by: "",
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

  // ================= CREATE / EDIT =================
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
            {[
              ["lead_type", "Lead Type"],
              ["business_name", "Business Name"],
              ["contact_person", "Contact Person"],
              ["phone", "Phone"],
              ["email", "Email"],
              ["address", "Address"],
              ["city", "City"],
              ["state", "State"],
              ["interest_level", "Interest Level"],
              ["created_by", "Created By (User ID)"],
            ].map(([key, label]) => (
              <TextField
                key={key}
                label={label}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                error={!!errors[key]}
                helperText={errors[key]}
                fullWidth
              />
            ))}

            <TextField
              label="Remarks"
              value={form.remarks}
              onChange={(e) => setForm({ ...form, remarks: e.target.value })}
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

  // ================= VIEW =================
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
                label={k.replaceAll("_", " ").toUpperCase()}
                value={v ?? "-"}
                InputProps={{ readOnly: true }}
                fullWidth
              />
            ))}
          </Stack>
        </Paper>
      </Box>
    );
  }

  // ================= LIST =================
  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight={700}>
          Leads
        </Typography>
        <CommonButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsEditing(true)}
        >
          Add Lead
        </CommonButton>
      </Stack>

      <TableContainer component={Paper}>
        <Box sx={{ display: "flex" }}>
          <CommonSearchField
            value={searchQuery}
            placeholder="Search business..."
            onChange={(value) => setSearchQuery(value)}
          />
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              {[
                "Sr",
                "Business",
                "Lead Type",
                "Interest",
                "Status",
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
                <TableCell colSpan={6} align="center">
                  <CircularProgress size={28} />
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              paginatedData?.map((lead, index) => (
                <TableRow key={lead.id} hover>
                  <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{lead.business_name}</TableCell>
                  <TableCell>{lead.lead_type}</TableCell>
                  <TableCell>
                    <Chip
                      label={lead.interest_level}
                      color={
                        lead.interest_level === "High"
                          ? "success"
                          : lead.interest_level === "Medium"
                            ? "warning"
                            : "default"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{lead.lead_status}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleView(lead)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEdit(lead)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      disabled={deleteLoading}
                      onClick={() => handleDelete(lead.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

            {!loading && filteredLeads?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No leads found
                </TableCell>
              </TableRow>
            )}
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
