import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

// 1. Define the type for the auth state
interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: any; // Replace 'any' with a specific user type if you have one
}

// 2. Define the type for the context value
interface AuthContextType {
  auth: AuthState;
  setAuth: Dispatch<SetStateAction<AuthState>>;
}

// 3. Create context with the defined type or undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // 4. Initialize state with the correct type and read from localStorage
  const [auth, setAuth] = useState<AuthState>(() => {
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    const refreshToken = localStorage.getItem("REFRESH_TOKEN");
    const userString = localStorage.getItem("USER");
    let user = null;
    try {
      user = userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem("USER"); // Clear invalid entry
    }
    return { accessToken, refreshToken, user };
  });

  console.log({
    authInAuthcontext: auth,
  });

  // Effect to sync auth state changes TO localStorage
  useEffect(() => {
    // console.log("AuthContext: Syncing state to localStorage", auth); // Debug log
    if (auth.accessToken) {
      localStorage.setItem("ACCESS_TOKEN", auth.accessToken);
    } else {
      localStorage.removeItem("ACCESS_TOKEN");
    }
    if (auth.refreshToken) {
      localStorage.setItem("REFRESH_TOKEN", auth.refreshToken);
    } else {
      localStorage.removeItem("REFRESH_TOKEN");
    }
    if (auth.user) {
      try {
        localStorage.setItem("USER", JSON.stringify(auth.user));
      } catch (error) {
        console.error("Failed to stringify user for localStorage", error);
      }
    } else {
      localStorage.removeItem("USER");
    }
  }, [auth]);

  // 5. Effect to listen for external changes FROM localStorage (e.g., via axios interceptor)
  useEffect(() => {
    const handleTokensUpdated = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log(
        "AuthContext: 'tokens-updated' event received",
        customEvent.detail
      );
      setAuth((prevAuth) => ({
        ...prevAuth,
        accessToken: customEvent.detail.accessToken ?? prevAuth.accessToken,
        refreshToken: customEvent.detail.refreshToken ?? prevAuth.refreshToken, // Update refresh token if provided by event
      }));
    };

    const handleAuthCleared = () => {
      console.log("AuthContext: 'auth-cleared' event received");
      setAuth({ accessToken: null, refreshToken: null, user: null });
    };

    // Add event listeners
    window.addEventListener("tokens-updated", handleTokensUpdated);
    window.addEventListener("auth-cleared", handleAuthCleared);

    // Cleanup function to remove listeners on component unmount
    return () => {
      window.removeEventListener("tokens-updated", handleTokensUpdated);
      window.removeEventListener("auth-cleared", handleAuthCleared);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  // Provide the context value
  const contextValue: AuthContextType = { auth, setAuth };

  console.log("AuthContext: contextValue", contextValue);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
// Export the type for use in hooks/components
export type { AuthContextType, AuthState };
