"use client";

// import { useState } from 'react';
import { useCallback } from "react";

import { useParams } from "react-router-dom";

// import { useParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
// import { Switch } from '@nextui-org/react';
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Folder1Filled } from "@tessact/icons";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/Modal";

// import { Select, SelectItem } from '@/components/ui/Select';

import { useCreateFolder } from "@/api-integration/mutations/library";

import { CreateFolderSchema } from "@/schema/library/folders";

interface NewFolderModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isDrawer?: boolean;
}

export const NewFolderModal = ({
  isOpen,
  onOpenChange,
}: NewFolderModalProps) => {
  const { folderId: parentId } = useParams() as { folderId: string };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof CreateFolderSchema>>({
    resolver: zodResolver(CreateFolderSchema),
  });

  const { mutateAsync, isPending } = useCreateFolder(parentId || null);

  const createFolder = useCallback(
    async (folderName: string) => {
      try {
        await mutateAsync(
          { name: folderName },
          {
            onSuccess: () => {
              reset();
            },
          }
        );
        onOpenChange(false);
      } catch (error) {
        console.error(error);
      }
    },
    [mutateAsync, onOpenChange, reset]
  );

  // if (isDrawer) {
  //   return content;
  // }

  return (
    <Modal isOpen={isOpen} size="sm" onOpenChange={onOpenChange}>
      <ModalContent
      // as="form"
      // onSubmit={handleSubmit(async (data) => await createFolder(data.name))}
      >
        <form
          onSubmit={handleSubmit(async (data) => await createFolder(data.name))}
        >
          <ModalHeader
            title="New folder"
            description="Folders can store metadata and act as titles, while helping you manage your assets."
          />
          <ModalBody className="flex min-h-80 flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-20 w-20 items-center justify-center">
                <Folder1Filled size={30} className="text-ds-text-secondary" />
              </div>
              <Input
                placeholder="Folder name"
                size="lg"
                autoFocus
                {...register("name")}
                isInvalid={!!errors.name}
                errorMessage={errors.name?.message}
              />
            </div>
            {/* <div className="flex w-full items-center justify-between gap-5 p-3">
            <span>Apply metadata template</span>
            <Switch
              size="sm"
              classNames={{
                wrapper: 'bg-ds-button-secondary-bg-hover'
              }}
              isSelected={applyMetadataTemplate}
              onValueChange={setApplyMetadataTemplate}
            />
          </div> */}
            {/* {applyMetadataTemplate && (
            <Select placeholder="Select metadata template" size="lg">
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </Select>
          )} */}
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              type="submit"
              isLoading={isPending}
              aria-label="Create"
            >
              Create
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
