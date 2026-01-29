import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getCost,
  createCost,
  updateCost,
  deleteCost,
} from "../../feature/cost/costThunks";

import {
  selectCostList,
  selectCostLoading,
  selectCostError,
} from "../../feature/cost/costSelector";

import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  IconButton,
  TextField,
  FormControlLabel,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Pagination,
  Autocomplete,
  CircularProgress,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";

import Loader from "../../components/commonComponents/Loader";
import CommonButton from "../../components/commonComponents/CommonButton";
import CommonLabel from "../../components/commonComponents/CommonLabel";
import CommonToast from "../../components/commonComponents/Toster";
import { getShipments } from "../../feature/shipments/shipmentThunks";

const Cost = () => {
  const dispatch = useDispatch();

  const costs = useSelector(selectCostList);
  const loading = useSelector(selectCostLoading);
  const error = useSelector(selectCostError);

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [isViewing, setIsViewing] = useState(false);
  const [viewCost, setViewCost] = useState(null);

  const [shipmentOptions, setShipmentOptions] = useState([]);
  const [form, setForm] = useState({
    shipment_id: "",
    cost_amount_inr: "",
    capitalized: true,
    reference_doc: "",
    cost_type_cha: "",
    cost_type_trasnport: "",
    cost_type_duty: "",
    cost_type_freight: "",
    cost_type_igst: "",
    cost_type_insurance: "",
    cost_type_others: "",
    cost_type_port: "",
    cost_type_transport: "",
  });

  const [errors, setErrors] = useState({});
  useEffect(() => {
    dispatch(getCost());
    dispatch(getShipments())
      .unwrap()
      .then((res) => setShipmentOptions(res))
      .catch(() => CommonToast("Failed to load shipments", "error"));
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    const temp = {};

    if (!form.shipment_id) temp.shipment_id = "Shipment ID is required";
    if (!form.cost_amount_inr) temp.cost_amount_inr = "Cost amount is required";
    if (!form.cost_type_cha) temp.cost_type_cha = "CHA is required";
    if (!form.cost_type_trasnport)
      temp.cost_type_trasnport = "Transport is required";
    if (!form.cost_type_duty) temp.cost_type_duty = "Duty is required";
    if (!form.cost_type_freight) temp.cost_type_freight = "Freight is required";
    if (!form.cost_type_igst) temp.cost_type_igst = "IGST is required";
    if (!form.cost_type_insurance)
      temp.cost_type_insurance = "Insurance is required";
    if (!form.cost_type_others) temp.cost_type_others = "Others is required";
    if (!form.cost_type_port) temp.cost_type_port = "Port is required";
    // if (!form.cost_type_transport)
    //   temp.cost_type_transport = "Transport is required";

    setErrors(temp);

    // Show first error in toast
    const firstError = Object.values(temp)[0];
    if (firstError) CommonToast(firstError, "error");

    return Object.keys(temp).length === 0;
  };
  const handleSubmit = () => {
    if (!validate()) return;

    if (isEditing && editId) {
      dispatch(updateCost({ id: editId, data: form }))
        .unwrap()
        .then(() => {
          dispatch(getCost());
          CommonToast("Cost updated successfully", "success");
          handleReset();
        })
        .catch(() => CommonToast("Failed to update cost", "error"));
    } else {
      dispatch(createCost(form))
        .unwrap()
        .then(() => {
          dispatch(getCost());
          CommonToast("Cost created successfully", "success");
          handleReset();
        })
        .catch(() => CommonToast("Failed to create cost", "error"));
    }
  };

  const handleView = (cost) => {
    setViewCost(cost);
    setIsViewing(true);
  };

  const handleEdit = (cost) => {
    setIsEditing(true);
    setEditId(cost.id);
    setForm({
      shipment_id: cost.shipment_id,
      cost_amount_inr: cost.cost_amount_inr,
      capitalized: cost.capitalized,
      reference_doc: cost.reference_doc,
      cost_type_cha: cost.cost_type_cha || "",
      cost_type_trasnport: cost.cost_type_trasnport || "",
      cost_type_duty: cost.cost_type_duty || "",
      cost_type_freight: cost.cost_type_freight || "",
      cost_type_igst: cost.cost_type_igst || "",
      cost_type_insurance: cost.cost_type_insurance || "",
      cost_type_others: cost.cost_type_others || "",
      cost_type_port: cost.cost_type_port || "",
      //   cost_type_transport: cost.cost_type_transport || "",
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this cost?")) {
      dispatch(deleteCost(id))
        .unwrap()
        .then(() => dispatch(getCost()));
    }
  };

  const handleReset = () => {
    setForm({
      shipment_id: "",
      cost_amount_inr: "",
      capitalized: true,
      reference_doc: "",
      cost_type_cha: "",
      cost_type_trasnport: "",
      cost_type_duty: "",
      cost_type_freight: "",
      cost_type_igst: "",
      cost_type_insurance: "",
      cost_type_others: "",
      cost_type_port: "",
      cost_type_transport: "",
    });

    setErrors({});
    setEditId(null);
    setIsEditing(false);
  };

  const handleAdd = () => {
    handleReset();
    setIsEditing(true);
  };

  const paginatedData = costs?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  if (isEditing) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Box width="100%">
          <Stack direction="row" alignItems="center" spacing={1} mb={3}>
            <IconButton onClick={handleReset}>
              <ArrowBackIcon />
            </IconButton>
            <CommonLabel>{editId ? "Edit Cost" : "Create Cost"}</CommonLabel>
          </Stack>

          <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Autocomplete
                options={shipmentOptions?.data || []}
                getOptionLabel={(option) =>
                  `${option.id} - ${option.supplier_name}`
                }
                value={
                  shipmentOptions?.data.find(
                    (s) => s.id === form.shipment_id,
                  ) || null
                }
                onChange={(_, newValue) => {
                  setForm((prev) => ({
                    ...prev,
                    shipment_id: newValue ? newValue.id : "",
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Shipment"
                    error={!!errors.shipment_id}
                    helperText={errors.shipment_id}
                    fullWidth
                  />
                )}
              />

              <TextField
                label="Cost Amount (INR)"
                name="cost_amount_inr"
                value={form.cost_amount_inr}
                onChange={handleChange}
                error={!!errors.cost_amount_inr}
                helperText={errors.cost_amount_inr}
                fullWidth
              />

              <TextField
                label="Reference Document"
                name="reference_doc"
                error={!!errors.reference_doc}
                value={form.reference_doc}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="CHA"
                name="cost_type_cha"
                error={!!errors.cost_type_cha}
                value={form.cost_type_cha}
                onChange={handleChange}
                fullWidth
              />

              <TextField
                label="Transport"
                name="cost_type_trasnport"
                error={!!errors.cost_type_trasnport}
                value={form.cost_type_trasnport}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Duty"
                name="cost_type_duty"
                error={!!errors.cost_type_duty}
                value={form.cost_type_duty}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Freight"
                name="cost_type_freight"
                error={!!errors.cost_type_freight}
                value={form.cost_type_freight}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="IGST"
                name="cost_type_igst"
                error={!!errors.cost_type_igst}
                value={form.cost_type_igst}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Insurance"
                name="cost_type_insurance"
                error={!!errors.cost_type_insurance}
                value={form.cost_type_insurance}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Others"
                name="cost_type_others"
                error={!!errors.cost_type_others}
                value={form.cost_type_others}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Port"
                name="cost_type_port"
                error={!!errors.cost_type_port}
                value={form.cost_type_port}
                onChange={handleChange}
                fullWidth
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.capitalized}
                    name="capitalized"
                    onChange={handleChange}
                  />
                }
                label="Capitalized"
              />

              {/* <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Button onClick={handleReset}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit}>
                  {editId ? "Update" : "Save"}
                </Button>
              </Stack> */}
              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <CommonButton variant="outlined" onClick={handleReset}>
                  Cancel
                </CommonButton>
                <CommonButton
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading || loading}
                >
                  {loading || loading ? "Saving..." : "Save"}
                </CommonButton>
              </Stack>
            </Stack>
          </Paper>
        </Box>
      </Box>
    );
  }

  if (isViewing && viewCost) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Box width="100%">
          <Stack direction="row" alignItems="center" spacing={1} mb={3}>
            <IconButton
              onClick={() => {
                setIsViewing(false);
                setViewCost(null);
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <CommonLabel>View Cost</CommonLabel>
          </Stack>

          <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
              <TextField
                label="Shipment ID"
                value={viewCost.shipment_id}
                fullWidth
                InputProps={{ readOnly: true }}
              />

              <TextField
                label="Cost Amount (INR)"
                value={viewCost.cost_amount_inr}
                fullWidth
                InputProps={{ readOnly: true }}
              />

              <TextField
                label="Reference Document"
                value={viewCost.reference_doc}
                fullWidth
                InputProps={{ readOnly: true }}
              />

              <FormControlLabel
                control={<Checkbox checked={viewCost.capitalized} disabled />}
                label="Capitalized"
              />
            </Stack>
          </Paper>
        </Box>
      </Box>
    );
  }

  // if (loading) return <Loader text="Loading costs..." fullScreen />;

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight={700} sx={{ color: "#7E7E7E" }}>
          Costs
        </Typography>
        <CommonButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Add Cost
        </CommonButton>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {[
                "Sr",
                "Shipment ID",
                "Amount (INR)",
                "Capitalized",
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
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={28} />
                  <Typography variant="body2" mt={1}>
                    Loading costs...
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              paginatedData?.map((item, index) => (
                <TableRow key={item.id} hover>
                  <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{item.shipment_id}</TableCell>
                  <TableCell>{item.cost_amount_inr}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.capitalized ? "Yes" : "No"}
                      size="small"
                      clickable
                      sx={{
                        fontWeight: 600,
                        borderRadius: "12px",
                        paddingX: 1.5,
                        paddingY: 0.5,
                        color: item.capitalized
                          ? "success.main"
                          : "text.secondary",
                        backgroundColor: item.capitalized
                          ? "success.lighter"
                          : "grey.100",
                        border: item.capitalized ? "1px solid" : "1px solid",
                        borderColor: item.capitalized
                          ? "success.main"
                          : "grey.300",
                        textTransform: "capitalize",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: item.capitalized
                            ? "success.light"
                            : "grey.200",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleView(item)}
                      color="primary"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleEdit(item)}
                      color="warning"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(item.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

            {costs?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No costs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack alignItems="flex-end" mt={3}>
        <Pagination
          count={Math.ceil((costs?.length || 0) / rowsPerPage)}
          page={page}
          onChange={(_, v) => setPage(v)}
          color="primary"
        />
      </Stack>
    </Box>
  );
};

export default Cost;
