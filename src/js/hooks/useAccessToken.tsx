// import { useAuth } from "../context/auth";
import useAuth from "./useAuth";

export const useAccessToken = () => {
  const { auth } = useAuth();

  return auth?.accessToken;
};
