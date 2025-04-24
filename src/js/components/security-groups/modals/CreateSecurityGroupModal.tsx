import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ArrowLeft } from "@tessact/icons";

import { Button } from "../../../components/ui/Button";
import { Modal, ModalContent, ModalHeader } from "../../../components/ui/Modal";

import AddMembersToSecurityGroupCreation from "../../../components/security-groups/AddMembersToSecurityGroupCreation";
import SecurityGroupCreationForm from "../../../components/security-groups/SecurityGroupCreationForm";

import { SecurityGroupCreationFormSchema } from "../../../schema/library/security-groups";

interface CreateSecurityGroupProps {
  isOpen: boolean;
  onOpen: (isOpen: boolean) => void;
  onOpenChange: () => void;
}

export const CreateSecurityGroupModal = ({
  isOpen,
  onOpenChange,
}: CreateSecurityGroupProps) => {
  const [step, setStep] = useState(1);

  const form = useForm<z.infer<typeof SecurityGroupCreationFormSchema>>({
    resolver: zodResolver(SecurityGroupCreationFormSchema),
  });

  return (
    <Modal
      isOpen={isOpen}
      size="sm"
      onOpenChange={onOpenChange}
      onClose={() => {
        setStep(1);
        form.reset();
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <div className="flex flex-col gap-2">
                {step === 1 ? (
                  <p className="text-2xl font-bold">
                    Creating a security group
                  </p>
                ) : (
                  <>
                    <Button
                      isIconOnly
                      onPress={() => setStep(1)}
                      variant="light"
                      aria-label="Go back"
                    >
                      <ArrowLeft size={20} />
                    </Button>
                    <h2 className="text-2xl font-bold">Adding members</h2>
                  </>
                )}
                <p className="font-regular text-base text-default-400">
                  Security groups enable you to give access to multiple files
                  and folders to a group of people
                </p>
              </div>
            </ModalHeader>

            {step === 1 ? (
              <SecurityGroupCreationForm setStep={setStep} form={form} />
            ) : (
              <AddMembersToSecurityGroupCreation
                name={form.getValues().name}
                description={form.getValues().description ?? ""}
                onClose={onClose}
              />
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
