import { useState } from "react";
import UpdateUsername from "./UpdateUsername";
import { OnboardingSteps } from "../../types/OnboardingSteps";
import WeatherSettings from "./WeatherSettings";
import SelectDays from "./SelectDays";
import HomeCourse from "./HomeCourse";

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<OnboardingSteps>(OnboardingSteps.Username);

  return (
    <div className="absolute inset-0 flex justify-center items-center h-screen w-screen bg-black/30 z-50">
      {step === OnboardingSteps.Username && (
        <UpdateUsername setStep={setStep} />
      )}
      {step === OnboardingSteps.HomeCourse && <HomeCourse setStep={setStep} />}
      {(step === OnboardingSteps.Temperature ||
        step === OnboardingSteps.Wind ||
        step === OnboardingSteps.Precipitation) && (
        <WeatherSettings step={step} setStep={setStep} />
      )}
      {step === OnboardingSteps.DaysOfTheWeek && <SelectDays />}
    </div>
  );
};

export default Onboarding;
