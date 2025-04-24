import React from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { cn, Skeleton } from '@nextui-org/react';

import { ChevronRightSmall } from '@tessact/icons';

import { Accordion, AccordionItem } from '@/components/ui/Accordion';

import { WorkspaceTabLabel } from '@/components/user-management/sidebar/Tabs';
import { TeamsList } from '@/components/user-management/TeamsList';

import { useWorkspacesWithTeamsListQuery } from '@/api-integration/queries/user-management';

export const WorkspacesAccordion = () => {
  const router = useRouter();
  const path = usePathname();

  const { data: workspacesList, isLoading: isLoadingWorkspacesList } =
    useWorkspacesWithTeamsListQuery();

  return (
    <>
      {isLoadingWorkspacesList ? (
        [...Array(6)].map((_, i) => (
          <div key={i} className="mb-8 grid grid-cols-[32px,1fr,32px] gap-3">
            <Skeleton className="h-8 rounded-md" />
            <Skeleton className="h-8 rounded-md" />
            <Skeleton className="h-8 rounded-md" />
          </div>
        ))
      ) : (
        <Accordion
          key="workspace-list"
          selectionMode="multiple"
          isCompact
          showDivider={false}
          className="flex flex-col gap-6 p-0"
        >
          {workspacesList?.map((workspace) => {
            return (
              <AccordionItem
                as={'div'}
                textValue={workspace.title}
                aria-label={workspace.title}
                onPress={() => router.push(`/admin/workspaces/${workspace.id}`)}
                key={workspace.id}
                title={
                  <WorkspaceTabLabel
                    workspaceImage={workspace.display_image}
                    title={workspace.title}
                    color={workspace.color}
                  >
                    {workspace.title}
                  </WorkspaceTabLabel>
                }
                indicator={
                  workspace?.teams?.length === 0 ? (
                    <span className="flex h-8 w-8" />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-transparent hover:bg-default/40 active:bg-default-200">
                      <ChevronRightSmall size={20} className="text-[#5B5B67]" />
                    </div>
                  )
                }
                classNames={{
                  base: 'p-0',
                  title: 'text-xs font-medium  text-default-500 uppercase',
                  content: 'p-0',
                  trigger: cn(
                    'pb-3 flex flex-row-reverse p-1 relative items-center rounded-xl',
                    path === `/admin/workspaces/${workspace.id}`
                      ? 'bg-default-100'
                      : 'bg-transparent',
                    'hover:bg-default-200'
                  ),
                  // indicator: 'data-[open=true]:rotate-90 text-default-500'
                  indicator:
                    'rotate-0 data-[open=true]:rotate-90 text-default-500 transition-transform duration-200 ease-in-out'
                }}
              >
                {workspace.teams?.length ? <TeamsList workspace={workspace} /> : null}
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </>
  );
};
