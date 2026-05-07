import useSWR from "swr";
import axiosInstance from "./axiosInstance";
import {
   MenuFilterInterface,
} from "@/types";

// Query Params Utility
export const buildQueryParams = (filters: MenuFilterInterface) => {
   const params = new URLSearchParams();

   Object.entries(filters || {}).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") return;

      // nested object (price)
      if (typeof value === "object" && !Array.isArray(value)) {
         Object.entries(value).forEach(([op, v]) => {
            if (v === null || v === undefined || v === "") return;
            params.append(`${key}[${op}]`, String(v));
         });
         return;
      }

      // arrays (future-proof)
      if (Array.isArray(value)) {
         params.append(`${key}[in]`, value.join(","));
         return;
      }

      // normal values
      params.append(key, String(value));
   });

   return params.toString();
 };

// API Functions

export const fetchMenus = async (filters: MenuFilterInterface) => {
   const queryString = buildQueryParams(filters);

   try {
      const response = await axiosInstance.get(`/menus?${queryString}`);

      return response.data;
   } catch (error: any) {
      throw new Error(
         error?.response?.data?.message || "Error fetching menus"
      );
   }
};

export const getMenuById = async (menuId: number) => {
   const response = await axiosInstance.get(`/menus/${menuId}`);
   return response.data;
};

export const createMenu = async (menuData: FormData) => {
   const response = await axiosInstance.post("/menus", menuData);
   return response.data;
};

export const updateMenu = async (
   id: string | number,
   updatedData: FormData
) => {
   const response = await axiosInstance.patch(`/menus/${id}`, updatedData);
   return response.data;
};

export const deleteMenu = async (id: string | number) => {
   const response = await axiosInstance.delete(`/menus/${id}`);
   return response.data;
};

// SWR Hook for Menus

export const useMenus = (filters?: MenuFilterInterface) => {
   const key = filters ? ["menus", filters] : null;

   const fetcher = ([_, filters]: [string, MenuFilterInterface]) =>
      fetchMenus(filters);

   const { data, error, mutate } = useSWR(key, fetcher, {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
   });

   return {
      menus: data,
      isLoading: !data && !error,
      isError: !!error,
      mutate,
   };
};
