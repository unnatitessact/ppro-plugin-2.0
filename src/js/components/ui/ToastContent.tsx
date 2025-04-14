import { ReactNode } from 'react';

import { toast } from 'sonner';

import { CircleCheckFilled, CircleXFilled, TriangleExclamationFilled } from '@tessact/icons';

import { cn } from '@/components/tiptap/lib/utils';

type ToastStates = 'default' | 'success' | 'error' | 'process' | 'fallback';

interface ToastProps {
  title: ReactNode;
  description?: string;
  onClick?: () => void;
}

interface ToastContentProps extends ToastProps {
  state?: ToastStates;
}

export const showToast = (props: { state: ToastStates } & ToastProps) => {
  switch (props.state) {
    case 'fallback':
      toast.warning(<ToastContent {...props} />);
      break;
    case 'error':
      toast.error(<ToastContent {...props} />);
      break;
    default:
      toast(<ToastContent {...props} />);
  }
};

export const ToastSuccess = ({ title, description, onClick }: ToastProps) => (
  <ToastContent state="success" title={title} description={description} onClick={onClick} />
);
export const ToastError = ({ title, description, onClick }: ToastProps) => (
  <ToastContent state="error" title={title} description={description} onClick={onClick} />
);
export const ToastProcess = ({ title, description, onClick }: ToastProps) => (
  <ToastContent state="process" title={title} description={description} onClick={onClick} />
);
export const ToastFallback = ({ title, description, onClick }: ToastProps) => (
  <ToastContent state="fallback" title={title} description={description} onClick={onClick} />
);

export const ToastContent = ({
  state = 'default',
  title,
  description,
  onClick
}: ToastContentProps) => (
  <div
    className={cn(
      'flex gap-2',
      description ? 'items-start' : 'items-center',
      !!onClick && 'cursor-pointer'
    )}
    onClick={onClick}
  >
    <ToastIcon state={state} />
    <div className="flex w-full flex-col">
      <div
        title={typeof title === 'string' ? title : ''}
        className="line-clamp-2 h-full w-full text-sm font-medium text-ds-toast-title"
      >
        {title}
      </div>
      {description && (
        <div
          title={description}
          className="line-clamp-2 h-full w-full text-xs font-normal text-ds-toast-caption"
        >
          {description}
        </div>
      )}
    </div>
  </div>
);

export const ToastIcon = ({ state }: { state: ToastStates }) => {
  // Determines the icon to show for the toast state

  if (state === 'default') return null;

  return (
    <div className="flex h-6 w-6 items-center justify-center">
      {state === 'success' && (
        <CircleCheckFilled width={20} height={20} className="text-ds-toast-icon-success" />
      )}
      {state === 'error' && (
        <CircleXFilled width={20} height={20} className="text-ds-toast-icon-error" />
      )}
      {state === 'fallback' && (
        <TriangleExclamationFilled width={20} height={20} className="text-ds-toast-icon-warning" />
      )}
      {state === 'process' && (
        <div className="relative flex h-full w-full items-center justify-center">
          <Loader visible={true} />
        </div>
      )}
    </div>
  );
};
const bars = Array(12).fill(0);
export const Loader = ({ visible }: { visible: boolean }) => {
  return (
    <div className="relative left-1/2 top-1/2 z-10 m-0 h-5 w-5" data-visible={visible}>
      {bars.map((_, i) => (
        <div className="sonner-loading-bar" key={`spinner-bar-${i}`} />
      ))}
    </div>
  );
};
