import { useEffect, useState } from "react";
import { os, path } from "../lib/cep/node";
import {
  csi,
  evalES,
  evalFile,
  openLinkInBrowser,
  evalTS,
} from "../lib/utils/bolt";

import reactLogo from "../assets/react.svg";
import viteLogo from "../assets/vite.svg";
import tsLogo from "../assets/typescript.svg";
import sassLogo from "../assets/sass.svg";

import nodeJs from "../assets/node-js.svg";
import adobe from "../assets/adobe.svg";
import bolt from "../assets/bolt-cep.svg";

import "./main.css";
import { NextUIProvider } from "@nextui-org/react";
import { Button } from "../components/ui/Button";
import { Library } from "../components/library/Library";
import { Layout } from "../components/layout/Layout";
import { ThemeProvider } from "../context/ThemeContext";

const Main = () => {
  return (
    <ThemeProvider>
      <NextUIProvider>
        <Layout />
      </NextUIProvider>
    </ThemeProvider>
  );
};

export default Main;
