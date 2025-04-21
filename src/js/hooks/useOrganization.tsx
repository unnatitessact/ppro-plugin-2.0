import useAuth from "./useAuth";

export const useOrganization = () => {
  const { auth } = useAuth();
  return (
    auth?.user?.organization || {
      id: "",
      title: "",
    }
  );
};
