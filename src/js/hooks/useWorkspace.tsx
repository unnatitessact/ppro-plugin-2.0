import { useContext } from "react";

import { WorkspacesContext } from "../context/WorkspaceContext";

export const useWorkspace = () => {
  const { workspace, setWorkspaceId, isLoading, workspaces, members } =
    useContext(WorkspacesContext);

  return { workspace, setWorkspaceId, isLoading, workspaces, members };
};
