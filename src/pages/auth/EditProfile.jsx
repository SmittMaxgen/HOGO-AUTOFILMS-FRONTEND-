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
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";

import { useDispatch, useSelector } from "react-redux";
import { selectAdminList } from "../../feature/Admin/adminSelector";
import { UpdateAdminUser, AdminUser } from "../../feature/Admin/adminThunks";

import HogoAFM from "../../../public/hogoAFM.png";
import CommonToast from "../../components/commonComponents/Toster";

const EditProfile = () => {
  const dispatch = useDispatch();
  const adminList = useSelector(selectAdminList);

  const [isEditing, setIsEditing] = useState(false);
  const [apiCall, setApiCall] = useState(false);

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
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <Avatar src={HogoAFM} sx={{ width: 64, height: 64 }} />
          </Grid>

          <Grid item xs>
            {isEditing ? (
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            ) : (
              <Typography fontWeight={700}>
                {adminList?.name || "Admin User"}
              </Typography>
            )}

            <Typography variant="body2" color="text.secondary">
              Administrator
            </Typography>
          </Grid>

          <Grid item>
            <IconButton>
              <FacebookIcon />
            </IconButton>
            <IconButton>
              <XIcon />
            </IconButton>
            <IconButton>
              <LinkedInIcon />
            </IconButton>
            <IconButton>
              <InstagramIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 3, mt: 3 }}>
        <Typography fontWeight={700} mb={2}>
          Personal Information
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="caption">Email</Typography>
            {isEditing ? (
              <TextField
                fullWidth
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            ) : (
              <Typography fontWeight={600}>
                {adminList?.email || "N/A"}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="caption">Phone</Typography>
            {isEditing ? (
              <TextField
                fullWidth
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
              />
            ) : (
              <Typography fontWeight={600}>
                {adminList?.mobile || "N/A"}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="caption">Role</Typography>
            <Typography fontWeight={600}>Administrator</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Stack direction="row" justifyContent="flex-end" spacing={2} mt={3}>
        {isEditing ? (
          <>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<CloseIcon />}
              onClick={handleCancel}
            >
              Cancel
            </Button>

            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </>
        ) : (
          <Button
            variant="outlined"
            startIcon={<EditOutlinedIcon />}
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default EditProfile;
