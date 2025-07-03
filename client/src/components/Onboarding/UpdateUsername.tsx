import { useState, useEffect } from "react";
import { useAppSelector } from "../../app/hooks";
import { OnboardingSteps } from "../../types/OnboardingSteps";
import SubmitButton from "../SubmitButton";
import ValidatedInput from "../ValidatedInput";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";

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
      setStep(OnboardingSteps.Temperature);
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
      setStep(OnboardingSteps.Temperature);
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
    <div className="flex flex-col bg-white w-4/5 rounded-lg drop-shadow-md gap-8 py-3 px-4">
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold">Pick a username</h3>
        <p className="text-sm text-gray-500">
          This will show up in group rounds and invites.
        </p>
      </div>
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
            ) : error ? (
              <div className="self-start text-error-red text-sm space-y-1">
                {error.split(",").map((msg, idx) => (
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
          <button
            type="button"
            className="text-sm py-1 px-3 hover:cursor-pointer"
          >
            I'll do it later
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateUsername;
