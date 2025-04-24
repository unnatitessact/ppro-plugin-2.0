import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { ArrowRight } from "@tessact/icons";

import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { ModalBody, ModalFooter } from "../../components/ui/Modal";
import { TextArea } from "../../components/ui/TextArea";

import { SecurityGroupCreationFormSchema } from "../../schema/library/security-groups";

interface SecurityGroupCreationFormProps {
  setStep: (step: number) => void;
  form: UseFormReturn<z.infer<typeof SecurityGroupCreationFormSchema>>;
}

const SecurityGroupCreationForm = ({
  setStep,
  form,
}: SecurityGroupCreationFormProps) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = form;

  const values = watch();

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={handleSubmit(
        (values) => {
          console.log(values);
          setStep(2);
        },
        (values) => {
          console.log({ error: values });
        }
      )}
    >
      <ModalBody>
        <Input
          {...register("name")}
          label="Name"
          placeholder="Enter the group name"
          isInvalid={!!errors.name}
          errorMessage={errors.name?.message}
        />
        <TextArea
          {...register("description")}
          maxLength={150}
          label={
            <div className="flex items-center justify-between">
              <p className="text-base font-medium">Description</p>
              <p className="text-base font-medium text-default-400">
                {values.description?.length || 0}/150
              </p>
            </div>
          }
          isInvalid={!!errors.description}
          errorMessage={errors.description?.message}
          size="lg"
          placeholder="Write more about this group"
        />
      </ModalBody>
      <ModalFooter>
        <div className="flex w-full items-center justify-between">
          <p className="text-sm font-medium text-default-400">Step 1 of 2</p>
          <Button
            variant="solid"
            color="primary"
            type="submit"
            endContent={<ArrowRight size={20} />}
            aria-label="Add members"
          >
            Add members
          </Button>
        </div>
      </ModalFooter>
    </form>
  );
};

export default SecurityGroupCreationForm;
