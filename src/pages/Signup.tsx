// src/pages/Signup.tsx
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
import {login} from "../store/userSlice";
import {useNavigate, Link} from "react-router-dom";
import {useSnackbar} from "notistack";
import {Formik, Form, Field} from "formik";
import * as Yup from "yup";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const SignupSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Required"),
});

const Signup: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {enqueueSnackbar} = useSnackbar();

  const handleSignup = (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    // Simulating a successful signup
    dispatch(login({email: values.email, name: values.name}));

    // Show success notification at lower right side
    enqueueSnackbar("Signup successful", {
      variant: "success",
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "right",
      },
    });

    // Navigate to dashboard after signup
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
          mt: 4,
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{m: 1, bgcolor: "secondary.main"}}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h6" gutterBottom>
          Sign up
        </Typography>
        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={SignupSchema}
          onSubmit={handleSignup}
        >
          {({errors, touched}) => (
            <Form style={{width: "100%"}}>
              <Field
                as={TextField}
                fullWidth
                margin="dense"
                name="name"
                label="Full Name"
                variant="outlined"
                error={touched.name && errors.name}
                helperText={touched.name && errors.name}
              />
              <Field
                as={TextField}
                fullWidth
                margin="dense"
                name="email"
                label="Email Address"
                variant="outlined"
                error={touched.email && errors.email}
                helperText={touched.email && errors.email}
              />
              <Field
                as={TextField}
                fullWidth
                margin="dense"
                name="password"
                label="Password"
                type="password"
                variant="outlined"
                error={touched.password && errors.password}
                helperText={touched.password && errors.password}
              />
              <Field
                as={TextField}
                fullWidth
                margin="dense"
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                variant="outlined"
                error={touched.confirmPassword && errors.confirmPassword}
                helperText={touched.confirmPassword && errors.confirmPassword}
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                sx={{mt: 2, mb: 1}}
              >
                Sign Up
              </Button>
              <Box sx={{mt: 1, textAlign: "center"}}>
                <Typography variant="body2">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    style={{textDecoration: "none", color: "primary.main"}}
                  >
                    Log In
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

export default Signup;
