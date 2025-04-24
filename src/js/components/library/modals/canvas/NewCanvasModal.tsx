"use client";

import { useParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ShapesPlusXSquareCircleFilled } from "@tessact/icons";

import { Button } from "../../../ui/Button";
import { Input } from "../../../ui/Input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "../../../ui/Modal";

import { useCreateCanvas } from "../../../../api-integration/mutations/library";

import { CreateCanvasSchema } from "../../../../schemas/library/canvas";

interface NewCanvasModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewCanvasModal = ({
  isOpen,
  onOpenChange,
}: NewCanvasModalProps) => {
  const { folderId: parentId } = useParams() as { folderId: string };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof CreateCanvasSchema>>({
    resolver: zodResolver(CreateCanvasSchema),
  });

  const { mutateAsync, isPending } = useCreateCanvas(parentId || null);

  const createCanvas = async (canvasName: string) => {
    try {
      await mutateAsync(
        { name: canvasName, category: "library" },
        {
          onSuccess: () => {
            onOpenChange(false);
            reset();
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal isOpen={isOpen} size="sm" onOpenChange={onOpenChange}>
      <ModalContent
        as="form"
        onSubmit={handleSubmit(async (data) => await createCanvas(data.name))}
      >
        <ModalHeader
          title="New canvas"
          description="Canvases provide you an infinite canvas to plan and collaborate with your team."
        />
        <ModalBody className="flex min-h-80 flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-20 w-20 items-center justify-center">
              <ShapesPlusXSquareCircleFilled
                size={30}
                className="text-ds-text-secondary"
              />
            </div>
            <Input
              placeholder="Canvas name"
              size="lg"
              autoFocus
              {...register("name")}
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
            />
          </div>
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
      </ModalContent>
    </Modal>
  );
};
