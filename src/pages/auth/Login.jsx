import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Paper,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../feature/auth/authThunks";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [token]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#fdecec",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 420,
          borderRadius: "16px",
          p: 3,
        }}
      >
        {/* Header */}
        <IconButton sx={{ mb: 2 }}>
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>

        <Typography variant="h5" fontWeight="700">
          Log in
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Welcome back, access your field dashboard.
        </Typography>

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="body2" fontWeight={500} mb={1}>
            Email/ID
          </Typography>

          <TextField
            fullWidth
            placeholder="your email id OR"
            variant="outlined"
            sx={{ mb: 2 }}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <Typography variant="body2" fontWeight={500} mb={1}>
            Password
          </Typography>

          <TextField
            fullWidth
            type="password"
            placeholder="••••••••"
            variant="outlined"
            sx={{ mb: 3 }}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <Button
            type="submit"
            fullWidth
            disabled={loading}
            sx={{
              bgcolor: "#ff2d3d",
              color: "#fff",
              py: 1.4,
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                bgcolor: "#e02634",
              },
            }}
          >
            {loading ? "Logging in..." : "Log In"}
          </Button>

          {error && (
            <Typography color="error" variant="body2" textAlign="center" mt={2}>
              {error}
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
