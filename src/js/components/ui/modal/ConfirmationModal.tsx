import { useEffect, useRef, useState } from 'react';

import { cn, Modal, ModalBody, ModalContent, ModalFooter } from '@nextui-org/react';

import { Input } from '@/components/ui/Input';

interface ConfirmationModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  title: string;
  subtitle: string;
  confirmText?: string;
  confirmButtonColor?: 'danger' | 'info';
  // confirmButtonColor?: 'danger' | 'default' | 'primary' | 'secondary' | 'success' | 'warning';
  confirmField?: string;
  confirmAction: () => void;
  isLoading?: boolean;
}

const buttonClass =
  'w-full border-t border-ds-alert-border p-4 text-base font-medium transition-colors duration-300 ease-in-out';

const ConfirmationModal = ({
  isOpen,
  onOpenChange,
  title,
  subtitle,
  confirmText = 'Confirm',
  confirmButtonColor = 'danger',
  confirmField,
  confirmAction
  // isLoading
}: ConfirmationModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [confirmInput, setConfirmInput] = useState('');
  const [error, setError] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmField) {
      if (confirmField === confirmInput) {
        try {
          confirmAction();
        } catch (error) {
          console.log(error);
        }
      } else {
        setError('Confirmation input does not match.');
      }
    } else {
      confirmAction();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      // reset state when modal closes
      setConfirmInput('');
      setError('');
    } else {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <Modal
      className="border border-ds-alert-border shadow-none"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      hideCloseButton={true}
      radius="lg"
      classNames={{
        wrapper: 'z-[600]',
        body: 'z-[600]'
      }}
    >
      <form onSubmit={onSubmit}>
        <ModalContent className="max-w-[340px] border">
          <ModalBody className="flex flex-col items-center justify-center gap-4 p-6 text-center">
            <span className="text-xl font-medium text-ds-alert-title">{title}</span>
            <p className="text-base text-ds-alert-caption">{subtitle}</p>
            {confirmField && (
              <Input
                autoFocus
                ref={inputRef}
                placeholder={`Type "${confirmField}" to confirm`}
                value={confirmInput}
                onValueChange={(value) => {
                  setConfirmInput(value);
                  setError('');
                }}
                isInvalid={!!error}
                errorMessage={error}
              />
            )}
          </ModalBody>

          <ModalFooter className="flex w-full gap-0 p-0">
            <button
              type="button"
              onClick={onOpenChange}
              aria-label="Cancel"
              className={cn(
                buttonClass,
                'border-r text-ds-alert-button-default-text hover:bg-ds-alert-button-default-bg-hover'
              )}
            >
              Cancel
            </button>
            <button
              type="submit"
              aria-label="Confirm"
              className={cn(
                buttonClass,
                confirmButtonColor === 'info'
                  ? 'text-ds-alert-button-primary-text hover:bg-ds-alert-button-primary-bg-hover'
                  : 'text-ds-alert-button-error-text hover:bg-ds-alert-button-error-bg-hover'
              )}
            >
              {confirmText}
            </button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default ConfirmationModal;
