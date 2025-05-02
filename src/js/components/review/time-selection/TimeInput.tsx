import { cn } from '@nextui-org/react';

interface TimeInputProps {
  value: string;
  setValue: (value: string) => void;
  autoFocus?: boolean;
  maxNumber: number;
  disabled?: boolean;
}

const TimeInput = ({ value, setValue, autoFocus, maxNumber, disabled }: TimeInputProps) => {
  return (
    <input
      type="number"
      value={value}
      min={0}
      max={maxNumber}
      disabled={disabled}
      onChange={(e) => {
        if (parseInt(e.target.value) > maxNumber) {
          setValue(maxNumber.toString());
        } else if (parseInt(e.target.value) < 0) {
          setValue('0');
        } else {
          setValue(e.target.value);
        }
      }}
      autoFocus={autoFocus}
      className={cn(
        disabled ? 'text-default-300' : 'text-primary-400',
        'karla bg-transparent text-center text-sm font-medium outline-none selection:bg-primary-200'
      )}
      style={{ width: `${Math.max(value.length, 1)}ch` }}
    />
  );
};

export default TimeInput;
