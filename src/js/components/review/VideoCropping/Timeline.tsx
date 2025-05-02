import { useEffect, useMemo, useState } from 'react';

import { usePlayerContext } from '@/context/player';
// import { cn } from '@nextui-org/react';

import { useElementSize } from '@mantine/hooks';
import { useMediaRemote } from '@vidstack/react';
import { Rnd } from 'react-rnd';

import { usePublishingStore } from '@/stores/publishing-store';

import { distributeSprites, generateSprites } from '@/utils/timelineUtils';

const Timeline = ({
  spriteSheet,
  spriteHeight = 0,
  spriteWidth = 0
}: {
  spriteSheet: string | null;
  spriteHeight: number;
  spriteWidth: number;
}) => {
  const {
    playerState: { duration, setTimeSelection }
  } = usePlayerContext();

  const remote = useMediaRemote();

  const { ref, width: timelineWidth } = useElementSize();
  // const minWidth = (10 / duration) * timelineWidth;
  const durationOfClip = Math.min(60, duration);
  const maxWidth = (durationOfClip / duration) * timelineWidth;

  const [x, setX] = useState(0);
  const [width, setWidth] = useState(maxWidth);

  const sprites = generateSprites(spriteWidth, spriteHeight);

  const spriteHeightOnTimeline = 50;

  const spriteWidthOnTimeline = (spriteWidth / spriteHeight) * spriteHeightOnTimeline;

  const numberOfSprites = Math.ceil(timelineWidth / spriteWidthOnTimeline);

  const { setTimeIn, setTimeOut } = usePublishingStore();

  const getSpritesEvenlyDistributed = useMemo(() => {
    return distributeSprites(0, 99, numberOfSprites);
  }, [numberOfSprites]);

  const scale = useMemo(() => {
    return spriteWidthOnTimeline / spriteWidth;
  }, [spriteWidthOnTimeline, spriteWidth]);

  useEffect(() => {
    if (duration === 0) return;

    const newTimeOut = Math.min(60, duration);

    setTimeIn(0);
    setTimeOut(newTimeOut);
    setWidth(maxWidth);

    return () => {
      setX(0);
      setWidth(0);
    };
  }, [duration, timelineWidth, setTimeIn, setTimeOut, maxWidth]);

  return (
    <div ref={ref} className="relative flex h-[50px] items-center overflow-hidden rounded-xl">
      <Rnd
        className="z-[700] flex h-[50px] items-center overflow-hidden rounded-lg"
        minWidth={16}
        maxWidth={maxWidth}
        position={{ x: x, y: 0 }}
        size={{ width: width, height: '100%' }}
        bounds={'parent'}
        enableResizing={{
          left: true,
          right: true
        }}
        dragAxis="x"
        onDragStop={(e, position) => {
          setX(position.x);
          setTimeIn((position.x / timelineWidth) * duration);
          setTimeOut(((position.x + width) / timelineWidth) * duration);
          // setCurrentTime((position.x / timelineWidth) * duration);
          remote.seek((position.x / timelineWidth) * duration);
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          const newX = position.x;
          const newWidth = ref.offsetWidth;
          let newTimeIn, newTimeOut;

          if (direction === 'left') {
            newTimeIn = (newX / timelineWidth) * duration || 0;
            newTimeOut = ((newX + newWidth) / timelineWidth) * duration || 0;
          } else if (direction === 'right') {
            newTimeIn = (newX / timelineWidth) * duration || 0;
            newTimeOut = ((newX + newWidth) / timelineWidth) * duration || 0;
          }

          // Ensure the difference is not greater than 60 seconds
          if ((newTimeOut ?? 0) - (newTimeIn ?? 0) <= 60) {
            setTimeSelection({
              startTime: newTimeIn ?? 0,
              endTime: newTimeOut ?? 0
            });
            // setCurrentTime(newTimeIn ?? 0);
            remote.seek(newTimeIn ?? 0);

            setTimeIn(newTimeIn ?? 0);
            setTimeOut(newTimeOut ?? 0);
            setX(newX);
            setWidth(newWidth);
          }
        }}
      >
        <div className="h-full bg-primary-300/80"></div>
      </Rnd>
      {getSpritesEvenlyDistributed.map((sprite, index) => (
        <div
          style={{
            background: `url('${spriteSheet}') -${sprites[sprite].left * scale}px -${sprites[sprite].top * scale}px`,
            backgroundSize: `${spriteWidthOnTimeline * 10}px ${spriteHeightOnTimeline * 10}px`,
            width: spriteWidthOnTimeline,
            height: spriteHeightOnTimeline
          }}
          key={index}
        />
      ))}
    </div>
  );
};

export default Timeline;
