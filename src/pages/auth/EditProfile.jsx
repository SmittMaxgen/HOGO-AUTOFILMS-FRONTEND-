import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Avatar,
  Button,
  IconButton,
  Divider,
  TextField,
  Stack,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CloseIcon from "@mui/icons-material/Close";
import LockResetIcon from "@mui/icons-material/LockReset";
import SaveIcon from "@mui/icons-material/Save";

import { useDispatch, useSelector } from "react-redux";
import { selectAdminList } from "../../feature/Admin/adminSelector";
import { UpdateAdminUser, AdminUser } from "../../feature/Admin/adminThunks";
import {
  forgotPassword,
  resetPassword,
} from "../../feature/profileSettings/profileSettingsThunks";
import {
  selectForgotPasswordLoading,
  selectForgotPasswordError,
  selectForgotPasswordSuccess,
  clearForgotPasswordState,
} from "../../feature/profileSettings/profileSettingsSlice";

import HogoAFM from "../../../public/hogoAFM.png";
import CommonToast from "../../components/commonComponents/Toster";

const gradientBtn = {
  background: "linear-gradient(90deg, #D20000 0%, #8B0000 100%)",
  color: "#fff",
  fontWeight: 600,
  textTransform: "none",
  borderRadius: "8px",
  px: 3,
  "&:hover": {
    background: "linear-gradient(90deg, #b30000 0%, #6a0000 100%)",
  },
  "&:disabled": {
    opacity: 0.6,
    color: "#fff",
  },
};

const cancelBtn = {
  borderColor: "#0d0e36",
  color: "#0d0e36",
  fontWeight: 600,
  textTransform: "none",
  borderRadius: "8px",
  px: 3,
  "&:hover": {
    background: "#f5f5f5",
    borderColor: "#0d0e36",
  },
};

const EditProfile = () => {
  const dispatch = useDispatch();
  const adminList = useSelector(selectAdminList);

  const [isEditing, setIsEditing] = useState(false);
  const [apiCall, setApiCall] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [passwordError, setPasswordError] = useState("");

  const forgotPasswordLoading = useSelector(selectForgotPasswordLoading);
  const forgotPasswordSuccess = useSelector(selectForgotPasswordSuccess);
  const forgotPasswordErr = useSelector(selectForgotPasswordError);

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  useEffect(() => {
    if (adminList) {
      setForm({
        name: adminList.name || "",
        email: adminList.email || "",
        mobile: adminList.mobile || "",
      });
    }
  }, [adminList]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    dispatch(
      UpdateAdminUser({
        id: adminList.id,
        data: form,
      }),
    )
      .unwrap()
      .then(() => {
        setIsEditing(false);
        CommonToast("Profile updated successfully", "success");
        dispatch(AdminUser());
      })
      .catch((err) => {
        CommonToast(err || "Failed to update profile", "error");
      });
    setApiCall(true);
  };

  const handleCancel = () => {
    setForm({
      name: adminList.name || "",
      email: adminList.email || "",
      mobile: adminList.mobile || "",
    });
    setIsEditing(false);
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    setPasswordError("");
  };

  const handleResetPassword = () => {
    if (
      !passwordForm.old_password ||
      !passwordForm.new_password ||
      !passwordForm.confirm_password
    ) {
      setPasswordError("All fields are required.");
      return;
    }
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }
    dispatch(
      resetPassword({
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password,
        confirm_password: passwordForm.confirm_password,
      }),
    )
      .unwrap()
      .then((res) => {
        CommonToast(res?.message || "Password reset successfully", "success");
        setPasswordForm({
          old_password: "",
          new_password: "",
          confirm_password: "",
        });
        setShowPasswordSection(false);
        dispatch(clearForgotPasswordState());
      })
      .catch((err) => {
        CommonToast(err || "Failed to reset password", "error");
      });
  };

  const handleCancelPassword = () => {
    setPasswordForm({
      old_password: "",
      new_password: "",
      confirm_password: "",
    });
    setPasswordError("");
    setShowPasswordSection(false);
    dispatch(clearForgotPasswordState());
  };

  const getAdminUser = () => {
    dispatch(AdminUser());
  };

  useEffect(() => {
    if (apiCall === true) {
      getAdminUser();
      setIsEditing(false);
      setApiCall(false);
    }
  }, [apiCall]);

  return (
    <Box sx={{ p: 3, backgroundColor: "#fff", minHeight: "100vh" }}>
      {/* Personal Information Card */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: "1px solid #e0e0e0",
          backgroundColor: "#fff",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography fontWeight={700} fontSize={16} color="#0d0e36">
            Personal Information
          </Typography>

          {!isEditing && (
            <Button
              variant="outlined"
              startIcon={<EditOutlinedIcon />}
              onClick={() => setIsEditing(true)}
              sx={{
                borderColor: "#0d0e36",
                color: "#0d0e36",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "8px",
                px: 2.5,
                "&:hover": {
                  background: "#f5f5f5",
                  borderColor: "#0d0e36",
                },
              }}
            >
              Edit
            </Button>
          )}
        </Stack>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={500}
            >
              Email
            </Typography>
            {isEditing ? (
              <TextField
                fullWidth
                name="email"
                value={form.email}
                onChange={handleChange}
                size="small"
                sx={{ mt: 0.5 }}
              />
            ) : (
              <Typography fontWeight={600} color="#0d0e36" mt={0.5}>
                {adminList?.email || "N/A"}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={500}
            >
              Phone
            </Typography>
            {isEditing ? (
              <TextField
                fullWidth
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                size="small"
                sx={{ mt: 0.5 }}
              />
            ) : (
              <Typography fontWeight={600} color="#0d0e36" mt={0.5}>
                {adminList?.mobile || "N/A"}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={500}
            >
              Role
            </Typography>
            <Typography fontWeight={600} color="#0d0e36" mt={0.5}>
              Administrator
            </Typography>
          </Grid>
        </Grid>

        {/* Save / Cancel inside the card when editing */}
        {isEditing && (
          <Stack direction="row" justifyContent="flex-end" spacing={2} mt={3}>
            <Button
              variant="outlined"
              startIcon={<CloseIcon />}
              onClick={handleCancel}
              sx={cancelBtn}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              sx={gradientBtn}
            >
              Save Changes
            </Button>
          </Stack>
        )}
      </Paper>

      {/* Change Password Card */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          mt: 3,
          border: "1px solid #e0e0e0",
          backgroundColor: "#fff",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography fontWeight={700} fontSize={16} color="#0d0e36">
            Change Password
          </Typography>

          {!showPasswordSection && (
            <Button
              variant="contained"
              startIcon={<LockResetIcon />}
              onClick={() => setShowPasswordSection(true)}
              sx={gradientBtn}
            >
              Change Password
            </Button>
          )}
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {showPasswordSection ? (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Old Password"
                  name="old_password"
                  type="password"
                  value={passwordForm.old_password}
                  onChange={handlePasswordChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="New Password"
                  name="new_password"
                  type="password"
                  value={passwordForm.new_password}
                  onChange={handlePasswordChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirm_password"
                  type="password"
                  value={passwordForm.confirm_password}
                  onChange={handlePasswordChange}
                  size="small"
                />
              </Grid>

              {passwordError && (
                <Grid item xs={12}>
                  <Typography color="error" variant="body2" fontWeight={500}>
                    {passwordError}
                  </Typography>
                </Grid>
              )}
            </Grid>

            <Stack direction="row" justifyContent="flex-end" spacing={2} mt={3}>
              <Button
                variant="outlined"
                startIcon={<CloseIcon />}
                onClick={handleCancelPassword}
                sx={cancelBtn}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleResetPassword}
                disabled={forgotPasswordLoading}
                sx={gradientBtn}
              >
                {forgotPasswordLoading ? "Saving..." : "Save Password"}
              </Button>
            </Stack>
          </>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Click "Change Password" to update your password.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default EditProfile;
