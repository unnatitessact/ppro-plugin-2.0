import React from 'react';

import { useDndContext, useDraggable } from '@dnd-kit/core';
import { useMediaQuery } from '@mantine/hooks';
import { useMutationState } from '@tanstack/react-query';

import { AddFileToVersionStackPayload, LibraryAsset } from '@/api-integration/types/library';

import { MOBILE_MEDIA_QUERY } from '@/utils/responsiveUtils';

type DraggableProps = {
  id: string;
  children: React.ReactNode;
  data: LibraryAsset;
  disabled?: boolean;
};

function LibraryDraggable({ id, children, data, disabled = false }: DraggableProps) {
  const { active } = useDndContext();
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  const isSame = active ? (active.id !== id ? true : false) : false;

  const filesBeingAddedAsVersions = useMutationState({
    filters: {
      status: 'pending',
      mutationKey: ['add-version-stack']
    },
    select: (mutation) => {
      const payload = mutation.state.variables as AddFileToVersionStackPayload;
      return payload.file_ids;
    }
  }).flatMap((f) => f);

  const { attributes, listeners, setNodeRef } = useDraggable({
    id,
    data,
    disabled: isSame || disabled || filesBeingAddedAsVersions.length > 0 || isMobile
  });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      {children}
    </div>
  );
}

export default LibraryDraggable;
