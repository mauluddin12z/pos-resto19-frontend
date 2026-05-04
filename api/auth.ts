import axios, { AxiosResponse } from "axios";
import axiosInstance from "./axiosInstance";

const API_BASE_URL = process.env.NEXT_PUBLIC_MY_BACKEND_URL as string;

export const refreshAccessToken = async (): Promise<string | null> => {
   try {
      const res: AxiosResponse<{ accessToken: string }> = await axios.post(
         `${API_BASE_URL}/token`,
         {},
         {
            withCredentials: true,
         }
      );

      const accessToken = res.data.accessToken;
      if (accessToken) {
         return accessToken;
      }
      window.location.href = "/login";
      return null;
   } catch (error: any) {
      console.error("Failed to refresh access token:", error.message || error);
      window.location.href = "/login";
      return null;
   }
};

// Login user
export const login = async (username:string, password:string) => {
   try {
      const response = await axios.post(
         `${process.env.NEXT_PUBLIC_MY_BACKEND_URL}/login`,
         { username, password },
         { withCredentials: true }
      );

      return response;
   } catch (error: any) {
      throw new Error(error.response?.data?.message || "An error occurred.");
   }
};

// Logout user
export const logout = async (): Promise<void> => {
   try {
      await axiosInstance.delete(`/logout`, {});
   } catch (error: any) {
      console.warn("Logout request failed", error.message || error);
   }
};
