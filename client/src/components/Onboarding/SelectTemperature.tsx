import { useState } from "react"; // you forgot this!
import { OnboardingSteps } from "../../types/OnboardingSteps";
import Slider from "@mui/material/Slider";
import SubmitButton from "../SubmitButton";
import OnboardingModal from "./OnboardingModal";
import DoLaterButton from "../DoLaterButton";
import { useSkipOnboarding } from "../../hooks/useSkipOnboarding";

interface SelectTemperatureProps {
  setStep: React.Dispatch<React.SetStateAction<OnboardingSteps>>;
  setTemperature: React.Dispatch<
    React.SetStateAction<{ minTempF: number; maxTempF: number }>
  >;
}

const SelectTemperature: React.FC<SelectTemperatureProps> = ({
  setStep,
  setTemperature,
}) => {
  const [tempRange, setTempRange] = useState<[number, number]>([32, 95]);
  const { skip } = useSkipOnboarding();

  const submitTemperature = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setTemperature({ minTempF: tempRange[0], maxTempF: tempRange[1] });
    setStep(OnboardingSteps.Wind);
  };

  return (
    <OnboardingModal
      title="Preferred Temps"
      subtitle="We'll only show rounds in this range. You can always tweak this later."
      skip={skip}
      children={
        <form
          className="flex flex-col gap-8"
          onSubmit={(e) => submitTemperature(e)}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center text-sm text-gray-700">
              <p className="text-xl font-bold">
                {tempRange[0]}°F – {tempRange[1]}°F
              </p>
            </div>
            <Slider
              value={tempRange}
              onChange={(_, newValue) =>
                setTempRange(newValue as [number, number])
              }
              valueLabelDisplay="auto"
              min={15}
              max={105}
              step={1}
              sx={{
                color: "#ff5500",
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <SubmitButton label="Update" />
            <DoLaterButton action={() => setStep(OnboardingSteps.Wind)} />
          </div>
        </form>
      }
    />
  );
};

export default SelectTemperature;
