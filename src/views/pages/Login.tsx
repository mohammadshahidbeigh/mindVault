// src/pages/Login.tsx
import React from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Avatar,
} from "@mui/material";
import {useDispatch} from "react-redux";
import {login} from "../../store/userSlice";
import {useNavigate, Link} from "react-router-dom";
import {useSnackbar} from "notistack";
import {Formik, Form, Field} from "formik";
import * as Yup from "yup";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {enqueueSnackbar} = useSnackbar();

  const handleLogin = (values: {email: string; password: string}) => {
    // Simulating a successful login
    dispatch(login({email: values.email, name: "John Doe"}));

    // Show success notification at lower right side
    enqueueSnackbar("Login successful", {
      variant: "success",
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "right",
      },
    });

    // Navigate to dashboard after login
    navigate("/dashboard");
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        width: "60%",
        maxWidth: "280px",
        marginLeft: "auto",
        marginRight: "20%",
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
                error={touched.email && errors.email}
                helperText={touched.email && errors.email}
              />
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                name="password"
                label="Password"
                type="password"
                variant="outlined"
                error={touched.password && errors.password}
                helperText={touched.password && errors.password}
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
                  style={{textDecoration: "none", color: "primary.main"}}
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
