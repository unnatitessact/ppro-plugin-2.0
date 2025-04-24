import axios from "axios";

import { useAccessToken } from "./useAccessToken";

import { api } from "../lib/axios";

export const useApi = (options?: { skipToken?: boolean }) => {
  const skipToken = options?.skipToken ?? false;
  const accessToken = useAccessToken();

  api.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (accessToken && !skipToken) {
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  }

  return api;
};

// useAPI has custom refresh token logic, useAxios just axios

export const useAxios = () => {
  const accessToken = useAccessToken();

  const axiosAPI = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  axiosAPI.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (accessToken) {
    axiosAPI.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  }

  return axiosAPI;
};
