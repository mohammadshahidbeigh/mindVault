// src/pages/Home.tsx
import {Container, Typography, Button, Box} from "@mui/material";
import {Link} from "react-router-dom";

const Home: React.FC = () => {
  return (
    <Container
      maxWidth="lg"
      sx={{marginLeft: "240px", width: "calc(100% - 240px)"}}
    >
      <Box sx={{mt: 4}}>
        <Typography variant="h3" gutterBottom>
          Welcome to MindVault
        </Typography>
        <Typography variant="body1" paragraph>
          Save and manage your articles, research papers, and other content in
          your personal knowledge base.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/dashboard"
        >
          Go to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
