import useSWR from "swr";
import axiosInstance from "./axiosInstance";
import { OrderFilterInterface } from "@/types";

// Query Params Utility
export const buildQueryParams = (filters: OrderFilterInterface) => {
  const params = new URLSearchParams();

  Object.entries(filters || {}).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;

    // nested object (total)
    if (typeof value === "object" && !Array.isArray(value)) {
      Object.entries(value).forEach(([op, v]) => {
        if (v === null || v === undefined || v === "") return;
        params.append(`${key}[${op}]`, String(v));
      });
      return;
    }

    params.append(key, String(value));
  });

  return params.toString();
};

// API Functions
export const fetchOrders = async (filters: OrderFilterInterface) => {
  const queryString = buildQueryParams(filters);

  try {
    const response = await axiosInstance.get(`/orders?${queryString}`);

    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Error fetching orders");
  }
};

export const getOrderById = async (orderId: number) => {
  const response = await axiosInstance.get(`/orders/${orderId}`);
  return response.data;
};

export const createOrder = async (orderData: any) => {
  const response = await axiosInstance.post("/orders", orderData);
  return response.data;
};

export const updateOrder = async (id: string | number, updatedData: any) => {
  const response = await axiosInstance.patch(`/orders/${id}`, updatedData);
  return response.data;
};

export const payment = async (id: string | number, updatedData: any) => {
  const response = await axiosInstance.patch(
    `/orders/${id}/payment`,
    updatedData,
  );
  return response.data;
};

export const deleteOrder = async (id: string | number) => {
  const response = await axiosInstance.delete(`/orders/${id}`);
  return response.data;
};

// SWR Hook for order

export const useOrders = (filters?: OrderFilterInterface) => {
  const key = filters ? ["orders", filters] : "orders";

  const fetcher = ([_, filters]: [string, OrderFilterInterface]) =>
    fetchOrders(filters);

  const { data, error, mutate } = useSWR(key, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    orders: data,
    isLoading: !data && !error,
    isError: !!error,
    mutate,
  };
};
