import { useState, useEffect } from "react";
import { useAppSelector } from "../../app/hooks";
import { OnboardingSteps } from "../../types/OnboardingSteps";
import SubmitButton from "../SubmitButton";
import ValidatedInput from "../ValidatedInput";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import OnboardingModal from "./OnboardingModal";
import DoLaterButton from "../DoLaterButton";
import { useSkipOnboarding } from "../../hooks/useSkipOnboarding";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

interface UpdateUsernameProps {
  setStep: React.Dispatch<React.SetStateAction<OnboardingSteps>>;
}

type Input = {
  username: string;
};

const UpdateUsername: React.FC<UpdateUsernameProps> = ({ setStep }) => {
  const user = useAppSelector((state) => state.user.user);
  const [usernameInput, setUsernameInput] = useState(user?.username || "");
  const [error, setError] = useState<string | null>(null);
  const { skip, error: skipError } = useSkipOnboarding();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Input>();

  useEffect(() => {
    const subscription = watch(() => {
      if (error) setError(null);
    });
    return () => subscription.unsubscribe();
  }, [watch, error]);

  const onSubmit: SubmitHandler<Input> = async (data): Promise<void> => {
    if (!errors.username) {
      setError(null);
    }

    if (user?.username === data.username) {
      setError(null);
      setStep(OnboardingSteps.HomeCourse);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/user/update-username`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username: data.username }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const message = Array.isArray(errorData)
          ? errorData.join(", ")
          : errorData?.message || "Failed to update username";
        setError(message);
        return;
      }

      setError(null);
      setStep(OnboardingSteps.HomeCourse);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Network or server error:", err.message);
        setError("Something went wrong: " + err.message);
      } else {
        console.error("Unknown error:", err);
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <OnboardingModal
      title="Pick a username"
      subtitle="This will show up in group rounds and invites"
      skip={skip}
      children={
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <div className="flex flex-col w-full">
            <ValidatedInput
              register={register("username", {
                required: "Please enter your username",
              })}
              error={errors.username}
              placeholder="Username"
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
            />
            <div className="self-start min-h-5 text-error-red text-sm">
              {error === "Invalid credentials" ? (
                <p>Something doesn't look right. Check your credentials.</p>
              ) : error || skipError ? (
                <div className="self-start text-error-red text-sm space-y-1">
                  {(error || skipError)?.split(",").map((msg, idx) => (
                    <p key={idx}>{msg.trim()}</p>
                  ))}
                </div>
              ) : errors.username?.message ? (
                <p>{errors.username.message}</p>
              ) : null}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <SubmitButton
              label={user?.username === usernameInput ? "Next" : "Update"}
            />
            <DoLaterButton action={() => setStep(OnboardingSteps.HomeCourse)} />
          </div>
        </form>
      }
    />
  );
};

export default UpdateUsername;
