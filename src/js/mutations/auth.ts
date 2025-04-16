import { api } from "../lib/axios";

// Define a type for the user data returned by /users/me/
// Replace 'any' with a more specific interface based on your actual API response
interface UserProfile {
  id: string | number;
  email: string;
  // Add other relevant user fields: name, organization, etc.
  [key: string]: any; // Allow for other properties
}

// Define a type for the token response
interface TokenResponse {
  access: string;
  refresh: string;
}

// Define the structure of the data returned by the login function
interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
}

export const loginWithEmailPassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<LoginResult> => {
  console.log("Attempting login for:", email);

  try {
    // Step 1: Get access and refresh tokens
    console.log("Requesting tokens...");
    const tokenResponse = await api.post<TokenResponse>("/auth/token/", {
      email: email,
      password: password,
    });

    console.log("Token response:", tokenResponse);

    const { access: accessToken, refresh: refreshToken } = tokenResponse.data;
    console.log("Tokens received.");

    if (!accessToken) {
      throw new Error("Access token not received from /auth/token/");
    }

    // Step 2: Get the user data using the new access token
    console.log("Fetching user profile...");
    // Important: The user endpoint /api/v1/users/me/ is based on your reference.
    // Adjust this URL if your actual user endpoint is different.
    const userResponse = await api.get<UserProfile>("/api/v1/users/me/", {
      headers: {
        // The request interceptor in axios.ts might already add this,
        // but setting it explicitly ensures it uses the *new* token immediately.
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const user = userResponse.data;
    console.log("User profile fetched:", user);

    // Step 3: Return the combined authentication data
    const loginResult: LoginResult = {
      accessToken,
      refreshToken,
      user,
    };

    console.log({
      loginResult,
    });

    return loginResult;
  } catch (error: any) {
    console.error("Login failed:", error.response?.data || error.message);
    // Re-throw the error so the calling component can handle it (e.g., show an error message)
    throw error;
  }
};

// You can add other auth mutations here later, like loginWithOTP, logout, etc.
// export const loginWithOTP = () => {};
// export const logoutUser = async () => { ... };
