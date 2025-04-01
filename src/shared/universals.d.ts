/**
 * @description Declare event types for listening with listenTS() and dispatching with dispatchTS()
 */
export type EventTS = {
  myCustomEvent: {
    oneValue: string;
    anotherValue: number;
  };

  fileUploadResult: {
    status: string;
    path?: string;
    message: string;
  };
};

/**
 * @description Result interface for the downloadAndImportToTimeline function
 */
export interface ImportResult {
  status: string;
  path?: string;
  message: string;
}
