import { useState } from "react";
import UpdateUsername from "./UpdateUsername";
import { OnboardingSteps } from "../../types/OnboardingSteps";

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<OnboardingSteps>(OnboardingSteps.Username);

  return (
    <div>
      {step === OnboardingSteps.Username && (
        <UpdateUsername setStep={setStep} />
      )}
    </div>
  );
};

export default Onboarding;
