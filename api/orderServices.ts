import useSWR from "swr";
import axiosInstance from "./axiosInstance";

// ----------------------------
// Query Params Utility
// ----------------------------
export const buildQueryParams = (filters: any) => {
  const params = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        params.append(key, value.toString());
      }
    });
  }

  return params;
};

// ----------------------------
// API Functions
// ----------------------------

export const fetchOrders = async (filters: any) => {
  const queryParams = buildQueryParams(filters);

  try {
    const response = await axiosInstance.get("/orders", {
      params: queryParams,
    });

    // Return entire response (includes data and meta)
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Error fetching orders");
  }
};
export const getOrderById = async (orderId: number) => {
  const response = await axiosInstance.get(`/order/${orderId}`);
  return response.data;
};

export const createOrder = async (orderData: FormData) => {
  const response = await axiosInstance.post("/order", orderData);
  return response.data;
};

export const updateOrder = async (
  id: string | number,
  updatedData: FormData,
) => {
  const response = await axiosInstance.patch(`/order/${id}`, updatedData);
  return response.data;
};

export const deleteOrder = async (id: string | number) => {
  const response = await axiosInstance.delete(`/order/${id}`);
  return response.data;
};

// ----------------------------
// SWR Hook for order
// ----------------------------

export const useOrders = (filters?: any) => {
  // If filters are provided, use them, otherwise fetch all orders
  const key = filters ? ["orders", filters] : "orders";

  const {
    data: response,
    error,
    mutate,
  } = useSWR(key, () => fetchOrders(filters), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    orders: response,
    isLoading: !response && !error,
    isError: !!error,
    mutate,
  };
};
