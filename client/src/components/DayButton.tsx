interface DayButtonProps {
  label: string;
  data: number;
  onClick: React.Dispatch<React.SetStateAction<number[]>>;
  selectedDays: number[];
}

const DayButton: React.FC<DayButtonProps> = ({
  label,
  data,
  onClick,
  selectedDays,
}) => {
  const isSelected = selectedDays.includes(data);

  return (
    <div
      onClick={() =>
        onClick((prev) =>
          prev.includes(data)
            ? prev.filter((day) => day !== data)
            : [...prev, data]
        )
      }
      className={`flex items-center justify-center h-8 w-10 font-semibold text-sm rounded-md hover:cursor-pointer transition-all duration-200 outline outline-1 ${
        isSelected
          ? "bg-muted outline-primary text-primary"
          : "bg-gray-200 outline-transparent text-gray-700"
      }`}
    >
      {label}
    </div>
  );
};

export default DayButton;
