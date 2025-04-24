// import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
// import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { ToastSuccess } from "../components/ui/ToastContent";

import { useAutomationConfigs } from "../api-integration/queries/automations";
import {
  AutomationConfig,
  TriggerCode,
} from "../api-integration/types/automations";

// Show a toast that an action ran when a trigger has an automation linked
export const useActionsToasts = () => {
  // const { folderId } = useParams() as { folderId?: string };

  const { data: configs } = useAutomationConfigs(Infinity);

  // const router = useRouter();

  const showToast = (
    trigger_code: TriggerCode,
    folderId: string | null = null
  ) => {
    // ON FILE CREATION
    const actions =
      configs?.filter(
        (config) =>
          config.trigger_code === trigger_code && config.item_id === folderId
      ) ?? [];
    actions.map((action) => getActionToasts(action));
  };

  return { showToast };
};

const getActionToasts = async (
  action: AutomationConfig
  // router: AppRouterInstance
) => {
  if (action.action_code === "add_to_project") {
    toast(
      <ToastSuccess
        title={`File added to project ${action.project}`}
        description="Add to project action completed"
      />
    );
  } else if (action.action_code === "create_new_project") {
    toast(
      <ToastSuccess
        title={`Created project ${
          action?.workflow ? `with ${action.workflow} workflow` : ``
        }`}
        description="Create project action completed"
      />
    );
  } else if (action.action_code === "move_file_to_folder") {
    toast(
      <ToastSuccess
        title={`
            Moved file to
            ${action.destination_folder?.name}
            folder
          `}
        description="Click to view the folder"
        // onClick={() =>
        //   // router.push(`/library/folder/${action?.destination_folder?.id}`)
        // }
      />
    );
  } else if (action.action_code === "reset_task_status_to_default") {
    toast(
      <ToastSuccess
        title={`Reset task statuses in ${action.workflow}`}
        description="Reset status action completed"
      />
    );
  }
  // sleep for 0.2 seconds to show the toast one by one
  await new Promise((resolve) => setTimeout(resolve, 200));
};
