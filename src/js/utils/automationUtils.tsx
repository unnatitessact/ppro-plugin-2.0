import { ActionCode, TriggerCode } from "../api-integration/types/automations";

const triggerToActionMap: Record<TriggerCode, ActionCode[]> = {
  on_file_creation: [
    "create_new_project",
    "add_to_project",
    "apply_metadata_template",
  ],
  on_folder_creation: [
    "create_new_project",
    "add_to_project",
    "apply_metadata_template",
  ],
  on_file_version_creation: [
    "create_new_project",
    "add_to_project",
    "reset_task_status_to_default",
    "apply_metadata_template",
  ],
  on_file_status_change: [
    "create_new_project",
    "add_to_project",
    "move_file_to_folder",
  ],
};

export { triggerToActionMap };
