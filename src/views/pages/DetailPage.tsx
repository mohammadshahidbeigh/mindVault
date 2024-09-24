import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  Box,
  Chip,
  CircularProgress,
} from "@mui/material";

interface Item {
  id: string;
  title: string;
  description: string;
  type: "Article" | "Research Paper" | "Book";
  tags: string[];
  // Add more fields as needed
}

const DetailPage: React.FC = () => {
  const {id} = useParams<{id: string}>();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        // Replace this with actual API call
        const response = await fetch(`/api/items/${id}`);
        const data = await response.json();
        setItem(data);
      } catch (error) {
        console.error("Error fetching item:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!item) {
    return (
      <Container maxWidth="md">
        <Typography variant="h4">Item not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{p: 4, mt: 4}}>
        <Typography variant="h4" gutterBottom>
          {item.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {item.type}
        </Typography>
        <Typography variant="body1" paragraph>
          {item.description}
        </Typography>
        <Box mt={2}>
          {item.tags.map((tag, index) => (
            <Chip key={index} label={tag} sx={{mr: 1, mb: 1}} />
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default DetailPage;
