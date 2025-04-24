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
import { Layout } from "../components/layout/Layout";
import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WorkspacesProvider } from "../context/workspaces";

const Main = () => {
  const queryClient = new QueryClient();
  return (
    <AuthProvider>
      <ThemeProvider>
        <NextUIProvider>
          <WorkspacesProvider>
            <QueryClientProvider client={queryClient}>
              <Layout />
            </QueryClientProvider>
          </WorkspacesProvider>
        </NextUIProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default Main;
