// import { useEffect, useMemo, useState } from "react";

// import { useDetection } from "../context/detection";

// import { useFeatureFlag } from "./useFeatureFlag";
// import { AI_METADATA_FLAG } from "../utils/featureFlagUtils";

// import { useDetectionMetadataSampleQuery } from "../api-integration/queries/detection";
// import { DetectionCategory } from "../api-integration/types/detection";

// import { useSearchActionsStore } from '@/stores/search-actions-store';

// export const useDetectionCard = () => {
//   const [isDetectionProcessing, setIsDetectionProcessing] = useState(true);

//   const { fileType } = useDetection();

//   const { selectedPanelTab } = useSearchActionsStore();

//   const isAIMetadataEnabled = useFeatureFlag(AI_METADATA_FLAG);

//   const { data, isLoading } = useDetectionMetadataSampleQuery(
//     isDetectionProcessing &&
//       (fileType === 'VideoFile' || fileType === 'ProjectVideoFile') &&
//       selectedPanelTab === 'metadata'
//       ? 3000
//       : false
//   );

//   const index = {
//     status: data?.index_status,
//     percent: data?.index_percentage ?? 0
//   };

//   useEffect(() => {
//     if ((index?.percent > 0 && index?.percent < 100) || index?.status === 'in_progress') {
//       setIsDetectionProcessing(true);
//     } else {
//       setIsDetectionProcessing(false);
//     }
//   }, [index?.percent, index?.status]);

//   const totalDetectionCount = useMemo(() => {
//     if (!data) return 0;
//     let total = 0;
//     Object.keys(data).forEach((key) => {
//       total += data?.[key as DetectionCategory].count ?? 0;
//     });
//     return total;
//   }, [data]);

//   const showDetectionCard =
//     !isLoading &&
//     isAIMetadataEnabled &&
//     (fileType === 'VideoFile' || fileType === 'ProjectVideoFile') &&
//     index &&
//     index?.percent &&
//     ((index?.percent > 0 && index?.percent < 100) ||
//       (index?.percent === 100 && totalDetectionCount > 0))
//       ? true
//       : false;

//   return {
//     showDetectionCard,
//     totalDetectionCount,
//     index,
//     isDetectionProcessing
//   };
// };
