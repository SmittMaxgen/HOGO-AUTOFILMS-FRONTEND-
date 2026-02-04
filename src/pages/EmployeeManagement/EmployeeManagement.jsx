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

  // Department selector
  const departments = useSelector(selectDepartmentList);
  const roles = useSelector(selectRoleList);
  const departmentsLoading = useSelector(selectDepartmentLoading);
  const rolesLoading = useSelector(selectRoleLoading);

  // ==================== STATE MANAGEMENT ====================

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  console.log("editMode::::", editMode);
  const [createEmployeeFlag, setCreateEmployee] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [validationAlert, setValidationAlert] = useState(null);

  // Form states
  const [formData, setFormData] = useState({});

  // New employee form with proper defaults including new required fields
  const [newEmployeeForm, setNewEmployeeForm] = useState({
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
    salary: "",
    bank_account_number: "",
    ifsc_code: "",
    pan_number: "",
    aadhaar_number: "",
  });

  // File states for new employee
  const [newEmployeeFiles, setNewEmployeeFiles] = useState({
    profile_photo: null,
  });

  // Document upload state
  const [documentUploadDialog, setDocumentUploadDialog] = useState(false);
  const [documentFormData, setDocumentFormData] = useState({
    document_type: "",
    document_file: null,
    remarks: "",
  });

  // Personal details state
  const [personalDetailsDialog, setPersonalDetailsDialog] = useState(false);
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
  const [editingPersonalDetails, setEditingPersonalDetails] = useState(null);

  // Salary state
  const [salaryDialog, setSalaryDialog] = useState(false);
  const [salaryFormData, setSalaryFormData] = useState({
    basic_salary: "",
    hra: "",
    da: "",
    ta: "",
    medical_allowance: "",
    other_allowances: "",
    provident_fund: "",
    professional_tax: "",
    income_tax: "",
    other_deductions: "",
    effective_from: "",
    remarks: "",
  });
  const [editingSalary, setEditingSalary] = useState(null);

  // User state
  const [userDialog, setUserDialog] = useState(false);
  const [userFormData, setUserFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    is_active: true,
    is_staff: false,
    is_superuser: false,
  });
  const [editingUser, setEditingUser] = useState(null);

  // ==================== LIFECYCLE ====================

  useEffect(() => {
    dispatch(getEmployees());
    dispatch(getDepartments());
    dispatch(getRoles());
  }, [dispatch]);

  // useEffect(() => {
  //   if (editMode == false) {
  //     dispatch(getEmployees());
  //   }
  //   // dispatch(getDepartments());
  //   // dispatch(getRoles());
  // }, [editMode]);

  useEffect(() => {
    if (selectedEmployee && !createEmployeeFlag) {
      dispatch(getEmployees({ employee_id: selectedEmployee.id }));
      dispatch(getEmployeeDocuments({ employee_id: selectedEmployee.id }));
      dispatch(
        getEmployeePersonalDetails({ employee_id: selectedEmployee.id }),
      );
      dispatch(getEmployeeSalaries({ employee_id: selectedEmployee.id }));
      dispatch(getUsers({ employee_id: selectedEmployee.id }));
    }
  }, [selectedEmployee, dispatch, createEmployeeFlag]);

  // ==================== VALIDATION ====================

  const validateForm = () => {
    const errors = {};

    // Required Fields for API
    if (!newEmployeeForm.first_name.trim()) {
      errors.first_name = "First name is required";
    }
    if (!newEmployeeForm.last_name.trim()) {
      errors.last_name = "Last name is required";
    }
    if (!newEmployeeForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(newEmployeeForm.email)) {
      errors.email = "Email is invalid";
    }
    if (!newEmployeeForm.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(newEmployeeForm.phone)) {
      errors.phone = "Phone number must be 10 digits";
    }
    if (!newEmployeeForm.password.trim()) {
      errors.password = "Password is required";
    } else if (newEmployeeForm.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (!newEmployeeForm.employee_code.trim()) {
      errors.employee_code = "Employee code is required";
    }
    if (!newEmployeeForm.department_id) {
      errors.department_id = "Department is required";
    }
    if (!newEmployeeForm.designation.trim()) {
      errors.designation = "Designation is required";
    }
    if (!newEmployeeForm.employment_type) {
      errors.employment_type = "Employment type is required";
    }
    if (!newEmployeeForm.role_id) {
      errors.role_id = "Role is required";
    }
    if (!newEmployeeForm.joining_date) {
      errors.joining_date = "Date of joining is required";
    }
    if (!newEmployeeForm.date_of_birth) {
      errors.date_of_birth = "Date of birth is required";
    }
    if (!newEmployeeForm.gender) {
      errors.gender = "Gender is required";
    }
    if (!newEmployeeForm.address.trim()) {
      errors.address = "Address is required";
    }
    if (!newEmployeeForm.city.trim()) {
      errors.city = "City is required";
    }
    if (!newEmployeeForm.state.trim()) {
      errors.state = "State is required";
    }
    if (!newEmployeeForm.pincode.trim()) {
      errors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(newEmployeeForm.pincode)) {
      errors.pincode = "Pincode must be 6 digits";
    }

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
      salary: emp.salary || "",
      bank_account_number: emp.bank_account_number || "",
      ifsc_code: emp.ifsc_code || "",
      pan_number: emp.pan_number || "",
      aadhaar_number: emp.aadhaar_number || "",
    });
  };

  // ==================== EVENT HANDLERS ====================

  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setActiveTab(0);
    setEditMode(false);
    setValidationAlert(null);
    loadFormData(employee);
  };

  const handleBackToList = () => {
    dispatch(getEmployees());

    setSelectedEmployee(null);
    setEditMode(false);
    setCreateEmployee(false);
    setValidationAlert(null);
    setFormErrors({});
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
      updateEmployee({ id: selectedEmployee.id, data: formDataToSend }),
    );
    CommonToast("Employee updated successfully", "success");

    if (result.type.includes("fulfilled")) {
      const updatedEmployee = {
        ...selectedEmployee,
        ...formData,
      };

      setSelectedEmployee(updatedEmployee);
      loadFormData(updatedEmployee);
      dispatch(getEmployees());
      setEditMode(false);
    }
  };

  const handleDelete = async () => {
    await dispatch(deleteEmployee(selectedEmployee.id));
    CommonToast("Employee deleted successfully", "success");
    dispatch(getEmployees());
    setDeleteDialogOpen(false);
    setSelectedEmployee(null);
  };

  const handleCreateEmployee = async () => {
    if (!validateForm()) return;

    const formDataToSend = new FormData();

    // Append all form fields
    Object.entries(newEmployeeForm).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        formDataToSend.append(key, value);
      }
    });

    // Append files
    Object.entries(newEmployeeFiles).forEach(([key, file]) => {
      if (file instanceof File) {
        formDataToSend.append(key, file);
      }
    });

    try {
      const result = await dispatch(createEmployee(formDataToSend));

      if (result.type.includes("fulfilled")) {
        CommonToast("Employee created successfully", "success");
        dispatch(getEmployees());
        handleBackToList();

        // Reset form
        setNewEmployeeForm({
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
          role_id: null,
          designation: "",
          employment_type: "",
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
          salary: "",
          bank_account_number: "",
          ifsc_code: "",
          pan_number: "",
          aadhaar_number: "",
        });

        setNewEmployeeFiles({
          profile_photo: null,
        });

        setFormErrors({});
      }
    } catch (err) {
      CommonToast("Failed to create employee", "error");
    }
  };

  const handleAddEmployee = () => {
    const emptyEmployee = {
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
      role_id: null,
      designation: "",
      employment_type: "",
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
      salary: "",
      bank_account_number: "",
      ifsc_code: "",
      pan_number: "",
      aadhaar_number: "",
    };
    handleViewDetails(emptyEmployee);
    setCreateEmployee(true);
  };

  const handleUploadDocument = async () => {
    if (!documentFormData.document_type || !documentFormData.document_file) {
      CommonToast("Please select document type and file", "error");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("employee_id", selectedEmployee.id);
    formDataToSend.append("document_type", documentFormData.document_type);
    formDataToSend.append("document_file", documentFormData.document_file);
    if (documentFormData.remarks) {
      formDataToSend.append("remarks", documentFormData.remarks);
    }

    try {
      const result = await dispatch(createEmployeeDocument(formDataToSend));

      if (result.type.includes("fulfilled")) {
        CommonToast("Document uploaded successfully", "success");
        dispatch(getEmployeeDocuments({ employee_id: selectedEmployee.id }));
        setDocumentUploadDialog(false);
        setDocumentFormData({
          document_type: "",
          document_file: null,
          remarks: "",
        });
      }
    } catch (err) {
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
    if (
      !personalDetailsFormData.father_name ||
      !personalDetailsFormData.mother_name
    ) {
      CommonToast("Please fill required fields", "error");
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
          setPersonalDetailsDialog(false);
          setEditingPersonalDetails(null);
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
          setPersonalDetailsDialog(false);
        }
      }

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
      CommonToast("Failed to save personal details", "error");
    }
  };

  const handleEditPersonalDetails = (details) => {
    setEditingPersonalDetails(details);
    setPersonalDetailsFormData({
      father_name: details.father_name || "",
      mother_name: details.mother_name || "",
      marital_status: details.marital_status || "",
      spouse_name: details.spouse_name || "",
      blood_group: details.blood_group || "",
      nationality: details.nationality || "",
      religion: details.religion || "",
      caste: details.caste || "",
      identification_marks: details.identification_marks || "",
      hobbies: details.hobbies || "",
    });
    setPersonalDetailsDialog(true);
  };

  const handleDeletePersonalDetails = async (detailsId) => {
    try {
      await dispatch(deleteEmployeePersonalDetails(detailsId));
      CommonToast("Personal details deleted successfully", "success");
      dispatch(
        getEmployeePersonalDetails({ employee_id: selectedEmployee.id }),
      );
    } catch (err) {
      CommonToast("Failed to delete personal details", "error");
    }
  };

  // Salary Handlers
  const handleSaveSalary = async () => {
    if (!salaryFormData.basic_salary || !salaryFormData.effective_from) {
      CommonToast("Please fill required fields", "error");
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
          setSalaryDialog(false);
          setEditingSalary(null);
        }
      } else {
        const result = await dispatch(createEmployeeSalary(dataToSend));
        if (result.type.includes("fulfilled")) {
          CommonToast("Salary created successfully", "success");
          dispatch(getEmployeeSalaries({ employee_id: selectedEmployee.id }));
          setSalaryDialog(false);
        }
      }

      setSalaryFormData({
        basic_salary: "",
        hra: "",
        da: "",
        ta: "",
        medical_allowance: "",
        other_allowances: "",
        provident_fund: "",
        professional_tax: "",
        income_tax: "",
        other_deductions: "",
        effective_from: "",
        remarks: "",
      });
    } catch (err) {
      CommonToast("Failed to save salary", "error");
    }
  };

  const handleEditSalary = (salary) => {
    setEditingSalary(salary);
    setSalaryFormData({
      basic_salary: salary.basic_salary || "",
      hra: salary.hra || "",
      da: salary.da || "",
      ta: salary.ta || "",
      medical_allowance: salary.medical_allowance || "",
      other_allowances: salary.other_allowances || "",
      provident_fund: salary.provident_fund || "",
      professional_tax: salary.professional_tax || "",
      income_tax: salary.income_tax || "",
      other_deductions: salary.other_deductions || "",
      effective_from: salary.effective_from || "",
      remarks: salary.remarks || "",
    });
    setSalaryDialog(true);
  };

  const handleDeleteSalary = async (salaryId) => {
    try {
      await dispatch(deleteEmployeeSalary(salaryId));
      CommonToast("Salary deleted successfully", "success");
      dispatch(getEmployeeSalaries({ employee_id: selectedEmployee.id }));
    } catch (err) {
      CommonToast("Failed to delete salary", "error");
    }
  };

  // User Handlers
  const handleSaveUser = async () => {
    if (!userFormData.username || !userFormData.email) {
      CommonToast("Please fill required fields", "error");
      return;
    }

    if (!editingUser && !userFormData.password) {
      CommonToast("Password is required for new user", "error");
      return;
    }

    const dataToSend = {
      ...userFormData,
      employee_id: selectedEmployee.id,
    };

    // Don't send password if editing and password is empty
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
          setUserDialog(false);
          setEditingUser(null);
        }
      } else {
        const result = await dispatch(createUser(dataToSend));
        if (result.type.includes("fulfilled")) {
          CommonToast("User created successfully", "success");
          dispatch(getUsers({ employee_id: selectedEmployee.id }));
          setUserDialog(false);
        }
      }

      setUserFormData({
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        is_active: true,
        is_staff: false,
        is_superuser: false,
      });
    } catch (err) {
      CommonToast("Failed to save user", "error");
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserFormData({
      username: user.username || "",
      email: user.email || "",
      password: "",
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      is_active: user.is_active !== undefined ? user.is_active : true,
      is_staff: user.is_staff !== undefined ? user.is_staff : false,
      is_superuser: user.is_superuser !== undefined ? user.is_superuser : false,
    });
    setUserDialog(true);
  };

  const handleDeleteUser = async (userId) => {
    try {
      await dispatch(deleteUser(userId));
      CommonToast("User deleted successfully", "success");
      dispatch(getUsers({ employee_id: selectedEmployee.id }));
    } catch (err) {
      CommonToast("Failed to delete user", "error");
    }
  };

  // ==================== RENDER HELPER FUNCTIONS ====================

  const renderTextField = (label, field, type = "text", options = {}) => {
    const isEditable = createEmployeeFlag || editMode;

    const value = createEmployeeFlag
      ? newEmployeeForm[field]
      : editMode
        ? formData[field]
        : selectedEmployee[field];

    const requiredFields = [
      "first_name",
      "last_name",
      "name",
      "email",
      "phone",
      "password",
      "employee_code",
      "department",
      "role",
      "department_id",
      "role_id",
      "designation",
      "employment_type",
      "role_id",
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
      fullWidth: true,
      label: isRequired && createEmployeeFlag ? `${label} *` : label,
      type,
      value: value || "",
      InputProps: { readOnly: !isEditable },
      error: createEmployeeFlag && !!formErrors[field],
      helperText: createEmployeeFlag && formErrors[field],
      ...options,
    };

    if (isEditable) {
      commonProps.onChange = (e) => {
        let newValue = e.target.value;

        if (type === "tel" || options.inputMode === "numeric") {
          newValue = newValue.replace(/\D/g, "");
        }

        if (createEmployeeFlag) {
          setNewEmployeeForm({
            ...newEmployeeForm,
            [field]: newValue,
          });
          if (formErrors[field]) {
            setFormErrors({
              ...formErrors,
              [field]: undefined,
            });
          }
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

  const renderFileUpload = (label, fileKey, isRequired = false) => {
    const isEditable = createEmployeeFlag || editMode;

    return (
      <Grid item xs={12}>
        <Stack spacing={1}>
          <Typography fontWeight={500}>
            {label}{" "}
            {isRequired && createEmployeeFlag && (
              <span style={{ color: "red" }}>*</span>
            )}
          </Typography>

          {isEditable ? (
            <>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                color={formErrors[fileKey] ? "error" : "primary"}
              >
                Upload {label}
                <input
                  type="file"
                  hidden
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    if (createEmployeeFlag) {
                      setNewEmployeeFiles({
                        ...newEmployeeFiles,
                        [fileKey]: file,
                      });
                      if (formErrors[fileKey]) {
                        setFormErrors({
                          ...formErrors,
                          [fileKey]: undefined,
                        });
                      }
                    } else {
                      setFormData({
                        ...formData,
                        [fileKey]: file,
                      });
                    }
                  }}
                />
              </Button>

              {createEmployeeFlag && newEmployeeFiles[fileKey] && (
                <Typography variant="body2" mt={1} color="success.main">
                  Selected File: {newEmployeeFiles[fileKey].name}
                </Typography>
              )}

              {editMode && formData[fileKey] && (
                <Typography variant="body2" mt={1}>
                  Selected File:{" "}
                  {typeof formData[fileKey] === "string"
                    ? formData[fileKey]
                    : formData[fileKey].name}
                </Typography>
              )}
            </>
          ) : (
            <DocumentLink url={selectedEmployee[fileKey]} label={label} />
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

  if (!selectedEmployee) {
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
                    <TableCell sx={{ fontWeight: 700 }}>role</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Designation</TableCell>
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
                          <Typography fontWeight={600}>
                            {emp.employee_code}
                          </Typography>
                        </TableCell>
                        <TableCell>{emp.name}</TableCell>
                        <TableCell>{emp.department}</TableCell>
                        <TableCell>{emp.role}</TableCell>
                        <TableCell>{emp.designation}</TableCell>
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
            {createEmployeeFlag ? "Add New Employee" : "Employee Details"}
          </Typography>
          {!createEmployeeFlag && (
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

        {!createEmployeeFlag && (
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
      {validationAlert && createEmployeeFlag && (
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

          {!createEmployeeFlag && (
            <Tab
              icon={<FolderIcon />}
              iconPosition="start"
              label="Employee Documents"
            />
          )}

          {!createEmployeeFlag && (
            <Tab
              icon={<DescriptionIcon />}
              iconPosition="start"
              label="Personal Details"
            />
          )}

          {!createEmployeeFlag && (
            <Tab
              icon={<AccountBalanceIcon />}
              iconPosition="start"
              label="Salary"
            />
          )}

          {!createEmployeeFlag && (
            <Tab icon={<PersonIcon />} iconPosition="start" label="Users" />
          )}
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
                {!createEmployeeFlag && (
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
                {/* Basic Information */}
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

                {/* Password - Only for Create Mode */}
                {createEmployeeFlag && (
                  <Grid item xs={12} sm={6}>
                    {renderTextField("Password", "password", "password")}
                  </Grid>
                )}

                {/* Department - Autocomplete */}
                <Grid item xs={12} sm={6}>
                  {createEmployeeFlag || editMode ? (
                    <Autocomplete
                      options={departments}
                      getOptionLabel={(option) => option.name || ""}
                      value={
                        departments.find(
                          (d) =>
                            d.id ===
                            (createEmployeeFlag
                              ? newEmployeeForm.department_id
                              : formData.department_id),
                        ) || null
                      }
                      onChange={(event, newValue) => {
                        if (createEmployeeFlag) {
                          setNewEmployeeForm({
                            ...newEmployeeForm,
                            department_id: newValue ? newValue.id : null,
                            department: newValue ? newValue.name : "",
                          });
                          if (formErrors.department_id) {
                            setFormErrors({
                              ...formErrors,
                              department_id: undefined,
                            });
                          }
                        } else {
                          setFormData({
                            ...formData,
                            department_id: newValue ? newValue.id : null,
                            department: newValue ? newValue.name : "",
                          });
                        }
                      }}
                      loading={departmentsLoading}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={
                            createEmployeeFlag ? "Department *" : "Department"
                          }
                          error={
                            createEmployeeFlag && !!formErrors.department_id
                          }
                          helperText={
                            createEmployeeFlag && formErrors.department_id
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
                      value={selectedEmployee.department || ""}
                      InputProps={{ readOnly: true }}
                    />
                  )}
                </Grid>

                {/* Department - Autocomplete */}
                <Grid item xs={12} sm={6}>
                  {createEmployeeFlag || editMode ? (
                    <Autocomplete
                      options={roles}
                      getOptionLabel={(option) => option.name || ""}
                      value={
                        departments.find(
                          (d) =>
                            d.id ===
                            (createEmployeeFlag
                              ? newEmployeeForm.role_id
                              : formData.role_id),
                        ) || null
                      }
                      onChange={(event, newValue) => {
                        if (createEmployeeFlag) {
                          setNewEmployeeForm({
                            ...newEmployeeForm,
                            role_id: newValue ? newValue.id : null,
                            role: newValue ? newValue.name : "",
                          });
                          if (formErrors.role_id) {
                            setFormErrors({
                              ...formErrors,
                              role_id: undefined,
                            });
                          }
                        } else {
                          setFormData({
                            ...formData,
                            role_id: newValue ? newValue.id : null,
                            role: newValue ? newValue.name : "",
                          });
                        }
                      }}
                      loading={departmentsLoading}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={createEmployeeFlag ? "Role *" : "Role"}
                          error={createEmployeeFlag && !!formErrors.role_id}
                          helperText={createEmployeeFlag && formErrors.role_id}
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
                      value={selectedEmployee.role || ""}
                      InputProps={{ readOnly: true }}
                    />
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  {renderTextField("Designation", "designation")}
                </Grid>

                {/* Employment Type */}
                <Grid item xs={12} sm={6}>
                  {renderTextField(
                    "Employment Type",
                    "employment_type",
                    "text",
                    {
                      select: true,
                      children: [
                        <MenuItem key="Intern" value="Intern">
                          Full-time
                        </MenuItem>,
                        // <MenuItem key="Part-time" value="Part-time">
                        //   Part-time
                        // </MenuItem>,
                        <MenuItem key="Contract" value="Contract">
                          Contract
                        </MenuItem>,
                        <MenuItem key="Internship" value="Internship">
                          Internship
                        </MenuItem>,
                      ],
                    },
                  )}
                </Grid>

                {/* Role ID - This might need to be an autocomplete too if you have a roles table */}
                <Grid item xs={12} sm={6}>
                  {renderTextField("Role ID", "role_id", "number")}
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
                  {renderTextField("Status", "status", "text", {
                    select: true,
                    children: [
                      <MenuItem key="Active" value="Active">
                        Active
                      </MenuItem>,
                      <MenuItem key="Inactive" value="Inactive">
                        Inactive
                      </MenuItem>,
                      <MenuItem key="On Leave" value="On Leave">
                        On Leave
                      </MenuItem>,
                    ],
                  })}
                </Grid>

                {/* Address Information */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    color="primary"
                  >
                    Address Information
                  </Typography>
                </Grid>
                <Grid item xs={12}>
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
                    inputProps: {
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                      maxLength: 6,
                    },
                  })}
                </Grid>

                {/* Emergency Contact */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    color="primary"
                  >
                    Emergency Contact
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField(
                    "Emergency Contact Name",
                    "emergency_contact_name",
                  )}
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
                    },
                  )}
                </Grid>

                {/* Financial Information */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    color="primary"
                  >
                    Financial Information
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField("Salary", "salary", "tel", {
                    inputProps: {
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                    },
                  })}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField(
                    "Bank Account Number",
                    "bank_account_number",
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField("IFSC Code", "ifsc_code")}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField("PAN Number", "pan_number")}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField("Aadhaar Number", "aadhaar_number", "tel", {
                    inputProps: {
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                      maxLength: 12,
                    },
                  })}
                </Grid>

                {/* Profile Photo */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    color="primary"
                  >
                    Profile Photo
                  </Typography>
                </Grid>
                {renderFileUpload("Profile Photo", "profile_photo")}
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        {/* TAB 1: EMPLOYEE DOCUMENTS */}
        {!createEmployeeFlag && (
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
                    Employee Documents
                  </Typography>
                  <CommonButton
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setDocumentUploadDialog(true)}
                    size="small"
                  >
                    Upload Document
                  </CommonButton>
                </Box>
                <Divider sx={{ mb: 3 }} />

                {documentsLoading ? (
                  <Box display="flex" justifyContent="center" py={5}>
                    <CircularProgress />
                  </Box>
                ) : docsArray.length === 0 ? (
                  <Box textAlign="center" py={5}>
                    <FolderIcon
                      sx={{ fontSize: 60, color: "grey.400", mb: 2 }}
                    />
                    <Typography color="text.secondary">
                      No documents uploaded yet
                    </Typography>
                  </Box>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700 }}>Sr</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>
                            Document Type
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>
                            Uploaded On
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>
                            Remarks
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {docsArray?.length > 0 &&
                          docsArray?.map((doc, index) => (
                            <TableRow key={doc.id} hover>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>
                                <Typography fontWeight={600}>
                                  {doc.document_type}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                {doc.uploaded_at
                                  ? new Date(
                                      doc.uploaded_at,
                                    ).toLocaleDateString()
                                  : "—"}
                              </TableCell>
                              <TableCell>{doc.remarks || "—"}</TableCell>
                              <TableCell>
                                <IconButton
                                  size="small"
                                  color="primary"
                                  href={`${BASE_URL}${doc.document_file}`}
                                  target="_blank"
                                >
                                  <DownloadIcon />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDeleteDocument(doc.id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          </TabPanel>
        )}

        {/* TAB 2: PERSONAL DETAILS */}
        {!createEmployeeFlag && (
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
                  <CommonButton
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
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
                      setPersonalDetailsDialog(true);
                    }}
                    size="small"
                  >
                    Add Personal Details
                  </CommonButton>
                </Box>
                <Divider sx={{ mb: 3 }} />

                {personalDetailsLoading ? (
                  <Box display="flex" justifyContent="center" py={5}>
                    <CircularProgress />
                  </Box>
                ) : personalDetailsArray?.length === 0 ? (
                  <Box textAlign="center" py={5}>
                    <DescriptionIcon
                      sx={{ fontSize: 60, color: "grey.400", mb: 2 }}
                    />
                    <Typography color="text.secondary">
                      No personal details added yet
                    </Typography>
                  </Box>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700 }}>Sr</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>
                            Father Name
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>
                            Mother Name
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>
                            Marital Status
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>
                            Blood Group
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>
                            Nationality
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {personalDetailsArray?.length > 0 &&
                          personalDetailsArray?.map((detail, index) => (
                            <TableRow key={detail.id} hover>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{detail.father_name || "—"}</TableCell>
                              <TableCell>{detail.mother_name || "—"}</TableCell>
                              <TableCell>
                                {detail.marital_status || "—"}
                              </TableCell>
                              <TableCell>{detail.blood_group || "—"}</TableCell>
                              <TableCell>{detail.nationality || "—"}</TableCell>
                              <TableCell>
                                <IconButton
                                  size="small"
                                  color="warning"
                                  onClick={() =>
                                    handleEditPersonalDetails(detail)
                                  }
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() =>
                                    handleDeletePersonalDetails(detail.id)
                                  }
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          </TabPanel>
        )}

        {/* TAB 3: SALARY */}
        {!createEmployeeFlag && (
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
                  <CommonButton
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setEditingSalary(null);
                      setSalaryFormData({
                        basic_salary: "",
                        hra: "",
                        da: "",
                        ta: "",
                        medical_allowance: "",
                        other_allowances: "",
                        provident_fund: "",
                        professional_tax: "",
                        income_tax: "",
                        other_deductions: "",
                        effective_from: "",
                        remarks: "",
                      });
                      setSalaryDialog(true);
                    }}
                    size="small"
                  >
                    Add Salary
                  </CommonButton>
                </Box>
                <Divider sx={{ mb: 3 }} />

                {salariesLoading ? (
                  <Box display="flex" justifyContent="center" py={5}>
                    <CircularProgress />
                  </Box>
                ) : employeeSalary?.length === 0 ? (
                  <Box textAlign="center" py={5}>
                    <AccountBalanceIcon
                      sx={{ fontSize: 60, color: "grey.400", mb: 2 }}
                    />
                    <Typography color="text.secondary">
                      No salary information added yet
                    </Typography>
                  </Box>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700 }}>Sr</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>
                            Basic Salary
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>
                            Total Allowances
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>
                            Total Deductions
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>
                            Net Salary
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>
                            Effective From
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {employeeSalary.length > 0 &&
                          employeeSalary?.map((salary, index) => {
                            const totalAllowances =
                              (parseFloat(salary.hra) || 0) +
                              (parseFloat(salary.da) || 0) +
                              (parseFloat(salary.ta) || 0) +
                              (parseFloat(salary.medical_allowance) || 0) +
                              (parseFloat(salary.other_allowances) || 0);

                            const totalDeductions =
                              (parseFloat(salary.provident_fund) || 0) +
                              (parseFloat(salary.professional_tax) || 0) +
                              (parseFloat(salary.income_tax) || 0) +
                              (parseFloat(salary.other_deductions) || 0);

                            const netSalary =
                              (parseFloat(salary.basic_salary) || 0) +
                              totalAllowances -
                              totalDeductions;

                            return (
                              <TableRow key={salary.id} hover>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                  ₹
                                  {parseFloat(
                                    salary.basic_salary || 0,
                                  ).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                  ₹{totalAllowances.toLocaleString()}
                                </TableCell>
                                <TableCell>
                                  ₹{totalDeductions.toLocaleString()}
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    fontWeight={600}
                                    color="success.main"
                                  >
                                    ₹{netSalary.toLocaleString()}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  {salary.effective_from
                                    ? new Date(
                                        salary.effective_from,
                                      ).toLocaleDateString()
                                    : "—"}
                                </TableCell>
                                <TableCell>
                                  <IconButton
                                    size="small"
                                    color="warning"
                                    onClick={() => handleEditSalary(salary)}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() =>
                                      handleDeleteSalary(salary.id)
                                    }
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          </TabPanel>
        )}

        {/* TAB 4: USERS */}
        {!createEmployeeFlag && (
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
                  <CommonButton
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
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
                      });
                      setUserDialog(true);
                    }}
                    size="small"
                  >
                    Add User
                  </CommonButton>
                </Box>
                <Divider sx={{ mb: 3 }} />

                {usersLoading ? (
                  <Box display="flex" justifyContent="center" py={5}>
                    <CircularProgress />
                  </Box>
                ) : users.length === 0 ? (
                  <Box textAlign="center" py={5}>
                    <PersonIcon
                      sx={{ fontSize: 60, color: "grey.400", mb: 2 }}
                    />
                    <Typography color="text.secondary">
                      No user accounts created yet
                    </Typography>
                  </Box>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700 }}>Sr</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>
                            Username
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>
                            First Name
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>
                            Last Name
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users.map((user, index) => (
                          <TableRow key={user.id} hover>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              <Typography fontWeight={600}>
                                {user.username}
                              </Typography>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.first_name || "—"}</TableCell>
                            <TableCell>{user.last_name || "—"}</TableCell>
                            <TableCell>
                              <Chip
                                label={user.is_active ? "Active" : "Inactive"}
                                color={user.is_active ? "success" : "default"}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              {user.is_superuser ? (
                                <Chip
                                  label="Superuser"
                                  color="error"
                                  size="small"
                                />
                              ) : user.is_staff ? (
                                <Chip
                                  label="Staff"
                                  color="primary"
                                  size="small"
                                />
                              ) : (
                                <Chip
                                  label="User"
                                  color="default"
                                  size="small"
                                />
                              )}
                            </TableCell>
                            <TableCell>
                              <IconButton
                                size="small"
                                color="warning"
                                onClick={() => handleEditUser(user)}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          </TabPanel>
        )}
      </Box>

      {/* Submit Button for Create Mode */}
      {createEmployeeFlag && (
        <Box sx={{ p: 3, pt: 0 }}>
          <CommonButton
            variant="contained"
            size="large"
            onClick={handleCreateEmployee}
            disabled={loading || createLoading}
          >
            {loading || createLoading ? "Creating..." : "Create Employee"}
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

      {/* Document Upload Dialog */}
      <Dialog
        open={documentUploadDialog}
        onClose={() => setDocumentUploadDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upload Employee Document</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Document Type *"
                  select
                  value={documentFormData.document_type}
                  onChange={(e) =>
                    setDocumentFormData({
                      ...documentFormData,
                      document_type: e.target.value,
                    })
                  }
                >
                  <MenuItem value="Aadhaar Card">Aadhaar Card</MenuItem>
                  <MenuItem value="PAN Card">PAN Card</MenuItem>
                  <MenuItem value="Passport">Passport</MenuItem>
                  <MenuItem value="Driving License">Driving License</MenuItem>
                  <MenuItem value="Educational Certificate">
                    Educational Certificate
                  </MenuItem>
                  <MenuItem value="Experience Letter">
                    Experience Letter
                  </MenuItem>
                  <MenuItem value="Offer Letter">Offer Letter</MenuItem>
                  <MenuItem value="Appointment Letter">
                    Appointment Letter
                  </MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  startIcon={<CloudUploadIcon />}
                >
                  Choose File *
                  <input
                    type="file"
                    hidden
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setDocumentFormData({
                          ...documentFormData,
                          document_file: file,
                        });
                      }
                    }}
                  />
                </Button>
                {documentFormData.document_file && (
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Selected: {documentFormData.document_file.name}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Remarks"
                  multiline
                  rows={3}
                  value={documentFormData.remarks}
                  onChange={(e) =>
                    setDocumentFormData({
                      ...documentFormData,
                      remarks: e.target.value,
                    })
                  }
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDocumentUploadDialog(false)}>Cancel</Button>
          <CommonButton
            variant="contained"
            onClick={handleUploadDocument}
            disabled={createDocumentLoading}
          >
            {createDocumentLoading ? "Uploading..." : "Upload"}
          </CommonButton>
        </DialogActions>
      </Dialog>

      {/* Personal Details Dialog */}
      <Dialog
        open={personalDetailsDialog}
        onClose={() => setPersonalDetailsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingPersonalDetails
            ? "Edit Personal Details"
            : "Add Personal Details"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Father Name *"
                  value={personalDetailsFormData.father_name}
                  onChange={(e) =>
                    setPersonalDetailsFormData({
                      ...personalDetailsFormData,
                      father_name: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Mother Name *"
                  value={personalDetailsFormData.mother_name}
                  onChange={(e) =>
                    setPersonalDetailsFormData({
                      ...personalDetailsFormData,
                      mother_name: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Marital Status"
                  select
                  value={personalDetailsFormData.marital_status}
                  onChange={(e) =>
                    setPersonalDetailsFormData({
                      ...personalDetailsFormData,
                      marital_status: e.target.value,
                    })
                  }
                >
                  <MenuItem value="Single">Single</MenuItem>
                  <MenuItem value="Married">Married</MenuItem>
                  <MenuItem value="Divorced">Divorced</MenuItem>
                  <MenuItem value="Widowed">Widowed</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Spouse Name"
                  value={personalDetailsFormData.spouse_name}
                  onChange={(e) =>
                    setPersonalDetailsFormData({
                      ...personalDetailsFormData,
                      spouse_name: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Blood Group"
                  select
                  value={personalDetailsFormData.blood_group}
                  onChange={(e) =>
                    setPersonalDetailsFormData({
                      ...personalDetailsFormData,
                      blood_group: e.target.value,
                    })
                  }
                >
                  <MenuItem value="A+">A+</MenuItem>
                  <MenuItem value="A-">A-</MenuItem>
                  <MenuItem value="B+">B+</MenuItem>
                  <MenuItem value="B-">B-</MenuItem>
                  <MenuItem value="AB+">AB+</MenuItem>
                  <MenuItem value="AB-">AB-</MenuItem>
                  <MenuItem value="O+">O+</MenuItem>
                  <MenuItem value="O-">O-</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nationality"
                  value={personalDetailsFormData.nationality}
                  onChange={(e) =>
                    setPersonalDetailsFormData({
                      ...personalDetailsFormData,
                      nationality: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Religion"
                  value={personalDetailsFormData.religion}
                  onChange={(e) =>
                    setPersonalDetailsFormData({
                      ...personalDetailsFormData,
                      religion: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Caste"
                  value={personalDetailsFormData.caste}
                  onChange={(e) =>
                    setPersonalDetailsFormData({
                      ...personalDetailsFormData,
                      caste: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Identification Marks"
                  value={personalDetailsFormData.identification_marks}
                  onChange={(e) =>
                    setPersonalDetailsFormData({
                      ...personalDetailsFormData,
                      identification_marks: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Hobbies"
                  multiline
                  rows={2}
                  value={personalDetailsFormData.hobbies}
                  onChange={(e) =>
                    setPersonalDetailsFormData({
                      ...personalDetailsFormData,
                      hobbies: e.target.value,
                    })
                  }
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPersonalDetailsDialog(false)}>
            Cancel
          </Button>
          <CommonButton
            variant="contained"
            onClick={handleSavePersonalDetails}
            disabled={createPersonalDetailsLoading}
          >
            {createPersonalDetailsLoading ? "Saving..." : "Save"}
          </CommonButton>
        </DialogActions>
      </Dialog>

      {/* Salary Dialog */}
      <Dialog
        open={salaryDialog}
        onClose={() => setSalaryDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingSalary ? "Edit Salary" : "Add Salary"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle2"
                  color="primary"
                  fontWeight={600}
                >
                  Earnings
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Basic Salary *"
                  type="number"
                  value={salaryFormData.basic_salary}
                  onChange={(e) =>
                    setSalaryFormData({
                      ...salaryFormData,
                      basic_salary: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="HRA"
                  type="number"
                  value={salaryFormData.hra}
                  onChange={(e) =>
                    setSalaryFormData({
                      ...salaryFormData,
                      hra: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="DA"
                  type="number"
                  value={salaryFormData.da}
                  onChange={(e) =>
                    setSalaryFormData({
                      ...salaryFormData,
                      da: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="TA"
                  type="number"
                  value={salaryFormData.ta}
                  onChange={(e) =>
                    setSalaryFormData({
                      ...salaryFormData,
                      ta: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Medical Allowance"
                  type="number"
                  value={salaryFormData.medical_allowance}
                  onChange={(e) =>
                    setSalaryFormData({
                      ...salaryFormData,
                      medical_allowance: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Other Allowances"
                  type="number"
                  value={salaryFormData.other_allowances}
                  onChange={(e) =>
                    setSalaryFormData({
                      ...salaryFormData,
                      other_allowances: e.target.value,
                    })
                  }
                />
              </Grid>

              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="error" fontWeight={600}>
                  Deductions
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Provident Fund"
                  type="number"
                  value={salaryFormData.provident_fund}
                  onChange={(e) =>
                    setSalaryFormData({
                      ...salaryFormData,
                      provident_fund: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Professional Tax"
                  type="number"
                  value={salaryFormData.professional_tax}
                  onChange={(e) =>
                    setSalaryFormData({
                      ...salaryFormData,
                      professional_tax: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Income Tax"
                  type="number"
                  value={salaryFormData.income_tax}
                  onChange={(e) =>
                    setSalaryFormData({
                      ...salaryFormData,
                      income_tax: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Other Deductions"
                  type="number"
                  value={salaryFormData.other_deductions}
                  onChange={(e) =>
                    setSalaryFormData({
                      ...salaryFormData,
                      other_deductions: e.target.value,
                    })
                  }
                />
              </Grid>

              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography
                  variant="subtitle2"
                  color="primary"
                  fontWeight={600}
                >
                  Other Details
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Effective From *"
                  type="date"
                  value={salaryFormData.effective_from}
                  onChange={(e) =>
                    setSalaryFormData({
                      ...salaryFormData,
                      effective_from: e.target.value,
                    })
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Remarks"
                  multiline
                  rows={2}
                  value={salaryFormData.remarks}
                  onChange={(e) =>
                    setSalaryFormData({
                      ...salaryFormData,
                      remarks: e.target.value,
                    })
                  }
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSalaryDialog(false)}>Cancel</Button>
          <CommonButton
            variant="contained"
            onClick={handleSaveSalary}
            disabled={createSalaryLoading}
          >
            {createSalaryLoading ? "Saving..." : "Save"}
          </CommonButton>
        </DialogActions>
      </Dialog>

      {/* User Dialog */}
      <Dialog
        open={userDialog}
        onClose={() => setUserDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editingUser ? "Edit User" : "Add User"}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Username *"
                  value={userFormData.username}
                  onChange={(e) =>
                    setUserFormData({
                      ...userFormData,
                      username: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email *"
                  type="email"
                  value={userFormData.email}
                  onChange={(e) =>
                    setUserFormData({
                      ...userFormData,
                      email: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={
                    editingUser
                      ? "Password (leave blank to keep current)"
                      : "Password *"
                  }
                  type="password"
                  value={userFormData.password}
                  onChange={(e) =>
                    setUserFormData({
                      ...userFormData,
                      password: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={userFormData.first_name}
                  onChange={(e) =>
                    setUserFormData({
                      ...userFormData,
                      first_name: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={userFormData.last_name}
                  onChange={(e) =>
                    setUserFormData({
                      ...userFormData,
                      last_name: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={userFormData.is_active}
                      onChange={(e) =>
                        setUserFormData({
                          ...userFormData,
                          is_active: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Active"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={userFormData.is_staff}
                      onChange={(e) =>
                        setUserFormData({
                          ...userFormData,
                          is_staff: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Staff Status"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={userFormData.is_superuser}
                      onChange={(e) =>
                        setUserFormData({
                          ...userFormData,
                          is_superuser: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Superuser Status"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDialog(false)}>Cancel</Button>
          <CommonButton
            variant="contained"
            onClick={handleSaveUser}
            disabled={createUserLoading}
          >
            {createUserLoading ? "Saving..." : "Save"}
          </CommonButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeManagement;
