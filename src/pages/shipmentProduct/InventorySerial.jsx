import { useEffect, useState, useCallback } from "react";
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
  TextField,
  Chip,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

import CommonLabel from "../../components/commonComponents/CommonLabel";
import CommonSearchField from "../../components/commonComponents/CommonSearchField";
import CommonToast from "../../components/commonComponents/Toster";

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

  // ================= FETCH WITH DEBOUNCE =================
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const payload = {};

      if (searchQuery.serial_number) {
        payload.serial_number = searchQuery.serial_number;
      }
      
      if (searchQuery.batch_id) {
        payload.batch_id = searchQuery.batch_id;
      }

      dispatch(getInventorySerials(payload));
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [dispatch, searchQuery.serial_number, searchQuery.batch_id]);

  // ================= HANDLERS =================
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

  // ================= VIEW PAGE =================
  if (isViewing && viewSerial) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Box width="100%">
          <Stack direction="row" alignItems="center" spacing={1} mb={3}>
            <IconButton
              onClick={() => {
                setIsViewing(false);
                setViewSerial(null);
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <CommonLabel>View Inventory Serial</CommonLabel>
          </Stack>

          <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
              <TextField
                label="Product SKU"
                value={viewSerial.product_sku}
                fullWidth
                InputProps={{ readOnly: true }}
              />

              <TextField
                label="Batch ID"
                value={viewSerial.batch_id}
                fullWidth
                InputProps={{ readOnly: true }}
              />

              <TextField
                label="Serial Number"
                value={viewSerial.serial_number}
                fullWidth
                InputProps={{ readOnly: true }}
              />

              <Stack direction="row" spacing={2}>
                <Chip
                  label={viewSerial.status}
                  color={
                    viewSerial.status === "AVAILABLE" ? "success" : "default"
                  }
                />
                <Chip
                  label={`Product ID: ${viewSerial.product_id}`}
                  variant="outlined"
                />
              </Stack>
            </Stack>
          </Paper>
        </Box>
      </Box>
    );
  }

  // ================= LIST PAGE =================
  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight={700} sx={{ color: "#7E7E7E" }}>
          Inventory Serials
        </Typography>
      </Stack>

      <TableContainer component={Paper}>
        <Stack direction="row" spacing={2} sx={{ p: 2 }}>
          <CommonSearchField
            value={searchQuery.serial_number}
            placeholder="Search by serial number..."
            onChange={(value) =>
              setSearchQuery((prev) => ({
                ...prev,
                serial_number: value,
              }))
            }
          />
          <CommonSearchField
            value={searchQuery.batch_id}
            placeholder="Search by batch..."
            onChange={(value) =>
              setSearchQuery((prev) => ({
                ...prev,
                batch_id: value,
              }))
            }
          />
        </Stack>

        <Table>
          <TableHead>
            <TableRow>
              {[
                "Sr",
                "Product SKU",
                "Batch",
                "Serial Number",
                "Status",
                "Actions",
              ].map((h) => (
                <TableCell key={h} sx={{ fontWeight: 700 }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={28} />
                  <Typography variant="body2" mt={1}>
                    Loading inventory serials...
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              paginatedData?.map((item, index) => (
                <TableRow key={item.id} hover>
                  <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>

                  <TableCell>{item.product_sku}</TableCell>
                  <TableCell>{item.batch_id}</TableCell>
                  <TableCell>
                    <Typography fontSize={13}>{item.serial_number}</Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      size="small"
                      label={item.status}
                      color={
                        item.status === "AVAILABLE" ? "success" : "default"
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleView(item)}
                    >
                      <VisibilityIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      disabled={deleteLoading}
                      onClick={() => handleDelete(item.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

            {!loading && serials?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No inventory serials found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack alignItems="flex-end" mt={3}>
        <Pagination
          count={Math.ceil((serials?.length || 0) / rowsPerPage)}
          page={page}
          onChange={(_, v) => setPage(v)}
          color="primary"
        />
      </Stack>
    </Box>
  );
};

export default InventorySerial;