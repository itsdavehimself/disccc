import { X } from "lucide-react";

interface OnboardingModalProps {
  title: string;
  subtitle: string;
  skip: () => Promise<boolean>;
  children: React.ReactNode;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({
  title,
  subtitle,
  skip,
  children,
}) => {
  return (
    <div className="flex flex-col bg-white w-4/5 rounded-lg drop-shadow-md gap-8 py-3 px-4">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <div className="flex justify-center items-center h-6 w-6">
          <X
            onClick={skip}
            className="text-gray-400 hover:cursor-pointer hover:text-text transition-all duration-200"
          />
        </div>
      </div>
      {children}
    </div>
  );
};

export default OnboardingModal;
