'use client';

import type { ReviewCommentSort, Tag } from '@/api-integration/types/review';
import type { FilterCollection } from '@/components/review/ReviewFilterDropdown/ReviewFilterDropdown';

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import { useSearchParams } from 'next/navigation';

import { usePlayerContext } from '@/context/player';
import { useEventListener, useIsInsideRoom } from '@/liveblocks.config';
import { useLocalStorage } from '@mantine/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useMediaRemote } from '@vidstack/react';

import { useWorkspace } from '@/hooks/useWorkspace';

import { useUpdateReviewCommentsAsRead } from '@/api-integration/mutations/review';
import { reviewCommentsQueryKey, useReviewHashtagsQuery } from '@/api-integration/queries/review';
import { useWorkspaceUsersQuery } from '@/api-integration/queries/user-management';
import { User } from '@/api-integration/types/auth';
import { ResourceType } from '@/api-integration/types/library';
import { ResourceType as ProjectResourceType } from '@/api-integration/types/projects';

import { useReviewStore } from '@/stores/review-store';
import { useSearchActionsStore } from '@/stores/search-actions-store';

export const emptyFilterState = {
  attachments: false,
  unread: false,
  markedDone: false,
  tags: [],
  mentions: [],
  commenter: [],
  createdDate: null
};

interface CommentsContextType {
  workspaceUsers: User[];
  hashtags: Tag[];
  fileId: string;
  fileName: string | undefined;
  fileType: ResourceType | ProjectResourceType;
  isTimedAsset: boolean;
  appliedFilters: FilterCollection;
  setAppliedFilters: Dispatch<SetStateAction<FilterCollection>>;
  isSearchOpen: boolean;
  setIsSearchOpen: Dispatch<SetStateAction<boolean>>;
  toggleIsSearchOpen: () => void;
  appliedSort: ReviewCommentSort;
  setAppliedSort: Dispatch<SetStateAction<ReviewCommentSort>>;
  addCommentToBeMarkedAsRead: (id: string) => void;
  timeIn: number | null;
  timeOut: number | null;
  setTimeIn: (timeIn: number | null) => void;
  setTimeOut: (timeOut: number | null) => void;
  keyPress: { key: string; time: number };
  setKeyPress: (keyPress: { key: string; time: number }) => void;
  isTimeInSelected: boolean;
  setIsTimeInSelected: (isTimeInSelected: boolean) => void;
  isTimeOutSelected: boolean;
  setIsTimeOutSelected: (isTimeOutSelected: boolean) => void;
  isLoopSelectionEnabled: boolean;
  setIsLoopSelectionEnabled: (isLoopSelectionEnabled: boolean) => void;
  isTimeInAndTimeOutSelectionEnabled: boolean;
  setIsTimeInAndTimeOutSelectionEnabled: (isTimeInAndTimeOutSelectionEnabled: boolean) => void;
  selectionWidth: number;
  setSelectionWidth: (selectionWidth: number) => void;
}

const CommentsContext = createContext<CommentsContextType>({
  workspaceUsers: [],
  hashtags: [],
  fileId: '',
  fileName: '',
  fileType: 'File',
  isTimedAsset: false,
  appliedFilters: emptyFilterState,
  setAppliedFilters: () => {},
  isSearchOpen: false,
  setIsSearchOpen: () => {},
  toggleIsSearchOpen: () => {},
  appliedSort: 'in_time',
  setAppliedSort: () => {},
  addCommentToBeMarkedAsRead: () => {},
  timeIn: null,
  timeOut: null,
  setTimeIn: () => {},
  setTimeOut: () => {},
  keyPress: { key: '', time: Date.now() },
  setKeyPress: () => {},
  isTimeInSelected: false,
  setIsTimeInSelected: () => {},
  isTimeOutSelected: false,
  setIsTimeOutSelected: () => {},
  isLoopSelectionEnabled: false,
  setIsLoopSelectionEnabled: () => {},
  isTimeInAndTimeOutSelectionEnabled: true,
  setIsTimeInAndTimeOutSelectionEnabled: () => {},
  selectionWidth: 16,
  setSelectionWidth: () => {}
});

export function CommentsProvider({
  children,
  fileId,
  fileName,
  fileType
}: {
  children: ReactNode;
  fileId: string;
  fileName?: string;
  fileType: ResourceType | ProjectResourceType;
}) {
  const { workspace } = useWorkspace();

  const { data: hashtags } = useReviewHashtagsQuery();

  const {
    data: workspaceUsersPaginated,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isSuccess
  } = useWorkspaceUsersQuery(workspace?.id, '');

  const workspaceUsers = useMemo(
    () => workspaceUsersPaginated?.pages?.flatMap((page) => page.results) || [],
    [workspaceUsersPaginated]
  );

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage && isSuccess) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage, isFetchingNextPage, isSuccess]);

  const { mutate: updateReviewCommentsAsRead } = useUpdateReviewCommentsAsRead();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('query')?.toString() ?? '';

  const [appliedFilters, setAppliedFilters] = useState<FilterCollection>(emptyFilterState);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(searchQuery.length > 0);

  const { setAppliedFilters: setStoreAppliedFilters, setAppliedSort: setStoreAppliedSort } =
    useReviewStore();

  const isTimedAsset = fileType == 'VideoFile' || fileType === 'ProjectVideoFile';

  // const [appliedSort, setAppliedSort] = useState<ReviewCommentSort>('in_time');

  const [appliedSort, setAppliedSort] = useLocalStorage<ReviewCommentSort>({
    key: 'appliedSort',
    defaultValue: 'in_time'
  });

  const [timeIn, setTimeIn] = useState<number | null>(null);
  const [timeOut, setTimeOut] = useState<number | null>(null);
  const [keyPress, setKeyPress] = useState<{ key: string; time: number }>({
    key: '',
    time: Date.now()
  });
  const [isTimeInSelected, setIsTimeInSelected] = useState(false);
  const [isTimeOutSelected, setIsTimeOutSelected] = useState(false);
  const [isLoopSelectionEnabled, setIsLoopSelectionEnabled] = useState(false);

  const [isTimeInAndTimeOutSelectionEnabled, setIsTimeInAndTimeOutSelectionEnabled] =
    useState(false);

  const [selectionWidth, setSelectionWidth] = useState(16);

  const toggleIsSearchOpen = () => setIsSearchOpen((prev) => !prev);

  const commentsToBeMarkedAsReadRef = useRef<string[]>([]);

  // This block handles marking comments as read in a batched manner
  const addCommentToBeMarkedAsRead = useCallback((id: string) => {
    commentsToBeMarkedAsReadRef.current = Array.from(
      new Set([...commentsToBeMarkedAsReadRef.current, id])
    );
  }, []);

  const markCommentsAsRead = useCallback(
    (ids: string[]) => {
      updateReviewCommentsAsRead(ids, {
        onSuccess: () => {
          commentsToBeMarkedAsReadRef.current = [];
        }
      });
    },
    [updateReviewCommentsAsRead]
  );

  useEffect(() => {
    // This function batches all comment ids that need to be marked as read
    // and calls the API every 2 seconds if needed to mark as read
    const intervalId = setInterval(() => {
      if (commentsToBeMarkedAsReadRef.current.length > 0) {
        markCommentsAsRead(commentsToBeMarkedAsReadRef.current);
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }, [markCommentsAsRead]);

  // Save them as duplicate in review store, to make them accessible in the action bar
  // For download comment logic
  useEffect(() => {
    setStoreAppliedFilters(appliedFilters);
    setStoreAppliedSort(appliedSort);
  }, [appliedFilters, appliedSort, setStoreAppliedFilters, setStoreAppliedSort]);

  const isInsideRoom = useIsInsideRoom();
  return (
    <CommentsContext.Provider
      value={{
        workspaceUsers: workspaceUsers ?? [],
        hashtags: hashtags ?? [],
        fileId,
        fileName,
        fileType,
        isTimedAsset,
        appliedFilters,
        setAppliedFilters,
        isSearchOpen,
        setIsSearchOpen,
        toggleIsSearchOpen,
        appliedSort,
        setAppliedSort,
        addCommentToBeMarkedAsRead,
        timeIn,
        timeOut,
        setTimeIn,
        setTimeOut,
        keyPress,
        setKeyPress,
        isTimeInSelected,
        setIsTimeInSelected,
        isTimeOutSelected,
        setIsTimeOutSelected,
        isLoopSelectionEnabled,
        setIsLoopSelectionEnabled,
        isTimeInAndTimeOutSelectionEnabled,
        setIsTimeInAndTimeOutSelectionEnabled,
        selectionWidth,
        setSelectionWidth
      }}
    >
      {children}
      {isTimedAsset && <CommentsPlayerStateBridge />}
      {isInsideRoom && <CommentsLiveblocksBridge fileId={fileId} />}
    </CommentsContext.Provider>
  );
}

export const useComments = () => {
  return useContext(CommentsContext);
};

const CommentsPlayerStateBridge = () => {
  // handles the side effects that affect playerState based on comments context

  const {
    player,
    playerState: { timeSelection, setTimeSelection, setTimeSelectionPreview, setIsLoopingEnabled }
  } = usePlayerContext();
  const { selectedComment } = useReviewStore();
  const { setIsTimeInAndTimeOutSelectionEnabled } = useComments();

  const remote = useMediaRemote(player);
  const { setIsMarkersVisible } = useSearchActionsStore();

  useEffect(() => {
    if (timeSelection) {
      setIsTimeInAndTimeOutSelectionEnabled(true);
    } else {
      setIsTimeInAndTimeOutSelectionEnabled(false);
    }
    // if (!timeSelection) {
    //   console.log('A');
    //   setIsMarkersVisible(false);
    //   setIsTimeInAndTimeOutSelectionEnabled(false);
    // } else {
    //   setIsTimeInAndTimeOutSelectionEnabled(true);
    // }
  }, [timeSelection, setIsTimeInAndTimeOutSelectionEnabled]);

  useEffect(() => {
    if (selectedComment) {
      if (selectedComment?.in_time !== null) {
        if (selectedComment?.out_time !== null) {
          setTimeSelectionPreview({
            startTime: selectedComment.in_time ?? 0,
            endTime: selectedComment.out_time ?? 0
          });
          setIsLoopingEnabled(true);
        }
        remote.seek(selectedComment.in_time ?? 0);
      }
      // clear any ongoing selection
      setTimeSelection(null);

      setIsMarkersVisible(false);
    } else {
      setTimeSelectionPreview(null);
      setIsLoopingEnabled(false);
    }
  }, [
    selectedComment,
    remote,
    setTimeSelectionPreview,
    setIsLoopingEnabled,
    setTimeSelection,
    setIsMarkersVisible
  ]);

  return <></>;
};

const CommentsLiveblocksBridge = (props: { fileId: string }) => {
  const queryClient = useQueryClient();

  useEventListener(({ event }) => {
    if (event.type === 'COMMENTS_UPDATED') {
      queryClient.invalidateQueries({
        queryKey: reviewCommentsQueryKey({
          file_id: props.fileId
        })
      });
    }
  });

  return null;
};
