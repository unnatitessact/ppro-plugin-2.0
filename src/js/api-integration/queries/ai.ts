import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { useApi } from "../../hooks/useApi";
import { useWorkspace } from "../../hooks/useWorkspace";

import {
  AIConversationChatsResponse,
  AIConversationsResponse,
  PresetListResponse,
  SystemPrompt,
} from "../types/ai";

// Query keys
export const getAIConversationsQueryKey = (
  assetId: string,
  searchQuery: string
) => ["ai-conversations", assetId, searchQuery];

export const getConversationChatsQueryKey = (conversationId: string) => [
  "ai-conversation-chats",
  conversationId,
];
export const getSystemPromptsQueryKey = () => ["system-prompts"];
export const getGuideLinesAndTitleQueryKey = (conversationId: string) => [
  "guide-lines-and-title",
  conversationId,
];

export const getPresetListQueryKey = (
  workspaceId: string,
  searchQuery: string,
  createdBy?: string[],
  intentTypes?: string[],
  hasAttachments?: boolean,
  fileId?: string
) => [
  "preset-list",
  workspaceId,
  searchQuery,
  createdBy,
  intentTypes,
  hasAttachments,
  fileId,
];

// Queries
export const useAIConversationsQuery = ({
  assetId,
  searchQuery,
}: {
  assetId: string;
  searchQuery: string;
}) => {
  const api = useApi();

  return useInfiniteQuery({
    queryKey: getAIConversationsQueryKey(assetId, searchQuery),
    queryFn: async ({ pageParam }) => {
      const { data } = await api.get<AIConversationsResponse>(
        `/api/v1/beluga/get_previous_conversations/?content_id=${assetId}&content_type=file&page=${pageParam}&search=${searchQuery}`
      );
      return data.data;
    },
    enabled: !!assetId,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.next ? lastPage.meta.current_page + 1 : undefined,
    getPreviousPageParam: (lastPage) =>
      lastPage.meta.previous ? lastPage.meta.current_page - 1 : undefined,
  });
};

export const useConversationChatsQuery = (conversationId: string) => {
  const api = useApi();

  return useInfiniteQuery({
    queryKey: getConversationChatsQueryKey(conversationId),
    queryFn: async ({ pageParam }) => {
      const { data } = await api.get<AIConversationChatsResponse>(
        `/api/v1/beluga/${conversationId}/retrieve_user_messages/?page=${pageParam}`
      );
      return data.data;
    },
    enabled: !!conversationId,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.next ? lastPage.meta.current_page + 1 : undefined,
    getPreviousPageParam: (lastPage) =>
      lastPage.meta.previous ? lastPage.meta.current_page - 1 : undefined,
  });
};

export const useSystemPrompts = () => {
  const api = useApi();

  return useQuery({
    queryKey: getSystemPromptsQueryKey(),
    queryFn: async () => {
      const { data } = await api.get<SystemPrompt[]>(
        "/api/v1/beluga/get_system_prompts/"
      );
      return data;
    },
  });
};

export const usePresetList = ({
  createdBy,
  intentTypes,
  hasAttachments,
  searchQuery,
  fileId,
}: {
  createdBy?: string[];
  intentTypes?: string[];
  hasAttachments?: boolean;
  searchQuery: string;
  fileId: string;
}) => {
  const api = useApi();
  const { workspace } = useWorkspace();

  return useInfiniteQuery({
    queryKey: getPresetListQueryKey(
      workspace?.id,
      searchQuery,
      createdBy,
      intentTypes,
      hasAttachments,
      fileId
    ),
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();

      // Add workspace ID
      params.append("workspace", workspace?.id);

      // Add created_by filters
      createdBy?.forEach((creator) => params.append("created_by[]", creator));

      // Add intent types
      intentTypes?.forEach((type) => params.append("intent_types[]", type));

      // Add has_attachments if provided
      if (hasAttachments !== undefined) {
        params.append("has_attachments", hasAttachments.toString());
      }

      if (fileId) {
        params.append("file_id", fileId);
      }

      // Add search query if provided
      if (searchQuery) {
        params.append("search", searchQuery);
      }

      const response = await api.get<PresetListResponse>(
        `/api/v1/ai_preset/?${params.toString()}&page=${pageParam}`
      );
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.data.meta.next ? lastPage.data.meta.current_page + 1 : undefined,
    getPreviousPageParam: (lastPage) =>
      lastPage.data.meta.previous
        ? lastPage.data.meta.current_page - 1
        : undefined,
  });
};
