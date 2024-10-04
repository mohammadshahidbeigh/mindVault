// src/utils/validateInputs.ts
export interface Item {
  id: string;
  title: string;
  description: string;
  type: "Articles" | "Research Papers" | "Books";
  tags: string[];
}

export const validateInputs = (newItem: Item) => {
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

  return {isValid, errors: newErrors};
};
