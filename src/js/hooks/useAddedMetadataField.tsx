import { useMutationState } from "@tanstack/react-query";

import { getAddLibraryMetadataFieldMutationKey } from "../api-integration/mutations/metadata";
import { getAddMetadataFieldMutationKey } from "../api-integration/mutations/projects";
import { MetadataKeyValueCategoryField } from "../api-integration/types/metadata";
import { ProjectMetadata } from "../api-integration/types/projects";

export const useLastAddedMetadataFieldId = ({
  instanceId,
  instanceType,
}: {
  instanceId: string;
  instanceType: "project" | "file";
}) => {
  const addFieldMutationIds = useMutationState({
    filters: {
      mutationKey: getAddMetadataFieldMutationKey(instanceId, instanceType),
      status: "success",
      exact: true,
    },
    select: (mutation) => {
      const data = mutation.state.data as ProjectMetadata;
      return data.id;
    },
  });

  const lastAddedFieldId = addFieldMutationIds[addFieldMutationIds.length - 1];
  return lastAddedFieldId;
};

// For library metadata
export const useLastAddedLibraryMetadataFieldId = ({
  categoryId,
}: {
  categoryId: string;
}) => {
  const addFieldMutationIds = useMutationState({
    filters: {
      mutationKey: getAddLibraryMetadataFieldMutationKey(categoryId),
      status: "success",
      exact: true,
    },
    select: (mutation) => {
      const data = mutation.state.data as MetadataKeyValueCategoryField;
      return data.id;
    },
  });

  console.log(addFieldMutationIds);

  const lastAddedFieldId = addFieldMutationIds[addFieldMutationIds.length - 1];
  return lastAddedFieldId;
};
