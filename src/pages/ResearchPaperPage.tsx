import React from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import {useNavigate} from "react-router-dom";

const ResearchPaperPage: React.FC = () => {
  const navigate = useNavigate();

  // Sample data, replace with actual data from API or state
  const researchPapers = [
    {
      id: 1,
      title: "Research Paper 1",
      author: "John Doe",
      abstract: "Abstract of Research Paper 1",
    },
    {
      id: 2,
      title: "Research Paper 2",
      author: "Jane Smith",
      abstract: "Abstract of Research Paper 2",
    },
  ];

  const handlePaperClick = (id: number) => {
    navigate(`/detail/${id}?type=research-paper`);
  };

  return (
    <Box sx={{flexGrow: 1, mt: 8, ml: {sm: 30}}}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom sx={{mb: 4}}>
          Research Papers
        </Typography>
        <Grid container spacing={3}>
          {researchPapers.map((paper) => (
            <Grid item xs={12} sm={6} md={4} key={paper.id}>
              <Card
                elevation={3}
                sx={{height: "100%", cursor: "pointer"}}
                onClick={() => handlePaperClick(paper.id)}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {paper.title}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    by {paper.author}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {paper.abstract}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ResearchPaperPage;
