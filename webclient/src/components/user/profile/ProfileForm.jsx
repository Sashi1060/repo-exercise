import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Stack,
} from "@mui/material";
import axios from "axios";

export default function ProfileForm() {
  const [formData, setFormData] = useState({
    fullname: "",
    mobile: "",
    address: "",
    academicDetails: "",
    experience: "",
    skills: "",
    projects: "",
    social: "",
    resume: "",
  });

  const backendurl = import.meta.env.VITE_BACKEND_PROFILES_URI;

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("accessToken"); // Assuming token is stored in localStorage
      const response = await axios.post(
        `${backendurl}/profiles`,
        {
          ...formData,
          skills: formData.skills.split(",").map((skill) => skill.trim()), // Convert skills to array
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Profile created successfully!");
      console.log("Response:", response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "An error occurred while creating the profile."
      );
      console.error("Error:", error.response?.data || error.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Create Your Profile
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 3,
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        {/* Full Name */}
        <TextField
          label="Full Name"
          name="fullname"
          value={formData.fullname}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />

        {/* Mobile */}
        <TextField
          label="Mobile"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          inputProps={{ maxLength: 10 }}
        />

        {/* Address */}
        <TextField
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />

        {/* Academic Details */}
        <TextField
          label="Academic Details"
          name="academicDetails"
          value={formData.academicDetails}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />

        {/* Experience */}
        <TextField
          label="Experience"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />

        {/* Skills */}
        <TextField
          label="Skills (comma-separated)"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />

        {/* Projects */}
        <TextField
          label="Projects"
          name="projects"
          value={formData.projects}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />

        {/* Social */}
        <TextField
          label="Social Links"
          name="social"
          value={formData.social}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />

        {/* Resume */}
        <TextField
          label="Resume Link"
          name="resume"
          value={formData.resume}
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
          Submit
        </Button>
      </Box>

      {/* Message Display */}
      {message && (
        <Typography
          variant="body2"
          color="success.main"
          textAlign="center"
          mt={2}
        >
          {message}
        </Typography>
      )}
      {error && (
        <Typography
          variant="body2"
          color="error.main"
          textAlign="center"
          mt={2}
        >
          {error}
        </Typography>
      )}
    </Container>
  );
}
