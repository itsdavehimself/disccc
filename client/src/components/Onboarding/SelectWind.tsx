import { OnboardingSteps } from "../../types/OnboardingSteps";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { Slider } from "@mui/material";

interface SelectWindProps {
  setStep: React.Dispatch<React.SetStateAction<OnboardingSteps>>;
  setWind: React.Dispatch<React.SetStateAction<number>>;
}

const SelectWind: React.FC<SelectWindProps> = ({ setStep, setWind }) => {
  const [windSpeed, setWindSpeed] = useState<number>(30);

  const submitWind = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setWind(windSpeed);
    setStep(OnboardingSteps.Precipitation);
  };

  return (
    <div className="flex flex-col bg-white w-4/5 rounded-lg drop-shadow-md gap-8 py-3 px-4">
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold">Preferred Wind</h3>
        <p className="text-sm text-gray-500">
          This sets the max wind speed for rounds we show. You can always tweak
          it later.
        </p>
      </div>
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

export default SelectWind;
