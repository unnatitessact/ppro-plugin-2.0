// import { useParams } from 'next/navigation';

// import { AxiosError } from 'axios';

// import { useGetShareTaskFiles, useViewTaskShare } from '@/api-integration/mutations/share-task';
// import { ViewTaskShareResponse } from '@/api-integration/types/share-task';

// import { useShareStore } from '@/stores/share-store';

// export const useSharedTask = (onError?: (error: AxiosError) => void) => {
//   const { shareId } = useParams() as { shareId: string };

//   const { setToken, setEmail, setTaskShareData, setFiles, setSelectedFile, token } =
//     useShareStore();
//   const { mutateAsync: getShare } = useViewTaskShare();
//   const { mutateAsync: getShareFiles } = useGetShareTaskFiles();
//   const handleGetShare = async (newToken?: string) => {
//     const localToken = sessionStorage.getItem(`share-${shareId}`);

//     try {
//       const response = await getShare({
//         shareId,
//         token: newToken ?? localToken ?? token
//       });

//       const data = response.data as ViewTaskShareResponse;
//       setToken(data?.token);

//       // Save token in sessionStorage with key as share-<shareId>
//       if (data?.token) {
//         sessionStorage.setItem(`share-${shareId}`, data.token);
//       }

//       if (data?.email) {
//         setEmail(data?.email);
//       }
//       setTaskShareData(data);

//       const files = await getShareFiles(data?.id);
//       setFiles(files);

//       const allFiles = [...(files?.attached_files ?? []), ...(files?.incoming_assets ?? [])];
//       setSelectedFile(allFiles?.[0]);
//     } catch (error) {
//       const e = error as AxiosError;
//       onError?.(e);
//     }
//   };
//   return {
//     handleGetShare
//   };
// };
