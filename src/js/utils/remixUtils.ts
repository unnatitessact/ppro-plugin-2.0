import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadRadioCanada } from "@remotion/google-fonts/RadioCanada";
import { loadFont as loadYoungSerif } from "@remotion/google-fonts/YoungSerif";

import { ITitle } from "../types/remixes";

export interface ITitleProperties {
  fontFamily: string;
  fontWeight: number;
  color: string;
  textTransform: string;
  textShadow: string;
  fontSize: number;
}

const inter = loadInter();
const youngSerif = loadYoungSerif();
const radioCanada = loadRadioCanada();
const oswald = loadOswald();

export const DEFAULT_TITLE_STYLE: ITitleProperties = {
  fontFamily: inter.fontFamily,
  fontWeight: 900,
  color: "#ffffff",
  textTransform: "uppercase",
  textShadow: "0px 1px 4px rgba(0, 0, 0, 0.25)",
  fontSize: 72,
};

export const DEFAULT_TITLE_PROPERTIES: ITitle = {
  position: "center",
  properties: DEFAULT_TITLE_STYLE,
};

export const titleStyles: ITitleProperties[] = [
  {
    fontFamily: youngSerif.fontFamily,
    fontWeight: 400,
    color: "#ffffff",
    textTransform: "uppercase",
    textShadow: "0px 1px 4px rgba(0, 0, 0, 0.25)",
    fontSize: 72,
  },
  {
    fontFamily: radioCanada.fontFamily,
    fontWeight: 400,
    color: "#ffffff",
    textTransform: "none",
    textShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
    fontSize: 72,
  },
  {
    fontFamily: oswald.fontFamily,
    fontWeight: 800,
    color: "#ffffff",
    textTransform: "uppercase",
    textShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
    fontSize: 72,
  },
];

export const dimensionsToAspectRatio = (width: number, height: number) => {
  if (width === 1920 && height === 1080) {
    return "16:9";
  }
  if (width === 1080 && height === 1920) {
    return "9:16";
  }
  if (width === 1080 && height === 1080) {
    return "1:1";
  }
  if (width === 864 && height === 1080) {
    return "4:5";
  }
  return "16:9";
};

export const aspectRatioToDimensions = (aspectRatio: string) => {
  if (aspectRatio === "16:9") {
    return { width: 1920, height: 1080 };
  }
  if (aspectRatio === "9:16") {
    return { width: 1080, height: 1920 };
  }
  if (aspectRatio === "1:1") {
    return { width: 1080, height: 1080 };
  }
  if (aspectRatio === "4:5") {
    return { width: 864, height: 1080 };
  }
  return { width: 1920, height: 1080 };
};
