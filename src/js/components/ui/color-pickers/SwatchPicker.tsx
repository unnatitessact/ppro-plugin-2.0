import { hsvaToHex } from '@uiw/color-convert';
import Swatch from '@uiw/react-color-swatch';

interface SwatchPickerProps {
  hex: string;
  setHex: (hex: string) => void;
}

const Point = (props: { color?: string; checked?: boolean }) => {
  if (!props.checked) return null;
  return (
    <div
      style={{
        height: 30,
        width: 30,
        borderRadius: 6,
        border: `2px solid #ffff`,
        position: 'absolute'
      }}
    />
  );
};

const SwatchPicker = ({ hex, setHex }: SwatchPickerProps) => {
  return (
    <div className="flex">
      <Swatch
        colors={[
          '#C6C4C4',
          '#F06A6A',
          '#EC8E71',
          '#F1BD6C',
          '#F8DF72',
          '#B3DF97',
          '#84C9A9',
          '#4ECBC4',
          '#3A2BE9',
          '#9EE7E3',
          '#4673D2',
          '#A69FF3'
        ]}
        color={hex}
        rectProps={{
          children: <Point />,
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 30,
            width: 30,
            position: 'relative',
            borderRadius: 6,
            margin: 0
          }
        }}
        onChange={(hsvColor) => {
          setHex(hsvaToHex(hsvColor));
        }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 30px)',
          gap: '4px',
          margin: 0
        }}
      />
    </div>
  );
};

export default SwatchPicker;
