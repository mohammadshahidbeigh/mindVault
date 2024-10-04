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
} from "@mui/material";
import {Item} from "../../utils/validateInputs"; // Removed unused 'validateInputs'

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
  return (
    <Dialog open={open} onClose={onClose}>
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
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit} variant="contained" color="primary">
          {editingItem ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ItemDialog;
