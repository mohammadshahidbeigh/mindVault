// src/components/CategoryCard.tsx
import React from "react";
import {Paper, Typography, Box, Fade} from "@mui/material";
import {useNavigate} from "react-router-dom";

interface Category {
  title: string;
  icon: JSX.Element;
  count: number;
  path: string;
}

interface Props {
  category: Category;
  index: number;
}

const CategoryCard: React.FC<Props> = ({category, index}) => {
  const navigate = useNavigate();

  const handleCategoryClick = () => {
    navigate(category.path);
  };

  return (
    <Fade in={true} timeout={500 * (index + 1)}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "scale(1.05)",
            cursor: "pointer",
          },
        }}
        onClick={handleCategoryClick}
      >
        <Box sx={{display: "flex", alignItems: "center", mb: 2}}>
          {React.cloneElement(category.icon, {
            fontSize: "large",
            color: "primary",
          })}
          <Typography variant="h6" sx={{ml: 1}}>
            {category.title}
          </Typography>
        </Box>
        <Typography variant="h3" fontWeight="bold" color="primary">
          {category.count}
        </Typography>
      </Paper>
    </Fade>
  );
};

export default CategoryCard;
