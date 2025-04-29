import type { ReactNode } from "react";

import { Medal } from "lucide-react";

import {
  Archive1,
  // BoxSparkle,
  Branches,
  Buildings,
  // BezierPointer,
  // Branches,
  CainLink3,
  // CalendarClock4,
  Folder1,
  Group3,
  // LiveFull,
  Lock,
  MagicWand2,
  Organisation,
  // MagnifyingGlass,
  // PanoramaView,
  People2,
  SettingsGear2,
  // SettingsGear3,
  Shield,
  Tag,
} from "@tessact/icons";

export type Link = {
  label: string;
  href: string;
  icon: ReactNode;
  startsWith?: string;
};

export const links: Link[] = [
  // {
  //   label: 'Search',
  //   href: '/search',
  //   icon: <MagnifyingGlass size={20} />
  // },
  {
    label: "Library",
    href: "library",
    icon: <Folder1 size={20} />,
  },
  // {
  //   label: 'Remixes',
  //   href: '/remixes',
  //   icon: <BoxSparkle size={20} />
  // },
  // {
  //   label: 'Live',
  //   href: '/live-streams',
  //   icon: <LiveFull size={20} />
  // },
  {
    label: "Projects",
    href: "/projects",
    icon: <Archive1 size={20} />,
  },
  // {
  //   label: 'Calendar',
  //   href: '/calendar',
  //   icon: <CalendarClock4 size={20} />
  // },
  // {
  //   label: 'AI Views',
  //   href: '/views',
  //   icon: <PanoramaView size={20} />
  // }
];

export const taggingLinks: Link[] = [
  {
    label: "Tagging",
    href: "/tagging",
    icon: <Tag size={20} />,
  },
  {
    label: "Marathon QC",
    href: "/tagging/marathon-qc/all",
    icon: <Medal size={20} />,
  },
];

export const internalLinks: Link[] = [
  {
    label: "Preset",
    href: "/preset",
    icon: <MagicWand2 size={20} />,
  },
];

export const settingsLinks: Link[] = [
  {
    label: "General",
    href: "/settings/general",
    icon: <SettingsGear2 size={20} />,
  },
  {
    label: "Members",
    href: "/settings/members",
    icon: <People2 size={20} />,
  },
  {
    label: "Teams",
    href: "/settings/teams",
    icon: <Buildings size={20} />,
  },
  {
    label: "Workflows",
    href: "/settings/workflows",
    icon: <Branches size={20} />,
  },
  {
    label: "Actions",
    href: "/settings/automations",
    icon: <Organisation size={20} />,
  },
  {
    label: "Metadata Templates",
    href: "/settings/metadata-templates",
    icon: <Archive1 size={20} />,
  },
  {
    label: "Connections",
    href: "/settings/connections",
    icon: <CainLink3 size={20} />,
  },
  {
    label: "Projects",
    href: "/settings/projects",
    icon: <Archive1 size={20} />,
  },
  // {
  //   label: 'Editor',
  //   href: '/settings/editor',
  //   icon: <BezierPointer size={20} />
  // }
];

export const userManagementLinks: Link[] = [
  {
    label: "All users",
    href: "/admin/users",
    icon: <Group3 size={20} />,
  },
  {
    label: "Security groups",
    href: "/admin/security-groups",
    icon: <Lock size={20} />,
  },
  {
    label: "Role and Permissions",
    href: "/admin/roles",
    icon: <Shield size={20} />,
  },
];
