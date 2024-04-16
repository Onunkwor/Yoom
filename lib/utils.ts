import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: number | Date) {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentDate = new Date(date);
  const dayOfWeek = daysOfWeek[currentDate.getDay()];
  const month = months[currentDate.getMonth()];
  const dayOfMonth = currentDate.getDate();
  const year = currentDate.getFullYear();

  return `${dayOfWeek}, ${month} ${dayOfMonth} ${year}`;
}

export function formatTimeWithAMPM(date: number | Date) {
  const currentDate = new Date(date);
  let hours = currentDate.getHours();
  const minutes = currentDate.getMinutes().toString().padStart(2, "0"); // Get minutes and pad with leading zero if necessary
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert hours to 12-hour format
  const formattedHours = hours.toString().padStart(2, "0"); // Pad with leading zero if necessary

  return `${formattedHours}:${minutes} ${ampm}`;
}
