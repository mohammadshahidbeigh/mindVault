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

const ResearchPaperPage: React.FC = () => {
  const navigate = useNavigate();
  const {data} = useQuery(GET_ITEMS);
  const [researchPapers, setResearchPapers] = useState<
    {id: string; title: string; author: string; description: string}[]
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
        }) => item.type === "Research Papers"
      );
      setResearchPapers(papers);
    }
  }, [data]);

  const handlePaperClick = (id: string) => {
    navigate(`/detail/${id}?type=research-paper`);
  };

  return (
    <Box sx={{flexGrow: 1, mt: 8, ml: {sm: 30}}}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom sx={{mb: 4}}>
          Research Papers ({researchPapers.length})
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
                    {paper.description}
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
