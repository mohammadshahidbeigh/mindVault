// src/pages/Dashboard.tsx
// src/pages/Dashboard.tsx
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Paper,
  IconButton,
} from "@mui/material";
import {
  Add as AddIcon,
  Article as ArticleIcon,
  Science as ScienceIcon,
  Book as BookIcon,
} from "@mui/icons-material";

const Dashboard: React.FC = () => {
  const categories = [
    {title: "Articles", icon: <ArticleIcon />, count: 12},
    {title: "Research Papers", icon: <ScienceIcon />, count: 5},
    {title: "Books", icon: <BookIcon />, count: 8},
  ];

  return (
    <Container
      maxWidth="lg"
      sx={{marginLeft: "240px", width: "calc(100% - 240px)"}}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          mt: 4,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Dashboard
        </Typography>
        <IconButton color="primary" aria-label="add new item" size="large">
          <AddIcon />
        </IconButton>
      </Box>

      <Grid container spacing={4}>
        {categories.map((category, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{display: "flex", alignItems: "center", mb: 2}}>
                {category.icon}
                <Typography variant="h6" sx={{ml: 1}}>
                  {category.title}
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold" color="primary">
                {category.count}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" sx={{mt: 6, mb: 3}}>
        Recent Items
      </Typography>
      <Grid container spacing={3}>
        {[1, 2, 3].map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Sample Item {item}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This is a brief description of the item. It could be an
                  article, research paper, or book summary.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Dashboard;
