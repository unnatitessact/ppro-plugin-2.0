import { Focus, MinusSmall, PlusSmall } from '@tessact/icons';

import { Divider } from '@/components/ui/Divider';
import { Slider } from '@/components/ui/Slider';

interface ZoombarProps {
  zoom: number;
  setZoom: (zoom: number) => void;
}

const Zoombar = ({ zoom, setZoom }: ZoombarProps) => {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-ds-search-bg/70  p-2 backdrop-blur-xl">
      <Slider
        value={zoom}
        onChange={(value) => {
          setZoom(value as number);
        }}
        startContent={
          <MinusSmall
            onClick={() => setZoom(Math.max(zoom - 0.1, 0.5))}
            className="cursor-pointer text-ds-button-icons-button-text-default"
            size={16}
          />
        }
        endContent={
          <PlusSmall
            onClick={() => setZoom(Math.min(zoom + 0.1, 3))}
            className="cursor-pointer text-ds-button-icons-button-text-default"
            size={16}
          />
        }
        size="sm"
        classNames={{
          base: 'w-40',
          track: 'h-1 bg-ds-search-search-item-bg-hover !border-x-0',
          thumb:
            '!h-[2px] w-0.5 bg-ds-search-search-item-bg-hover border-ds-search-search-items-bg-hover rounded-sm',
          filler: 'h-1 rounded-l-sm bg-ds-text-primary before:hidden after:hidden'
        }}
        minValue={0.5}
        maxValue={3}
        step={0.5}
      />

      <div className="flex items-center gap-2">
        <Divider orientation="vertical" className="h-3 text-ds-button-icons-button-text-default" />

        <Focus size={20} className="text-ds-button-icons-button-text-default" />
      </div>
    </div>
  );
};

export default Zoombar;
