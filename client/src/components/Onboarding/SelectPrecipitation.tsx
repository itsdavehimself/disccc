import type React from "react";
import SubmitButton from "../SubmitButton";
import PrecipitationButton from "../PrecipitationButton";

interface SelectPrecipitationProps {
  precipitation: { allowRain: boolean; allowSnow: boolean };
  setPrecipitation: React.Dispatch<
    React.SetStateAction<{ allowRain: boolean; allowSnow: boolean }>
  >;
  handleSubmit: () => Promise<void>;
  error: string | null;
}

const SelectPrecipitation: React.FC<SelectPrecipitationProps> = ({
  precipitation,
  setPrecipitation,
  handleSubmit,
  error,
}) => {
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleSubmit();
  };

  return (
    <div className="flex flex-col bg-white w-4/5 rounded-lg drop-shadow-md gap-8 py-3 px-4">
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold">Rain and Snow?</h3>
        <p className="text-sm text-gray-500">
          Are you cool with playing in the rain and snow? You can always tweak
          it later.
        </p>
      </div>
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

export default SelectPrecipitation;
