'use client';

import { forwardRef } from 'react';

import {
  ModalFooter as NextModalFooter,
  ModalHeader as NextModalHeader,
  Modal as NextUIModal,
  ModalBody as NextUIModalBody,
  ModalContent as NextUIModalContent,
  ModalHeaderProps as NextUIModalHeaderProps,
  ModalProps as NextUIModalProps
} from '@nextui-org/modal';
import { cn, extendVariants } from '@nextui-org/react';

const CustomModal = forwardRef<HTMLDivElement, NextUIModalProps>((props, ref) => {
  return (
    <NextUIModal
      {...props}
      motionProps={{
        variants: {
          enter: {
            y: -16,
            opacity: 1,
            transition: { duration: 0.2, ease: 'easeOut' }
          },
          exit: {
            opacity: 0,
            transition: { duration: 0.2, ease: 'easeOut' }
          }
        }
      }}
      ref={ref}
      as="div"
    />
  );
});

CustomModal.displayName = 'Modal';

export const Modal = extendVariants(CustomModal, {
  defaultVariants: {
    variant: 'default'
  },
  variants: {
    variant: {
      default: {
        closeButton: 'top-4 right-4 rounded-lg',
        wrapper: 'z-[300]',
        base: 'bg-ds-modal-bg border border-ds-modal-border p-6 rounded-[20px]',
        backdrop: 'bg-overlay/85 blur-sm z-[299]',
        header: 'p-0 mb-6',
        body: 'p-0',
        footer: 'p-0 mt-6 '
      }
    },
    // I've increased the width by one level for each size temporarily.
    // TODO: Setup max width as per our DS for each sizes.
    size: {
      sm: {
        base: 'max-w-md '
      },
      md: {
        base: 'max-w-2xl'
      },
      lg: {
        base: 'max-w-4xl'
      }
    }
  }
});

interface ModalHeaderProps extends NextUIModalHeaderProps {
  title?: string;
  description?: string;
  subheading?: string;
}

export const ModalHeader = (props: ModalHeaderProps) => {
  return (
    <NextModalHeader {...props} className={cn('flex flex-col', props.className)} as="header">
      {props.title || props.description ? (
        <>
          {props.subheading && (
            <p className="text-base font-medium text-ds-text-secondary">{props.subheading}</p>
          )}
          {props.title && <h2 className="truncate text-2xl font-bold">{props.title}</h2>}
          {props.description && (
            <p className="pr-8 text-sm font-normal text-ds-text-secondary">{props.description}</p>
          )}
        </>
      ) : (
        <>{props.children}</>
      )}
    </NextModalHeader>
  );
};

export const ModalFooter = extendVariants(NextModalFooter, {});
export const ModalBody = extendVariants(NextUIModalBody, {});
export const ModalContent = extendVariants(NextUIModalContent, {});
