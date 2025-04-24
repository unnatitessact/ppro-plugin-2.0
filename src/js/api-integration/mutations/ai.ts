import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useApi } from "../../hooks/useApi";
import { useWorkspace } from "../../hooks/useWorkspace";

import {
  getAIConversationsQueryKey,
  getConversationChatsQueryKey,
  // getGuideLinesAndTitleQueryKey
} from "../queries/ai";
import {
  AIConversation,
  CreateTemplateFromConversation,
  GetGuidelineAndTitleForPromptResponse,
  Preset,
  SendUserMessageInput,
} from "../types/ai";

import { useAIUtilsStore } from "../../stores/ai-utils-store";

export const useCreateAIConversation = (assetId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();

  const { searchQuery } = useAIUtilsStore();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<AIConversation>(
        `/api/v1/beluga/start_new_conversation/`,
        {
          asset_id: assetId,
          asset_type: "file",
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getAIConversationsQueryKey(assetId, searchQuery),
      });
    },
  });
};

export const useSendUserMessage = (assetId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();

  const { searchQuery } = useAIUtilsStore();

  return useMutation({
    mutationFn: async (payload: SendUserMessageInput) => {
      const { data } = await api.post(`/api/v1/beluga/create_user_message/`, {
        conversation_id: payload.conversation_id,
        context: payload.message,
        mention_ids: payload.mentions,
        positions: payload.timeRange
          ? [payload.timeRange[0], payload.timeRange[1]]
          : undefined,
        current_timeline: payload.current_timeline,
      });
      return data;
    },
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({
        queryKey: getConversationChatsQueryKey(payload.conversation_id),
      });
      queryClient.invalidateQueries({
        queryKey: getAIConversationsQueryKey(assetId, searchQuery),
      });
    },
  });
};

export const useRenameAIConversation = (
  conversationId: string,
  assetId: string
) => {
  const api = useApi();
  const queryClient = useQueryClient();

  const { searchQuery } = useAIUtilsStore();

  return useMutation({
    mutationFn: async (name: string) => {
      const { data } = await api.post(`/api/v1/beluga/rename_conversation/`, {
        conversation_id: conversationId,
        new_name: name,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getAIConversationsQueryKey(assetId, searchQuery),
      });
    },
  });
};

export const useDeleteAIConversation = (
  conversationId: string,
  assetId: string
) => {
  const api = useApi();
  const queryClient = useQueryClient();

  const { searchQuery } = useAIUtilsStore();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post(`/api/v1/beluga/delete_conversation/`, {
        conversation_id: conversationId,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getAIConversationsQueryKey(assetId, searchQuery),
      });
    },
  });
};

export const useGetGuideLinesAndTitle = ({
  conversationId,
}: {
  conversationId: string;
}) => {
  const api = useApi();

  const { setPresetToPreview } = useAIUtilsStore();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<GetGuidelineAndTitleForPromptResponse>(
        `/api/v1/beluga/get_guideline_and_title_for_prompt/`,
        {
          conversation_id: conversationId,
        }
      );
      return data;
    },
    onSuccess: (data) => {
      setPresetToPreview(data as unknown as Preset);
    },
  });
};

export const useCreateTemplateForConversation = ({
  conversationId,
}: {
  conversationId: string;
}) => {
  const api = useApi();

  const { workspace } = useWorkspace();

  const { setSelectedChat, setPresetToPreview } = useAIUtilsStore();

  return useMutation({
    mutationFn: async ({
      guideline,
      title,
      duration,
      is_public,
      intent,
    }: {
      guideline: string;
      title: string;
      duration: number;
      is_public: boolean;
      intent: string;
    }) => {
      const { data } = await api.post<CreateTemplateFromConversation[]>(
        `/api/v1/beluga/${conversationId}/save_conversation_as_template/`,
        {
          workspace: workspace?.id,
          guideline: guideline,
          title: title,
          duration: duration,
          is_public: is_public,
          intent: intent,
        }
      );
      return data;
    },
    onSuccess: () => {
      setSelectedChat(null);
      setPresetToPreview(null);
    },
  });
};

export const useApplyPresetToConversation = ({
  assetId,
  assetType,
}: {
  assetId: string;
  assetType: string;
}) => {
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      presetId,
      conversationId,
    }: {
      presetId: string;
      conversationId: string;
    }) => {
      const { data } = await api.post(
        `/api/v1/ai_preset/${presetId}/apply_template/`,
        {
          asset_id: assetId,
          asset_type: assetType,
          conversation_id: conversationId,
        }
      );
      return data;
    },
  });
};

// export const useDeletePresetFromConversation = ({ conversationId }: { conversationId: string }) => {
//   const api = useApi();

//   return useMutation({
//     mutationFn: async () => {
//       const { data } = await api.post(`/api/v1/beluga/delete_conversation/`, {
//         conversation_id: conversationId
//       });
//       return data;
//     }
//   });
// };

// export const useUpdatePresetFromConversation = ({ conversationId }: { conversationId: string }) => {
//   const api = useApi();

//   return useMutation({
//     mutationFn: async ({ newName }: { newName: string }) => {
//       const { data } = await api.post(`/api/v1/beluga/update_conversation/`, {
//         new_name: newName,
//         conversation_id: conversationId
//       });
//       return data;
//     }
//   });
// };

export const useDeletePresetFromConversation = () => {
  const api = useApi();

  return useMutation({
    mutationFn: async (presetId: string) => {
      const { data } = await api.delete(`/api/v1/ai_preset/${presetId}/`);
      return data;
    },
  });
};
