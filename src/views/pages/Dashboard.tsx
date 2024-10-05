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
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Article as ArticleIcon,
  LibraryBooks as LibraryBooksIcon,
  School as SchoolIcon,
} from "@mui/icons-material";
import CategoryCard from "../components/CategoryCard";
import ItemCard from "../components/ItemCard";
import ItemDialog from "../components/ItemDialog";
import useStarfield from "../../hooks/useStarfield";
import {validateInputs, Item} from "../../utils/validateInputs";
import {useQuery, useMutation} from "@apollo/client";
import {
  GET_ITEMS,
  ADD_ITEM,
  UPDATE_ITEM,
  DELETE_ITEM,
} from "../../graphql/queries";

const Dashboard: React.FC = () => {
  const canvasRef = useStarfield();

  // Fetch items from GraphQL API
  const {loading, error, data} = useQuery(GET_ITEMS);
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
      setItems(data.items);
      setFilteredItems(data.items);

      // Update category counts based on fetched items
      const updatedCategories = categories.map((category) => {
        const count = data.items.filter(
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

  // Filter items based on search term
  useEffect(() => {
    const filtered = items.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
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

    if (isValid) {
      if (editingItem) {
        // Update existing item
        try {
          const response = await updateItem({
            variables: {
              id: editingItem.id,
              title: newItem.title,
              description: newItem.description,
              type: newItem.type,
              tags: newItem.tags,
            },
            refetchQueries: [{query: GET_ITEMS}],
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
            },
            refetchQueries: [{query: GET_ITEMS}],
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

  // Delete an item
  const handleDeleteItem = async (item: Item) => {
    try {
      await deleteItem({
        variables: {id: item.id},
        refetchQueries: [{query: GET_ITEMS}],
      });

      setItems(items.filter((i) => i.id !== item.id));
      setCategories(
        categories.map((category) =>
          category.title === item.type
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
  };

  if (loading) return <p>Loading...</p>;
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
            placeholder="Search..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon />,
            }}
            sx={{mr: 2}}
          />
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
              onDelete={() => handleDeleteItem(item)}
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
