import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../feature/auth/authThunks";
import {
  forgotPassword,
  resetPassword,
} from "../../feature/profileSettings/profileSettingsThunks";
import {
  clearForgotPasswordState,
  selectForgotPasswordLoading,
  selectForgotPasswordError,
  selectForgotPasswordMessage,
} from "../../feature/profileSettings/profileSettingsSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const forgotLoading = useSelector(selectForgotPasswordLoading);
  const forgotError = useSelector(selectForgotPasswordError);
  const forgotMessage = useSelector(selectForgotPasswordMessage);

  const [form, setForm] = useState({ email: "", password: "" });
  const [forgotEmail, setForgotEmail] = useState("");

  const [showForgot, setShowForgot] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const [resetToken, setResetToken] = useState("");
  const [resetForm, setResetForm] = useState({
    new_password: "",
    confirm_password: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) navigate("/dashboard", { replace: true });
  }, [token]);

  // Handle login form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) return;

    try {
      const resultAction = await dispatch(
        forgotPassword({ email: forgotEmail }),
      );

      if (forgotPassword.fulfilled.match(resultAction)) {
        const token = resultAction.payload?.token;
        if (token) {
          setResetToken(token);
          setShowReset(true); // Show reset password form
        } else {
          alert("Token not received. Please check your email.");
        }
      }
    } catch (err) {
      console.error("Forgot password error:", err);
    }
  };

  const handleResetPassword = async () => {
    if (!resetToken) return alert("Invalid token!");
    if (resetForm.new_password !== resetForm.confirm_password)
      return alert("Passwords do not match!");

    try {
      await dispatch(resetPassword({ token: resetToken, ...resetForm }));
      alert("Password reset successfully!");

      // Reset state and go back to login
      setShowReset(false);
      setShowForgot(false);
      setResetToken("");
      setResetForm({ new_password: "", confirm_password: "" });
      setForgotEmail("");
      dispatch(clearForgotPasswordState());
    } catch (err) {
      console.error("Reset password error:", err);
    }
  };

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
        sx={{ width: "100%", maxWidth: 420, borderRadius: "16px", p: 3 }}
      >
        {!showForgot && !showReset && (
          <>
            <Typography variant="h5" fontWeight="700" mb={1}>
              Log In
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Welcome back, access your field dashboard.
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                placeholder="Email/ID"
                variant="outlined"
                sx={{ mb: 2 }}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <TextField
                fullWidth
                type="password"
                placeholder="••••••••"
                variant="outlined"
                sx={{ mb: 2 }}
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
                  "&:hover": { bgcolor: "#e02634" },
                }}
              >
                {loading ? "Logging in..." : "Log In"}
              </Button>

              <Button
                onClick={() => setShowForgot(true)}
                sx={{ mt: 1, textTransform: "none" }}
              >
                Forgot Password?
              </Button>

              {error && (
                <Typography
                  color="error"
                  variant="body2"
                  mt={2}
                  textAlign="center"
                >
                  {error}
                </Typography>
              )}
            </Box>
          </>
        )}

        {showForgot && !showReset && (
          <>
            <Typography variant="h5" fontWeight="700" mb={2}>
              Forgot Password
            </Typography>

            <TextField
              fullWidth
              placeholder="Enter your email"
              variant="outlined"
              sx={{ mb: 2 }}
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
            />

            <Button
              fullWidth
              onClick={handleForgotPassword}
              disabled={forgotLoading}
              sx={{
                bgcolor: "#ff2d3d",
                color: "#fff",
                py: 1.4,
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": { bgcolor: "#e02634" },
              }}
            >
              {forgotLoading ? "Sending..." : "Send Reset Link"}
            </Button>

            {forgotError && (
              <Typography
                color="error"
                variant="body2"
                mt={2}
                textAlign="center"
              >
                {forgotError}
              </Typography>
            )}

            <Button
              onClick={() => {
                setShowForgot(false);
                dispatch(clearForgotPasswordState());
              }}
              sx={{ mt: 2, textTransform: "none" }}
            >
              Back to Login
            </Button>
          </>
        )}

        {/* RESET PASSWORD FORM */}
        {showReset && (
          <>
            <Typography variant="h5" fontWeight="700" mb={2}>
              Reset Password
            </Typography>

            <TextField
              fullWidth
              type="password"
              placeholder="New Password"
              variant="outlined"
              sx={{ mb: 2 }}
              value={resetForm.new_password}
              onChange={(e) =>
                setResetForm({ ...resetForm, new_password: e.target.value })
              }
            />

            <TextField
              fullWidth
              type="password"
              placeholder="Confirm Password"
              variant="outlined"
              sx={{ mb: 3 }}
              value={resetForm.confirm_password}
              onChange={(e) =>
                setResetForm({ ...resetForm, confirm_password: e.target.value })
              }
            />

            <Button
              fullWidth
              onClick={handleResetPassword}
              disabled={forgotLoading}
              sx={{
                bgcolor: "#ff2d3d",
                color: "#fff",
                py: 1.4,
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": { bgcolor: "#e02634" },
              }}
            >
              {forgotLoading ? "Resetting..." : "Reset Password"}
            </Button>

            {forgotError && (
              <Typography
                color="error"
                variant="body2"
                mt={2}
                textAlign="center"
              >
                {forgotError}
              </Typography>
            )}
            {forgotMessage && (
              <Typography
                color="primary"
                variant="body2"
                mt={2}
                textAlign="center"
              >
                {forgotMessage}
              </Typography>
            )}

            <Button
              onClick={() => {
                setShowReset(false);
                setShowForgot(false);
                setResetForm({ new_password: "", confirm_password: "" });
                setForgotEmail("");
                dispatch(clearForgotPasswordState());
              }}
              sx={{ mt: 2, textTransform: "none" }}
            >
              Back to Login
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default Login;
