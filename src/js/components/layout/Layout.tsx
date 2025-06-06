import React, { useState } from "react";
import { Navbar } from "../layout/Navbar";
import { Sidebar } from "./Sidebar";
import { LibraryPage } from "../../pages/LibraryPage"; // Corrected path
import { ReviewPage } from "../../pages/ReviewPage"; // Corrected path
import LoginPage from "../auth/Auth"; // Corrected path
import { AuthPage } from "../../pages/AuthPage";

import { useHotkeys } from "react-hotkeys-hook";

import { useSidebarStore } from "../../stores/sidebar-store";

// Define the possible page names
type PageName = "library" | "review" | "auth";

import useAuth from "../../hooks/useAuth";

import { useTheme } from "../../context/ThemeContext";

export const Layout = () => {
  // State to manage the currently active page
  // For now, defaulting to 'library'
  const [currentPage, setCurrentPage] = useState<PageName>("library");

  const { auth } = useAuth();

  const { isOpen: isSidebarOpen } = useSidebarStore();

  const renderPage = () => {
    switch (currentPage) {
      case "library":
        return <LibraryPage />;
      case "review":
        return <ReviewPage />;
      case "auth":
        return <AuthPage />;
      default:
        return <LibraryPage />; // Default to Library page
    }
  };

  // Basic example of how page switching could work (e.g., triggered from Sidebar)
  // We can refine this later.
  const handleNavigate = (page: PageName) => {
    setCurrentPage(page);
  };

  const { theme, toggleTheme } = useTheme();

  useHotkeys("ctrl+i", () => {
    toggleTheme();
  });

  console.log("isSidebarOpen", isSidebarOpen);
  return (
    <div className="flex h-screen bg-default-50">
      {auth.accessToken ? (
        <>
          {isSidebarOpen && <Sidebar />}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar />
            <main className="flex-1 overflow-x-hidden overflow-y-auto  p-4">
              {renderPage()}
            </main>
          </div>
        </>
      ) : (
        <LoginPage />
      )}
    </div>
  );
};
