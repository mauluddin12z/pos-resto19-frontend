// -----------------------------
// API Utility Functions
// -----------------------------

import useSWR from "swr";
import axiosInstance from "./axiosInstance";

// Fetch all users
export const fetchUsers = async () => {
   const response = await axiosInstance.get("/users");
   return response.data.data; // Adjust if your API returns differently
};

//get user by id
export const getUserById = async (userId: number) => {
   const response = await axiosInstance.get(`/user/${userId}`);
   return response.data;
};

// Get Session
export const getSession = async () => {
   const response = await axiosInstance.get(`/auth/session`);
   return response;
};

// Create a new user
export const createUser = async (userData: any) => {
   const response = await axiosInstance.post("/user", userData);
   return response.data;
};

// Update a user by ID
export const updateUser = async (id: string | number, updatedData: any) => {
   const response = await axiosInstance.patch(`/user/${id}`, updatedData);
   return response.data;
};

// Delete a user by ID
export const deleteUser = async (id: string | number) => {
   const response = await axiosInstance.delete(`/user/${id}`);
   return response.data;
};

// -----------------------------
// SWR Hook for Fetching Users
// -----------------------------

export const useUsers = () => {
   const { data, error, isValidating, mutate } = useSWR("users", fetchUsers, {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
   });

   return {
      users: data,
      isLoading: !error && !data,
      isError: error,
      mutate, // allows you to refresh after changes
   };
};
