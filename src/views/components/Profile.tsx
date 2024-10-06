import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {Box, Container, Paper, Typography} from "@mui/material";

const Profile: React.FC = () => {
  const userState = useSelector((state: RootState) => state.user);

  if (!userState.isLoggedIn) {
    return <div>Please log in to view your profile.</div>;
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
        <Paper elevation={3} sx={{p: 4, borderRadius: 2}}>
          <Typography variant="h4" align="center" gutterBottom>
            User Profile
          </Typography>
          <Box sx={{mt: 2}}>
            <Typography variant="body1">
              Name: {userState.userInfo?.name}
            </Typography>
            <Typography variant="body1">
              Email: {userState.userInfo?.email}
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Profile;
