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
  Autocomplete,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonIcon from "@mui/icons-material/Person";
import FolderIcon from "@mui/icons-material/Folder";
import DownloadIcon from "@mui/icons-material/Download";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

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
  selectEmployeeError,
} from "../../feature/employee/employeeSelector";
import {
  getEmployeeDocuments,
  createEmployeeDocument,
  updateEmployeeDocument,
  deleteEmployeeDocument,
} from "../../feature/employeeDocuments/employeeDocumentsThunks";
import {
  selectEmployeeDocuments,
  selectEmployeeDocumentsLoading,
  selectCreateEmployeeDocumentLoading,
} from "../../feature/employeeDocuments/employeeDocumentsSelector";
import {
  getEmployeePersonalDetails,
  createEmployeePersonalDetails,
  updateEmployeePersonalDetails,
  deleteEmployeePersonalDetails,
} from "../../feature/employeePersonalDetails/employeePersonalDetailsThunks";
import {
  selectEmployeePersonalDetails,
  selectEmployeePersonalDetailsLoading,
  selectCreateEmployeePersonalDetailsLoading,
} from "../../feature/employeePersonalDetails/employeePersonalDetailsSelector";
import {
  getEmployeeSalaries,
  createEmployeeSalary,
  updateEmployeeSalary,
  deleteEmployeeSalary,
} from "../../feature/employeeSalary/employeeSalaryThunks";
import {
  selectEmployeeSalaries,
  selectEmployeeSalaryLoading,
  selectCreateEmployeeSalaryLoading,
} from "../../feature/employeeSalary/employeeSalarySelector";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../feature/users/userThunks";
import {
  selectUsers,
  selectUserLoading,
  selectCreateUserLoading,
} from "../../feature/users/userSelector";
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

// ==================== MAIN COMPONENT ====================

const EmployeeManagement = () => {
  const dispatch = useDispatch();
  const employees = useSelector(selectEmployees);
  const loading = useSelector(selectEmployeeLoading);
  const error = useSelector(selectEmployeeError);
  const createLoading = useSelector(selectCreateEmployeeLoading);

  const employeeDocuments = useSelector(selectEmployeeDocuments);
  const docsArray = Array.isArray(employeeDocuments)
    ? employeeDocuments
    : employeeDocuments
      ? [employeeDocuments]
      : [];

  const documentsLoading = useSelector(selectEmployeeDocumentsLoading);
  const createDocumentLoading = useSelector(
    selectCreateEmployeeDocumentLoading,
  );

  const employeePersonalDetails = useSelector(selectEmployeePersonalDetails);
  const personalDetailsArray = Array.isArray(employeePersonalDetails)
    ? employeePersonalDetails
    : employeePersonalDetails
      ? [employeePersonalDetails]
      : [];

  const personalDetailsLoading = useSelector(
    selectEmployeePersonalDetailsLoading,
  );
  const createPersonalDetailsLoading = useSelector(
    selectCreateEmployeePersonalDetailsLoading,
  );

  const employeeSalaries = useSelector(selectEmployeeSalaries);
  const employeeSalary = Array.isArray(employeeSalaries)
    ? employeeSalaries
    : employeeSalaries
      ? [employeeSalaries]
      : [];

  const salariesLoading = useSelector(selectEmployeeSalaryLoading);
  const createSalaryLoading = useSelector(selectCreateEmployeeSalaryLoading);

  const users = useSelector(selectUsers);
  const usersLoading = useSelector(selectUserLoading);
  const createUserLoading = useSelector(selectCreateUserLoading);

  const departments = useSelector(selectDepartmentList);
  const roles = useSelector(selectRoleList);
  const departmentsLoading = useSelector(selectDepartmentLoading);
  const rolesLoading = useSelector(selectRoleLoading);

  // ==================== STATE MANAGEMENT ====================

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [viewMode, setViewMode] = useState("list"); // 'list', 'view', 'edit', 'create'
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [validationAlert, setValidationAlert] = useState(null);

  // Track editing state for each tab
  const [editingDocument, setEditingDocument] = useState(null);
  const [editingPersonalDetails, setEditingPersonalDetails] = useState(null);
  const [editingSalary, setEditingSalary] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  // Track which forms have been modified
  const [hasModifiedPersonalDetails, setHasModifiedPersonalDetails] =
    useState(false);
  const [hasModifiedSalary, setHasModifiedSalary] = useState(false);
  const [hasModifiedUser, setHasModifiedUser] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
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
  });

  // Document upload state
  const [documentFormData, setDocumentFormData] = useState({
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
  });
  // Personal details state
  const [personalDetailsFormData, setPersonalDetailsFormData] = useState({
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
  });

  // Salary state
  const [salaryFormData, setSalaryFormData] = useState({
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
  });

  // User state
  const [userFormData, setUserFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    is_active: true,
    is_staff: false,
    is_superuser: false,
    phone: "",
    department_id: null,
    department: "",
    role_id: null,
    role: "",
  });
  // ==================== LIFECYCLE ====================

  useEffect(() => {
    dispatch(getEmployees());
    dispatch(getDepartments());
    dispatch(getRoles());
  }, [dispatch]);

  useEffect(() => {
    if (selectedEmployee && viewMode === "view") {
      dispatch(getEmployeeDocuments({ employee_id: selectedEmployee.id }));
      dispatch(
        getEmployeePersonalDetails({ employee_id: selectedEmployee.id }),
      );
      dispatch(getEmployeeSalaries({ employee_id: selectedEmployee.id }));
      dispatch(getUsers({ employee_id: selectedEmployee.id }));
    }
  }, [selectedEmployee, viewMode, dispatch]);
  useEffect(() => {
    if (selectedEmployee && viewMode !== "create") {
      setDocumentFormData({
        aadhar_number: selectedEmployee.aadhar_number || "",
        pancard_number: selectedEmployee.pancard_number || "",
        driving_license_number: selectedEmployee.driving_license_number || "",

        aadhar_front: selectedEmployee.aadhar_front || "",
        aadhar_back: selectedEmployee.aadhar_back || "",
        pan_card: selectedEmployee.pan_card || "",
        photo: selectedEmployee.photo || "",
        driving_license_front: selectedEmployee.driving_license_front || "",
        driving_license_back: selectedEmployee.driving_license_back || "",
      });
    }
  }, [selectedEmployee, viewMode]);

  useEffect(() => {
    if (selectedEmployee && viewMode !== "create") {
      setDocumentFormData({
        aadhar_number: selectedEmployee.aadhar_number || "",
        pancard_number: selectedEmployee.pancard_number || "",
        driving_license_number: selectedEmployee.driving_license_number || "",

        aadhar_front: selectedEmployee.aadhar_front || "",
        aadhar_back: selectedEmployee.aadhar_back || "",
        pan_card: selectedEmployee.pan_card || "",
        photo: selectedEmployee.photo || "",
        driving_license_front: selectedEmployee.driving_license_front || "",
        driving_license_back: selectedEmployee.driving_license_back || "",
      });
    }
  }, [selectedEmployee, viewMode]);

  // Load data when switching to edit mode
  useEffect(() => {
    if (selectedEmployee) {
      // Load personal details if exists
      if (personalDetailsArray.length > 0) {
        console.log("personalDetailsArray", personalDetailsArray);
        setPersonalDetailsFormData({
          father_name: personalDetailsArray[0].father_name || "",
          mother_name: personalDetailsArray[0].mother_name || "",
          marital_status: personalDetailsArray[0].marital_status || "",
          spouse_name: personalDetailsArray[0].spouse_name || "",
          blood_group: personalDetailsArray[0].blood_group || "",
          nationality: personalDetailsArray[0].nationality || "",
          religion: personalDetailsArray[0].religion || "",
          caste: personalDetailsArray[0].caste || "",
          identification_marks:
            personalDetailsArray[0].identification_marks || "",
          hobbies: personalDetailsArray[0].hobbies || "",
        });
        setEditingPersonalDetails(personalDetailsArray[0]);
      }

      // Load salary if exists
      if (employeeSalary.length > 0) {
        setSalaryFormData({
          gross_salary: employeeSalary[0].gross_salary || "",
          basic_salary: employeeSalary[0].basic_salary || "",
          hra: employeeSalary[0].hra || "",
          da: employeeSalary[0].da || "",
          ta: employeeSalary[0].ta || "",
          medical_allowance: employeeSalary[0].medical_allowance || "",
          alloances: employeeSalary[0].alloances || "",
          deductions: employeeSalary[0].deductions || "",
          provident_fund: employeeSalary[0].provident_fund || "",
          professional_tax: employeeSalary[0].professional_tax || "",
          income_tax: employeeSalary[0].income_tax || "",
          effective_from: employeeSalary[0].effective_from || "",
          remarks: employeeSalary[0].remarks || "",
        });
        setEditingSalary(employeeSalary[0]);
      }

      // Load user if exists
      if (users.length > 0) {
        setUserFormData({
          username: users[0].username || "",
          // email: users[0].email || "",
          password: users[0].username || "",
          // first_name: users[0].first_name || "",
          // last_name: users[0].last_name || "",
          is_active:
            users[0].is_active !== undefined ? users[0].is_active : true,
          // is_staff: users[0].is_staff !== undefined ? users[0].is_staff : false,
          is_superuser:
            users[0].is_superuser !== undefined ? users[0].is_superuser : false,
          // phone: users[0].phone || "",
          // department_id: users[0].department_id || null,
          // department: users[0].department || "",
          role_id: users[0].role_id || null,
          role: users[0].role || "",
        });
        setEditingUser(users[0]);
      }
      if (docsArray.length > 0) {
        const doc = docsArray?.[0] || {};

        setDocumentFormData({
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
      }
    }
  }, [
    viewMode,
    personalDetailsArray,
    docsArray,
    employeeSalary,
    users,
    selectedEmployee,
  ]);

  // ==================== VALIDATION ====================

  const validateForm = () => {
    const errors = {};

    // if (!formData.first_name?.trim()) errors.first_name = "First name is required";
    // if (!formData.last_name?.trim()) errors.last_name = "Last name is required";
    // if (!formData.email?.trim()) {
    //   errors.email = "Email is required";
    // } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    //   errors.email = "Email is invalid";
    // }
    // if (!formData.phone?.trim()) {
    //   errors.phone = "Phone number is required";
    // } else if (!/^\d{10}$/.test(formData.phone)) {
    //   errors.phone = "Phone number must be 10 digits";
    // }
    // if (viewMode === "create" && !formData.password?.trim()) {
    //   errors.password = "Password is required";
    // } else if (viewMode === "create" && formData.password?.length < 6) {
    //   errors.password = "Password must be at least 6 characters";
    // }
    // if (!formData.employee_code?.trim()) errors.employee_code = "Employee code is required";
    // if (!formData.department_id) errors.department_id = "Department is required";
    // if (!formData.designation?.trim()) errors.designation = "Designation is required";
    // if (!formData.employment_type) errors.employment_type = "Employment type is required";
    // if (!formData.role_id) errors.role_id = "Role is required";
    // if (!formData.joining_date) errors.joining_date = "Date of joining is required";
    // if (!formData.date_of_birth) errors.date_of_birth = "Date of birth is required";
    // if (!formData.gender) errors.gender = "Gender is required";
    // if (!formData.address?.trim()) errors.address = "Address is required";
    // if (!formData.city?.trim()) errors.city = "City is required";
    // if (!formData.state?.trim()) errors.state = "State is required";
    // if (!formData.pincode?.trim()) {
    //   errors.pincode = "Pincode is required";
    // } else if (!/^\d{6}$/.test(formData.pincode)) {
    //   errors.pincode = "Pincode must be 6 digits";
    // }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      setActiveTab(0);
      setValidationAlert("Please fill all required fields in Employee Profile");
      return false;
    }

    setValidationAlert(null);
    return true;
  };

  // ==================== DATA LOADING ====================

  const loadFormData = (emp) => {
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
    });
  };

  const resetFormData = () => {
    setFormData({
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
    });
  };

  // ==================== EVENT HANDLERS ====================

  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    loadFormData(employee);
    setViewMode("view");
    setActiveTab(0);
    setValidationAlert(null);
    setFormErrors({});
    // Reset all editing states
    setEditingDocument(null);
    setEditingPersonalDetails(null);
    setEditingSalary(null);
    setEditingUser(null);
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
    // Reset all editing states
    setEditingDocument(null);
    setEditingPersonalDetails(null);
    setEditingSalary(null);
    setEditingUser(null);
    // Reset modification flags
    setHasModifiedPersonalDetails(false);
    setHasModifiedSalary(false);
    setHasModifiedUser(false);
    // Reset all form data
    setPersonalDetailsFormData({
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
    });
    setSalaryFormData({
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
    });
    setUserFormData({
      username: "",
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      is_active: true,
      is_staff: false,
      is_superuser: false,
      phone: "",
      department_id: null,
      department: "",
      role_id: null,
      role: "",
    });
    setDocumentFormData({
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
    });
  };

  const handleBackToList = () => {
    dispatch(getEmployees());
    setSelectedEmployee(null);
    setViewMode("list");
    resetFormData();
    setValidationAlert(null);
    setFormErrors({});
  };

  const handleSaveEdit = async () => {
    if (!validateForm()) return;

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
      updateEmployee({ id: selectedEmployee.id, data: formDataToSend }),
    );

    if (result.type.includes("fulfilled")) {
      CommonToast("Employee updated successfully", "success");
      const updatedEmployee = { ...selectedEmployee, ...formData };
      setSelectedEmployee(updatedEmployee);
      loadFormData(updatedEmployee);
      dispatch(getEmployees());

      // Only save Personal Details if user modified the form
      if (
        hasModifiedPersonalDetails &&
        personalDetailsFormData.marital_status
      ) {
        await handleSavePersonalDetails();
      }

      // Only save Salary if user modified the form
      if (
        hasModifiedSalary &&
        salaryFormData.basic_salary &&
        salaryFormData.gross_salary &&
        salaryFormData.effective_from
      ) {
        await handleSaveSalary();
      }

      // Only save User if user modified the form
      // if (hasModifiedUser) {
      await handleSaveUser();
      // }

      // Reset modification flags
      setHasModifiedPersonalDetails(false);
      setHasModifiedSalary(false);
      setHasModifiedUser(false);

      setViewMode("view");
    } else {
      CommonToast("Failed to update employee", "error");
    }
  };

  const handleDelete = async () => {
    await dispatch(deleteEmployee(selectedEmployee.id));
    CommonToast("Employee deleted successfully", "success");
    dispatch(getEmployees());
    setDeleteDialogOpen(false);
    handleBackToList();
  };

  const handleAddEmployee = () => {
    resetFormData();
    setSelectedEmployee(null);
    setViewMode("create");
    setActiveTab(0);
    setValidationAlert(null);
    setFormErrors({});
  };

  const handleCreateEmployee = async () => {
    if (!validateForm()) return;

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        formDataToSend.append(key, value);
      }
    });

    try {
      const result = await dispatch(createEmployee(formDataToSend));

      if (result.type.includes("fulfilled")) {
        CommonToast("Employee created successfully", "success");
        dispatch(getEmployees());
        handleBackToList();
      }
    } catch (err) {
      CommonToast("Failed to create employee", "error");
    }
  };

  // Document handlers
  const handleUploadDocument = async () => {
    // if (!documentFormData.document_type) {
    //   CommonToast("Please select document type", "error");
    //   return;
    // }

    const formDataToSend = new FormData();
    formDataToSend.append("employee_id", selectedEmployee.id);
    formDataToSend.append("document_type", documentFormData.document_type);

    if (documentFormData.pancard_number)
      formDataToSend.append("pancard_number", documentFormData.pancard_number);
    if (documentFormData.aadhar_number)
      formDataToSend.append("aadhar_number", documentFormData.aadhar_number);
    if (documentFormData.driving_license_number)
      formDataToSend.append(
        "driving_license_number",
        documentFormData.driving_license_number,
      );
    if (documentFormData.aadhar_front)
      formDataToSend.append("aadhar_front", documentFormData.aadhar_front);
    if (documentFormData.aadhar_back)
      formDataToSend.append("aadhar_back", documentFormData.aadhar_back);
    if (documentFormData.pan_card)
      formDataToSend.append("pan_card", documentFormData.pan_card);
    if (documentFormData.photo)
      formDataToSend.append("photo", documentFormData.photo);
    if (documentFormData.driving_license_front)
      formDataToSend.append(
        "driving_license_front",
        documentFormData.driving_license_front,
      );
    if (documentFormData.driving_license_back)
      formDataToSend.append(
        "driving_license_back",
        documentFormData.driving_license_back,
      );
    if (documentFormData.remarks)
      formDataToSend.append("remarks", documentFormData.remarks);

    try {
      const result = await dispatch(createEmployeeDocument(formDataToSend));
      if (result.type.includes("fulfilled")) {
        CommonToast("Document uploaded successfully", "success");
        dispatch(getEmployeeDocuments({ employee_id: selectedEmployee.id }));
        setDocumentFormData({
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
        });
      }
    } catch {
      CommonToast("Failed to upload document", "error");
    }
  };

  const handleDeleteDocument = async (docId) => {
    try {
      await dispatch(deleteEmployeeDocument(docId));
      CommonToast("Document deleted successfully", "success");
      dispatch(getEmployeeDocuments({ employee_id: selectedEmployee.id }));
    } catch (err) {
      CommonToast("Failed to delete document", "error");
    }
  };

  // Personal Details Handlers
  const handleSavePersonalDetails = async () => {
    if (!personalDetailsFormData.marital_status) {
      CommonToast("Marital status is required", "error");
      return;
    }

    const dataToSend = {
      ...personalDetailsFormData,
      employee_id: selectedEmployee.id,
    };

    try {
      if (editingPersonalDetails) {
        const result = await dispatch(
          updateEmployeePersonalDetails({
            id: editingPersonalDetails.id,
            data: dataToSend,
          }),
        );
        if (result.type.includes("fulfilled")) {
          CommonToast("Personal details updated successfully", "success");
          dispatch(
            getEmployeePersonalDetails({ employee_id: selectedEmployee.id }),
          );
        }
      } else {
        const result = await dispatch(
          createEmployeePersonalDetails(dataToSend),
        );
        if (result.type.includes("fulfilled")) {
          CommonToast("Personal details created successfully", "success");
          dispatch(
            getEmployeePersonalDetails({ employee_id: selectedEmployee.id }),
          );
        }
      }
    } catch (err) {
      CommonToast("Failed to save personal details", "error");
    }
  };

  const handleDeletePersonalDetails = async (detailsId) => {
    try {
      await dispatch(deleteEmployeePersonalDetails(detailsId));
      CommonToast("Personal details deleted successfully", "success");
      dispatch(
        getEmployeePersonalDetails({ employee_id: selectedEmployee.id }),
      );
      setEditingPersonalDetails(null);
      setPersonalDetailsFormData({
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
      });
    } catch (err) {
      CommonToast("Failed to delete personal details", "error");
    }
  };

  // Salary Handlers
  const handleSaveSalary = async () => {
    if (
      !salaryFormData.basic_salary ||
      !salaryFormData.gross_salary ||
      !salaryFormData.effective_from
    ) {
      CommonToast(
        "Please fill required fields (Gross Salary, Basic Salary, Effective From)",
        "error",
      );
      return;
    }

    const dataToSend = {
      ...salaryFormData,
      employee_id: selectedEmployee.id,
    };

    try {
      if (editingSalary) {
        const result = await dispatch(
          updateEmployeeSalary({ id: editingSalary.id, data: dataToSend }),
        );
        if (result.type.includes("fulfilled")) {
          CommonToast("Salary updated successfully", "success");
          dispatch(getEmployeeSalaries({ employee_id: selectedEmployee.id }));
        }
      } else {
        const result = await dispatch(createEmployeeSalary(dataToSend));
        if (result.type.includes("fulfilled")) {
          CommonToast("Salary created successfully", "success");
          dispatch(getEmployeeSalaries({ employee_id: selectedEmployee.id }));
        }
      }
    } catch (err) {
      CommonToast("Failed to save salary", "error");
    }
  };

  const handleDeleteSalary = async (salaryId) => {
    try {
      await dispatch(deleteEmployeeSalary(salaryId));
      CommonToast("Salary deleted successfully", "success");
      dispatch(getEmployeeSalaries({ employee_id: selectedEmployee.id }));
      setEditingSalary(null);
      setSalaryFormData({
        gross_salary: "",
        basic_salary: "",
        hra: "",
        da: "",
        ta: "",
        deductions: "",
        medical_allowance: "",
        alloances: "",
        provident_fund: "",
        professional_tax: "",
        income_tax: "",
        effective_from: "",
        remarks: "",
      });
    } catch (err) {
      CommonToast("Failed to delete salary", "error");
    }
  };

  const BASE_URL = "https://hogofilm.pythonanywhere.com";
  const renderFileUpload = (label, fileKey, isRequired = false) => {
    const isEditable = createDistributorFlag || editMode;

    // 🔹 get correct value based on mode
    const getValue = () => {
      if (createDistributorFlag) return newDistFiles[fileKey];
      if (editMode) return formData[fileKey];
      return selectedDistributor?.[fileKey];
    };

    const value = getValue();

    // 🔹 resolve preview source safely
    const getPreviewSrc = () => {
      // File object (new upload)
      if (value instanceof File) {
        return URL.createObjectURL(value);
      }

      // String URL from backend
      if (typeof value === "string" && value.trim() !== "") {
        return value.startsWith("http") ? value : `${BASE_URL}${value}`;
      }

      return null;
    };

    const previewSrc = getPreviewSrc();

    const isImage =
      typeof previewSrc === "string" &&
      !previewSrc.toLowerCase().endsWith(".pdf");

    return (
      <Grid item xs={12} md={6}>
        <Stack spacing={1.5}>
          {/* 🔹 IMAGE PREVIEW */}
          {previewSrc && isImage && (
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
              />
            </Box>
          )}

          {/* 🔹 PDF VIEW */}
          {previewSrc && !isImage && (
            <CommonButton
              variant="outlined"
              fullWidth
              onClick={() => window.open(previewSrc, "_blank")}
            >
              View {label}
            </CommonButton>
          )}

          {/* 🔹 UPLOAD BUTTON (CREATE / EDIT) */}
          {isEditable && (
            <>
              <CommonButton
                variant="outlined"
                component="label"
                fullWidth
                color={formErrors[fileKey] ? "error" : "primary"}
              >
                {previewSrc ? "Replace" : "Upload"} {label}
                {isRequired && createDistributorFlag ? " *" : ""}
                <input
                  type="file"
                  hidden
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    if (createDistributorFlag) {
                      setNewDistFiles({
                        ...newDistFiles,
                        [fileKey]: file,
                      });
                    } else {
                      setFormData({
                        ...formData,
                        [fileKey]: file,
                      });
                    }

                    if (formErrors[fileKey]) {
                      setFormErrors({
                        ...formErrors,
                        [fileKey]: undefined,
                      });
                    }
                  }}
                />
              </CommonButton>

              {/* 🔹 FILE NAME */}
              {value && (
                <Typography variant="body2" color="success.main">
                  Selected: {value?.name || value}
                </Typography>
              )}
            </>
          )}

          {/* 🔹 VIEW MODE (NO EDIT) */}
          {!isEditable && !previewSrc && (
            <Typography variant="body2" color="text.secondary">
              Not Uploaded
            </Typography>
          )}

          {/* 🔹 ERROR */}
          {formErrors[fileKey] && (
            <Typography color="error" variant="caption">
              {formErrors[fileKey]}
            </Typography>
          )}
        </Stack>
      </Grid>
    );
  };

  // User Handlers
  const handleSaveUser = async () => {
    // if (!userFormData.username || !userFormData.email) {
    //   CommonToast("Username and Email are required", "error");
    //   return;
    // }

    // if (!editingUser && !userFormData.password) {
    //   CommonToast("Password is required for new user", "error");
    //   return;
    // }

    // if (userFormData.password && userFormData.password.length < 6) {
    //   CommonToast("Password must be at least 6 characters", "error");
    //   return;
    // }

    const dataToSend = {
      ...userFormData,
      employee_id: selectedEmployee.id,
    };

    if (editingUser && !userFormData.password) {
      delete dataToSend.password;
    }

    try {
      if (editingUser) {
        const result = await dispatch(
          updateUser({ id: editingUser.id, data: dataToSend }),
        );
        if (result.type.includes("fulfilled")) {
          CommonToast("User updated successfully", "success");
          dispatch(getUsers({ employee_id: selectedEmployee.id }));
        }
      } else {
        const result = await dispatch(createUser(dataToSend));
        if (result.type.includes("fulfilled")) {
          CommonToast("User created successfully", "success");
          dispatch(getUsers({ employee_id: selectedEmployee.id }));
        }
      }
    } catch (err) {
      CommonToast("Failed to save user", "error");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await dispatch(deleteUser(userId));
      CommonToast("User deleted successfully", "success");
      dispatch(getUsers({ employee_id: selectedEmployee.id }));
      setEditingUser(null);
      setUserFormData({
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        is_active: true,
        is_staff: false,
        is_superuser: false,
        phone: "",
        department_id: null,
        department: "",
        role_id: null,
        role: "",
      });
    } catch (err) {
      CommonToast("Failed to delete user", "error");
    }
  };

  // ==================== RENDER HELPER FUNCTIONS ====================

  const renderTextField = (label, field, type = "text", options = {}) => {
    const isEditable = viewMode === "edit" || viewMode === "create";
    const value = formData[field] || "";

    const requiredFields = [
      "first_name",
      "last_name",
      "email",
      "phone",
      "password",
      "employee_code",
      "department_id",
      "role_id",
      "designation",
      "employment_type",
      "joining_date",
      "date_of_birth",
      "gender",
      "address",
      "city",
      "state",
      "pincode",
    ];

    const isRequired = requiredFields.includes(field);

    const commonProps = {
      label:
        isRequired && (viewMode === "create" || viewMode === "edit")
          ? `${label} *`
          : label,
      type,
      value: value,
      InputProps: { readOnly: !isEditable },
      error: isEditable && !!formErrors[field],
      helperText: isEditable && formErrors[field],
      ...options,
    };

    if (isEditable) {
      commonProps.onChange = (e) => {
        let newValue = e.target.value;

        if (type === "tel" || options.inputMode === "numeric") {
          newValue = newValue.replace(/\D/g, "");
        }

        setFormData({
          ...formData,
          [field]: newValue,
        });

        if (formErrors[field]) {
          setFormErrors({
            ...formErrors,
            [field]: undefined,
          });
        }
      };
    }

    return <TextField {...commonProps} />;
  };
  // const BASE_URL = "https://hogofilm.pythonanywhere.com";

  const getDocumentSrc = (key) => {
    const value = documentFormData?.[key];

    if (!value) return null;

    // File object (edit mode upload)
    if (value instanceof File) {
      return URL.createObjectURL(value);
    }

    // String URL from API (view mode)
    if (typeof value === "string") {
      return `${BASE_URL}${value}`;
    }

    return null;
  };

  const renderDocumentField = (label, key, isEditable) => {
    const src = getDocumentSrc(key);
    const isImage = src && !src.toLowerCase().endsWith(".pdf");

    return (
      <Box
        sx={{
          border: "1px dashed #ccc",
          borderRadius: 2,
          p: 1.5,
          height: "100%",
        }}
      >
        {/* LABEL */}
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
          {label}
        </Typography>

        {/* IMAGE / PREVIEW */}
        {src && isImage ? (
          <Box
            sx={{
              width: "100%",
              height: 150,
              borderRadius: 1,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "#fafafa",
              mb: 1,
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
              height: 150,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "text.secondary",
              bgcolor: "#fafafa",
              borderRadius: 1,
              mb: 1,
            }}
          >
            Not Uploaded
          </Box>
        )}

        {/* ACTION */}
        {true ? (
          <Button component="label" variant="outlined" fullWidth size="small">
            {src ? "Replace" : "Upload"} {label}
            <input
              hidden
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;

                setDocumentFormData({
                  ...documentFormData,
                  [key]: file,
                });
              }}
            />
          </Button>
        ) : (
          src && (
            <Button
              variant="outlined"
              fullWidth
              size="small"
              href={src}
              target="_blank"
            >
              View
            </Button>
          )
        )}
      </Box>
    );
  };

  // ==================== TABLE VIEW ====================

  if (viewMode === "list") {
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
              Employee Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage employees, documents, and information
            </Typography>
          </Box>
          <CommonButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddEmployee}
            size="large"
          >
            Add Employee
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
                      Employee Code
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Department</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employees.length > 0 &&
                    employees?.map((emp, index) => (
                      <TableRow key={emp.id} hover>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Typography>{emp.employee_code}</Typography>
                        </TableCell>
                        <TableCell>{`${emp.first_name} ${emp.last_name}`}</TableCell>
                        <TableCell>{emp.department_name}</TableCell>
                        <TableCell>{emp.role_name}</TableCell>
                        <TableCell>{emp.phone}</TableCell>
                        <TableCell>{emp.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={emp.status}
                            color={
                              emp.status === "Active"
                                ? "success"
                                : emp.status === "Inactive"
                                  ? "default"
                                  : "warning"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => handleViewDetails(emp)}
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

  // ==================== DETAIL VIEW (VIEW/EDIT/CREATE) ====================

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
            {viewMode === "create"
              ? "Add New Employee"
              : viewMode === "edit"
                ? "Edit Employee"
                : "Employee Details"}
          </Typography>

          {viewMode === "view" && (
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                color="warning"
                startIcon={<EditIcon />}
                onClick={handleEditEmployee}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete
              </Button>
            </Stack>
          )}

          {viewMode === "edit" && (
            <Stack direction="row" spacing={1}>
              <CommonButton
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveEdit}
                disabled={loading}
              >
                Save All
              </CommonButton>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={handleCancelEdit}
                sx={{ color: "white", borderColor: "white" }}
              >
                Cancel
              </Button>
            </Stack>
          )}
        </Box>

        {viewMode === "view" && selectedEmployee && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {selectedEmployee.profile_photo && (
              <Avatar
                src={`${BASE_URL}${selectedEmployee.profile_photo}`}
                sx={{ width: 80, height: 80, border: "3px solid white" }}
              />
            )}
            <Box>
              <Typography variant="h4" fontWeight={700}>
                {selectedEmployee.name}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                <Chip
                  label={selectedEmployee.status}
                  size="small"
                  sx={{ bgcolor: "white", color: "success.main" }}
                />
                <Chip
                  label={selectedEmployee.employee_code}
                  size="small"
                  sx={{ bgcolor: "white", color: "primary.main" }}
                />
              </Box>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                {selectedEmployee.designation} • {selectedEmployee.department}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {selectedEmployee.email} • {selectedEmployee.phone}
              </Typography>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Validation Alert */}
      {validationAlert && viewMode === "create" && (
        <Box sx={{ p: 3, pb: 0 }}>
          <Alert severity="error" onClose={() => setValidationAlert(null)}>
            {validationAlert}
          </Alert>
        </Box>
      )}

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
            icon={<PersonIcon />}
            iconPosition="start"
            label="Employee Profile"
          />
          {viewMode !== "create" && [
            <Tab
              key="documents"
              icon={<FolderIcon />}
              iconPosition="start"
              label="Employee Documents"
            />,
            <Tab
              key="personal"
              icon={<DescriptionIcon />}
              iconPosition="start"
              label="Personal Details"
            />,
            <Tab
              key="salary"
              icon={<AccountBalanceIcon />}
              iconPosition="start"
              label="Salary"
            />,
            <Tab
              key="users"
              icon={<PersonIcon />}
              iconPosition="start"
              label="Users"
            />,
          ]}
        </Tabs>
      </Box>

      {/* Content Section */}
      <Box sx={{ p: 3 }}>
        {/* TAB 0: EMPLOYEE PROFILE */}
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
                  Employee Information
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  {renderTextField("First Name", "first_name")}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField("Last Name", "last_name")}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField("Full Name", "name")}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField("Employee Code", "employee_code")}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField("Email", "email", "email")}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField("Phone", "phone", "tel", {
                    inputProps: {
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                      maxLength: 10,
                    },
                  })}
                </Grid>

                {viewMode === "create" && (
                  <Grid item xs={12} sm={6}>
                    {renderTextField("Password", "password", "password")}
                  </Grid>
                )}

                {/* <Grid item xs={12} sm={6}>
                  {renderTextField("Designation", "designation")}
                </Grid> */}

                {/* <Grid item xs={12} sm={6}>
                  {renderTextField("Emergency Contact Name", "emergency_contact_name")}
                </Grid> */}
                <Grid item xs={12} sm={6}>
                  {renderTextField(
                    "Emergency Contact Phone",
                    "emergency_contact_phone",
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

                <Grid item xs={12} sm={6}>
                  {renderTextField("Date of Joining", "joining_date", "date", {
                    InputLabelProps: { shrink: true },
                  })}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField("Date of Birth", "date_of_birth", "date", {
                    InputLabelProps: { shrink: true },
                  })}
                </Grid>

                <Grid item xs={12} sm={6}>
                  {renderTextField("Gender", "gender", "text", {
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
                  })}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {viewMode === "edit" || viewMode === "create" ? (
                    <Autocomplete
                      options={departments}
                      getOptionLabel={(option) => option.name || ""}
                      value={
                        departments.find(
                          (d) => d.id === formData.department_id,
                        ) || null
                      }
                      onChange={(event, newValue) => {
                        setFormData({
                          ...formData,
                          department_id: newValue ? newValue.id : null,
                          department: newValue ? newValue.name : "",
                        });
                        if (formErrors.department_id) {
                          setFormErrors({
                            ...formErrors,
                            department_id: undefined,
                          });
                        }
                      }}
                      loading={departmentsLoading}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={
                            viewMode === "create" || viewMode === "edit"
                              ? "Department *"
                              : "Department"
                          }
                          error={
                            !!(viewMode === "create" || viewMode === "edit") &&
                            !!formErrors.department_id
                          }
                          helperText={
                            (viewMode === "create" || viewMode === "edit") &&
                            formErrors.department_id
                          }
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {departmentsLoading ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                  ) : (
                    <TextField
                      fullWidth
                      label="Department"
                      value={selectedEmployee?.department || ""}
                      InputProps={{ readOnly: true }}
                    />
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {viewMode === "edit" || viewMode === "create" ? (
                    <Autocomplete
                      options={roles}
                      getOptionLabel={(option) => option.name || ""}
                      value={
                        roles.find((r) => r.id === formData.role_id) || null
                      }
                      onChange={(event, newValue) => {
                        setFormData({
                          ...formData,
                          role_id: newValue ? newValue.id : null,
                          role: newValue ? newValue.name : "",
                        });
                        if (formErrors.role_id) {
                          setFormErrors({ ...formErrors, role_id: undefined });
                        }
                      }}
                      loading={rolesLoading}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={
                            viewMode === "create" || viewMode === "edit"
                              ? "Role *"
                              : "Role"
                          }
                          error={
                            !!(viewMode === "create" || viewMode === "edit") &&
                            !!formErrors.role_id
                          }
                          helperText={
                            (viewMode === "create" || viewMode === "edit") &&
                            formErrors.role_id
                          }
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {rolesLoading ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                  ) : (
                    <TextField
                      fullWidth
                      label="Role"
                      value={selectedEmployee?.role || ""}
                      InputProps={{ readOnly: true }}
                    />
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField("Status", "status", "text", {
                    select: true,
                    children: [
                      <MenuItem key="Active" value="Active">
                        Active
                      </MenuItem>,
                      <MenuItem key="Inactive" value="Inactive">
                        Inactive
                      </MenuItem>,
                    ],
                  })}
                </Grid>

                <Grid item xs={12} sm={6}>
                  {renderTextField(
                    "Employment Type",
                    "employment_type",
                    "text",
                    {
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
                    },
                  )}
                </Grid>

                {/* <Grid item xs={12} sm={6}>
                  {viewMode === "edit" || viewMode === "create" ? (
                    <Autocomplete
                      options={departments}
                      getOptionLabel={(option) => option.name || ""}
                      value={departments.find((d) => d.id === formData.department_id) || null}
                      onChange={(event, newValue) => {
                        setFormData({
                          ...formData,
                          department_id: newValue ? newValue.id : null,
                          department: newValue ? newValue.name : "",
                        });
                        if (formErrors.department_id) {
                          setFormErrors({ ...formErrors, department_id: undefined });
                        }
                      }}
                      loading={departmentsLoading}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={viewMode === "create" || viewMode === "edit" ? "Department *" : "Department"}
                          error={!!(viewMode === "create" || viewMode === "edit") && !!formErrors.department_id}
                          helperText={(viewMode === "create" || viewMode === "edit") && formErrors.department_id}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {departmentsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                  ) : (
                    <TextField
                      fullWidth
                      label="Department"
                      value={selectedEmployee?.department || ""}
                      InputProps={{ readOnly: true }}
                    />
                  )}
                </Grid> */}

                {/* <Grid item xs={12} sm={6}>
                  {viewMode === "edit" || viewMode === "create" ? (
                    <Autocomplete
                      options={roles}
                      getOptionLabel={(option) => option.name || ""}
                      value={roles.find((r) => r.id === formData.role_id) || null}
                      onChange={(event, newValue) => {
                        setFormData({
                          ...formData,
                          role_id: newValue ? newValue.id : null,
                          role: newValue ? newValue.name : "",
                        });
                        if (formErrors.role_id) {
                          setFormErrors({ ...formErrors, role_id: undefined });
                        }
                      }}
                      loading={rolesLoading}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={viewMode === "create" || viewMode === "edit" ? "Role *" : "Role"}
                          error={!!(viewMode === "create" || viewMode === "edit") && !!formErrors.role_id}
                          helperText={(viewMode === "create" || viewMode === "edit") && formErrors.role_id}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {rolesLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                  ) : (
                    <TextField
                      fullWidth
                      label="Role"
                      value={selectedEmployee?.role || ""}
                      InputProps={{ readOnly: true }}
                    />
                  )}
                </Grid> */}

                {/* <Grid item xs={12}>
                  {renderTextField("Address", "address")}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderTextField("City", "city")}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderTextField("State", "state")}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderTextField("Pincode", "pincode", "tel", {
                    inputProps: { inputMode: "numeric", pattern: "[0-9]*", maxLength: 6 },
                  })}
                </Grid> */}
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        <Box sx={{ marginTop: "10px" }}>
          {viewMode === "create" && (
            <CommonButton
              variant="contained"
              size="large"
              onClick={handleCreateEmployee}
              disabled={loading || createLoading}
            >
              {loading || createLoading ? "Creating..." : "Create Employee"}
            </CommonButton>
          )}
        </Box>

        {/* TAB 1: EMPLOYEE DOCUMENTS */}
        {/* {viewMode !== "create" && ( */}
        <TabPanel value={activeTab} index={1}>
          <Card elevation={2}>
            <CardContent>
              {/* ================= HEADER ================= */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight={700}>
                  Employee Documents
                </Typography>

                {viewMode === "edit" && (
                  <CommonButton
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleUploadDocument}
                    size="small"
                  >
                    {docsArray.length > 0
                      ? "Upload More Documents"
                      : "Add Document"}
                  </CommonButton>
                )}
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* ================= GRID LAYOUT ================= */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 3,
                  width: "100%",
                  alignItems: "flex-start",
                }}
              >
                {/* ========== LEFT : TEXT FIELDS ========== */}
                <Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Aadhaar Number"
                        value={documentFormData.aadhar_number || ""}
                        InputProps={{ readOnly: viewMode === "view" }}
                        onChange={(e) =>
                          setDocumentFormData({
                            ...documentFormData,
                            aadhar_number: e.target.value,
                          })
                        }
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="PAN Number"
                        value={documentFormData.pancard_number || ""}
                        InputProps={{ readOnly: viewMode === "view" }}
                        onChange={(e) =>
                          setDocumentFormData({
                            ...documentFormData,
                            pancard_number: e.target.value,
                          })
                        }
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Driving License Number"
                        value={documentFormData.driving_license_number || ""}
                        InputProps={{ readOnly: viewMode === "view" }}
                        onChange={(e) =>
                          setDocumentFormData({
                            ...documentFormData,
                            driving_license_number: e.target.value,
                          })
                        }
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* ========== RIGHT : DOCUMENT FILES ========== */}
                <Box>
                  <Grid container spacing={2}>
                    {[
                      { label: "Aadhaar Front", key: "aadhar_front" },
                      { label: "Aadhaar Back", key: "aadhar_back" },
                      { label: "PAN Card", key: "pan_card" },
                      { label: "Photo", key: "photo" },
                      {
                        label: "Driving License Front",
                        key: "driving_license_front",
                      },
                      {
                        label: "Driving License Back",
                        key: "driving_license_back",
                      },
                    ].map((doc) => (
                      <Grid item xs={12} sm={6} key={doc.key}>
                        {renderDocumentField(
                          doc.label,
                          doc.key,
                          // viewMode === "edit",
                        )}
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </TabPanel>
        {/* )} */}

        {/* TAB 2: PERSONAL DETAILS */}
        {/* {viewMode !== "create" && ( */}
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
                  Personal Details
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ mb: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                  {editingPersonalDetails
                    ? "Edit Personal Details"
                    : viewMode === "edit"
                      ? "Add Personal Details"
                      : "Personal Details"}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Father Name"
                      value={personalDetailsFormData.father_name}
                      onChange={(e) => {
                        setPersonalDetailsFormData({
                          ...personalDetailsFormData,
                          father_name: e.target.value,
                        });
                        setHasModifiedPersonalDetails(true);
                      }}
                      disabled={viewMode !== "edit"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Mother Name"
                      value={personalDetailsFormData.mother_name}
                      onChange={(e) => {
                        setPersonalDetailsFormData({
                          ...personalDetailsFormData,
                          mother_name: e.target.value,
                        });
                        setHasModifiedPersonalDetails(true);
                      }}
                      disabled={viewMode !== "edit"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Marital Status *"
                      select
                      value={personalDetailsFormData.marital_status}
                      onChange={(e) => {
                        setPersonalDetailsFormData({
                          ...personalDetailsFormData,
                          marital_status: e.target.value,
                        });
                        setHasModifiedPersonalDetails(true);
                      }}
                      disabled={viewMode !== "edit"}
                    >
                      <MenuItem value="single">Single</MenuItem>
                      <MenuItem value="married">Married</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Spouse Name"
                      value={personalDetailsFormData.spouse_name}
                      onChange={(e) => {
                        setPersonalDetailsFormData({
                          ...personalDetailsFormData,
                          spouse_name: e.target.value,
                        });
                        setHasModifiedPersonalDetails(true);
                      }}
                      disabled={viewMode !== "edit"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {renderTextField(
                      "Emergency Contact Phone",
                      "emergency_contact_phone",
                      "tel",
                      {
                        inputProps: {
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                          maxLength: 10,
                        },
                        disabled: viewMode !== "edit",
                      },
                    )}
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </TabPanel>
        {/* )} */}

        {/* TAB 3: SALARY */}
        {/* {viewMode !== "create" && ( */}
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
                  Salary Information
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ mb: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                  {editingSalary
                    ? "Edit Salary Information"
                    : "Add Salary Information"}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Gross Salary *"
                      type="number"
                      value={salaryFormData.gross_salary}
                      onChange={(e) => {
                        setSalaryFormData({
                          ...salaryFormData,
                          gross_salary: e.target.value,
                        });
                        setHasModifiedSalary(true);
                      }}
                      disabled={viewMode !== "edit"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Basic Salary *"
                      type="number"
                      value={salaryFormData.basic_salary}
                      onChange={(e) => {
                        setSalaryFormData({
                          ...salaryFormData,
                          basic_salary: e.target.value,
                        });
                        setHasModifiedSalary(true);
                      }}
                      disabled={viewMode !== "edit"}
                    />
                  </Grid>
                  {/* <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="HRA"
                          type="number"
                          value={salaryFormData.hra}
                          onChange={(e) => {
                            setSalaryFormData({
                              ...salaryFormData,
                              hra: e.target.value,
                            });
                            setHasModifiedSalary(true);
                          }}
                        />
                      </Grid> */}
                  {/* <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="DA"
                          type="number"
                          value={salaryFormData.da}
                          onChange={(e) => {
                            setSalaryFormData({
                              ...salaryFormData,
                              da: e.target.value,
                            });
                            setHasModifiedSalary(true);
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="TA"
                          type="number"
                          value={salaryFormData.ta}
                          onChange={(e) => {
                            setSalaryFormData({
                              ...salaryFormData,
                              ta: e.target.value,
                            });
                            setHasModifiedSalary(true);
                          }}
                        />
                      </Grid> */}
                  {/* <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Medical Allowance"
                          type="number"
                          value={salaryFormData.medical_allowance}
                          onChange={(e) => {
                            setSalaryFormData({
                              ...salaryFormData,
                              medical_allowance: e.target.value,
                            });
                            setHasModifiedSalary(true);
                          }}
                        />
                      </Grid> */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Allowances"
                      type="number"
                      value={salaryFormData.alloances}
                      onChange={(e) => {
                        setSalaryFormData({
                          ...salaryFormData,
                          alloances: e.target.value,
                        });
                        setHasModifiedSalary(true);
                      }}
                      disabled={viewMode !== "edit"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Deductions"
                      type="number"
                      value={salaryFormData.deductions}
                      onChange={(e) => {
                        setSalaryFormData({
                          ...salaryFormData,
                          deductions: e.target.value,
                        });
                        setHasModifiedSalary(true);
                      }}
                      disabled={viewMode !== "edit"}
                    />
                  </Grid>
                  {/* 
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Provident Fund"
                          type="number"
                          value={salaryFormData.provident_fund}
                          onChange={(e) => {
                            setSalaryFormData({
                              ...salaryFormData,
                              provident_fund: e.target.value,
                            });
                            setHasModifiedSalary(true);
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Professional Tax"
                          type="number"
                          value={salaryFormData.professional_tax}
                          onChange={(e) => {
                            setSalaryFormData({
                              ...salaryFormData,
                              professional_tax: e.target.value,
                            });
                            setHasModifiedSalary(true);
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Income Tax"
                          type="number"
                          value={salaryFormData.income_tax}
                          onChange={(e) => {
                            setSalaryFormData({
                              ...salaryFormData,
                              income_tax: e.target.value,
                            });
                            setHasModifiedSalary(true);
                          }}
                        />
                      </Grid> */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Effective From *"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      value={salaryFormData.effective_from}
                      onChange={(e) => {
                        setSalaryFormData({
                          ...salaryFormData,
                          effective_from: e.target.value,
                        });
                        setHasModifiedSalary(true);
                      }}
                      disabled={viewMode !== "edit"}
                    />
                  </Grid>
                  {/* <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Remarks"
                          multiline
                          rows={2}
                          value={salaryFormData.remarks}
                          onChange={(e) => {
                            setSalaryFormData({
                              ...salaryFormData,
                              remarks: e.target.value,
                            });
                            setHasModifiedSalary(true);
                          }}
                        />
                      </Grid> */}
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </TabPanel>
        {/* )} */}

        {/* TAB 4: USERS */}
        {/* {viewMode !== "create" && ( */}
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
                  User Accounts
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ mb: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                  {editingUser ? "Edit User Account" : "Add User Account"}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Username *"
                      value={userFormData.username}
                      onChange={(e) => {
                        setUserFormData({
                          ...userFormData,
                          username: e.target.value,
                        });
                        setHasModifiedUser(true);
                      }}
                      disabled={viewMode !== "edit"}
                    />
                  </Grid>
                  {/* <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email *"
                          type="email"
                          value={userFormData.email}
                          onChange={(e) => {
                            setUserFormData({
                              ...userFormData,
                              email: e.target.value,
                            });
                            setHasModifiedUser(true);
                          }}
                        />
                      </Grid> */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={
                        editingUser
                          ? "Password (leave blank to keep current)"
                          : "Password *"
                      }
                      type="password"
                      value={userFormData.password}
                      onChange={(e) => {
                        setUserFormData({
                          ...userFormData,
                          password: e.target.value,
                        });
                        setHasModifiedUser(true);
                      }}
                      disabled={viewMode !== "edit"}
                    />
                  </Grid>
                  {/* <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="First Name"
                          value={userFormData.first_name}
                          onChange={(e) => {
                            setUserFormData({
                              ...userFormData,
                              first_name: e.target.value,
                            });
                            setHasModifiedUser(true);
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          value={userFormData.last_name}
                          onChange={(e) => {
                            setUserFormData({
                              ...userFormData,
                              last_name: e.target.value,
                            });
                            setHasModifiedUser(true);
                          }}
                        />
                      </Grid> */}
                  {/* <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Phone"
                          value={userFormData.phone}
                          onChange={(e) => {
                            setUserFormData({
                              ...userFormData,
                              phone: e.target.value,
                            });
                            setHasModifiedUser(true);
                          }}
                        />
                      </Grid> */}
                  {/* <Grid item xs={12} sm={6}>
                        <Autocomplete
                          options={departments}
                          getOptionLabel={(option) => option.name || ""}
                          value={departments.find((d) => d.id === userFormData.department_id) || null}
                          onChange={(event, newValue) => {
                            setUserFormData({
                              ...userFormData,
                              department_id: newValue ? newValue.id : null,
                              department: newValue ? newValue.name : "",
                            });
                            setHasModifiedUser(true);
                          }}
                          loading={departmentsLoading}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Department"
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {departmentsLoading ? (
                                      <CircularProgress color="inherit" size={20} />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                  </>
                                ),
                              }}
                            />
                          )}
                        />
                      </Grid> */}
                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      disabled={viewMode !== "edit"}
                      options={roles}
                      getOptionLabel={(option) => option.name || ""}
                      value={
                        roles.find((r) => r.id === userFormData.role_id) || null
                      }
                      onChange={(event, newValue) => {
                        setUserFormData({
                          ...userFormData,
                          role_id: newValue ? newValue.id : null,
                          role: newValue ? newValue.name : "",
                        });
                        setHasModifiedUser(true);
                      }}
                      loading={rolesLoading}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Role"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {rolesLoading ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
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
                          onChange={(e) => {
                            setUserFormData({
                              ...userFormData,
                              is_active: e.target.checked,
                            });
                            setHasModifiedUser(true);
                          }}
                        />
                      }
                      label="Active"
                    />
                  </Grid>
                  {/* <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={userFormData.is_active}
                              onChange={(e) => {
                                setUserFormData({
                                  ...userFormData,
                                  is_active: e.target.checked,
                                });
                                setHasModifiedUser(true);
                              }}
                            />
                          }
                          label="Is Active"
                        />
                      </Grid> */}
                  {/* <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={userFormData.is_superuser}
                              onChange={(e) => {
                                setUserFormData({
                                  ...userFormData,
                                  is_superuser: e.target.checked,
                                });
                                setHasModifiedUser(true);
                              }}
                            />
                          }
                          label="Superuser Status"
                        />
                      </Grid> */}
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </TabPanel>
        {/* )} */}
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
            <strong>{selectedEmployee?.name}</strong>? This action cannot be
            undone.
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

export default EmployeeManagement;
