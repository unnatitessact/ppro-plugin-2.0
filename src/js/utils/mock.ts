import { useCallback, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useMockAPI<T extends (...args: any[]) => unknown>(
  fn: T,
  throwError = false
): [(...args: Parameters<T>) => Promise<ReturnType<T>>, boolean] {
  const [isLoading, setIsLoading] = useState(false);

  const delayedCall = useCallback(
    (...args: Parameters<T>): Promise<ReturnType<T>> => {
      return new Promise((resolve, reject) => {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          if (throwError) {
            reject(new Error('Intentional error'));
          } else {
            resolve(fn(...args) as ReturnType<T>);
          }
        }, 2000);
      });
    },
    [fn, throwError]
  );

  return [delayedCall, isLoading];
}

export default useMockAPI;
