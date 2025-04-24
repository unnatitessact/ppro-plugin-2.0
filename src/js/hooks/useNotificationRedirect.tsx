// import { useRouter } from 'next/navigation';

import { toast } from "sonner";

import { ToastError } from "../components/ui/ToastContent";

import { useWorkspace } from "./useWorkspace";

import { useMarkNotificationAsRead } from "../api-integration/mutations/notification";
import { NotificationRoomEventData } from "../api-integration/types/notifications";

import { useSearchActionsStore } from "../stores/search-actions-store";

import { getNotificationItemHref } from "../utils/notificationUtils";

export const useNotificationRedirect = () => {
  const { setSelectedPanelTab } = useSearchActionsStore();
  // const router = useRouter();

  const { workspaces, workspace, setWorkspaceId } = useWorkspace();

  const { mutate: markAsRead } = useMarkNotificationAsRead();

  const handleRedirect = (
    notification: NotificationRoomEventData,
    callbackFn?: () => void
  ) => {
    // if the notification is from a different workspace, switch to that workspace
    if (notification?.metadata?.workspace_id !== workspace?.id) {
      const newWorkspace = workspaces.find(
        (w) => w.id === notification?.metadata?.workspace_id
      );
      if (newWorkspace) {
        setWorkspaceId(newWorkspace?.id);
      } else {
        toast(
          <ToastError
            title={"Incorrect workspace"}
            description={`You are not part of ${notification?.metadata?.workspace_name} workspace`}
          />
        );
      }
    }

    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    if (notification.event.toLowerCase().includes("metadata")) {
      setSelectedPanelTab("metadata");
    }
    const href = getNotificationItemHref(notification);
    console.log(href, notification);
    if (href) {
      alert("href not found");
      // router.push(href);
    }

    callbackFn?.();
  };

  return { handleRedirect };
};
