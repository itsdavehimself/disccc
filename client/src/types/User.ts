import type { Course } from "./Course";
import type { WeatherPreferences } from "./WeatherPreferences";

export type User = {
  email: string;
  firstSignIn: boolean;
  username: string;
  preferredDays: string[];
  weatherPreferences: WeatherPreferences;
  homeCourse: Course;
};
