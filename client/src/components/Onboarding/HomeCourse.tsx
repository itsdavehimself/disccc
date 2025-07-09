import React, { useState, useMemo, type FormEvent } from "react";
import { useSkipOnboarding } from "../../hooks/useSkipOnboarding";
import OnboardingModal from "./OnboardingModal";
import SubmitButton from "../SubmitButton";
import DoLaterButton from "../DoLaterButton";
import courses from "../../../config/courses.json";
import { Autocomplete, TextField } from "@mui/material";
import type { Course } from "../../types/Course";
import { OnboardingSteps } from "../../types/OnboardingSteps";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

interface HomeCourseProps {
  setStep: React.Dispatch<React.SetStateAction<OnboardingSteps>>;
}

const HomeCourse: React.FC<HomeCourseProps> = ({ setStep }) => {
  const { skip, error: skipError } = useSkipOnboarding();
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [selectedCourse, setselectedCourse] = useState<Course | null>(null);

  const filteredCourses = useMemo(() => {
    if (!inputValue) return courses.slice(0, 50);
    const lowerInput = inputValue.toLowerCase();
    return courses
      .filter((c) =>
        `${c.name} ${c.city} ${c.state}`.toLowerCase().includes(lowerInput)
      )
      .slice(0, 50);
  }, [inputValue]);

  const updateHomeCourse = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (selectedCourse === null) return;

    try {
      const response = await fetch(`${apiUrl}/api/user/home-course`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          city: selectedCourse.city,
          state: selectedCourse.state,
          name: selectedCourse.name,
          latitude: selectedCourse.latitude,
          longitude: selectedCourse.longitude,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        const message = Array.isArray(errorData)
          ? errorData.join(", ")
          : errorData?.message || "Failed to update home course";
        setError(message);
        return;
      }

      setError(null);
      setStep(OnboardingSteps.Temperature);
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
    <OnboardingModal
      title="What's your home course?"
      subtitle="We'll use this to determine the weather near you. You can change this later."
      skip={skip}
      children={
        <form
          onSubmit={(e) => updateHomeCourse(e)}
          className="flex flex-col gap-2"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center text-sm text-gray-700 gap-2">
              <Autocomplete
                size="small"
                options={filteredCourses}
                sx={{ width: 300 }}
                inputValue={inputValue}
                onInputChange={(_, value) => setInputValue(value)}
                renderOption={(props, option, { index }) => (
                  <li {...props} key={`${option.name}-${index}`}>
                    {option.name} - {option.city}, {option.state}
                  </li>
                )}
                getOptionLabel={(option) =>
                  `${option.name} - ${option.city}, ${option.state}`
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select your home course"
                    variant="outlined"
                  />
                )}
                onChange={(_, value) => {
                  setselectedCourse(value);
                }}
              />
            </div>
          </div>
          <div className="self-start min-h-5 text-error-red text-sm">
            {(error || skipError) && (
              <div className="self-start text-error-red text-sm space-y-1">
                {(error || skipError)?.split(",").map((msg, idx) => (
                  <p key={idx}>{msg.trim()}</p>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <SubmitButton label="Update" />
            <DoLaterButton action={skip} />
          </div>
        </form>
      }
    />
  );
};

export default HomeCourse;
