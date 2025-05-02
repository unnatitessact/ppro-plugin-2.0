import { useMemo, useState } from "react";

import { useReviewStore } from "@/stores/review-store";
import { hexToHsva, hsvaToHex } from "@uiw/color-convert";
import { AnimatePresence, motion } from "framer-motion";

import HuePicker from "@/components/ui/color-pickers/HuePicker";
import SaturationPicker from "@/components/ui/color-pickers/SaturationPicker";
import SwatchPicker from "@/components/ui/color-pickers/SwatchPicker";
import { Input } from "@/components/ui/Input";

import { colorPickerAnimation } from "@/constants/animations";

interface ColorPickerProps {
  showColorPicker: boolean;
}

const ColorPicker = ({ showColorPicker }: ColorPickerProps) => {
  const { selectedColor, setSelectedColor } = useReviewStore();
  const [inputValue, setInputValue] = useState("");

  const hsva = useMemo(() => hexToHsva(selectedColor), [selectedColor]);

  const removeHashFromHex = (hex: string): string => {
    if (hex.startsWith("#")) {
      return hex.substring(1);
    }
    return hex;
  };

  const updateHexValues = (hex: string) => {
    setSelectedColor(hex);
    setInputValue(removeHashFromHex(selectedColor));
  };
  const updateHSVAValues = (hsva: {
    h: number;
    s: number;
    v: number;
    a: number;
  }) => {
    setSelectedColor(hsvaToHex(hsva));
    setInputValue(removeHashFromHex(hsvaToHex(hsva)));
  };

  const updateInputValues = (e: string) => {
    setInputValue(e);
    if (e?.length > 3 && e?.length < 7) {
      setSelectedColor(`#${inputValue}`);
    }
  };
  return (
    <AnimatePresence>
      {showColorPicker && (
        <motion.div
          className="absolute right-4 top-1/2 z-50 grid rounded-2xl border border-default-700 bg-default-800 p-4 dark:border-default-200 dark:bg-default-100"
          variants={colorPickerAnimation}
          initial="initial"
          animate="animate"
        >
          <div className="flex flex-col gap-4">
            <SwatchPicker hex={selectedColor} setHex={updateHexValues} />
            <SaturationPicker hsva={hsva} setHsva={updateHSVAValues} />
            <HuePicker hsva={hsva} setHsva={updateHSVAValues} />
            <div className="flex items-center justify-between gap-1">
              <Input
                value={inputValue}
                placeholder="FFFFFF"
                size="sm"
                onValueChange={(e) => {
                  updateInputValues(e);
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ColorPicker;
