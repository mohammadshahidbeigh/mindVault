// src/pages/Home.tsx
import React from "react";
import {Container, Typography, Button, Box, Paper, Grid} from "@mui/material";
import {Link} from "react-router-dom";
import {LibraryBooks, School, Article} from "@mui/icons-material";

const Home: React.FC = () => {
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
        marginLeft: "240px",
        width: "calc(100% - 240px)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Box sx={{mt: 4, mb: 6, textAlign: "center"}}>
        <Typography variant="h2" gutterBottom fontWeight="bold" color="primary">
          Welcome to MindVault
        </Typography>
        <Typography variant="h5" paragraph color="text.secondary">
          Your personal knowledge base for articles, research papers, and more.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/dashboard"
          size="large"
          sx={{mt: 2, px: 4, py: 1.5, fontSize: "1.1rem"}}
        >
          Explore Your Dashboard
        </Button>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Box sx={{mb: 2, color: "primary.main", fontSize: 48}}>
                {feature.icon}
              </Box>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                {feature.title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
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
