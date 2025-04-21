"use client";

import { useEffect, useRef, useState } from "react";

import {
  cn,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@nextui-org/react";

import { Input } from "../Input";

interface AlertModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string | React.ReactNode;
  description?: string;
  onConfirm: (value: string) => Promise<void> | void;
  actionText?: string;
  danger?: boolean;
  hasInput?: boolean;
  inputPlaceholder?: string;
  defaultValue?: string;
  defaultInputSelected?: boolean;
  warningMessage?: string;
  columnLayout?: boolean;
  primaryIcon?: React.ReactNode;
  shouldCloseOnInteractOutside?: ((element: Element) => boolean) | undefined;
  closeOnConfirm?: boolean;
  customOnClose?: () => void;
  disableActions?: boolean;
}

const buttonClass =
  "w-full border-t border-ds-alert-border p-4 text-base font-medium transition duration-200 ease-out outline-none";

export const AlertModal = ({
  isOpen,
  onOpenChange,
  title,
  description,
  onConfirm,
  hasInput,
  inputPlaceholder,
  actionText = "Confirm",
  danger = false,
  defaultValue,
  defaultInputSelected,
  warningMessage,
  columnLayout = false,
  primaryIcon,
  shouldCloseOnInteractOutside,
  closeOnConfirm = true,
  disableActions = false,
  customOnClose,
}: AlertModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(defaultValue || "");

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isOpen) {
      setInputValue(defaultValue || "");
      timeout = setTimeout(() => {
        inputRef.current?.focus();
        if (defaultInputSelected) {
          inputRef.current?.select();
        }
      }, 0);
    }
    return () => clearTimeout(timeout);
  }, [defaultValue, defaultInputSelected, isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      hideCloseButton
      className="border border-ds-alert-border"
      classNames={{
        base: "rounded-2xl bg-ds-alert-bg p-0",
        backdrop: "bg-overlay/85 blur-sm z-[305]",
        wrapper: "z-[310]",
      }}
      onClose={() => {
        setInputValue("");
        customOnClose?.();
      }}
      shouldCloseOnInteractOutside={shouldCloseOnInteractOutside}
    >
      <ModalContent
        className="flex max-w-xs flex-col gap-6"
        as="form"
        onSubmit={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsLoading(true);
          try {
            await onConfirm(inputValue);
            setInputValue("");
            if (closeOnConfirm) {
              onOpenChange(false);
            }
          } catch (error) {
            console.error(error);
          } finally {
            setIsLoading(false);
          }
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-3 pb-0 pt-6 text-center font-medium">
              <h3 className="min-w-0 text-xl text-ds-alert-title">{title}</h3>
              {primaryIcon ? (
                <div className="flex h-36 w-full items-center justify-center rounded-2xl bg-default-100">
                  {primaryIcon}
                </div>
              ) : null}
              <div className="flex flex-col gap-2">
                {description && (
                  <p
                    title={description}
                    className="line-clamp-6 min-w-0 text-base  text-ds-alert-caption"
                  >
                    {description}
                  </p>
                )}
                {warningMessage && (
                  <span className="text-xs text-ds-alert-button-error-text">
                    *{warningMessage}
                  </span>
                )}
              </div>
            </ModalHeader>
            {hasInput && (
              <ModalBody className="py-0">
                <Input
                  ref={inputRef}
                  placeholder={inputPlaceholder}
                  value={inputValue}
                  onValueChange={(value) => setInputValue(value)}
                  size="lg"
                  autoFocus
                />
              </ModalBody>
            )}

            <ModalFooter
              className={cn(
                "flex w-full gap-0 p-0",
                columnLayout && "flex-col-reverse"
              )}
            >
              <button
                disabled={isLoading || disableActions}
                type="button"
                aria-label="Cancel"
                className={cn(
                  buttonClass,
                  "border-r p-3 text-ds-alert-button-default-text hover:bg-ds-alert-button-default-bg-hover focus:bg-ds-alert-button-default-bg-hover",
                  columnLayout && "border-r-0"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
              >
                Cancel
              </button>
              <button
                disabled={isLoading || disableActions}
                type="submit"
                aria-label="Confirm"
                className={cn(
                  buttonClass,
                  "p-3",
                  !danger
                    ? "text-ds-alert-button-primary-text hover:bg-ds-alert-button-primary-bg-hover focus:bg-ds-alert-button-primary-bg-hover"
                    : "text-ds-alert-button-error-text hover:bg-ds-alert-button-error-bg-hover focus:bg-ds-alert-button-error-bg-hover"
                )}
              >
                <div className="flex h-5 w-full items-center justify-center">
                  {isLoading ? (
                    <Spinner color="current" size="sm" />
                  ) : (
                    actionText
                  )}
                </div>
              </button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
