import React, { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { LibraryPage } from "../../pages/LibraryPage"; // Corrected path
import { ReviewPage } from "../../pages/ReviewPage"; // Corrected path
import LoginPage from "../auth/Auth"; // Corrected path
import { AuthPage } from "../../pages/AuthPage";
import { FolderPage } from "../../pages/FolderPage";

import { useParamsStateStore } from "@/stores/params-state-store";

import { PageName } from "@/stores/params-state-store";
import { useHotkeys } from "react-hotkeys-hook";

import { useSidebarStore } from "../../stores/sidebar-store";

// Define the possible page names

import useAuth from "../../hooks/useAuth";

import { useTheme } from "../../context/ThemeContext";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  // State to manage the currently active page
  // For now, defaulting to 'library'

  const { auth } = useAuth();

  const { isOpen: isSidebarOpen } = useSidebarStore();
  const { selectedAssetId, folderId } = useParamsStateStore();

  useEffect(() => {
    if (selectedAssetId) {
      // setCurrentPage("review");
    } else if (folderId) {
      // setCurrentPage("folder");
    }
  }, [selectedAssetId, folderId]);

  // Basic example of how page switching could work (e.g., triggered from Sidebar)
  // We can refine this later.
  const handleNavigate = (page: PageName) => {
    // setCurrentPage(page);
  };

  const { theme, toggleTheme } = useTheme();

  useHotkeys("ctrl+i", () => {
    toggleTheme();
  });

  return (
    <div className="flex h-full overflow-hidden bg-default-50">
      {auth.accessToken ? (
        <>
          {isSidebarOpen && <Sidebar />}
          <div className="flex-1  flex flex-col overflow-hidden">
            <main className="flex-1 overflow-x-hidden overflow-y-auto  p-4">
              {children}
            </main>
          </div>
        </>
      ) : (
        <LoginPage />
      )}
    </div>
  );
};
