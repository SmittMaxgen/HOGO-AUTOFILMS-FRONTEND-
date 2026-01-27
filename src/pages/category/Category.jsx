import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../feature/category/categoryThunks";

import {
  selectCategoryList,
  selectCategoryLoading,
} from "../../feature/category/categorySelector";

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Typography,
  Pagination,
  Stack,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Switch,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CategoryIcon from "@mui/icons-material/Category";
import ImageIcon from "@mui/icons-material/Image";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";

import Loader from "../../components/commonComponents/Loader";
import CommonButton from "../../components/commonComponents/CommonButton";
import CommonLabel from "../../components/commonComponents/CommonLabel";
import CommonToast from "../../components/commonComponents/Toster";
import CommonSearchField from "../../components/commonComponents/CommonSearchField";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  catHeadRight: {
    display: "flex",
    justifyContent: "space-between",
  },
  CommonSearchBar: {
    margin: "10px",
  },
}));

const Category = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const categories = useSelector(selectCategoryList);
  const loading = useSelector(selectCategoryLoading);

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const [isViewing, setIsViewing] = useState(false);
  const [viewItem, setViewItem] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    image: null,
    order: 1,
    status: true,
  });

  const [errors, setErrors] = useState({});

  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery !== "") {
        console.log("searchQuery", searchQuery);
        dispatch(getCategory(searchQuery));
      } else {
        dispatch(getCategory(""));
      }
    }, 500); 

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const temp = {};
    if (!form.name) temp.name = "Category name is required";
    // if (!form.image && !editId) temp.image = "Image is required";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const resetForm = () => {
    setForm({
      name: "",
      image: null,
      order: 1,
      status: true,
    });
    setErrors({});
    setEditId(null);
    setIsEditing(false);
  };

  const handleStatusToggle = (item) => {
    const data = new FormData();
    data.append("status", !item.status);

    dispatch(updateCategory({ id: item.id, data }))
      .unwrap()
      .then(() => {
        dispatch(getCategory(searchQuery));
        CommonToast(
          `Category ${!item.status ? "activated" : "deactivated"} successfully`,
          "success",
        );
      })
      .catch(() => CommonToast("Failed to update status", "error"));
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const data = new FormData();
    data.append("name", form.name);
    if (form.image) data.append("image", form.image);
    data.append("order", form.order);
    data.append("status", form.status);

    const action = editId
      ? updateCategory({ id: editId, data })
      : createCategory(data);

    dispatch(action)
      .unwrap()
      .then(() => {
        dispatch(getCategory(searchQuery));
        resetForm();
        CommonToast(
          editId
            ? "Category updated successfully"
            : "Category created successfully",
          "success",
        );
      })
      .catch(() =>
        CommonToast(
          editId ? "Failed to update category" : "Failed to create category",
          "error",
        ),
      );
  };

  const handleView = (item) => {
    setViewItem(item);
    setIsViewing(true);
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({
      name: item.name || "",
      image: null,
      // order: item.order || 1,
      status: item.status ?? true,
    });
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    dispatch(deleteCategory(id))
      .unwrap()
      .then(() => {
        dispatch(getCategory(searchQuery));
        CommonToast("Category deleted successfully", "success");
      })
      .catch(() => CommonToast("Failed to delete category", "error"));
  };

  const handleAddCategory = () => {
    resetForm();
    setIsEditing(true);
  };
  const paginatedData = categories?.data?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  if (loading) return <Loader text="Loading categories..." fullScreen={true} />;

  if (isEditing) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Box width="100%">
          <Stack direction="row" alignItems="center" spacing={1} mb={3}>
            <IconButton onClick={resetForm}>
              <ArrowBackIcon />
            </IconButton>
            <CommonLabel>
              {editId ? "Edit Category" : "Create Category"}
            </CommonLabel>
          </Stack>

          <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
              <TextField
                label="Category Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                fullWidth
                InputProps={{
                  startAdornment: <CategoryIcon sx={{ mr: 1 }} />,
                }}
              />

              {errors.image && (
                <Typography color="error">{errors.image}</Typography>
              )}

              {form.image && (
                <Typography variant="body2">
                  Selected: {form.image.name}
                </Typography>
              )}

              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.status}
                    name="status"
                    onChange={handleChange}
                  />
                }
                label="Active"
              />

              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Button onClick={resetForm}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit}>
                  Save
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Box>
      </Box>
    );
  }
  if (isViewing && viewItem) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Box width="100%">
          <Stack direction="row" alignItems="center" spacing={1} mb={3}>
            <IconButton
              onClick={() => {
                setIsViewing(false);
                setViewItem(null);
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <CommonLabel>View Category</CommonLabel>
          </Stack>

          <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
              <TextField
                label="Category Name"
                fullWidth
                value={viewItem.name}
                InputProps={{ readOnly: true }}
              />
              {/* 
              <TextField
                label="Display Order"
                fullWidth
                value={viewItem.order}
                InputProps={{ readOnly: true }}
              /> */}

              <FormControlLabel
                control={<Checkbox checked={viewItem.status} disabled />}
                label="Active"
              />

              {viewItem.image && (
                <Box mt={2}>
                  <Typography variant="subtitle2">Category Image</Typography>
                  <Avatar
                    src={`https://hogofilm.pythonanywhere.com/${viewItem.image}`}
                    variant="rounded"
                    sx={{ width: 120, height: 120, mt: 1 }}
                  />
                </Box>
              )}
            </Stack>
          </Paper>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{ color: "#7E7E7E", mb: 2 }}
        >
          Categories
        </Typography>
        <Box className={classes.catHeadRight}>
          <CommonButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleAddCategory()}
          >
            Add Category
          </CommonButton>
        </Box>
      </Stack>

      <TableContainer component={Paper}>
        <Box sx={{ display: "flex" }}>
          <CommonSearchField
            className={classes.CommonSearchBar}
            value={searchQuery}
            placeholder="Search by name.."
            onChange={(value) => setSearchQuery(value)}
          />
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              {[
                "Sr",
                // "Image",
                "Name",
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
            {paginatedData?.map((item, index) => (
              <TableRow key={item.id} hover>
                <TableCell sx={{ fontWeight: 700 }}>
                  {(page - 1) * rowsPerPage + index + 1}
                </TableCell>

                {/* <TableCell>
                  <Avatar
                    src={`https://hogofilm.pythonanywhere.com/${item?.image}`}
                    variant="rounded"
                    sx={{ width: 52, height: 52 }}
                  />
                </TableCell> */}

                <TableCell>
                  <Typography fontWeight={600}>{item.name}</Typography>
                </TableCell>

                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Switch
                      checked={item.status} // true = On, false = Off
                      onChange={() => handleStatusToggle(item)}
                      color="success"
                      size="small"
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "success.main",
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                          {
                            backgroundColor: "success.light",
                          },
                      }}
                    />
                    <Typography
                      variant="body2"
                      color={item.status ? "success.main" : "text.secondary"}
                    >
                      {item.status ? "Active" : "Inactive"}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>
                  <IconButton size="small" onClick={() => handleView(item)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="warning"
                    onClick={() => handleEdit(item)}
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(item.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {categories?.data?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No categories found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack alignItems="flex-end" mt={3}>
        <Pagination
          count={Math.ceil(categories?.data?.length / rowsPerPage)}
          page={page}
          onChange={(_, v) => setPage(v)}
        />
      </Stack>
    </Box>
  );
};

export default Category;
