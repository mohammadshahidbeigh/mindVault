// src/pages/Dashboard.tsx
import React, {useState, useEffect} from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  IconButton,
  Tooltip,
  Grid,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Article as ArticleIcon,
  LibraryBooks as LibraryBooksIcon,
  School as SchoolIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import CategoryCard from "../components/CategoryCard";
import ItemCard from "../components/ItemCard";
import ItemDialog from "../components/ItemDialog";
import useStarfield from "../../hooks/useStarfield";
import {validateInputs, Item} from "../../utils/validateInputs";
import {useQuery, useMutation} from "@apollo/client";
import {
  GET_ITEMS_BY_USER,
  ADD_ITEM,
  UPDATE_ITEM,
  DELETE_ITEM,
} from "../../graphql/queries";
import {useSelector} from "react-redux";
import {RootState} from "../../store";

const Dashboard: React.FC = () => {
  const canvasRef = useStarfield();
  const user = useSelector((state: RootState) => state.user.userInfo);

  // Fetch items from GraphQL API
  const {loading, error, data} = useQuery(GET_ITEMS_BY_USER, {
    variables: {userId: user?.id},
    skip: !user?.id,
  });
  const [addItem] = useMutation(ADD_ITEM);
  const [updateItem] = useMutation(UPDATE_ITEM);
  const [deleteItem] = useMutation(DELETE_ITEM);

  // Categories state with proper typing
  const [categories, setCategories] = useState([
    {title: "Articles", icon: <ArticleIcon />, count: 0, path: "/articles"},
    {
      title: "Research Papers",
      icon: <SchoolIcon />,
      count: 0,
      path: "/research-papers",
    },
    {title: "Books", icon: <LibraryBooksIcon />, count: 0, path: "/books"},
  ]);

  // Items state with type `Item[]`
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>(items);

  useEffect(() => {
    if (data) {
      setItems(data.itemsByUser);
      setFilteredItems(data.itemsByUser);

      // Update category counts based on fetched items
      const updatedCategories = categories.map((category) => {
        const count = data.itemsByUser.filter(
          (item: Item) => item.type === category.title
        ).length;
        return {...category, count};
      });
      setCategories(updatedCategories);
    }
  }, [data, categories]);

  // Dialog state for editing and adding items
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [newItem, setNewItem] = useState<Item>({
    id: "",
    title: "",
    description: "",
    type: "Articles",
    tags: [],
  });
  const [errors, setErrors] = useState({title: "", description: "", tags: ""});

  // Other states
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

  // Filter items based on search term using a more efficient method
  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const filtered = items.filter((item) => {
      const lowercasedTitle = item.title.toLowerCase();
      const lowercasedDescription = item.description.toLowerCase();
      const lowercasedType = item.type.toLowerCase();
      const lowercasedTags = item.tags.map((tag) => tag.toLowerCase());

      return (
        lowercasedTitle.includes(lowercasedSearchTerm) ||
        lowercasedDescription.includes(lowercasedSearchTerm) ||
        lowercasedType.includes(lowercasedSearchTerm) ||
        lowercasedTags.some((tag) => tag.includes(lowercasedSearchTerm))
      );
    });
    setFilteredItems(filtered);
  }, [searchTerm, items]);

  // Open the item dialog (for both adding and editing)
  const handleOpenDialog = (item?: Item) => {
    if (item) {
      setEditingItem(item);
      setNewItem(item);
    } else {
      setEditingItem(null);
      setNewItem({
        id: "",
        title: "",
        description: "",
        type: "Articles",
        tags: [],
      });
    }
    setOpenDialog(true);
  };

  // Close the item dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
    setNewItem({
      id: "",
      title: "",
      description: "",
      type: "Articles",
      tags: [],
    });
    setErrors({title: "", description: "", tags: ""});
  };

  // Add or update an item
  const handleAddOrUpdateItem = async () => {
    const {isValid, errors} = validateInputs(newItem);
    setErrors(errors);

    if (isValid && user?.id) {
      if (editingItem) {
        // Update existing item
        try {
          const response = await updateItem({
            variables: {
              itemId: editingItem.id,
              userId: user.id,
              title: newItem.title,
              description: newItem.description,
              type: newItem.type,
              tags: newItem.tags,
            },
            refetchQueries: [
              {query: GET_ITEMS_BY_USER, variables: {userId: user.id}},
            ],
          });

          const updatedItem = response.data.updateItem;
          setItems(
            items.map((item) =>
              item.id === editingItem.id ? updatedItem : item
            )
          );
          setSnackbarMessage("Item updated successfully!");
        } catch (error) {
          console.error("Error updating item:", error);
          setSnackbarMessage("Failed to update item.");
        }
      } else {
        // Add new item
        try {
          const response = await addItem({
            variables: {
              title: newItem.title,
              description: newItem.description,
              type: newItem.type,
              tags: newItem.tags,
              userId: user.id,
            },
            refetchQueries: [
              {query: GET_ITEMS_BY_USER, variables: {userId: user.id}},
            ],
          });

          const newItemWithId = response.data.addItem;
          setItems([...items, newItemWithId]);
          setCategories(
            categories.map((category) =>
              category.title === newItem.type
                ? {...category, count: category.count + 1}
                : category
            )
          );
          setSnackbarMessage("New item added successfully!");
        } catch (error) {
          console.error("Error adding item:", error);
          setSnackbarMessage("Failed to add item.");
        }
      }
      setSnackbarOpen(true);
      handleCloseDialog();
    }
  };

  // Open confirm delete dialog
  const handleOpenConfirmDelete = (item: Item) => {
    setItemToDelete(item);
    setConfirmDeleteOpen(true);
  };

  // Close confirm delete dialog
  const handleConfirmDeleteClose = () => {
    setConfirmDeleteOpen(false);
    setItemToDelete(null);
  };

  // Delete an item
  const handleDeleteItem = async () => {
    if (user?.id && itemToDelete) {
      try {
        await deleteItem({
          variables: {itemId: itemToDelete.id, userId: user.id},
          refetchQueries: [
            {query: GET_ITEMS_BY_USER, variables: {userId: user.id}},
          ],
        });

        setItems(items.filter((i) => i.id !== itemToDelete.id));
        setCategories(
          categories.map((category) =>
            category.title === itemToDelete.type
              ? {...category, count: category.count - 1}
              : category
          )
        );
        setSnackbarMessage("Item deleted successfully!");
      } catch (error) {
        console.error("Error deleting item:", error);
        setSnackbarMessage("Failed to delete item.");
      }
      setSnackbarOpen(true);
      handleConfirmDeleteClose();
    }
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

  if (error) return <p>Error: {error.message}</p>;

  return (
    <Container
      maxWidth="lg"
      sx={{
        marginLeft: "240px",
        width: "calc(100% - 240px)",
        position: "relative",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{position: "fixed", top: 0, left: 0, zIndex: -1}}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          mt: 4,
        }}
      >
        <Typography variant="h4" fontWeight="bold" color="primary">
          Dashboard
        </Typography>
        <Box sx={{display: "flex", alignItems: "center"}}>
          <TextField
            placeholder="Search for items..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <IconButton size="small" disabled>
                  <SearchIcon />
                </IconButton>
              ),
              endAdornment: searchTerm && (
                <IconButton size="small" onClick={() => setSearchTerm("")}>
                  <ClearIcon />
                </IconButton>
              ),
            }}
            sx={{
              mr: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "primary.main",
                },
                "&:hover fieldset": {
                  borderColor: "primary.dark",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "primary.light",
                },
              },
            }}
          />
          <Tooltip title="Add new item" arrow>
            <Tooltip title="Add new item" arrow>
              <IconButton
                color="primary"
                aria-label="add new item"
                size="large"
                onClick={() => handleOpenDialog()}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {categories.map((category, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <CategoryCard category={category} index={index} />
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" sx={{mt: 8, mb: 3}} color="primary">
        Recent Items
      </Typography>

      <Grid container spacing={3}>
        {filteredItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <ItemCard
              item={item}
              index={index}
              onEdit={() => handleOpenDialog(item)}
              onDelete={() => handleOpenConfirmDelete(item)}
            />
          </Grid>
        ))}
      </Grid>

      <ItemDialog
        open={openDialog}
        editingItem={editingItem}
        newItem={newItem}
        setNewItem={setNewItem}
        onClose={handleCloseDialog}
        onSubmit={handleAddOrUpdateItem}
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
            onClick={handleDeleteItem}
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
          severity="success"
          sx={{width: "100%"}}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Dashboard;
