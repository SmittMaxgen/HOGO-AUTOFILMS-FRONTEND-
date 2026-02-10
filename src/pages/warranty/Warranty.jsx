// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
//   Chip,
//   Alert,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Typography,
//   Box,
//   CircularProgress,
//   Grid,
//   Divider,
//   Stack,
//   IconButton,
//   Menu,
//   MenuItem,
// } from "@mui/material";
// import {
//   CheckCircle,
//   Cancel,
//   HourglassEmpty,
//   Visibility,
//   DirectionsCar,
//   Person,
//   CalendarToday,
// } from "@mui/icons-material";
// import {
//   getWarranties,
//   updateWarranty,
// } from "../../feature/Warranty/warrantyThunks";
// import {
//   selectWarrantyList,
//   selectWarrantyCount,
//   selectWarrantyLoading,
//   selectWarrantyUpdateLoading,
//   selectWarrantyUpdateSuccess,
//   selectWarrantyError,
// } from "../../feature/Warranty/warrantySelector";

// import VisibilityIcon from "@mui/icons-material/Visibility";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import CommonButton from "../../components/commonComponents/CommonButton";
// import CommonToast from "../../components/commonComponents/Toster";

// const BASE_URL = "http://hogofilm.pythonanywhere.com/";

// const WarrantyManagement = () => {
//   const dispatch = useDispatch();

//   const warranties = useSelector(selectWarrantyList);
//   const count = useSelector(selectWarrantyCount);
//   const loading = useSelector(selectWarrantyLoading);
//   const updateLoading = useSelector(selectWarrantyUpdateLoading);
//   const updateSuccess = useSelector(selectWarrantyUpdateSuccess);
//   const error = useSelector(selectWarrantyError);

//   const [anchorEl, setAnchorEl] = useState(null);

//   const handleOpenMenu = (event, warranty) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedWarranty(warranty);
//   };

//   const handleCloseMenu = () => {
//     setAnchorEl(null);
//   };

//   const [selectedWarranty, setSelectedWarranty] = useState(null);
//   console.log("selectedWarranty::::", selectedWarranty);
//   const [showViewDialog, setShowViewDialog] = useState(false);
//   const [showRejectDialog, setShowRejectDialog] = useState(false);
//   const [rejectionReason, setRejectionReason] = useState("");
//   const [alert, setAlert] = useState({
//     show: false,
//     message: "",
//     type: "success",
//   });

//   useEffect(() => {
//     dispatch(getWarranties());
//   }, [dispatch]);

//   useEffect(() => {
//     if (updateSuccess) {
//       CommonToast("Warranty updated successfully", "success");
//       setShowViewDialog(false);
//       setShowRejectDialog(false);
//       setRejectionReason("");
//       setSelectedWarranty(null);
//       dispatch(getWarranties());
//     }
//   }, [updateSuccess, dispatch]);

//   useEffect(() => {
//     if (error) {
//       CommonToast(error, "error");
//     }
//   }, [error, dispatch]);

//   const handleView = (warranty) => {
//     setSelectedWarranty(warranty);
//     setShowViewDialog(true);
//   };

//   const handleAccept = () => {
//     if (window.confirm("Are you sure you want to accept this warranty?")) {
//       dispatch(
//         updateWarranty({
//           id: selectedWarranty.id,
//           data: { warranty_status: "ACCEPT" },
//         }),
//       );
//     }
//   };

//   const handleWarrantyStatusChange = (status, warranty, reason = "") => {
//     dispatch(
//       updateWarranty({
//         id: warranty.id,
//         data: {
//           warranty_status: status,
//           rejection_reason: status === "REJECT" ? reason : "",
//         },
//       }),
//     );
//   };

//   const handleRejectClick = () => {
//     setShowViewDialog(false);
//     setShowRejectDialog(true);
//   };

//   const confirmReject = () => {
//     if (!rejectionReason.trim()) {
//       CommonToast("Please provide a rejection reason", "error");
//       return;
//     }

//     dispatch(
//       updateWarranty({
//         id: selectedWarranty.id,
//         data: {
//           warranty_status: "REJECT",
//           rejection_reason: rejectionReason,
//         },
//       }),
//     );
//   };

//   const showAlert = (message, type) => {
//     setAlert({ show: true, message, type });
//     setTimeout(
//       () => setAlert({ show: false, message: "", type: "success" }),
//       3000,
//     );
//   };

//   const getStatusChip = (status) => {
//     const statusConfig = {
//       PENDING: {
//         color: "warning",
//         icon: <HourglassEmpty fontSize="small" />,
//         label: "Pending",
//       },
//       ACTIVE: {
//         color: "success",
//         icon: <CheckCircle fontSize="small" />,
//         label: "Accepted",
//       },
//       REJECT: {
//         color: "error",
//         icon: <Cancel fontSize="small" />,
//         label: "Rejected",
//       },
//     };

//     const config = statusConfig[status] || statusConfig.PENDING;

//     return (
//       <Chip
//         icon={config.icon}
//         label={config.label}
//         color={config.color}
//         size="small"
//       />
//     );
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString("en-IN", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const getImageUrl = (imagePath) => {
//     if (!imagePath) return "";
//     console.log("imagePath::::", imagePath);
//     // if (imagePath.startsWith("http")) return imagePath;
//     return `${BASE_URL}/${imagePath}`;
//   };

//   if (loading) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           minHeight: "100vh",
//         }}
//       >
//         <CircularProgress size={60} />
//         <Typography variant="body1" sx={{ mt: 2 }} color="textSecondary">
//           Loading warranties...
//         </Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ p: 3 }}>
//       {alert.show && (
//         <Alert
//           severity={alert.type}
//           onClose={() =>
//             setAlert({ show: false, message: "", type: "success" })
//           }
//           sx={{ mb: 3 }}
//         >
//           {alert.message}
//         </Alert>
//       )}

//       <Stack
//         direction="row"
//         justifyContent=""
//         alignItems="center"
//         spacing={1}
//         mb={3}
//       >
//         <Typography
//           variant="h4"
//           fontWeight={700}
//           sx={{ display: "flex", alignItems: "center", color: "#7E7E7E" }}
//         >
//           <IconButton onClick={() => setShowViewDialog(false)}>
//             {showViewDialog && (
//               <ArrowBackIcon sx={{ color: "grey", marginRight: "5px" }} />
//             )}
//           </IconButton>
//           Warranty
//         </Typography>
//       </Stack>

//       {!showViewDialog && (
//         <TableContainer component={Paper} elevation={3}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>
//                   <strong>Serial ID</strong>
//                 </TableCell>
//                 <TableCell>
//                   <strong>Car Details</strong>
//                 </TableCell>
//                 <TableCell>
//                   <strong>Detailer Name</strong>
//                 </TableCell>
//                 <TableCell>
//                   <strong>Mobile</strong>
//                 </TableCell>
//                 <TableCell>
//                   <strong>Installation Date</strong>
//                 </TableCell>
//                 <TableCell>
//                   <strong>Warranty Period</strong>
//                 </TableCell>
//                 <TableCell>
//                   <strong>Status</strong>
//                 </TableCell>
//                 <TableCell align="center">
//                   <strong>Action</strong>
//                 </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {warranties.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={8} align="center">
//                     <Typography
//                       variant="body1"
//                       color="textSecondary"
//                       sx={{ py: 3 }}
//                     >
//                       No warranties found
//                     </Typography>
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 warranties.map((warranty) => (
//                   <TableRow
//                     key={warranty.id}
//                     hover
//                     sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
//                   >
//                     <TableCell>{warranty.serial_id}</TableCell>
//                     <TableCell>
//                       {warranty.car_brand} {warranty.car_model}
//                       <br />
//                       <Typography variant="caption" color="textSecondary">
//                         {warranty.car_registration_number}
//                       </Typography>
//                     </TableCell>
//                     <TableCell>{warranty.detailer_name}</TableCell>
//                     <TableCell>{warranty.detailer_mobile}</TableCell>
//                     <TableCell>
//                       {formatDate(warranty.installation_date)}
//                     </TableCell>
//                     <TableCell>{warranty.warranty_period} months</TableCell>
//                     {/* <TableCell>
//                       {getStatusChip(warranty.warranty_status)}
//                     </TableCell> */}
//                     <TableCell align="center">
//                       <Chip
//                         label={warranty.warranty_status}
//                         color={
//                           warranty.warranty_status === "ACCEPT"
//                             ? "success"
//                             : warranty.warranty_status === "REJECT"
//                               ? "error"
//                               : "warning"
//                         }
//                         onClick={(e) => handleOpenMenu(e, warranty)}
//                         clickable
//                       />

//                       <Menu
//                         anchorEl={anchorEl}
//                         open={Boolean(anchorEl)}
//                         onClose={handleCloseMenu}
//                       >
//                         <MenuItem
//                           onClick={() => {
//                             handleWarrantyStatusChange(
//                               "PENDING",
//                               selectedWarranty,
//                             );
//                             handleCloseMenu();
//                           }}
//                         >
//                           Pending
//                         </MenuItem>

//                         <MenuItem
//                           onClick={() => {
//                             handleWarrantyStatusChange(
//                               "ACTIVE",
//                               selectedWarranty,
//                             );
//                             handleCloseMenu();
//                           }}
//                         >
//                           Active
//                         </MenuItem>

//                         <MenuItem
//                           onClick={() => {
//                             handleWarrantyStatusChange(
//                               "EXPIRED",
//                               selectedWarranty,
//                             );
//                             handleCloseMenu();
//                           }}
//                         >
//                           Expired
//                         </MenuItem>

//                         <MenuItem
//                           onClick={() => {
//                             handleWarrantyStatusChange(
//                               "VOID",
//                               selectedWarranty,
//                             );
//                             handleCloseMenu();
//                           }}
//                         >
//                           Void
//                         </MenuItem>
//                       </Menu>
//                     </TableCell>

//                     <TableCell align="center">
//                       <IconButton
//                         color="primary"
//                         onClick={() => handleView(warranty)}
//                         size="small"
//                       >
//                         <VisibilityIcon />
//                       </IconButton>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}

//       {showViewDialog && (
//         <Box>
//           <DialogTitle
//             style={{ display: "flex", justifyContent: "space-between" }}
//           >
//             <DialogActions sx={{ display: "flex", width: "100%" }}>
//               {selectedWarranty &&
//                 (selectedWarranty.warranty_status === "PENDING" ||
//                   selectedWarranty.warranty_status === "REJECT") && (
//                   <>
//                     <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
//                       <Chip
//                         icon={<CheckCircle />}
//                         label="Accept"
//                         color="success"
//                         clickable
//                         onClick={handleAccept}
//                         disabled={updateLoading}
//                         sx={{ px: 1.5, fontWeight: 600 }}
//                       />

//                       <Chip
//                         icon={<Cancel />}
//                         label="Reject"
//                         color="error"
//                         clickable
//                         onClick={handleRejectClick}
//                         disabled={updateLoading}
//                         sx={{ px: 1.5, fontWeight: 600 }}
//                       />
//                     </Box>
//                   </>
//                 )}
//             </DialogActions>
//           </DialogTitle>
//           <DialogContent dividers>
//             {selectedWarranty && (
//               <Grid>
//                 {selectedWarranty.car_images &&
//                   selectedWarranty.car_images.length > 0 && (
//                     <Grid>
//                       <Typography
//                         variant="subtitle2"
//                         color="text.secondary"
//                         gutterBottom
//                       >
//                         Car Images
//                       </Typography>
//                       <Grid>
//                         {/* {selectedWarranty.car_images.map((image, index) => (
//                           <Grid item xs={12} sm={6} md={4} key={index}>
//                             <Box
//                               component="img"
//                               src={`${BASE_URL}${image}`}
//                               alt={`Car ${index + 1}`}
//                               sx={{
//                                 width: "100%",
//                                 height: "auto",
//                                 maxHeight: 250,
//                                 objectFit: "cover",
//                                 borderRadius: 2,
//                                 border: "1px solid #e0e0e0",
//                               }}
//                               onError={(e) => {
//                                 e.currentTarget.src =
//                                   "https://via.placeholder.com/400x300?text=No+Image";
//                               }}
//                             />
//                           </Grid>
//                         ))} */}
//                         {selectedWarranty.car_images.map((image, index) => (
//                           <Grid key={index}>
//                             <Box
//                               component="img"
//                               src={getImageUrl(image)} // ✅ Use helper function
//                               alt={`Car ${index + 1}`}
//                               sx={{
//                                 width: "100%",
//                                 height: "auto",
//                                 maxHeight: 250,
//                                 objectFit: "cover",
//                                 borderRadius: 2,
//                                 border: "1px solid #e0e0e0",
//                               }}
//                               onError={(e) => {
//                                 e.currentTarget.src =
//                                   "https://via.placeholder.com/400x300?text=No+Image";
//                               }}
//                             />
//                           </Grid>
//                         ))}
//                       </Grid>
//                     </Grid>
//                   )}

//                 <Grid>
//                   <Typography variant="subtitle2" color="text.secondary">
//                     Serial ID
//                   </Typography>
//                   <Typography variant="body1" gutterBottom>
//                     {selectedWarranty.serial_id}
//                   </Typography>

//                   <Typography
//                     variant="subtitle2"
//                     color="text.secondary"
//                     sx={{ mt: 2 }}
//                   >
//                     Car Details
//                   </Typography>
//                   <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                     <DirectionsCar fontSize="small" sx={{ mr: 1 }} />
//                     <Typography variant="body1">
//                       {selectedWarranty.car_brand} {selectedWarranty.car_model}
//                     </Typography>
//                   </Box>
//                   <Typography variant="body2" color="text.secondary">
//                     Registration: {selectedWarranty.car_registration_number}
//                   </Typography>

//                   <Typography
//                     variant="subtitle2"
//                     color="text.secondary"
//                     sx={{ mt: 2 }}
//                   >
//                     Detailer Information
//                   </Typography>
//                   <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
//                     <Person fontSize="small" sx={{ mr: 1 }} />
//                     <Typography variant="body1">
//                       {selectedWarranty.detailer_name}
//                     </Typography>
//                   </Box>
//                   <Typography variant="body2" color="text.secondary">
//                     Mobile: {selectedWarranty.detailer_mobile}
//                   </Typography>
//                 </Grid>

//                 <Grid>
//                   <Typography variant="subtitle2" color="text.secondary">
//                     Installation Date
//                   </Typography>
//                   <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//                     <CalendarToday fontSize="small" sx={{ mr: 1 }} />
//                     <Typography variant="body1">
//                       {formatDate(selectedWarranty.installation_date)}
//                     </Typography>
//                   </Box>

//                   <Typography variant="subtitle2" color="text.secondary">
//                     Warranty Period
//                   </Typography>
//                   <Typography variant="body1">
//                     {selectedWarranty.warranty_period} months
//                   </Typography>
//                   <Typography variant="caption" color="text.secondary">
//                     {formatDate(selectedWarranty.warranty_start_date)} to{" "}
//                     {formatDate(selectedWarranty.warranty_end_date)}
//                   </Typography>

//                   <Typography
//                     variant="subtitle2"
//                     color="text.secondary"
//                     sx={{ mt: 2 }}
//                   >
//                     Warranty Status
//                   </Typography>
//                   {getStatusChip(selectedWarranty.warranty_status)}

//                   {selectedWarranty.registered_by && (
//                     <>
//                       <Typography
//                         variant="subtitle2"
//                         color="text.secondary"
//                         sx={{ mt: 2 }}
//                       >
//                         Registered By
//                       </Typography>
//                       <Typography variant="body1">
//                         {selectedWarranty.registered_by}
//                       </Typography>
//                     </>
//                   )}
//                 </Grid>

//                 {selectedWarranty.warranty_status === "REJECT" &&
//                   selectedWarranty.rejection_reason && (
//                     <Grid item >
//                       <Alert severity="error">
//                         <Typography variant="subtitle2" gutterBottom>
//                           Rejection Reason
//                         </Typography>
//                         <Typography variant="body2">
//                           {selectedWarranty.rejection_reason}
//                         </Typography>
//                       </Alert>
//                     </Grid>
//                   )}

//                 <Grid item >
//                   <Typography
//                     variant="subtitle2"
//                     color="text.secondary"
//                     gutterBottom
//                   >
//                     Documents
//                   </Typography>

//                   {(selectedWarranty.installation_images &&
//                     selectedWarranty.installation_images.length > 0) ||
//                   selectedWarranty.invoice_image ? (
//                     <Grid container spacing={2}>
//                       {selectedWarranty.installation_images &&
//                         selectedWarranty.installation_images.length > 0 && (
//                           <>
//                             <Grid item >
//                               <Typography
//                                 variant="body2"
//                                 fontWeight={600}
//                                 gutterBottom
//                               >
//                                 Installation Images
//                               </Typography>
//                             </Grid>
//                             {selectedWarranty.installation_images.map(
//                               (image, index) => (
//                                 <Grid item  sm={6} key={index}>
//                                   <Box
//                                     component="img"
//                                     src={getImageUrl(image)}
//                                     alt={`Installation ${index + 1}`}
//                                     sx={{
//                                       width: "100%",
//                                       height: "auto",
//                                       maxHeight: 300,
//                                       backgroundColor: "#f5f5f5",
//                                       objectFit: "cover",
//                                       borderRadius: 2,
//                                       mb: 1,
//                                     }}
//                                     onError={(e) => {
//                                       e.currentTarget.src =
//                                         "https://via.placeholder.com/400x200?text=No+Image";
//                                     }}
//                                   />
//                                   <Button
//                                     fullWidth
//                                     variant="outlined"
//                                     size="small"
//                                     startIcon={<Visibility />}
//                                     href={getImageUrl(image)}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                   >
//                                     View Full Image {index + 1}
//                                   </Button>
//                                 </Grid>
//                               ),
//                             )}
//                           </>
//                         )}

//                       {selectedWarranty.invoice_image && (
//                         <>
//                           <Grid item >
//                             <Typography
//                               variant="body2"
//                               fontWeight={600}
//                               gutterBottom
//                               sx={{ mt: 2 }}
//                             >
//                               Invoice Image
//                             </Typography>
//                           </Grid>
//                           <Grid item  sm={6}>
//                             <Box
//                               component="img"
//                               src={getImageUrl(selectedWarranty.invoice_image)}
//                               alt="Invoice"
//                               sx={{
//                                 width: "100%",
//                                 height: "auto",
//                                 maxHeight: 300,
//                                 backgroundColor: "#f5f5f5",
//                                 objectFit: "cover",
//                                 borderRadius: 2,
//                                 mb: 1,
//                               }}
//                               onError={(e) => {
//                                 e.currentTarget.src =
//                                   "https://via.placeholder.com/400x200?text=No+Image";
//                               }}
//                             />
//                             <Button
//                               fullWidth
//                               variant="outlined"
//                               size="small"
//                               startIcon={<Visibility />}
//                               href={getImageUrl(selectedWarranty.invoice_image)}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                             >
//                               View Invoice
//                             </Button>
//                           </Grid>
//                         </>
//                       )}
//                     </Grid>
//                   ) : (
//                     <Typography variant="body2" color="text.secondary">
//                       No documents uploaded
//                     </Typography>
//                   )}
//                 </Grid>
//               </Grid>
//             )}
//           </DialogContent>
//         </Box>
//       )}

//       <Dialog
//         open={showRejectDialog}
//         onClose={() => setShowRejectDialog(false)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle>Reject Warranty</DialogTitle>
//         <DialogContent>
//           <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
//             Please provide a reason for rejecting this warranty:
//           </Typography>
//           <TextField
//             autoFocus
//             multiline
//             rows={4}
//             fullWidth
//             placeholder="Enter rejection reason..."
//             value={rejectionReason}
//             onChange={(e) => setRejectionReason(e.target.value)}
//             variant="outlined"
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button
//             onClick={() => {
//               setShowRejectDialog(false);
//               setRejectionReason("");
//               setShowViewDialog(true);
//             }}
//             disabled={updateLoading}
//           >
//             Cancel
//           </Button>
//           <CommonButton
//             onClick={confirmReject}
//             variant="contained"
//             color="error"
//             disabled={updateLoading || !rejectionReason.trim()}
//           >
//             {updateLoading ? "Rejecting..." : "Confirm Reject"}
//           </CommonButton>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default WarrantyManagement;
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Divider,
  Stack,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  HourglassEmpty,
  Visibility,
  DirectionsCar,
  Person,
  CalendarToday,
} from "@mui/icons-material";
import {
  getWarranties,
  updateWarranty,
} from "../../feature/Warranty/warrantyThunks";
import {
  selectWarrantyList,
  selectWarrantyCount,
  selectWarrantyLoading,
  selectWarrantyUpdateLoading,
  selectWarrantyUpdateSuccess,
  selectWarrantyError,
} from "../../feature/Warranty/warrantySelector";

import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CommonButton from "../../components/commonComponents/CommonButton";
import CommonToast from "../../components/commonComponents/Toster";

const BASE_URL = "http://hogofilm.pythonanywhere.com";

const WarrantyManagement = () => {
  const dispatch = useDispatch();

  const warranties = useSelector(selectWarrantyList);
  const count = useSelector(selectWarrantyCount);
  const loading = useSelector(selectWarrantyLoading);
  const updateLoading = useSelector(selectWarrantyUpdateLoading);
  const updateSuccess = useSelector(selectWarrantyUpdateSuccess);
  const error = useSelector(selectWarrantyError);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (event, warranty) => {
    setAnchorEl(event.currentTarget);
    setSelectedWarranty(warranty);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const [selectedWarranty, setSelectedWarranty] = useState(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    dispatch(getWarranties());
  }, [dispatch]);

  useEffect(() => {
    if (updateSuccess) {
      CommonToast("Warranty updated successfully", "success");
      setShowViewDialog(false);
      setShowRejectDialog(false);
      setRejectionReason("");
      setSelectedWarranty(null);
      dispatch(getWarranties());
    }
  }, [updateSuccess, dispatch]);

  useEffect(() => {
    if (error) {
      CommonToast(error, "error");
    }
  }, [error, dispatch]);

  const handleView = (warranty) => {
    setSelectedWarranty(warranty);
    setShowViewDialog(true);
  };

  const handleAccept = () => {
    if (window.confirm("Are you sure you want to accept this warranty?")) {
      dispatch(
        updateWarranty({
          id: selectedWarranty.id,
          data: { warranty_status: "ACCEPT" },
        }),
      );
    }
  };

  const handleWarrantyStatusChange = (status, warranty, reason = "") => {
    dispatch(
      updateWarranty({
        id: warranty.id,
        data: {
          warranty_status: status,
          rejection_reason: status === "REJECT" ? reason : "",
        },
      }),
    );
  };

  const handleRejectClick = () => {
    setShowViewDialog(false);
    setShowRejectDialog(true);
  };

  const confirmReject = () => {
    if (!rejectionReason.trim()) {
      CommonToast("Please provide a rejection reason", "error");
      return;
    }

    dispatch(
      updateWarranty({
        id: selectedWarranty.id,
        data: {
          warranty_status: "REJECT",
          rejection_reason: rejectionReason,
        },
      }),
    );
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(
      () => setAlert({ show: false, message: "", type: "success" }),
      3000,
    );
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      PENDING: {
        color: "warning",
        icon: <HourglassEmpty fontSize="small" />,
        label: "Pending",
      },
      ACTIVE: {
        color: "success",
        icon: <CheckCircle fontSize="small" />,
        label: "Accepted",
      },
      REJECT: {
        color: "error",
        icon: <Cancel fontSize="small" />,
        label: "Rejected",
      },
    };

    const config = statusConfig[status] || statusConfig.PENDING;

    return (
      <Chip
        icon={config.icon}
        label={config.label}
        color={config.color}
        size="small"
      />
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    return `${BASE_URL}/media/${imagePath}`;
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="body1" sx={{ mt: 2 }} color="textSecondary">
          Loading warranties...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {alert.show && (
        <Alert
          severity={alert.type}
          onClose={() =>
            setAlert({ show: false, message: "", type: "success" })
          }
          sx={{ mb: 3 }}
        >
          {alert.message}
        </Alert>
      )}

      <Stack
        direction="row"
        justifyContent=""
        alignItems="center"
        spacing={1}
        mb={3}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{ display: "flex", alignItems: "center", color: "#7E7E7E" }}
        >
          <IconButton onClick={() => setShowViewDialog(false)}>
            {showViewDialog && (
              <ArrowBackIcon sx={{ color: "grey", marginRight: "5px" }} />
            )}
          </IconButton>
          Warranty
        </Typography>
      </Stack>

      {!showViewDialog && (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Serial ID</strong>
                </TableCell>
                <TableCell>
                  <strong>Car Details</strong>
                </TableCell>
                <TableCell>
                  <strong>Detailer Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Mobile</strong>
                </TableCell>
                <TableCell>
                  <strong>Installation Date</strong>
                </TableCell>
                <TableCell>
                  <strong>Warranty Period</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Action</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {warranties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      sx={{ py: 3 }}
                    >
                      No warranties found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                warranties.map((warranty) => (
                  <TableRow
                    key={warranty.id}
                    hover
                    sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
                  >
                    <TableCell>{warranty.serial_id}</TableCell>
                    <TableCell>
                      {warranty.car_brand} {warranty.car_model}
                      <br />
                      <Typography variant="caption" color="textSecondary">
                        {warranty.car_registration_number}
                      </Typography>
                    </TableCell>
                    <TableCell>{warranty.detailer_name}</TableCell>
                    <TableCell>{warranty.detailer_mobile}</TableCell>
                    <TableCell>
                      {formatDate(warranty.installation_date)}
                    </TableCell>
                    <TableCell>{warranty.warranty_period} months</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={warranty.warranty_status}
                        color={
                          warranty.warranty_status === "ACCEPT"
                            ? "success"
                            : warranty.warranty_status === "REJECT"
                              ? "error"
                              : "warning"
                        }
                        onClick={(e) => handleOpenMenu(e, warranty)}
                        clickable
                      />

                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleCloseMenu}
                      >
                        <MenuItem
                          onClick={() => {
                            handleWarrantyStatusChange(
                              "PENDING",
                              selectedWarranty,
                            );
                            handleCloseMenu();
                          }}
                        >
                          Pending
                        </MenuItem>

                        <MenuItem
                          onClick={() => {
                            handleWarrantyStatusChange(
                              "ACTIVE",
                              selectedWarranty,
                            );
                            handleCloseMenu();
                          }}
                        >
                          Active
                        </MenuItem>

                        <MenuItem
                          onClick={() => {
                            handleWarrantyStatusChange(
                              "EXPIRED",
                              selectedWarranty,
                            );
                            handleCloseMenu();
                          }}
                        >
                          Expired
                        </MenuItem>

                        <MenuItem
                          onClick={() => {
                            handleWarrantyStatusChange(
                              "VOID",
                              selectedWarranty,
                            );
                            handleCloseMenu();
                          }}
                        >
                          Void
                        </MenuItem>
                      </Menu>
                    </TableCell>

                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleView(warranty)}
                        size="small"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {showViewDialog && (
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            {selectedWarranty &&
              (selectedWarranty.warranty_status === "PENDING" ||
                selectedWarranty.warranty_status === "REJECT") && (
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  <Chip
                    icon={<CheckCircle />}
                    label="Accept"
                    color="success"
                    clickable
                    onClick={handleAccept}
                    disabled={updateLoading}
                    sx={{ px: 1.5, fontWeight: 600 }}
                  />

                  <Chip
                    icon={<Cancel />}
                    label="Reject"
                    color="error"
                    clickable
                    onClick={handleRejectClick}
                    disabled={updateLoading}
                    sx={{ px: 1.5, fontWeight: 600 }}
                  />
                </Stack>
              )}
          </Box>

          <Divider sx={{ mb: 3 }} />

          {selectedWarranty && (
            <Box>
              {/* Car Images Section */}
              {selectedWarranty.car_images &&
                selectedWarranty.car_images.length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Car Images
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                        mt: 2,
                      }}
                    >
                      {selectedWarranty.car_images.map((image, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: {
                              xs: "100%",
                              sm: "calc(50% - 8px)",
                              md: "calc(33.333% - 11px)",
                            },
                          }}
                        >
                          <Box
                            component="img"
                            src={getImageUrl(image)}
                            alt={`Car ${index + 1}`}
                            sx={{
                              width: "100%",
                              height: "auto",
                              maxHeight: 250,
                              objectFit: "cover",
                              borderRadius: 2,
                              border: "1px solid #e0e0e0",
                            }}
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://via.placeholder.com/400x300?text=No+Image";
                            }}
                          />
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

              {/* Main Details Section - Two Columns */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 3,
                  mb: 4,
                }}
              >
                {/* Left Column - Car & Detailer Info */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Serial ID
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedWarranty.serial_id}
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                  >
                    Car Details
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <DirectionsCar fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      {selectedWarranty.car_brand} {selectedWarranty.car_model}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Registration: {selectedWarranty.car_registration_number}
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                  >
                    Detailer Information
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <Person fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      {selectedWarranty.detailer_name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Mobile: {selectedWarranty.detailer_mobile}
                  </Typography>
                </Box>

                {/* Right Column - Warranty Info */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Installation Date
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <CalendarToday fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      {formatDate(selectedWarranty.installation_date)}
                    </Typography>
                  </Box>

                  <Typography variant="subtitle2" color="text.secondary">
                    Warranty Period
                  </Typography>
                  <Typography variant="body1">
                    {selectedWarranty.warranty_period} months
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(selectedWarranty.warranty_start_date)} to{" "}
                    {formatDate(selectedWarranty.warranty_end_date)}
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                  >
                    Warranty Status
                  </Typography>
                  {getStatusChip(selectedWarranty.warranty_status)}

                  {selectedWarranty.registered_by && (
                    <>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        sx={{ mt: 2 }}
                      >
                        Registered By
                      </Typography>
                      <Typography variant="body1">
                        {selectedWarranty.registered_by}
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>

              {/* Rejection Reason Alert */}
              {selectedWarranty.warranty_status === "REJECT" &&
                selectedWarranty.rejection_reason && (
                  <Box sx={{ mb: 4 }}>
                    <Alert severity="error">
                      <Typography variant="subtitle2" gutterBottom>
                        Rejection Reason
                      </Typography>
                      <Typography variant="body2">
                        {selectedWarranty.rejection_reason}
                      </Typography>
                    </Alert>
                  </Box>
                )}

              {/* Documents Section */}
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Documents
                </Typography>

                {(selectedWarranty.installation_images &&
                  selectedWarranty.installation_images.length > 0) ||
                selectedWarranty.invoice_image ? (
                  <Box>
                    {/* Installation Images */}
                    {selectedWarranty.installation_images &&
                      selectedWarranty.installation_images.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            gutterBottom
                          >
                            Installation Images
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 2,
                              mt: 2,
                            }}
                          >
                            {selectedWarranty.installation_images.map(
                              (image, index) => (
                                <Box
                                  key={index}
                                  sx={{
                                    width: {
                                      xs: "100%",
                                      sm: "calc(50% - 8px)",
                                      md: "calc(33.333% - 11px)",
                                    },
                                  }}
                                >
                                  <Box
                                    component="img"
                                    src={getImageUrl(image)}
                                    alt={`Installation ${index + 1}`}
                                    sx={{
                                      width: "100%",
                                      height: "auto",
                                      maxHeight: 300,
                                      backgroundColor: "#f5f5f5",
                                      objectFit: "cover",
                                      borderRadius: 2,
                                      mb: 1,
                                    }}
                                    onError={(e) => {
                                      e.currentTarget.src =
                                        "https://via.placeholder.com/400x200?text=No+Image";
                                    }}
                                  />
                                  <Button
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    startIcon={<Visibility />}
                                    href={getImageUrl(image)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    View Full Image {index + 1}
                                  </Button>
                                </Box>
                              ),
                            )}
                          </Box>
                        </Box>
                      )}

                    {/* Invoice Image */}
                    {selectedWarranty.invoice_image && (
                      <Box>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          gutterBottom
                          sx={{ mt: 2 }}
                        >
                          Invoice Image
                        </Typography>
                        <Box
                          sx={{
                            width: {
                              xs: "100%",
                              sm: "50%",
                              md: "33.333%",
                            },
                            mt: 2,
                          }}
                        >
                          <Box
                            component="img"
                            src={getImageUrl(selectedWarranty.invoice_image)}
                            alt="Invoice"
                            sx={{
                              width: "100%",
                              height: "auto",
                              maxHeight: 300,
                              backgroundColor: "#f5f5f5",
                              objectFit: "cover",
                              borderRadius: 2,
                              mb: 1,
                            }}
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://via.placeholder.com/400x200?text=No+Image";
                            }}
                          />
                          <Button
                            fullWidth
                            variant="outlined"
                            size="small"
                            startIcon={<Visibility />}
                            href={getImageUrl(selectedWarranty.invoice_image)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Invoice
                          </Button>
                        </Box>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No documents uploaded
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </Box>
      )}

      {/* Rejection Dialog */}
      <Dialog
        open={showRejectDialog}
        onClose={() => setShowRejectDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reject Warranty</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Please provide a reason for rejecting this warranty:
          </Typography>
          <TextField
            autoFocus
            multiline
            rows={4}
            fullWidth
            placeholder="Enter rejection reason..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowRejectDialog(false);
              setRejectionReason("");
              setShowViewDialog(true);
            }}
            disabled={updateLoading}
          >
            Cancel
          </Button>
          <CommonButton
            onClick={confirmReject}
            variant="contained"
            color="error"
            disabled={updateLoading || !rejectionReason.trim()}
          >
            {updateLoading ? "Rejecting..." : "Confirm Reject"}
          </CommonButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WarrantyManagement;