// // import { useParams, useSearchParams } from 'next/navigation';

// import DetectionCard from '@/components/detection/DetectionCard';
// import { Metadata } from '@/components/library/metadata/Metadata';
// import { NoMetadata } from '@/components/library/metadata/NoMetadata';
// import { MetadataSkeleton } from '@/components/skeletons/MetadataSkeleton';

// import { useDetectionCard } from '@/hooks/useDetectionCard';

// import { useMetadataCategoriesQuery } from '@/api-integration/queries/metadata';

// interface MetadataPanelProps {
//   assetName: string;
//   setIsDetectionOpen?: (isDetectionOpen: boolean) => void;
// }

// const MetadataPanel = ({ assetName, setIsDetectionOpen }: MetadataPanelProps) => {
//   const { assetId: fileId } = useParams();

//   const searchParams = useSearchParams();
//   const assetId = searchParams.get('version') ?? fileId;

//   const { data: metadataCategories, isLoading: isMetadataCategoriesLoading } =
//     useMetadataCategoriesQuery(assetId as string);

//   const { showDetectionCard, totalDetectionCount, index, isDetectionProcessing } =
//     useDetectionCard();

//   return (
//     <>
//       {showDetectionCard && (
//         <div className="mb-4 w-full px-2">
//           <DetectionCard
//             index={index}
//             totalDetectionCount={totalDetectionCount}
//             isDetectionProcessing={isDetectionProcessing}
//             setIsDetectionOpen={setIsDetectionOpen}
//           />
//         </div>
//       )}
//       {isMetadataCategoriesLoading ? (
//         <MetadataSkeleton />
//       ) : metadataCategories && metadataCategories.length > 0 ? (
//         <Metadata
//           assetId={assetId as string}
//           assetName={assetName}
//           isDetectionProcessing={isDetectionProcessing}
//         />
//       ) : (
//         <NoMetadata />
//       )}
//     </>
//   );
// };

// export default MetadataPanel;
