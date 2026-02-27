// import { useEffect, useState, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import {
//   getInventorySerials,
//   deleteInventorySerial,
// } from "../../feature/inventorySerials/inventorySerialsThunks";

// import {
//   selectInventorySerials,
//   selectInventorySerialLoading,
//   selectDeleteInventorySerialLoading,
// } from "../../feature/inventorySerials/inventorySerialsSelector";

// import {
//   Box,
//   Paper,
//   Stack,
//   Typography,
//   IconButton,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Pagination,
//   CircularProgress,
//   TextField,
//   Chip,
// } from "@mui/material";

// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import DeleteIcon from "@mui/icons-material/Delete";
// import VisibilityIcon from "@mui/icons-material/Visibility";

// import CommonLabel from "../../components/commonComponents/CommonLabel";
// import CommonSearchField from "../../components/commonComponents/CommonSearchField";
// import CommonToast from "../../components/commonComponents/Toster";

// const InventorySerial = () => {
//   const dispatch = useDispatch();

//   const serials = useSelector(selectInventorySerials);
//   const loading = useSelector(selectInventorySerialLoading);
//   const deleteLoading = useSelector(selectDeleteInventorySerialLoading);

//   const [page, setPage] = useState(1);
//   const rowsPerPage = 10;

//   const [searchQuery, setSearchQuery] = useState({
//     serial_number: "",
//     batch_id: "",
//   });

//   const [isViewing, setIsViewing] = useState(false);
//   const [viewSerial, setViewSerial] = useState(null);

//   // ================= FETCH WITH DEBOUNCE =================
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       const payload = {};

//       if (searchQuery.serial_number) {
//         payload.serial_number = searchQuery.serial_number;
//       }

//       if (searchQuery.batch_id) {
//         payload.batch_id = searchQuery.batch_id;
//       }

//       dispatch(getInventorySerials(payload));
//     }, 500); // 500ms debounce

//     return () => clearTimeout(timeoutId);
//   }, [dispatch, searchQuery.serial_number, searchQuery.batch_id]);

//   // ================= HANDLERS =================
//   const handleView = (item) => {
//     setViewSerial(item);
//     setIsViewing(true);
//   };

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this serial?")) {
//       dispatch(deleteInventorySerial(id))
//         .unwrap()
//         .then(() => {
//           dispatch(getInventorySerials());
//           CommonToast("Inventory serial deleted successfully", "success");
//         })
//         .catch(() => CommonToast("Failed to delete inventory serial", "error"));
//     }
//   };

//   const paginatedData = serials?.slice(
//     (page - 1) * rowsPerPage,
//     page * rowsPerPage,
//   );

//   // ================= VIEW PAGE =================
//   if (isViewing && viewSerial) {
//     return (
//       <Box display="flex" justifyContent="center" mt={4}>
//         <Box width="100%">
//           <Stack direction="row" alignItems="center" spacing={1} mb={3}>
//             <IconButton
//               onClick={() => {
//                 setIsViewing(false);
//                 setViewSerial(null);
//               }}
//             >
//               <ArrowBackIcon />
//             </IconButton>
//             <CommonLabel>View Inventory Serial</CommonLabel>
//           </Stack>

//           <Paper sx={{ p: 3 }}>
//             <Stack spacing={2}>
//               <TextField
//                 label="Product SKU"
//                 value={viewSerial.product_sku}
//                 fullWidth
//                 InputProps={{ readOnly: true }}
//               />

//               <TextField
//                 label="Batch ID"
//                 value={viewSerial.batch_id}
//                 fullWidth
//                 InputProps={{ readOnly: true }}
//               />

//               <TextField
//                 label="Serial Number"
//                 value={viewSerial.serial_number}
//                 fullWidth
//                 InputProps={{ readOnly: true }}
//               />

//               <Stack direction="row" spacing={2}>
//                 <Chip
//                   label={viewSerial.status}
//                   color={
//                     viewSerial.status === "AVAILABLE" ? "success" : "default"
//                   }
//                 />
//                 <Chip
//                   label={`Product ID: ${viewSerial.product_id}`}
//                   variant="outlined"
//                 />
//               </Stack>
//             </Stack>
//           </Paper>
//         </Box>
//       </Box>
//     );
//   }

//   // ================= LIST PAGE =================
//   return (
//     <Box>
//       <Stack
//         direction="row"
//         justifyContent="space-between"
//         alignItems="center"
//         mb={3}
//       >
//         <Typography variant="h4" fontWeight={700} sx={{ color: "#7E7E7E" }}>
//           Inventory Serials
//         </Typography>
//       </Stack>

//       <TableContainer component={Paper}>
//         <Stack direction="row" spacing={2} sx={{ p: 2 }}>
//           <CommonSearchField
//             value={searchQuery.serial_number}
//             placeholder="Search by serial number..."
//             onChange={(value) =>
//               setSearchQuery((prev) => ({
//                 ...prev,
//                 serial_number: value,
//               }))
//             }
//           />
//           <CommonSearchField
//             value={searchQuery.batch_id}
//             placeholder="Search by batch..."
//             onChange={(value) =>
//               setSearchQuery((prev) => ({
//                 ...prev,
//                 batch_id: value,
//               }))
//             }
//           />
//         </Stack>

//         <Table>
//           <TableHead>
//             <TableRow>
//               {[
//                 "Sr",
//                 "Product SKU",
//                 "Batch",
//                 "Serial Number",
//                 "Status",
//                 "Actions",
//               ].map((h) => (
//                 <TableCell key={h} sx={{ fontWeight: 700 }}>
//                   {h}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {loading && (
//               <TableRow>
//                 <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
//                   <CircularProgress size={28} />
//                   <Typography variant="body2" mt={1}>
//                     Loading inventory serials...
//                   </Typography>
//                 </TableCell>
//               </TableRow>
//             )}

//             {!loading &&
//               paginatedData?.map((item, index) => (
//                 <TableRow key={item.id} hover>
//                   <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>

//                   <TableCell>{item.product_sku}</TableCell>
//                   <TableCell>{item.batch_id}</TableCell>
//                   <TableCell>
//                     <Typography fontSize={13}>{item.serial_number}</Typography>
//                   </TableCell>

//                   <TableCell>
//                     <Chip
//                       size="small"
//                       label={item.status}
//                       color={
//                         item.status === "AVAILABLE" ? "success" : "default"
//                       }
//                     />
//                   </TableCell>

//                   <TableCell>
//                     <IconButton
//                       color="primary"
//                       onClick={() => handleView(item)}
//                     >
//                       <VisibilityIcon />
//                     </IconButton>

//                     <IconButton
//                       color="error"
//                       disabled={deleteLoading}
//                       onClick={() => handleDelete(item.id)}
//                     >
//                       <DeleteIcon />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}

//             {!loading && serials?.length === 0 && (
//               <TableRow>
//                 <TableCell colSpan={6} align="center">
//                   No inventory serials found
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Stack alignItems="flex-end" mt={3}>
//         <Pagination
//           count={Math.ceil((serials?.length || 0) / rowsPerPage)}
//           page={page}
//           onChange={(_, v) => setPage(v)}
//           color="primary"
//         />
//       </Stack>
//     </Box>
//   );
// };

// export default InventorySerial;

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getInventorySerials,
  deleteInventorySerial,
} from "../../feature/inventorySerials/inventorySerialsThunks";

import {
  selectInventorySerials,
  selectInventorySerialLoading,
  selectDeleteInventorySerialLoading,
} from "../../feature/inventorySerials/inventorySerialsSelector";

import {
  Box,
  Paper,
  Stack,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  CircularProgress,
  Chip,
  Grid,
  Divider,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import QrCodeIcon from "@mui/icons-material/QrCode";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import TagIcon from "@mui/icons-material/Tag";
import SearchIcon from "@mui/icons-material/Search";

import CommonSearchField from "../../components/commonComponents/CommonSearchField";
import CommonToast from "../../components/commonComponents/Toster";

// ─── Shared Helpers ────────────────────────────────────────────────────────────

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

const PageHeader = ({ title, onBack }) => (
  <Box
    display="flex"
    alignItems="center"
    mb={3}
    px={2}
    py={1.5}
    sx={{
      background: "linear-gradient(90deg, #D20000 0%, #8B0000 100%)",
      borderRadius: 2,
      boxShadow: "0 4px 12px rgba(210,0,0,0.25)",
    }}
  >
    {onBack && (
      <IconButton onClick={onBack} sx={{ color: "#fff", mr: 1.5 }}>
        <ArrowBackIcon />
      </IconButton>
    )}
    <Typography variant="h6" fontWeight={700} color="#fff" letterSpacing={1}>
      {title}
    </Typography>
  </Box>
);

const DetailCard = ({ label, value, icon }) => (
  <Box
    sx={{
      p: 2,
      bgcolor: "#fafafa",
      border: "1px solid #ebebeb",
      borderRadius: 2,
      height: "100%",
    }}
  >
    <Box display="flex" alignItems="center" gap={0.8} mb={0.5}>
      {icon && <Box sx={{ color: "#D20000", display: "flex" }}>{icon}</Box>}
      <Typography variant="caption" color="text.secondary" fontWeight={700}>
        {label}
      </Typography>
    </Box>
    <Typography variant="body2" fontWeight={600} color="#1a1a1a">
      {value ?? "N/A"}
    </Typography>
  </Box>
);

const StatusChip = ({ status }) => {
  const isAvailable = status === "AVAILABLE";
  return (
    <Chip
      label={status}
      size="small"
      sx={{
        fontWeight: 700,
        borderRadius: 1,
        fontSize: 11,
        bgcolor: isAvailable ? "#e8f5e9" : "#f5f5f5",
        color: isAvailable ? "#2e7d32" : "#757575",
        border: `1px solid ${isAvailable ? "#c8e6c9" : "#e0e0e0"}`,
      }}
    />
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────

const InventorySerial = () => {
  const dispatch = useDispatch();

  const serials = useSelector(selectInventorySerials);
  const loading = useSelector(selectInventorySerialLoading);
  const deleteLoading = useSelector(selectDeleteInventorySerialLoading);

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [searchQuery, setSearchQuery] = useState({
    serial_number: "",
    batch_id: "",
  });

  const [isViewing, setIsViewing] = useState(false);
  const [viewSerial, setViewSerial] = useState(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const payload = {};
      if (searchQuery.serial_number)
        payload.serial_number = searchQuery.serial_number;
      if (searchQuery.batch_id) payload.batch_id = searchQuery.batch_id;
      dispatch(getInventorySerials(payload));
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [dispatch, searchQuery.serial_number, searchQuery.batch_id]);

  const handleView = (item) => {
    setViewSerial(item);
    setIsViewing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this serial?")) {
      dispatch(deleteInventorySerial(id))
        .unwrap()
        .then(() => {
          dispatch(getInventorySerials());
          CommonToast("Inventory serial deleted successfully", "success");
        })
        .catch(() => CommonToast("Failed to delete inventory serial", "error"));
    }
  };

  const paginatedData = serials?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  // ── View Detail ──────────────────────────────────────────────────────────────
  if (isViewing && viewSerial) {
    return (
      <Box mt={4}>
        <PageHeader
          title="Inventory Serial Details"
          onBack={() => {
            setIsViewing(false);
            setViewSerial(null);
          }}
        />

        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid #f0f0f0",
          }}
        >
          {/* Identity strip */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              px: 4,
              py: 3,
              bgcolor: "#fafafa",
              borderBottom: "2px solid #D20000",
            }}
          >
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: 2,
                bgcolor: "#ebebeb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "3px solid #D20000",
                flexShrink: 0,
              }}
            >
              <QrCodeIcon sx={{ fontSize: 32, color: "#D20000" }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700} color="#1a1a1a">
                {viewSerial.serial_number}
              </Typography>
              <Box display="flex" alignItems="center" gap={1} mt={0.8}>
                <StatusChip status={viewSerial.status} />
                <Chip
                  label={`Product ID: ${viewSerial.product_id}`}
                  variant="outlined"
                  size="small"
                  sx={{ fontWeight: 600, borderRadius: 1, fontSize: 11 }}
                />
              </Box>
            </Box>
          </Box>

          <Box px={4} py={3}>
            <SectionHeading title="Serial Information" />
            <Grid container spacing={2}>
              {[
                {
                  label: "Product SKU",
                  value: viewSerial.product_sku,
                  icon: <TagIcon fontSize="small" />,
                },
                {
                  label: "Batch ID",
                  value: viewSerial.batch_id,
                  icon: <Inventory2Icon fontSize="small" />,
                },
                {
                  label: "Serial Number",
                  value: viewSerial.serial_number,
                  icon: <QrCodeIcon fontSize="small" />,
                },
                {
                  label: "Status",
                  value: viewSerial.status,
                  icon: null,
                },
              ].map((item) => (
                <Grid item xs={12} sm={6} md={3} key={item.label}>
                  <DetailCard
                    label={item.label}
                    value={item.value}
                    icon={item.icon}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>
      </Box>
    );
  }

  // ── List View ────────────────────────────────────────────────────────────────
  return (
    <Box>
      {/* Page Title Row */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{ width: 5, height: 32, bgcolor: "#D20000", borderRadius: 1 }}
          />
          <Typography variant="h5" fontWeight={800} color="#1a1a1a">
            Inventory Serials
          </Typography>
        </Box>
      </Stack>

      {/* Table Card */}
      <Paper
        elevation={2}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid #f0f0f0",
        }}
      >
        {/* Search Filters */}
        <Box
          sx={{
            px: 2,
            py: 2,
            bgcolor: "#fafafa",
            borderBottom: "1px solid #ebebeb",
          }}
        >
          <Box display="flex" alignItems="center" gap={1} mb={1.5}>
            <SearchIcon sx={{ color: "#D20000", fontSize: 18 }} />
            <Typography
              variant="caption"
              fontWeight={700}
              color="text.secondary"
              letterSpacing={0.5}
            >
              FILTER SERIALS
            </Typography>
          </Box>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <CommonSearchField
              value={searchQuery.serial_number}
              placeholder="Search by serial number..."
              onChange={(value) =>
                setSearchQuery((prev) => ({ ...prev, serial_number: value }))
              }
            />
            <CommonSearchField
              value={searchQuery.batch_id}
              placeholder="Search by batch..."
              onChange={(value) =>
                setSearchQuery((prev) => ({ ...prev, batch_id: value }))
              }
            />
          </Stack>
        </Box>

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
                  "Product SKU",
                  "Batch",
                  "Serial Number",
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
              {loading && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      gap={1}
                    >
                      <CircularProgress size={28} sx={{ color: "#D20000" }} />
                      <Typography variant="body2" color="text.secondary">
                        Loading inventory serials...
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                paginatedData?.map((item, index) => (
                  <TableRow
                    key={item.id}
                    hover
                    sx={{
                      "&:hover": { bgcolor: "#fff5f5" },
                      "&:last-child td": { border: 0 },
                      borderBottom: "1px solid #f5f5f5",
                      transition: "background 0.15s",
                    }}
                  >
                    {/* Sr */}
                    <TableCell
                      sx={{ fontWeight: 700, color: "#D20000", width: 50 }}
                    >
                      {(page - 1) * rowsPerPage + index + 1}
                    </TableCell>

                    {/* Product SKU */}
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
                          <TagIcon sx={{ fontSize: 15, color: "#D20000" }} />
                        </Box>
                        <Typography
                          fontWeight={600}
                          fontSize={13}
                          color="#1a1a1a"
                        >
                          {item.product_sku}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Batch */}
                    <TableCell>
                      <Chip
                        label={item.batch_id}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: 11,
                          bgcolor: "#f0f4ff",
                          color: "#1565c0",
                          border: "1px solid #d0deff",
                          borderRadius: 1,
                        }}
                      />
                    </TableCell>

                    {/* Serial Number */}
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={0.8}>
                        <QrCodeIcon sx={{ fontSize: 15, color: "#D20000" }} />
                        <Typography
                          fontSize={13}
                          fontWeight={500}
                          color="#1a1a1a"
                          fontFamily="monospace"
                        >
                          {item.serial_number}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <StatusChip status={item.status} />
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <Box display="flex" gap={0.5}>
                        <IconButton
                          size="small"
                          onClick={() => handleView(item)}
                          sx={{
                            bgcolor: "#f0f4ff",
                            color: "#1565c0",
                            "&:hover": { bgcolor: "#d0deff" },
                            borderRadius: 1,
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          disabled={deleteLoading}
                          onClick={() => handleDelete(item.id)}
                          sx={{
                            bgcolor: "#fce4ec",
                            color: "#c62828",
                            "&:hover": { bgcolor: "#ef9a9a" },
                            borderRadius: 1,
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}

              {!loading && serials?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      gap={1}
                    >
                      <QrCodeIcon sx={{ fontSize: 40, color: "#e0e0e0" }} />
                      <Typography color="text.secondary" fontWeight={500}>
                        No inventory serials found
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box
          sx={{
            px: 3,
            py: 2,
            borderTop: "1px solid #f0f0f0",
            bgcolor: "#fafafa",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Pagination
            count={Math.ceil((serials?.length || 0) / rowsPerPage)}
            page={page}
            onChange={(_, v) => setPage(v)}
            sx={{
              "& .MuiPaginationItem-root.Mui-selected": {
                bgcolor: "#D20000",
                color: "#fff",
                "&:hover": { bgcolor: "#a80000" },
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default InventorySerial;
