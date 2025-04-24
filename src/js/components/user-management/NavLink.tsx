'use client';

import type { ReactNode } from 'react';

import { usePathname } from 'next/navigation';

import { cn } from '@nextui-org/react';

import { Link } from '@/components/ui/Link';

interface NavLinkProps {
  label: string;
  href: string;
  Icon?: ReactNode;
  endContent?: ReactNode;
}

export const NavLink = ({ label, href, Icon, endContent }: NavLinkProps) => {
  const path = usePathname();
  const isActive = path === href;

  return (
    <Link
      isBlock
      href={href}
      className={cn(
        'flex flex-grow cursor-pointer items-center gap-3 rounded-lg px-3 py-2',
        isActive && 'bg-default-100'
      )}
      color="foreground"
    >
      {Icon}
      {label}
      {endContent}
    </Link>
  );
};
