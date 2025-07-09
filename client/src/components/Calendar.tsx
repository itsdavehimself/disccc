import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

const Calendar: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <DayPicker showOutsideDays hideNavigation fixedWeeks navLayout="around" />
    </div>
  );
};

export default Calendar;
