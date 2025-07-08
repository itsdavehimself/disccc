import { OnboardingSteps } from "../../types/OnboardingSteps";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { Slider } from "@mui/material";
import OnboardingModal from "./OnboardingModal";
import DoLaterButton from "../DoLaterButton";
import { useSkipOnboarding } from "../../hooks/useSkipOnboarding";

interface SelectWindProps {
  setStep: React.Dispatch<React.SetStateAction<OnboardingSteps>>;
  setWind: React.Dispatch<React.SetStateAction<number>>;
}

const SelectWind: React.FC<SelectWindProps> = ({ setStep, setWind }) => {
  const [windSpeed, setWindSpeed] = useState<number>(30);
  const { skip } = useSkipOnboarding();

  const submitWind = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setWind(windSpeed);
    setStep(OnboardingSteps.Precipitation);
  };

  return (
    <OnboardingModal
      title="Preferred Wind"
      subtitle="This sets the max wind speed for rounds we show. You can always tweak
          it later."
      skip={skip}
      children={
        <form className="flex flex-col gap-8" onSubmit={(e) => submitWind(e)}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center text-sm text-gray-700">
              <p className="text-xl font-bold">{windSpeed} mph</p>
            </div>
            <Slider
              value={windSpeed}
              onChange={(_, newValue) => setWindSpeed(newValue as number)}
              valueLabelDisplay="auto"
              min={0}
              max={50}
              step={1}
              sx={{
                color: "#ff5500",
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <SubmitButton label="Update" />
            <DoLaterButton
              action={() => setStep(OnboardingSteps.Precipitation)}
            />
          </div>
        </form>
      }
    />
  );
};

export default SelectWind;
