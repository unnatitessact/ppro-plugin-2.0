import { useEffect, useRef, useState } from 'react';

import { useParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { cn, Spinner } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { ChevronRightSmall, Folder1Filled, FolderLink } from '@tessact/icons';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/Modal';
import { ScrollShadow } from '@/components/ui/ScrollShadow';
import { Select, SelectItem } from '@/components/ui/Select';

import { useConnectExternalFolder } from '@/api-integration/mutations/library';
import {
  useConnectionsQuery,
  useListFoldersOfConnectionQuery
} from '@/api-integration/queries/library';

import { CreateConnectedFolderSchema } from '@/schemas/library/folders';

interface NewConnectedFolderModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  backdrop?: 'transparent' | 'opaque' | 'blur' | undefined;
}

export const NewConnectedFolderModal = ({
  isOpen,
  onOpenChange,
  backdrop
}: NewConnectedFolderModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<z.infer<typeof CreateConnectedFolderSchema>>({
    resolver: zodResolver(CreateConnectedFolderSchema),
    defaultValues: {
      name: ''
    }
  });

  const { folderId } = useParams() as { folderId: string | null };

  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  const { mutateAsync: createConnectedFolder, isPending } = useConnectExternalFolder(
    selectedConnection || '',
    folderId
  );

  const onSubmit = async ({ name }: { name: string }) => {
    if (selectedFolder) {
      await createConnectedFolder(
        { prefix: selectedFolder, name },
        {
          onSuccess: () => {
            onOpenChange(false);
            reset();
            setSelectedConnection(null);
            setSelectedFolder(null);
          }
        }
      );
    }
  };

  const { data: connections } = useConnectionsQuery();
  const { data: folders, isLoading: isFetchingFolders } = useListFoldersOfConnectionQuery(
    selectedConnection || '',
    null
  );

  useEffect(() => {
    if (selectedConnection) {
      setSelectedFolder(null);
    }
  }, [selectedConnection]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop={backdrop}>
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader
          title="New connected folder"
          description="Connected folders let you access external storage directly as a folder in Tessact."
        />
        <ModalBody className="flex min-h-80 flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-20 w-20 items-center justify-center">
              <FolderLink size={30} className="text-ds-text-secondary" />
            </div>
            <Input
              placeholder="Folder name"
              size="lg"
              autoFocus
              {...register('name')}
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
            />
          </div>

          <Select
            value={selectedConnection ? [selectedConnection] : []}
            onChange={(e) => setSelectedConnection(e.target.value)}
            label="Connection"
            placeholder="Select connection"
            size="lg"
            required
          >
            {connections?.map((connection) => (
              <SelectItem key={connection.id}>{connection.name}</SelectItem>
            ))}
          </Select>

          {selectedConnection ? (
            isFetchingFolders ? (
              <div className="flex items-center gap-2">
                <Spinner size="sm" />
                <span>Fetching folders...</span>
              </div>
            ) : (
              <ScrollShadow className="max-h-64">
                {folders?.map((folder: string) => (
                  <ConnectedFolderNode
                    key={folder}
                    folderName={folder}
                    selectedConnection={selectedConnection}
                    selectedFolder={selectedFolder}
                    setSelectedFolder={setSelectedFolder}
                    isOnRoot={true}
                  />
                ))}
              </ScrollShadow>
            )
          ) : null}
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            type="submit"
            isLoading={isPending}
            isDisabled={!selectedConnection || !selectedFolder}
            aria-label="Create"
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const ConnectedFolderNode = ({
  folderName,
  selectedConnection,
  selectedFolder,
  setSelectedFolder,
  isOnRoot
}: {
  folderName: string;
  selectedConnection: string | null;
  selectedFolder: string | null;
  setSelectedFolder: (folder: string | null) => void;
  isOnRoot: boolean;
}) => {
  const isActive = selectedFolder === folderName;

  const [isExpanded, setIsExpanded] = useState(false);

  const { data: children, isLoading } = useListFoldersOfConnectionQuery(
    selectedConnection || '',
    folderName
  );

  const heightRef = useRef<HTMLDivElement>(null);

  const height = heightRef.current?.clientHeight || 0;

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex">
      <div className="h-4 w-4 flex-shrink-0">
        <ChevronRightSmall
          size={16}
          className={cn(
            'mt-2 cursor-pointer text-ds-text-secondary transition',
            isExpanded && 'rotate-90'
          )}
          onClick={() => setIsExpanded(!isExpanded)}
        />
      </div>
      <div className="relative flex w-full flex-col">
        {!isOnRoot && (
          <div className="absolute -left-6 top-1 -z-10 h-3 w-2 rounded-bl-md border-b border-l border-ds-link-tree-lines" />
        )}

        <motion.div
          className={cn('relative flex cursor-pointer items-center gap-2 rounded-xl px-1.5 py-2')}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setSelectedFolder(folderName)}
        >
          <span className="flex-shrink-0">
            <Folder1Filled size={20} className="text-ds-text-secondary" />
          </span>
          <p className={cn('overflow-hidden truncate text-sm')}>{folderName}</p>
          {isHovered && (
            <motion.div
              layout
              transition={{ duration: 0.2 }}
              layoutId="tree-hover-indicator"
              className="absolute inset-0 -z-20 h-9 w-full rounded-xl bg-ds-link-bg-hover"
            ></motion.div>
          )}
          {isActive && (
            <motion.div
              layout
              transition={{ duration: 0.2 }}
              layoutId="tree-active-indicator"
              className="absolute inset-0 -z-10 h-9 w-full rounded-xl bg-ds-link-bg-selected"
            ></motion.div>
          )}
        </motion.div>
        {isExpanded ? (
          isLoading ? (
            <></>
          ) : (
            <div className="relative flex flex-col" ref={heightRef}>
              <div
                style={{ height: `${height - 26}px` }}
                className="absolute -left-2 top-0 -z-10 w-0.5 border-l border-ds-link-tree-lines"
              />
              {children?.map((folder) => (
                <ConnectedFolderNode
                  key={folder}
                  folderName={folder}
                  selectedConnection={selectedConnection}
                  selectedFolder={selectedFolder}
                  setSelectedFolder={setSelectedFolder}
                  isOnRoot={false}
                />
              ))}
            </div>
          )
        ) : null}
      </div>
    </div>
  );
};
