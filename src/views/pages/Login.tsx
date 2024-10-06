// src/pages/Login.tsx
import React, {useState} from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Avatar,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {useDispatch} from "react-redux";
import {useNavigate, Link} from "react-router-dom";
import {useSnackbar} from "notistack";
import {Formik, Form, Field} from "formik";
import * as Yup from "yup";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {loginUser} from "../../store/userSlice";
import {AppDispatch} from "../../store";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {enqueueSnackbar} = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (values: {email: string; password: string}) => {
    dispatch(loginUser(values))
      .unwrap()
      .then(() => {
        enqueueSnackbar("Login successful", {variant: "success"});
        navigate("/dashboard");
      })
      .catch((error: string) => {
        enqueueSnackbar(error, {variant: "error"});
      });
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        width: "60%",
        maxWidth: "280px",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          mt: 8,
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{m: 1, bgcolor: "secondary.main"}}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" gutterBottom>
          Log in
        </Typography>
        <Formik
          initialValues={{email: "", password: ""}}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({errors, touched}) => (
            <Form style={{width: "100%"}}>
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                name="email"
                label="Email Address"
                variant="outlined"
                error={touched.email && !!errors.email}
                helperText={touched.email && errors.email}
              />
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                error={touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                sx={{mt: 3, mb: 2}}
              >
                Login
              </Button>
              <Box sx={{mt: 2, textAlign: "center"}}>
                <Link
                  to="/forgot-password"
                  style={{
                    textDecoration: "none",
                    color: "primary.main",
                    pointerEvents: "none",
                    opacity: 0.5,
                  }}
                >
                  Forgot password?
                </Link>
              </Box>
              <Box sx={{mt: 2, textAlign: "center"}}>
                <Typography variant="body2">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    style={{textDecoration: "none", color: "primary.main"}}
                  >
                    Sign Up
                  </Link>
                </Typography>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default Login;
