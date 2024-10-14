// src/components/Navbar.tsx
import React, {useState} from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../store/userSlice";
import {useNavigate, Link} from "react-router-dom";
import {RootState} from "../../store";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonIcon from "@mui/icons-material/Person";
import MenuIcon from "@mui/icons-material/Menu";
import {useSnackbar} from "notistack";

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {enqueueSnackbar} = useSnackbar();
  const isLoggedIn = useSelector((state: RootState) => state.user?.isLoggedIn);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    enqueueSnackbar("Logged out successfully", {
      variant: "success",
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "right",
      },
    });
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawerContent = (
    <>
      <Box sx={{p: 2, flexShrink: 0, display: "flex", alignItems: "center"}}>
        <img
          src="https://static.cdnlogo.com/logos/s/71/supergiant.svg"
          alt="MindVault Logo"
          style={{
            width: "40px",
            height: "40px",
            marginRight: "10px",
          }}
        />
        <Typography variant="h5" component="div" sx={{fontWeight: "bold"}}>
          MindVault
        </Typography>
      </Box>
      <Divider
        sx={{backgroundColor: "rgba(255, 255, 255, 0.2)", flexShrink: 0}}
      />
      <List sx={{flexGrow: 1, overflow: "auto"}}>
        <ListItem
          component={Link}
          to="/"
          sx={{
            color: "white",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
            borderRadius: "8px",
            m: 1,
          }}
          onClick={isMobile ? handleDrawerToggle : undefined}
        >
          <ListItemIcon>
            <HomeIcon sx={{color: "white"}} />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        {isLoggedIn ? (
          <>
            <ListItem
              component={Link}
              to="/profile"
              sx={{
                color: "white",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
                borderRadius: "8px",
                m: 1,
              }}
              onClick={isMobile ? handleDrawerToggle : undefined}
            >
              <ListItemIcon>
                <PersonIcon sx={{color: "white"}} />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem
              component={Link}
              to="/dashboard"
              sx={{
                color: "white",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
                borderRadius: "8px",
                m: 1,
              }}
              onClick={isMobile ? handleDrawerToggle : undefined}
            >
              <ListItemIcon>
                <DashboardIcon sx={{color: "white"}} />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem
              component={Link}
              to="/login"
              sx={{
                color: "white",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
                borderRadius: "8px",
                m: 1,
              }}
              onClick={isMobile ? handleDrawerToggle : undefined}
            >
              <ListItemIcon>
                <LoginIcon sx={{color: "white"}} />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem
              component={Link}
              to="/signup"
              sx={{
                color: "white",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
                borderRadius: "8px",
                m: 1,
              }}
              onClick={isMobile ? handleDrawerToggle : undefined}
            >
              <ListItemIcon>
                <PersonAddIcon sx={{color: "white"}} />
              </ListItemIcon>
              <ListItemText primary="Sign Up" />
            </ListItem>
          </>
        )}
      </List>
      {isLoggedIn && (
        <List>
          <ListItem
            onClick={handleLogout}
            sx={{
              color: "white",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
              borderRadius: "8px",
              m: 1,
            }}
          >
            <ListItemIcon>
              <LogoutIcon sx={{color: "white"}} />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      )}
    </>
  );

  return (
    <>
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{mr: 2, position: "fixed", top: 10, left: 10, zIndex: 1100}}
        >
          <MenuIcon />
        </IconButton>
      )}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={isMobile ? handleDrawerToggle : undefined}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        anchor="left"
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
            backgroundColor: "#2563eb",
            color: "white",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Navbar;
