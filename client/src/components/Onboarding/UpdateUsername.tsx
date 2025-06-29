import type { OnboardingSteps } from "../../types/OnboardingSteps";

interface UpdateUsernameProps {
  setStep: React.SetStateAction<React.Dispatch<OnboardingSteps>>;
}

const UpdateUsername: React.FC<UpdateUsernameProps> = () => {
  return <div>Update Username</div>;
};

export default UpdateUsername;
