import React, {useEffect, useState} from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  Fade,
  CircularProgress,
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useQuery} from "@apollo/client";
import {GET_ITEMS_BY_USER} from "../../graphql/queries";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import xss from "xss"; // Import xss for sanitization

const ArticlePage: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.userInfo);
  const {data, loading} = useQuery(GET_ITEMS_BY_USER, {
    variables: {userId: user?.id},
    skip: !user?.id,
  });
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
      const articlesData = data.itemsByUser.filter(
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
    navigate(`/detail/${id}?type=Articles`);
  };

  const truncateDescription = (description: string, maxLength: number) => {
    const sanitizedDescription = xss(description); // Sanitize description
    if (sanitizedDescription.length > maxLength) {
      return sanitizedDescription.substring(0, maxLength) + "...";
    }
    return sanitizedDescription;
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

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
                    {xss(article.title)} {/* Sanitize title */}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {xss(article.author)} {/* Sanitize author */}
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
                        {xss(tag)} {/* Sanitize tag */}
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
