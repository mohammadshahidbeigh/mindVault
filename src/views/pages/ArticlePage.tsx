import React, {useEffect, useState} from "react";
import {Container, Typography, Grid, Box, Fade} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useQuery} from "@apollo/client";
import {GET_ITEMS} from "../../graphql/queries";

const ArticlePage: React.FC = () => {
  const navigate = useNavigate();
  const {data} = useQuery(GET_ITEMS);
  const [articles, setArticles] = useState<
    {
      id: string;
      title: string;
      author: string;
      description: string;
      tags: string[];
    }[]
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
          tags: string[];
        }) => item.type === "Articles"
      );
      setArticles(articlesData);
    }
  }, [data]);

  const handleArticleClick = (id: string) => {
    navigate(`/detail/${id}?type=article`);
  };

  const truncateDescription = (description: string, maxLength: number) => {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + "...";
    }
    return description;
  };

  return (
    <Box sx={{flexGrow: 1, mt: 4, ml: {sm: 30}}}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          gutterBottom
          sx={{mb: 4, fontWeight: "bold", color: "primary.main"}}
        >
          Articles ({articles.length})
        </Typography>
        <Grid container spacing={3}>
          {articles.map((article, index) => (
            <Fade in={true} timeout={500 * (index + 1)} key={article.id}>
              <Grid item xs={12} sm={6} md={4}>
                <Box
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {transform: "scale(1.05)"},
                    cursor: "pointer",
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 3,
                  }}
                  onClick={() => handleArticleClick(article.id)}
                >
                  <Typography variant="h6" gutterBottom color="primary">
                    {article.title}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {article.author}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {truncateDescription(article.description, 100)}
                  </Typography>
                  <Box sx={{mt: 2}}>
                    {article.tags.map((tag, index) => (
                      <Typography
                        key={index}
                        variant="caption"
                        sx={{
                          mr: 1,
                          backgroundColor: "primary.main",
                          color: "white",
                          padding: "2px 6px",
                          borderRadius: "4px",
                        }}
                      >
                        {tag}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </Grid>
            </Fade>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ArticlePage;
