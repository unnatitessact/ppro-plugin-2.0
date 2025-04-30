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

import {
  HashRouter,
  Route,
  HashRouter as Router,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";

// import { Routes, Route, BrowserRouter } from "react-router-dom";

import "./main.css";
import { NextUIProvider } from "@nextui-org/react";
import { Layout } from "../components/layout/Layout";
import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WorkspacesProvider } from "../context/workspaces";
import { LibraryPage } from "@/pages/LibraryPage";
import { FolderPage } from "@/pages/FolderPage";
import { ReviewPage } from "@/pages/ReviewPage";
import LoginPage from "@/components/auth/Auth";
import useAuth from "@/hooks/useAuth";

// Create Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { auth } = useAuth();
  const location = useLocation();

  if (!auth) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
const posix = (str: string) => str.replace(/\\/g, "/");

export const cepBasename = window.cep_node
  ? `${posix(window.cep_node.global.__dirname)}/`
  : "/main/";

const Main = () => {
  const queryClient = new QueryClient();
  const posix = (str: string) => str.replace(/\\/g, "/");

  const cepBasename = window.cep_node
    ? `${posix(window.cep_node.global.__dirname)}/`
    : "/main/";

  console.log({ cepBasename });

  return (
    <div className="h-screen overflow-hidden">
      <AuthProvider>
        <ThemeProvider>
          <HashRouter>
            <NextUIProvider>
              <QueryClientProvider client={queryClient}>
                <WorkspacesProvider>
                  <Layout>
                    <Routes>
                      {/* Auth routes */}
                      <Route path="/auth/login" element={<LoginPage />} />

                      {/* Protected routes */}
                      <Route
                        path="/"
                        element={
                          <ProtectedRoute>
                            <LibraryPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/folder/:folderId"
                        element={
                          <ProtectedRoute>
                            <FolderPage />
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/asset/:id"
                        element={
                          <ProtectedRoute>
                            <ReviewPage />
                          </ProtectedRoute>
                        }
                      />

                      {/* Redirect root to library */}
                      {/* <Route path="/" element={<Navigate to="/" replace />} /> */}
                    </Routes>
                  </Layout>
                </WorkspacesProvider>
              </QueryClientProvider>
            </NextUIProvider>
          </HashRouter>
        </ThemeProvider>
      </AuthProvider>
    </div>
  );
};

export default Main;
