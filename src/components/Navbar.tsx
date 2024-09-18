// src/components/Navbar.tsx
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../store/userSlice";
import {useNavigate, Link} from "react-router-dom";
import {RootState} from "../store";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import {useSnackbar} from "notistack";

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {enqueueSnackbar} = useSnackbar();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

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
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          backgroundColor: "#2563eb", // bg-blue-600
        },
      }}
    >
      <List>
        <ListItem>
          <Typography variant="h6" component="div" sx={{color: "white"}}>
            MindVault
          </Typography>
        </ListItem>
        <ListItem
          component={Link}
          to="/"
          sx={{
            color: "white",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
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
              to="/dashboard"
              sx={{
                color: "white",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <ListItemIcon>
                <DashboardIcon sx={{color: "white"}} />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem
              onClick={handleLogout}
              sx={{
                color: "white",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <ListItemIcon>
                <LogoutIcon sx={{color: "white"}} />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          <ListItem
            component={Link}
            to="/login"
            sx={{
              color: "white",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <ListItemIcon>
              <LoginIcon sx={{color: "white"}} />
            </ListItemIcon>
            <ListItemText primary="Login" />
          </ListItem>
        )}
      </List>
    </Drawer>
  );
};

export default Navbar;
