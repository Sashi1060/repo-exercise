import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../../../redux/profileSlice";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Avatar,
  Chip,
} from "@mui/material";
import { Person } from "@mui/icons-material";

export default function ProfileView() {
  const dispatch = useDispatch();
  const { profile, status, error } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  if (status === "loading")
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  const profileData = profile?.profile;

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography
        variant="h4"
        textAlign="center"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "primary.main",
          mb: 4,
        }}
      >
        Profile
      </Typography>
      {profileData ? (
        <Card sx={{ boxShadow: 4, borderRadius: 2 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              {/* Avatar */}
              <Grid item xs={12} sm={3} textAlign="center">
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    margin: "0 auto",
                    backgroundColor: "primary.main",
                    fontSize: "2rem",
                  }}
                >
                  {profileData.fullname?.charAt(0) || <Person />}
                </Avatar>
                <Typography
                  variant="h6"
                  sx={{ mt: 1, fontWeight: "bold" }}
                  textAlign="center"
                >
                  {profileData.fullname || "N/A"}
                </Typography>
              </Grid>

              {/* Profile Details */}
              <Grid item xs={12} sm={9}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Typography>
                    <strong>Mobile:</strong> {profileData.mobile || "N/A"}
                  </Typography>
                  <Typography>
                    <strong>Address:</strong> {profileData.address || "N/A"}
                  </Typography>
                  <Typography>
                    <strong>Academic Details:</strong>{" "}
                    {profileData.academicDetails
                      ? `${profileData.academicDetails.highestQualification}, ${profileData.academicDetails.university} (${profileData.academicDetails.graduationYear})`
                      : "N/A"}
                  </Typography>
                  <Typography>
                    <strong>Experience:</strong>{" "}
                    {profileData.experience?.roles
                      ? profileData.experience.roles
                          .map(
                            (role) =>
                              `${role.title} at ${role.company} (${role.duration})`
                          )
                          .join(", ")
                      : "N/A"}
                  </Typography>
                  <Typography>
                    <strong>Skills:</strong>{" "}
                    {Array.isArray(profileData.skills)
                      ? profileData.skills.join(", ")
                      : "N/A"}
                  </Typography>
                  <Typography>
                    <strong>Projects:</strong>{" "}
                    {profileData.projects
                      ? Object.values(profileData.projects)
                          .map(
                            (project) =>
                              `${project.title}: ${project.description}`
                          )
                          .join("; ")
                      : "N/A"}
                  </Typography>
                  <Typography>
                    <strong>Social:</strong>{" "}
                    {profileData.social
                      ? Object.entries(profileData.social).map(
                          ([key, value]) => (
                            <Chip
                              key={key}
                              label={key}
                              component="a"
                              href={value}
                              target="_blank"
                              clickable
                              sx={{ mr: 1, mb: 1 }}
                            />
                          )
                        )
                      : "N/A"}
                  </Typography>
                  <Typography>
                    <strong>Resume:</strong>{" "}
                    {profileData.resume ? (
                      <a
                        href={profileData.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Resume
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ) : (
        <Typography>No profile found. Please create one.</Typography>
      )}
    </Container>
  );
}
