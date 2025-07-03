import { useState } from "react"; // you forgot this!
import { OnboardingSteps } from "../../types/OnboardingSteps";
import Slider from "@mui/material/Slider";
import SubmitButton from "../SubmitButton";

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
  const [tempRange, setTempRange] = useState<[number, number]>([45, 90]);

  const submitTemperature = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setTemperature({ minTempF: tempRange[0], maxTempF: tempRange[1] });
    setStep(OnboardingSteps.Wind);
  };

  return (
    <div className="flex flex-col bg-white w-4/5 rounded-lg drop-shadow-md gap-8 py-3 px-4">
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold">Preferred Temps</h3>
        <p className="text-sm text-gray-500">
          We'll only show rounds in this range. You can always tweak it later.
        </p>
      </div>
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

export default SelectTemperature;
