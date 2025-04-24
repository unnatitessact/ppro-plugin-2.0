import { api } from "../lib/axios"; // Adjust the import path if needed
import useAuth from "./useAuth";

import axios from "axios";

// Custom hook to get the configured Axios instance
export const useApi = (options?: { skipToken?: boolean }) => {
  const skipToken = options?.skipToken ?? false;
  const { auth } = useAuth(); // Get auth state from context

  // Set the base URL (optional, already set in create)
  // api.defaults.baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api";

  // Set the Authorization header if we have a token and skipToken is false
  if (auth?.accessToken && !skipToken) {
    api.defaults.headers.common["Authorization"] = `Bearer ${auth.accessToken}`;
  } else {
    // Ensure the header is removed if no token or if skipping
    delete api.defaults.headers.common["Authorization"];
  }

  return api;
};

// Hook specifically for getting the access token (if needed elsewhere)
export const useAccessToken = () => {
  const { auth } = useAuth();
  return auth?.accessToken;
};

export const useAxios = () => {
  const accessToken = useAccessToken();

  const axiosAPI = axios.create({
    baseURL: "https://dev-api.tessact.com",
    headers: {
      "Content-Type": "application/json",
    },
  });

  axiosAPI.defaults.baseURL = "https://dev-api.tessact.com";
  if (accessToken) {
    axiosAPI.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  }

  return axiosAPI;
};
