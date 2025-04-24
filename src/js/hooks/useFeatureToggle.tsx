export const PRODUCTION_URL = 'https://app.tessact.ai';
export const STAGING_URL = 'https://beta.tessact.ai';
export const DEV_URL = 'https://anything.tessact.com';
export const VIACOM_PRODUCTION_URL = 'https://tessact.viacom18.com';
export const VIACOM_STAGING_URL = 'https://tessact-staging.viacom18.com';

type Environment = 'production' | 'staging' | 'dev' | 'viacom-production' | 'viacom-staging';

export const useFeatureToggle = (environmentsToEnableOn: Environment[]): boolean => {
  const currentUrl = typeof window !== 'undefined' ? window.location.origin : '';

  if (currentUrl.includes('localhost')) {
    return true;
  }

  const isEnabled = environmentsToEnableOn.some((env) => {
    switch (env) {
      case 'production':
        return currentUrl === PRODUCTION_URL;
      case 'staging':
        return currentUrl === STAGING_URL;
      case 'viacom-production':
        return currentUrl === VIACOM_PRODUCTION_URL;
      case 'viacom-staging':
        return currentUrl === VIACOM_STAGING_URL;
      case 'dev':
        return currentUrl === DEV_URL;
      default:
        return false;
    }
  });

  return isEnabled;
};
