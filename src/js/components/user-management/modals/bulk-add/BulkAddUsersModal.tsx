import { ChangeEvent, useMemo, useRef, useState } from 'react';

import { ModalBody } from '@nextui-org/react';
import { AnimatePresence, motion } from 'framer-motion';

import { CirclePlus, CloudDownload, CrossLarge, SquareDotedBehindSquare } from '@tessact/icons';

import { Button } from '@/components/ui/Button';
import { Modal, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/Modal';

import BulkUserCSVUpload from '@/components/user-management/modals/bulk-add/BulkUserCSVUpload';
import UsersList from '@/components/user-management/modals/bulk-add/UsersList';

import {
  useAddMultipleUsersToOrganization,
  useBulkUploadUsers,
  useDownloadInvalidUsers
} from '@/api-integration/mutations/user-management';
import { BulkUsers, CSVParsedUsersInvalidUser } from '@/api-integration/types/user-management';

interface BulkAddUsersModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const BulkAddUsersModal = ({ isOpen, setIsOpen }: BulkAddUsersModalProps) => {
  const csvFileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File | null>(null);
  const [csvFile, setCsvFile] = useState<BulkUsers[]>([]);
  const [invalidUsers, setInvalidUsers] = useState<CSVParsedUsersInvalidUser[]>([]);
  const { mutateAsync: uploadBulkUsers, isPending } = useBulkUploadUsers();
  const { mutateAsync: addUsersToOrganization, isPending: isAddUsersToOrganizationPending } =
    useAddMultipleUsersToOrganization();
  const { mutate: downloadInvalidUsers } = useDownloadInvalidUsers();

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFiles(event.target.files[0]);
      uploadBulkUsers(
        {
          csv_file: event.target.files[0]
        },
        {
          onSuccess: (data) => {
            setCsvFile(data?.valid_users.map((user) => ({ ...user, role_ids: [] })));
            setInvalidUsers(data?.invalid_users);
          }
        }
      );
    }
  };

  const handleDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFiles(acceptedFiles[0]);
      uploadBulkUsers(
        {
          csv_file: acceptedFiles[0]
        },
        {
          onSuccess: (data) => {
            setCsvFile(data?.valid_users.map((user) => ({ ...user, role_ids: [] })));
            setInvalidUsers(data?.invalid_users);
          }
        }
      );
    }
  };

  const clearState = () => {
    setCsvFile([]);
    setInvalidUsers([]);
    setFiles(null);
  };

  const invalidUsersMessage = useMemo(() => {
    const hasDuplication = invalidUsers?.some((user) => user.error_code === 'DUPLICATE_ENTRY');
    const hasInvalidEntry = invalidUsers?.some((user) => user.error_code === 'INVALID_ENTRY');
    const prefix =
      hasDuplication && hasInvalidEntry
        ? 'Error or duplication in user details.'
        : hasDuplication
          ? 'Duplication in user details.'
          : 'Error in user details.';
    return `${prefix} Download CSV of the ${invalidUsers?.length} user${invalidUsers.length > 1 ? 's' : ''}, and re-upload the corrected version.`;
  }, [invalidUsers]);

  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen} size={files ? 'md' : 'xl'} onClose={clearState}>
      <ModalContent className="flex flex-col gap-8 p-8">
        <ModalHeader className="mb-0 flex items-center justify-between p-0">
          <span className="text-2xl font-bold text-default-900">Bulk Add</span>
        </ModalHeader>
        <ModalBody className="flex flex-col overflow-hidden p-0">
          {!isPending && !files && (
            <BulkUserCSVUpload
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              csvFileInputRef={csvFileInputRef}
              handleChange={handleChange}
              handleDrop={handleDrop}
            />
          )}
          <AnimatePresence>
            {invalidUsers?.length > 0 && (
              <motion.div
                key="motion-card"
                layout="position"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                // exit={{ opacity: 0, height: 0 }}
                transition={{ ease: 'easeInOut', duration: 0.2 }}
              >
                <div className="flex flex-col gap-2 rounded-xl border border-ds-combination-red-subtle-border bg-ds-combination-red-subtle-bg p-4 text-ds-combination-red-subtle-text ">
                  <div className="align-start flex justify-between gap-4">
                    <div className="flex flex-col">
                      <p className="font-medium">
                        Could not add {invalidUsers?.length} user
                        {invalidUsers.length > 1 ? 's' : ''} to Tessact!
                      </p>
                      <p>{invalidUsersMessage}</p>
                    </div>
                    <Button
                      isIconOnly
                      onPress={() => {
                        setInvalidUsers([]);
                        if (csvFile?.length === 0) {
                          setFiles(null);
                        }
                      }}
                      variant="light"
                      aria-label="Clear invalid users"
                      // className="text-ds-combination-red-subtle-text data-[hover=true]:bg-transparent"
                    >
                      <CrossLarge size={20} />
                    </Button>
                  </div>
                  <div className="flex justify-start">
                    <Button
                      size="sm"
                      variant="light"
                      className="text-ds-combination-red-subtle-text data-[hover=true]:bg-transparent"
                      startContent={<CloudDownload size={20} />}
                      onPress={() => downloadInvalidUsers(invalidUsers)}
                      aria-label="Download invalid users CSV"
                    >
                      Download Invalid Users CSV
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
            {csvFile?.length > 0 && <UsersList list={csvFile} setList={setCsvFile} />}
          </AnimatePresence>
        </ModalBody>
        <ModalFooter className="flex gap-2 p-0">
          {!isPending && files && (
            <Button
              color="secondary"
              radius="sm"
              className="w-full"
              size="lg"
              onPress={() => {
                clearState();
              }}
              startContent={<SquareDotedBehindSquare size={20} />}
              aria-label="Replace CSV file"
            >
              Replace CSV file
            </Button>
          )}
          <Button
            color="primary"
            radius="sm"
            className={files ? 'w-full' : 'w-auto'}
            size={!files ? 'md' : 'lg'}
            aria-label="Add users"
            type="submit"
            isDisabled={!files || csvFile.length === 0}
            isLoading={isAddUsersToOrganizationPending}
            startContent={<CirclePlus size={20} />}
            onPress={() =>
              addUsersToOrganization(
                {
                  user_data: csvFile
                },
                {
                  onSuccess: () => {
                    setIsOpen(false);
                  }
                }
              )
            }
          >
            Add users
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BulkAddUsersModal;
