import { useFeatureFlags } from "../context/feature-flags";

export const useFeatureFlag = (flag: string) => {
  const { featureFlags } = useFeatureFlags();

  return featureFlags[flag] ?? false;
};
