// import { useAuth } from '@/context/auth';

import useAuth from "./useAuth";

export const useCurrentUser = () => {
  const { auth } = useAuth();
  return auth?.user;
};
