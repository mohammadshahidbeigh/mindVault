import React, {useEffect, useState} from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {getAllArticles} from "../../controllers/ArticleController";
import {Article} from "../../models/ArticleModel";

const ArticlePage: React.FC = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const fetchedArticles = await getAllArticles();
        setArticles(fetchedArticles);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

  const handleArticleClick = (id: string) => {
    navigate(`/detail/${id}?type=article`);
  };

  return (
    <Box sx={{flexGrow: 1, mt: 8, ml: {sm: 30}}}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom sx={{mb: 4}}>
          Articles
        </Typography>
        <Grid container spacing={3}>
          {articles.map((article: Article) => (
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
                    {article.content}
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
