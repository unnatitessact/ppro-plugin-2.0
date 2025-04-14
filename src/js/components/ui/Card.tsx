import {
  Card as NextUICard,
  CardBody as NextUICardBody,
  CardFooter as NextUICardFooter,
  CardHeader as NextUICardHeader
} from '@nextui-org/card';
import { extendVariants } from '@nextui-org/react';

export const Card = extendVariants(NextUICard, {});
export const CardHeader = extendVariants(NextUICardHeader, {});
export const CardBody = extendVariants(NextUICardBody, {});
export const CardFooter = extendVariants(NextUICardFooter, {});
