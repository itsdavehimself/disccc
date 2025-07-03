export const OnboardingSteps = {
  Username: "Username",
  Temperature: "Temperature",
  Wind: "Wind",
  Precipitation: "Precipitation",
  DaysOfTheWeek: "DaysOfTheWeek",
} as const;

export type OnboardingSteps = keyof typeof OnboardingSteps;
