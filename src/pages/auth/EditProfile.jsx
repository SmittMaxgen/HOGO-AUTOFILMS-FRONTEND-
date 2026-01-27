import React from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Avatar,
  Button,
  IconButton,
  Divider,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import HogoAFM from "../../../public/hogoAFM.png";
import { useSelector } from "react-redux";

import { selectAdminList } from "../../feature/Admin/adminSelector";

const EditProfile = () => {

  const adminList = useSelector(selectAdminList);

  const profile = {
    name: adminList?.name || "Admin User",
    role: "Administrator",
    location: "N/A",
    email: adminList?.email || "N/A",
    phone: "N/A",
    country: "N/A",
    city: "N/A",
    postal: "N/A",
    taxId: "N/A",
    avatar: HogoAFM,
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <Avatar src={profile.avatar} sx={{ width: 64, height: 64 }} />
          </Grid>

          <Grid item xs>
            <Typography fontWeight={700}>{profile.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {profile.role} | {profile.location}
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

          <Grid item>
            <Button
              variant="outlined"
              startIcon={<EditOutlinedIcon />}
              sx={{ borderRadius: 5 }}
            >
              Edit
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 3, mt: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography fontWeight={700}>Personal Information</Typography>
          <Button
            size="small"
            variant="outlined"
            startIcon={<EditOutlinedIcon />}
          >
            Edit
          </Button>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption">Full Name</Typography>
            <Typography fontWeight={600}>{profile.name}</Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption">Role</Typography>
            <Typography fontWeight={600}>{profile.role}</Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption">Email</Typography>
            <Typography fontWeight={600}>{profile.email}</Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption">Phone</Typography>
            <Typography fontWeight={600}>{profile.phone}</Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption">Country</Typography>
            <Typography fontWeight={600}>{profile.country}</Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption">City</Typography>
            <Typography fontWeight={600}>{profile.city}</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 3, mt: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography fontWeight={700}>Address</Typography>
          <Button
            size="small"
            variant="outlined"
            startIcon={<EditOutlinedIcon />}
          >
            Edit
          </Button>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption">Location</Typography>
            <Typography fontWeight={600}>{profile.location}</Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption">Postal Code</Typography>
            <Typography fontWeight={600}>{profile.postal}</Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption">TAX ID</Typography>
            <Typography fontWeight={600}>{profile.taxId}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default EditProfile;
