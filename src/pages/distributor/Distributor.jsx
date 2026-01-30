
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

// ==================== UTILITY COMPONENTS ====================

const TabPanel = ({ children, value, index }) => {
  if (value !== index) return null;
  return <Box pt={3}>{children}</Box>;
};

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

// ==================== MAIN COMPONENT ====================

const Distributors = () => {
  const dispatch = useDispatch();
  const distributors = useSelector(selectDistributors);
  const loading = useSelector(selectDistributorLoading);

  // ==================== STATE MANAGEMENT ====================
  
  const [selectedDistributor, setSelectedDistributor] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [createDistributorFlag, setCreateDistributor] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [backendError, setBackendError] = useState(null);

  // Form states
  const [formData, setFormData] = useState({});

  // New distributor form with proper defaults
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
    owner_name: "",
    owner_dob: "",
    aadhaar_number: "",
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

  // File states for new distributor
  const [newDistFiles, setNewDistFiles] = useState({
    gst_certificate: null,
    pan_card_copy: null,
    aadhaar_front: null,
    aadhaar_back: null,
    owner_photo: null,
    address_proof: null,
    address_proof_copy: null,
    signatory_pan_copy: null,
    cancelled_cheque: null,
    agreement_copy: null,
    incorporation_certificate: null,
    board_resolution: null,
    partnership_deed: null,
    llp_agreement: null,
  });

  // ==================== LIFECYCLE ====================

  useEffect(() => {
    dispatch(getDistributors());
  }, [dispatch]);

  // ==================== VALIDATION ====================

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

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ==================== DATA LOADING ====================

  const loadFormData = (dist) => {
    setFormData({
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
  };

  // ==================== EVENT HANDLERS ====================

  const handleViewDetails = (distributor) => {
    setSelectedDistributor(distributor);
    setActiveTab(0);
    setEditMode(false);
    loadFormData(distributor);
  };

  const handleBackToList = () => {
    setSelectedDistributor(null);
    setEditMode(false);
    setCreateDistributor(false);
  };

  const handleSave = async () => {
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (
        formData[key] !== null &&
        formData[key] !== undefined &&
        formData[key] !== ""
      ) {
        formDataToSend.append(key, formData[key]);
      }
    });

    const result = await dispatch(
      updateDistributor({ id: selectedDistributor.id, data: formDataToSend })
    );

    if (result.type.includes("fulfilled")) {
      // Update selectedDistributor immediately with the form data
      const updatedDistributor = {
        ...selectedDistributor,
        ...formData,
      };
      
      setSelectedDistributor(updatedDistributor);
      
      // Reload the form data with updated values
      loadFormData(updatedDistributor);
      
      // Refresh the list in background
      dispatch(getDistributors());
      
      // Exit edit mode
      setEditMode(false);
    }
  };

  const handleDelete = async () => {
    await dispatch(deleteDistributor(selectedDistributor.id));
    dispatch(getDistributors());
    setDeleteDialogOpen(false);
    setSelectedDistributor(null);
  };

  const handleCreateDistributor = async () => {
    setBackendError(null);

    if (!validateForm()) return;

    const formDataToSend = new FormData();

    // Append text fields
    Object.entries(newDistributorForm).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        formDataToSend.append(key, value);
      }
    });

    // Append file fields
    Object.entries(newDistFiles).forEach(([key, file]) => {
      if (file instanceof File) {
        formDataToSend.append(key, file);
      }
    });

    try {
      const result = await dispatch(createDistributor(formDataToSend));

      if (result.type.includes("fulfilled")) {
        dispatch(getDistributors());
        handleBackToList();

        // Reset forms
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
          address_proof: null,
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
      } else {
        setBackendError(
          result.payload?.errors || { general: "Creation failed" }
        );
      }
    } catch (err) {
      setBackendError({ general: "Unexpected error occurred" });
    }
  };

  const handleAddDistributor = () => {
    const emptyDistributor = {
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
      address_proof: null,
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
    };
    handleViewDetails(emptyDistributor);
    setCreateDistributor(true);
  };

  // ==================== RENDER HELPER FUNCTIONS ====================

  const renderTextField = (label, field, type = "text", options = {}) => {
    // Determine if field is editable
    const isEditable = createDistributorFlag || editMode;
    
    // Get the appropriate value based on mode
    const value = createDistributorFlag
      ? newDistributorForm[field]
      : editMode
      ? formData[field]
      : selectedDistributor[field];

    const commonProps = {
      fullWidth: true,
      label,
      type,
      value: value || "",
      InputProps: { readOnly: !isEditable },
      error: createDistributorFlag && !!formErrors[field],
      helperText: createDistributorFlag && formErrors[field],
      ...options,
    };

    if (isEditable) {
      commonProps.onChange = (e) => {
        let newValue = e.target.value;
        
        // Handle numeric-only fields
        if (type === "tel" || options.inputMode === "numeric") {
          newValue = newValue.replace(/\D/g, "");
        }

        if (createDistributorFlag) {
          setNewDistributorForm({
            ...newDistributorForm,
            [field]: newValue,
          });
        } else {
          setFormData({
            ...formData,
            [field]: newValue,
          });
        }
      };
    }

    return <TextField {...commonProps} />;
  };

  const renderFileUpload = (label, fileKey) => {
    const isEditable = createDistributorFlag || editMode;
    
    return (
      <Grid item xs={12}>
        <Stack spacing={1}>
          <Typography fontWeight={500}>{label}</Typography>

          {isEditable ? (
            <>
              <Button variant="outlined" component="label" fullWidth>
                Upload {label}
                <input
                  type="file"
                  hidden
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    if (createDistributorFlag) {
                      setNewDistFiles({
                        ...newDistFiles,
                        [fileKey]: file,
                      });
                    } else {
                      // For edit mode, update formData
                      setFormData({
                        ...formData,
                        [fileKey]: file,
                      });
                    }
                  }}
                />
              </Button>

              {createDistributorFlag && newDistFiles[fileKey] && (
                <Typography variant="body2" mt={1}>
                  Selected File: {newDistFiles[fileKey].name}
                </Typography>
              )}
              
              {editMode && formData[fileKey] && (
                <Typography variant="body2" mt={1}>
                  Selected File: {typeof formData[fileKey] === 'string' ? formData[fileKey] : formData[fileKey].name}
                </Typography>
              )}
            </>
          ) : (
            <DocumentLink url={selectedDistributor[fileKey]} label={label} />
          )}

          {formErrors[fileKey] && (
            <Typography color="error" variant="caption">
              {formErrors[fileKey]}
            </Typography>
          )}
        </Stack>
      </Grid>
    );
  };

  // ==================== TABLE VIEW ====================

  if (!selectedDistributor) {
    return (
      <Box sx={{ height: "100vh" }}>
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
          <CommonButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddDistributor}
            size="large"
          >
            Add Distributor
          </CommonButton>
        </Box>

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
                            dist.kyc_verified ? <CheckCircleIcon /> : undefined
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
      </Box>
    );
  }

  // ==================== DETAIL VIEW ====================

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
            {createDistributorFlag ? "Add New Distributor" : "Distributor Details"}
          </Typography>
          {!createDistributorFlag && (
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete
            </Button>
          )}
        </Box>

        {!createDistributorFlag && (
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
        )}
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
            label="Basic Information"
          />
          <Tab
            icon={<BusinessIcon />}
            iconPosition="start"
            label="Contact & Address"
          />
          <Tab
            icon={<AccountBalanceIcon />}
            iconPosition="start"
            label="Bank & Financial"
          />
          <Tab
            icon={<FolderIcon />}
            iconPosition="start"
            label="Distribution Capability"
          />
          <Tab
            icon={<BusinessIcon />}
            iconPosition="start"
            label="Business & Legal"
          />
          <Tab
            icon={<DescriptionIcon />}
            iconPosition="start"
            label="KYC – Individual"
          />
          <Tab
            icon={<BusinessIcon />}
            iconPosition="start"
            label="KYC – Company"
          />
          <Tab
            icon={<CheckCircleIcon />}
            iconPosition="start"
            label="Compliance"
          />
        </Tabs>
      </Box>

      {/* Content Section */}
      <Box sx={{ p: 3 }}>
        {/* TAB 0: BASIC INFORMATION */}
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
                {!createDistributorFlag && (
                  <Stack direction="row" spacing={1}>
                    {editMode ? (
                      <>
                        <CommonButton
                          variant="contained"
                          startIcon={<SaveIcon />}
                          onClick={handleSave}
                          disabled={loading}
                        >
                          Save
                        </CommonButton>
                        <Button
                          variant="outlined"
                          startIcon={<CancelIcon />}
                          onClick={() => setEditMode(false)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={() => setEditMode(true)}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                  </Stack>
                )}
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  {renderTextField("Distributor Name", "distributor_name")}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField("Distributor Type", "distributor_type")}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField("Brand Name", "brand_name")}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField("Date of Registration", "date_of_registration", "date", {
                    InputLabelProps: { shrink: true },
                  })}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField("Owner Name", "owner_name")}
                </Grid>
                <Grid item xs={12}>
                  {renderTextField("Sales Region", "sales_region")}
                </Grid>
                <Grid item xs={12}>
                  {renderTextField("Authorized Products", "authorized_products")}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        {/* TAB 1: CONTACT & ADDRESS */}
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
                {!createDistributorFlag && (
                  <Stack direction="row" spacing={1}>
                    {editMode ? (
                      <>
                        <CommonButton
                          variant="contained"
                          startIcon={<SaveIcon />}
                          onClick={handleSave}
                          disabled={loading}
                        >
                          Save
                        </CommonButton>
                        <Button
                          variant="outlined"
                          startIcon={<CancelIcon />}
                          onClick={() => setEditMode(false)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={() => setEditMode(true)}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                  </Stack>
                )}
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  {renderTextField("Contact Person", "contact_person_name")}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField("Designation", "designation")}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField("Mobile", "mobile_number", "tel", {
                    inputProps: {
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                      maxLength: 10,
                    },
                  })}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField("Alternate Mobile", "alternate_mobile", "tel", {
                    inputProps: {
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                      maxLength: 10,
                    },
                  })}
                </Grid>
                <Grid item xs={12}>
                  {renderTextField("Email", "email_id", "email")}
                </Grid>
                <Grid item xs={12}>
                  {renderTextField("Address Line 1", "address_line_1")}
                </Grid>
                <Grid item xs={12}>
                  {renderTextField("Address Line 2", "address_line_2")}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderTextField("City", "city")}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderTextField("State", "state")}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderTextField("Pin Code", "pincode")}
                </Grid>
                <Grid item xs={12}>
                  {renderTextField("Country", "country")}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        {/* TAB 2: BANK & FINANCIAL */}
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
                {!createDistributorFlag && (
                  <Stack direction="row" spacing={1}>
                    {editMode ? (
                      <>
                        <CommonButton
                          variant="contained"
                          startIcon={<SaveIcon />}
                          onClick={handleSave}
                          disabled={loading}
                        >
                          Save
                        </CommonButton>
                        <Button
                          variant="outlined"
                          startIcon={<CancelIcon />}
                          onClick={() => setEditMode(false)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={() => setEditMode(true)}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                  </Stack>
                )}
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  {renderTextField("Bank Account Name", "bank_account_name")}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField("Bank Name", "bank_name")}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField("Branch Name", "branch_name")}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField("Account Number", "account_number")}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField("IFSC Code", "ifsc_code")}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField("Credit Limit", "credit_limit")}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField("Payment Terms (Days)", "payment_terms_days")}
                </Grid>
                {renderFileUpload("Cancelled Cheque", "cancelled_cheque")}
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        {/* TAB 3: DISTRIBUTION CAPABILITY */}
        <TabPanel value={activeTab} index={3}>
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
                {!createDistributorFlag && (
                  <Stack direction="row" spacing={1}>
                    {editMode ? (
                      <>
                        <CommonButton
                          variant="contained"
                          startIcon={<SaveIcon />}
                          onClick={handleSave}
                          disabled={loading}
                        >
                          Save
                        </CommonButton>
                        <Button
                          variant="outlined"
                          startIcon={<CancelIcon />}
                          onClick={() => setEditMode(false)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={() => setEditMode(true)}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                  </Stack>
                )}
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  {renderTextField("Warehouse Available", "warehouse_available")}
                </Grid>
                <Grid item xs={12}>
                  {renderTextField("Warehouse Address", "warehouse_address")}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField("Storage Area (Sq Ft)", "storage_area_sqft", "tel", {
                    inputProps: {
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                    },
                  })}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField("Logistics Partner", "logistics_partner")}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField("Monthly Distribution Capacity", "monthly_distribution_capacity", "tel", {
                    inputProps: {
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                    },
                  })}
                </Grid>
                <Grid item xs={12}>
                  {renderTextField("Service Cities", "service_cities")}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        {/* TAB 4: BUSINESS & LEGAL */}
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
                {!createDistributorFlag && (
                  <Stack direction="row" spacing={1}>
                    {editMode ? (
                      <>
                        <CommonButton
                          variant="contained"
                          startIcon={<SaveIcon />}
                          onClick={handleSave}
                          disabled={loading}
                        >
                          Save
                        </CommonButton>
                        <Button
                          variant="outlined"
                          startIcon={<CancelIcon />}
                          onClick={() => setEditMode(false)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={() => setEditMode(true)}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                  </Stack>
                )}
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  {renderTextField("Business Type", "business_type")}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField("Years in Business", "years_in_business", "tel", {
                    inputProps: {
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                    },
                  })}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField("GST Number", "gst_number")}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField("PAN Number", "pan_number")}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField("CIN / LLPIN", "cin_llpin")}
                </Grid>
                {renderFileUpload("GST Certificate", "gst_certificate")}
                {renderFileUpload("PAN Card Copy", "pan_card_copy")}
                {renderFileUpload("Incorporation Certificate", "incorporation_certificate")}
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        {/* TAB 5: KYC – INDIVIDUAL */}
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
                {!createDistributorFlag && (
                  <Stack direction="row" spacing={1}>
                    {editMode ? (
                      <>
                        <CommonButton
                          variant="contained"
                          startIcon={<SaveIcon />}
                          onClick={handleSave}
                          disabled={loading}
                        >
                          Save
                        </CommonButton>
                        <Button
                          variant="outlined"
                          startIcon={<CancelIcon />}
                          onClick={() => setEditMode(false)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={() => setEditMode(true)}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                  </Stack>
                )}
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  {renderTextField("Owner DOB", "owner_dob", "date", {
                    InputLabelProps: { shrink: true },
                  })}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField("Aadhaar Number", "aadhaar_number")}
                </Grid>
                {renderFileUpload("Aadhaar Front", "aadhaar_front")}
                {renderFileUpload("Aadhaar Back", "aadhaar_back")}
                {renderFileUpload("Owner Photo", "owner_photo")}
                {renderFileUpload("Address Proof", "address_proof")}
                {renderFileUpload("Address Proof Copy", "address_proof_copy")}
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        {/* TAB 6: KYC – COMPANY */}
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
                {!createDistributorFlag && (
                  <Stack direction="row" spacing={1}>
                    {editMode ? (
                      <>
                        <CommonButton
                          variant="contained"
                          startIcon={<SaveIcon />}
                          onClick={handleSave}
                          disabled={loading}
                        >
                          Save
                        </CommonButton>
                        <Button
                          variant="outlined"
                          startIcon={<CancelIcon />}
                          onClick={() => setEditMode(false)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={() => setEditMode(true)}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                  </Stack>
                )}
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  {renderTextField("Authorized Signatory Name", "authorized_signatory_name")}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField("Signatory PAN", "signatory_pan")}
                </Grid>
                {renderFileUpload("Signatory PAN Copy", "signatory_pan_copy")}
                {renderFileUpload("Board Resolution", "board_resolution")}
                {renderFileUpload("Partnership Deed", "partnership_deed")}
                {renderFileUpload("LLP Agreement", "llp_agreement")}
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        {/* TAB 7: COMPLIANCE */}
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
                {!createDistributorFlag && (
                  <Stack direction="row" spacing={1}>
                    {editMode ? (
                      <>
                        <CommonButton
                          variant="contained"
                          startIcon={<SaveIcon />}
                          onClick={handleSave}
                          disabled={loading}
                        >
                          Save
                        </CommonButton>
                        <Button
                          variant="outlined"
                          startIcon={<CancelIcon />}
                          onClick={() => setEditMode(false)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={() => setEditMode(true)}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                  </Stack>
                )}
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  {createDistributorFlag ? (
                    <TextField
                      fullWidth
                      label="Agreement Signed"
                      value={newDistributorForm.agreement_signed ? "Yes" : "No"}
                      onChange={(e) =>
                        setNewDistributorForm({
                          ...newDistributorForm,
                          agreement_signed: e.target.value === "Yes",
                        })
                      }
                    />
                  ) : (
                    <InfoRow
                      label="Agreement Signed"
                      value={selectedDistributor.agreement_signed ? "Yes" : "No"}
                    />
                  )}
                </Grid>
                {renderFileUpload("Agreement Copy", "agreement_copy")}
                <Grid item xs={12} sm={6}>
                  {!createDistributorFlag && (
                    <InfoRow
                      label="KYC Status"
                      value={selectedDistributor.kyc_verified ? "Verified" : "Pending"}
                    />
                  )}
                </Grid>
                <Grid item xs={12}>
                  {renderTextField("KYC Verified By", "kyc_verified_by")}
                </Grid>
                <Grid item xs={12}>
                  {renderTextField("Remarks", "remarks", "text", {
                    multiline: true,
                    minRows: 2,
                  })}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>
      </Box>

      {/* Submit Button for Create Mode */}
      {createDistributorFlag && (
        <Box sx={{ p: 3, pt: 0 }}>
          <CommonButton
            variant="contained"
            size="large"
            // fullWidth
            onClick={handleCreateDistributor}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Distributor"}
          </CommonButton>
        </Box>
      )}

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
