import { Check } from "lucide-react";

interface PrecipitationButtonProps {
  label: string;
  type: "allowRain" | "allowSnow";
  allowed: boolean;
  setAllowed: React.Dispatch<
    React.SetStateAction<{ allowRain: boolean; allowSnow: boolean }>
  >;
}

const PrecipitationButton: React.FC<PrecipitationButtonProps> = ({
  label,
  type,
  allowed,
  setAllowed,
}) => {
  return (
    <button
      type="button"
      onClick={() =>
        setAllowed((prev) => ({
          ...prev,
          [type]: !prev[type as keyof typeof prev],
        }))
      }
      className={`flex justify-center items-center outline-1 outline-gray-400 text-gray-400 h-10 w-30 rounded-lg gap-2 ${
        allowed &&
        "outline-primary text-primary bg-muted font-semibold transition-all duration-200"
      } hover:cursor-pointer`}
    >
      <div
        className={`flex justify-center items-center h-4 w-4 outline-1 outline-gray-400 bg-white rounded-sm transition-all duration-200 ${
          allowed && "outline-primary"
        }`}
      >
        <Check
          size={14}
          className={`transition-all duration-200 ${
            allowed ? "text-primary opacity-100" : "text-transparent opacity-0"
          }`}
        />
      </div>
      {label}
    </button>
  );
};

export default PrecipitationButton;
