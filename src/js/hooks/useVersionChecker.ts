// import { useEffect, useState } from "react";

// import { useAppVersion } from "..x/api-integration/queries/deployment";

// export const useVersionChecker = () => {
//   const [isNewVersionAvailable, setIsNewVersionAvailable] = useState(false);
//   const [currentVersion, setCurrentVersion] = useState<string | null>(null);

//   const { data: latestVersion } = useAppVersion();

//   useEffect(() => {
//     // Set initial version when component mounts
//     if (!currentVersion && latestVersion) {
//       setCurrentVersion(latestVersion);
//       return;
//     }

//     // Check for version mismatch
//     if (currentVersion && latestVersion && currentVersion !== latestVersion) {
//       setIsNewVersionAvailable(true);
//     }
//   }, [currentVersion, latestVersion]);

//   return { isNewVersionAvailable, latestVersion };
// };
