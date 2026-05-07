import useSWR from "swr";
import axiosInstance from "./axiosInstance";
import { CategoryFilterInterface } from "@/types";

export const buildQueryParams = (filters: CategoryFilterInterface) => {
   const params = new URLSearchParams();

   Object.entries(filters || {}).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") return;

      // nested objects (future-proof)
      if (typeof value === "object" && !Array.isArray(value)) {
         Object.entries(value).forEach(([op, v]) => {
            if (v === null || v === undefined || v === "") return;
            params.append(`${key}[${op}]`, String(v));
         });
         return;
      }

      // arrays support (future-proof)
      if (Array.isArray(value)) {
         params.append(`${key}[in]`, value.join(","));
         return;
      }

      params.append(key, String(value));
   });

   return params.toString();
};


// Fetch all categories
export const fetchCategories = async (
   filters: CategoryFilterInterface
) => {
   const queryString = buildQueryParams(filters);

   try {
      const response = await axiosInstance.get(
         `/categories?${queryString}`
      );

      return response.data;
   } catch (error: any) {
      throw new Error(
         error?.response?.data?.message ||
            "Error fetching categories"
      );
   }
};

// Get category by id
export const getCategoryById = async (categoryId: number) => {
   const response = await axiosInstance.get(`/categories/${categoryId}`);
   return response.data;
};

// Create a new category
export const createCategory = async (categoryData: any) => {
   const response = await axiosInstance.post("/categories", categoryData);
   return response.data.data;
};

// Update a category by ID
export const updateCategory = async (id: string | number, updatedData: any) => {
   const response = await axiosInstance.patch(`/categories/${id}`, updatedData);
   return response.data.data;
};

// Delete a category by ID
export const deleteCategory = async (id: string | number) => {
   const response = await axiosInstance.delete(`/categories/${id}`);
   return response.data;
};

// SWR Hook for Fetching Categories
export const useCategories = (
   filters?: CategoryFilterInterface
) => {
   const key = filters ? ["categories", filters] : null;

   const fetcher = ([_, filters]: [
      string,
      CategoryFilterInterface
   ]) => fetchCategories(filters);

   const { data, error, mutate } = useSWR(key, fetcher, {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
   });

   return {
      categories: data,
      isLoading: !data && !error,
      isError: !!error,
      mutate,
   };
};
