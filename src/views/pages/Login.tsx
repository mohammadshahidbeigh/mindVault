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
  Grid,
  Fade,
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
import xss from "xss"; // Import xss for sanitization

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
    const sanitizedValues = {
      email: xss(values.email), // Sanitize email
      password: values.password, // Passwords should not be sanitized
    };
    dispatch(loginUser(sanitizedValues))
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
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        marginLeft: "240px",
      }}
    >
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          width: "60%",
          maxWidth: "320px",
        }}
      >
        <Fade in={true} timeout={1000}>
          <Paper
            elevation={6}
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: "16px",
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Avatar
              sx={{m: 1, bgcolor: "secondary.main", width: 56, height: 56}}
            >
              <LockOutlinedIcon fontSize="large" />
            </Avatar>
            <Typography
              component="h1"
              variant="h4"
              gutterBottom
              fontWeight="bold"
              color="primary"
            >
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
                    size="large"
                    sx={{mt: 3, mb: 2, borderRadius: "25px", py: 1.5}}
                  >
                    Login
                  </Button>
                  <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                  >
                    <Grid item xs={12} sm={6}>
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
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" align="right">
                        Don't have an account?{" "}
                        <Link
                          to="/signup"
                          style={{
                            textDecoration: "none",
                            color: "primary.main",
                            fontWeight: "bold",
                          }}
                        >
                          Sign Up
                        </Link>
                      </Typography>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login;
