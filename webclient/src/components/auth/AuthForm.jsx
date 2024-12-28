import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import { handleLogin, handleRegister } from "./authService";
import Logo from "../../assets/logo.webp";
import { useNavigate } from "react-router-dom";

export default function AuthForm() {
  const [mode, setMode] = useState("login"); // Switch between "login" and "register"
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    admissionNumber: "",
    password: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate(); // Add this

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSnackbar({ open: false, message: "", severity: "success" }); // Reset snackbar

    try {
      if (mode === "login") {
        const response = await handleLogin(formData.email, formData.password);
        setSnackbar({
          open: true,
          message: `Welcome, ${response.username}!`,
          severity: "success",
        });
        navigate("/dashboard"); // Redirect to Dashboard
      } else {
        const response = await handleRegister(
          formData.username,
          formData.email,
          formData.admissionNumber,
          formData.password
        );
        setSnackbar({
          open: true,
          message: `Registration successful. Welcome, ${response.username}!`,
          severity: "success",
        });
        setMode("login"); // Switch to login mode after registration
      }
    } catch (error) {
      setSnackbar({ open: true, message: error.message, severity: "error" });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 5,
      }}
    >
      {/* Logo Container */}
      <Box
        sx={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <img src={Logo} alt="Logo" style={{ width: "80%", height: "80%" }} />
      </Box>

      {/* Heading */}
      <Typography variant="h4" textAlign="center" gutterBottom>
        {mode === "login" ? "Login" : "Register"}
      </Typography>

      {/* Form */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          p: 4,
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        {/* Username Field (Registration Only) */}
        {mode === "register" && (
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
        )}

        {/* Email Field */}
        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />

        {/* Admission Number Field (Registration Only) */}
        {mode === "register" && (
          <TextField
            label="Admission Number"
            name="admissionNumber"
            value={formData.admissionNumber}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
        )}

        {/* Password Field */}
        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          {mode === "login" ? "Login" : "Register"}
        </Button>
      </Box>

      {/* Toggle Between Login and Register */}
      <Stack direction="row" justifyContent="center" alignItems="center" mt={2}>
        <Typography variant="body1">
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}
        </Typography>
        <Button
          variant="text"
          color="primary"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login" ? "Register" : "Login"}
        </Button>
      </Stack>

      {/* Snackbar for Messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
