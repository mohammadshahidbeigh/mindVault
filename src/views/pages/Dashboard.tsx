// src/pages/Dashboard.tsx
import React, {useEffect, useRef, useState} from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Tooltip,
  Fade,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Article as ArticleIcon,
  Science as ScienceIcon,
  Book as BookIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import * as THREE from "three";
import {useNavigate} from "react-router-dom";

interface Item {
  id: string;
  title: string;
  description: string;
  type: "Articles" | "Research Papers" | "Books";
  tags: string[];
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([
    {title: "Articles", icon: <ArticleIcon />, count: 12, path: "/articles"},
    {
      title: "Research Papers",
      icon: <ScienceIcon />,
      count: 5,
      path: "/research-papers",
    },
    {title: "Books", icon: <BookIcon />, count: 8, path: "/books"},
  ]);

  const [items, setItems] = useState<Item[]>([
    {
      id: "1",
      title: "Sample Item 1",
      description: "This is a brief description of the item.",
      type: "Articles",
      tags: ["sample", "article"],
    },
    {
      id: "2",
      title: "Sample Item 2",
      description: "This is a brief description of the item.",
      type: "Research Papers",
      tags: ["sample", "research"],
    },
    {
      id: "3",
      title: "Sample Item 3",
      description: "This is a brief description of the item.",
      type: "Books",
      tags: ["sample", "book"],
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [newItem, setNewItem] = useState<Item>({
    id: "",
    title: "",
    description: "",
    type: "Articles",
    tags: [],
  });
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    tags: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState<Item[]>(items);
  const [displayedItems, setDisplayedItems] = useState<Item[]>([]);
  const [itemsPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
      });
      renderer.setSize(window.innerWidth, window.innerHeight);

      // Create a starfield background
      const starsGeometry = new THREE.BufferGeometry();
      const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
      });

      const starsVertices = [];
      for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starsVertices.push(x, y, z);
      }

      starsGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(starsVertices, 3)
      );
      const starField = new THREE.Points(starsGeometry, starsMaterial);
      scene.add(starField);

      // Create a group to hold all the books
      const booksGroup = new THREE.Group();
      scene.add(booksGroup);

      // Function to create a single book
      const createBook = (x: number, y: number, z: number, color: number) => {
        const bookGeometry = new THREE.BoxGeometry(24, 36, 3.6); // Doubled the size of the books
        const bookMaterial = new THREE.MeshPhongMaterial({color: color});
        const book = new THREE.Mesh(bookGeometry, bookMaterial);
        book.position.set(x, y, z);
        book.rotation.y = (Math.random() * Math.PI) / 4 - Math.PI / 8;
        return book;
      };

      // Create multiple books
      const bookColors = [0x1abc9c, 0x3498db, 0x9b59b6, 0xe74c3c, 0xf1c40f];
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * 320 - 160; // Doubled the range to accommodate larger books
        const y = Math.random() * 320 - 160; // Doubled the range to accommodate larger books
        const z = Math.random() * 320 - 160; // Doubled the range to accommodate larger books
        const color = bookColors[Math.floor(Math.random() * bookColors.length)];
        const book = createBook(x, y, z, color);
        booksGroup.add(book);
      }

      // Add lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xffffff, 1);
      pointLight.position.set(50, 100, 50); // Increased light position to match larger scene
      scene.add(pointLight);

      camera.position.z = 400; // Doubled camera distance to accommodate larger books

      const animate = () => {
        requestAnimationFrame(animate);
        booksGroup.rotation.x += 0.001;
        booksGroup.rotation.y += 0.002;
        starField.rotation.y += 0.0002;
        renderer.render(scene, camera);
      };

      animate();

      // Handle window resize
      const handleResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        renderer.dispose();
      };
    }
  }, []);

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
    setCurrentPage(1);
  }, [searchTerm, items]);

  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setDisplayedItems(filteredItems.slice(indexOfFirstItem, indexOfLastItem));
  }, [currentPage, filteredItems, itemsPerPage]);

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
    setErrors({title: "", description: "", tags: ""});
  };

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

  const validateInputs = () => {
    let isValid = true;
    const newErrors = {title: "", description: "", tags: ""};

    if (newItem.title.trim() === "") {
      newErrors.title = "Title is required";
      isValid = false;
    }

    if (newItem.description.trim() === "") {
      newErrors.description = "Description is required";
      isValid = false;
    }

    if (newItem.tags.length === 0) {
      newErrors.tags = "At least one tag is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAddOrUpdateItem = () => {
    if (validateInputs()) {
      if (editingItem) {
        // Update existing item
        setItems(
          items.map((item) => (item.id === editingItem.id ? newItem : item))
        );
        setSnackbarMessage("Item updated successfully!");
      } else {
        // Add new item
        const newItemWithId = {...newItem, id: Date.now().toString()};
        setItems([...items, newItemWithId]);
        setCategories(
          categories.map((category) =>
            category.title === newItem.type
              ? {...category, count: category.count + 1}
              : category
          )
        );
        setSnackbarMessage("New item added successfully!");
      }
      setSnackbarOpen(true);
      handleCloseDialog();
    }
  };

  const handleDeleteItem = (itemToDelete: Item) => {
    setItems(items.filter((item) => item.id !== itemToDelete.id));
    setCategories(
      categories.map((category) =>
        category.title === itemToDelete.type
          ? {...category, count: category.count - 1}
          : category
      )
    );
    setSnackbarMessage("Item deleted successfully!");
    setSnackbarOpen(true);
  };

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleCloseSnackbar = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleCategoryClick = (path: string) => {
    navigate(path);
  };

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
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
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
                onClick={() => handleCategoryClick(category.path)}
              >
                <Box sx={{display: "flex", alignItems: "center", mb: 2}}>
                  {React.cloneElement(category.icon as React.ReactElement, {
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
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" sx={{mt: 8, mb: 3}} color="primary">
        Recent Items
      </Typography>
      {filteredItems.length > 0 ? (
        <Grid container spacing={3}>
          {displayedItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Fade in={true} timeout={500 * (index + 1)}>
                <Card
                  elevation={2}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                    <Box sx={{mt: 2}}>
                      {item.tags.map((tag, tagIndex) => (
                        <Typography
                          key={tagIndex}
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
                        onClick={() => handleOpenDialog(item)}
                        sx={{mr: 1}}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteItem(item)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{textAlign: "center", mt: 4}}>
          <Typography variant="h6" color="text.secondary">
            No items match your search criteria.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{mt: 2}}>
            Try adjusting your search or add new items.
          </Typography>
        </Box>
      )}

      {filteredItems.length > displayedItems.length && (
        <Box sx={{display: "flex", justifyContent: "center", mt: 4}}>
          <Button variant="contained" color="primary" onClick={handleLoadMore}>
            Load More
          </Button>
        </Box>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingItem ? "Edit Item" : "Add New Item"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            value={newItem.title}
            onChange={(e) => setNewItem({...newItem, title: e.target.value})}
            error={!!errors.title}
            helperText={errors.title}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={newItem.description}
            onChange={(e) =>
              setNewItem({...newItem, description: e.target.value})
            }
            error={!!errors.description}
            helperText={errors.description}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Type</InputLabel>
            <Select
              value={newItem.type}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  type: e.target.value as
                    | "Articles"
                    | "Research Papers"
                    | "Books",
                })
              }
            >
              <MenuItem value="Articles">Articles</MenuItem>
              <MenuItem value="Research Papers">Research Papers</MenuItem>
              <MenuItem value="Books">Books</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Tags (comma-separated)"
            type="text"
            fullWidth
            value={newItem.tags.join(", ")}
            onChange={(e) =>
              setNewItem({
                ...newItem,
                tags: e.target.value
                  .split(", ")
                  .filter((tag) => tag.trim() !== ""),
              })
            }
            error={!!errors.tags}
            helperText={errors.tags}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleAddOrUpdateItem}
            variant="contained"
            color="primary"
          >
            {editingItem ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
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
