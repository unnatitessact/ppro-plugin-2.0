import { ModalBody, ModalFooter, ModalHeader } from '@nextui-org/react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

import { ArrowRight } from '@tessact/icons';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';

import { RolesModalSchema } from '@/schemas/user-management';

interface CreateRoleDetailsProps {
  type: string;
  step: number;
  setStep: (step: number) => void;
  form: UseFormReturn<z.infer<typeof RolesModalSchema>>;
  name?: string;
  description?: string;
  modalType: 'Create' | 'Edit';
}

const CreateRoleDetails = ({ type, step, setStep, form, modalType }: CreateRoleDetailsProps) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch
  } = form;

  const description = watch('description');

  return (
    <form
      className="flex flex-col gap-8"
      onSubmit={handleSubmit(() => {
        setStep(2);
      })}
    >
      <ModalHeader className="flex items-center justify-between p-0">
        <span className="text-2xl font-bold text-default-900">
          {modalType} {type} role
        </span>
      </ModalHeader>
      <ModalBody className="relative flex min-h-96 flex-auto gap-8 p-0">
        <Input
          label={
            <p>
              <span className="capitalize">{type}</span> role name
            </p>
          }
          placeholder="Enter role name"
          isInvalid={!!errors.roleName}
          errorMessage={errors.roleName?.message}
          {...register('roleName')}
        />
        <div className="relative col-span-12">
          <TextArea
            maxLength={150}
            label={
              <div className="flex items-center justify-between">
                <p className="text-base font-medium">Description</p>
                <p className="text-base font-medium text-default-400">
                  {description?.length || 0}/150
                </p>
              </div>
            }
            isInvalid={!!errors.description}
            errorMessage={errors.description?.message}
            size="lg"
            placeholder="Enter role description"
            {...register('description')}
          />
        </div>
      </ModalBody>
      <ModalFooter className="flex items-center justify-between gap-2 p-0">
        <span className="text-sm font-medium text-default-900">Step {step} of 2</span>
        <Button
          color="primary"
          type="submit"
          size="lg"
          endContent={<ArrowRight size={24} />}
          aria-label="Continue"
        >
          Continue
        </Button>
      </ModalFooter>
    </form>
  );
};

export default CreateRoleDetails;
