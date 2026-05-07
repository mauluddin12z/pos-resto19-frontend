import axiosInstance from "./axiosInstance";

export const fetchOrderDetails = async () => {
   const response = await axiosInstance.get("/order-details");
   return response.data.data;
};

export const createOrderDetail = async (orderDetailData: any) => {
   const response = await axiosInstance.post(
      "/order-details",
      orderDetailData
   );
   return response.data.data;
};

export const updateOrderDetail = async (
   id: string | number,
   updatedData: any
) => {
   const response = await axiosInstance.patch(
      `/order-details/${id}`,
      updatedData
   );
   return response.data.data;
};

export const deleteOrderDetail = async (id: string | number) => {
   const response = await axiosInstance.delete(
      `/order-details/${id}`
   );
   return response.data;
};

export const deleteOrderDetailByOrderId = async (
   id: string | number
) => {
   const response = await axiosInstance.delete(
      `/order-details/by-order/${id}`
   );
   return response.data;
};