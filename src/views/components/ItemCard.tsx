// src/components/ItemCard.tsx
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Fade,
} from "@mui/material";
import {Edit as EditIcon, Delete as DeleteIcon} from "@mui/icons-material";

interface Item {
  id: string;
  title: string;
  description: string;
  type: string;
  tags: string[];
}

interface Props {
  item: Item;
  index: number;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

const ItemCard: React.FC<Props> = ({item, index, onEdit, onDelete}) => {
  const truncateDescription = (description: string, maxLength: number) => {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + "...";
    }
    return description;
  };

  return (
    <Fade in={true} timeout={500 * (index + 1)}>
      <Card
        elevation={2}
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          transition: "transform 0.3s ease-in-out",
          "&:hover": {transform: "scale(1.05)"},
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            {item.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {truncateDescription(item.description, 100)}
          </Typography>
          <Box sx={{mt: 2}}>
            {item.tags.map((tag, index) => (
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
          <Box sx={{mt: 2, display: "flex", justifyContent: "flex-end"}}>
            <IconButton size="small" onClick={() => onEdit(item)} sx={{mr: 1}}>
              <EditIcon />
            </IconButton>
            <IconButton size="small" onClick={() => onDelete(item)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default ItemCard;
