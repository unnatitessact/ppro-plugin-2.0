import { useEffect, useState } from 'react';

import { usePlayerContext } from '@/context/player';
import { cn } from '@nextui-org/react';

import { Checkbox } from '@/components/ui/Checkbox';

import TimeInput from '@/components/review/time-selection/TimeInput';

import {
  framesToSeconds,
  hmsToSeconds,
  minutesAndSecondsToSeconds,
  secondsToFrames,
  secondsToHms
} from '@/utils/videoUtils';

const CommentTimeSelection = ({
  timeIn,
  timeOut
}: {
  timeIn: number | null;
  timeOut: number | null;
}) => {
  // const [isSelected, setIsSelected] = useState(false);
  const [isEditable, setIsEditable] = useState<'timeIn' | 'timeOut' | ''>('');
  const [inHours, setInHours] = useState('00');
  const [inMinutes, setInMinutes] = useState('00');
  const [inSeconds, setInSeconds] = useState('00');
  const [inFps, setInFps] = useState('00');
  const [inFrames, setInFrames] = useState('000');

  const [outHours, setOutHours] = useState('00');
  const [outMinutes, setOutMinutes] = useState('00');
  const [outSeconds, setOutSeconds] = useState('00');
  const [outFps, setOutFps] = useState('00');
  const [outFrames, setOutFrames] = useState('000');
  const [, setTimeIn] = useState('00:00');
  const [, setTimeOut] = useState('00:00');

  const {
    player,
    playerState: { timeFormat: type, duration, fps: videoFPS }
  } = usePlayerContext();

  const [currentTime, setCurrentTime] = useState(0);
  useEffect(() => {
    return player?.subscribe(({ currentTime }) => {
      setCurrentTime(currentTime);
    });
  }, [player]);

  const updateTime = (
    inHours?: string,
    inMinutes?: string,
    inSeconds?: string,
    inFps?: string,
    inFrames?: string,
    outHours?: string,
    outMinutes?: string,
    outSeconds?: string,
    outFps?: string,
    outFrames?: string
  ) => {
    switch (type) {
      case 'default':
        // hh:mm
        if (isEditable === 'timeIn') {
          const timeInSeconds = minutesAndSecondsToSeconds(`${inMinutes}:${inSeconds}`);

          if (timeInSeconds > duration || (timeOut !== null && timeInSeconds > timeOut)) {
            // Revert to the original time-in value
            setInMinutes(timeIn ? secondsToHms(timeIn, videoFPS).split(':')[1] : '00');
            setInSeconds(timeIn ? secondsToHms(timeIn, videoFPS).split(':')[2] : '00');
            return;
          }

          setTimeIn(`${inMinutes}:${inSeconds}`);

          // updateTimeInComments(timeInSeconds);

          //   setTimeInStore(timeInSeconds);
        }
        if (isEditable === 'timeOut') {
          const timeOutSeconds = minutesAndSecondsToSeconds(`${outMinutes}:${outSeconds}`);

          if (timeOutSeconds > duration || (timeIn !== null && timeOutSeconds < timeIn)) {
            // Revert to the original time-out value
            setOutMinutes(timeOut ? secondsToHms(timeOut, videoFPS).split(':')[1] : '00');
            setOutSeconds(timeOut ? secondsToHms(timeOut, videoFPS).split(':')[2] : '00');
            return;
          }

          setTimeOut(`${outMinutes}:${outSeconds}`);
          // updateTimeOutComments(timeOutSeconds);
        }
        break;
      case 'frames':
        // 246
        if (isEditable === 'timeIn') {
          const timeInFrames = framesToSeconds(inFrames || '00', videoFPS);

          if (timeInFrames > duration || (timeOut !== null && timeInFrames > timeOut)) {
            // Revert to the original time-in value
            setInFrames(timeIn ? secondsToFrames(timeIn, videoFPS) : '000');
            return;
          }

          setTimeIn(`${inFrames}`);

          // updateTimeInComments(timeInFrames);
        }
        if (isEditable === 'timeOut') {
          const timeOutFrames = framesToSeconds(outFrames || '00', videoFPS);

          if (timeOutFrames > duration || (timeIn !== null && timeOutFrames < timeIn)) {
            // Revert to the original time-out value
            setOutFrames(timeOut ? secondsToFrames(timeOut, videoFPS) : '000');
            return;
          }

          setTimeOut(`${outFrames}`);
          // updateTimeOutComments(timeOutFrames);
        }
        break;
      case 'hms':
        // hh:mm:ss:ff
        if (isEditable === 'timeIn') {
          const hms = hmsToSeconds(`${inHours}:${inMinutes}:${inSeconds}:${inFps}`);

          if (hms > duration || (timeOut !== null && hms > timeOut)) {
            // Revert to the original time-in value
            const timeInHms = secondsToHms(timeIn || 0, videoFPS);
            const [hours, minutes, seconds, fps] = timeInHms.split(':');
            setInHours(hours);
            setInMinutes(minutes);
            setInSeconds(seconds);
            setInFps(fps);
            return;
          }

          // updateTimeInComments(hms);
          setTimeIn(`${inHours}:${inMinutes}:${inSeconds}:${inFps}`);
        }
        if (isEditable === 'timeOut') {
          const hms = hmsToSeconds(`${outHours}:${outMinutes}:${outSeconds}:${outFps}`);

          if (hms > duration || (timeIn !== null && hms < timeIn)) {
            // Revert to the original time-out value
            const timeOutHms = secondsToHms(timeOut || 0, videoFPS);
            const [hours, minutes, seconds, fps] = timeOutHms.split(':');
            setOutHours(hours);
            setOutMinutes(minutes);
            setOutSeconds(seconds);
            setOutFps(fps);
            // updateTimeOutComments(hms);
            return;
          }

          setTimeOut(`${outHours}:${outMinutes}:${outSeconds}:${outFps}`);
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    switch (type) {
      case 'default':
        setTimeIn('00:00');
        setTimeOut('00:00');
        break;
      case 'frames':
        setTimeIn('00');
        setTimeOut('00');
        break;
      case 'hms':
        setTimeIn('00:00:00:00');
        setTimeOut('00:00:00:00');
        break;
    }
  }, [type]);

  const getInTimeFields = (autoFocus: boolean, isSelected: boolean) => {
    const hours = inHours;
    const minutes = inMinutes;
    const seconds = inSeconds;
    const fps = inFps;
    const frames = inFrames;

    switch (type) {
      case 'default':
        // hh:mm
        return (
          <form
            className="flex max-h-[20px] items-center"
            onSubmit={(e) => {
              e.preventDefault();

              updateTime(
                inHours,
                inMinutes,
                inSeconds,
                inFps,
                inFrames,
                outHours,
                outMinutes,
                outSeconds,
                outFps,
                outFrames
              );
              setIsEditable('');
            }}
          >
            <div
              onFocus={() => {
                setIsEditable('timeIn');
              }}
              onBlur={() => {
                updateTime(
                  inHours,
                  inMinutes,
                  inSeconds,
                  inFps,
                  inFrames,
                  outHours,
                  outMinutes,
                  outSeconds,
                  outFps,
                  outFrames
                );
              }}
            >
              <TimeInput
                value={minutes}
                setValue={setInMinutes}
                autoFocus={autoFocus}
                maxNumber={59}
                disabled={!isSelected}
              />
            </div>
            <span
              className={cn(
                isSelected ? 'text-primary-400' : 'text-default-300',
                'text-sm font-medium '
              )}
            >
              :
            </span>
            <div
              onFocus={() => {
                setIsEditable('timeIn');
              }}
              onBlur={() => {
                updateTime(
                  inHours,
                  inMinutes,
                  inSeconds,
                  inFps,
                  inFrames,
                  outHours,
                  outMinutes,
                  outSeconds,
                  outFps,
                  outFrames
                );
              }}
            >
              <TimeInput
                value={seconds}
                setValue={setInSeconds}
                maxNumber={59}
                disabled={!isSelected}
              />
            </div>
            <button type="submit" className="hidden" aria-label="Submit time" />
          </form>
        );
        break;
      case 'frames':
        // 246
        return (
          <form
            className="flex max-h-[20px] items-center"
            onSubmit={(e) => {
              e.preventDefault();

              updateTime(
                inHours,
                inMinutes,
                inSeconds,
                inFps,
                inFrames,
                outHours,
                outMinutes,
                outSeconds,
                outFps,
                outFrames
              );
              setIsEditable('');
            }}
          >
            <div
              onFocus={() => {
                setIsEditable('timeIn');
              }}
              onBlur={() => {
                updateTime(
                  inHours,
                  inMinutes,
                  inSeconds,
                  inFps,
                  inFrames,
                  outHours,
                  outMinutes,
                  outSeconds,
                  outFps,
                  outFrames
                );
              }}
            >
              <TimeInput
                value={frames}
                setValue={setInFrames}
                autoFocus={autoFocus}
                maxNumber={Number(secondsToFrames(duration, videoFPS))}
                disabled={!isSelected}
              />
            </div>
            <button type="submit" className="hidden" aria-label="Submit time" />
          </form>
        );
        break;
      case 'hms':
        // hh:mm:ss:ff
        return (
          <form
            className="flex max-h-[20px] items-center"
            onSubmit={(e) => {
              e.preventDefault();

              updateTime(
                inHours,
                inMinutes,
                inSeconds,
                inFps,
                inFrames,
                outHours,
                outMinutes,
                outSeconds,
                outFps,
                outFrames
              );
              setIsEditable('');
            }}
          >
            <div
              onFocus={() => {
                setIsEditable('timeIn');
              }}
              onBlur={() => {
                updateTime(
                  inHours,
                  inMinutes,
                  inSeconds,
                  inFps,
                  inFrames,
                  outHours,
                  outMinutes,
                  outSeconds,
                  outFps,
                  outFrames
                );
              }}
            >
              <TimeInput
                value={hours}
                setValue={setInHours}
                autoFocus={autoFocus}
                maxNumber={59}
                disabled={!isSelected}
              />
            </div>
            <span
              className={cn(
                isSelected ? 'text-primary-400' : 'text-default-300',
                'text-sm font-medium '
              )}
            >
              :
            </span>
            <div
              onFocus={() => {
                setIsEditable('timeIn');
              }}
              onBlur={() => {
                updateTime(
                  inHours,
                  inMinutes,
                  inSeconds,
                  inFps,
                  inFrames,
                  outHours,
                  outMinutes,
                  outSeconds,
                  outFps,
                  outFrames
                );
              }}
            >
              <TimeInput
                value={minutes}
                setValue={setInMinutes}
                maxNumber={59}
                disabled={!isSelected}
              />
            </div>
            <span
              className={cn(
                isSelected ? 'text-primary-400' : 'text-default-300',
                'text-sm font-medium '
              )}
            >
              :
            </span>
            <div
              onFocus={() => {
                setIsEditable('timeIn');
              }}
              onBlur={() => {
                updateTime(
                  inHours,
                  inMinutes,
                  inSeconds,
                  inFps,
                  inFrames,
                  outHours,
                  outMinutes,
                  outSeconds,
                  outFps,
                  outFrames
                );
              }}
            >
              <TimeInput
                value={seconds}
                setValue={setInSeconds}
                maxNumber={59}
                disabled={!isSelected}
              />
            </div>
            <span
              className={cn(
                isSelected ? 'text-primary-400' : 'text-default-300',
                'text-sm font-medium '
              )}
            >
              :
            </span>
            <div
              onFocus={() => {
                setIsEditable('timeIn');
              }}
              onBlur={() => {
                updateTime(
                  inHours,
                  inMinutes,
                  inSeconds,
                  inFps,
                  inFrames,
                  outHours,
                  outMinutes,
                  outSeconds,
                  outFps,
                  outFrames
                );
              }}
            >
              <TimeInput value={fps} setValue={setInFps} maxNumber={59} disabled={!isSelected} />
            </div>
            <button type="submit" className="hidden" aria-label="Submit time" />
          </form>
        );
        break;
      default:
        break;
    }
  };

  const getOutTimeFields = (autoFocus: boolean, isSelected: boolean) => {
    const hours = outHours;
    const minutes = outMinutes;
    const seconds = outSeconds;
    const fps = outFps;
    const frames = outFrames;

    switch (type) {
      case 'default':
        // hh:mm
        return (
          <form
            className="flex max-h-[20px] items-center"
            onSubmit={(e) => {
              e.preventDefault();
              updateTime(
                inHours,
                inMinutes,
                inSeconds,
                inFps,
                inFrames,
                outHours,
                outMinutes,
                outSeconds,
                outFps,
                outFrames
              );
              setIsEditable('');
            }}
          >
            <div
              onFocus={() => {
                setIsEditable('timeOut');
              }}
              onBlur={() => {
                updateTime(
                  inHours,
                  inMinutes,
                  inSeconds,
                  inFps,
                  inFrames,
                  outHours,
                  outMinutes,
                  outSeconds,
                  outFps,
                  outFrames
                );
              }}
            >
              <TimeInput
                value={minutes}
                setValue={setOutMinutes}
                autoFocus={autoFocus}
                maxNumber={59}
                disabled={!isSelected}
              />
            </div>
            <span
              className={cn(
                isSelected ? 'text-primary-400' : 'text-default-300',
                'text-sm font-medium '
              )}
            >
              :
            </span>
            <div
              onFocus={() => {
                setIsEditable('timeOut');
              }}
              onBlur={() => {
                updateTime(
                  inHours,
                  inMinutes,
                  inSeconds,
                  inFps,
                  inFrames,
                  outHours,
                  outMinutes,
                  outSeconds,
                  outFps,
                  outFrames
                );
              }}
            >
              <TimeInput
                value={seconds}
                setValue={setOutSeconds}
                maxNumber={59}
                disabled={!isSelected}
              />
            </div>
            <button type="submit" className="hidden" aria-label="Submit time" />
          </form>
        );
        break;
      case 'frames':
        // 246
        return (
          <form
            className="flex max-h-[20px] items-center"
            onSubmit={(e) => {
              e.preventDefault();
              updateTime(
                inHours,
                inMinutes,
                inSeconds,
                inFps,
                inFrames,
                outHours,
                outMinutes,
                outSeconds,
                outFps,
                outFrames
              );
              setIsEditable('');
            }}
          >
            <div
              onFocus={() => {
                setIsEditable('timeOut');
              }}
              onBlur={() => {
                updateTime(
                  inHours,
                  inMinutes,
                  inSeconds,
                  inFps,
                  inFrames,
                  outHours,
                  outMinutes,
                  outSeconds,
                  outFps,
                  outFrames
                );
              }}
            >
              <TimeInput
                value={frames}
                setValue={setOutFrames}
                autoFocus={autoFocus}
                maxNumber={Number(secondsToFrames(duration, videoFPS))}
                disabled={!isSelected}
              />
            </div>
            <button type="submit" className="hidden" aria-label="Submit time" />
          </form>
        );
        break;
      case 'hms':
        // hh:mm:ss:ff
        return (
          <form
            className="flex max-h-[20px] items-center"
            onSubmit={(e) => {
              e.preventDefault();

              updateTime(
                inHours,
                inMinutes,
                inSeconds,
                inFps,
                inFrames,
                outHours,
                outMinutes,
                outSeconds,
                outFps,
                outFrames
              );
              setIsEditable('');
            }}
          >
            <div
              onFocus={() => {
                setIsEditable('timeOut');
              }}
              onBlur={() => {
                updateTime(
                  inHours,
                  inMinutes,
                  inSeconds,
                  inFps,
                  inFrames,
                  outHours,
                  outMinutes,
                  outSeconds,
                  outFps,
                  outFrames
                );
              }}
            >
              <TimeInput
                value={hours}
                setValue={setOutHours}
                autoFocus={autoFocus}
                maxNumber={59}
                disabled={!isSelected}
              />
            </div>
            <span
              className={cn(
                isSelected ? 'text-primary-400' : 'text-default-300',
                'text-sm font-medium '
              )}
            >
              :
            </span>
            <div
              onFocus={() => {
                setIsEditable('timeOut');
              }}
              onBlur={() => {
                updateTime(
                  inHours,
                  inMinutes,
                  inSeconds,
                  inFps,
                  inFrames,
                  outHours,
                  outMinutes,
                  outSeconds,
                  outFps,
                  outFrames
                );
              }}
            >
              <TimeInput
                value={minutes}
                setValue={setOutMinutes}
                maxNumber={59}
                disabled={!isSelected}
              />
            </div>
            <span
              className={cn(
                isSelected ? 'text-primary-400' : 'text-default-300',
                'text-sm font-medium '
              )}
            >
              :
            </span>
            <div
              onFocus={() => {
                setIsEditable('timeOut');
              }}
              onBlur={() => {
                updateTime(
                  inHours,
                  inMinutes,
                  inSeconds,
                  inFps,
                  inFrames,
                  outHours,
                  outMinutes,
                  outSeconds,
                  outFps,
                  outFrames
                );
              }}
            >
              <TimeInput
                value={seconds}
                setValue={setOutSeconds}
                maxNumber={59}
                disabled={!isSelected}
              />
            </div>
            <span
              className={cn(
                isSelected ? 'text-primary-400' : 'text-default-300',
                'text-sm font-medium '
              )}
            >
              :
            </span>
            <div
              onFocus={() => {
                setIsEditable('timeOut');
              }}
              onBlur={() => {
                updateTime(
                  inHours,
                  inMinutes,
                  inSeconds,
                  inFps,
                  inFrames,
                  outHours,
                  outMinutes,
                  outSeconds,
                  outFps,
                  outFrames
                );
              }}
            >
              <TimeInput value={fps} setValue={setOutFps} maxNumber={59} disabled={!isSelected} />
            </div>
            <button type="submit" className="hidden" aria-label="Submit time" />
          </form>
        );
        break;
      default:
        break;
    }
  };

  // Effect for handling changes to timeIn

  useEffect(() => {
    if (timeIn && timeOut) {
      const timeInFrames = secondsToFrames(timeIn, videoFPS);
      const timeInHms = secondsToHms(timeIn, videoFPS);

      const timeOutFrames = secondsToFrames(timeOut, videoFPS);
      const timeOutHms = secondsToHms(timeOut, videoFPS);

      const timeInArray = timeInHms.split(':');
      const timeInHours = timeInArray[0];
      const timeInMinutes = timeInArray[1];
      const timeInSeconds = timeInArray[2];
      const timeInFps = timeInArray[3];

      const timeOutArray = timeOutHms.split(':');
      const timeOutHours = timeOutArray[0];
      const timeOutMinutes = timeOutArray[1];
      const timeOutSeconds = timeOutArray[2];
      const timeOutFps = timeOutArray[3];

      setInHours(timeInHours);
      setInMinutes(timeInMinutes);
      setInSeconds(timeInSeconds);
      setInFps(timeInFps);
      setInFrames(timeInFrames);

      setOutHours(timeOutHours);
      setOutMinutes(timeOutMinutes);
      setOutSeconds(timeOutSeconds);
      setOutFps(timeOutFps);
      setOutFrames(timeOutFrames);
    } else if (timeIn && !timeOut) {
      const frames = secondsToFrames(timeIn, videoFPS);
      const hms = secondsToHms(timeIn, videoFPS);

      const timesArray = hms.split(':');
      const hours = timesArray[0];
      const minutes = timesArray[1];
      const seconds = timesArray[2];
      const fps = timesArray[3];

      setInHours(hours);
      setInMinutes(minutes);
      setInSeconds(seconds);
      setInFps(fps);
      setInFrames(frames);
    } else if (!timeIn && !timeOut) {
      // if (!player?.state?.playing) {
      const frames = secondsToFrames(currentTime, videoFPS);
      const hms = secondsToHms(currentTime, videoFPS);

      const timesArray = hms.split(':');
      const hours = timesArray[0];
      const minutes = timesArray[1];
      const seconds = timesArray[2];
      const fps = timesArray[3];

      setInHours(hours);
      setInMinutes(minutes);
      setInSeconds(seconds);
      setInFps(fps);
      setInFrames(frames);
    }
    // }
  }, [videoFPS, currentTime, timeIn, timeOut]);

  return (
    <div
      className={cn(
        !!timeIn || !!timeOut
          ? 'bg-ds-timestamp-bg-selected hover:bg-ds-timestamp-bg-selected'
          : 'bg-transparent hover:bg-ds-timestamp-bg-hover',
        'relative flex h-8 w-fit cursor-text items-center rounded-xl p-2 transition-colors duration-200 ease-in-out'
      )}
    >
      <Checkbox
        size="sm"
        isSelected={!!timeIn}
        onValueChange={() => {
          // if (timeIn) {
          //   setComments(
          //     comments.map((comment) => {
          //       if (comment.id === commentId) {
          //         return {
          //           ...comment,
          //           timeIn: null
          //         };
          //       }
          //       return comment;
          //     })
          //   );
          // } else {
          //   setComments(
          //     comments.map((comment) => {
          //       if (comment.id === commentId) {
          //         return {
          //           ...comment,
          //           timeIn: currentTime
          //         };
          //       }
          //       return comment;
          //     })
          //   );
          // }
        }}
        variant="primary"
      />
      {/* <div className="absolute left-8 top-1/2 -translate-y-1/2"> */}
      <div className="ml-1 flex h-8 items-center justify-center">
        {timeIn && timeOut ? (
          <>
            {' '}
            <>{getInTimeFields(false, !!timeIn)}</>
            <span
              className={cn(
                timeIn ? 'text-primary-400' : 'text-default-300',
                'karla text-sm font-medium'
              )}
            >
              –
            </span>
            <>{getOutTimeFields(false, !!timeOut)}</>
          </>
        ) : (
          <>{getInTimeFields(false, !!timeIn)}</>
        )}
      </div>
      {/* </div> */}
    </div>
  );
};

export default CommentTimeSelection;
