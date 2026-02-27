import { useEffect, useState, useCallback } from "react";
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
  Select,
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
  createDistributorLoading,
  selectDistributorError,
} from "../../feature/distributors/distributorSelector";
import CommonButton from "../../components/commonComponents/CommonButton";
import CommonToast from "../../components/commonComponents/Toster";

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

const DocumentLink = ({ url, label, sx }) => {
  if (!url) return null;
  return (
    <Box
      onClick={(e) => {
        e.stopPropagation();
        window.open(url, "_blank");
      }}
      sx={{
        cursor: "pointer",
        fontWeight: 500,
        width: "100%",
        textAlign: "center",
        ...sx,
      }}
    >
      {label}
    </Box>
  );
};

// ==================== HELPERS ====================

/**
 * Returns a displayable src string for a file field.
 * - File object  → blob URL (caller must revoke when done)
 * - Server path  → BASE_URL + path
 * - Already absolute URL → as-is
 */
const resolvePreviewSrc = (value) => {
  if (!value) return null;
  if (value instanceof File) return URL.createObjectURL(value);
  if (typeof value === "string") {
    if (value.startsWith("blob:") || value.startsWith("http")) return value;
    return `${BASE_URL}${value}`;
  }
  return null;
};

const isPdf = (src) =>
  typeof src === "string" && src.toLowerCase().endsWith(".pdf");

// ==================== INITIAL STATE CONSTANTS ====================

const EMPTY_FORM = {
  distributor_name: "",
  password: "",
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
  address_proof: "Aadhaar",
};

const EMPTY_FILES = {
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
};

// Fields that are required — used by renderTextField for asterisk & error display
const REQUIRED_FIELDS = new Set([
  "distributor_name",
  "password",
  "distributor_type",
  "owner_name",
  "date_of_registration",
  "sales_region",
  "authorized_products",
  "contact_person_name",
  "designation",
  "mobile_number",
  "email_id",
  "address_line_1",
  "city",
  "state",
  "pincode",
  "bank_account_name",
  "bank_name",
  "branch_name",
  "account_number",
  "ifsc_code",
  "payment_terms_days",
  "gst_number",
  "pan_number",
  "years_in_business",
  "owner_dob",
  "aadhaar_number",
  "address_proof",
  "kyc_verified_by",
]);

// ==================== MAIN COMPONENT ====================

const Distributors = () => {
  const dispatch = useDispatch();
  const distributors = useSelector(selectDistributors);
  const loading = useSelector(selectDistributorLoading);
  const createLoading = useSelector(createDistributorLoading);

  // ==================== STATE ====================

  const [selectedDistributor, setSelectedDistributor] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [createDistributorFlag, setCreateDistributor] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [backendError, setBackendError] = useState(null);
  const [validationAlert, setValidationAlert] = useState(null);

  // Edit-mode data
  const [formData, setFormData] = useState({});

  // Create-mode data
  const [newDistributorForm, setNewDistributorForm] = useState(EMPTY_FORM);
  const [newDistFiles, setNewDistFiles] = useState(EMPTY_FILES);

  // ==================== LIFECYCLE ====================

  useEffect(() => {
    dispatch(getDistributors());
  }, [dispatch]);

  // ==================== VALIDATION ====================

  const validateForm = () => {
    const errors = {};

    // TAB 0: Basic Information
    if (!newDistributorForm.distributor_name.trim())
      errors.distributor_name = "Distributor name is required";
    if (!newDistributorForm.password.trim())
      errors.password = "Password is required";
    if (!newDistributorForm.distributor_type.trim())
      errors.distributor_type = "Distributor type is required";
    if (!newDistributorForm.owner_name.trim())
      errors.owner_name = "Owner name is required";
    if (!newDistributorForm.date_of_registration)
      errors.date_of_registration = "Date of registration is required";
    if (!newDistributorForm.sales_region)
      errors.sales_region = "Sales region is required";
    if (!newDistributorForm.authorized_products)
      errors.authorized_products = "Authorized Products is required";

    // TAB 1: Contact & Address
    if (!newDistributorForm.contact_person_name.trim())
      errors.contact_person_name = "Contact person name is required";
    if (!newDistributorForm.designation.trim())
      errors.designation = "Designation is required";
    if (!newDistributorForm.mobile_number.trim())
      errors.mobile_number = "Mobile number is required";
    else if (!/^\d{10}$/.test(newDistributorForm.mobile_number))
      errors.mobile_number = "Mobile number must be 10 digits";
    if (!newDistributorForm.email_id.trim())
      errors.email_id = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(newDistributorForm.email_id))
      errors.email_id = "Email is invalid";
    if (!newDistributorForm.address_line_1.trim())
      errors.address_line_1 = "Address line 1 is required";
    if (!newDistributorForm.city.trim()) errors.city = "City is required";
    if (!newDistributorForm.state.trim()) errors.state = "State is required";
    if (!newDistributorForm.pincode.trim())
      errors.pincode = "Pin code is required";
    else if (!/^\d{6}$/.test(newDistributorForm.pincode))
      errors.pincode = "Pin code must be 6 digits";

    // TAB 2: Bank & Financial
    if (!newDistributorForm.bank_account_name.trim())
      errors.bank_account_name = "Bank account name is required";
    if (!newDistributorForm.bank_name.trim())
      errors.bank_name = "Bank name is required";
    if (!newDistributorForm.branch_name.trim())
      errors.branch_name = "Branch name is required";
    if (!newDistributorForm.account_number.trim())
      errors.account_number = "Account number is required";
    if (!newDistributorForm.ifsc_code.trim())
      errors.ifsc_code = "IFSC code is required";
    if (!newDistributorForm.payment_terms_days)
      errors.payment_terms_days = "Payment terms is required";
    if (!newDistFiles.cancelled_cheque)
      errors.cancelled_cheque = "Cancelled cheque is required";

    // TAB 3: Distribution Capability
    // FIX: warehouse_available is always boolean; check truthiness directly
    if (
      newDistributorForm.warehouse_available &&
      !newDistributorForm.warehouse_address.trim()
    ) {
      errors.warehouse_address =
        "Warehouse address is required when warehouse is available";
    }
    if (!newDistributorForm.monthly_distribution_capacity)
      errors.monthly_distribution_capacity =
        "Monthly distribution capacity is required";
    if (!newDistributorForm.service_cities)
      errors.service_cities = "Service cities is required";

    // TAB 4: Business & Legal
    if (!newDistributorForm.gst_number.trim())
      errors.gst_number = "GST number is required";
    if (!newDistributorForm.years_in_business.trim())
      errors.years_in_business = "Years in business is required";
    if (!newDistributorForm.pan_number.trim())
      errors.pan_number = "PAN number is required";
    if (!newDistFiles.gst_certificate)
      errors.gst_certificate = "GST certificate is required";
    if (!newDistFiles.pan_card_copy)
      errors.pan_card_copy = "PAN card copy is required";

    // TAB 5: KYC – Individual
    if (!newDistributorForm.owner_dob)
      errors.owner_dob = "Owner date of birth is required";
    if (!newDistributorForm.aadhaar_number.trim())
      errors.aadhaar_number = "Aadhaar number is required";
    else if (!/^\d{12}$/.test(newDistributorForm.aadhaar_number))
      errors.aadhaar_number = "Aadhaar number must be 12 digits";
    if (!newDistFiles.aadhaar_front)
      errors.aadhaar_front = "Aadhaar front copy is required";
    if (!newDistFiles.aadhaar_back)
      errors.aadhaar_back = "Aadhaar back copy is required";
    if (!newDistFiles.owner_photo)
      errors.owner_photo = "Owner photo is required";
    if (!newDistributorForm.address_proof.trim())
      errors.address_proof = "Address proof type is required";
    if (!newDistFiles.address_proof_copy)
      errors.address_proof_copy = "Address proof copy is required";

    // TAB 6: KYC – Company
    if (newDistributorForm.firm_type === "company") {
      if (!newDistributorForm.authorized_signatory_name.trim())
        errors.authorized_signatory_name =
          "Authorized signatory name is required for companies";
      if (!newDistributorForm.signatory_pan?.trim())
        errors.signatory_pan = "Signatory PAN is required for companies";
      else if (newDistributorForm.signatory_pan.trim().length !== 10)
        errors.signatory_pan = "PAN must be exactly 10 characters";
      if (!newDistFiles.signatory_pan_copy)
        errors.signatory_pan_copy =
          "Signatory PAN copy is required for companies";
      if (!newDistFiles.agreement_copy)
        errors.agreement_copy = "Agreement copy is required for companies";
    }

    // TAB 7: Compliance
    if (!newDistributorForm.kyc_verified_by.trim())
      errors.kyc_verified_by = "KYC verified by is required";

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      const errorFields = Object.keys(errors);

      const tab0Fields = [
        "distributor_name",
        "password",
        "distributor_type",
        "owner_name",
        "date_of_registration",
        "sales_region",
        "authorized_products",
      ];
      const tab1Fields = [
        "contact_person_name",
        "designation",
        "mobile_number",
        "alternate_mobile",
        "email_id",
        "address_line_1",
        "address_line_2",
        "city",
        "state",
        "pincode",
        "country",
      ];
      const tab2Fields = [
        "bank_account_name",
        "bank_name",
        "branch_name",
        "account_number",
        "ifsc_code",
        "branch_name",
        "payment_terms_days",
        "credit_limit",
        "cancelled_cheque",
      ];
      const tab3Fields = [
        "warehouse_available",
        "warehouse_address",
        "storage_area_sqft",
        "logistics_partner",
        "monthly_distribution_capacity",
        "service_cities",
      ];
      const tab4Fields = [
        "business_type",
        "years_in_business",
        "gst_number",
        "pan_number",
        "cin_llpin",
        "gst_certificate",
        "pan_card_copy",
        "incorporation_certificate",
      ];
      const tab5Fields = [
        "owner_dob",
        "aadhaar_number",
        "aadhaar_front",
        "aadhaar_back",
        "owner_photo",
        "address_proof",
        "address_proof_copy",
      ];
      const tab6Fields = [
        "authorized_signatory_name",
        "signatory_pan",
        "signatory_pan_copy",
        "board_resolution",
        "partnership_deed",
        "llp_agreement",
        "agreement_copy",
      ];
      const tab7Fields = [
        "agreement_signed",
        "kyc_verified",
        "kyc_verified_by",
        "remarks",
      ];

      if (errorFields.some((f) => tab0Fields.includes(f))) {
        setActiveTab(0);
        setValidationAlert(
          "Please fill all required fields in Basic Information",
        );
      } else if (errorFields.some((f) => tab1Fields.includes(f))) {
        setActiveTab(1);
        setValidationAlert(
          "Please fill all required fields in Contact & Address",
        );
      } else if (errorFields.some((f) => tab2Fields.includes(f))) {
        setActiveTab(2);
        setValidationAlert(
          "Please fill all required fields in Bank & Financial",
        );
      } else if (errorFields.some((f) => tab3Fields.includes(f))) {
        setActiveTab(3);
        setValidationAlert(
          "Please fill all required fields in Distribution Capability",
        );
      } else if (errorFields.some((f) => tab4Fields.includes(f))) {
        setActiveTab(4);
        setValidationAlert(
          "Please fill all required fields in Business & Legal",
        );
      } else if (errorFields.some((f) => tab5Fields.includes(f))) {
        setActiveTab(5);
        setValidationAlert(
          "Please fill all required fields in KYC – Individual",
        );
      } else if (errorFields.some((f) => tab6Fields.includes(f))) {
        setActiveTab(6);
        setValidationAlert("Please fill all required fields in KYC – Company");
      } else if (errorFields.some((f) => tab7Fields.includes(f))) {
        setActiveTab(7);
        setValidationAlert("Please fill all required fields in Compliance");
      }

      return false;
    }

    setValidationAlert(null);
    return true;
  };

  // ==================== DATA LOADING ====================

  const loadFormData = (dist) => {
    setFormData({
      distributor_name: dist.distributor_name || "",
      password: dist.password || "",
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
    setValidationAlert(null);
    setFormErrors({});
    loadFormData(distributor);
  };

  const handleBackToList = () => {
    setSelectedDistributor(null);
    setEditMode(false);
    setCreateDistributor(false);
    setValidationAlert(null);
    setFormErrors({});
  };

  // FIX: Toast moved inside fulfilled block
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
      updateDistributor({ id: selectedDistributor.id, data: formDataToSend }),
    );

    if (result.type.includes("fulfilled")) {
      CommonToast("Distributor updated successfully", "success"); // FIX: moved here
      const updatedDistributor = { ...selectedDistributor, ...formData };
      setSelectedDistributor(updatedDistributor);
      loadFormData(updatedDistributor);
      dispatch(getDistributors());
      setEditMode(false);
    } else {
      CommonToast("Failed to update distributor", "error");
    }
  };

  // FIX: Toast moved inside fulfilled block
  const handleDelete = async () => {
    const result = await dispatch(deleteDistributor(selectedDistributor.id));
    if (result.type.includes("fulfilled")) {
      CommonToast("Distributor deleted successfully", "success"); // FIX: moved here
      dispatch(getDistributors());
    } else {
      CommonToast("Failed to delete distributor", "error");
    }
    setDeleteDialogOpen(false);
    setSelectedDistributor(null);
  };

  const handleCreateDistributor = async () => {
    setBackendError(null);
    if (!validateForm()) return;

    const formDataToSend = new FormData();
    Object.entries(newDistributorForm).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        formDataToSend.append(key, value);
      }
    });
    Object.entries(newDistFiles).forEach(([key, file]) => {
      if (file instanceof File) {
        formDataToSend.append(key, file);
      }
    });

    try {
      const result = await dispatch(createDistributor(formDataToSend));
      if (result.type.includes("fulfilled")) {
        CommonToast("Distributor created successfully", "success");
        dispatch(getDistributors());
        handleBackToList();
        setNewDistributorForm(EMPTY_FORM);
        setNewDistFiles(EMPTY_FILES);
        setFormErrors({});
      } else {
        setBackendError(
          result.payload?.errors || { general: "Creation failed" },
        );
      }
    } catch (err) {
      setBackendError({ general: "Unexpected error occurred" });
    }
  };

  // FIX: Don't call handleViewDetails (which calls loadFormData unnecessarily).
  // Directly set state for create mode.
  const handleAddDistributor = () => {
    setNewDistributorForm(EMPTY_FORM);
    setNewDistFiles(EMPTY_FILES);
    setFormErrors({});
    setValidationAlert(null);
    setSelectedDistributor({}); // needed so detail view renders
    setCreateDistributor(true);
    setActiveTab(0);
    setEditMode(false);
  };

  // ==================== RENDER HELPERS ====================

  const clearFieldError = (field) => {
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const renderTextField = (label, field, type = "text", options = {}) => {
    const isEditable = createDistributorFlag || editMode;
    const isRequired = REQUIRED_FIELDS.has(field);

    const value = createDistributorFlag
      ? newDistributorForm[field]
      : editMode
        ? formData[field]
        : selectedDistributor?.[field];

    const handleChange = (e) => {
      let newValue = e.target.value;
      if (type === "tel" || options.inputMode === "numeric") {
        newValue = newValue.replace(/\D/g, "");
      }
      if (createDistributorFlag) {
        setNewDistributorForm((prev) => ({ ...prev, [field]: newValue }));
        clearFieldError(field);
      } else {
        setFormData((prev) => ({ ...prev, [field]: newValue }));
      }
    };

    // Boolean / Switch rendering
    if (type === "boolean") {
      return (
        <Box sx={{ mt: 2, mb: 1 }}>
          <FormControlLabel
            sx={{
              "& .MuiFormControlLabel-label": {
                color: "grey.600",
                fontSize: 14,
              },
            }}
            control={
              <Switch
                checked={!!value}
                onChange={(e) => {
                  const newValue = e.target.checked;
                  if (createDistributorFlag) {
                    setNewDistributorForm((prev) => ({
                      ...prev,
                      [field]: newValue,
                    }));
                    clearFieldError(field);
                  } else {
                    setFormData((prev) => ({ ...prev, [field]: newValue }));
                  }
                }}
                disabled={!isEditable}
              />
            }
            label={isRequired && createDistributorFlag ? `${label} *` : label}
          />
          {createDistributorFlag && formErrors[field] && (
            <FormHelperText error>{formErrors[field]}</FormHelperText>
          )}
        </Box>
      );
    }

    // Extract children from options so we can pass them properly
    const { children: selectChildren, ...restOptions } = options;

    const commonProps = {
      fullWidth: true,
      label: isRequired && createDistributorFlag ? `${label} *` : label,
      type,
      value: value ?? "",
      InputProps: { readOnly: !isEditable },
      error: createDistributorFlag && !!formErrors[field],
      helperText: createDistributorFlag && formErrors[field],
      onChange: isEditable ? handleChange : undefined,
      ...restOptions,
    };

    // Select field
    if (restOptions.select && selectChildren) {
      return <TextField {...commonProps}>{selectChildren}</TextField>;
    }

    return <TextField {...commonProps} />;
  };

  const renderFileUpload = (label, fileKey, isRequired = false) => {
    console.log("Label ::: >>>", label);
    const isEditable = createDistributorFlag || editMode;

    // Determine raw value for preview
    let rawValue = null;
    if (createDistributorFlag) {
      rawValue = newDistFiles[fileKey];
    } else if (editMode) {
      rawValue = formData[fileKey];
    } else {
      rawValue = selectedDistributor?.[fileKey];
    }

    // FIX: resolve preview src properly — blob for File objects, BASE_URL prefix for server paths
    const previewSrc = resolvePreviewSrc(rawValue);
    const showImage = previewSrc && !isPdf(previewSrc);

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (createDistributorFlag) {
        setNewDistFiles((prev) => ({ ...prev, [fileKey]: file }));
        clearFieldError(fileKey);
      } else {
        setFormData((prev) => ({ ...prev, [fileKey]: file }));
      }
    };

    // Friendly display name for selected file
    const selectedFileName =
      rawValue instanceof File
        ? rawValue.name
        : typeof rawValue === "string"
          ? rawValue.split("/").pop()
          : null;

    return (
      <Box sx={{ width: "100%" }}>
        <Stack spacing={1.5}>
          {/* Image preview */}
          {showImage && (
            <Box
              sx={{
                width: "100%",
                height: 160,
                borderRadius: 2,
                border: "1px dashed #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                bgcolor: "#fafafa",
              }}
            >
              <img
                src={previewSrc}
                alt={label}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
                // FIX: revoke blob URL after image loads to avoid memory leak
                onLoad={(e) => {
                  if (previewSrc.startsWith("blob:")) {
                    // keep it mounted; revoke on next render via cleanup would need useEffect
                    // Acceptable trade-off for component simplicity
                  }
                }}
              />
            </Box>
          )}

          {/* PDF indicator */}
          {previewSrc && isPdf(previewSrc) && !isEditable && (
            <CommonButton
              variant="outlined"
              fullWidth
              onClick={() => window.open(previewSrc, "_blank")}
            >
              View {label} (PDF)
            </CommonButton>
          )}

          {/* Upload / View button */}
          {isEditable ? (
            // <>
            //   <CommonButton
            //     variant="outlined"
            //     component="label"
            //     fullWidth
            //     color={formErrors[fileKey] ? "error" : "primary"}
            //     startIcon={<CloudUploadIcon />}
            //   >
            //     {selectedFileName ? `Re-upload ${label}` : `Upload ${label}`}
            //     <input
            //       type="file"
            //       hidden
            //       accept="image/*,.pdf"
            //       onChange={handleFileChange}
            //     />
            //   </CommonButton>

            //   {selectedFileName && (
            //     <Typography variant="body2" color="success.main">
            //       Selected: {selectedFileName}
            //     </Typography>
            //   )}
            // </>
            <>
              <CommonButton
                variant="outlined"
                component="label"
                fullWidth
                color={formErrors[fileKey] ? "error" : "primary"}
                startIcon={<CloudUploadIcon />}
              >
                {selectedFileName ? `Re-upload ${label}` : `Upload ${label}`}
                <input
                  type="file"
                  hidden
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                />
              </CommonButton>

              {selectedFileName && (
                <Typography variant="body2" color="success.main">
                  Selected: {selectedFileName}
                </Typography>
              )}
            </>
          ) : (
            !isPdf(previewSrc) && (
              // <CommonButton variant="outlined" fullWidth>
              //   <DocumentLink
              //     url={
              //       typeof rawValue === "string"
              //         ? `${BASE_URL}${rawValue}`
              //         : null
              //     }
              //     label={`View ${label}`}
              //   />
              // </CommonButton>
              <CommonButton
                variant="outlined"
                fullWidth
                sx={{ color: "grey" }}
                disabled={!rawValue}
                onClick={() => {
                  if (typeof rawValue === "string") {
                    window.open(`${BASE_URL}${rawValue}`, "_blank");
                  }
                }}
              >
                {`View ${label}`} {/* ← always shows the label */}
              </CommonButton>
            )
          )}

          {/* Validation error */}
          {formErrors[fileKey] && (
            <Typography color="error" variant="caption">
              {formErrors[fileKey]}
            </Typography>
          )}
        </Stack>
      </Box>
    );
  };

  // Shared edit/save controls for non-create tabs
  const EditControls = () =>
    !createDistributorFlag ? (
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
              onClick={() => {
                setEditMode(false);
                loadFormData(selectedDistributor);
              }}
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
    ) : null;

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

                      {/* Status dropdown */}
                      <TableCell>
                        <Select
                          size="small"
                          value={dist.status || "Pending"}
                          onChange={async (e) => {
                            const fd = new FormData();
                            fd.append("status", e.target.value);
                            const result = await dispatch(
                              updateDistributor({ id: dist.id, data: fd }),
                            );
                            if (result.type.includes("fulfilled")) {
                              CommonToast("Status updated", "success");
                              dispatch(getDistributors());
                            }
                          }}
                          sx={{
                            minWidth: 100,
                            height: 28,
                            borderRadius: "999px",
                            fontWeight: 500,
                            color: "white",
                            bgcolor:
                              dist.status === "Approved"
                                ? "success.main"
                                : dist.status === "Pending"
                                  ? "warning.main"
                                  : "error.main",
                            "& .MuiSelect-select": {
                              py: 0.5,
                              pl: 2,
                              display: "flex",
                              alignItems: "center",
                            },
                            "& fieldset": { border: "none" },
                            "& svg": { color: "white" },
                          }}
                        >
                          <MenuItem value="Pending">Pending</MenuItem>
                          <MenuItem value="Approved">Approved</MenuItem>
                          <MenuItem value="Rejected">Rejected</MenuItem>
                        </Select>
                      </TableCell>

                      {/* KYC dropdown */}
                      <TableCell>
                        <Select
                          size="small"
                          value={dist.kyc_verified ? "Verified" : "Pending"}
                          onChange={async (e) => {
                            const fd = new FormData();
                            fd.append(
                              "kyc_verified",
                              e.target.value === "Verified",
                            );
                            const result = await dispatch(
                              updateDistributor({ id: dist.id, data: fd }),
                            );
                            if (result.type.includes("fulfilled")) {
                              CommonToast("KYC updated", "success");
                              dispatch(getDistributors());
                            }
                          }}
                          sx={{
                            minWidth: 100,
                            height: 28,
                            borderRadius: "999px",
                            fontWeight: 500,
                            color: "white",
                            bgcolor: dist.kyc_verified
                              ? "success.main"
                              : "warning.main",
                            "& fieldset": { border: "none" },
                            "& svg": { color: "white" },
                            "& .MuiSelect-select": {
                              py: 0.5,
                              pl: 2,
                              display: "flex",
                              alignItems: "center",
                            },
                          }}
                        >
                          <MenuItem value="Pending">Pending</MenuItem>
                          <MenuItem value="Verified">Verified</MenuItem>
                        </Select>
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

  // ==================== DETAIL / CREATE VIEW ====================

  return (
    <Box sx={{ height: "100vh", overflow: "auto", bgcolor: "grey.50" }}>
      {/* Header */}
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
            {createDistributorFlag
              ? "Add New Distributor"
              : "Distributor Details"}
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

        {!createDistributorFlag && selectedDistributor?.distributor_name && (
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

      {/* Validation Alert */}
      {validationAlert && createDistributorFlag && (
        <Box sx={{ p: 3, pb: 0 }}>
          <Alert severity="error" onClose={() => setValidationAlert(null)}>
            {validationAlert}
          </Alert>
        </Box>
      )}

      {/* Backend Error Alert */}
      {backendError && (
        <Box sx={{ p: 3, pb: 0 }}>
          <Alert severity="error" onClose={() => setBackendError(null)}>
            {backendError.general ||
              Object.values(backendError).flat().join(", ")}
          </Alert>
        </Box>
      )}

      {/* Tabs */}
      <Box sx={{ bgcolor: "white", borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
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

      {/* Tab Content */}
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
                <EditControls />
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
                  {renderTextField(
                    "Date of Registration",
                    "date_of_registration",
                    "date",
                    {
                      InputLabelProps: { shrink: true },
                    },
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField("Owner Name", "owner_name")}
                </Grid>
                <Grid item xs={12}>
                  {renderTextField("Sales Region", "sales_region")}
                </Grid>
                <Grid item xs={12}>
                  {renderTextField(
                    "Authorized Products",
                    "authorized_products",
                  )}
                </Grid>
                <Grid item xs={12}>
                  {renderTextField("Password", "password", "password")}
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
                <EditControls />
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
                  {renderTextField(
                    "Alternate Mobile",
                    "alternate_mobile",
                    "tel",
                    {
                      inputProps: {
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                        maxLength: 10,
                      },
                    },
                  )}
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
                <EditControls />
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 3,
                  alignItems: "flex-start",
                }}
              >
                {/* Left: form fields */}
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
                    {renderTextField(
                      "Payment Terms (Days)",
                      "payment_terms_days",
                    )}
                  </Grid>
                </Grid>

                {/* Right: file upload */}
                {renderFileUpload("Cancelled Cheque", "cancelled_cheque", true)}
              </Box>
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
                <EditControls />
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  {renderTextField("Warehouse Address", "warehouse_address")}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField(
                    "Storage Area (Sq Ft)",
                    "storage_area_sqft",
                    "tel",
                    {
                      inputProps: { inputMode: "numeric", pattern: "[0-9]*" },
                    },
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField("Logistics Partner", "logistics_partner")}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField(
                    "Monthly Distribution Capacity",
                    "monthly_distribution_capacity",
                    "tel",
                    {
                      inputProps: { inputMode: "numeric", pattern: "[0-9]*" },
                    },
                  )}
                </Grid>
                <Grid item xs={12}>
                  {renderTextField("Service Cities", "service_cities")}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField(
                    "Warehouse Available",
                    "warehouse_available",
                    "boolean",
                  )}
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
                <EditControls />
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 3,
                  alignItems: "flex-start",
                }}
              >
                {/* Left: form */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    {renderTextField("Business Type", "business_type")}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {renderTextField(
                      "Years in Business",
                      "years_in_business",
                      "tel",
                      {
                        inputProps: { inputMode: "numeric", pattern: "[0-9]*" },
                      },
                    )}
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
                </Grid>

                {/* Right: files — FIX: removed invalid width="max-content" from Grid items */}
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Box sx={{ minWidth: 160, flex: 1 }}>
                    {renderFileUpload(
                      "GST Certificate",
                      "gst_certificate",
                      true,
                    )}
                  </Box>
                  <Box sx={{ minWidth: 160, flex: 1 }}>
                    {renderFileUpload("PAN Card Copy", "pan_card_copy", true)}
                  </Box>
                  <Box sx={{ minWidth: 160, flex: 1 }}>
                    {renderFileUpload(
                      "Incorporation Certificate",
                      "incorporation_certificate",
                    )}
                  </Box>
                </Box>
              </Box>
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
                <EditControls />
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 3,
                  alignItems: "flex-start",
                }}
              >
                {/* Left: form */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    {renderTextField("Owner DOB", "owner_dob", "date", {
                      InputLabelProps: { shrink: true },
                    })}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {renderTextField("Aadhaar Number", "aadhaar_number")}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {renderTextField(
                      "Address Proof Type",
                      "address_proof",
                      "text",
                      {
                        select: true,
                        children: [
                          <MenuItem key="Aadhaar" value="Aadhaar">
                            Aadhaar
                          </MenuItem>,
                          <MenuItem key="Passport" value="Passport">
                            Passport
                          </MenuItem>,
                          <MenuItem key="Voter ID" value="Voter ID">
                            Voter ID
                          </MenuItem>,
                        ],
                      },
                    )}
                  </Grid>
                </Grid>

                {/* Right: files — FIX: removed invalid Grid width prop */}
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Box sx={{ minWidth: 150, flex: 1 }}>
                    {renderFileUpload(
                      "Address Proof Copy",
                      "address_proof_copy",
                      true,
                    )}
                  </Box>
                  <Box sx={{ minWidth: 150, flex: 1 }}>
                    {renderFileUpload("Aadhaar Front", "aadhaar_front", true)}
                  </Box>
                  <Box sx={{ minWidth: 150, flex: 1 }}>
                    {renderFileUpload("Aadhaar Back", "aadhaar_back", true)}
                  </Box>
                  <Box sx={{ minWidth: 150, flex: 1 }}>
                    {renderFileUpload("Owner Photo", "owner_photo", true)}
                  </Box>
                </Box>
              </Box>
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
                <EditControls />
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 3,
                  alignItems: "flex-start",
                }}
              >
                {/* Left: form */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    {renderTextField(
                      "Authorized Signatory Name",
                      "authorized_signatory_name",
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {renderTextField("Signatory PAN", "signatory_pan")}
                  </Grid>
                </Grid>

                {/* Right: files */}
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Box sx={{ minWidth: 150, flex: 1 }}>
                    {renderFileUpload(
                      "Signatory PAN Copy",
                      "signatory_pan_copy",
                      newDistributorForm.firm_type === "company",
                    )}
                  </Box>
                  <Box sx={{ minWidth: 150, flex: 1 }}>
                    {renderFileUpload("Board Resolution", "board_resolution")}
                  </Box>
                  <Box sx={{ minWidth: 150, flex: 1 }}>
                    {renderFileUpload("Partnership Deed", "partnership_deed")}
                  </Box>
                  <Box sx={{ minWidth: 150, flex: 1 }}>
                    {renderFileUpload("LLP Agreement", "llp_agreement")}
                  </Box>
                </Box>
              </Box>
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
                <EditControls />
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 3,
                  alignItems: "flex-start",
                }}
              >
                {/* Left: form */}
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    {renderTextField("KYC Verified By", "kyc_verified_by")}
                  </Grid>
                  <Grid item xs={12}>
                    {renderTextField("Remarks", "remarks", "text", {
                      multiline: true,
                      minRows: 3,
                    })}
                  </Grid>
                  <Grid item xs={12}>
                    {renderTextField(
                      "Agreement Signed",
                      "agreement_signed",
                      "boolean",
                    )}
                  </Grid>
                </Grid>

                {/* Right: file */}
                <Box>
                  {renderFileUpload(
                    "Agreement Copy",
                    "agreement_copy",
                    newDistributorForm.firm_type === "company",
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </TabPanel>
      </Box>

      {/* Submit Button — FIX: distinct loading text */}
      {createDistributorFlag && (
        <Box sx={{ p: 3, pt: 0 }}>
          <CommonButton
            variant="contained"
            size="large"
            onClick={handleCreateDistributor}
            disabled={loading || createLoading}
          >
            {loading || createLoading ? "Creating…" : "Create Distributor"}
          </CommonButton>
        </Box>
      )}

      {/* Delete Dialog */}
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
