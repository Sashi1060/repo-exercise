import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Button,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MenuIcon from "@mui/icons-material/Menu";
import { useSelector, useDispatch } from "react-redux"; // Redux hooks
import { logout } from "../redux/authSlice"; // Adjust path to your authSlice
import Logo from "../assets/logo.webp";

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userAnchorEl, setUserAnchorEl] = useState(null); // For dropdown
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = !!user;
  const username = user?.username || "";
  const firstLetter = username.charAt(0).toUpperCase();

  const publicMenuItems = [
    { text: "About", path: "/about" },
    { text: "Services", path: "/services" },
    { text: "Contact", path: "/contact" },
    { text: "Signup", path: "/signup" },
  ];

  const loggedInMenuItems = [
    { text: "Tests", path: "/tests" },
    { text: "Tasks", path: "/tasks" },
    { text: "Editor", path: "/editor" },
    { text: "Resources", path: "/resources" },
  ];

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleUserMenuToggle = (event) => setUserAnchorEl(event.currentTarget);
  const handleUserMenuClose = () => setUserAnchorEl(null);

  const handleLogout = () => {
    setUserAnchorEl(null);
    dispatch(logout()); // Clear Redux state
    navigate("/login"); // Redirect to login
  };

  return (
    <AppBar
      position="static"
      sx={{
        padding: 0,
        background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
      }}
    >
      <Toolbar>
        {/* Logo and Brand Name */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            textDecoration: "none",
          }}
        >
          <Link
            to={isLoggedIn ? "/dashboard" : "/"}
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                overflow: "hidden",
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                marginRight: 1,
              }}
            >
              <img
                src={Logo}
                alt="Logo"
                style={{
                  width: "90%",
                  height: "90%",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            </Box>
            <Typography
              variant="h6"
              sx={{ color: "white", fontWeight: "bold", fontSize: "1.2rem" }}
            >
              IETASK
            </Typography>
          </Link>
        </Box>

        {/* Mobile Sidebar */}
        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              size="large"
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
              sx={{
                "& .MuiDrawer-paper": {
                  background:
                    "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
                  color: "white",
                },
              }}
            >
              <List>
                {(isLoggedIn ? loggedInMenuItems : publicMenuItems).map(
                  (item) => (
                    <ListItem
                      button
                      key={item.text}
                      component={Link}
                      to={item.path}
                      onClick={toggleDrawer(false)}
                    >
                      <ListItemText primary={item.text} />
                    </ListItem>
                  )
                )}
              </List>
            </Drawer>
          </>
        ) : (
          /* Desktop Menu */
          <Box>
            {(isLoggedIn ? loggedInMenuItems : publicMenuItems).map((item) => (
              <Button
                key={item.text}
                color="inherit"
                component={Link}
                to={item.path}
                sx={{ marginLeft: 1 }}
              >
                {item.text}
              </Button>
            ))}
          </Box>
        )}

        {/* Circular Dropdown Button for Logged-in User */}
        {isLoggedIn && (
          <Box>
            <IconButton
              onClick={handleUserMenuToggle}
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: "white",
                color: "black",
                fontWeight: "bold",
                fontSize: "1rem",
              }}
            >
              {firstLetter}
            </IconButton>
            <Menu
              anchorEl={userAnchorEl}
              open={Boolean(userAnchorEl)}
              onClose={handleUserMenuClose}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem
                onClick={handleUserMenuClose}
                component={Link}
                to="/profile"
              >
                Profile
              </MenuItem>
              <MenuItem
                onClick={handleUserMenuClose}
                component={Link}
                to="/settings"
              >
                Settings
              </MenuItem>
              <MenuItem
                onClick={handleUserMenuClose}
                component={Link}
                to="/dashboard"
              >
                Dashboard
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
