import React, {useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {RootState} from "../store";
import {login} from "../store/userSlice";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
} from "@mui/material";

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.user);

  const [name, setName] = useState(userInfo?.userInfo?.name || "");
  const [email, setEmail] = useState(userInfo?.userInfo?.email || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({name, email}));
  };

  if (!userInfo) {
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
          <Box component="form" onSubmit={handleSubmit} sx={{mt: 2}}>
            <TextField
              fullWidth
              id="name"
              label="Name"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              margin="normal"
              variant="outlined"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{mt: 3, mb: 2}}
            >
              Update Profile
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Profile;
