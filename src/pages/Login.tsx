// src/pages/Login.tsx
// src/pages/Login.tsx
import {useState} from "react";
import {Container, TextField, Button, Typography, Box} from "@mui/material";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = () => {
    console.log("Logging in with:", {email, password});
    // Add authentication logic here
  };

  return (
    <Container
      maxWidth="lg"
      sx={{marginLeft: "240px", width: "calc(100% - 240px)"}}
    >
      <Box sx={{mt: 4, maxWidth: "400px", margin: "0 auto"}}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Login
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          sx={{mt: 2}}
          fullWidth
        >
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
