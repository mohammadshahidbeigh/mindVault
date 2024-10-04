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
import {useQuery} from "@apollo/client";
import {GET_ITEMS} from "../../graphql/queries";

const ArticlePage: React.FC = () => {
  const navigate = useNavigate();
  const {data} = useQuery(GET_ITEMS);
  const [articles, setArticles] = useState<
    {id: string; title: string; author: string; description: string}[]
  >([]);

  useEffect(() => {
    if (data) {
      const articlesData = data.items.filter(
        (item: {
          id: string;
          title: string;
          author: string;
          description: string;
          type: string;
        }) => item.type === "Articles"
      );
      setArticles(articlesData);
    }
  }, [data]);

  const handleArticleClick = (id: string) => {
    navigate(`/detail/${id}?type=article`);
  };

  return (
    <Box sx={{flexGrow: 1, mt: 8, ml: {sm: 30}}}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom sx={{mb: 4}}>
          Articles ({articles.length})
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
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    by {article.author}
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
