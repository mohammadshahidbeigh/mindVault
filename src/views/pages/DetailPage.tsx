import React, {useState, useEffect} from "react";
import {useParams, useLocation, useNavigate} from "react-router-dom";
import {useQuery, useMutation} from "@apollo/client";
import {GET_ITEM_BY_ID, DELETE_ITEM, UPDATE_ITEM} from "../../graphql/queries";
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
  useTheme,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Folder as FolderIcon,
} from "@mui/icons-material";
import ItemDialog from "../components/ItemDialog";
import {Item} from "../../utils/validateInputs";
import SyntaxHighlighter from "react-syntax-highlighter";
import {docco} from "react-syntax-highlighter/dist/esm/styles/hljs";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import ReactPlayer from "react-player";
import xss from "xss"; // Import xss for sanitization

const DetailPage: React.FC = () => {
  const {id} = useParams<{id: string}>();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const [type, setType] = useState<string | null>(
    new URLSearchParams(location.search).get("type")
  );

  const user = useSelector((state: RootState) => state.user.userInfo);

  const {data, loading, error, refetch} = useQuery(GET_ITEM_BY_ID, {
    variables: {id},
  });

  const [deleteItem] = useMutation(DELETE_ITEM);
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
  if (error) {
    console.error("Failed to load resource:", error.message);
    return <p>Error: {error.message}</p>;
  }

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
        variables: {itemId: id, userId: user?.id},
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
      console.error("Failed to load resource:", error);
      setSnackbarMessage("Failed to delete item. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
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
            itemId: newItem.id,
            userId: user?.id,
            title: xss(newItem.title), // Sanitize title
            description: xss(newItem.description), // Sanitize description
            type: newItem.type,
            tags: newItem.tags.map((tag) => xss(tag)), // Sanitize tags
          },
        });
        setSnackbarMessage("Item updated successfully!");
        setSnackbarSeverity("success");
        setType(newItem.type);
      }
      refetch();
      handleDialogClose();
    } catch (error) {
      console.error("Failed to load resource:", error);
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

  const isCode = (text: string) => {
    // Simple check for code: if it contains multiple lines and special characters
    return text.includes("\n") && /[{}()[\]$&+=@#~!^*|%<>?]/.test(text);
  };

  const renderDescription = (description: string) => {
    const sanitizedDescription = xss(description); // Sanitize description
    if (isCode(sanitizedDescription)) {
      return (
        <SyntaxHighlighter language="javascript" style={docco}>
          {sanitizedDescription}
        </SyntaxHighlighter>
      );
    }
    return (
      <Typography variant="body1" gutterBottom>
        {sanitizedDescription}
      </Typography>
    );
  };

  const renderMedia = (description: string) => {
    const sanitizedDescription = xss(description); // Sanitize description
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = sanitizedDescription.match(urlRegex);
    if (urls) {
      return urls.map((url, index) => (
        <Box key={index} sx={{mt: 2}}>
          <ReactPlayer
            url={url}
            controls
            width="100%"
            onError={(e) => console.error("Failed to load media:", e)}
          />
        </Box>
      ));
    }
    return null;
  };

  return (
    <Box sx={{flexGrow: 1, mt: 8, ml: {sm: 30}}}>
      <Container maxWidth="lg">
        <Fade in={true} timeout={500}>
          <Card
            elevation={2}
            sx={{
              backgroundColor: isDarkMode
                ? "rgba(0, 0, 0, 0.8)"
                : "rgba(255, 255, 255, 0.8)",
              color: isDarkMode ? "#fff" : "#000",
            }}
          >
            <CardContent>
              <Typography variant="h4" gutterBottom color="primary">
                {xss(item.title)} {/* Sanitize title */}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                {xss(item.author)} {/* Sanitize author */}
              </Typography>
              {renderDescription(item.description)}
              {renderMedia(item.description)}
              <Box sx={{mt: 2}}>
                {item.tags.map((tag: string, index: number) => (
                  <Chip
                    key={index}
                    label={xss(tag)} // Sanitize tag
                    color="primary"
                    sx={{mr: 1, mb: 1}}
                  />
                ))}
              </Box>
              <Box sx={{mt: 2, display: "flex", alignItems: "center"}}>
                <Chip
                  icon={<FolderIcon />}
                  label={`Type: ${type}`}
                  color="secondary"
                  variant="outlined"
                  size="small"
                />
              </Box>
              <Box sx={{mt: 2, display: "flex", justifyContent: "flex-end"}}>
                <IconButton
                  size="small"
                  onClick={() => handleEdit(item)}
                  sx={{mr: 1, color: isDarkMode ? "#fff" : "inherit"}}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={handleConfirmDeleteOpen}
                  sx={{color: isDarkMode ? "#fff" : "inherit"}}
                >
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
