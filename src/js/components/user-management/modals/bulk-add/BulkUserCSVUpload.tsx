import { useCallback, useRef } from 'react';

import { cn } from '@nextui-org/react';
import { useDropzone } from 'react-dropzone';

import { Button } from '@/components/ui/Button';

interface BulkUserCSVUploadProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  csvFileInputRef: React.RefObject<HTMLInputElement>;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDrop: (acceptedFiles: File[]) => void;
}

const BulkUserCSVUpload = ({
  csvFileInputRef,
  handleChange,
  handleDrop
}: BulkUserCSVUploadProps) => {
  const linkRef = useRef<HTMLAnchorElement>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      handleDrop(acceptedFiles);
    },
    [handleDrop]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
      <span className="text-base font-normal text-default-500">
        Create Tessact users by uploading a CSV file, we&apos;ll handle the rest for you.
      </span>
      <form
        className={cn(
          'flex w-full  items-center justify-center rounded-xl border border-dashed border-default-500 py-[120px] transition',
          isDragActive ? 'cursor-grab bg-default-200' : 'cursor-pointer bg-default-100'
        )}
        onSubmit={(e) => e.preventDefault()}
        {...getRootProps()}
      >
        <input
          ref={csvFileInputRef}
          id="bulk-add"
          hidden
          accept=".csv,text/csv"
          type="file"
          onChange={handleChange}
          {...getInputProps()}
        />
        {isDragActive ? (
          <div className="flex h-10 items-center justify-center text-center text-sm text-default-800">
            Drop the CSV file here!
          </div>
        ) : (
          <div className="flex min-h-10 items-center justify-center rounded-lg  bg-ds-button-secondary-bg px-4 text-sm font-medium hover:bg-ds-button-secondary-bg-hover">
            Upload CSV
          </div>
        )}
      </form>
      <div className="grid grid-cols-[auto,auto] justify-between gap-1">
        <span className="text-base font-normal text-default-500">
          If you don&apos;t have the CSV template, download it from here
        </span>
        <Button
          size="sm"
          color="secondary"
          radius="sm"
          onPress={() => linkRef?.current?.click()}
          aria-label="Download CSV template"
        >
          Download CSV template
        </Button>
        <a
          href="https://trigger-uploaded-files-new.s3.ap-south-1.amazonaws.com/bulk_add_users.csv"
          download
          hidden
          ref={linkRef}
        />
      </div>
    </>
  );
};

export default BulkUserCSVUpload;
