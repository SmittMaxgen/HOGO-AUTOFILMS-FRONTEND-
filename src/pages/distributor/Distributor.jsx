import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  CircularProgress,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  Stack,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
  FormHelperText,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";
import BusinessIcon from "@mui/icons-material/Business";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import FolderIcon from "@mui/icons-material/Folder";

import {
  getDistributors,
  createDistributor,
  updateDistributor,
  deleteDistributor,
} from "../../feature/distributors/distributorThunks";
import {
  selectDistributors,
  selectDistributorLoading,
} from "../../feature/distributors/distributorSelector";
import CommonButton from "../../components/commonComponents/CommonButton";
import CommonLabel from "../../components/commonComponents/CommonLabel";

const BASE_URL = "https://hogofilm.pythonanywhere.com";

// Tab Panel component
const TabPanel = ({ children, value, index }) => {
  if (value !== index) return null;
  return <Box pt={3}>{children}</Box>;
};

// Info Row Component (Read-only)
const InfoRow = ({ label, value }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="body2" color="text.secondary" fontWeight={600}>
      {label}
    </Typography>
    <Typography variant="body1" sx={{ mt: 0.5 }}>
      {value || "—"}
    </Typography>
  </Box>
);

// Document Link Component
const DocumentLink = ({ url, label }) => {
  if (!url) return null;
  return (
    <Button
      variant="outlined"
      size="small"
      href={`${BASE_URL}${url}`}
      target="_blank"
      startIcon={<VisibilityIcon />}
      sx={{ mr: 1, mb: 1 }}
    >
      {label}
    </Button>
  );
};

// File Input Component with validation
const FileInput = ({
  label,
  onChange,
  accept = "image/*",
  value,
  error,
  required,
}) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="body2" fontWeight={600} mb={1}>
      {label} {required && <span style={{ color: "red" }}>*</span>}
    </Typography>
    <Button
      variant="outlined"
      component="label"
      startIcon={<CloudUploadIcon />}
      fullWidth
      color={error ? "error" : "primary"}
    >
      Choose File
      <input type="file" hidden accept={accept} onChange={onChange} />
    </Button>
    {value && (
      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        sx={{ mt: 1 }}
      >
        {typeof value === "string" ? value : value.name}
      </Typography>
    )}
    {error && <FormHelperText error>{error}</FormHelperText>}
  </Box>
);

const Distributors = () => {
  const dispatch = useDispatch();
  const distributors = useSelector(selectDistributors);
  const loading = useSelector(selectDistributorLoading);

  const [selectedDistributor, setSelectedDistributor] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // Separate edit mode for each tab
  const [editModeTab0, setEditModeTab0] = useState(false);
  const [editModeTab1, setEditModeTab1] = useState(false);
  const [editModeTab2, setEditModeTab2] = useState(false);
  const [editModeTab3, setEditModeTab3] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Form validation errors
  const [formErrors, setFormErrors] = useState({});
  const [backendError, setBackendError] = useState(null);

  // Form states for each section
  const [basicInfoForm, setBasicInfoForm] = useState({});
  const [businessKycForm, setBusinessKycForm] = useState({});
  const [bankLogisticsForm, setBankLogisticsForm] = useState({});
  const [documentsForm, setDocumentsForm] = useState({});

  // New distributor form with proper defaults for required fields
  const [newDistributorForm, setNewDistributorForm] = useState({
    distributor_name: "",
    distributor_type: "Pvt Ltd",
    brand_name: "",
    email_id: "",
    mobile_number: "",
    alternate_mobile: "",
    date_of_registration: "",
    status: "Pending",
    sales_region: "",
    authorized_products: "",
    contact_person_name: "",
    designation: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    business_type: "DISTRIBUTOR",
    years_in_business: "",
    gst_number: "",
    pan_number: "",
    cin_llpin: "",
    owner_name: "", // REQUIRED
    owner_dob: "",
    aadhaar_number: "", // REQUIRED
    address_proof: "Aadhaar",
    authorized_signatory_name: "",
    signatory_pan: "",
    firm_type: "company",
    bank_account_name: "",
    bank_name: "",
    account_number: "",
    ifsc_code: "",
    branch_name: "",
    payment_terms_days: "30", // REQUIRED - default 30 days
    warehouse_available: false,
    warehouse_address: "",
    storage_area_sqft: "",
    logistics_partner: "",
    monthly_distribution_capacity: "",
    service_cities: "",
    agreement_signed: false,
    kyc_verified: false,
    kyc_verified_by: "Admin", // REQUIRED - default Admin
    remarks: "",
    credit_limit: "",
  });

  // File states for new distributor - REQUIRED FILES
  const [newDistFiles, setNewDistFiles] = useState({
    gst_certificate: null,
    pan_card_copy: null,
    aadhaar_front: null, // REQUIRED
    aadhaar_back: null,
    owner_photo: null,
    address_proof_copy: null, // REQUIRED
    signatory_pan_copy: null,
    cancelled_cheque: null,
    agreement_copy: null, // REQUIRED
    incorporation_certificate: null,
    board_resolution: null,
    partnership_deed: null,
    llp_agreement: null,
  });

  useEffect(() => {
    dispatch(getDistributors());
  }, [dispatch]);

  // Validation function
  const validateForm = () => {
    const errors = {};

    // Required text fields
    if (!newDistributorForm.distributor_name.trim()) {
      errors.distributor_name = "Distributor name is required";
    }
    if (!newDistributorForm.email_id.trim()) {
      errors.email_id = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(newDistributorForm.email_id)) {
      errors.email_id = "Email is invalid";
    }
    if (!newDistributorForm.mobile_number.trim()) {
      errors.mobile_number = "Mobile number is required";
    } else if (!/^\d{10}$/.test(newDistributorForm.mobile_number)) {
      errors.mobile_number = "Mobile number must be 10 digits";
    }
    if (!newDistributorForm.city.trim()) {
      errors.city = "City is required";
    }
    if (!newDistributorForm.state.trim()) {
      errors.state = "State is required";
    }
    if (!newDistributorForm.owner_name.trim()) {
      errors.owner_name = "Owner name is required";
    }
    if (!newDistributorForm.aadhaar_number.trim()) {
      errors.aadhaar_number = "Aadhaar number is required";
    } else if (!/^\d{12}$/.test(newDistributorForm.aadhaar_number)) {
      errors.aadhaar_number = "Aadhaar number must be 12 digits";
    }
    if (!newDistributorForm.payment_terms_days) {
      errors.payment_terms_days = "Payment terms is required";
    }
    if (!newDistributorForm.kyc_verified_by.trim()) {
      errors.kyc_verified_by = "KYC verified by is required";
    }

    // Required files
    if (!newDistFiles.aadhaar_front) {
      errors.aadhaar_front = "Aadhaar front image is required";
    }
    if (!newDistFiles.address_proof_copy) {
      errors.address_proof_copy = "Address proof copy is required";
    }
    if (!newDistFiles.agreement_copy) {
      errors.agreement_copy = "Agreement copy is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleViewDetails = (distributor) => {
    setSelectedDistributor(distributor);
    setActiveTab(0);
    // Reset all edit modes
    setEditModeTab0(false);
    setEditModeTab1(false);
    setEditModeTab2(false);
    setEditModeTab3(false);
    loadFormData(distributor);
  };

  const loadFormData = (dist) => {
    // Load Basic Info
    setBasicInfoForm({
      distributor_name: dist.distributor_name || "",
      distributor_type: dist.distributor_type || "",
      brand_name: dist.brand_name || "",
      business_type: dist.business_type || "",
      firm_type: dist.firm_type || "",
      years_in_business: dist.years_in_business || "",
      contact_person_name: dist.contact_person_name || "",
      designation: dist.designation || "",
      mobile_number: dist.mobile_number || "",
      alternate_mobile: dist.alternate_mobile || "",
      email_id: dist.email_id || "",
      address_line_1: dist.address_line_1 || "",
      address_line_2: dist.address_line_2 || "",
      city: dist.city || "",
      state: dist.state || "",
      pincode: dist.pincode || "",
      country: dist.country || "",
      owner_name: dist.owner_name || "",
      owner_dob: dist.owner_dob || "",
      authorized_signatory_name: dist.authorized_signatory_name || "",
      sales_region: dist.sales_region || "",
      service_cities: dist.service_cities || "",
      authorized_products: dist.authorized_products || "",
      bank_account_name: dist.bank_account_name || "",
      bank_name: dist.bank_name || "",
      branch_name: dist.branch_name || "",
      account_number: dist.account_number || "",
      ifsc_code: dist.ifsc_code || "",
      warehouse_address: dist.warehouse_address || "",
      logistics_partner: dist.logistics_partner || "",
      agreement_signed: dist.agreement_signed || false,
      remarks: dist.remarks || "",
      gst_number: dist.gst_number || "",
      pan_number: dist.pan_number || "",
      cin_llpin: dist.cin_llpin || "",
      date_of_registration: dist.date_of_registration || "",
      credit_limit: dist.credit_limit || "",
      payment_terms_days: dist.payment_terms_days || "",
      aadhaar_number: dist.aadhaar_number || "",
      address_proof: dist.address_proof || "",
      signatory_pan: dist.signatory_pan || "",
      monthly_distribution_capacity: dist.monthly_distribution_capacity || "",
      storage_area_sqft: dist.storage_area_sqft || "",
      warehouse_available: dist.warehouse_available || false,
    });

    // Load Business & KYC
    setBusinessKycForm({
      gst_number: dist.gst_number || "",
      pan_number: dist.pan_number || "",
      cin_llpin: dist.cin_llpin || "",
      date_of_registration: dist.date_of_registration || "",
      credit_limit: dist.credit_limit || "",
      payment_terms_days: dist.payment_terms_days || "",
      aadhaar_number: dist.aadhaar_number || "",
      address_proof: dist.address_proof || "",
      signatory_pan: dist.signatory_pan || "",
      monthly_distribution_capacity: dist.monthly_distribution_capacity || "",
      storage_area_sqft: dist.storage_area_sqft || "",
      warehouse_available: dist.warehouse_available || false,
    });

    // Load Bank & Logistics
    setBankLogisticsForm({
      bank_account_name: dist.bank_account_name || "",
      bank_name: dist.bank_name || "",
      branch_name: dist.branch_name || "",
      account_number: dist.account_number || "",
      ifsc_code: dist.ifsc_code || "",
      warehouse_address: dist.warehouse_address || "",
      logistics_partner: dist.logistics_partner || "",
      agreement_signed: dist.agreement_signed || false,
      remarks: dist.remarks || "",
    });

    // Documents form (for file uploads)
    setDocumentsForm({});
  };

  const handleBackToList = () => {
    setSelectedDistributor(null);
    setEditModeTab0(false);
    setEditModeTab1(false);
    setEditModeTab2(false);
    setEditModeTab3(false);
  };

  // Save Basic Info (Tab 0)
  const handleSaveBasicInfo = async () => {
    const formData = new FormData();
    Object.keys(basicInfoForm).forEach((key) => {
      if (
        basicInfoForm[key] !== null &&
        basicInfoForm[key] !== undefined &&
        basicInfoForm[key] !== ""
      ) {
        formData.append(key, basicInfoForm[key]);
      }
    });

    const result = await dispatch(
      updateDistributor({ id: selectedDistributor.id, data: formData }),
    );

    if (result.type.includes("fulfilled")) {
      dispatch(getDistributors());
      setEditModeTab0(false);
    }
  };

  // Save Business & KYC (Tab 1)
  const handleSaveBusinessKyc = async () => {
    const formData = new FormData();
    Object.keys(businessKycForm).forEach((key) => {
      if (
        businessKycForm[key] !== null &&
        businessKycForm[key] !== undefined &&
        businessKycForm[key] !== ""
      ) {
        formData.append(key, businessKycForm[key]);
      }
    });

    const result = await dispatch(
      updateDistributor({ id: selectedDistributor.id, data: formData }),
    );

    if (result.type.includes("fulfilled")) {
      dispatch(getDistributors());
      setEditModeTab1(false);
    }
  };

  // Save Bank & Logistics (Tab 2)
  const handleSaveBankLogistics = async () => {
    const formData = new FormData();
    Object.keys(bankLogisticsForm).forEach((key) => {
      if (
        bankLogisticsForm[key] !== null &&
        bankLogisticsForm[key] !== undefined &&
        bankLogisticsForm[key] !== ""
      ) {
        formData.append(key, bankLogisticsForm[key]);
      }
    });

    const result = await dispatch(
      updateDistributor({ id: selectedDistributor.id, data: formData }),
    );

    if (result.type.includes("fulfilled")) {
      dispatch(getDistributors());
      setEditModeTab2(false);
    }
  };

  // Save Documents (Tab 3)
  const handleSaveDocuments = async () => {
    const formData = new FormData();
    Object.keys(documentsForm).forEach((key) => {
      if (documentsForm[key]) {
        formData.append(key, documentsForm[key]);
      }
    });

    const result = await dispatch(
      updateDistributor({ id: selectedDistributor.id, data: formData }),
    );

    if (result.type.includes("fulfilled")) {
      dispatch(getDistributors());
      setEditModeTab3(false);
    }
  };

  // Delete Distributor
  const handleDelete = async () => {
    await dispatch(deleteDistributor(selectedDistributor.id));
    dispatch(getDistributors());
    setDeleteDialogOpen(false);
    setSelectedDistributor(null);
  };

  // Create New Distributor with validation
  const handleCreateDistributor = async () => {
    // Clear previous errors
    setBackendError(null);

    // Validate form
    if (!validateForm()) {
      return;
    }

    const formData = new FormData();

    // Append all text fields
    Object.entries(newDistributorForm).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        formData.append(key, value);
      }
    });

    // Append all file fields
    Object.entries(newDistFiles).forEach(([key, file]) => {
      if (file) {
        formData.append(key, file);
      }
    });

    try {
      const result = await dispatch(createDistributor(formData));

      if (result.type.includes("fulfilled")) {
        dispatch(getDistributors());
        setAddDialogOpen(false);

        // Reset form
        setNewDistributorForm({
          distributor_name: "",
          distributor_type: "Pvt Ltd",
          brand_name: "",
          email_id: "",
          mobile_number: "",
          alternate_mobile: "",
          date_of_registration: "",
          status: "Pending",
          sales_region: "",
          authorized_products: "",
          contact_person_name: "",
          designation: "",
          address_line_1: "",
          address_line_2: "",
          city: "",
          state: "",
          pincode: "",
          country: "India",
          business_type: "DISTRIBUTOR",
          years_in_business: "",
          gst_number: "",
          pan_number: "",
          cin_llpin: "",
          owner_name: "",
          owner_dob: "",
          aadhaar_number: "",
          address_proof: "Aadhaar",
          authorized_signatory_name: "",
          signatory_pan: "",
          firm_type: "company",
          bank_account_name: "",
          bank_name: "",
          account_number: "",
          ifsc_code: "",
          branch_name: "",
          payment_terms_days: "30",
          warehouse_available: false,
          warehouse_address: "",
          storage_area_sqft: "",
          logistics_partner: "",
          monthly_distribution_capacity: "",
          service_cities: "",
          agreement_signed: false,
          kyc_verified: false,
          kyc_verified_by: "Admin",
          remarks: "",
          credit_limit: "",
        });

        setNewDistFiles({
          gst_certificate: null,
          pan_card_copy: null,
          aadhaar_front: null,
          aadhaar_back: null,
          owner_photo: null,
          address_proof_copy: null,
          signatory_pan_copy: null,
          cancelled_cheque: null,
          agreement_copy: null,
          incorporation_certificate: null,
          board_resolution: null,
          partnership_deed: null,
          llp_agreement: null,
        });

        setFormErrors({});
      } else if (result.type.includes("rejected")) {
        // Handle backend errors
        const errorData = result.payload;
        if (typeof errorData === "object" && errorData.errors) {
          setBackendError(errorData.errors);
        } else {
          setBackendError({
            general: errorData || "Failed to create distributor",
          });
        }
      }
    } catch (error) {
      setBackendError({ general: "An unexpected error occurred" });
    }
  };

  // TABLE VIEW
  if (!selectedDistributor) {
    return (
      <Box sx={{ height: "100vh" }}>
        {!addDialogOpen && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                fontWeight={700}
                sx={{ color: "#7E7E7E", mb: 1 }}
              >
                Distributors Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage distributors, KYC verification, and documentation
              </Typography>
            </Box>
            {/* <CommonButton
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddDialogOpen(true)}
              size="large"
            >
              Add Distributor
            </CommonButton> */}
          </Box>
        )}

        {!addDialogOpen && (
          <Paper elevation={3}>
            {loading ? (
              <Box display="flex" justifyContent="center" py={10}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Sr</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>
                        Distributor Name
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>City</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>State</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Contact</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>KYC</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {distributors.map((dist, index) => (
                      <TableRow key={dist.id} hover>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Typography fontWeight={600}>
                            {dist.distributor_name}
                          </Typography>
                        </TableCell>
                        <TableCell>{dist.distributor_type}</TableCell>
                        <TableCell>{dist.city}</TableCell>
                        <TableCell>{dist.state}</TableCell>
                        <TableCell>{dist.mobile_number}</TableCell>
                        <TableCell>
                          <Chip
                            label={dist.status}
                            color={
                              dist.status === "Approved"
                                ? "success"
                                : dist.status === "Pending"
                                  ? "warning"
                                  : "default"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={dist.kyc_verified ? "Verified" : "Pending"}
                            color={dist.kyc_verified ? "success" : "warning"}
                            size="small"
                            icon={
                              dist.kyc_verified ? (
                                <CheckCircleIcon />
                              ) : undefined
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => handleViewDetails(dist)}
                            size="small"
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        )}

        {/* Add Distributor Dialog */}
        {addDialogOpen && (
          <Box
            open={addDialogOpen}
            onClose={() => {
              setAddDialogOpen(false);
              setFormErrors({});
              setBackendError(null);
            }}
            // maxWidth="md"
            fullWidth
            PaperProps={{
              sx: { maxHeight: "90vh" },
            }}
          >
            <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
              <IconButton onClick={() => setAddDialogOpen(false)}>
                <ArrowBackIcon />
              </IconButton>
              <CommonLabel>Add New Distributor</CommonLabel>
            </DialogTitle>
            {/*  */}

            {/*  */}
            <DialogActions sx={{ px: 3, py: 2 }}>
              <CommonButton
                variant="outlined"
                onClick={() => {
                  setAddDialogOpen(false);
                  setFormErrors({});
                  setBackendError(null);
                }}
              >
                Cancel
              </CommonButton>
              <CommonButton
                variant="contained"
                onClick={handleCreateDistributor}
                disabled={loading}
              >
                {loading ? "Saving..." : "Add Distributor"}
              </CommonButton>
            </DialogActions>
          </Box>
        )}
        {/* Add Distributor Dialog */}
      </Box>
    );
  }

  // DETAIL VIEW WITH 4 TABS
  return (
    <Box sx={{ height: "100vh", overflow: "auto", bgcolor: "grey.50" }}>
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          p: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <IconButton onClick={handleBackToList} sx={{ color: "white", mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" fontWeight={700} sx={{ flex: 1 }}>
            Distributor Details
          </Typography>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete
          </Button>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {selectedDistributor.owner_photo && (
            <Avatar
              src={`${BASE_URL}${selectedDistributor.owner_photo}`}
              sx={{ width: 80, height: 80, border: "3px solid white" }}
            />
          )}
          <Box>
            <Typography variant="h4" fontWeight={700}>
              {selectedDistributor.distributor_name}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <Chip
                label={selectedDistributor.status}
                size="small"
                sx={{ bgcolor: "white", color: "success.main" }}
              />
              {selectedDistributor.kyc_verified && (
                <Chip
                  label="KYC Verified"
                  icon={<CheckCircleIcon />}
                  size="small"
                  sx={{ bgcolor: "white", color: "success.main" }}
                />
              )}
            </Box>
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
              {selectedDistributor.city}, {selectedDistributor.state} •{" "}
              {selectedDistributor.mobile_number}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Tabs Section */}
      <Box sx={{ bgcolor: "white", borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ px: 3 }}
        >
          <Tab
            icon={<DescriptionIcon />}
            iconPosition="start"
            label="Basic Distributor Information"
          />
          <Tab
            icon={<BusinessIcon />}
            iconPosition="start"
            label="Contact & Address Details"
          />
          <Tab
            icon={<AccountBalanceIcon />}
            iconPosition="start"
            label="Bank & Financial Details"
          />
          <Tab
            icon={<AccountBalanceIcon />}
            iconPosition="start"
            label="Distribution Capability & Infrastructure"
          />
          <Tab
            icon={<EditIcon />}
            iconPosition="start"
            label="Business & Legal Information"
          />
          <Tab
            icon={<EditIcon />}
            iconPosition="start"
            label="Complete KYC – Individual / Proprietor"
          />
          <Tab
            icon={<EditIcon />}
            iconPosition="start"
            label="KYC – Company / Partnership / LLP"
          />
          <Tab
            icon={<EditIcon />}
            iconPosition="start"
            label="Compliance & Declarations"
          />
        </Tabs>
      </Box>

      {/* Content Section */}
      <Box sx={{ p: 3 }}>
        {/* TAB 0: OVERVIEW / BASIC INFO */}
        <TabPanel value={activeTab} index={0}>
          <Card elevation={2}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight={700}>
                  Basic Distributor Information
                </Typography>
                <Stack direction="row" spacing={1}>
                  {editModeTab0 && (
                    <CommonButton
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveBasicInfo}
                      disabled={loading}
                    >
                      Save
                    </CommonButton>
                  )}

                  {!editModeTab0 && (
                    <IconButton
                      size="small"
                      color="warning"
                      onClick={() => setEditModeTab0(!editModeTab0)}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                  {editModeTab0 && (
                    <Button
                      variant={editModeTab0 ? "" : "contained"}
                      color={editModeTab0 ? "white" : "primary"}
                      startIcon={editModeTab0 ? null : <EditIcon />}
                      onClick={() => setEditModeTab0(!editModeTab0)}
                    >
                      {editModeTab0 ? "Cancel" : null}
                    </Button>
                  )}
                </Stack>
              </Box>
              <Divider sx={{ mb: 3 }} />

              {editModeTab0 ? (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Distributor Name"
                      value={basicInfoForm.distributor_name}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          distributor_name: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Distributor Type"
                      value={basicInfoForm.distributor_type}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          distributor_type: e.target.value,
                        })
                      }
                    >
                      <MenuItem value="Pvt Ltd">Pvt Ltd</MenuItem>
                      <MenuItem value="Partnership">Partnership</MenuItem>
                      <MenuItem value="Proprietorship">Proprietorship</MenuItem>
                      <MenuItem value="LLP">LLP</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Brand Name"
                      value={basicInfoForm.brand_name}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          brand_name: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Date of Registration"
                      value={businessKycForm.date_of_registration}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          date_of_registration: e.target.value,
                        })
                      }
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Authorized Signatory Name"
                      value={basicInfoForm.authorized_signatory_name}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          authorized_signatory_name: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Sales Region"
                      value={basicInfoForm.sales_region}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          sales_region: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Authorized Products"
                      value={basicInfoForm.authorized_products}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          authorized_products: e.target.value,
                        })
                      }
                    />
                  </Grid>
                </Grid>
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="Distributor Name"
                      value={selectedDistributor.distributor_name}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="Distributor Type"
                      value={selectedDistributor.distributor_type}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="Brand Name"
                      value={selectedDistributor.brand_name}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="Date of Registration"
                      value={selectedDistributor.date_of_registration}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="Owner Name"
                      value={selectedDistributor.owner_name}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="Sales Region"
                      value={selectedDistributor.sales_region}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="Authorized Products"
                      value={selectedDistributor.authorized_products}
                    />
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </TabPanel>

        {/* TAB 1, 2, 3 implementation remains the same as before... */}
        <TabPanel value={activeTab} index={1}>
          <Card elevation={2}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight={700}>
                  Contact & Address Details
                </Typography>
                {/* <Stack direction="row" spacing={1}>
                  {editModeTab0 && (
                    <CommonButton
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveBasicInfo}
                      disabled={loading}
                    >
                      Save
                    </CommonButton>
                  )}
                  <Button
                    variant={editModeTab0 ? "" : "contained"}
                    color={editModeTab0 ? "white" : "primary"}
                    startIcon={editModeTab0 ? null : <EditIcon />}
                    onClick={() => setEditModeTab0(!editModeTab0)}
                  >
                    {editModeTab0 ? "Cancel" : null}
                  </Button>
                </Stack> */}
                <Stack direction="row" spacing={1}>
                  {editModeTab0 && (
                    <CommonButton
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveBasicInfo}
                      disabled={loading}
                    >
                      Save
                    </CommonButton>
                  )}

                  {!editModeTab0 && (
                    <IconButton
                      size="small"
                      color="warning"
                      onClick={() => setEditModeTab0(!editModeTab0)}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                  {editModeTab0 && (
                    <Button
                      variant={editModeTab0 ? "" : "contained"}
                      color={editModeTab0 ? "white" : "primary"}
                      startIcon={editModeTab0 ? null : <EditIcon />}
                      onClick={() => setEditModeTab0(!editModeTab0)}
                    >
                      {editModeTab0 ? "Cancel" : null}
                    </Button>
                  )}
                </Stack>
              </Box>
              <Divider sx={{ mb: 3 }} />

              {editModeTab0 ? (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Contact Person Name"
                      value={basicInfoForm.contact_person_name}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          contact_person_name: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Designation"
                      value={basicInfoForm.designation}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          designation: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Mobile Number"
                      value={basicInfoForm.mobile_number}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          mobile_number: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Alternate Mobile"
                      value={basicInfoForm.alternate_mobile}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          alternate_mobile: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email ID"
                      type="email"
                      value={basicInfoForm.email_id}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          email_id: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address Line 1"
                      value={basicInfoForm.address_line_1}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          address_line_1: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address Line 2"
                      value={basicInfoForm.address_line_2}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          address_line_2: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="City"
                      value={basicInfoForm.city}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          city: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="State"
                      value={basicInfoForm.state}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          state: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Pincode"
                      value={basicInfoForm.pincode}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          pincode: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Country"
                      value={basicInfoForm.country}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          country: e.target.value,
                        })
                      }
                    />
                  </Grid>
                </Grid>
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      InputProps={{
                        readOnly: false,
                      }}
                      label="Contact Person"
                      value={selectedDistributor.contact_person_name}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="Designation"
                      value={selectedDistributor.designation}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="Mobile"
                      value={selectedDistributor.mobile_number}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="Alternate Mobile"
                      value={selectedDistributor.alternate_mobile}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="Address Line 1"
                      value={`${selectedDistributor.address_line_1}, ${selectedDistributor.address_line_2 ? selectedDistributor.address_line_2 + ", " : ""}${selectedDistributor.city}, ${selectedDistributor.state} - ${selectedDistributor.pincode}`}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="Address Line 2"
                      value={`${selectedDistributor.address_line_2}, ${selectedDistributor.address_line_2 ? selectedDistributor.address_line_2 + ", " : ""}${selectedDistributor.city}, ${selectedDistributor.state} - ${selectedDistributor.pincode}`}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="City"
                      value={selectedDistributor.city}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="State"
                      value={selectedDistributor.state}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="Pin code"
                      value={selectedDistributor.pincode}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="Country"
                      value={selectedDistributor.country}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="Email"
                      value={selectedDistributor.email_id}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoRow
                      label="KYC Status"
                      value={
                        selectedDistributor.kyc_verified
                          ? "Verified"
                          : "Pending"
                      }
                    />
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </TabPanel>
        {/* TAB 2: BANK & LOGISTICS */}
        <TabPanel value={activeTab} index={2}>
          <Card elevation={2}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight={700}>
                  Bank & Financial Details
                </Typography>
                <Stack direction="row" spacing={1}>
                  {editModeTab0 && (
                    <CommonButton
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveBasicInfo}
                      disabled={loading}
                    >
                      Save
                    </CommonButton>
                  )}

                  {!editModeTab0 && (
                    <IconButton
                      size="small"
                      color="warning"
                      onClick={() => setEditModeTab0(!editModeTab0)}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                  {editModeTab0 && (
                    <Button
                      variant={editModeTab0 ? "" : "contained"}
                      color={editModeTab0 ? "white" : "primary"}
                      startIcon={editModeTab0 ? null : <EditIcon />}
                      onClick={() => setEditModeTab0(!editModeTab0)}
                    >
                      {editModeTab0 ? "Cancel" : null}
                    </Button>
                  )}
                </Stack>
              </Box>
              <Divider sx={{ mb: 3 }} />

              {editModeTab0 ? (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Bank Account Name"
                      value={basicInfoForm.bank_account_name}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          bank_account_name: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Bank Name"
                      value={basicInfoForm.bank_name}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          bank_name: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Branch Name"
                      value={basicInfoForm.branch_name}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          branch_name: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Account Number"
                      value={basicInfoForm.account_number}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          account_number: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="IFSC Code"
                      value={basicInfoForm.ifsc_code}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          ifsc_code: e.target.value,
                        })
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="Credit Limit"
                      value={`₹${selectedDistributor.credit_limit}`}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="Payment Terms"
                      value={`${selectedDistributor.payment_terms_days} days`}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FileInput
                      label="Cancelled Cheque"
                      value={basicInfoForm.cancelled_cheque}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          cancelled_cheque: e.target.files[0],
                        })
                      }
                      accept="image/*,.pdf"
                    />
                  </Grid>
                </Grid>
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="Bank Account Name"
                      value={selectedDistributor.bank_account_name}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="Bank Name"
                      value={selectedDistributor.bank_name}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="Branch Name"
                      value={selectedDistributor.branch_name}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="Account Number"
                      value={selectedDistributor.account_number}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="IFSC Code"
                      value={selectedDistributor.ifsc_code}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="Credit Limit"
                      value={`₹${selectedDistributor.credit_limit}`}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="Payment Terms"
                      value={`${selectedDistributor.payment_terms_days} days`}
                    />
                  </Grid>
                  <Grid>
                    <Stack spacing={1}>
                      Cancelled Cheque
                      <DocumentLink
                        url={selectedDistributor.cancelled_cheque}
                        label="Cancelled Cheque"
                      />
                    </Stack>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </TabPanel>

        {/* TAB 3: DOCUMENTS */}
        <TabPanel value={activeTab} index={3}>
          {/* working */}
          <Card elevation={2}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight={700}>
                  Distribution Capability & Infrastructure
                </Typography>
                {/* <Stack direction="row" spacing={1}>
                  {editModeTab0 && (
                    <CommonButton
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveBasicInfo}
                      disabled={loading}
                    >
                      Save
                    </CommonButton>
                  )}
                  <Button
                    variant={editModeTab0 ? "" : "contained"}
                    color={editModeTab0 ? "white" : "primary"}
                    startIcon={editModeTab0 ? null : <EditIcon />}
                    onClick={() => setEditModeTab0(!editModeTab0)}
                  >
                    {editModeTab0 ? "Cancel" : null}
                  </Button>
                </Stack> */}
                <Stack direction="row" spacing={1}>
                  {editModeTab0 && (
                    <CommonButton
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveBasicInfo}
                      disabled={loading}
                    >
                      Save
                    </CommonButton>
                  )}

                  {!editModeTab0 && (
                    <IconButton
                      size="small"
                      color="warning"
                      onClick={() => setEditModeTab0(!editModeTab0)}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                  {editModeTab0 && (
                    <Button
                      variant={editModeTab0 ? "" : "contained"}
                      color={editModeTab0 ? "white" : "primary"}
                      startIcon={editModeTab0 ? null : <EditIcon />}
                      onClick={() => setEditModeTab0(!editModeTab0)}
                    >
                      {editModeTab0 ? "Cancel" : null}
                    </Button>
                  )}
                </Stack>
              </Box>
              <Divider sx={{ mb: 3 }} />

              {editModeTab0 ? (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={businessKycForm.warehouse_available}
                          onChange={(e) =>
                            setBasicInfoForm({
                              ...basicInfoForm,
                              warehouse_available: e.target.checked,
                            })
                          }
                        />
                      }
                      label="Warehouse Available"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Warehouse Address"
                      value={basicInfoForm.warehouse_address}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          warehouse_address: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Storage Area (Sq Ft)"
                      type="number"
                      value={businessKycForm.storage_area_sqft}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          storage_area_sqft: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Logistics Partner"
                      value={bankLogisticsForm.logistics_partner}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          logistics_partner: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Monthly Distribution Capacity"
                      value={businessKycForm.monthly_distribution_capacity}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          monthly_distribution_capacity: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Service Cities"
                      value={basicInfoForm.service_cities}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          service_cities: e.target.value,
                        })
                      }
                    />
                  </Grid>
                </Grid>
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="Warehouse Available"
                      value={
                        selectedDistributor.warehouse_available ? "Yes" : "No"
                      }
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="Warehouse Address"
                      value={selectedDistributor.warehouse_address}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="Storage Area (Sq Ft)"
                      value={selectedDistributor.storage_area_sqft}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="Logistics Partner"
                      value={selectedDistributor.logistics_partner}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="Monthly Distribution Capacity"
                      value={selectedDistributor.monthly_distribution_capacity}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="Service Cities"
                      value={selectedDistributor.service_cities}
                    />
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={activeTab} index={4}>
          <Card elevation={2}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight={700}>
                  Business & Legal Information
                </Typography>
                {/* <Stack direction="row" spacing={1}>
                  {editModeTab0 && (
                    <CommonButton
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveBasicInfo}
                      disabled={loading}
                    >
                      Save
                    </CommonButton>
                  )}

                  {!editModeTab0 && (
                    <IconButton
                      size="small"
                      color="warning"
                      onClick={() => setEditModeTab0(!editModeTab0)}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                  {editModeTab0 && (
                    <Button
                      variant={editModeTab0 ? "" : "contained"}
                      color={editModeTab0 ? "white" : "primary"}
                      startIcon={editModeTab0 ? null : <EditIcon />}
                      onClick={() => setEditModeTab0(!editModeTab0)}
                    >
                      {editModeTab0 ? "Cancel" : null}
                    </Button>
                  )}
                </Stack> */}
                <Stack direction="row" spacing={1}>
                  {editModeTab0 && (
                    <CommonButton
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveBasicInfo}
                      disabled={loading}
                    >
                      Save
                    </CommonButton>
                  )}

                  {!editModeTab0 && (
                    <IconButton
                      size="small"
                      color="warning"
                      onClick={() => setEditModeTab0(!editModeTab0)}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                  {editModeTab0 && (
                    <Button
                      variant={editModeTab0 ? "" : "contained"}
                      color={editModeTab0 ? "white" : "primary"}
                      startIcon={editModeTab0 ? null : <EditIcon />}
                      onClick={() => setEditModeTab0(!editModeTab0)}
                    >
                      {editModeTab0 ? "Cancel" : null}
                    </Button>
                  )}
                </Stack>
              </Box>
              <Divider sx={{ mb: 3 }} />
              {/* Currt */}
              {editModeTab0 ? (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Business Type"
                      value={basicInfoForm.business_type}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          business_type: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Years in Business"
                      value={basicInfoForm.years_in_business}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          years_in_business: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="GST Number"
                      value={businessKycForm.gst_number}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          gst_number: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="CIN/LLPIN"
                      value={businessKycForm.cin_llpin}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...businessKycForm,
                          cin_llpin: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FileInput
                      label="GST Certificate"
                      value={documentsForm.gst_certificate}
                      onChange={(e) =>
                        setDocumentsForm({
                          ...documentsForm,
                          gst_certificate: e.target.files[0],
                        })
                      }
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FileInput
                      label="PAN Card Copy"
                      value={documentsForm.pan_card_copy}
                      onChange={(e) =>
                        setDocumentsForm({
                          ...documentsForm,
                          pan_card_copy: e.target.files[0],
                        })
                      }
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FileInput
                      label="Incorporation Certificate"
                      value={documentsForm.incorporation_certificate}
                      onChange={(e) =>
                        setDocumentsForm({
                          ...documentsForm,
                          incorporation_certificate: e.target.files[0],
                        })
                      }
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="PAN Number"
                      value={basicInfoForm.pan_number}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...businessKycForm,
                          pan_number: e.target.value,
                        })
                      }
                    />
                  </Grid>
                </Grid>
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="Business Type"
                      value={selectedDistributor.business_type}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="Years in Business"
                      value={selectedDistributor.years_in_business}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="GST Number"
                      value={selectedDistributor.gst_number}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="CIN/LLPIN"
                      value={selectedDistributor.cin_llpin}
                    />
                  </Grid>
                  <Grid>
                    <DocumentLink
                      url={selectedDistributor.gst_certificate}
                      label="GST Certificate"
                    />
                  </Grid>

                  <Grid>
                    <DocumentLink
                      url={selectedDistributor.pan_card_copy}
                      label="PAN Card Copy"
                    />
                  </Grid>
                  <Grid>
                    <DocumentLink
                      url={selectedDistributor.incorporation_certificate}
                      label="Incorporation Certificate"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="PAN Number"
                      value={selectedDistributor.pan_number}
                    />
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={activeTab} index={5}>
          <Card elevation={2}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight={700}>
                  Complete KYC – Individual / Proprietor
                </Typography>
                {/* currv */}
                {/* <Stack direction="row" spacing={1}>
                  {editModeTab0 && (
                    <CommonButton
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveBasicInfo}
                      disabled={loading}
                    >
                      Save
                    </CommonButton>
                  )}

                  {!editModeTab0 && (
                    <IconButton
                      size="small"
                      color="warning"
                      onClick={() => setEditModeTab0(!editModeTab0)}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                  {editModeTab0 && (
                    <Button
                      variant={editModeTab0 ? "" : "contained"}
                      color={editModeTab0 ? "white" : "primary"}
                      startIcon={editModeTab0 ? null : <EditIcon />}
                      onClick={() => setEditModeTab0(!editModeTab0)}
                    >
                      {editModeTab0 ? "Cancel" : null}
                    </Button>
                  )}
                </Stack> */}
                <Stack direction="row" spacing={1}>
                  {editModeTab0 && (
                    <CommonButton
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveBasicInfo}
                      disabled={loading}
                    >
                      Save
                    </CommonButton>
                  )}

                  {!editModeTab0 && (
                    <IconButton
                      size="small"
                      color="warning"
                      onClick={() => setEditModeTab0(!editModeTab0)}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                  {editModeTab0 && (
                    <Button
                      variant={editModeTab0 ? "" : "contained"}
                      color={editModeTab0 ? "white" : "primary"}
                      startIcon={editModeTab0 ? null : <EditIcon />}
                      onClick={() => setEditModeTab0(!editModeTab0)}
                    >
                      {editModeTab0 ? "Cancel" : null}
                    </Button>
                  )}
                </Stack>
              </Box>
              <Divider sx={{ mb: 3 }} />

              {editModeTab0 ? (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Owner Name"
                      value={basicInfoForm.owner_name}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          owner_name: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Owner DOB"
                      value={basicInfoForm.owner_dob}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          owner_dob: e.target.value,
                        })
                      }
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Aadhaar Number"
                      value={basicInfoForm.aadhaar_number}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          aadhaar_number: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FileInput
                      label="Aadhaar Front"
                      value={basicInfoForm.aadhaar_front}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          aadhaar_front: e.target.files[0],
                        })
                      }
                      accept="image/*"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FileInput
                      label="Aadhaar Back"
                      value={basicInfoForm.aadhaar_back}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          aadhaar_back: e.target.files[0],
                        })
                      }
                      accept="image/*"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FileInput
                      label="Owner Photo"
                      value={basicInfoForm.owner_photo}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          owner_photo: e.target.files[0],
                        })
                      }
                      accept="image/*"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FileInput
                      label="Address Proof Copy"
                      value={basicInfoForm.address_proof}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          address_proof: e.target.files[0],
                        })
                      }
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FileInput
                      label="Address Proof Copy"
                      value={basicInfoForm.address_proof_copy}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          address_proof_copy: e.target.files[0],
                        })
                      }
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </Grid>
                </Grid>
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="Owner Name"
                      value={selectedDistributor.owner_name}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="Owner DOB"
                      value={selectedDistributor.owner_dob}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="Aadhaar Number"
                      value={selectedDistributor.aadhaar_number}
                    />
                  </Grid>
                  <Grid>
                    <DocumentLink
                      url={selectedDistributor.aadhaar_front}
                      label="Aadhaar Front"
                    />
                  </Grid>
                  <Grid>
                    <DocumentLink
                      url={selectedDistributor.aadhaar_back}
                      label="Aadhaar Back"
                    />
                  </Grid>
                  <Grid>
                    <DocumentLink
                      url={selectedDistributor.owner_photo}
                      label="Owner Photo"
                    />
                  </Grid>

                  <Grid>
                    <DocumentLink
                      url={selectedDistributor.address_proof}
                      label="Address Proof"
                    />
                  </Grid>
                  <Grid>
                    <DocumentLink
                      url={selectedDistributor.address_proof_copy}
                      label="Address Proof copy"
                    />
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={activeTab} index={6}>
          <Card elevation={2}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight={700}>
                  KYC – Company / Partnership / LLP
                </Typography>
                <Stack direction="row" spacing={1}>
                  {editModeTab0 && (
                    <CommonButton
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveBasicInfo}
                      disabled={loading}
                    >
                      Save
                    </CommonButton>
                  )}

                  {!editModeTab0 && (
                    <IconButton
                      size="small"
                      color="warning"
                      onClick={() => setEditModeTab0(!editModeTab0)}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                  {editModeTab0 && (
                    <Button
                      variant={editModeTab0 ? "" : "contained"}
                      color={editModeTab0 ? "white" : "primary"}
                      startIcon={editModeTab0 ? null : <EditIcon />}
                      onClick={() => setEditModeTab0(!editModeTab0)}
                    >
                      {editModeTab0 ? "Cancel" : null}
                    </Button>
                  )}
                </Stack>
              </Box>
              <Divider sx={{ mb: 3 }} />
              {/* currh */}
              {editModeTab0 ? (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Authorized Signatory Name"
                      value={basicInfoForm.authorized_signatory_name}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          authorized_signatory_name: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Signatory PAN"
                      value={basicInfoForm.signatory_pan}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          signatory_pan: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FileInput
                      label="Signatory PAN Copy"
                      value={basicInfoForm.signatory_pan_copy}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          signatory_pan_copy: e.target.files[0],
                        })
                      }
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FileInput
                      label="Board Resolution"
                      value={basicInfoForm.board_resolution}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          board_resolution: e.target.files[0],
                        })
                      }
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FileInput
                      label="Partnership Deed"
                      value={basicInfoForm.partnership_deed}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          partnership_deed: e.target.files[0],
                        })
                      }
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FileInput
                      label="LLP Agreement"
                      value={basicInfoForm.llp_agreement}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          llp_agreement: e.target.files[0],
                        })
                      }
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </Grid>
                </Grid>
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="Authorized Signatory Name"
                      value={selectedDistributor.authorized_signatory_name}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="Signatory PAN"
                      value={selectedDistributor.signatory_pan}
                    />
                  </Grid>
                  <Grid>
                    <DocumentLink
                      url={selectedDistributor.signatory_pan_copy}
                      label="Signatory PAN Copy"
                    />
                  </Grid>
                  <Grid>
                    <DocumentLink
                      url={selectedDistributor.board_resolution}
                      label="Board Resolution"
                    />
                  </Grid>
                  <Grid>
                    <DocumentLink
                      url={selectedDistributor.partnership_deed}
                      label="Partnership Deed"
                    />
                  </Grid>
                  <Grid>
                    <DocumentLink
                      url={selectedDistributor.llp_agreement}
                      label="LLP Agreement"
                    />
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={activeTab} index={7}>
          <Card elevation={2}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight={700}>
                  Compliance & Declarations
                </Typography>
                {/* <Stack direction="row" spacing={1}>
                  {editModeTab0 && (
                    <CommonButton
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveBasicInfo}
                      disabled={loading}
                    >
                      Save
                    </CommonButton>
                  )}

                  {!editModeTab0 && (
                    <IconButton
                      size="small"
                      color="warning"
                      onClick={() => setEditModeTab0(!editModeTab0)}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                  {editModeTab0 && (
                    <Button
                      variant={editModeTab0 ? "" : "contained"}
                      color={editModeTab0 ? "white" : "primary"}
                      startIcon={editModeTab0 ? null : <EditIcon />}
                      onClick={() => setEditModeTab0(!editModeTab0)}
                    >
                      {editModeTab0 ? "Cancel" : null}
                    </Button>
                  )}
                </Stack> */}
                <Stack direction="row" spacing={1}>
                  {editModeTab0 && (
                    <CommonButton
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveBasicInfo}
                      disabled={loading}
                    >
                      Save
                    </CommonButton>
                  )}

                  {!editModeTab0 && (
                    <IconButton
                      size="small"
                      color="warning"
                      onClick={() => setEditModeTab0(!editModeTab0)}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                  {editModeTab0 && (
                    <Button
                      variant={editModeTab0 ? "" : "contained"}
                      color={editModeTab0 ? "white" : "primary"}
                      startIcon={editModeTab0 ? null : <EditIcon />}
                      onClick={() => setEditModeTab0(!editModeTab0)}
                    >
                      {editModeTab0 ? "Cancel" : null}
                    </Button>
                  )}
                </Stack>
              </Box>
              <Divider sx={{ mb: 3 }} />
              {/* currd */}
              {editModeTab0 ? (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={basicInfoForm.agreement_signed}
                          onChange={(e) =>
                            setBasicInfoForm({
                              ...basicInfoForm,
                              agreement_signed: e.target.checked,
                            })
                          }
                        />
                      }
                      label="Agreement Signed"
                    />
                  </Grid>
                  <Grid>
                    <Grid item xs={12} sm={6}>
                      <FileInput
                        label="Agreement Copy"
                        required
                        value={newDistFiles.agreement_copy}
                        onChange={(e) =>
                          setNewDistFiles({
                            ...newDistFiles,
                            agreement_copy: e.target.files[0],
                          })
                        }
                        accept=".pdf,.jpg,.jpeg,.png"
                        error={formErrors.agreement_copy}
                      />
                    </Grid>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="KYC Verified By"
                      value={newDistributorForm.kyc_verified_by}
                      onChange={(e) =>
                        setNewDistributorForm({
                          ...newDistributorForm,
                          kyc_verified_by: e.target.value,
                        })
                      }
                      error={!!formErrors.kyc_verified_by}
                      helperText={formErrors.kyc_verified_by}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Remarks"
                      value={bankLogisticsForm.remarks}
                      onChange={(e) =>
                        setBankLogisticsForm({
                          ...bankLogisticsForm,
                          remarks: e.target.value,
                        })
                      }
                    />
                  </Grid>
                </Grid>
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <InfoRow
                      label="Agreement Signed"
                      value={
                        selectedDistributor.agreement_signed ? "Yes" : "No"
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <DocumentLink
                      url={selectedDistributor.agreement_copy}
                      label="Agreement Copy"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <InfoRow
                      label="KYC Status"
                      value={
                        selectedDistributor.kyc_verified
                          ? "Verified"
                          : "Pending"
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="Kyc Verified By"
                      value={selectedDistributor.kyc_verified_by}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      // disabled={true}
                      InputProps={{
                        readOnly: false,
                      }}
                      label="Remarks"
                      value={selectedDistributor.remarks}
                    />
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </TabPanel>
        {/* I'll skip these for brevity as they follow the same pattern */}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>{selectedDistributor?.distributor_name}</strong>? This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Distributors;
