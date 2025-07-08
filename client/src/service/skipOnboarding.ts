const apiUrl = import.meta.env.VITE_API_BASE_URL;

export const skipOnboarding = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const response = await fetch(`${apiUrl}/api/user/first-sign-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      const message = Array.isArray(errorData)
        ? errorData.join(", ")
        : errorData?.message || "Failed to skip onboarding";
      return { success: false, error: message };
    }

    return { success: true };
  } catch (err) {
    if (err instanceof Error) {
      console.error("Network or server error:", err.message);
      return { success: false, error: "Something went wrong: " + err.message };
    } else {
      return { success: false, error: "An unknown error occurred." };
    }
  }
};
