import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
// import { useParams } from 'next/navigation';

import { usePlayerContext } from "@/context/player";
// import { useVideo } from '@/context/video';
import { useQueryClient } from "@tanstack/react-query";
import { Controls } from "@vidstack/react";

import Timeline from "@/components/review/VideoCropping/Timeline";

import {
  // Crop,
  // MuteFilled,
  Stopwatch,
  // VolumeFullFilled
} from "@tessact/icons";

// import { Divider } from '@/components/ui/Divider';

// import { Listbox, ListboxItem } from '@/components/ui/Listbox';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';

// import Timeline from '@/components/publishing/VideoCropping/Timeline';

// import Zoombar from '@/components/publishing/VideoCropping/Zoombar';

// import { Slider } from '@/components/review/video/Slider';

import { VideoDetails } from "@/api-integration/types/library";

import { usePublishingStore } from "@/stores/publishing-store";

import { secondsToHoursMinutesSeconds } from "@/utils/videoUtils";

import * as Buttons from "./VideoButtons";

// const aspectRatios = [
//   {
//     label: 'None',
//     value: 1,
//     Icon: null
//   },
//   {
//     label: '1:1',
//     value: 1,
//     Icon: (
//       <div className="flex h-4 w-4 items-center justify-center">
//         <div className="aspect-square h-3 w-3 rounded-sm  border border-ds-videoplayer-text-primary" />
//       </div>
//     )
//   },
//   {
//     label: '16:9',
//     value: 16 / 9,
//     Icon: (
//       <div className="flex h-4 w-4 items-center justify-center">
//         <div className="aspect-square h-2 w-4  border border-ds-videoplayer-text-primary" />
//       </div>
//     )
//   },
//   {
//     label: '4:3',
//     value: 4 / 3,
//     Icon: (
//       <div className="flex h-4 w-4 items-center justify-center">
//         <div className="aspect-square h-2 w-3  border border-ds-videoplayer-text-primary" />
//       </div>
//     )
//   },
//   {
//     label: '9:16',
//     value: 9 / 16,

//     Icon: (
//       <div className="flex h-4 w-4 items-center justify-center">
//         <div className="aspect-square h-4 w-2  border border-ds-videoplayer-text-primary" />
//       </div>
//     )
//   }
// ];

export const CroppingVideoControls = () => {
  const { timeIn, timeOut } = usePublishingStore();

  // const [actualDimensions, setActualDimensions] = useState({
  //   width: 0,
  //   height: 0
  // });

  const params = useParams();
  const queryClient = useQueryClient();

  // const [selectedRatio, setSelectedRatio] = useState('None');

  const data = queryClient.getQueryData([
    "assetDetails",
    params.assetId,
  ]) as VideoDetails;

  const {
    player,
    playerState: {
      // videoDimensions: { height, width },

      duration,

      // timeSelection,
      setTimeSelection,
    },
  } = usePlayerContext();

  const [currentTime, setCurrentTime] = useState(0);
  useEffect(() => {
    return player?.subscribe(({ currentTime }) => {
      setCurrentTime(currentTime);
    });
  }, [player]);

  // const { volume, setVolume, prevVolume, setPrevVolume } = useVideo();

  // const [dimensionsOfSelectedRatio, setDimensionsOfSelectedRatio] = useState({
  //   width: 0,
  //   height: 0
  // });

  // useEffect(() => {
  //   let actualVideoWidth = 0,
  //     actualVideoHeight = 0;

  //   const videoAspectRatio = data?.video_width / data?.video_height;
  //   const boxAspectRatio = width / height;

  //   if (boxAspectRatio > videoAspectRatio) {
  //     // case where video is portrait and has empty space on left and right side:
  //     actualVideoHeight = height;
  //     actualVideoWidth = actualVideoHeight * videoAspectRatio;
  //   } else {
  //     // case where video is landscape and has empty space on top and bottom side:
  //     actualVideoWidth = width;
  //     actualVideoHeight = actualVideoWidth / videoAspectRatio;
  //   }
  //   actualVideoWidth = Math.floor(actualVideoWidth);
  //   actualVideoHeight = Math.floor(actualVideoHeight);

  //   setActualDimensions({
  //     width: actualVideoWidth,
  //     height: actualVideoHeight
  //   });
  // }, [data?.video_width, data?.video_height, width, height]);

  // useEffect(() => {
  //   const numerator = Number(selectedRatio.split(':')[0]);
  //   const denominator = Number(selectedRatio.split(':')[1]);

  //   const { width: actualVideoWidth, height: actualVideoHeight } = actualDimensions;

  //   if (!actualVideoWidth || !actualVideoHeight) return;

  //   const calculatedWidth = (actualVideoHeight * numerator) / denominator;
  //   const calculatedHeight = (actualVideoWidth * denominator) / numerator;

  //   if (actualVideoWidth > actualVideoHeight) {
  //     if (selectedRatio == '16:9') {
  //       setDimensionsOfSelectedRatio({
  //         width: actualVideoWidth,
  //         height: calculatedHeight
  //       });
  //     } else if (selectedRatio == '4:3') {
  //       setDimensionsOfSelectedRatio({
  //         width: calculatedWidth,
  //         height: actualVideoHeight
  //       });
  //     } else if (selectedRatio == '9:16') {
  //       setDimensionsOfSelectedRatio({
  //         width: calculatedWidth,
  //         height: actualVideoHeight
  //       });
  //     } else if (selectedRatio == '1:1') {
  //       setDimensionsOfSelectedRatio({
  //         width: calculatedWidth,
  //         height: actualVideoHeight
  //       });
  //     }
  //   } else if (actualVideoWidth == actualVideoHeight) {
  //     //

  //     if (selectedRatio == '16:9') {
  //       setDimensionsOfSelectedRatio({
  //         width: actualVideoWidth,
  //         height: calculatedHeight
  //       });
  //     } else if (selectedRatio == '4:3') {
  //       setDimensionsOfSelectedRatio({
  //         width: calculatedWidth,
  //         height: calculatedHeight
  //       });
  //     } else if (selectedRatio == '9:16') {
  //       setDimensionsOfSelectedRatio({
  //         width: calculatedWidth,
  //         height: actualVideoHeight
  //       });
  //     }
  //   } else {
  //     if (selectedRatio == '16:9') {
  //       setDimensionsOfSelectedRatio({
  //         width: actualVideoWidth,
  //         height: calculatedHeight
  //       });
  //     } else if (selectedRatio == '4:3') {
  //       setDimensionsOfSelectedRatio({
  //         width: actualVideoWidth,
  //         height: calculatedHeight
  //       });
  //     } else if (selectedRatio == '1:1') {
  //       setDimensionsOfSelectedRatio({
  //         width: actualVideoWidth,
  //         height: calculatedHeight
  //       });
  //     }
  //   }
  // }, [selectedRatio, actualDimensions]);

  useEffect(() => {
    setTimeSelection({
      startTime: 4,
      endTime: 10,
    });
  }, [setTimeSelection]);

  return (
    <div className="w-full">
      {/* {selectedRatio !== 'None' && (
        <>
          <div
            style={{ width: width, height: height }}
            className="absolute top-0 z-40 h-full w-full rounded-xl backdrop-brightness-50"
          />

          <div
            style={{
              height: dimensionsOfSelectedRatio.height,
              width: dimensionsOfSelectedRatio.width
            }}
            className="absolute left-1/2 top-0 z-50  backdrop-brightness-200  -translate-x-1/2"
          />
        </>
      )} */}

      {/* <div className="absolute  bottom-14 right-4 z-50">
        <Zoombar zoom={zoom} setZoom={setZoom} />
      </div> */}

      <div className="flex flex-col gap-2">
        <div className="flex w-full items-center justify-between overflow-hidden">
          <Controls.Root className="flex shrink-0 items-center gap-2">
            <Controls.Group>
              <Buttons.Play buttonSize={16} />
            </Controls.Group>

            <Controls.Group>
              <Buttons.Loop buttonSize={16} />
              {/* <Button
                size="sm"
                variant="light"
                isIconOnly
                startContent={<ArrowsRepeatRightLeft size={18} />}
              ></Button> */}
            </Controls.Group>

            {/* <div className="group flex items-center gap-1">
              <Button
                variant="light"
                color="transparent"
                size="sm"
                isIconOnly
                onPress={() => {
                  if (volume === 0) {
                    setVolume(prevVolume);
                  } else {
                    setPrevVolume(volume);
                    setVolume(0);
                  }
                }}
              >
                {volume === 0 ? <MuteFilled size={20} /> : <VolumeFullFilled size={20} />}
              </Button>

              <div className="w-20">
                <Slider thumbHeight="sm" max={100} value={volume} setValue={setVolume} />
              </div>
            </div> */}

            <Controls.Group className="flex shrink-0 items-center gap-1">
              <div className="text-sm font-medium text-ds-videoplayer-text-primary">
                {secondsToHoursMinutesSeconds(currentTime)}{" "}
                <span className="text-ds-videoplayer-text-secondary">
                  / {secondsToHoursMinutesSeconds(duration)}
                </span>
              </div>
            </Controls.Group>
          </Controls.Root>

          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1 text-default-400">
              <Stopwatch size={18} />
              <p className="text-base font-medium">
                {Math.floor(timeIn ?? 0)} - {Math.floor(timeOut ?? 0)}
              </p>
            </div>
            {/* <Divider orientation="vertical" className="h-3" /> */}
            {/* <Popover shouldCloseOnBlur>
              <PopoverTrigger>
                <Button size="sm" variant="light">
                  <Crop size={18} />
                  <p className="text-base font-medium">{selectedRatio}</p>
                </Button>
              </PopoverTrigger>

              <PopoverContent className="min-w-24">
                <Listbox>
                  {aspectRatios.map((ratio) => (
                    <ListboxItem
                      startContent={ratio.Icon}
                      key={ratio.label}
                      onClick={() => setSelectedRatio(ratio.label)}
                    >
                      {ratio.label}
                    </ListboxItem>
                  ))}
                </Listbox>
              </PopoverContent>
            </Popover> */}
          </div>
        </div>
        <Timeline
          spriteSheet={data?.scrub_url}
          spriteHeight={data?.scrub_height}
          spriteWidth={data?.scrub_width}
        />
      </div>
    </div>
  );
};
