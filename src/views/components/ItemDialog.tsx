// src/components/ItemDialog.tsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Grid,
  useTheme,
} from "@mui/material";
import {Item} from "../../utils/validateInputs"; // Removed unused 'validateInputs'
import xss from "xss"; // Import xss for sanitization

interface Props {
  open: boolean;
  editingItem: Item | null;
  newItem: Item;
  setNewItem: (item: Item) => void;
  onClose: () => void;
  onSubmit: () => void;
  errors: {title: string; description: string; tags: string};
}

const ItemDialog: React.FC<Props> = ({
  open,
  editingItem,
  newItem,
  setNewItem,
  onClose,
  onSubmit,
  errors,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        style: {
          height: "90vh",
          backgroundColor: isDarkMode ? "#333" : "#fff",
          color: isDarkMode ? "#fff" : "#000",
        },
      }}
    >
      <DialogTitle>{editingItem ? "Edit Item" : "Add New Item"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              type="text"
              fullWidth
              value={xss(newItem.title)} // Sanitize title
              onChange={(e) => setNewItem({...newItem, title: e.target.value})}
              error={!!errors.title}
              helperText={errors.title}
              InputLabelProps={{
                style: {color: isDarkMode ? "#fff" : "#000"},
              }}
              InputProps={{
                style: {color: isDarkMode ? "#fff" : "#000"},
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={14} // Further increased the number of rows to make the description box even bigger
              value={xss(newItem.description)} // Sanitize description
              onChange={(e) =>
                setNewItem({...newItem, description: e.target.value})
              }
              error={!!errors.description}
              helperText={errors.description}
              InputLabelProps={{
                style: {color: isDarkMode ? "#fff" : "#000"},
              }}
              InputProps={{
                style: {color: isDarkMode ? "#fff" : "#000"},
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="dense">
              <InputLabel style={{color: isDarkMode ? "#fff" : "#000"}}>
                Type
              </InputLabel>
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
                style={{color: isDarkMode ? "#fff" : "#000"}}
              >
                <MenuItem value="Articles">Articles</MenuItem>
                <MenuItem value="Research Papers">Research Papers</MenuItem>
                <MenuItem value="Books">Books</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
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
              InputLabelProps={{
                style: {color: isDarkMode ? "#fff" : "#000"},
              }}
              InputProps={{
                style: {color: isDarkMode ? "#fff" : "#000"},
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} style={{color: isDarkMode ? "#fff" : "#000"}}>
          Cancel
        </Button>
        <Button onClick={onSubmit} variant="contained" color="primary">
          {editingItem ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ItemDialog;
