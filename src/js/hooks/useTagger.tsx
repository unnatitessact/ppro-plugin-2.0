// import { useAuth } from '@/context/auth';

import useAuth from "./useAuth";

export const useTagger = () => {
  const { auth } = useAuth();

  const user = auth?.user;

  return {
    showTagging:
      Array.isArray(user?.user_type) &&
      user?.user_type?.some((userType: any) => userType.name === "Tagger"),
  };
};
