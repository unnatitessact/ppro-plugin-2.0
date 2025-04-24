import { usePreferences } from "../context/preferences";

export const usePrefferedName = () => {
  const { preferences } = usePreferences();
  const getPreferredName = ({
    display_name,
    first_name,
    last_name,
  }: {
    display_name: string;
    first_name: string;
    last_name: string;
  }) => {
    if (preferences?.preference.name_display === "display_name") {
      return display_name;
    } else {
      return `${first_name} ${last_name}`;
    }
  };
  return { getPreferredName };
};
