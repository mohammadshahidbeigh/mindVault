// src/pages/Login.tsx
import React from "react";
import {Container, TextField, Button, Typography, Box} from "@mui/material";
import {useDispatch} from "react-redux";
import {login} from "../store/userSlice";
import {useNavigate} from "react-router-dom";
import {useSnackbar} from "notistack";
import {Formik, Form, Field} from "formik";
import * as Yup from "yup";

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
    <Container maxWidth="sm">
      <Box sx={{mt: 4}}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <Formik
          initialValues={{email: "", password: ""}}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({errors, touched}) => (
            <Form>
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                name="email"
                label="Email"
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
                sx={{mt: 2}}
              >
                Login
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default Login;
