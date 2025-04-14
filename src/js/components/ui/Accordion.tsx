import {
  Accordion as NextAccordion,
  AccordionItem as NextAccordionItem
} from '@nextui-org/accordion';
import { extendVariants } from '@nextui-org/react';

export const Accordion = extendVariants(NextAccordion, {
  defaultVariants: {}
});

export const AccordionItem = extendVariants(NextAccordionItem, {
  defaultVariants: {}
});
