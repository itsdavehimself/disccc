import { useAppDispatch } from "../../app/hooks";
import DayButton from "../DayButton";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { updateFirstSignIn } from "../../app/slices/userSlice";
import OnboardingModal from "./OnboardingModal";
import DoLaterButton from "../DoLaterButton";
import { useSkipOnboarding } from "../../hooks/useSkipOnboarding";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const SelectDays: React.FC = () => {
  const days: { day: number; label: string }[] = [
    { day: 0, label: "Sun" },
    { day: 1, label: "Mon" },
    { day: 2, label: "Tue" },
    { day: 3, label: "Wed" },
    { day: 4, label: "Thu" },
    { day: 5, label: "Fri" },
    { day: 6, label: "Sat" },
  ];
  const [selectedDays, setSelectedDays] = useState<number[]>([
    0, 1, 2, 3, 4, 5, 6,
  ]);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const { skip, error: skipError } = useSkipOnboarding();

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/api/user/day-preferences`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ days: selectedDays }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const message = Array.isArray(errorData)
          ? errorData.join(", ")
          : errorData?.message || "Failed to update days of the week";
        setError(message);
        return;
      }

      dispatch(updateFirstSignIn());
      setError(null);
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
      title="What days can you play?"
      subtitle="We'll only show rounds on these days. You can always adjust them
          later."
      skip={skip}
      children={
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center text-sm text-gray-700 gap-2">
              {days.map((d) => (
                <DayButton
                  key={d.day}
                  label={d.label}
                  data={d.day}
                  onClick={setSelectedDays}
                  selectedDays={selectedDays}
                />
              ))}
            </div>
          </div>
          <div className="self-start min-h-5 text-error-red text-sm">
            {(error || skipError) && (
              <div className="self-start text-error-red text-sm space-y-1">
                {(error || skipError)?.split(",").map((msg, idx) => (
                  <p key={idx}>{msg.trim()}</p>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <SubmitButton label="Update" />
            <DoLaterButton action={skip} />
          </div>
        </form>
      }
    />
  );
};

export default SelectDays;
