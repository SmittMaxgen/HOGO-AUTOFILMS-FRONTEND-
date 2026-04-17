import { useEffect, useState, useRef } from "react";
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
  Button,
  Stack,
  Avatar,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
  Autocomplete,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import PersonIcon from "@mui/icons-material/Person";
import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../feature/employee/employeeThunks";
import {
  selectEmployees,
  selectEmployeeLoading,
  selectCreateEmployeeLoading,
} from "../../feature/employee/employeeSelector";

import {
  getEmployeeDocuments,
  createEmployeeDocument,
  updateEmployeeDocument,
} from "../../feature/employeeDocuments/employeeDocumentsThunks";
import { selectEmployeeDocuments } from "../../feature/employeeDocuments/employeeDocumentsSelector";

import {
  getEmployeePersonalDetails,
  createEmployeePersonalDetails,
  updateEmployeePersonalDetails,
} from "../../feature/employeePersonalDetails/employeePersonalDetailsThunks";
import { selectEmployeePersonalDetails } from "../../feature/employeePersonalDetails/employeePersonalDetailsSelector";

import {
  getEmployeeSalaries,
  createEmployeeSalary,
  updateEmployeeSalary,
} from "../../feature/employeeSalary/employeeSalaryThunks";
import { selectEmployeeSalaries } from "../../feature/employeeSalary/employeeSalarySelector";

import {
  getUsers,
  createUser,
  updateUser,
} from "../../feature/users/userThunks";
import { selectUsers } from "../../feature/users/userSelector";

import { getDepartments } from "../../feature/department/departmentThunks";
import { getRoles } from "../../feature/role/roleThunks";
import {
  selectDepartmentList,
  selectDepartmentLoading,
} from "../../feature/department/departmentSelector";
import {
  selectRoleList,
  selectRoleLoading,
} from "../../feature/role/roleSelector";

import CommonButton from "../../components/commonComponents/CommonButton";
import CommonToast from "../../components/commonComponents/Toster";

import LeaveBalanceModule from "../Leavebalance/Leavebalance";
import AttendanceModule from "../EmployeeAttendance/EmployeeAttendance";
import SalaryPayment from "../salaryPayment/salaryPayment";

// ─── Constants ────────────────────────────────────────────────────────────────
const BASE_URL = "https://hogofilm.pythonanywhere.com";

const fieldSx = {
  "& .MuiOutlinedInput-root.Mui-focused fieldset": { borderColor: "#D20000" },
  "& label.Mui-focused": { color: "#D20000" },
};

const STATUS_CHIP = {
  Active: { bgcolor: "#e8f5e9", color: "#2e7d32", border: "1px solid #c8e6c9" },
  Inactive: {
    bgcolor: "#f5f5f5",
    color: "#757575",
    border: "1px solid #e0e0e0",
  },
};

const EMPTY_FORM = {
  first_name: "",
  last_name: "",
  name: "",
  email: "",
  phone: "",
  password: "",
  employee_code: "",
  department: "",
  role: "",
  department_id: null,
  designation: "",
  employment_type: "",
  role_id: null,
  joining_date: "",
  date_of_birth: "",
  gender: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  emergency_contact_name: "",
  emergency_contact_phone: "",
  status: "Active",
  gross_salary: "",
  basic_salary: "",
  bank_account_number: "",
  ifsc_code: "",
  pan_number: "",
  aadhaar_number: "",
};

const EMPTY_DOCS = {
  document_type: "",
  pancard_number: "",
  aadhar_number: "",
  driving_license_number: "",
  aadhar_front: null,
  aadhar_back: null,
  pan_card: null,
  photo: null,
  driving_license_front: null,
  driving_license_back: null,
  remarks: "",
};

const EMPTY_PERSONAL = {
  father_name: "",
  mother_name: "",
  marital_status: "",
  spouse_name: "",
  blood_group: "",
  nationality: "",
  religion: "",
  caste: "",
  identification_marks: "",
  hobbies: "",
};

const EMPTY_SALARY = {
  gross_salary: "",
  basic_salary: "",
  hra: "",
  da: "",
  ta: "",
  medical_allowance: "",
  alloances: "",
  deductions: "",
  provident_fund: "",
  professional_tax: "",
  income_tax: "",
  effective_from: "",
  remarks: "",
};

const EMPTY_USER = {
  username: "",
  password: "",
  is_active: true,
  is_superuser: false,
  role_id: null,
  role: "",
};

const REQUIRED_EMPLOYEE_FIELDS = new Set([
  "first_name",
  "last_name",
  "email",
  "phone",
  "password",
  "employee_code",
  "department_id",
  "role_id",
  "employment_type",
  "joining_date",
  "date_of_birth",
  "gender",
]);

// ─── Shared helper components (defined OUTSIDE to avoid remount/focus-loss) ───

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

const TabPanel = ({ children, value, index }) =>
  value !== index ? null : <Box pt={3}>{children}</Box>;

const DocumentCard = ({ label, fileKey, src, isEditable, onFileChange }) => {
  const isImage = src && !src.toLowerCase().endsWith(".pdf");
  return (
    <Box
      sx={{
        border: "1px dashed #D20000",
        borderRadius: 2,
        p: 1.5,
        bgcolor: "#fafafa",
      }}
    >
      <Typography
        variant="caption"
        fontWeight={700}
        color="#424242"
        display="block"
        mb={1}
      >
        {label}
      </Typography>
      {src && isImage ? (
        <Box
          sx={{
            width: "100%",
            height: 130,
            borderRadius: 1,
            overflow: "hidden",
            mb: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#fff",
          }}
        >
          <img
            src={src}
            alt={label}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            height: 130,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "text.disabled",
            bgcolor: "#f5f5f5",
            borderRadius: 1,
            mb: 1,
          }}
        >
          <Typography variant="caption">
            {src ? "PDF Document" : "Not uploaded"}
          </Typography>
        </Box>
      )}
      {isEditable && (
        <Button
          component="label"
          variant="outlined"
          fullWidth
          size="small"
          sx={{
            borderColor: "#D20000",
            color: "#D20000",
            "&:hover": { bgcolor: "#fff5f5" },
            fontWeight: 600,
            textTransform: "none",
            borderRadius: 1.5,
          }}
        >
          {src ? "Replace" : "Upload"}
          <input
            hidden
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => onFileChange(fileKey, e.target.files[0])}
          />
        </Button>
      )}
    </Box>
  );
};

// Field keeps the label + validation logic consistent across form tabs
const Field = ({
  label,
  field,
  type = "text",
  options = {},
  formData,
  formErrors,
  isEditable,
  setFormData,
  setFormErrors,
}) => {
  const required = REQUIRED_EMPLOYEE_FIELDS.has(field);
  const { children: selectChildren, ...rest } = options;
  const props = {
    fullWidth: true,
    label: required && isEditable ? `${label} *` : label,
    type,
    value: formData[field] ?? "",
    sx: fieldSx,
    InputProps: { readOnly: !isEditable },
    error: isEditable && !!formErrors[field],
    helperText: isEditable ? formErrors[field] : undefined,
    onChange: isEditable
      ? (e) => {
          let v = e.target.value;
          if (type === "tel") v = v.replace(/\D/g, "");
          setFormData((p) => ({ ...p, [field]: v }));
          if (formErrors[field])
            setFormErrors((p) => ({ ...p, [field]: undefined }));
        }
      : undefined,
    ...rest,
  };
  if (rest.select && selectChildren)
    return <TextField {...props}>{selectChildren}</TextField>;
  return <TextField {...props} />;
};

// ─── Main Component ───────────────────────────────────────────────────────────
const EmployeeManagement = () => {
  const dispatch = useDispatch();

  // ── Redux selectors ────────────────────────────────────────────────────────
  const employees = useSelector(selectEmployees);
  const loading = useSelector(selectEmployeeLoading);
  const createLoading = useSelector(selectCreateEmployeeLoading);
  const rawDocs = useSelector(selectEmployeeDocuments);
  const rawPersonal = useSelector(selectEmployeePersonalDetails);
  const rawSalaries = useSelector(selectEmployeeSalaries);
  const rawUsers = useSelector(selectUsers);
  const departments = useSelector(selectDepartmentList);
  const roles = useSelector(selectRoleList);
  const deptLoading = useSelector(selectDepartmentLoading);
  const rolesLoading = useSelector(selectRoleLoading);

  // Normalize to arrays once
  const docsArray = Array.isArray(rawDocs) ? rawDocs : [];
  const personalArray = Array.isArray(rawPersonal) ? rawPersonal : [];
  const salaryArray = Array.isArray(rawSalaries)
    ? rawSalaries
    : rawSalaries
      ? [rawSalaries]
      : [];
  const usersArray = Array.isArray(rawUsers)
    ? rawUsers
    : rawUsers
      ? [rawUsers]
      : [];

  // ── UI state ───────────────────────────────────────────────────────────────
  const [viewMode, setViewMode] = useState("list"); // list | view | edit | create
  const [activeTab, setActiveTab] = useState(0);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [validationAlert, setValidationAlert] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // ── Form data state ────────────────────────────────────────────────────────
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [documentFormData, setDocumentFormData] = useState({ ...EMPTY_DOCS });
  const [personalDetailsFormData, setPersonalDetailsFormData] = useState({
    ...EMPTY_PERSONAL,
  });
  const [salaryFormData, setSalaryFormData] = useState({ ...EMPTY_SALARY });
  const [userFormData, setUserFormData] = useState({ ...EMPTY_USER });

  // ── Existing record references (null = needs POST, object = has id → PATCH) ─
  const [editingDoc, setEditingDoc] = useState(null);
  const [editingPersonalDetails, setEditingPersonalDetails] = useState(null);
  const [editingSalary, setEditingSalary] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  // Modified flags — only save sub-sections that the user actually touched
  const [modifiedPersonal, setModifiedPersonal] = useState(false);
  const [modifiedSalary, setModifiedSalary] = useState(false);

  /**
   * KEY FIX: Track which employee's sub-data is currently being fetched.
   * This prevents stale Redux data from populating the wrong employee's forms.
   */
  const fetchingForRef = useRef(null);

  // ── Initial master-data load ───────────────────────────────────────────────
  useEffect(() => {
    dispatch(getEmployees());
    dispatch(getDepartments());
    dispatch(getRoles());
  }, [dispatch]);

  /**
   * Fetch sub-data whenever the active employee changes.
   * We IMMEDIATELY reset all sub-forms here so the UI never shows
   * the previous employee's data while the new fetch is in-flight.
   */
  useEffect(() => {
    if (!selectedEmployee || viewMode === "create" || viewMode === "list")
      return;

    // 1. Mark which employee we are fetching for (used as guard below)
    fetchingForRef.current = selectedEmployee.id;

    // 2. Immediately wipe sub-forms so old data doesn't flash
    setDocumentFormData({ ...EMPTY_DOCS });
    setPersonalDetailsFormData({ ...EMPTY_PERSONAL });
    setSalaryFormData({ ...EMPTY_SALARY });
    setUserFormData({ ...EMPTY_USER });
    setEditingDoc(null);
    setEditingPersonalDetails(null);
    setEditingSalary(null);
    setEditingUser(null);
    setModifiedPersonal(false);
    setModifiedSalary(false);

    // 3. Dispatch fetches
    dispatch(getEmployeeDocuments({ employee_id: selectedEmployee.id }));
    dispatch(getEmployeePersonalDetails({ employee_id: selectedEmployee.id }));
    dispatch(getEmployeeSalaries({ employee_id: selectedEmployee.id }));
    dispatch(getUsers({ employee_id: selectedEmployee.id }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEmployee?.id, dispatch]);

  /**
   * Populate sub-forms once Redux store updates after a fetch.
   * Guard: only run if the data in store is for the currently active employee.
   */
  useEffect(() => {
    if (!selectedEmployee || viewMode === "create") return;
    // Stale-data guard: abort if the fetch in-flight is not for this employee
    if (fetchingForRef.current !== selectedEmployee.id) return;

    const empId = selectedEmployee.id;

    // Personal Details
    if (personalArray.length > 0) {
      const pd = personalArray[0];
      // Skip if this record belongs to a different employee
      if (pd.employee_id && pd.employee_id !== empId) return;
      setPersonalDetailsFormData({
        employee_id: pd.employee_id || empId,
        father_name: pd.father_name || "",
        mother_name: pd.mother_name || "",
        marital_status: pd.marital_status || "",
        spouse_name: pd.spouse_name || "",
        blood_group: pd.blood_group || "",
        nationality: pd.nationality || "",
        religion: pd.religion || "",
        caste: pd.caste || "",
        identification_marks: pd.identification_marks || "",
        hobbies: pd.hobbies || "",
      });
      setEditingPersonalDetails(pd);
    }

    // Salary
    if (salaryArray.length > 0) {
      const s = salaryArray[0];
      if (empId && s.employee_id && s.employee_id !== empId) return;
      setSalaryFormData({
        employee_id: s.employee_id || empId,
        gross_salary: s.gross_salary || "",
        basic_salary: s.basic_salary || "",
        hra: s.hra || "",
        da: s.da || "",
        ta: s.ta || "",
        medical_allowance: s.medical_allowance || "",
        alloances: s.alloances || "",
        deductions: s.deductions || "",
        provident_fund: s.provident_fund || "",
        professional_tax: s.professional_tax || "",
        income_tax: s.income_tax || "",
        effective_from: s.effective_from || "",
        remarks: s.remarks || "",
      });
      setEditingSalary(s);
    }

    // Users
    if (usersArray.length > 0) {
      const u = usersArray[0];
      setUserFormData({
        username: u.username || "",
        password: "", // never pre-fill password
        is_active: u.is_active !== undefined ? u.is_active : true,
        is_superuser: u.is_superuser !== undefined ? u.is_superuser : false,
        role_id: u.role_id || null,
        role: u.role || "",
      });
      setEditingUser(u);
    }

    // Documents
    if (docsArray.length > 0) {
      const doc = docsArray[0];
      if (doc.employee_id && doc.employee_id !== empId) return;
      setDocumentFormData({
        employee_id: doc.employee_id || empId,
        document_type: doc.document_type || "",
        pancard_number: doc.pancard_number || "",
        aadhar_number: doc.aadhar_number || "",
        driving_license_number: doc.driving_license_number || "",
        aadhar_front: doc.aadhar_front || null,
        aadhar_back: doc.aadhar_back || null,
        pan_card: doc.pan_card || null,
        photo: doc.photo || null,
        driving_license_front: doc.driving_license_front || null,
        driving_license_back: doc.driving_license_back || null,
        remarks: doc.remarks || "",
      });
      setEditingDoc(doc);
    }
  }, [
    personalArray,
    docsArray,
    salaryArray,
    usersArray,
    selectedEmployee,
    viewMode,
  ]);

  // ── Validation ─────────────────────────────────────────────────────────────
  const validateForm = () => {
    const errors = {};
    if (!formData.first_name?.trim())
      errors.first_name = "First name is required";
    if (!formData.last_name?.trim()) errors.last_name = "Last name is required";
    if (!formData.email?.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Email is invalid";
    if (!formData.phone?.trim()) errors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone))
      errors.phone = "Phone must be 10 digits";
    if (viewMode === "create" && !formData.password?.trim())
      errors.password = "Password is required";
    if (!formData.employee_code?.trim())
      errors.employee_code = "Employee code is required";
    if (!formData.department_id)
      errors.department_id = "Department is required";
    if (!formData.employment_type)
      errors.employment_type = "Employment type is required";
    if (!formData.role_id) errors.role_id = "Role is required";
    if (!formData.joining_date)
      errors.joining_date = "Date of joining is required";
    if (!formData.date_of_birth)
      errors.date_of_birth = "Date of birth is required";
    if (!formData.gender) errors.gender = "Gender is required";
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      setActiveTab(0);
      setValidationAlert("Please fill all required fields in Employee Profile");
      return false;
    }
    setValidationAlert(null);
    return true;
  };

  // ── Helpers ────────────────────────────────────────────────────────────────
  const loadFormData = (emp) =>
    setFormData({
      first_name: emp.first_name || "",
      last_name: emp.last_name || "",
      name: emp.name || "",
      email: emp.email || "",
      phone: emp.phone || "",
      employee_code: emp.employee_code || "",
      department: emp.department || "",
      role: emp.role || "",
      department_id: emp.department_id || null,
      role_id: emp.role_id || null,
      designation: emp.designation || "",
      employment_type: emp.employment_type || "",
      joining_date: emp.joining_date || "",
      date_of_birth: emp.date_of_birth || "",
      gender: emp.gender || "",
      address: emp.address || "",
      city: emp.city || "",
      state: emp.state || "",
      pincode: emp.pincode || "",
      emergency_contact_name: emp.emergency_contact_name || "",
      emergency_contact_phone: emp.emergency_contact_phone || "",
      status: emp.status || "Active",
      gross_salary: emp.gross_salary || "",
      basic_salary: emp.basic_salary || "",
      bank_account_number: emp.bank_account_number || "",
      ifsc_code: emp.ifsc_code || "",
      pan_number: emp.pan_number || "",
      aadhaar_number: emp.aadhaar_number || "",
      password: "",
    });

  const getDocSrc = (key) => {
    const val = documentFormData[key];
    if (!val) return null;
    if (val instanceof File) {
      try {
        return URL.createObjectURL(val);
      } catch {
        return null;
      }
    }
    if (typeof val === "string") {
      // Ensure the stored data is for the active employee
      if (
        !selectedEmployee ||
        documentFormData.employee_id !== selectedEmployee.id
      )
        return null;
      return val.startsWith("http") ? val : `${BASE_URL}${val}`;
    }
    return null;
  };

  const handleDocFileChange = (key, file) => {
    if (!file) return;
    setDocumentFormData((prev) => ({ ...prev, [key]: file }));
  };

  // ── Navigation handlers ────────────────────────────────────────────────────
  const handleViewDetails = (emp) => {
    // Reset sub-forms immediately before switching
    setDocumentFormData({ ...EMPTY_DOCS });
    setPersonalDetailsFormData({ ...EMPTY_PERSONAL });
    setSalaryFormData({ ...EMPTY_SALARY });
    setUserFormData({ ...EMPTY_USER });
    setEditingDoc(null);
    setEditingPersonalDetails(null);
    setEditingSalary(null);
    setEditingUser(null);
    setModifiedPersonal(false);
    setModifiedSalary(false);
    setFormErrors({});
    setValidationAlert(null);
    setActiveTab(0);
    loadFormData(emp);
    setSelectedEmployee(emp);
    setViewMode("view");
  };

  const handleEditEmployee = () => {
    setViewMode("edit");
    setValidationAlert(null);
  };

  const handleCancelEdit = () => {
    loadFormData(selectedEmployee);
    setViewMode("view");
    setFormErrors({});
    setValidationAlert(null);
    setModifiedPersonal(false);
    setModifiedSalary(false);
  };

  const handleBackToList = () => {
    dispatch(getEmployees());
    setSelectedEmployee(null);
    setViewMode("list");
    setFormData({ ...EMPTY_FORM });
    setValidationAlert(null);
    setFormErrors({});
    fetchingForRef.current = null;
  };

  // ── CRUD handlers ──────────────────────────────────────────────────────────
  const handleCreateEmployee = async () => {
    if (!validateForm()) return;
    const fd = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
      if (v !== null && v !== undefined && v !== "") fd.append(k, v);
    });
    const result = await dispatch(createEmployee(fd));
    if (result.type.includes("fulfilled")) {
      CommonToast("Employee created successfully", "success");
      dispatch(getEmployees());
      handleBackToList();
    } else {
      CommonToast("Failed to create employee", "error");
    }
  };

  const handleSaveEdit = async () => {
    if (!validateForm()) return;
    const fd = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
      if (v !== null && v !== undefined && v !== "") fd.append(k, v);
    });
    const result = await dispatch(
      updateEmployee({ id: selectedEmployee.id, data: fd }),
    );
    if (result.type.includes("fulfilled")) {
      CommonToast("Employee updated successfully", "success");
      const updated = { ...selectedEmployee, ...formData };
      setSelectedEmployee(updated);
      loadFormData(updated);
      dispatch(getEmployees());

      // Save sub-sections that were modified
      if (modifiedPersonal && personalDetailsFormData.marital_status) {
        await handleSavePersonalDetails();
      }
      if (
        modifiedSalary &&
        salaryFormData.basic_salary &&
        salaryFormData.gross_salary &&
        salaryFormData.effective_from
      ) {
        await handleSaveSalary();
      }
      // Always attempt to save user (in case credentials changed)
      await handleSaveUser();

      setModifiedPersonal(false);
      setModifiedSalary(false);
      setViewMode("view");
    } else {
      CommonToast("Failed to update employee", "error");
    }
  };

  const handleDelete = async () => {
    await dispatch(deleteEmployee(selectedEmployee.id));
    CommonToast("Employee deleted successfully", "success");
    dispatch(getEmployees());
    setDeleteOpen(false);
    handleBackToList();
  };

  // ── Document save (POST or PATCH) ──────────────────────────────────────────
  // const handleUploadDocument = async () => {
  //   const fd = new FormData();
  //   fd.append("employee_id", selectedEmployee.id);
  //   [
  //     "document_type",
  //     "pancard_number",
  //     "aadhar_number",
  //     "driving_license_number",
  //     "remarks",
  //   ].forEach((k) => {
  //     if (documentFormData[k]) fd.append(k, documentFormData[k]);
  //   });
  //   [
  //     "aadhar_front",
  //     "aadhar_back",
  //     "pan_card",
  //     "photo",
  //     "driving_license_front",
  //     "driving_license_back",
  //   ].forEach((k) => {
  //     if (documentFormData[k] instanceof File)
  //       fd.append(k, documentFormData[k]);
  //   });

  //   try {
  //     let result;
  //     if (editingDoc?.id) {
  //       result = await dispatch(
  //         updateEmployeeDocument({ id: editingDoc.id, data: fd }),
  //       );
  //       if (result.type.includes("fulfilled")) {
  //         CommonToast("Document updated successfully", "success");
  //         dispatch(getEmployeeDocuments({ employee_id: selectedEmployee.id }));
  //       }
  //     } else {
  //       result = await dispatch(createEmployeeDocument(fd));
  //       if (result.type.includes("fulfilled")) {
  //         CommonToast("Document uploaded successfully", "success");
  //         dispatch(getEmployeeDocuments({ employee_id: selectedEmployee.id }));
  //       }
  //     }
  //     if (!result.type.includes("fulfilled"))
  //       CommonToast("Failed to save document", "error");
  //   } catch {
  //     CommonToast("Failed to save document", "error");
  //   }
  // };

  const validateDocumentForm = () => {
    if (!documentFormData.aadhar_number) {
      return "Aadhar number is required";
    }

    if (!/^\d{12}$/.test(documentFormData.aadhar_number)) {
      return "Aadhar number must be 12 digits";
    }

    if (!documentFormData.pancard_number) {
      return "PAN number is required";
    }

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(documentFormData.pancard_number)) {
      return "Invalid PAN format";
    }

    const requiredFiles = [
      "aadhar_front",
      "aadhar_back",
      "pan_card",
      "photo",
      "driving_license_front",
      "driving_license_back",
    ];

    for (const key of requiredFiles) {
      if (!documentFormData[key]) {
        return `${key.replaceAll("_", " ")} is required`;
      }
    }

    return null;
  };

  const isDocumentFormInvalid =
    !documentFormData.aadhar_number ||
    !/^\d{12}$/.test(documentFormData.aadhar_number) ||
    !documentFormData.pancard_number ||
    !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(documentFormData.pancard_number) ||
    !documentFormData.aadhar_front ||
    !documentFormData.aadhar_back ||
    !documentFormData.pan_card ||
    !documentFormData.photo ||
    !documentFormData.driving_license_front ||
    !documentFormData.driving_license_back;

  const handleUploadDocument = async () => {
    const errorMsg = validateDocumentForm();

    if (errorMsg) {
      CommonToast(errorMsg, "error");
      return;
    }

    const {
      aadhar_number,
      pancard_number,
      aadhar_front,
      aadhar_back,
      pan_card,
      photo,
      driving_license_front,
      driving_license_back,
    } = documentFormData;

    // Required validations
    if (!aadhar_number) {
      CommonToast("Aadhar number is required", "error");
      return;
    }

    if (!/^\d{12}$/.test(aadhar_number)) {
      CommonToast("Aadhar number must be 12 digits", "error");
      return;
    }

    if (!pancard_number) {
      CommonToast("PAN number is required", "error");
      return;
    }

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(pancard_number)) {
      CommonToast("Invalid PAN number format", "error");
      return;
    }

    // File required validations
    if (
      !aadhar_front ||
      !aadhar_back ||
      !pan_card ||
      !photo ||
      !driving_license_front ||
      !driving_license_back
    ) {
      CommonToast("All document files are required", "error");
      return;
    }

    const fd = new FormData();
    fd.append("employee_id", selectedEmployee.id);

    [
      "document_type",
      "pancard_number",
      "aadhar_number",
      "driving_license_number",
      "remarks",
    ].forEach((k) => {
      if (documentFormData[k]) fd.append(k, documentFormData[k]);
    });

    [
      "aadhar_front",
      "aadhar_back",
      "pan_card",
      "photo",
      "driving_license_front",
      "driving_license_back",
    ].forEach((k) => {
      if (documentFormData[k] instanceof File) {
        fd.append(k, documentFormData[k]);
      }
    });

    try {
      let result;

      if (editingDoc?.id) {
        result = await dispatch(
          updateEmployeeDocument({
            id: editingDoc.id,
            data: fd,
          }),
        );

        if (result.type.includes("fulfilled")) {
          CommonToast("Document updated successfully", "success");
          dispatch(getEmployeeDocuments({ employee_id: selectedEmployee.id }));
        }
      } else {
        result = await dispatch(createEmployeeDocument(fd));

        if (result.type.includes("fulfilled")) {
          CommonToast("Document uploaded successfully", "success");
          dispatch(getEmployeeDocuments({ employee_id: selectedEmployee.id }));
        }
      }

      if (!result.type.includes("fulfilled")) {
        CommonToast("Failed to save document", "error");
      }
    } catch {
      CommonToast("Failed to save document", "error");
    }
  };

  // ── Personal Details save (POST or PATCH) ─────────────────────────────────
  const handleSavePersonalDetails = async () => {
    if (!personalDetailsFormData.marital_status) {
      CommonToast("Marital status is required", "error");
      return;
    }
    const data = {
      ...personalDetailsFormData,
      employee_id: selectedEmployee.id,
    };
    try {
      let result;
      if (editingPersonalDetails?.id) {
        // result = await dispatch(
        //   updateEmployeePersonalDetails({
        //     id: editingPersonalDetails.id,
        //     data,
        //   }),
        // );
        result = await dispatch(
          updateEmployeePersonalDetails({
            id: editingPersonalDetails.id,
            data: (({ employee_id, ...rest }) => rest)(personalDetailsFormData),
          }),
        );
      } else {
        result = await dispatch(createEmployeePersonalDetails(data));
      }
      if (result.type.includes("fulfilled")) {
        CommonToast(
          editingPersonalDetails?.id
            ? "Personal details updated"
            : "Personal details created",
          "success",
        );
        dispatch(
          getEmployeePersonalDetails({ employee_id: selectedEmployee.id }),
        );
      } else {
        CommonToast("Failed to save personal details", "error");
      }
    } catch {
      CommonToast("Failed to save personal details", "error");
    }
  };

  // ── Salary save (POST or PATCH) ────────────────────────────────────────────
  const handleSaveSalary = async () => {
    if (
      !salaryFormData.basic_salary ||
      !salaryFormData.gross_salary ||
      !salaryFormData.effective_from
    ) {
      CommonToast(
        "Please fill Gross Salary, Basic Salary, Effective From",
        "error",
      );
      return;
    }
    const data = { ...salaryFormData, employee_id: selectedEmployee.id };
    try {
      let result;
      if (editingSalary?.id) {
        result = await dispatch(
          updateEmployeeSalary({ id: editingSalary.id, data }),
        );
      } else {
        result = await dispatch(createEmployeeSalary(data));
      }
      if (result.type.includes("fulfilled")) {
        CommonToast(
          editingSalary?.id ? "Salary updated" : "Salary created",
          "success",
        );
        dispatch(getEmployeeSalaries({ employee_id: selectedEmployee.id }));
      } else {
        CommonToast("Failed to save salary", "error");
      }
    } catch {
      CommonToast("Failed to save salary", "error");
    }
  };

  // ── User save (POST or PATCH) ──────────────────────────────────────────────
  const handleSaveUser = async () => {
    const data = { ...userFormData, employee_id: selectedEmployee.id };
    // Don't send blank password on update
    if (editingUser && !userFormData.password) delete data.password;
    try {
      let result;
      if (editingUser?.id) {
        result = await dispatch(updateUser({ id: editingUser.id, data }));
      } else {
        result = await dispatch(createUser(data));
      }
      if (result.type.includes("fulfilled")) {
        CommonToast(
          editingUser?.id ? "User updated" : "User created",
          "success",
        );
        dispatch(getUsers({ employee_id: selectedEmployee.id }));
      } else {
        CommonToast("Failed to save user", "error");
      }
    } catch {
      CommonToast("Failed to save user", "error");
    }
  };

  // ── Shared field props ─────────────────────────────────────────────────────
  const isEditable = viewMode === "edit" || viewMode === "create";
  const fieldProps = {
    formData,
    formErrors,
    isEditable,
    setFormData,
    setFormErrors,
  };

  // ── Design helpers ─────────────────────────────────────────────────────────
  const redBtn = {
    bgcolor: "#D20000",
    "&:hover": { bgcolor: "#a80000" },
    fontWeight: 700,
    borderRadius: 1.5,
    textTransform: "none",
    boxShadow: "0 4px 12px rgba(210,0,0,0.3)",
  };
  const ghostBtn = {
    borderColor: "rgba(255,255,255,0.6)",
    color: "#fff",
    "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.1)" },
    fontWeight: 700,
    borderRadius: 1.5,
    textTransform: "none",
  };

  // ── LIST VIEW ──────────────────────────────────────────────────────────────
  if (viewMode === "list") {
    return (
      <Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Box>
            <Box display="flex" alignItems="center" gap={1.5} mb={0.5}>
              <Box
                sx={{
                  width: 5,
                  height: 32,
                  bgcolor: "#D20000",
                  borderRadius: 1,
                }}
              />
              <Typography variant="h5" fontWeight={800} color="#1a1a1a">
                Employee Management
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" ml={2.5}>
              Manage employees, documents, and information
            </Typography>
          </Box>
          <CommonButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setFormData({ ...EMPTY_FORM });
              setSelectedEmployee(null);
              setViewMode("create");
              setActiveTab(0);
              setValidationAlert(null);
              setFormErrors({});
            }}
            sx={redBtn}
          >
            Add Employee
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
          {loading ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              py={8}
              gap={1}
            >
              <CircularProgress size={32} sx={{ color: "#D20000" }} />
              <Typography variant="body2" color="text.secondary">
                Loading employees…
              </Typography>
            </Box>
          ) : (
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
                      "Code",
                      "Name",
                      "Department",
                      "Role",
                      "Phone",
                      "Email",
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
                  {employees?.map((emp, idx) => (
                    <TableRow
                      key={emp.id}
                      hover
                      sx={{
                        "&:hover": { bgcolor: "#fff5f5" },
                        "&:last-child td": { border: 0 },
                        borderBottom: "1px solid #f5f5f5",
                        transition: "background 0.15s",
                      }}
                    >
                      <TableCell
                        sx={{ fontWeight: 700, color: "#D20000", width: 45 }}
                      >
                        {idx + 1}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={emp.employee_code}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: 11,
                            borderRadius: 1,
                            bgcolor: "#f0f4ff",
                            color: "#1565c0",
                            border: "1px solid #d0deff",
                          }}
                        />
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
                            <PersonIcon
                              sx={{ fontSize: 15, color: "#D20000" }}
                            />
                          </Box>
                          <Typography
                            fontWeight={600}
                            fontSize={13}
                            color="#1a1a1a"
                          >
                            {emp.first_name} {emp.last_name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography fontSize={13} color="text.secondary">
                          {emp.department_name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontSize={13} color="text.secondary">
                          {emp.role_name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontSize={13}>{emp.phone}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontSize={13} color="text.secondary">
                          {emp.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={emp.status}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            borderRadius: 1,
                            fontSize: 11,
                            ...(STATUS_CHIP[emp.status] ||
                              STATUS_CHIP.Inactive),
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(emp)}
                          sx={{
                            bgcolor: "#f0f4ff",
                            color: "#1565c0",
                            "&:hover": { bgcolor: "#d0deff" },
                            borderRadius: 1,
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!loading && !employees?.length && (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                          gap={1}
                        >
                          <PersonIcon sx={{ fontSize: 40, color: "#e0e0e0" }} />
                          <Typography color="text.secondary" fontWeight={500}>
                            No employees found
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>
    );
  }

  // ── DETAIL / CREATE / EDIT VIEW ────────────────────────────────────────────
  return (
    <Box sx={{ bgcolor: "#f8f8f8", minHeight: "100vh" }}>
      {/* ── Header ── */}
      <Box
        sx={{
          background: "linear-gradient(90deg, #D20000 0%, #8B0000 100%)",
          px: 3,
          py: 3,
          boxShadow: "0 4px 16px rgba(210,0,0,0.25)",
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          mb={viewMode === "create" ? 0 : 2.5}
        >
          <IconButton
            onClick={handleBackToList}
            sx={{ color: "#fff", mr: 1.5 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h6"
            fontWeight={700}
            color="#fff"
            letterSpacing={1}
            flex={1}
          >
            {viewMode === "create"
              ? "Add New Employee"
              : viewMode === "edit"
                ? "Edit Employee"
                : "Employee Details"}
          </Typography>

          {viewMode === "view" && (
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleEditEmployee}
                sx={ghostBtn}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteOpen(true)}
                sx={ghostBtn}
              >
                Delete
              </Button>
            </Stack>
          )}
          {viewMode === "edit" && (
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveEdit}
                disabled={loading}
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                  fontWeight: 700,
                  borderRadius: 1.5,
                  textTransform: "none",
                }}
              >
                Save All
              </Button>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={handleCancelEdit}
                sx={ghostBtn}
              >
                Cancel
              </Button>
            </Stack>
          )}
        </Box>

        {viewMode === "view" && selectedEmployee && (
          <Box display="flex" alignItems="center" gap={2.5}>
            {selectedEmployee.profile_photo && (
              <Avatar
                src={`${BASE_URL}${selectedEmployee.profile_photo}`}
                sx={{
                  width: 72,
                  height: 72,
                  border: "3px solid rgba(255,255,255,0.8)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
              />
            )}
            <Box>
              <Typography variant="h5" fontWeight={700} color="#fff">
                {selectedEmployee.name}
              </Typography>
              <Box display="flex" gap={1} mt={0.8}>
                <Chip
                  label={selectedEmployee.status}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    borderRadius: 1,
                    fontSize: 11,
                    ...(STATUS_CHIP[selectedEmployee.status] ||
                      STATUS_CHIP.Inactive),
                  }}
                />
                <Chip
                  label={selectedEmployee.employee_code}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    borderRadius: 1,
                    fontSize: 11,
                    bgcolor: "#f0f4ff",
                    color: "#1565c0",
                    border: "1px solid #d0deff",
                  }}
                />
              </Box>
              <Typography
                variant="body2"
                sx={{ mt: 0.8, color: "rgba(255,255,255,0.85)" }}
              >
                {selectedEmployee.designation} • {selectedEmployee.department}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.75)" }}
              >
                {selectedEmployee.email} • {selectedEmployee.phone}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* ── Validation alert ── */}
      {validationAlert && (
        <Box sx={{ px: 3, pt: 2 }}>
          <Alert
            severity="error"
            onClose={() => setValidationAlert(null)}
            sx={{ borderRadius: 2 }}
          >
            {validationAlert}
          </Alert>
        </Box>
      )}

      {/* ── Tabs ── */}
      <Box sx={{ bgcolor: "#fff", borderBottom: "1px solid #ebebeb" }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            px: 3,
            "& .MuiTabs-indicator": { bgcolor: "#D20000", height: 3 },
            "& .MuiTab-root.Mui-selected": {
              color: "#D20000",
              fontWeight: 700,
            },
            "& .MuiTab-root": { fontSize: 12, minHeight: 56 },
          }}
        >
          <Tab
            icon={<PersonIcon sx={{ fontSize: 16 }} />}
            iconPosition="start"
            label="Employee Profile"
          />
          {viewMode !== "create" && [
            <Tab
              key="docs"
              icon={<FolderIcon sx={{ fontSize: 16 }} />}
              iconPosition="start"
              label="Documents"
            />,
            <Tab
              key="personal"
              icon={<DescriptionIcon sx={{ fontSize: 16 }} />}
              iconPosition="start"
              label="Personal Details"
            />,
            <Tab
              key="salary"
              icon={<AccountBalanceIcon sx={{ fontSize: 16 }} />}
              iconPosition="start"
              label="Salary"
            />,
            <Tab
              key="users"
              icon={<PersonIcon sx={{ fontSize: 16 }} />}
              iconPosition="start"
              label="Users"
            />,
            <Tab
              key="leave"
              icon={<BeachAccessIcon sx={{ fontSize: 16 }} />}
              iconPosition="start"
              label="Leave Balance"
            />,
            <Tab
              key="empsalary"
              icon={<MonetizationOnIcon sx={{ fontSize: 16 }} />}
              iconPosition="start"
              label="Employee Salary"
            />,
            <Tab
              key="attendance"
              icon={<AccessTimeIcon sx={{ fontSize: 16 }} />}
              iconPosition="start"
              label="Attendance"
            />,
          ]}
        </Tabs>
      </Box>

      <Box sx={{ p: 3 }}>
        {/* ─ TAB 0: Employee Profile ─ */}
        <TabPanel value={activeTab} index={0}>
          <Paper
            elevation={2}
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
              <SectionHeading title="Employee Information" />
            </Box>
            <Box px={4} py={3}>
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <Field
                    {...fieldProps}
                    label="First Name"
                    field="first_name"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field {...fieldProps} label="Last Name" field="last_name" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    {...fieldProps}
                    label="Employee Code"
                    field="employee_code"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    {...fieldProps}
                    label="Email"
                    field="email"
                    type="email"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    {...fieldProps}
                    label="Phone"
                    field="phone"
                    type="tel"
                    options={{
                      inputProps: {
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                        maxLength: 10,
                      },
                    }}
                  />
                </Grid>
                {viewMode === "create" && (
                  <Grid item xs={12} sm={6}>
                    <Field
                      {...fieldProps}
                      label="Password"
                      field="password"
                      type="password"
                    />
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <Field
                    {...fieldProps}
                    label="Date of Joining"
                    field="joining_date"
                    type="date"
                    options={{ InputLabelProps: { shrink: true } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    {...fieldProps}
                    label="Date of Birth"
                    field="date_of_birth"
                    type="date"
                    options={{ InputLabelProps: { shrink: true } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    {...fieldProps}
                    label="Gender"
                    field="gender"
                    options={{
                      select: true,
                      children: [
                        <MenuItem key="Male" value="Male">
                          Male
                        </MenuItem>,
                        <MenuItem key="Female" value="Female">
                          Female
                        </MenuItem>,
                        <MenuItem key="Other" value="Other">
                          Other
                        </MenuItem>,
                      ],
                    }}
                  />
                </Grid>

                {/* Department Autocomplete */}
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    options={departments}
                    getOptionLabel={(o) => o.name || ""}
                    value={
                      departments.find(
                        (d) => d.id === formData.department_id,
                      ) || null
                    }
                    disabled={!isEditable}
                    onChange={(_, v) => {
                      setFormData((p) => ({
                        ...p,
                        department_id: v ? v.id : null,
                        department: v ? v.name : "",
                      }));
                      if (formErrors.department_id)
                        setFormErrors((p) => ({
                          ...p,
                          department_id: undefined,
                        }));
                    }}
                    loading={deptLoading}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        label={isEditable ? "Department *" : "Department"}
                        sx={fieldSx}
                        error={isEditable && !!formErrors.department_id}
                        helperText={isEditable && formErrors.department_id}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {deptLoading && <CircularProgress size={18} />}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Role Autocomplete */}
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    options={roles}
                    getOptionLabel={(o) => o.name || ""}
                    value={roles.find((r) => r.id === formData.role_id) || null}
                    disabled={!isEditable}
                    onChange={(_, v) => {
                      setFormData((p) => ({
                        ...p,
                        role_id: v ? v.id : null,
                        role: v ? v.name : "",
                      }));
                      if (formErrors.role_id)
                        setFormErrors((p) => ({ ...p, role_id: undefined }));
                    }}
                    loading={rolesLoading}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        label={isEditable ? "Role *" : "Role"}
                        sx={fieldSx}
                        error={isEditable && !!formErrors.role_id}
                        helperText={isEditable && formErrors.role_id}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {rolesLoading && <CircularProgress size={18} />}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Field
                    {...fieldProps}
                    label="Status"
                    field="status"
                    options={{
                      select: true,
                      children: [
                        <MenuItem key="Active" value="Active">
                          Active
                        </MenuItem>,
                        <MenuItem key="Inactive" value="Inactive">
                          Inactive
                        </MenuItem>,
                      ],
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    {...fieldProps}
                    label="Employment Type"
                    field="employment_type"
                    options={{
                      select: true,
                      children: [
                        <MenuItem key="Permanent" value="Permanent">
                          Permanent
                        </MenuItem>,
                        <MenuItem key="Contract" value="Contract">
                          Contract
                        </MenuItem>,
                        <MenuItem key="Intern" value="Intern">
                          Intern
                        </MenuItem>,
                      ],
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {viewMode === "create" && (
            <Box mt={3}>
              <CommonButton
                variant="contained"
                size="large"
                onClick={handleCreateEmployee}
                disabled={loading || createLoading}
                sx={redBtn}
              >
                {loading || createLoading ? "Creating…" : "Create Employee"}
              </CommonButton>
            </Box>
          )}
        </TabPanel>

        {/* ─ TAB 1: Documents ─ */}
        <TabPanel value={activeTab} index={1}>
          <Paper
            elevation={2}
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
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <SectionHeading title="Employee Documents" />
              {viewMode === "edit" && (
                <Button
                  variant="contained"
                  startIcon={editingDoc?.id ? <SaveIcon /> : <AddIcon />}
                  onClick={handleUploadDocument}
                  // disabled={isDocumentFormInvalid}
                  sx={redBtn}
                >
                  {editingDoc?.id ? "Update Documents" : "Add Document"}
                </Button>
              )}
            </Box>
            <Box px={4} py={3}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 4,
                  alignItems: "flex-start",
                }}
              >
                {/* Text fields */}
                <Box>
                  <SectionHeading title="Document Numbers" />
                  <Stack spacing={2}>
                    {[
                      { label: "Aadhaar Number", key: "aadhar_number" },
                      { label: "PAN Number", key: "pancard_number" },
                      {
                        label: "Driving License Number",
                        key: "driving_license_number",
                      },
                    ].map((f) => (
                      <TextField
                        key={f.key}
                        fullWidth
                        label={f.label}
                        sx={fieldSx}
                        value={documentFormData[f.key] || ""}
                        InputProps={{ readOnly: viewMode === "view" }}
                        onChange={(e) =>
                          setDocumentFormData((p) => ({
                            ...p,
                            [f.key]: e.target.value,
                          }))
                        }
                      />
                    ))}
                  </Stack>
                </Box>
                {/* File uploads */}
                <Box>
                  <SectionHeading title="Document Files" />
                  <Grid container spacing={2}>
                    {[
                      { label: "Aadhaar Front", key: "aadhar_front" },
                      { label: "Aadhaar Back", key: "aadhar_back" },
                      { label: "PAN Card", key: "pan_card" },
                      { label: "Photo", key: "photo" },
                      { label: "DL Front", key: "driving_license_front" },
                      { label: "DL Back", key: "driving_license_back" },
                    ].map((doc) => (
                      <Grid item xs={12} sm={6} key={doc.key}>
                        <DocumentCard
                          label={doc.label}
                          fileKey={doc.key}
                          src={getDocSrc(doc.key)}
                          isEditable={viewMode === "edit"}
                          onFileChange={handleDocFileChange}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Box>
            </Box>
          </Paper>
        </TabPanel>

        {/* ─ TAB 2: Personal Details ─ */}
        <TabPanel value={activeTab} index={2}>
          <Paper
            elevation={2}
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
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <SectionHeading title="Personal Details" />
              {viewMode === "edit" && (
                <Button
                  variant="contained"
                  startIcon={
                    editingPersonalDetails?.id ? <SaveIcon /> : <AddIcon />
                  }
                  onClick={handleSavePersonalDetails}
                  sx={redBtn}
                >
                  {editingPersonalDetails?.id
                    ? "Update Details"
                    : "Add Details"}
                </Button>
              )}
            </Box>
            <Box px={4} py={3}>
              <Grid container spacing={2.5}>
                {[
                  { label: "Father Name", key: "father_name" },
                  { label: "Mother Name", key: "mother_name" },
                  { label: "Spouse Name", key: "spouse_name" },
                ].map((f) => (
                  <Grid item xs={12} sm={6} key={f.key}>
                    <TextField
                      fullWidth
                      label={f.label}
                      sx={fieldSx}
                      value={personalDetailsFormData[f.key]}
                      disabled={viewMode !== "edit"}
                      onChange={(e) => {
                        setPersonalDetailsFormData((p) => ({
                          ...p,
                          [f.key]: e.target.value,
                        }));
                        setModifiedPersonal(true);
                      }}
                    />
                  </Grid>
                ))}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Marital Status *"
                    sx={fieldSx}
                    value={personalDetailsFormData.marital_status}
                    disabled={viewMode !== "edit"}
                    onChange={(e) => {
                      setPersonalDetailsFormData((p) => ({
                        ...p,
                        marital_status: e.target.value,
                      }));
                      setModifiedPersonal(true);
                    }}
                  >
                    <MenuItem value="single">Single</MenuItem>
                    <MenuItem value="married">Married</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Emergency Contact Phone"
                    sx={fieldSx}
                    value={formData.emergency_contact_phone || ""}
                    disabled={viewMode !== "edit"}
                    inputProps={{
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                      maxLength: 10,
                    }}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        emergency_contact_phone: e.target.value.replace(
                          /\D/g,
                          "",
                        ),
                      }))
                    }
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </TabPanel>

        {/* ─ TAB 3: Salary ─ */}
        <TabPanel value={activeTab} index={3}>
          <Paper
            elevation={2}
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
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <SectionHeading
                title={
                  editingSalary?.id
                    ? "Edit Salary Information"
                    : "Add Salary Information"
                }
              />
              {viewMode === "edit" && (
                <Button
                  variant="contained"
                  startIcon={editingSalary?.id ? <SaveIcon /> : <AddIcon />}
                  onClick={handleSaveSalary}
                  sx={redBtn}
                >
                  {editingSalary?.id ? "Update Salary" : "Add Salary"}
                </Button>
              )}
            </Box>
            <Box px={4} py={3}>
              <Grid container spacing={2.5}>
                {[
                  { label: "Gross Salary *", key: "gross_salary" },
                  { label: "Basic Salary *", key: "basic_salary" },
                  { label: "Allowances", key: "alloances" },
                  { label: "Deductions", key: "deductions" },
                ].map((f) => (
                  <Grid item xs={12} sm={6} key={f.key}>
                    <TextField
                      fullWidth
                      label={f.label}
                      type="number"
                      sx={fieldSx}
                      value={salaryFormData[f.key]}
                      disabled={viewMode !== "edit"}
                      onChange={(e) => {
                        setSalaryFormData((p) => ({
                          ...p,
                          [f.key]: e.target.value,
                        }));
                        setModifiedSalary(true);
                      }}
                    />
                  </Grid>
                ))}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Effective From *"
                    type="date"
                    sx={fieldSx}
                    InputLabelProps={{ shrink: true }}
                    value={salaryFormData.effective_from}
                    disabled={viewMode !== "edit"}
                    onChange={(e) => {
                      setSalaryFormData((p) => ({
                        ...p,
                        effective_from: e.target.value,
                      }));
                      setModifiedSalary(true);
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </TabPanel>

        {/* ─ TAB 4: Users ─ */}
        <TabPanel value={activeTab} index={4}>
          <Paper
            elevation={2}
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
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <SectionHeading
                title={
                  editingUser?.id ? "Edit User Account" : "Add User Account"
                }
              />
              {viewMode === "edit" && (
                <Button
                  variant="contained"
                  startIcon={editingUser?.id ? <SaveIcon /> : <AddIcon />}
                  onClick={handleSaveUser}
                  sx={redBtn}
                >
                  {editingUser?.id ? "Update User" : "Add User"}
                </Button>
              )}
            </Box>
            <Box px={4} py={3}>
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Username *"
                    sx={fieldSx}
                    value={userFormData.username}
                    disabled={viewMode !== "edit"}
                    onChange={(e) =>
                      setUserFormData((p) => ({
                        ...p,
                        username: e.target.value,
                      }))
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={
                      editingUser?.id
                        ? "Password (blank = keep current)"
                        : "Password *"
                    }
                    sx={fieldSx}
                    type="password"
                    value={userFormData.password}
                    disabled={viewMode !== "edit"}
                    onChange={(e) =>
                      setUserFormData((p) => ({
                        ...p,
                        password: e.target.value,
                      }))
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    options={roles}
                    getOptionLabel={(o) => o.name || ""}
                    value={
                      roles.find((r) => r.id === userFormData.role_id) || null
                    }
                    disabled={viewMode !== "edit"}
                    onChange={(_, v) =>
                      setUserFormData((p) => ({
                        ...p,
                        role_id: v ? v.id : null,
                        role: v ? v.name : "",
                      }))
                    }
                    loading={rolesLoading}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        label="Role"
                        sx={fieldSx}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {rolesLoading && <CircularProgress size={18} />}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    disabled={viewMode !== "edit"}
                    control={
                      <Switch
                        checked={userFormData.is_active}
                        onChange={(e) =>
                          setUserFormData((p) => ({
                            ...p,
                            is_active: e.target.checked,
                          }))
                        }
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: "#D20000",
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            { bgcolor: "#D20000" },
                        }}
                      />
                    }
                    label="Active"
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </TabPanel>

        {/* ─ TAB 5: Leave Balance ─ */}
        <TabPanel value={activeTab} index={5}>
          <LeaveBalanceModule
            disabled
            employee_id={selectedEmployee?.id}
            employees={employees}
          />
        </TabPanel>

        {/* ─ TAB 6: Employee Salary ─ */}
        <TabPanel value={activeTab} index={6}>
          <SalaryPayment employee_id={selectedEmployee?.id} />
        </TabPanel>

        {/* ─ TAB 7: Attendance ─ */}
        <TabPanel value={activeTab} index={7}>
          <AttendanceModule
            disabled
            employee_id={selectedEmployee?.id}
            employees={employees}
          />
        </TabPanel>
      </Box>

      {/* ─ Delete Confirmation Dialog ─ */}
      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}
      >
        <Box
          sx={{
            background: "linear-gradient(90deg, #D20000 0%, #8B0000 100%)",
            px: 3,
            py: 2,
          }}
        >
          <Typography variant="h6" fontWeight={700} color="#fff">
            Confirm Delete
          </Typography>
        </Box>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body1" color="text.secondary">
            Are you sure you want to delete{" "}
            <Typography component="span" fontWeight={700} color="#1a1a1a">
              {selectedEmployee?.name}
            </Typography>
            ? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={() => setDeleteOpen(false)}
            sx={{ fontWeight: 600, borderRadius: 1.5, textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={handleDelete} sx={redBtn}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeManagement;
