import React, {useEffect, useState} from "react";
import {Container, Typography, Grid, Box, Fade} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useQuery} from "@apollo/client";
import {GET_ITEMS} from "../../graphql/queries";

const ResearchPaperPage: React.FC = () => {
  const navigate = useNavigate();
  const {data} = useQuery(GET_ITEMS);
  const [researchPapers, setResearchPapers] = useState<
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
      const papers = data.items.filter(
        (item: {
          id: string;
          title: string;
          author: string;
          description: string;
          type: string;
          tags: string[];
        }) => item.type === "Research Papers"
      );
      setResearchPapers(papers);
    }
  }, [data]);

  const handlePaperClick = (id: string) => {
    navigate(`/detail/${id}?type=research-paper`);
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
          Research Papers ({researchPapers.length})
        </Typography>
        <Grid container spacing={3}>
          {researchPapers.map((paper, index) => (
            <Fade in={true} timeout={500 * (index + 1)} key={paper.id}>
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
                  onClick={() => handlePaperClick(paper.id)}
                >
                  <Typography variant="h6" gutterBottom color="primary">
                    {paper.title}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {paper.author}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {truncateDescription(paper.description, 100)}
                  </Typography>
                  <Box sx={{mt: 2}}>
                    {paper.tags.map((tag, index) => (
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

export default ResearchPaperPage;
