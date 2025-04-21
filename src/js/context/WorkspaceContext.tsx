"use client";

import { createContext, useEffect, useMemo, useState } from "react";

// import { useQueryState } from "nuqs";

import { useOrganization } from "../hooks/useOrganization";
import { useTagger } from "../hooks/useTagger";

import {
  useUserWorkspacesQuery,
  useWorkspacesQuery,
  useWorkspaceUsersQuery,
} from "../api-integration/queries/user-management";
import {
  UserWithWorkspaceAndRole,
  Workspace,
} from "../api-integration/types/user-management";

interface WorkspacesContextType {
  workspace: Workspace;
  setWorkspaceId: (workspaceId: string) => void;
  workspaces: Workspace[];
  isLoading: boolean;
  members: UserWithWorkspaceAndRole[];
}

export const WorkspacesContext = createContext<WorkspacesContextType>({
  workspace: {
    id: "",
    title: "",
    color: "",
    display_image: "",
    team_count: 0,
  },
  setWorkspaceId: () => {},
  workspaces: [],
  isLoading: false,
  members: [],
});

export const WorkspacesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { id } = useOrganization();
  const { showTagging: isTagger } = useTagger();

  const {
    data: userWorkspaces,
    isSuccess: isUserWorkspacesSuccess,
    isLoading: isUserWorkspacesLoading,
  } = useUserWorkspacesQuery(id);
  const {
    data: allWorkspaces,
    isSuccess: isAllWorkspacesSuccess,
    isLoading: isAllWorkspacesLoading,
  } = useWorkspacesQuery(id);

  const workspaces = useMemo(
    () => (isTagger ? allWorkspaces : userWorkspaces),
    [isTagger, allWorkspaces, userWorkspaces]
  );
  const isSuccess = isTagger ? isAllWorkspacesSuccess : isUserWorkspacesSuccess;
  const isLoading = isTagger ? isAllWorkspacesLoading : isUserWorkspacesLoading;

  // const [workspace, setWorkspace] = useState<Workspace>(() => {
  // return {
  //   id: '',
  //   title: '',
  //   color: '',
  //   display_image: '',
  //   team_count: 0
  // };
  // });

  const [workspaceIdParam, setWorkspaceIdParam] = useState("");
  const [workspaceId, setWorkspaceId] = useState(workspaceIdParam);

  // Sync workspaceId with URL param
  useEffect(() => {
    if (workspaceId !== workspaceIdParam) {
      setWorkspaceIdParam(workspaceId);
    }
  }, [workspaceId, workspaceIdParam, setWorkspaceIdParam]);

  // // Inherit workspaceId from URL param
  // useEffect(() => {
  //   if (workspaceIdParam && workspaceIdParam !== workspaceId) {
  //     setWorkspaceId(workspaceIdParam);
  //   }
  // }, [workspaceIdParam, workspaceId]);

  const workspace = useMemo(() => {
    return (
      workspaces?.find((workspace) => workspace.id === workspaceId) ||
      workspaces?.[0] || {
        id: "",
        title: "",
        color: "",
        display_image: "",
        team_count: 0,
      }
    );
  }, [workspaces, workspaceId]);

  useEffect(() => {
    if (isSuccess && workspaces && workspaces[0] && !workspaceId) {
      setWorkspaceId(workspaces[0].id);
    }
  }, [isSuccess, workspaces, workspaceId, setWorkspaceId]);

  // Making sure that the selected workspace is part of the workspaces list
  useEffect(() => {
    if (isSuccess && workspaceId && workspaces && workspaces.length > 0) {
      const workspaceExists = workspaces.find(
        (workspace) => workspace.id === workspaceId
      );
      if (!workspaceExists) {
        setWorkspaceId(workspaces[0].id);
      }
    }
  }, [isSuccess, workspaceId, workspaces, setWorkspaceId]);

  // Store last selected workspace to local storage and persist until user logs out
  useEffect(() => {
    if (workspaceId) {
      localStorage.setItem("LAST_SELECTED_WORKSPACE_ID", workspaceId);
    }
  }, [workspaceId]);

  // Initialize with workspace in local storage
  useEffect(() => {
    const lastSelectedWorkspace = localStorage.getItem(
      "LAST_SELECTED_WORKSPACE_ID"
    );
    if (lastSelectedWorkspace && workspaces) {
      const workspace = workspaces?.find(
        (workspace) => workspace.id === lastSelectedWorkspace
      );
      if (workspace) {
        setWorkspaceId(workspace.id);
      } else {
        setWorkspaceId(workspaces?.[0].id);
      }
    }
  }, [workspaces, setWorkspaceId]);

  const {
    data: users,
    fetchNextPage,
    hasNextPage,
  } = useWorkspaceUsersQuery(workspace?.id, "", !!workspace?.id);

  useEffect(() => {
    if (hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage]);

  const members = useMemo(() => {
    return users?.pages.flatMap((page) => page.results) || [];
  }, [users]);

  return (
    <WorkspacesContext.Provider
      value={{
        workspace,
        setWorkspaceId,
        workspaces: workspaces || [],
        isLoading,
        members,
      }}
    >
      {children}
    </WorkspacesContext.Provider>
  );
};
