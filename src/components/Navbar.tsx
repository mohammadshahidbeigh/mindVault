// src/components/Navbar.tsx
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import {Link} from "react-router-dom";
import {
  Home as HomeIcon,
  Login as LoginIcon,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";

const Navbar: React.FC = () => {
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
      <Typography variant="h6" sx={{p: 2, color: "white"}}>
        MindVault
      </Typography>
      <List>
        <ListItem component={Link} to="/" sx={{color: "white"}}>
          <ListItemIcon>
            <HomeIcon sx={{color: "white"}} />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem component={Link} to="/login" sx={{color: "white"}}>
          <ListItemIcon>
            <LoginIcon sx={{color: "white"}} />
          </ListItemIcon>
          <ListItemText primary="Login" />
        </ListItem>
        <ListItem component={Link} to="/dashboard" sx={{color: "white"}}>
          <ListItemIcon>
            <DashboardIcon sx={{color: "white"}} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Navbar;
