import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Check } from "@tessact/icons";

import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "../../../components/ui/Modal";
import TextArea from "../../../components/ui/TextArea";

import { useOrganization } from "../../../hooks/useOrganization";

import { useEditSecurityGroup } from "../../../api-integration/mutations/security-groups";

import { SecurityGroupCreationFormSchema } from "../../../schema/library/security-groups";

interface EditSecurityGroupModalProps {
  isOpen: boolean;
  closeModal: () => void;
  id: string;
  name: string;
  description: string;
}

export const EditSecurityGroupModal = ({
  isOpen,
  closeModal,
  id,
  name,
  description,
}: EditSecurityGroupModalProps) => {
  const organization = useOrganization();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<z.infer<typeof SecurityGroupCreationFormSchema>>({
    resolver: zodResolver(SecurityGroupCreationFormSchema),
  });

  const { mutate, isPending } = useEditSecurityGroup(id, organization.id, () =>
    closeModal()
  );

  return (
    <Modal isOpen={isOpen} onOpenChange={closeModal}>
      <ModalContent
        as="form"
        onSubmit={(e) => {
          handleSubmit((values) =>
            mutate({
              title: values.name,
              description: values.description,
            })
          )(e);
        }}
      >
        <ModalHeader className="flex flex-col gap-2">
          <h2 className="truncate text-2xl font-bold">Editing {name}</h2>
          <p className="text-base font-normal text-ds-text-secondary">
            Security groups enable you to give access to multiple files and
            folders to a group of people
          </p>
        </ModalHeader>
        <ModalBody className="space-y-4">
          <Input
            {...register("name")}
            defaultValue={name}
            label="Name"
            placeholder="Enter group name"
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message}
          />
          <TextArea
            {...register("description")}
            defaultValue={description}
            label="Description"
            placeholder="Enter group description"
            isInvalid={!!errors.description}
            errorMessage={errors.description?.message}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="w-full"
            type="submit"
            startContent={<Check size={20} />}
            isLoading={isPending}
            aria-label="Save details"
          >
            Save details
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
