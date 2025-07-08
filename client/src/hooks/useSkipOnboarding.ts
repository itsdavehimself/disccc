import { useAppDispatch } from "../app/hooks";
import { updateFirstSignIn } from "../app/slices/userSlice";
import { skipOnboarding as skipOnboardingService } from "../service/skipOnboarding";
import { useState } from "react";

export const useSkipOnboarding = () => {
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);

  const skip = async () => {
    const result = await skipOnboardingService();

    if (!result.success) {
      setError(result.error || "Something went wrong");
      return false;
    }

    dispatch(updateFirstSignIn());
    setError(null);
    return true;
  };

  return { skip, error };
};
