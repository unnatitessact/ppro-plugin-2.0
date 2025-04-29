import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { CainLink3, EyeClosed, EyeOpen } from "@tessact/icons";

// import { Select, SelectItem } from '@/components/ui/Select';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/Modal";

import { useAddConnection } from "@/api-integration/mutations/library";

// import { CreateConnectionSchema } from '@/schemas/library/connections';

import { CreateConnectionSchema } from "@/schema/library/connections";
interface NewConnectionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const s3BucketRegions = [
  "us-east-2",
  "us-east-1",
  "us-west-1",
  "us-west-2",
  "af-south-1",
  "ap-east-1",
  "ap-south-2",
  "ap-southeast-3",
  "ap-southeast-4",
  "ap-south-1",
  "ap-northeast-3",
  "ap-northeast-2",
  "ap-southeast-1",
  "ap-southeast-2",
  "ap-northeast-1",
  "ca-central-1",
  "ca-west-1",
  "eu-central-1",
  "eu-west-1",
  "eu-west-2",
  "eu-south-1",
  "eu-west-3",
  "eu-south-2",
  "eu-north-1",
  "eu-central-2",
  "il-central-1",
  "me-south-1",
  "me-central-1",
  "sa-east-1",
];

export const NewConnectionModal = ({
  isOpen,
  onOpenChange,
}: NewConnectionModalProps) => {
  const { mutateAsync, isPending } = useAddConnection();

  const createConnection = async (
    data: z.infer<typeof CreateConnectionSchema>
  ) => {
    try {
      await mutateAsync(
        {
          name: data.name,
          // url: data.url,
          access_key: data.publicKey,
          secret_key: data.privateKey,
          bucket_name: data.bucket_name,
          region: data.region,
        },
        {
          onSuccess: () => {
            onOpenChange(false);
            reset();
          },
        }
      );
    } catch {
      toast.error("Failed to create connection", {
        description: "Please check your credentials and try again",
      });
    }
  };

  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
  } = useForm<z.infer<typeof CreateConnectionSchema>>({
    resolver: zodResolver(CreateConnectionSchema),
    defaultValues: {
      name: "",
      // url: '',
      publicKey: "",
      privateKey: "",
      bucket_name: "",
      region: "",
    },
  });

  const [showSecretKey, setShowSecretKey] = useState(false);

  return (
    <Modal isOpen={isOpen} size="sm" onOpenChange={onOpenChange}>
      <ModalContent
        as="form"
        onSubmit={handleSubmit((data) => createConnection(data))}
      >
        <ModalHeader
          className="flex flex-col"
          title="New Connection"
          description="Connect to your external storage sources"
        />
        <ModalBody className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-20 w-20 items-center justify-center">
              <CainLink3 size={30} className="text-ds-text-secondary" />
            </div>
            <Input
              placeholder="Connection name"
              size="lg"
              autoFocus
              {...register("name")}
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
            />
          </div>
          <Input
            placeholder="Enter S3 Bucket Name"
            label="S3 Bucket Name"
            size="lg"
            {...register("bucket_name")}
            isInvalid={!!errors.bucket_name}
            errorMessage={errors.bucket_name?.message}
          />

          <Autocomplete
            defaultItems={s3BucketRegions.map((region) => ({
              label: region,
              value: region,
            }))}
            label="Bucket Region"
            labelPlacement="outside"
            placeholder="Select bucket region"
            size="lg"
            {...register("region")}
            isInvalid={!!errors.region}
            errorMessage={errors.region?.message}
          >
            {(region) => (
              <AutocompleteItem key={region.value} value={region.value}>
                {region.label}
              </AutocompleteItem>
            )}
          </Autocomplete>

          <Input
            placeholder="Enter Public Key"
            label="Public Key"
            size="lg"
            {...register("publicKey")}
            isInvalid={!!errors.publicKey}
            errorMessage={errors.publicKey?.message}
            autoComplete="off"
          />
          <Input
            placeholder="Enter Private Key"
            label="Private Key"
            size="lg"
            {...register("privateKey")}
            type={showSecretKey ? "text" : "password"}
            isInvalid={!!errors.privateKey}
            errorMessage={errors.privateKey?.message}
            endContent={
              showSecretKey ? (
                <EyeOpen
                  size={20}
                  className="cursor-pointer"
                  onClick={() => setShowSecretKey(false)}
                />
              ) : (
                <EyeClosed
                  size={20}
                  className="cursor-pointer"
                  onClick={() => setShowSecretKey(true)}
                />
              )
            }
            autoComplete="off"
          />
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
