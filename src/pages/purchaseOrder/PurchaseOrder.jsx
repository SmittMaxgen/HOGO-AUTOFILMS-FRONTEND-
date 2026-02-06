import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getPurchaseOrders,
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
} from "../../feature/purchaseOrder/purchaseOrderThunks";

import {
  selectPurchaseOrders,
  selectPurchaseOrderLoading,
  selectCreatePurchaseOrderLoading,
  selectCreatePurchaseOrderSuccess,
  selectUpdatePurchaseOrderLoading,
  selectUpdatePurchaseOrderSuccess,
  selectDeletePurchaseOrderLoading,
} from "../../feature/purchaseOrder/purchaseOrderSelector";

import {
  Box,
  Paper,
  Stack,
  Typography,
  IconButton,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Pagination,
  CircularProgress,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";

import CommonButton from "../../components/commonComponents/CommonButton";
import CommonLabel from "../../components/commonComponents/CommonLabel";
import CommonToast from "../../components/commonComponents/Toster";
import CommonSearchField from "../../components/commonComponents/CommonSearchField";

const PurchaseOrder = () => {
  const dispatch = useDispatch();

  const purchaseOrders = useSelector(selectPurchaseOrders);
  const loading = useSelector(selectPurchaseOrderLoading);
  const createLoading = useSelector(selectCreatePurchaseOrderLoading);
  const createSuccess = useSelector(selectCreatePurchaseOrderSuccess);
  const updateLoading = useSelector(selectUpdatePurchaseOrderLoading);
  const updateSuccess = useSelector(selectUpdatePurchaseOrderSuccess);
  const deleteLoading = useSelector(selectDeletePurchaseOrderLoading);

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [isViewing, setIsViewing] = useState(false);
  const [viewPO, setViewPO] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [form, setForm] = useState({
    po_number: "",
    distributor_id: "",
    product_items: [],
    remarks: "",
  });

  const [errors, setErrors] = useState({});

  // ================= FETCH =================
  useEffect(() => {
    const delay = setTimeout(() => {
      dispatch(getPurchaseOrders());
      setPage(1);
    }, 300);

    return () => clearTimeout(delay);
  }, [dispatch, searchQuery]);

  useEffect(() => {
    if (createSuccess || updateSuccess) {
      dispatch(getPurchaseOrders());
      handleReset();
    }
  }, [createSuccess, updateSuccess, dispatch]);

  // ================= HELPERS =================
  const validate = () => {
    const temp = {};
    if (!form.po_number) temp.po_number = "PO number is required";
    if (!form.distributor_id)
      temp.distributor_id = "Distributor is required";
    if (!form.product_items.length)
      temp.product_items = "At least one product required";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (isEditing && editId) {
      dispatch(updatePurchaseOrder({ id: editId, data: form }))
        .unwrap()
        .then(() =>
          CommonToast("Purchase order updated successfully", "success"),
        )
        .catch(() =>
          CommonToast("Failed to update purchase order", "error"),
        );
    } else {
      dispatch(createPurchaseOrder(form))
        .unwrap()
        .then(() =>
          CommonToast("Purchase order created successfully", "success"),
        )
        .catch(() =>
          CommonToast("Failed to create purchase order", "error"),
        );
    }
  };

  const handleView = (po) => {
    setViewPO(po);
    setIsViewing(true);
  };

  const handleEdit = (po) => {
    setIsEditing(true);
    setEditId(po.id);
    setForm({
      po_number: po.po_number,
      distributor_id: po.distributor_id,
      product_items: po.product_items || [],
      remarks: po.remarks || "",
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this PO?")) {
      dispatch(deletePurchaseOrder(id))
        .unwrap()
        .then(() =>
          CommonToast("Purchase order deleted successfully", "success"),
        )
        .catch(() =>
          CommonToast("Failed to delete purchase order", "error"),
        );
    }
  };

  const handleReset = () => {
    setIsEditing(false);
    setEditId(null);
    setIsViewing(false);
    setViewPO(null);
    setForm({
      po_number: "",
      distributor_id: "",
      product_items: [],
      remarks: "",
    });
    setErrors({});
  };

  const paginatedData = purchaseOrders?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  // ================= CREATE / EDIT =================
  if (isEditing) {
    return (
      <Box mt={4}>
        <Stack direction="row" alignItems="center" spacing={1} mb={3}>
          <IconButton onClick={handleReset}>
            <ArrowBackIcon />
          </IconButton>
          <CommonLabel>
            {editId ? "Edit Purchase Order" : "Create Purchase Order"}
          </CommonLabel>
        </Stack>

        <Paper sx={{ p: 3 }}>
          <Stack spacing={2}>
            <TextField
              label="PO Number"
              value={form.po_number}
              onChange={(e) =>
                setForm({ ...form, po_number: e.target.value })
              }
              error={!!errors.po_number}
              helperText={errors.po_number}
              fullWidth
            />

            <TextField
              label="Distributor ID"
              value={form.distributor_id}
              onChange={(e) =>
                setForm({ ...form, distributor_id: e.target.value })
              }
              error={!!errors.distributor_id}
              helperText={errors.distributor_id}
              fullWidth
            />

            <TextField
              label="Remarks"
              value={form.remarks}
              onChange={(e) =>
                setForm({ ...form, remarks: e.target.value })
              }
              fullWidth
              multiline
              rows={3}
            />

            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <CommonButton variant="outlined" onClick={handleReset}>
                Cancel
              </CommonButton>
              <CommonButton
                variant="contained"
                onClick={handleSubmit}
                disabled={createLoading || updateLoading}
              >
                {createLoading || updateLoading ? "Saving..." : "Save"}
              </CommonButton>
            </Stack>
          </Stack>
        </Paper>
      </Box>
    );
  }

  // ================= VIEW =================
  if (isViewing && viewPO) {
    return (
      <Box mt={4}>
        <Stack direction="row" alignItems="center" spacing={1} mb={3}>
          <IconButton onClick={handleReset}>
            <ArrowBackIcon />
          </IconButton>
          <CommonLabel>View Purchase Order</CommonLabel>
        </Stack>

        <Paper sx={{ p: 3 }}>
          <Stack spacing={2}>
            <TextField
              label="PO Number"
              value={viewPO.po_number}
              InputProps={{ readOnly: true }}
              fullWidth
            />

            <TextField
              label="Distributor ID"
              value={viewPO.distributor_id}
              InputProps={{ readOnly: true }}
              fullWidth
            />

            <TextField
              label="Status"
              value={viewPO.status}
              InputProps={{ readOnly: true }}
              fullWidth
            />

            <TextField
              label="Remarks"
              value={viewPO.remarks || "-"}
              InputProps={{ readOnly: true }}
              fullWidth
              multiline
            />

            <Typography variant="h6" mt={2}>
              Product Items
            </Typography>

            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      Product ID
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      Quantity
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      Distributor Price
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      MRP
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      Total Price
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {viewPO.product_items?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.product_id}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        ₹ {item.unit_distributor_price}
                      </TableCell>
                      <TableCell>₹ {item.unit_mrp}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        ₹ {item.total_price}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </Paper>
      </Box>
    );
  }

  // ================= LIST =================
  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight={700}>
          Purchase Orders
        </Typography>
        {/* <CommonButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsEditing(true)}
        >
          Add PO
        </CommonButton> */}
      </Stack>

      <TableContainer component={Paper}>
        <Box sx={{ display: "flex" }}>
          <CommonSearchField
            value={searchQuery}
            placeholder="Search PO number..."
            onChange={(value) => setSearchQuery(value)}
          />
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              {["Sr", "PO Number", "Status", "Total Qty", "Actions"].map(
                (h) => (
                  <TableCell key={h} sx={{ fontWeight: 700 }}>
                    {h}
                  </TableCell>
                ),
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={28} />
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              paginatedData?.map((po, index) => (
                <TableRow key={po.id} hover>
                  <TableCell>
                    {(page - 1) * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell>{po.po_number}</TableCell>
                  <TableCell>
                    <Chip
                      label={po.status}
                      color={
                        po.status === "APPROVED"
                          ? "success"
                          : po.status === "SUBMITTED"
                          ? "warning"
                          : "default"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{po.total_quantity}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleView(po)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEdit(po)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      disabled={deleteLoading}
                      onClick={() => handleDelete(po.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

            {!loading && purchaseOrders?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No purchase orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack alignItems="flex-end" mt={3}>
        <Pagination
          count={Math.ceil(
            (purchaseOrders?.length || 0) / rowsPerPage,
          )}
          page={page}
          onChange={(_, v) => setPage(v)}
        />
      </Stack>
    </Box>
  );
};

export default PurchaseOrder;
