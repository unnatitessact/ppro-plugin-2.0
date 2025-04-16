import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

// Define the structure for your auth state, mirroring AuthContext
interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: any; // Use a more specific type if available
}

// Helper function to get auth state directly from localStorage
const getAuthFromStorage = (): Partial<AuthState> => {
  return {
    accessToken: localStorage.getItem("ACCESS_TOKEN"),
    refreshToken: localStorage.getItem("REFRESH_TOKEN"),
    user: JSON.parse(localStorage.getItem("USER") || "null"), // Use null if no user
  };
};

// Helper function to clear auth state in localStorage
const clearAuthStorage = () => {
  localStorage.removeItem("ACCESS_TOKEN");
  localStorage.removeItem("REFRESH_TOKEN");
  localStorage.removeItem("USER");
  // Optionally, dispatch a custom event or use another method
  // to notify the AuthProvider to update its state immediately.
  window.dispatchEvent(new Event("auth-cleared"));
};

// Helper function to update tokens in localStorage
const updateTokensInStorage = (accessToken: string, refreshToken?: string) => {
  localStorage.setItem("ACCESS_TOKEN", accessToken);
  if (refreshToken) {
    localStorage.setItem("REFRESH_TOKEN", refreshToken); // Only update if new refresh token provided
  }
  // Dispatch event to notify AuthProvider of token update
  window.dispatchEvent(
    new CustomEvent("tokens-updated", { detail: { accessToken, refreshToken } })
  );
};

// Define API base URL - Replace with your actual env var setup if different
const API_BASE_URL = "https://dev-api.tessact.com"; // Example default

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token!);
    }
  });
  failedQueue = [];
};

// Add request interceptor to inject token
api.interceptors.request.use(
  (config) => {
    const { accessToken } = getAuthFromStorage();
    if (accessToken && !config.headers["Authorization"]) {
      // Don't overwrite if already set (e.g., by useApi)
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomInternalAxiosRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log(`Axios request failed (401)`, { url: originalRequest.url });

      if (isRefreshing) {
        console.log(`Waiting for token refresh...`);
        try {
          const token = await new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          console.log(
            "Token refreshed, retrying original request with new token."
          );
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return api(originalRequest);
        } catch (queueError) {
          console.error(
            "Failed to get refreshed token from queue.",
            queueError
          );
          // If the waiting promise rejects, it means refresh failed elsewhere
          clearAuthStorage(); // Clear tokens as refresh failed
          // Redirect to login or handle appropriately
          // window.location.href = '/login'; // Example redirect
          return Promise.reject(queueError);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      console.log(`Attempting to refresh token...`);
      const { refreshToken } = getAuthFromStorage();

      if (!refreshToken) {
        console.log(`No refresh token available. Clearing auth state.`);
        isRefreshing = false;
        clearAuthStorage();
        // Redirect or handle login needed
        // window.location.href = '/login'; // Example redirect
        return Promise.reject(new Error("No refresh token, user logged out."));
      }

      try {
        console.log("Sending refresh token request...");
        const response = await axios.post(
          `${API_BASE_URL}/auth/token/refresh/`, // Use your actual refresh endpoint
          { refresh: refreshToken },
          { headers: { "Content-Type": "application/json" } } // Ensure correct headers for refresh call
        );

        // Assuming refresh response gives new access and potentially new refresh token
        const { access: newAccessToken, refresh: newRefreshToken } =
          response.data;
        console.log(`Token refresh successful.`);

        updateTokensInStorage(newAccessToken, newRefreshToken); // Update localStorage and notify context

        // Update Authorization header for the current default instance and the original request
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken); // Resolve queued requests

        console.log("Retrying original request with new token.");
        return api(originalRequest); // Retry the original request
      } catch (refreshError: any) {
        console.error(
          `Token refresh failed:`,
          refreshError.response?.data || refreshError.message
        );
        processQueue(refreshError, null); // Reject queued requests
        clearAuthStorage(); // Clear tokens on refresh failure

        // Redirect or handle login needed
        // window.location.href = '/login'; // Example redirect

        return Promise.reject(refreshError); // Reject the original request's promise
      } finally {
        console.log(`Token refresh attempt finished.`);
        isRefreshing = false;
      }
    }

    // For errors other than 401 or retried 401s
    return Promise.reject(error);
  }
);
