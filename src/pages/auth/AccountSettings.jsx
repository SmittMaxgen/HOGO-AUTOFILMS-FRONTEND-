import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Divider,
  Switch,
  FormControlLabel,
  Stack,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CommonButton from "../../components/commonComponents/CommonButton";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2rem",
    // maxWidth: 900,
    margin: "0 auto",
  },
  section: {
    marginBottom: "2rem",
    padding: "1.5rem",
    border: "1px solid #e0e0e0",
    borderRadius: "12px",
    backgroundColor: "#fff",
  },
  avatarContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "1rem",
    gap: "1rem",
  },
  avatar: {
    width: 80,
    height: 80,
    cursor: "pointer",
  },
  uploadButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    textTransform: "none",
  },
  formRow: {
    marginBottom: "1.5rem",
  },
  sectionTitle: {
    marginBottom: "1rem",
    fontWeight: 600,
  },
  saveButton: {
    marginTop: "1rem",
  },
  profileInfoField: {
    marginTop: "10px",
  },
}));

const AccountSettings = () => {
  const classes = useStyles();

  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@example.com",
    password: "",
    newPassword: "",
    notifications: true,
    darkMode: false,
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleToggle = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.checked });
  };

  const handleSave = () => {
  };

  return (
    <Box className={classes.root}>
      <Typography
        variant="h4"
        fontWeight={700}
        sx={{ color: "#7E7E7E", mb: 2 }}
      >
        Account Setting
      </Typography>

      {/* Profile Info */}
      <Box className={classes.section}>
        <Typography variant="h6" className={classes.sectionTitle}>
          Profile Information
        </Typography>
        <Box className={classes.avatarContainer}>
          <Avatar className={classes.avatar}>A</Avatar>
          <Button
            variant="outlined"
            component="label"
            className={classes.uploadButton}
          >
            <PhotoCameraIcon />
            Upload Photo
            <input hidden accept="image/*" type="file" />
          </Button>
        </Box>
        <Box>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className={classes.formRow}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className={classes.formRow}
          />
        </Box>
      </Box>

      {/* Change Password */}
      {/* <Box className={classes.section}>
        <Typography variant="h6" className={classes.sectionTitle}>
          Change Password
        </Typography>
        <TextField
          fullWidth
          type="password"
          label="Current Password"
          name="password"
          value={profile.password}
          onChange={handleChange}
          className={classes.formRow}
        />
        <TextField
          fullWidth
          type="password"
          label="New Password"
          name="newPassword"
          value={profile.newPassword}
          onChange={handleChange}
          className={classes.formRow}
        />
      </Box> */}

      {/* Preferences */}
      <Box className={classes.section}>
        <Typography variant="h6" className={classes.sectionTitle}>
          Preferences
        </Typography>
        <FormControlLabel
          control={
            <Switch
              disabled={true}
              checked={false}
              onChange={handleToggle}
              name="notifications"
              color="primary"
            />
          }
          label="Enable Notifications"
        />
        {/* <FormControlLabel
          control={
            <Switch
              disabled={true}
              checked={profile.darkMode}
              onChange={handleToggle}
              name="darkMode"
              color="primary"
            />
          }
          label="Dark Mode"
        /> */}
      </Box>

      <CommonButton
        variant="contained"
        color="primary"
        onClick={handleSave}
        className={classes.saveButton}
      >
        Save Changes
      </CommonButton>
    </Box>
  );
};

export default AccountSettings;
