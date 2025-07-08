import type React from "react";
import SubmitButton from "../SubmitButton";
import PrecipitationButton from "../PrecipitationButton";
import { OnboardingSteps } from "../../types/OnboardingSteps";
import OnboardingModal from "./OnboardingModal";
import DoLaterButton from "../DoLaterButton";
import { useSkipOnboarding } from "../../hooks/useSkipOnboarding";

interface SelectPrecipitationProps {
  precipitation: { allowRain: boolean; allowSnow: boolean };
  setPrecipitation: React.Dispatch<
    React.SetStateAction<{ allowRain: boolean; allowSnow: boolean }>
  >;
  handleSubmit: () => Promise<void>;
  setStep: React.Dispatch<React.SetStateAction<OnboardingSteps>>;
  error: string | null;
}

const SelectPrecipitation: React.FC<SelectPrecipitationProps> = ({
  precipitation,
  setPrecipitation,
  handleSubmit,
  setStep,
  error,
}) => {
  const { skip } = useSkipOnboarding();
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleSubmit();
  };
  return (
    <OnboardingModal
      title="Rain and Snow?"
      subtitle="Are you cool with playing in the rain and snow? You can always tweak
          this later."
      skip={skip}
      children={
        <form onSubmit={(e) => onSubmit(e)} className="flex flex-col gap-2">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center text-sm gap-8">
              <PrecipitationButton
                label="Allow Rain"
                type="allowRain"
                allowed={precipitation.allowRain}
                setAllowed={setPrecipitation}
              />
              <PrecipitationButton
                label="Allow Snow"
                type="allowSnow"
                allowed={precipitation.allowSnow}
                setAllowed={setPrecipitation}
              />
            </div>
          </div>
          <div className="self-start min-h-5 text-error-red text-sm">
            {error === "Invalid credentials" ? (
              <p>Something doesn't look right. Check your credentials.</p>
            ) : error ? (
              <div className="self-start text-error-red text-sm space-y-1">
                {error.split(",").map((msg, idx) => (
                  <p key={idx}>{msg.trim()}</p>
                ))}
              </div>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <SubmitButton label="Update" />
            <DoLaterButton
              action={() => setStep(OnboardingSteps.DaysOfTheWeek)}
            />
          </div>
        </form>
      }
    />
  );
};

export default SelectPrecipitation;
