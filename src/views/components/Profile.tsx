import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Divider,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {Person as PersonIcon, Email as EmailIcon} from "@mui/icons-material";

const Profile: React.FC = () => {
  const userState = useSelector((state: RootState) => state.user);

  if (!userState.isLoggedIn) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6">
          Please log in to view your profile.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "background.default",
        marginLeft: "20%",
        marginRight: "auto",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{p: 4, borderRadius: 2, bgcolor: "background.paper"}}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Avatar
              sx={{width: 100, height: 100, mb: 2, bgcolor: "primary.main"}}
            >
              {userState.userInfo?.name.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h4" align="center" gutterBottom>
              User Profile
            </Typography>
          </Box>
          <Divider sx={{mb: 3}} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{display: "flex", alignItems: "center", mb: 2}}>
                    <PersonIcon sx={{mr: 2, color: "primary.main"}} />
                    <Typography variant="h6">
                      {userState.userInfo?.name}
                    </Typography>
                  </Box>
                  <Box sx={{display: "flex", alignItems: "center"}}>
                    <EmailIcon sx={{mr: 2, color: "primary.main"}} />
                    <Typography variant="body1">
                      {userState.userInfo?.email}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Profile;
