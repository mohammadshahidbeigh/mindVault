// src/pages/Home.tsx
import React from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {Link} from "react-router-dom";
import {LibraryBooks, School, Article} from "@mui/icons-material";
import {motion} from "framer-motion";

const Home: React.FC = () => {
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const features = [
    {
      icon: <LibraryBooks />,
      title: "Organize Articles",
      description: "Easily categorize and manage your reading list.",
    },
    {
      icon: <School />,
      title: "Research Papers",
      description: "Store and access your academic resources in one place.",
    },
    {
      icon: <Article />,
      title: "Personal Notes",
      description: "Create and link notes to your saved content.",
    },
  ];

  return (
    <Container
      maxWidth="lg"
      sx={{
        marginLeft: {xs: 0, sm: "240px"},
        width: {xs: "100%", sm: "calc(100% - 240px)"},
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: {xs: 2, sm: 3, md: 4},
      }}
    >
      <Box
        sx={{
          mt: {xs: 2, sm: 3, md: 4},
          mb: {xs: 3, sm: 4, md: 6},
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 1, delay: 0.5}}
        >
          <Typography
            variant={isSmallScreen ? "h5" : "h2"}
            gutterBottom
            fontWeight="bold"
            color="primary"
          >
            Welcome to MindVaultt
          </Typography>
          <Typography
            variant={isSmallScreen ? "body1" : "h5"}
            paragraph
            color="text.secondary"
          >
            Your personal knowledge base for articles, research papers, and
            more.
          </Typography>
        </motion.div>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/dashboard"
          size={isSmallScreen ? "medium" : "large"}
          sx={{
            mt: 2,
            px: {xs: 3, sm: 4},
            py: {xs: 1, sm: 1.5},
            fontSize: {xs: "1rem", sm: "1.1rem"},
          }}
        >
          Explore Your Dashboard
        </Button>
      </Box>

      <Grid container spacing={isMediumScreen ? 2 : 4} justifyContent="center">
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              elevation={3}
              sx={{
                p: {xs: 2, sm: 3},
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Box
                sx={{mb: 2, color: "primary.main", fontSize: {xs: 36, sm: 48}}}
              >
                {feature.icon}
              </Box>
              <Typography
                variant={isSmallScreen ? "h6" : "h5"}
                gutterBottom
                fontWeight="bold"
              >
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
