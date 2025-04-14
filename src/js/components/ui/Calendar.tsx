import { Calendar as NextUICalendar } from '@nextui-org/calendar';
import { extendVariants } from '@nextui-org/react';

export const Calendar = extendVariants(NextUICalendar, {
  defaultVariants: {
    variant: 'default'
  },
  variants: {
    variant: {
      default: {
        title: 'whitespace-nowrap',
        gridHeader: 'shadow-none',
        cellButton:
          'data-[selected=true]:bg-ds-button-primary-bg data-[selected=true]:data-[hover=true]:bg-ds-button-primary-bg data-[hover=true]:bg-ds-pills-tags-bg data-[hover=true]:text-ds-pills-tags-text'
      }
    }
  }
});
