

import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { sidebarLinks } from "./sidebarConfig";

import {
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Button,
  Divider
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../context/AuthContext";
import { backEndLogout } from "../Services/allApi";

const drawerWidth = 240;

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null; // prevent rendering if no user

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      await backEndLogout();
      logout();
      navigate("/login");
    } catch (err) {
      console.log("error in logging out", err);
    }
  };

  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg,rgb(20, 105, 190) 0%, #3498db 100%)",
        color: "white",
      }}
    >
      {/* Drawer Header */}
      <Toolbar sx={{ minHeight: "80px !important" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <DashboardIcon sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h6" noWrap sx={{ fontWeight: "bold" }}>
            RentEase
          </Typography>
        </Box>
      </Toolbar>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />

      {/* User Info */}
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="body1" sx={{ fontWeight: "medium" }}>
          {user.name}
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          {user.role}
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />

      {/* Sidebar Links */}
      <List sx={{ flexGrow: 1 }}>
        {sidebarLinks[user.role]?.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false); // close drawer on mobile after navigation
              }}
              sx={{
                borderRadius: 2,
                mx: 1,
                my: 0.5,
                "&.Mui-selected": {
                  backgroundColor: "rgba(255,255,255,0.2)",
                },
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Logout Button */}
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          color="inherit"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            borderColor: "rgba(255,255,255,0.3)",
            "&:hover": {
              borderColor: "rgba(255,255,255,0.5)",
              backgroundColor: "rgba(255,255,255,0.1)",
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Top AppBar */}
      <AppBar
        position="fixed"
        sx={{
          background: "linear-gradient(90deg,rgb(20, 105, 190) 0%,rgb(38, 127, 186) 100%)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          {/* Hamburger for mobile */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ mr: 2, display: { xs: "none", sm: "block" } }}>
            Hi, {user.name}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: "#f5f7fa",
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        <Box
          sx={{
            borderRadius: 3,
            p: 3,
            backgroundColor: "white",
            border: "1px solid lightblue",
            boxShadow: "0 5px 15px rgba(0,0,0,0.04)",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
