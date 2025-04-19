("");

import { useRef } from "react";

import { useFocusWithin, useMergedRef } from "@mantine/hooks";
import { cn } from "@nextui-org/react";

interface TimecodeInputProps {
  value: string;
  onChange: (value: string) => void;
  showFrames?: boolean;
  variant?: "default" | "small";
}

const inputCn = cn(
  "w-5 pl-[2px] pr-[1px] py-[1px]",
  "bg-transparent font-mono text-sm",
  "placeholder:text-sm placeholder:font-mono",
  "focus:outline-none selection:bg-transparent",
  "transition",
  "rounded-md"
);

export const TimecodeInput = ({
  value,
  onChange,
  showFrames,
  variant = "default",
}: TimecodeInputProps) => {
  const hourInputRef = useRef<HTMLInputElement>(null);
  const minuteInputRef = useRef<HTMLInputElement>(null);
  const secondInputRef = useRef<HTMLInputElement>(null);
  const frameInputRef = useRef<HTMLInputElement>(null);

  const { ref: hourFocusRef, focused: hourFocused } = useFocusWithin();
  const { ref: minuteFocusRef, focused: minuteFocused } = useFocusWithin();
  const { ref: secondFocusRef, focused: secondFocused } = useFocusWithin();
  const { ref: frameFocusRef, focused: frameFocused } = useFocusWithin();

  const mergedHourRef = useMergedRef(hourInputRef, hourFocusRef);
  const mergedMinuteRef = useMergedRef(minuteInputRef, minuteFocusRef);
  const mergedSecondRef = useMergedRef(secondInputRef, secondFocusRef);
  const mergedFrameRef = useMergedRef(frameInputRef, frameFocusRef);

  const [hour, minute, second, frame] = value
    ? value.split(":").map((s) => s || "00")
    : ["00", "00", "00", "00"];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "hour" | "minute" | "second" | "frame"
  ) => {
    let newValue = e.target.value.padStart(2, "0").slice(-2);

    if (field === "minute" && newValue > "59") {
      newValue = "59";
    } else if (field === "second" && newValue > "59") {
      newValue = "59";
    } else if (field === "frame" && newValue > "99") {
      newValue = "99";
    }

    switch (field) {
      case "hour":
        onChange(
          `${newValue}:${minute}:${second}${showFrames ? `:${frame}` : ""}`
        );
        break;
      case "minute":
        onChange(
          `${hour}:${newValue}:${second}${showFrames ? `:${frame}` : ""}`
        );
        break;
      case "second":
        onChange(
          `${hour}:${minute}:${newValue}${showFrames ? `:${frame}` : ""}`
        );
        break;
      case "frame":
        onChange(`${hour}:${minute}:${second}:${newValue}`);
        break;
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-0.5",
        variant === "default" ? "p-3" : "p-1",
        "bg-ds-input-bg hover:bg-ds-input-bg-hover",
        "rounded-xl",
        "transition",
        "cursor-pointer"
      )}
    >
      <input
        type="number"
        ref={mergedHourRef}
        placeholder="hh"
        className={cn(inputCn, hourFocused && "bg-default-400")}
        value={hour}
        onChange={(e) => handleInputChange(e, "hour")}
        min={0}
        max={99}
      />
      <span>:</span>
      <input
        type="number"
        ref={mergedMinuteRef}
        placeholder="mm"
        className={cn(inputCn, minuteFocused && "bg-default-400")}
        value={minute}
        onChange={(e) => handleInputChange(e, "minute")}
        min={0}
        maxLength={2}
        max={59}
      />
      <span>:</span>
      <input
        type="number"
        ref={mergedSecondRef}
        placeholder="ss"
        className={cn(inputCn, secondFocused && "bg-default-400")}
        value={second}
        onChange={(e) => handleInputChange(e, "second")}
        min={0}
        max={59}
      />
      {showFrames && (
        <>
          <span>:</span>
          <input
            type="number"
            ref={mergedFrameRef}
            placeholder="ff"
            className={cn(inputCn, frameFocused && "bg-default-400")}
            value={frame}
            onChange={(e) => handleInputChange(e, "frame")}
            min={0}
            max={99}
          />
        </>
      )}
    </div>
  );
};
