'use client';

import React, { useState } from 'react';

import { useParams } from 'next/navigation';

import { cn } from '@nextui-org/react';
import { motion } from 'framer-motion';

import { Link } from '@/components/ui/NextLink';

import { TeamIcon } from '@/components/user-management/TeamIcon';

import { Team } from '@/types/user-management';

interface TeamNodeProps {
  team: Omit<Team, 'name'> & { title: string };
  maxWidth: number;
  parentId: string;
}

const TeamNode = ({ team, maxWidth, parentId }: TeamNodeProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { workspaceId, teamId } = useParams() as { workspaceId: string; teamId: string };
  const isActive = workspaceId === parentId && teamId === team.id;

  return (
    <div className="relative flex w-full items-center pl-8">
      <div className="relative flex w-full text-ds-text-secondary">
        <div className="absolute -left-6 top-1 -z-10 h-3 w-2 rounded-bl-md border-b border-l border-ds-link-tree-lines" />
        <Link href={`/admin/workspaces/${parentId}/teams/${team.id}`} className="w-full">
          <motion.div
            className={cn('relative flex cursor-pointer items-center gap-2 rounded-xl px-1.5 py-2')}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <span className="size-5 flex-shrink-0">
              <TeamIcon name={team.title} color={team.color} size="sm" rounded="lg" />
            </span>
            <p
              className={cn(
                'overflow-hidden truncate text-sm transition-colors',
                isActive && 'text-ds-text-primary'
              )}
              style={{ maxWidth: maxWidth || '100%' }}
            >
              {team.title}
            </p>
            {isHovered && (
              <motion.div
                layout
                transition={{ duration: 0.2 }}
                layoutId="tree-hover-indicator"
                className="absolute inset-0 -z-20 h-9 w-full rounded-xl bg-ds-link-bg-hover"
              ></motion.div>
            )}
            {isActive && (
              <motion.div
                layout
                transition={{ duration: 0.2 }}
                layoutId="tree-active-indicator"
                className="absolute inset-0 -z-10 h-9 w-full rounded-xl bg-ds-link-bg-selected"
              ></motion.div>
            )}
          </motion.div>
        </Link>
      </div>
    </div>
  );
};

export default TeamNode;
