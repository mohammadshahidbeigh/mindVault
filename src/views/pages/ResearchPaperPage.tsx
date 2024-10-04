import React, {useEffect, useState} from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  IconButton,
  Fade,
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useQuery, useMutation} from "@apollo/client";
import {GET_ITEMS, DELETE_ITEM, UPDATE_ITEM} from "../../graphql/queries";
import {Edit as EditIcon, Delete as DeleteIcon} from "@mui/icons-material";
import ItemDialog from "../components/ItemDialog";
import {Item} from "../../utils/validateInputs";

const ResearchPaperPage: React.FC = () => {
  const navigate = useNavigate();
  const {data, refetch} = useQuery(GET_ITEMS);
  const [deleteItem] = useMutation(DELETE_ITEM);
  const [updateItem] = useMutation(UPDATE_ITEM);
  const [researchPapers, setResearchPapers] = useState<
    {
      id: string;
      title: string;
      author: string;
      description: string;
      tags: string[];
    }[]
  >([]);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [newItem, setNewItem] = useState<Item>({
    id: "",
    title: "",
    description: "",
    tags: [],
    type: "Research Papers",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errors, setErrors] = useState({title: "", description: "", tags: ""});

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

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setNewItem(item);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteItem({variables: {id}});
    refetch();
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingItem(null);
    setNewItem({
      id: "",
      title: "",
      description: "",
      tags: [],
      type: "Research Papers",
    });
    setErrors({title: "", description: "", tags: ""});
  };

  const handleDialogSubmit = async () => {
    if (editingItem) {
      await updateItem({variables: {id: newItem.id, input: newItem}});
    }
    refetch();
    handleDialogClose();
  };

  const truncateDescription = (description: string, maxLength: number) => {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + "...";
    }
    return description;
  };

  return (
    <Box sx={{flexGrow: 1, mt: 8, ml: {sm: 30}}}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom sx={{mb: 4}}>
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
                  <Box
                    sx={{mt: 2, display: "flex", justifyContent: "flex-end"}}
                  >
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit({
                          ...paper,
                          type: "Research Papers",
                        });
                      }}
                      sx={{mr: 1}}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(paper.id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
            </Fade>
          ))}
        </Grid>
      </Container>
      <ItemDialog
        open={dialogOpen}
        editingItem={editingItem}
        newItem={newItem}
        setNewItem={setNewItem}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
        errors={errors}
      />
    </Box>
  );
};

export default ResearchPaperPage;
