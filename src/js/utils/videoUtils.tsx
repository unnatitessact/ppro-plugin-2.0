import { TimeCodeType } from "../context/video";

export const secondsToHms = (seconds: number, fps: number) => {
  const padding = function (input: number) {
    return input < 10 ? "0" + input : input;
  };

  const videoFPS = fps;
  // fps = typeof fps !== 'undefined' ? fps : 24;
  if (videoFPS === 0) {
    fps = 24; // Fallback to 24 fps if fps is 0
  }

  return [
    padding(Math.floor(seconds / 3600)),
    padding(Math.floor((seconds % 3600) / 60)),
    padding(Math.floor(seconds % 60)),
    padding(Math.floor((seconds * fps) % fps)),
  ].join(":");
};

export const secondsToFrames = (seconds: number, fps: number): string => {
  const videoFPS = fps;
  if (videoFPS === 0) {
    fps = 24; // Fallback to 24 fps if fps is 0
  }
  return Math.floor(seconds * fps).toString();
};

export const renderValue = (time: number, type: TimeCodeType, fps: number) => {
  switch (type) {
    case "hms":
      return secondsToHms(time, fps);
    case "frames":
      return secondsToFrames(time, fps);
    default:
      return secondsToHoursMinutesSeconds(time);
  }
};

export function secondsToHoursMinutesSeconds(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return [hours, minutes, secs]
    .map((v) => (v < 10 ? "0" + v : v))
    .filter((v, i) => v !== "00" || i > 0)
    .join(":");
}

// write function for frames to seconds
export function framesToSeconds(frames: string, fps: number) {
  return parseInt(frames) / fps;
}

// wrire function to convert hms to seconds
export function hmsToSeconds(hms: string) {
  const [hours, minutes, seconds, frames] = hms.split(":");
  return (
    parseInt(hours, 10) * 3600 +
    parseInt(minutes, 10) * 60 +
    parseInt(seconds, 10) +
    parseInt(frames, 10) / 24
  );
}

export function minutesAndSecondsToSeconds(hms: string) {
  const [minutes, seconds] = hms.split(":");
  return parseInt(minutes, 10) * 60 + parseInt(seconds, 10);
}

export interface TimeCodeDropdownItem {
  label: string;
  type: TimeCodeType;
}
export const timeCodesMenu: TimeCodeDropdownItem[] = [
  {
    label: "Frames",
    type: "frames",
  },
  {
    label: "Timestamp",
    type: "default",
  },
  {
    label: "Timecode",
    type: "hms",
  },
];

// Get the visual dimensions of the video inside the <video> tag, resolution is needed to calculate the aspect ratio
export const getVisualVideoDimensions = ({
  videoDimensions,
  resolution,
}: {
  videoDimensions: { width: number; height: number };
  resolution: { width: number; height: number };
}) => {
  let visualWidth = 0;
  let visualHeight = 0;

  if (resolution.width === 0 || resolution.height === 0) {
    return { width: visualWidth, height: visualHeight };
  }

  const videoAspectRatio = resolution.width / resolution.height;
  const containerAspectRatio = videoDimensions.width / videoDimensions.height;

  if (containerAspectRatio > videoAspectRatio) {
    // Video is portrait or container is wider than video
    visualHeight = videoDimensions.height;
    visualWidth = Math.floor(visualHeight * videoAspectRatio);
  } else {
    // Video is landscape or container is taller than video
    visualWidth = videoDimensions.width;
    visualHeight = Math.floor(visualWidth / videoAspectRatio);
  }

  return {
    width: visualWidth,
    height: visualHeight,
  };
};
