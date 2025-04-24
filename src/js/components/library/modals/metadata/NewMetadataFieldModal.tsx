'use client';

// import { z } from 'zod';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';

import { nanoid } from 'nanoid';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/Modal';
import { Select, SelectItem } from '@/components/ui/Select';

// import { AddMetadataFieldSchema } from '@/schemas/library/metadata';
import { MetadataFieldInfo, MetadataFieldType } from '@/api-integration/types/metadata';

import { fieldTypes } from '@/utils/metadata';

interface NewMetadataFieldModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  initialFieldName: string;
  onAdd: (field: MetadataFieldInfo) => Promise<void>;
  isLoading: boolean;
}

export const NewMetadataFieldModal = ({
  isOpen,
  onOpenChange,
  initialFieldName,
  onAdd,
  isLoading
}: NewMetadataFieldModalProps) => {
  const [fieldName, setFieldName] = useState(initialFieldName);
  const [fieldType, setFieldType] = useState('');

  useEffect(() => {
    setFieldName(initialFieldName);
  }, [initialFieldName]);

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<z.infer<typeof AddMetadataFieldSchema>>({
  //   resolver: zodResolver(AddMetadataFieldSchema),
  //   defaultValues: {
  //     label: initialFieldName,
  //   },
  // });

  const addMetadataField = async () => {
    await onAdd({
      id: nanoid(),
      name: fieldName,
      field_type: fieldType as MetadataFieldType,
      options: []
    });
    onOpenChange();
    setFieldName('');
    setFieldType('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={() => {
        setFieldName('');
        setFieldType('');
      }}
    >
      <ModalContent
        as="form"
        // onSubmit={handleSubmit((data) =>
        //   onAdd({
        //     key: nanoid(),
        //     label: data.label,
        //     type: data.type,
        //   })
        // )}
        onSubmit={(e) => {
          e.preventDefault();
          addMetadataField();
        }}
      >
        <ModalHeader
          title="New metadata field"
          description="Configure a new metadata field to add to your template"
        />
        <ModalBody className="flex min-h-80 flex-col gap-4">
          <Input
            label="Unique name"
            placeholder="Metadata field name"
            size="lg"
            // {...register('label')}
            // isInvalid={!!errors.label}
            // errorMessage={errors.label?.message}
            value={fieldName}
            onValueChange={setFieldName}
          />
          <Select
            size="lg"
            label="Type"
            placeholder="Select a type"
            // isInvalid={!!errors.type}
            // errorMessage={errors.type?.message}
            selectedKeys={fieldType ? [fieldType] : []}
            onChange={(e) => setFieldType(e.target.value)}
          >
            {fieldTypes.map((field) => (
              <SelectItem key={field.type} startContent={field.icon}>
                {field.label}
              </SelectItem>
            ))}
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            type="submit"
            isDisabled={fieldName === '' || fieldType === ''}
            isLoading={isLoading}
            aria-label="Add"
          >
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
