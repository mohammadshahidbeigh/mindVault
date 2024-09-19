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

const ArticlePage: React.FC = () => {
  const navigate = useNavigate();

  // Sample data, replace with actual data from API or state
  const articles = [
    {id: 1, title: "Article 1", description: "Description of Article 1"},
    {id: 2, title: "Article 2", description: "Description of Article 2"},
  ];

  const handleArticleClick = (id: number) => {
    navigate(`/detail/${id}?type=article`);
  };

  return (
    <Box sx={{flexGrow: 1, mt: 8, ml: {sm: 30}}}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom sx={{mb: 4}}>
          Articles
        </Typography>
        <Grid container spacing={3}>
          {articles.map((article) => (
            <Grid item xs={12} sm={6} md={4} key={article.id}>
              <Card
                elevation={3}
                sx={{height: "100%", cursor: "pointer"}}
                onClick={() => handleArticleClick(article.id)}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {article.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {article.description}
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

export default ArticlePage;
