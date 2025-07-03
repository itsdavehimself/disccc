import type React from "react";
import SelectTemperature from "./SelectTemperature";
import { OnboardingSteps } from "../../types/OnboardingSteps";
import { useState } from "react";
import SelectWind from "./SelectWind";
import SelectPrecipitation from "./SelectPrecipitation";

interface WeatherSettingsProps {
  step: OnboardingSteps;
  setStep: React.Dispatch<React.SetStateAction<OnboardingSteps>>;
}

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const WeatherSettings: React.FC<WeatherSettingsProps> = ({ step, setStep }) => {
  const [temperature, setTemperature] = useState<{
    minTempF: number;
    maxTempF: number;
  }>({ minTempF: 0, maxTempF: 0 });
  const [wind, setWind] = useState<number>(0);
  const [precipitation, setPrecipitation] = useState<{
    allowRain: boolean;
    allowSnow: boolean;
  }>({ allowRain: false, allowSnow: false });
  const [error, setError] = useState<string | null>(null);

  const updateWeatherPreferences = async (): Promise<void> => {
    try {
      const response = await fetch(`${apiUrl}/api/user/weather-preferences`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          minTempF: temperature.minTempF,
          maxTempF: temperature.maxTempF,
          maxWindSpeedMph: wind,
          allowRain: precipitation.allowRain,
          allowSnow: precipitation.allowSnow,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        const message = Array.isArray(errorData)
          ? errorData.join(", ")
          : errorData?.message || "Failed to update weather preferences";
        setError(message);
        return;
      }

      setError(null);
      setStep(OnboardingSteps.DaysOfTheWeek);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Network or server error:", err.message);
        setError("Something went wrong: " + err.message);
      } else {
        console.error("Unknown error:", err);
        setError("An unknown error occured.");
      }
    }
  };

  return (
    <>
      {step === OnboardingSteps.Temperature && (
        <SelectTemperature setStep={setStep} setTemperature={setTemperature} />
      )}
      {step === OnboardingSteps.Wind && (
        <SelectWind setStep={setStep} setWind={setWind} />
      )}
      {step === OnboardingSteps.Precipitation && (
        <SelectPrecipitation
          precipitation={precipitation}
          setPrecipitation={setPrecipitation}
          handleSubmit={updateWeatherPreferences}
          error={error}
        />
      )}
    </>
  );
};

export default WeatherSettings;
