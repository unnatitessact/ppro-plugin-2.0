// import { useParams } from 'next/navigation';

// import { AxiosError } from 'axios';

// import { useViewShare } from '@/api-integration/mutations/share';
// import { ViewShareResponse } from '@/api-integration/types/share';

// import { useShareStore } from '@/stores/share-store';

// export const useShared = (onError?: (error: AxiosError) => void) => {
//   const { mutateAsync: getShare } = useViewShare();
//   const { shareId } = useParams() as { shareId: string };
//   const { setToken, setEmail, setShareData, token, password } = useShareStore();
//   const handleGetShare = async (newToken?: string) => {
//     if (newToken) {
//       setToken(newToken);
//       sessionStorage.setItem(`share-${shareId}`, newToken);
//     }
//     const localToken = sessionStorage.getItem(`share-${shareId}`);
//     try {
//       const response = await getShare({
//         shareId,
//         password,
//         token: newToken ?? localToken ?? token
//       });

//       const data = response.data as ViewShareResponse;
//       setToken(localToken ?? token);
//       // setToken(data?.token);
//       // if (data?.token) {
//       //   sessionStorage.setItem(`share-${shareId}`, data.token);
//       // }
//       if (data?.email) {
//         setEmail(data?.email);
//       }
//       setShareData(data);
//     } catch (error) {
//       const e = error as AxiosError;
//       onError?.(e);
//     }
//   };

//   return {
//     handleGetShare
//   };
// };
