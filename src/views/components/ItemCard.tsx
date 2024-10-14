// src/components/ItemCard.tsx
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Fade,
  useTheme,
} from "@mui/material";
import {Edit as EditIcon, Delete as DeleteIcon} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import xss from "xss"; // Import xss for sanitization

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
  const navigate = useNavigate();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const handleCardClick = () => {
    navigate(`/detail/${item.id}?type=${item.type}`);
  };

  const truncateDescription = (description: string, maxLength: number) => {
    const sanitizedDescription = xss(description); // Sanitize description
    if (sanitizedDescription.length > maxLength) {
      return sanitizedDescription.substring(0, maxLength) + "...";
    }
    return sanitizedDescription;
  };

  return (
    <Fade in={true} timeout={500 * (index + 1)}>
      <Card
        elevation={2}
        sx={{
          backgroundColor: isDarkMode
            ? "rgba(0, 0, 0, 0.8)"
            : "rgba(255, 255, 255, 0.8)",
          transition: "transform 0.3s ease-in-out",
          "&:hover": {transform: "scale(1.05)"},
        }}
        onClick={handleCardClick}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            {xss(item.title)} {/* Sanitize title */}
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
                  backgroundColor: isDarkMode ? "primary.dark" : "primary.main",
                  color: "white",
                  padding: "2px 6px",
                  borderRadius: "4px",
                }}
              >
                {xss(tag)} {/* Sanitize tag */}
              </Typography>
            ))}
          </Box>
          <Box sx={{mt: 2, display: "flex", justifyContent: "flex-end"}}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              sx={{mr: 1}}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default ItemCard;
