import React, {useState, useEffect} from "react";
import {useParams, useLocation, useNavigate} from "react-router-dom";
import {useQuery, useMutation} from "@apollo/client";
import {
  GET_ITEM_BY_ID,
  DELETE_ITEM,
  UPDATE_ITEM,
  GET_ITEMS,
} from "../../graphql/queries";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Fade,
  IconButton,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import {Edit as EditIcon, Delete as DeleteIcon} from "@mui/icons-material";
import ItemDialog from "../components/ItemDialog";
import {Item} from "../../utils/validateInputs";

const DetailPage: React.FC = () => {
  const {id} = useParams<{id: string}>();
  const location = useLocation();
  const navigate = useNavigate();
  const [type, setType] = useState<string | null>(
    new URLSearchParams(location.search).get("type")
  );

  const {data, loading, error, refetch} = useQuery(GET_ITEM_BY_ID, {
    variables: {id},
  });

  const [deleteItem] = useMutation(DELETE_ITEM, {
    refetchQueries: [{query: GET_ITEMS}],
  });
  const [updateItem] = useMutation(UPDATE_ITEM);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [newItem, setNewItem] = useState<Item>({
    id: "",
    title: "",
    description: "",
    tags: [],
    type: (type as "Articles" | "Research Papers" | "Books") || "Articles",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errors, setErrors] = useState({title: "", description: "", tags: ""});
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setType(searchParams.get("type"));
  }, [location.search]);

  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error.message}</p>;

  const item = data?.item;

  if (!item) {
    return <p>Item not found</p>;
  }

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setNewItem(item);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteItem({
        variables: {id},
        update: (cache) => {
          cache.evict({id: `Item:${id}`});
          cache.gc();
        },
      });
      setSnackbarMessage("Item deleted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate(-1);
      }, 1000);
    } catch (error: unknown) {
      setSnackbarMessage("Failed to delete item. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Delete error:", error);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingItem(null);
    setNewItem({
      id: "",
      title: "",
      description: "",
      tags: [],
      type: (type as "Articles" | "Research Papers" | "Books") || "Articles",
    });
    setErrors({title: "", description: "", tags: ""});
  };

  const handleDialogSubmit = async () => {
    try {
      if (editingItem) {
        await updateItem({
          variables: {
            id: newItem.id,
            title: newItem.title,
            description: newItem.description,
            type: newItem.type,
            tags: newItem.tags,
          },
        });
        setSnackbarMessage("Item updated successfully!");
        setSnackbarSeverity("success");
        setType(newItem.type);
      }
      refetch();
      handleDialogClose();
    } catch (error) {
      console.error("Update error:", error);
      setSnackbarMessage("Failed to update item. Please try again.");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleConfirmDeleteOpen = () => {
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDeleteClose = () => {
    setConfirmDeleteOpen(false);
  };

  return (
    <Box sx={{flexGrow: 1, mt: 8, ml: {sm: 30}}}>
      <Container maxWidth="lg">
        <Fade in={true} timeout={500}>
          <Card
            elevation={2}
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              transition: "transform 0.3s ease-in-out",
              "&:hover": {transform: "scale(1.05)"},
            }}
          >
            <CardContent>
              <Typography variant="h4" gutterBottom color="primary">
                {item.title}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                {item.author}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {item.description}
              </Typography>
              <Box sx={{mt: 2}}>
                {item.tags.map((tag: string, index: number) => (
                  <Chip
                    key={index}
                    label={tag}
                    color="primary"
                    sx={{mr: 1, mb: 1}}
                  />
                ))}
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{mt: 2}}>
                Type: {type}
              </Typography>
              <Box sx={{mt: 2, display: "flex", justifyContent: "flex-end"}}>
                <IconButton
                  size="small"
                  onClick={() => handleEdit(item)}
                  sx={{mr: 1}}
                >
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={handleConfirmDeleteOpen}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Fade>
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
      <Dialog open={confirmDeleteOpen} onClose={handleConfirmDeleteClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this item?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDeleteClose}>Cancel</Button>
          <Button
            onClick={() => {
              handleDelete(item.id);
              handleConfirmDeleteClose();
            }}
            color="primary"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{width: "100%"}}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DetailPage;
