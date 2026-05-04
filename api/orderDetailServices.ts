import useSWR from "swr";
import axiosInstance from "./axiosInstance";

// -----------------------------
// API Utility Functions
// -----------------------------

// Fetch all Order details
export const fetchOrderDetails = async () => {
   const response = await axiosInstance.get("/order-details");
   return response.data.data;
};

// Create a new order detail
export const createOrderDetail = async (orderDetailData: any) => {
   const response = await axiosInstance.post("/order-detail", orderDetailData);
   return response.data.data;
};

// Update a Order Detail by ID
export const updateOrderDetail = async (id: string | number, updatedData: any) => {
   const response = await axiosInstance.patch(`/order-detail/${id}`, updatedData);
   return response.data.data;
};

// Delete a Order Detail by ID
export const deleteOrderDetail = async (id: string | number) => {
   const response = await axiosInstance.delete(`/order-detail/${id}`);
   return response.data;
};

// Delete a Order Detail by Order ID
export const deleteOrderDetailByOrderId = async (id: string | number) => {
   const response = await axiosInstance.delete(`/order-details/by-order/${id}`);
   return response.data;
};

// -----------------------------
// SWR Hook for Fetching Order Details
// -----------------------------

export const useOrderDetails = () => {
   const { data, error, mutate } = useSWR(
      "order-details",
      fetchOrderDetails,
      {
         revalidateOnFocus: false,
         revalidateOnReconnect: false,
      }
   );

   return {
      useOrderDetails: data,
      isLoading: !error && !data,
      isError: error,
      mutate,
   };
};
