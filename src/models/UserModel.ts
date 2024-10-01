export interface User {
  id: string;
  name: string;
  email: string;
}

export const fetchUserById = async (id: string): Promise<User> => {
  // Simulate an API call to get a user by ID
  const response = await fetch(`/api/users/${id}`);
  const data: User = await response.json();
  return data;
};
