import { useEffect, useState } from 'react';

export function useNavigationBlock(shouldBlock: boolean) {
  const [isBlocked, setIsBlocked] = useState(shouldBlock);

  useEffect(() => {
    setIsBlocked(shouldBlock);
  }, [shouldBlock]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isBlocked) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (isBlocked) {
        if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
          return;
        }
        // Prevent navigation
        window.history.pushState(null, '', window.location.href);
        e.preventDefault();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    // Push a new state to the history when the component mounts
    window.history.pushState(null, '', window.location.href);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isBlocked]);

  return isBlocked;
}
