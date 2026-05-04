import useSWR from "swr";
import axiosInstance from "./axiosInstance";
import {
   MenuFilterInterface,
} from "@/types";

// ----------------------------
// Query Params Utility
// ----------------------------
export const buildQueryParams = (filters: MenuFilterInterface) => {
   const params = new URLSearchParams();

   Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
         params.append(key, value.toString());
      }
   });

   return params;
};

// ----------------------------
// API Functions
// ----------------------------

export const fetchMenus = async (filters: MenuFilterInterface) => {
   const queryParams = buildQueryParams(filters);

   try {
      const response = await axiosInstance.get("/menus", {
         params: queryParams,
      });

      // Return entire response (includes data and meta)
      return response.data;
   } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Error fetching menus");
   }
};

export const getMenuById = async (menuId: number) => {
   const response = await axiosInstance.get(`/menu/${menuId}`);
   return response.data;
};

export const createMenu = async (menuData: FormData) => {
   const response = await axiosInstance.post("/menu", menuData);
   return response.data;
};

export const updateMenu = async (
   id: string | number,
   updatedData: FormData
) => {
   const response = await axiosInstance.patch(`/menu/${id}`, updatedData);
   return response.data;
};

export const deleteMenu = async (id: string | number) => {
   const response = await axiosInstance.delete(`/menu/${id}`);
   return response.data;
};

// ----------------------------
// SWR Hook for Menus
// ----------------------------

export const useMenus = (filters?: any) => {
   const key = filters ? ["menus", filters] : "menus";

   const {
      data: response,
      error,
      mutate,
   } = useSWR(key, () => fetchMenus(filters), {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
   });
   return {
      menus: response,
      isLoading: !response && !error,
      isError: !!error,
      mutate,
   };
};
