import axiosInstance from "./axiosInstance";
import useSWR from "swr";

// Fetch all users
export const fetchUsers = async () => {
  const response = await axiosInstance.get("/users");
  return response.data; // 👈 unified with other modules
};

// Get user by id
export const getUserById = async (userId: number) => {
  const response = await axiosInstance.get(`/users/${userId}`);
  return response.data;
};

// Get session
export const getSession = async () => {
  const response = await axiosInstance.get(`/users/session`);
  return response.data;
};

// Create user
export const createUser = async (userData: any) => {
  const response = await axiosInstance.post("/users", userData);
  return response.data;
};

// Update user
export const updateUser = async (id: string | number, updatedData: any) => {
  const response = await axiosInstance.patch(`/users/${id}`, updatedData);
  return response.data;
};

// Delete user
export const deleteUser = async (id: string | number) => {
  const response = await axiosInstance.delete(`/users/${id}`);
  return response.data;
};

export const useUsers = () => {
  const { data, error, mutate } = useSWR("users", fetchUsers, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    users: data,
    isLoading: !data && !error,
    isError: !!error,
    mutate,
  };
};
