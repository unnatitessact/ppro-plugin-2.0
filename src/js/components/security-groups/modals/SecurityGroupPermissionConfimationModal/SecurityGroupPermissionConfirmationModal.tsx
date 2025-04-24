import { useState } from "react";

// import { useParams } from 'next/navigation';

import { useQueryClient } from "@tanstack/react-query";
import pluralize from "pluralize";

import { Button } from "../../../../components/ui/Button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "../../../../components/ui/Modal";

import { DynamicSelectedAssets } from "./DynamicSelectedAssets";

import { useAssignPermissionsToSecurityGroup } from "../../../../api-integration/mutations/security-groups";

import { useSecurityGroupStore } from "../../../../stores/security-store";

import { PermissionPayload } from "../../files-folders/PermissionDropdown";
import { useParamsStateStore } from "../../../../stores/params-state-store";

interface SecurityGroupPermissionConfimationProps {
  isOpen: boolean;
  onOpenChange: () => void;
  selectedItems: {
    id: string;
    children_count: number;
    resourcetype: string;
  }[];
  selectedPermissions: {
    title: string;
    permissions: PermissionPayload[];
  };
}

export const SecurityGroupPermissionConfimation = ({
  isOpen,
  onOpenChange,
  selectedItems,
  selectedPermissions,
}: SecurityGroupPermissionConfimationProps) => {
  const queryClient = useQueryClient();

  // const params = useParams();
  const { groupId } = useParamsStateStore();
  const { selectedWorkspace } = useSecurityGroupStore();
  const [isRecursive, setIsRecursive] = useState(false);

  const { mutateAsync: assignPermissionsToSecurityGroup, isPending } =
    useAssignPermissionsToSecurityGroup({
      securityId: groupId as string,
      workspaceId: selectedWorkspace as string,
    });

  return (
    <Modal
      size="sm"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={() => {}}
    >
      <ModalContent className="flex flex-col gap-8 p-8">
        <ModalHeader className="m-0">
          <span className="w-[90%] text-2xl font-bold">{`Changing access for ${
            selectedItems?.length
          } ${pluralize("item", selectedItems?.length)} to ${
            selectedPermissions?.title || "No access"
          } ?`}</span>
        </ModalHeader>
        <ModalBody>
          <DynamicSelectedAssets
            selectedItems={selectedItems}
            isRecursive={isRecursive}
            setIsRecursive={setIsRecursive}
          />
        </ModalBody>
        <ModalFooter className="m-0">
          <Button
            color="primary"
            isLoading={isPending}
            aria-label="Update access"
            onPress={() => {
              assignPermissionsToSecurityGroup(
                {
                  assets: selectedItems.map((item) => item.id) as string[],
                  permissions: selectedPermissions?.permissions ?? [],
                  is_recursive: isRecursive,
                },
                {
                  onSuccess: () => {
                    setIsRecursive(false);
                    onOpenChange();
                    queryClient.invalidateQueries({
                      queryKey: [
                        "libraryTree",
                        "group",
                        groupId,
                        "workspace",
                        selectedWorkspace,
                      ],
                    });
                  },
                }
              );
            }}
            className="w-full"
          >
            Yes, update access
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
