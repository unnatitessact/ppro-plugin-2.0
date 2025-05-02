import Hue from '@uiw/react-color-hue';

interface HuePickerProps {
  hsva: { h: number; s: number; v: number; a: number };
  setHsva: (hsva: { h: number; s: number; v: number; a: number }) => void;
}

interface PointerProps {
  left: string;
}

const Pointer = ({ left }: PointerProps) => {
  return (
    <div
      className="absolute"
      style={{
        left: left <= '94%' ? `calc(${left})` : '94%'
      }}
    >
      <div className="h-3 w-3 rounded-full border-2 border-white"></div>
    </div>
  );
};

const HuePicker = ({ hsva, setHsva }: HuePickerProps) => {
  return (
    <div className="flex overflow-hidden rounded-md">
      <Hue
        hue={hsva.h}
        onChange={(newHue) => {
          setHsva({ ...hsva, ...newHue });
        }}
        style={{
          width: '100%',
          height: 12
        }}
        pointer={({ left }) => <Pointer left={left || '0%'} />}
        pointerProps={{
          style: {
            height: 12,
            width: 12
          }
        }}
      />
    </div>
  );
};

export default HuePicker;
