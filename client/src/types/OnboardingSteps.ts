export const OnboardingSteps = {
  Username: "Username",
  HomeCourse: "HomeCourse",
  Temperature: "Temperature",
  Wind: "Wind",
  Precipitation: "Precipitation",
  DaysOfTheWeek: "DaysOfTheWeek",
} as const;

export type OnboardingSteps = keyof typeof OnboardingSteps;
