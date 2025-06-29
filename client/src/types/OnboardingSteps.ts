export const OnboardingSteps = {
  Username: "Username",
  Temperature: "Temperature",
  Wind: "Wind",
  DaysOfTheWeek: "Days of the Week",
} as const;

export type OnboardingSteps = keyof typeof OnboardingSteps;
