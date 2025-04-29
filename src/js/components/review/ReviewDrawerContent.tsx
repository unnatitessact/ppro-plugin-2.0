// import { useMemo } from 'react';

// import { useParams, useSearchParams } from 'next/navigation';

// import { Search } from 'lucide-react';

// import { ArrowInbox, CircleInfo, Filter2, FilterTimeline, Lock, Server } from '@tessact/icons';

// import { Chip } from '@/components/ui/Chip';
// import { Divider } from '@/components/ui/Divider';
// import { DrawerItem, DrawerNestedItem } from '@/components/ui/Drawer';

// import { Access } from '@/components/library/access/Acess';
// import { TechnicalMetadataMobileLibrary } from '@/components/library/metadata/TechnicalMetadata';
// import { MetadataPanelMobile } from '@/components/library/MetadataPanel';
// import { CommentsSearchbarMobile } from '@/components/review/CommentsSearchbar';
// import { DownloadCommentMenuMobileDrawer } from '@/components/review/download-review/DownloadCommentMenu';
// import { FilterCommentsDrawerContent } from '@/components/review/ReviewFilterDropdown/ReviewFilterDropdown';
// import {
//   SortDrawerMobile,
//   SortDrawerMobileEndContent
// } from '@/components/review/sort-dropdown/SortDropdown';
// import { ReviewDrawerStatusItem } from '@/components/review/status-dropdown/StatusDropdownMobile';

// import { useReviewFilterParams } from '@/hooks/useReviewFilterParams';

// import { useDownloadMetadata } from '@/api-integration/mutations/library';

// export const ReviewDrawerContent = () => {
//   return (
//     <div className="flex w-full flex-col gap-1.5">
//       <ReviewDrawerFilterCommentsItem />
//     </div>
//   );
// };

// const ReviewDrawerFilterCommentsItem = () => {
//   return (
//     <>
//       <DrawerNestedItem
//         label={<ReviewDrawerFilterCommentsItemLabel />}
//         icon={<Filter2 size={20} />}
//         drawerContent={<FilterCommentsDrawerContent />}
//       />
//       <DrawerNestedItem
//         icon={<ArrowInbox size={20} />}
//         label="Download comments"
//         drawerContent={<DownloadCommentMenuMobileDrawer />}
//       />
//       <DrawerNestedItem
//         icon={<Search size={20} />}
//         label="Search for comments"
//         drawerContent={<CommentsSearchbarMobile />}
//       />
//       <DrawerNestedItem
//         icon={<FilterTimeline size={20} />}
//         label="Sort comments"
//         drawerContent={<SortDrawerMobile />}
//         endContent={<SortDrawerMobileEndContent />}
//       />
//       <Divider variant="border" className="w-full" />
//       <div className="p-2 text-sm font-medium text-ds-menu-text-header">File</div>
//       <DrawerNestedItem
//         label="View file info"
//         icon={<CircleInfo size={20} />}
//         drawerContent={<TechnicalMetadataMobileLibrary />}
//       />
//       <DrawerNestedItem
//         label="View metadata"
//         icon={<Server size={20} />}
//         drawerContent={<MetadataPanelMobile />}
//       />
//       <ReviewDrawerDownloadMetadataItem />
//       <ReviewDrawerViewSecurityGroupsItem />
//       <ReviewDrawerStatusItem />
//     </>
//   );
// };

// const ReviewDrawerFilterCommentsItemLabel = () => {
//   const [filters] = useReviewFilterParams();
//   const badgeCount = useMemo(() => {
//     return Object.entries(filters).reduce((acc, [key, value]) => {
//       if (key === 'sort') return acc; // Skip sort from count
//       if (typeof value === 'boolean' && value) return acc + 1;
//       if (typeof value === 'string' && value) {
//         if (['tags', 'mentions', 'commenter'].includes(key)) {
//           return acc + value.split(',').filter(Boolean).length;
//         }
//         return acc + 1;
//       }
//       return acc;
//     }, 0);
//   }, [filters]);
//   return (
//     <div className="flex items-center gap-2">
//       Filter comments {badgeCount > 0 ? <Chip color="filter">{badgeCount}</Chip> : null}
//     </div>
//   );
// };

// const ReviewDrawerDownloadMetadataItem = () => {
//   const { assetId: fileId } = useParams() as { assetId: string };
//   const searchParams = useSearchParams();
//   const assetId = searchParams.get('version') ?? fileId;

//   const { mutate: downloadMetadata } = useDownloadMetadata(assetId as string);

//   return (
//     <DrawerItem
//       label="Download metadata"
//       icon={<ArrowInbox size={20} />}
//       onClick={() => downloadMetadata()}
//     />
//   );
// };

// const ReviewDrawerViewSecurityGroupsItem = () => {
//   const { assetId: fileId } = useParams() as { assetId: string };
//   const searchParams = useSearchParams();
//   const assetId = searchParams.get('version') ?? fileId;
//   return (
//     <DrawerNestedItem
//       label="View security groups"
//       icon={<Lock size={20} />}
//       drawerContent={<Access assetId={assetId} viewOnly />}
//     />
//   );
// };
