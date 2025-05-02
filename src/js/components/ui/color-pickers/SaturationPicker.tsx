import Saturation from '@uiw/react-color-saturation';

interface SaturationPickerProps {
  hsva: { h: number; s: number; v: number; a: number };
  setHsva: (hsva: { h: number; s: number; v: number; a: number }) => void;
}

const SaturationPicker = ({ hsva, setHsva }: SaturationPickerProps) => {
  return (
    <div className="flex">
      <Saturation
        hsva={hsva}
        onChange={(newColor) => {
          setHsva({ ...hsva, ...newColor, a: hsva.a });
        }}
        style={{
          borderRadius: 8,
          width: '200px',
          height: '200px'
        }}
      />
    </div>
  );
};

export default SaturationPicker;
