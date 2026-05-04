import useSWR from "swr";
import axiosInstance from "./axiosInstance";
import { buildQueryParams } from "./menuServices";

// -----------------------------
// API Utility Functions
// -----------------------------

// Fetch all categories
export const fetchCategories = async (filters: any) => {
   const queryParams = buildQueryParams(filters);

   try {
      const response = await axiosInstance.get("/categories", {
         params: queryParams,
      });

      // Return entire response (includes data and meta)
      return response.data;
   } catch (error: any) {
      throw new Error(
         error?.response?.data?.message || "Error fetching categories"
      );
   }
};

// Get category by id
export const getCategoryById = async (categoryId: number) => {
   const response = await axiosInstance.get(`/category/${categoryId}`);
   return response.data;
};

// Create a new category
export const createCategory = async (categoryData: any) => {
   const response = await axiosInstance.post("/category", categoryData);
   return response.data.data;
};

// Update a category by ID
export const updateCategory = async (id: string | number, updatedData: any) => {
   const response = await axiosInstance.patch(`/category/${id}`, updatedData);
   return response.data.data;
};

// Delete a category by ID
export const deleteCategory = async (id: string | number) => {
   const response = await axiosInstance.delete(`/category/${id}`);
   return response.data;
};

// -----------------------------
// SWR Hook for Fetching Categories
// -----------------------------

export const useCategories = (filters?: any) => {
   const key = filters ? ["categories", filters] : "categories";

   const {
      data: response,
      error,
      mutate,
   } = useSWR(key, () => fetchCategories(filters), {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
   });

   return {
      categories: response,
      isLoading: !response && !error,
      isError: !!error,
      mutate,
   };
};
